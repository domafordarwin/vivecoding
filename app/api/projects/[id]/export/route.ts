import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { exportToTXT } from "@/lib/export/txt";
import { exportToDOCX } from "@/lib/export/docx";

export const runtime = "nodejs";

const exportSchema = z.object({
  format: z.enum(["txt", "docx"]),
});

const idSchema = z.string().uuid();

function sanitizeFilenameBase(input: string): string {
  const cleaned = input
    .replace(/[<>:"/\\|?*\x00-\x1F\x7F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "");

  return cleaned.slice(0, 100) || "project";
}

function toAsciiFilename(input: string): string {
  const cleaned = input
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "");

  return cleaned || "project";
}

function buildContentDisposition(filename: string, asciiFallback: string): string {
  const safeAscii = asciiFallback.replace(/"/g, "");
  return `attachment; filename="${safeAscii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

// POST /api/projects/[id]/export - Export project
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

    const idParsed = idSchema.safeParse(id);
    if (!idParsed.success) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = exportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid format. Use 'txt' or 'docx'" },
        { status: 400 }
      );
    }

    const { format } = parsed.data;

    // Fetch project with chapters
    const projectId = idParsed.data;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        chapters: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate filename (server is source of truth)
    const base = sanitizeFilenameBase(project.title);
    const filename = `${base}.${format}`;

    const asciiFilename = `${toAsciiFilename(base)}.${format}`;

    const commonHeaders = {
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      "Content-Disposition": buildContentDisposition(filename, asciiFilename),
    };

    if (format === "txt") {
      const content = exportToTXT(project);

      return new NextResponse(content, {
        headers: {
          ...commonHeaders,
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    if (format === "docx") {
      const buffer = await exportToDOCX(project);

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          ...commonHeaders,
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (error) {
    console.error("Error exporting project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
