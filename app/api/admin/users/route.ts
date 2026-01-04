import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// 관리자 권한 확인 헬퍼
async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "로그인이 필요합니다", status: 401 };
  }
  if (session.user.role !== "admin") {
    return { error: "관리자 권한이 필요합니다", status: 403 };
  }
  return { session };
}

// GET: 사용자 목록 조회
export async function GET(req: NextRequest) {
  const adminCheck = await requireAdmin();
  if ("error" in adminCheck) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { username: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { projects: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST: 새 사용자 생성
const createUserSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  username: z.string().min(2, "사용자명은 최소 2자 이상이어야 합니다"),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
  role: z.enum(["user", "admin"]).default("user"),
});

export async function POST(req: NextRequest) {
  const adminCheck = await requireAdmin();
  if ("error" in adminCheck) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, username, password, role } = parsed.data;

    // Check existing user
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "이미 존재하는 이메일 또는 사용자명입니다" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        role,
        provider: "email",
        mustChangePassword: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "사용자 생성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
