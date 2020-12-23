import { CommandoClient, SQLiteProvider } from "discord.js-commando";
import path from "path";
import * as sqlite from "sqlite";
import * as dotenv from "dotenv";
import * as API from "./api";

const bot = new CommandoClient({
  commandPrefix: "!",
  owner: "337415396330045440",
  nonCommandEditable: true,
  // invite: 'https://discord.gg/bRCvFy9',
});

bot.registry
  .registerDefaultTypes()
  .registerGroups([
    ["add", "Add a wiki page"],
    ["people", "List or show details for people"],
    ["places", "List or show details for places"],
    ["lore", "List or show details for lore"],
    ["sessions", "List or show details for sessions"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({ help: false, unknownCommand: false });
// .registerCommandsIn(path.join(__dirname, "commands"));

bot
  .setProvider(
    sqlite
      .open({
        filename: path.join(__dirname, "settings.sqlite3"),
        driver: sqlite.Database,
      })
      .then((db) => new SQLiteProvider(db))
  )
  .catch(console.error);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user?.tag ?? "Lore"}!`);
  bot.user?.setActivity("over your wiki", { type: "WATCHING" });
});

bot.on("message", async (message) => {
  if (!message.content.startsWith("!")) return;
  API.handle(message);
});

dotenv.config();
bot.login(process.env.DEV_TOKEN);
