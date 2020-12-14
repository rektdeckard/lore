import * as dotenv from "dotenv";
import * as Discord from "discord.js";
import * as API from "./api";

dotenv.config();
const TOKEN = process.env.TOKEN;
const bot = new Discord.Client();
bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user?.tag ?? "Lore"}!`);
});

bot.on("message", async (message) => {
  if (!message.content.startsWith("!")) return;

  API.handle(message);
});
