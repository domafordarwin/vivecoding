import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";



// Helper to count words from HTML content
function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

const autosaveSchema = z.object({
  content: z.string(),
});

// POST /api/chapters/[id]/autosave - Auto-save chapter content
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await context.params;

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
    const parsed = autosaveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid content" },
        { status: 400 }
      );
    }

    const { content } = parsed.data;

    // Skip if content hasn't changed
    if (content === chapter.content) {
      return NextResponse.json({
        success: true,
        savedAt: chapter.updatedAt.toISOString(),
        wordCount: chapter.wordCount,
        skipped: true,
      });
    }

    const wordCount = countWords(content);

    // Update chapter and project word count
    const updatedChapter = await prisma.$transaction(async (tx) => {
      const updated = await tx.chapter.update({
        where: { id },
        data: {
          content,
          wordCount,
        },
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
      success: true,
      savedAt: updatedChapter.updatedAt.toISOString(),
      wordCount: updatedChapter.wordCount,
    });
  } catch (error) {
    console.error("Error autosaving chapter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
