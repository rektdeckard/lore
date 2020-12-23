import fs, { PathLike } from "fs";
import path from "path";
import { Paths } from "../constants";
import { Command } from "../parser";
import State from "./state";
import { unmark } from "../utils";
import { SortCallback } from "./types";

const PAGE_SIZE = 1024;

const alphanumericSorter: SortCallback = (a, b) => a.localeCompare(b);
const dateSorter: SortCallback = (a, b) =>
  new Date(a.split(".")[0]).getTime() - new Date(b.split(".")[0]).getTime();

function read(path: PathLike): string {
  let file: string;

  if (State.has(path)) {
    file = State.find(path)!.contents;
  } else {
    file = fs.readFileSync(path).toString("utf-8");
    State.cache({ path, contents: file });
  }
  return truncateAndBookmarkIfNeeded(file);
}

function truncateAndBookmarkIfNeeded(contents: string): string {
  if (contents.length > PAGE_SIZE) {
    const parts = contents.split("\n") || contents.split(/\s/);
    if (!parts.length) throw new Error("Could not split file!");

    let truncated = "";
    let index = 0;
    do {
      truncated += parts[index];
      index++;
    } while (truncated.length < PAGE_SIZE);

    State.setBookmark({ contents: parts.slice(index).join("\n") });
    return truncated + "\n...";
  } else {
    State.clearBookmark();
    return contents;
  }
}

function list(
  docPath: string,
  sorter: SortCallback,
  heading: string = "",
  numbered: boolean = false
): string {
  try {
    const documents = fs
      .readdirSync(docPath)
      .sort(sorter)
      .map((docName, i) => `${numbered ? `${i + 1}. ` : "- "} ${docName}`);
    return (
      heading + documents.toString().replace(/\.md/g, "").replace(/,/g, "\n")
    );
  } catch (e) {
    return e.message;
  }
}

function show(name: string, docPath: string): string {
  if (State.has(path.join(docPath, name)))
    return read(path.join(docPath, name));

  try {
    const documents = fs.readdirSync(docPath);
    const match = documents.filter((docName) =>
      docName.toLowerCase().includes(name.toLowerCase())
    );
    if (!match.length) return `Could not find **${name}**`;
    return read(path.join(docPath, match[0]));
  } catch (e) {
    return e.message;
  }
}

export function more(): string {
  const { contents, title } = State.getBookmark() || {};
  if (contents) {
    return `...\n${title ? `# ${title}\n\n` : ""}` + truncateAndBookmarkIfNeeded(contents);
  } else {
    return "Nothing left to read.";
  }
}

export function sessions(command?: Command): string {
  const numOrDate = command?.args[0];
  if (!numOrDate)
    return list(Paths.SESSIONS, dateSorter, "## Sessions\n\n", true);

  try {
    const num = numOrDate ? parseInt(numOrDate) - 1 : 0;
    const sessions = fs.readdirSync(Paths.SESSIONS).sort(dateSorter);
    const session = sessions[num ?? sessions.length - 1] ?? "";
    return read(path.join(Paths.SESSIONS, session));
  } catch (e) {
    return e.message;
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
    return e.message;
  }
}

export function people(command?: Command): string {
  const name = command?.args[0];
  if (name) return show(name, Paths.PEOPLE);
  return list(Paths.PEOPLE, alphanumericSorter, "## People\n\n");
}

export function places(command?: Command): string {
  const name = command?.args[0];
  if (name) return show(name, Paths.PLACES);
  return list(Paths.PLACES, alphanumericSorter, "## Places\n\n");
}

export function lore(command?: Command): string {
  const name = command?.args[0];
  if (name) return show(name, Paths.LORE);
  return list(Paths.LORE, alphanumericSorter, "## Lore\n\n");
}

export function meta(command?: Command): string {
  const name = command?.args[0];
  if (name) return show(name, Paths.META);
  return list(Paths.META, alphanumericSorter, "## Meta\n\n");
}

export function add(command: Command): string {
  const { type, args } = command;
  const [name, heredoc] = args;

  try {
    const data = unmark(heredoc);
    const docPath = path.join(
      Paths.CONTENT,
      type!!,
      `${name.toLowerCase()}.md`
    );
    if (fs.existsSync(docPath)) return `**${type}/${name}.md** already exists.`;
    fs.writeFileSync(docPath, data);

    State.cache({
      path: path.join(Paths.CONTENT, type!!, `${name.toLowerCase()}`),
      contents: data,
    });
    return `added \`${type}/${name}.md\``;
  } catch (e) {
    return e.message;
  }
}

export function all() {
  return `\
${people()}\n
${places()}\n
${lore()}\n
${sessions()}\n
${meta()}\n
`;
}
