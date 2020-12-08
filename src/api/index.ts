import fs, { PathLike } from "fs";
import path from "path";

const SESSIONS_PATH = path.join(__dirname, "../../src/content/sessions");
const PEOPLE_PATH = path.join(__dirname, "../../src/content/people");
const PLACES_PATH = path.join(__dirname, "../../src/content/places");

interface Bookmark {
  path: PathLike;
  page: number;
}

let bookmark: Bookmark | null;

const backtickify = (data: string): string => `\`\`\`md
${data}
\`\`\``;

const help = () =>
  backtickify(`
USAGE: !sb [CATEGORY] QUERY
`);

const read = (path: PathLike, page: number = 0): string => {
  const file = fs.readFileSync(path).toString("utf-8");
  const thisPage = page * 1000;
  const nextPage = thisPage + 1000;
  const hasNextPage = file.length >= nextPage;

  if (hasNextPage) {
    bookmark = { path, page: page + 1 };
    return backtickify(file.slice(thisPage, nextPage) + "...");
  } else {
    bookmark = null;
    return backtickify(file.slice(thisPage));
  }
};

const more = (): string => {
  if (bookmark) {
    return read(bookmark.path, bookmark.page);
  } else {
    return backtickify("Nothing left to continue.");
  }
};

// const list = (path: pathLike): string => {

// }

const session = (numOrDate?: string): string => {
  try {
    const num = numOrDate ? parseInt(numOrDate) - 1 : 0;
    const sessions = fs
      .readdirSync(SESSIONS_PATH)
      .sort(
        (a, b) =>
          new Date(a.split(".")[0]).getTime() -
          new Date(b.split(".")[0]).getTime()
      );
      const session = sessions[num || sessions.length - 1] ?? "";
      console.log(sessions, num, session);
    return read(path.join(SESSIONS_PATH, session));
  } catch (e) {
    return backtickify(e.message);
  }
};

const sessions = (): string => {
  try {
    const sessions = fs.readdirSync(SESSIONS_PATH);
    const sorted = sessions
      .sort(
        (a, b) =>
          new Date(a.split(".")[0]).getTime() -
          new Date(b.split(".")[0]).getTime()
      )
      .map((s, i) => `${i + 1}. ${s}`);
    return backtickify(sorted.toString().replace(/,/g, "\n"));
  } catch (e) {
    return backtickify(e.message);
  }
};

const person = (name: string): string => {
  try {
    const people = fs.readdirSync(PEOPLE_PATH);
    const match = people.filter((person) =>
      person.toLowerCase().includes(name)
    );
    if (!match.length) {
      return backtickify(`Could not find **${name}**`);
    }

    return read(path.join(PEOPLE_PATH, match[0]));
  } catch (e) {
    return backtickify(e.message);
  }
};

const people = (): string => {
  try {
    const sessions = fs.readdirSync(PEOPLE_PATH);
    const sorted = sessions
      .sort((a, b) => a.localeCompare(b))
      .map((s, i) => `${i + 1}. ${s}`);
    return backtickify(sorted.toString().replace(",", "\n"));
  } catch (e) {
    return backtickify(e.message);
  }
};

const place = (name: string): string => {
  try {
    const places = fs.readdirSync(PLACES_PATH);
    const match = places.filter((place) => place.toLowerCase().includes(name));
    if (!match.length) {
      return backtickify(`Could not find **${name}**`);
    }

    return read(path.join(PLACES_PATH, match[0]));
  } catch (e) {
    return backtickify(e.message);
  }
};

const places = (): string => {
  try {
    const places = fs.readdirSync(PLACES_PATH);
    const sorted = places
      .sort((a, b) => a.localeCompare(b))
      .map((s, i) => `${i + 1}. ${s}`);
    return backtickify(sorted.toString().replace(",", "\n"));
  } catch (e) {
    return backtickify(e.message);
  }
};

export default { help, more, session, sessions, person, people, place, places };
