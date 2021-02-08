import fs, { PathLike } from "fs";
import path from "path";
import Discord from "discord.js";
// @ts-ignore
import egrep from "@apexearth/egrep";

import { Paths } from "../constants";
import { Command, markdownToRich } from "../parser";
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
    file = fs.readFileSync(path).toString();
    State.cache({ path, contents: file });
  }
  return truncateAndBookmarkIfNeeded(file);
}

function truncateAndBookmarkIfNeeded(contents: string): string {
  if (contents.length > PAGE_SIZE) {
    const parts = contents.split(/\n+/) || contents.split(/\s/);
    if (!parts.length) throw new Error("Could not split file!");

    let truncated = "";
    let index = 0;
    while (
      truncated.length + parts[index].length < PAGE_SIZE &&
      index < parts.length
    ) {
      truncated += parts[index] + "\n";
      index++;
    }

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
      .map(
        (docName, i) =>
          `${numbered ? `${i + 1}.`.padEnd(3, " ") : "- "} ${docName}`
      );
    return (
      heading + documents.toString().replace(/\.md/g, "").replace(/,/g, "\n")
    );
  } catch (e) {
    return e.message;
  }
}

function show(name: string, docPath: string): string {
  if (State.has(path.join(docPath, `${name}.md`)))
    return read(path.join(docPath, `${name}.md`));

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
    return (
      `${title ? `# ${title}\n\n` : ""}...\n\n` +
      truncateAndBookmarkIfNeeded(contents)
    );
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

    if (path.relative(Paths.CONTENT, docPath).startsWith(".."))
      return `Can't let you write to \`${name.toLowerCase()}\`.`;
    if (fs.existsSync(docPath)) return `\`${type}/${name}.md\` already exists.`;

    fs.writeFileSync(docPath, data);

    State.cache({
      path: docPath,
      contents: data,
    });
    return `Added \`${type}/${name}.md\``;
  } catch (e) {
    return e.message;
  }
}

export function append(command: Command): string {
  const { type, args } = command;
  const [name, heredoc] = args;

  try {
    const data = unmark(`\n${heredoc.trim()}`);
    const docPath = path.join(
      Paths.CONTENT,
      type!!,
      `${name.toLowerCase()}.md`
    );

    if (path.relative(Paths.CONTENT, docPath).startsWith(".."))
      return `Can't let you write to \`${name.toLowerCase()}\``;
    const exists = fs.existsSync(docPath);

    fs.appendFileSync(docPath, data);

    State.nuke({ path: docPath, contents: "" });
    return exists
      ? `Added to \`${type}/${name}.md\``
      : `Created \`${type}/${name}.md\``;
  } catch (e) {
    return e.message;
  }
}

export function replace(command: Command): string {
  const { type, args } = command;
  const [name, heredoc] = args;

  try {
    const data = unmark(heredoc);
    const docPath = path.join(
      Paths.CONTENT,
      type!!,
      `${name.toLowerCase()}.md`
    );

    if (path.relative(Paths.CONTENT, docPath).startsWith(".."))
      return `Can't let you write to \`${name.toLowerCase()}\`.`;
    if (!fs.existsSync(docPath)) return `\`${type}/${name}.md\` does not exist`;

    fs.writeFileSync(docPath, data);

    State.cache({
      path: docPath,
      contents: data,
    });
    return `Replaced \`${type}/${name}.md\``;
  } catch (e) {
    return e.message;
  }
}

type MatchData = { file: string; line: string };
type MatchRecord = Record<string, string[]>;
const typeAndName = /\/([\w-]+)\/([\w-]+)\.md/;

export async function find(
  command: Command,
  message: Discord.Message
): Promise<void> {
  const [pattern] = command.args;

  let matches: MatchData[] = [];
  let stream = egrep({
    pattern,
    files: [Paths.CONTENT],
    recursive: true,
    ignoreCase: true,
  });

  stream.on("error", (err: Error) => {
    return Promise.resolve(err.message);
  });

  stream.on("data", (data: MatchData) => {
    matches.push(data);
  });

  stream.on("close", () => {
    const records = matches.reduce<MatchRecord>((acc, { file, line }) => {
      const pathParts = file.match(typeAndName);
      console.log(pathParts);
      if (pathParts && pathParts.length) {
        const [, type, name] = pathParts;
        if (acc[type]) {
          acc[type].push(name);
        } else {
          acc[type] = [name];
        }
      }

      return acc;
    }, {});

    const markdown = Object.entries(records)
      .map(
        ([type, matches]) =>
          `## ${type.replace(/^\w/, (c) => c.toUpperCase())}\n${matches
            .map((match) => `- ${match}`)
            .join("\n")}`
      )
      .join("\n\n");

    const content = truncateAndBookmarkIfNeeded(markdown);
    message.channel.send(markdownToRich(content));
  });

  // walk(Paths.CONTENT, (err, files) => {
  //   if (err) return Promise.resolve(err.message);
  //   if (!files) return Promise.resolve("No documents found!");

  //   const matches = shell.grep("-i", pattern, files);
  //   console.log(matches);
  //   return Promise.resolve(matches.toString());
  // });
}

// async function walk(
//   dir: string,
//   done: (err: Nullable<Error>, results?: string[]) => void
// ) {
//   let results: string[] = [];
//   fs.readdir(dir, (err, list) => {
//     if (err) return done(err);

//     let pending = list.length;
//     if (!pending) return done(null, results);

//     list.forEach((file) => {
//       file = path.resolve(dir, file);
//       fs.stat(file, (err, stat) => {
//         void err;

//         if (stat && stat.isDirectory()) {
//           walk(file, (err, res) => {
//             void err;
//             if (res) results = [...results, ...res];
//             if (!--pending) done(null, results);
//           });
//         } else {
//           results.push(file);
//           if (!--pending) done(null, results);
//         }
//       });
//     });
//   });
// }

export function all() {
  return `\
${people()}\n
${places()}\n
${lore()}\n
${sessions()}\n
${meta()}\n
`;
}
