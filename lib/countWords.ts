/**
 * Counts words in HTML content by stripping tags and splitting on whitespace.
 *
 * @param html - HTML string content
 * @returns Number of words
 *
 * @example
 * ```ts
 * countWords('<p>Hello world</p>'); // 2
 * countWords('<p>Hello <strong>world</strong></p>'); // 2
 * ```
 */
export function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

/**
 * Counts characters in HTML content (excluding tags).
 *
 * @param html - HTML string content
 * @returns Number of characters
 */
export function countCharacters(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  return text.length;
}

/**
 * Estimates reading time based on word count.
 * Uses average reading speed of 200 words per minute.
 *
 * @param wordCount - Number of words
 * @returns Estimated reading time in minutes
 */
export function estimateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
