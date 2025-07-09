export function calculateReadTime(content: string) {
  // Remove code blocks and frontmatter for accurate word count
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, "") // Remove frontmatter
    .replace(/\n\s*\n/g, "\n") // Remove empty lines
    .replace(/^\s*[\r\n]/gm, "") // Remove blank lines
    .trim();

  const words = cleanContent.split(/\s+/).length;

  const wordsPerMinute = 150; // 150 wpm reading speed
  const minutes = Math.ceil(words / wordsPerMinute);

  // Minimum 1 minute
  return Math.max(minutes, 1);
}
