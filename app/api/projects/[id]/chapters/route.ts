import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/projects/[id]/chapters - Get all chapters for a project
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id: projectId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const chapters = await prisma.chapter.findMany({
      where: { projectId },
      orderBy: { orderIndex: "asc" },
      select: {
        id: true,
        title: true,
        wordCount: true,
        orderIndex: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      data: chapters,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/chapters - Create a new chapter
const createChapterSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id: projectId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createChapterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Get the next orderIndex
    const lastChapter = await prisma.chapter.findFirst({
      where: { projectId },
      orderBy: { orderIndex: "desc" },
    });

    const nextOrderIndex = (lastChapter?.orderIndex ?? -1) + 1;

    const chapter = await prisma.chapter.create({
      data: {
        projectId,
        title: parsed.data.title,
        content: parsed.data.content || "",
        wordCount: 0,
        orderIndex: nextOrderIndex,
      },
    });

    return NextResponse.json(
      {
        data: chapter,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
