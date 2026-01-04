import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

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
 * Parses simple HTML to DOCX paragraphs.
 */
function parseHtmlToParagraphs(html: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  if (!html) {
    return [new Paragraph({ text: "" })];
  }

  // Split by paragraph tags
  const blocks = html.split(/<\/p>|<\/h[1-6]>|<\/li>/gi);

  blocks.forEach((block) => {
    // Skip empty blocks
    const trimmed = block.trim();
    if (!trimmed) return;

    // Check if it's a heading
    const h1Match = trimmed.match(/<h1[^>]*>(.*)/i);
    const h2Match = trimmed.match(/<h2[^>]*>(.*)/i);
    const h3Match = trimmed.match(/<h3[^>]*>(.*)/i);
    const liMatch = trimmed.match(/<li[^>]*>(.*)/i);

    let text = trimmed;
    let headingLevel: (typeof HeadingLevel)[keyof typeof HeadingLevel] | undefined;
    let isList = false;

    if (h1Match) {
      text = h1Match[1];
      headingLevel = HeadingLevel.HEADING_1;
    } else if (h2Match) {
      text = h2Match[1];
      headingLevel = HeadingLevel.HEADING_2;
    } else if (h3Match) {
      text = h3Match[1];
      headingLevel = HeadingLevel.HEADING_3;
    } else if (liMatch) {
      text = "• " + liMatch[1];
      isList = true;
    } else {
      // Remove opening p tag
      text = text.replace(/<p[^>]*>/gi, "");
    }

    // Parse inline formatting
    const runs: TextRun[] = [];
    const segments = text.split(
      /(<strong>|<\/strong>|<b>|<\/b>|<em>|<\/em>|<i>|<\/i>|<u>|<\/u>)/gi
    );

    let isBold = false;
    let isItalic = false;
    let isUnderline = false;

    segments.forEach((segment) => {
      const lowerSegment = segment.toLowerCase();
      if (lowerSegment === "<strong>" || lowerSegment === "<b>") {
        isBold = true;
      } else if (lowerSegment === "</strong>" || lowerSegment === "</b>") {
        isBold = false;
      } else if (lowerSegment === "<em>" || lowerSegment === "<i>") {
        isItalic = true;
      } else if (lowerSegment === "</em>" || lowerSegment === "</i>") {
        isItalic = false;
      } else if (lowerSegment === "<u>") {
        isUnderline = true;
      } else if (lowerSegment === "</u>") {
        isUnderline = false;
      } else if (segment) {
        // Strip any remaining tags
        const cleanText = segment.replace(/<[^>]*>/g, "");
        if (cleanText) {
          runs.push(
            new TextRun({
              text: cleanText,
              bold: isBold,
              italics: isItalic,
              underline: isUnderline ? {} : undefined,
            })
          );
        }
      }
    });

    if (runs.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: runs,
          heading: headingLevel,
          spacing: { after: 200 },
        })
      );
    }
  });

  return paragraphs.length > 0 ? paragraphs : [new Paragraph({ text: "" })];
}

/**
 * Exports a project to DOCX format.
 *
 * @param project - Project with chapters
 * @returns DOCX buffer
 */
export async function exportToDOCX(
  project: ProjectWithChapters
): Promise<Buffer> {
  const sortedChapters = [...project.chapters].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  const titlePage: Paragraph[] = [
    // Title
    new Paragraph({
      text: project.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
  ];

  // Genre
  if (project.genre) {
    titlePage.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Genre: ${project.genre}`,
            italics: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Synopsis
  if (project.description) {
    titlePage.push(
      new Paragraph({
        text: "Synopsis",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: project.description,
        spacing: { after: 400 },
      })
    );
  }

  // Page break before chapters
  titlePage.push(
    new Paragraph({
      text: "",
      pageBreakBefore: true,
    })
  );

  // Chapters
  const chapterParagraphs: Paragraph[] = [];
  sortedChapters.forEach((chapter, index) => {
    // Chapter title
    chapterParagraphs.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: index > 0 ? 400 : 0, after: 300 },
        pageBreakBefore: index > 0,
      })
    );

    // Chapter content
    const contentParagraphs = parseHtmlToParagraphs(chapter.content || "");
    chapterParagraphs.push(...contentParagraphs);
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [...titlePage, ...chapterParagraphs],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
