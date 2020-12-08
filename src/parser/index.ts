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
  ADD,
  NONE,
}

export interface Command {
  action: Action;
  args: string[];
}

export const parseArgs = (input: string): Command => {
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
    case "!continue":
      return { action: Action.CONTINUE, args };
    case "!add":
      return { action: Action.ADD, args };
    case "!new":
      return { action: Action.ADD, args };
    default:
      return { action: Action.NONE, args };
  }
};
