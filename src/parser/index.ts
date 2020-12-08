export enum Action {
  RECAP,
  SESSION,
  SESSION_LIST,
  PERSON,
  PERSON_LIST,
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
    case "!session":
    case "!sn":
      return { action: Action.SESSION, args };
    case "!when":
    case "!sessions":
    case "!sl":
      return { action: Action.SESSION_LIST, args };
    case "!person":
    case "!people":
    case "!who":
      return { action: args.length ? Action.PERSON : Action.PERSON_LIST, args };
    case "!pe":
      return { action: Action.PERSON_LIST, args };
    case "!place":
    case "!pn":
      return { action: Action.PLACE, args };
    case "!where":
    case "!places":
    case "!pl":
      return { action: Action.PLACE_LIST, args };
    case "!...":
    case "!more":
    case "!continue":
      return { action: Action.CONTINUE, args };
    case "!add":
    case "!new":
      return { action: Action.ADD, args };
    default:
      return { action: Action.NONE, args };
  }
};
