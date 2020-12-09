export enum Action {
  RECAP,
  SESSION,
  SESSION_LIST,
  PERSON,
  PERSON_LIST,
  LORE,
  LORE_LIST,
  PLACE,
  PLACE_LIST,
  CONTINUE,
  HELP,
  ADD,
  NONE,
}

export enum ContentType {
  PEOPLE = "people",
  PLACES = "places",
  LORE = "lore",
  SESSIONS = "sessions",
}

export interface Command {
  action: Action;
  type?: ContentType;
  args: string[];
}

export function parseArgs(input: string): Command {
  const [actionString, ...args] = input.split(" ");
  switch (actionString) {
    case "!recap":
    case "!last":
      return { action: Action.RECAP, args };
    case "!when":
    case "!session":
    case "!sessions":
    case "!sl":
    case "!sn":
      return {
        action: args.length ? Action.SESSION : Action.SESSION_LIST,
        args,
      };
    case "!who":
    case "!person":
    case "!people":
    case "!pe":
      return { action: args.length ? Action.PERSON : Action.PERSON_LIST, args };
    case "!what":
    case "!lore":
    case "!lo":
      return { action: args.length ? Action.LORE : Action.LORE_LIST, args };
    case "!where":
    case "!places":
    case "!place":
    case "!pl":
      return { action: args.length ? Action.PLACE : Action.PLACE_LIST, args };
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
    default:
      throw new Error(`Type **${arg}** not recognized`);
  }
}
