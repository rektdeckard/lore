import fs, { PathLike } from "fs";
import path from "path";
import { Paths } from "../constants";
import { ContentType } from "../parser";
import { Bookmark, SortCallback } from "./types";

let bookmark: Bookmark | null;

function markdown(data: string): string {
  return `\`\`\`md\n${data}\`\`\``;
}

function unmark(markdown: string): string {
  return markdown.replace(/```(md)?\s?(.*)```/gis, "$2");
}

function read(path: PathLike, page: number = 0): string {
  const file = fs.readFileSync(path).toString("utf-8");
  const thisPage = page * 1000;
  const nextPage = thisPage + 1000;
  const hasNextPage = file.length >= nextPage;

  if (hasNextPage) {
    bookmark = { path, page: page + 1 };
    return markdown(file.slice(thisPage, nextPage) + "...");
  } else {
    bookmark = null;
    return markdown(file.slice(thisPage));
  }
}

function list(
  docPath: string,
  sorter: SortCallback,
  heading: string = ""
): string {
  try {
    const documents = fs
      .readdirSync(docPath)
      .sort(sorter)
      .map((docName, i) => `${i + 1}. ${docName}`);
    return markdown(
      heading + documents.toString().replace(/\.md/g, "").replace(/,/g, "\n")
    );
  } catch (e) {
    return markdown(e.message);
  }
}

function show(name: string, docPath: string): string {
  try {
    const documents = fs.readdirSync(docPath);
    const match = documents.filter((docName) =>
      docName.toLowerCase().includes(name.toLowerCase())
    );
    if (!match.length) return markdown(`Could not find **${name}**`);
    return read(path.join(docPath, match[0]));
  } catch (e) {
    return markdown(e.message);
  }
}

export function help(): string {
  return `
\`!recap\`: Show notes for the last game session.
\`!who [NAME]\`: List people in the world. With \`[NAME]\`, show info for them.
\`!what [NAME]\`: List elements of lore in the world. With \`[NAME]\`, show info for a specific one.
\`!where [NAME]\`: List places in the world. With \`[NAME]\`, show info for a specific place.
\`!when [NUMBER]\`: List game sessions by date. With \`[NUMBER]\`, show info for that session.
`;
}

export function more(): string {
  if (bookmark) {
    return read(bookmark.path, bookmark.page);
  } else {
    return markdown("Nothing left to read.");
  }
}

export function sessions(numOrDate?: string): string {
  const sorter: SortCallback = (a, b) =>
    new Date(a.split(".")[0]).getTime() - new Date(b.split(".")[0]).getTime();

  if (!numOrDate) return list(Paths.SESSIONS, sorter, "# Sessions\n\n");

  try {
    const num = numOrDate ? parseInt(numOrDate) - 1 : 0;
    const sessions = fs.readdirSync(Paths.SESSIONS).sort(sorter);
    const session = sessions[num ?? sessions.length - 1] ?? "";
    return read(path.join(Paths.SESSIONS, session));
  } catch (e) {
    return markdown(e.message);
  }
}

export function lastSession(): string {
  try {
    const last = fs
      .readdirSync(Paths.SESSIONS)
      .sort(
        (a, b) =>
          new Date(b.split(".")[0]).getTime() -
          new Date(a.split(".")[0]).getTime()
      )[0];
    return read(path.join(Paths.SESSIONS, last));
  } catch (e) {
    return markdown(e.message);
  }
}

export function people(name?: string): string {
  if (name) return show(name, Paths.PEOPLE);
  const sorter: SortCallback = (a, b) => a.localeCompare(b);
  return list(Paths.PEOPLE, sorter, "# People\n\n");
}

export function places(name?: string): string {
  if (name) return show(name, Paths.PLACES);
  const sorter: SortCallback = (a, b) => a.localeCompare(b);
  return list(Paths.PLACES, sorter, "# Places\n\n");
}

export function lore(name?: string): string {
  if (name) return show(name, Paths.LORE);
  const sorter: SortCallback = (a, b) => a.localeCompare(b);
  return list(Paths.LORE, sorter, "# Lore\n\n");
}

export function meta(name?: string): string {
  if (name) return show(name, Paths.META);
  const sorter: SortCallback = (a, b) => a.localeCompare(b);
  return list(Paths.META, sorter, "# Meta\n\n");
}

export function add(type: ContentType, args: string[]): string {
  const [name, heredoc] = args;

  try {
    const data = unmark(heredoc);
    const docPath = path.join(Paths.CONTENT, type, `${name.toLowerCase()}.md`);
    if (fs.existsSync(docPath))
      return markdown(`**${type}/${name}.md** already exists.`);
    fs.writeFileSync(docPath, data);
    return `added \`${type}/${name}.md\`:\n${markdown(data)}`;
  } catch (e) {
    return markdown(e.message);
  }
}

export function all() {
  return `\
${people()}
${places()}
${lore()}
${sessions()}
${meta()}
`;
}
