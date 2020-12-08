import fs, { PathLike } from "fs";
import path from "path";

const SESSIONS_PATH = path.join(__dirname, "../../src/content/sessions");
const PEOPLE_PATH = path.join(__dirname, "../../src/content/people");
const PLACES_PATH = path.join(__dirname, "../../src/content/places");
const LORE_PATH = path.join(__dirname, "../../src/content/lore");

export enum DocType {
  SESSION,
  PERSON,
  PLACE,
  LORE,
}

interface Bookmark {
  path: PathLike;
  page: number;
}

type SortCallback = (a: string, b: string) => number;

let bookmark: Bookmark | null;

const markdown = (data: string): string => `\`\`\`md
${data}
\`\`\``;

const help = () =>
  markdown(`
USAGE: !sb [CATEGORY] QUERY
`);

const read = (path: PathLike, page: number = 0): string => {
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
};

const more = (): string => {
  if (bookmark) {
    return read(bookmark.path, bookmark.page);
  } else {
    return markdown("Nothing left to read.");
  }
};

const list = (docPath: string, sorter: SortCallback): string => {
  try {
    const documents = fs
      .readdirSync(docPath)
      .sort(sorter)
      .map((docName, i) => `${i + 1}. ${docName}`);
    return markdown(documents.toString().replace(/\.md/g, "").replace(/,/g, "\n"));
  } catch (e) {
    return markdown(e.message);
  }
};

const show = (name: string, docPath: string): string => {
  try {
    const documents = fs.readdirSync(docPath);
    const match = documents.filter((docName) =>
      docName.toLowerCase().includes(name)
    );
    if (!match.length) return markdown(`Could not find **${name}**`);
    return read(path.join(docPath, match[0]));
  } catch (e) {
    return markdown(e.message);
  }
};

const sessions = (numOrDate?: string): string => {
  const sorter: SortCallback = (a, b) =>
    new Date(a.split(".")[0]).getTime() - new Date(b.split(".")[0]).getTime();

  if (!numOrDate) return list(SESSIONS_PATH, sorter);

  try {
    const num = numOrDate ? parseInt(numOrDate) - 1 : 0;
    const sessions = fs.readdirSync(SESSIONS_PATH).sort(sorter);
    const session = sessions[num ?? sessions.length - 1] ?? "";
    return read(path.join(SESSIONS_PATH, session));
  } catch (e) {
    return markdown(e.message);
  }
};

const lastSession = () => {
  try {
    const last = fs
      .readdirSync(SESSIONS_PATH)
      .sort(
        (a, b) =>
          new Date(b.split(".")[0]).getTime() -
          new Date(a.split(".")[0]).getTime()
      )[0];
    return read(path.join(SESSIONS_PATH, last));
  } catch (e) {
    return markdown(e.message);
  }
};

const people = (name?: string): string => {
  if (name) return show(name, PEOPLE_PATH);

  const sorter: SortCallback = (a, b) => a.localeCompare(b);
  return list(PEOPLE_PATH, sorter);
};

const places = (name?: string): string => {
  if (name) return show(name, PLACES_PATH);

  const sorter: SortCallback = (a, b) => a.localeCompare(b);
  return list(PLACES_PATH, sorter);
};

const lore = (name?: string): string => {
  if (name) return show(name, LORE_PATH);

  const sorter: SortCallback = (a, b) => a.localeCompare(b);
  return list(LORE_PATH, sorter);
};

export default { help, more, sessions, lastSession, people, places, lore };
