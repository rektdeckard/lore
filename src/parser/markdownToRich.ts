import Discord from "discord.js";
import marked, { Token } from "marked";
import { decode } from "he";
import { mark } from "../utils";
import State from "../api/state";
// import util from "util";

// const NP_SPACE = "​";

export default function (markdown: string): Discord.MessageEmbed {
  const message = new Discord.MessageEmbed();
  let inDescription = true;

  const append = (text: string) => {
    if (!text) return;

    if (inDescription) {
      if (!message.description) {
        message.description = decode(text);
      } else {
        message.description += decode(text);
      }
    } else {
      if (message.fields.length) {
        message.fields[message.fields.length - 1].value += decode(text);
      } else {
        throw new Error("You're not yet in Field scope!");
      }
    }
  };

  try {
    marked.lexer(markdown).forEach((token) => {
      // @ts-ignore
      switch (token.type) {
        case "code":
          // @ts-ignore
          append(`\`\`\`${token.lang ?? ""}\n${token.text}\`\`\`\n`);
          break;
        case "blockquote":
          // @ts-ignore
          append(`> ${token.text}\n`);
          break;
        case "html":
          break;
        case "heading":
          // @ts-ignore
          if (token.depth === 1) {
            // @ts-ignore
            message.setTitle(token.text);
            // @ts-ignore
            State.setBookmark({ ...State.getBookmark(), title: token.text });
          } else {
            inDescription = false;
            message.fields.push({
              // @ts-ignore
              name: token.text,
              value: "",
              inline: false,
            });
          }
          break;
        // case "hr":
        //   break;
        case "list":
          append(
            mark(
              // @ts-ignore
              token.items
                .map(
                  (item: Token, index: number) =>
                    // @ts-ignore
                    `${token.ordered ? `${index + 1}.` : "-"} ${item.text}`
                )
                .join("\n")
            ) + "\n"
          );
          //   break;
          // case "paragraph":
          //   break;
          // case "space":
          break;
        default:
          append(token.raw);
      }
    });

    message.setColor("DARK_ORANGE");
    if (markdown.endsWith("\n..."))
      message.setFooter("Type !more to continue");
    return message;
  } catch (e) {
    console.error(e);
    return new Discord.MessageEmbed()
      .setTitle("An error occurred")
      .setDescription(e);
  }
}
