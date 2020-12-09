import Discord from "discord.js";
import { parseCommand, Action, markdownToRich } from "../parser";
import * as API from "./handlers";
import { HELP_MESSAGE } from "../constants";

export async function handle(message: Discord.Message): Promise<void> {
  try {
    const { action, type, args } = parseCommand(message.content);

    switch (action) {
      case Action.RECAP:
        message.reply(API.lastSession());
        break;
      case Action.SESSION:
        message.reply(API.sessions(args[0]));
        break;
      case Action.PERSON:
        message.reply(API.people(args[0]));
        break;
      case Action.LORE:
        message.reply(API.lore(args[0]));
        break;
      case Action.PLACE:
        message.reply(API.places(args[0]));
        break;
      case Action.META:
        message.reply(API.meta(args[0]));
        break;
      case Action.ADD:
        message.reply(API.add(type!!, args));
        break;
      case Action.CONTINUE:
        message.reply(API.more());
        break;
      case Action.HELP:
        message.reply(HELP_MESSAGE);
        break;
      case Action.NONE:
        message.reply({
          embed: markdownToRich(""),
        });
        break;
      default:
        break;
    }
  } catch (e) {
    message.reply(HELP_MESSAGE);
  }
}
