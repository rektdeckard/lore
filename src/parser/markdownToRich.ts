import Discord from "discord.js";
import marked, { Token } from "marked";
import { decode } from "he";
import { markdown as mark } from "../utils";
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

  const truncateIfNeeded = () => {
    while (message.length > 2000) {
      if (message.fields.length) {
        message.fields.pop();
      } else {
        message.description = message.description?.slice(0, 1800) ?? "";
      }
    }
  };

  // console.log(util.inspect(marked.lexer(markdown), false, 5));

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
          } else {
            inDescription = false;
            // @ts-ignore
            message.fields.push({ name: token.text, value: "", inline: false });
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
            )+ "\n"
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
    truncateIfNeeded();
    return message;
  } catch (e) {
    console.error(e);
    return new Discord.MessageEmbed()
      .setTitle("An error occurred")
      .setDescription(e);
  }
}
