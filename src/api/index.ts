import Discord from "discord.js";
import { parseCommand, Action, markdownToRich } from "../parser";
import * as API from "./handlers";
import { markdown } from "../utils";
import { HELP_MESSAGE } from "../constants";

export async function handle(message: Discord.Message): Promise<void> {
  try {
    const command = parseCommand(message.content);
    let content: string = "";

    switch (command.action) {
      case Action.RECAP:
        content = API.lastSession();
        break;
      case Action.SESSION:
        content = API.sessions(command);
        break;
      case Action.PERSON:
        content = API.people(command);
        break;
      case Action.LORE:
        content = API.lore(command);
        break;
      case Action.PLACE:
        content = API.places(command);
        break;
      case Action.META:
        content = API.meta(command);
        break;
      case Action.ALL:
        content = API.all();
        break;
      case Action.ADD:
        content = API.add(command);
        break;
      case Action.CONTINUE:
        content = API.more();
        break;
      case Action.HELP:
        message.channel.send(HELP_MESSAGE);
        return;
      case Action.NONE:
        break;
      default:
        break;
    }

    if (!content) return;

    if (command.args.includes("-r")) {
      message.channel.send(markdown(content));
    } else {
      message.channel.send({ embed: markdownToRich(content) });
    }
  } catch (e) {
    console.error(e);
    message.channel.send(HELP_MESSAGE);
  }
}
