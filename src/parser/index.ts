export { default as markdownToRich } from "./markdownToRich";

export enum Action {
  RECAP = "Recap",
  SESSION = "Session",
  PERSON = "Person",
  PLACE = "Place",
  LORE = "Lore",
  META = "Meta",
  ALL = "All",
  CONTINUE = "...continued",
  ADD = "Add",
  APPEND = "Append",
  REPLACE = "Replace",
  HELP = "Help",
  NONE = "None",
}

export enum ContentType {
  PEOPLE = "people",
  PLACES = "places",
  LORE = "lore",
  SESSIONS = "sessions",
  META = "meta",
}

export interface Command {
  action: Action;
  type?: ContentType;
  args: string[];
}

export function parseCommand(input: string): Command {
  const [actionString, ...args] = input.trim().split(/ +/);
  switch (actionString.toLowerCase()) {
    case "!recap":
    case "!last":
      return { action: Action.RECAP, args };
    case "!when":
    case "!session":
    case "!sessions":
    case "!sl":
    case "!sn":
      return {
        action: Action.SESSION,
        args,
      };
    case "!who":
    case "!person":
    case "!people":
    case "!pe":
      return { action: Action.PERSON, args };
    case "!what":
    case "!lore":
    case "!lo":
      return { action: Action.LORE, args };
    case "!where":
    case "!places":
    case "!place":
    case "!pl":
      return { action: Action.PLACE, args };
    case "!rules":
    case "!meta":
    case "!why":
      return { action: Action.META, args };
    case "!all":
    case "!list":
      return { action: Action.ALL, args };
    case "!...":
    case "!more":
      return { action: Action.CONTINUE, args };
    case "!add":
    case "!new":
      return {
        action: Action.ADD,
        type: parseAdd(args[0]),
        args: [args[1], args.slice(2).join(" ")],
      };
    case "!append":
      return {
        action: Action.APPEND,
        type: parseAdd(args[0]),
        args: [args[1], args.slice(2).join(" ")],
      };
    case "!replace":
      return {
        action: Action.REPLACE,
        type: parseAdd(args[0]),
        args: [args[1], args.slice(2).join(" ")],
      };
    case "!?":
    case "!h":
    case "!how":
      return { action: Action.HELP, args };
    default:
      return { action: Action.NONE, args };
  }
}

function parseAdd(arg: string): ContentType {
  switch (arg) {
    case "person":
      return ContentType.PEOPLE;
    case "place":
      return ContentType.PLACES;
    case "thing":
    case "lore":
      return ContentType.LORE;
    case "session":
      return ContentType.SESSIONS;
    case "rule":
    case "meta":
      return ContentType.META;
    default:
      throw new Error(`Type **${arg}** not recognized`);
  }
}
