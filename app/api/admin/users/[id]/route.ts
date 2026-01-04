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

// GET: 특정 사용자 조회
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin();
  if ("error" in adminCheck) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      provider: true,
      mustChangePassword: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { projects: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "사용자를 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}

// PATCH: 사용자 정보 수정
const updateUserSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(2).optional(),
  role: z.enum(["user", "admin"]).optional(),
  password: z.string().min(8).optional(),
  mustChangePassword: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin();
  if ("error" in adminCheck) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { password, ...updateData } = parsed.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // Check for conflicts
    if (updateData.email || updateData.username) {
      const conflict = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                updateData.email ? { email: updateData.email } : {},
                updateData.username ? { username: updateData.username } : {},
              ].filter((obj) => Object.keys(obj).length > 0),
            },
          ],
        },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "이미 존재하는 이메일 또는 사용자명입니다" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const data: Record<string, unknown> = { ...updateData };
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        mustChangePassword: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "사용자 수정 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// DELETE: 사용자 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin();
  if ("error" in adminCheck) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  const { id } = await params;
  const { session } = adminCheck;

  // Prevent self-deletion
  if (session.user.id === id) {
    return NextResponse.json(
      { error: "자기 자신은 삭제할 수 없습니다" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "사용자 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
