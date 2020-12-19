export function markdown(data: string): string {
  return `\`\`\`md\n${data}\`\`\``;
}

export function unmark(markdown: string): string {
  return markdown.replace(/```(md)?\s?(.*)```/gis, "$2");
}

