export function mark(data: string): string {
  return `\`\`\`md\n${data}\`\`\``;
}

export function unmark(markdown: string): string {
  return markdown.replace(/```(md)?\s?(.*)```/gis, "$2");
}

