import * as dotenv from "dotenv";
import * as Discord from "discord.js";
import { parseArgs, Action } from "./parser";
import API from "./api";

dotenv.config();
const TOKEN = process.env.TOKEN;
const bot = new Discord.Client();
bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

const ADD_EXAMPLE = `
\`\`\`md
!add person phil-humanson \`​\`​\`md
# Phil Humanson

Phil is a real person with thoughts and feelings.

## Phil's Things
- loving family
- rewarding job
- third thing
\`​\`​\`
\`\`\`
`;

const HELP_MESSAGE = {
  embed: new Discord.RichEmbed()
    .setColor("DARK_ORANGE")
    // .setAuthor("Lore WikiBot")
    .setTitle("Lore WikiBot Commands")
    .setDescription(
      "In general, `!<question>` will list the relevant pages, and `!<question> <name>` will pull up the specific page with that name. It will also try to match parts of names, so this:```!who adabr```will bring up the entry for *Adabra Gwynn*, if it exists."
    )
    .addBlankField()
    .addField("!who", "People in the world", true)
    .addField("!what", "Things and lore", true)
    .addField("!where", "Locations in the world", true)
    .addField("!when", "Notes from previous sessions", true)
    .addField("!why", "Rules and materials", true)
    .addField("!how", "Show this help doc", true)
    .addField("!recap", "Pull up notes from the most recent session")
    .addField("!more", "Show more contents, if the last file was truncated")
    .addBlankField()
    .addField(
      "!add",
      `Create a new document of type \`person\`, \`place\`, \`thing\`, or \`session\`. Follows the syntax \`!add <type> <name> <content>\`:${ADD_EXAMPLE}`
    ),
};

bot.on("message", (message) => {
  if (!message.content.startsWith("!")) return;

  try {
    const { action, type, args } = parseArgs(message.content);

    switch (action) {
      case Action.RECAP:
        message.reply(API.lastSession());
        break;
      case Action.SESSION:
        message.reply(API.sessions(args[0]));
        break;
      case Action.SESSION_LIST:
        message.reply(API.sessions());
        break;
      case Action.PERSON:
        message.reply(API.people(args[0]));
        break;
      case Action.PERSON_LIST:
        message.reply(API.people());
        break;
      case Action.LORE:
        message.reply(API.lore(args[0]));
        break;
      case Action.LORE_LIST:
        message.reply(API.lore());
        break;
      case Action.PLACE:
        message.reply(API.places(args[0]));
        break;
      case Action.PLACE_LIST:
        message.reply(API.places());
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
      default:
        break;
    }
  } catch (e) {
    message.reply(HELP_MESSAGE);
  }
});
