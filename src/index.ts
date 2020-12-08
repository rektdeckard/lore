import * as dotenv from "dotenv";
import * as Discord from "discord.js";
import API from "./api";
import { parseArgs, Action } from "./parser";

dotenv.config();
const TOKEN = process.env.TOKEN;
const bot = new Discord.Client();
bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (m) => {
  // Bail early if no command
  if (!m.content.startsWith("!")) return;

  try {
    const { action, args } = parseArgs(m.content);

    switch (action) {
      case Action.RECAP:
        m.reply(API.lastSession());
        break;
      case Action.SESSION:
        m.reply(API.sessions(args[0]));
        break;
      case Action.SESSION_LIST:
        m.reply(API.sessions());
        break;
      case Action.PERSON:
        m.reply(API.people(args[0]));
        break;
      case Action.PERSON_LIST:
        m.reply(API.people());
        break;
      case Action.LORE:
        m.reply(API.lore(args[0]));
        break;
      case Action.LORE_LIST:
        m.reply(API.lore());
        break;
      case Action.PLACE:
        m.reply(API.places(args[0]));
        break;
      case Action.PLACE_LIST:
        m.reply(API.places());
        break;
      case Action.ADD:
        break;
      case Action.CONTINUE:
        m.reply(API.more());
        break;
      case Action.HELP:
        m.reply(API.help());
        // m.reply({
        //   embed: new Discord.RichEmbed()
        //   .setTitle("Lore WikiBot")
        //   .setDescription(API.help())
        //   .setColor('DARK_PURPLE')
        // })
        break;
      case Action.NONE:
      default:
        break;
    }
  } catch (e) {
    m.reply(API.help());
  }
});
