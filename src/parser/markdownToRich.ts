import Discord from "discord.js";
import marked from "marked";

export default function (markdown: string): Discord.MessageEmbed {
  const message = new Discord.MessageEmbed();
  let content = "";

  marked.use({
    renderer: {
      options: {},
      code: (code, language, isEscaped) => {
        void language, isEscaped;
        return code;
      },
      blockquote: (quote) => {
        return quote;
      },
      html: (html) => {
        return html;
      },
      heading: (text, level, raw, slugger) => {
        void slugger, raw;
        if (level === 1) {
          message.setTitle(text);
        } else {
          content += `\n\n**${text}**\n\n`;
        }
        return raw;
      },

      hr: () => {
        return "\n---\n";
      },

      list: (body, ordered, start) => {
        void ordered, start;
        return body;
      },

      listitem: (text) => {
        return text;
      },

      checkbox: (checked) => {
        return checked ? "[x]" : "[ ]";
      },

      paragraph: (text) => {
        content += text;
        return text;
      },

      table: (header, body) => {
        return `${header}|${body}`;
      },

      tablerow: (content) => {
        return content;
      },

      tablecell: (content, flags) => {
        void flags;
        return content;
      },

      strong: (text) => {
        return `**${text}**`;
      },

      em: (text) => {
        return `*${text}*`;
      },

      codespan: (code) => {
        return `${code}`;
      },

      br: () => {
        return "\n";
      },

      del: (text) => {
        return `~~${text}~~`;
      },

      link: (href, title, text) => {
        void text;
        return `[${title}](${href})`;
      },

      image: (href, title, text) => {
        void title, text;
        message.image = { url: href ?? "" };
        return "";
      },

      text: (text) => {
        return text;
      },
    },
  });

  try {
    marked(markdown);
  } catch (e) {
    console.error(e);
  }

  console.log(message);
  message.setDescription(content.slice(0, 1800));
  return message;

  // return (
  //   new Discord.MessageEmbed()
  //     .setColor("RANDOM")
  //     .setTitle("People")
  //     .setDescription(
  //       "Potion maker and keeper of the stone mill at **Umbridge Hill**, a few hours south of **Phandalin**. We were sent to ask her to return to town in case of dragon attack, but when we found her she was under siege from an angry manticore."
  //     )
  //     .addField("Location", "Phandalin", true)
  //     .addField("Race", "Human", true)
  //     .addField("Profession", "Alchemist", true)
  //     .addField(
  //       "Disposition",
  //       "She appreciated out help with the manitcore and thanked us with a few potions. However, she refuses to return to **Phandalin**."
  //     )
  //     .addField("Link", "[Test](https://tobiasfried.com) if this works.")
  //     .setFooter(new Date().toUTCString())
}
