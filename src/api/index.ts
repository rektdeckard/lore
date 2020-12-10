import Discord from "discord.js";
import { parseCommand, Action, markdownToRich } from "../parser";
import * as API from "./handlers";
import { HELP_MESSAGE, TEST_MARKDOWN } from "../constants";

export async function handle(message: Discord.Message): Promise<void> {
  try {
    const { action, type, args } = parseCommand(message.content);

    switch (action) {
      case Action.RECAP:
        message.channel.send(API.lastSession());
        break;
      case Action.SESSION:
        message.channel.send(API.sessions(args[0]));
        break;
      case Action.PERSON:
        message.channel.send(API.people(args[0]));
        break;
      case Action.LORE:
        message.channel.send(API.lore(args[0]));
        break;
      case Action.PLACE:
        message.channel.send(API.places(args[0]));
        break;
      case Action.META:
        message.channel.send(API.meta(args[0]));
        break;
      case Action.ALL:
        message.channel.send(API.all());
        break;
      case Action.ADD:
        message.channel.send(API.add(type!!, args));
        break;
      case Action.CONTINUE:
        message.channel.send(API.more());
        break;
      case Action.HELP:
        message.channel.send(HELP_MESSAGE);
        break;
      case Action.NONE:
        message.channel.send({
          embed: markdownToRich(TEST_MARKDOWN),
        });
        break;
      default:
        break;
    }
  } catch (e) {
    message.channel.send(HELP_MESSAGE);
  }
}
