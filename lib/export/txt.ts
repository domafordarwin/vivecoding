interface Chapter {
  title: string;
  content: string | null;
  orderIndex: number;
}

interface ProjectWithChapters {
  title: string;
  description: string | null;
  genre: string | null;
  chapters: Chapter[];
}

/**
 * Strips HTML tags and converts to plain text.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Exports a project to TXT format.
 *
 * @param project - Project with chapters
 * @returns Plain text string
 */
export function exportToTXT(project: ProjectWithChapters): string {
  const lines: string[] = [];

  // Project title
  lines.push(project.title);
  lines.push("=".repeat(project.title.length));
  lines.push("");

  // Genre
  if (project.genre) {
    lines.push(`Genre: ${project.genre}`);
    lines.push("");
  }

  // Synopsis
  if (project.description) {
    lines.push("Synopsis:");
    lines.push(project.description);
    lines.push("");
  }

  lines.push("-".repeat(60));
  lines.push("");

  // Chapters (sorted by orderIndex)
  const sortedChapters = [...project.chapters].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  sortedChapters.forEach((chapter, index) => {
    // Chapter title
    lines.push(`# ${chapter.title}`);
    lines.push("");

    // Chapter content
    const plainText = stripHtml(chapter.content || "");
    if (plainText) {
      lines.push(plainText);
    } else {
      lines.push("(No content)");
    }

    // Chapter separator (except for last)
    if (index < sortedChapters.length - 1) {
      lines.push("");
      lines.push("-".repeat(60));
      lines.push("");
    }
  });

  return lines.join("\n");
}
