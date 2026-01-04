import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// Helper to count words from HTML content
function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

// GET /api/chapters/[id] - Get single chapter
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    if (chapter.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      data: chapter,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/chapters/[id] - Update chapter
const updateChapterSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
});

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        project: {
          select: { userId: true, id: true },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    if (chapter.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateChapterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updateData: { title?: string; content?: string; wordCount?: number } =
      {};

    if (parsed.data.title !== undefined) {
      updateData.title = parsed.data.title;
    }

    if (parsed.data.content !== undefined) {
      updateData.content = parsed.data.content;
      updateData.wordCount = countWords(parsed.data.content);
    }

    // Update chapter and recalculate project word count
    const updatedChapter = await prisma.$transaction(async (tx) => {
      const updated = await tx.chapter.update({
        where: { id },
        data: updateData,
      });

      // Recalculate total word count for project
      const allChapters = await tx.chapter.findMany({
        where: { projectId: chapter.project.id },
        select: { wordCount: true },
      });

      const totalWordCount = allChapters.reduce(
        (sum, ch) => sum + ch.wordCount,
        0
      );

      await tx.project.update({
        where: { id: chapter.project.id },
        data: { wordCount: totalWordCount },
      });

      return updated;
    });

    return NextResponse.json({
      data: updatedChapter,
      success: true,
    });
  } catch (error) {
    console.error("Error updating chapter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/chapters/[id] - Delete chapter
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        project: {
          select: { userId: true, id: true },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    if (chapter.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete chapter and reorder remaining chapters
    await prisma.$transaction(async (tx) => {
      await tx.chapter.delete({
        where: { id },
      });

      // Reorder chapters after the deleted one
      await tx.chapter.updateMany({
        where: {
          projectId: chapter.project.id,
          orderIndex: { gt: chapter.orderIndex },
        },
        data: {
          orderIndex: { decrement: 1 },
        },
      });

      // Recalculate total word count
      const allChapters = await tx.chapter.findMany({
        where: { projectId: chapter.project.id },
        select: { wordCount: true },
      });

      const totalWordCount = allChapters.reduce(
        (sum, ch) => sum + ch.wordCount,
        0
      );

      await tx.project.update({
        where: { id: chapter.project.id },
        data: { wordCount: totalWordCount },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Chapter deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
