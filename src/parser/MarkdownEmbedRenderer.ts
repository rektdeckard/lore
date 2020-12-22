import Discord from "discord.js";
import { MarkedOptions, Slugger } from "marked";
import { decode } from "he";
import { markdown as mark } from "../utils";

interface List {
  counter: number;
  accumulator: string[];
}

class MarkdownEmbedRenderer {
  private message: Discord.MessageEmbed;
  private inDescription: boolean = true;
  private currentList: List = {
    counter: 0,
    accumulator: [],
  };

  options: MarkedOptions = {};

  constructor() {
    this.message = new Discord.MessageEmbed();
  }

  append(text: string) {
    if (!text) return;

    if (this.inDescription) {
      if (!this.message.description) {
        this.message.description = decode(text);
      } else {
        this.message.description += decode(text);
      }
    } else {
      this.message.fields[this.message.fields.length - 1].value += decode(text);
    }
  }

  truncateIfNeeded() {
    while (this.message.length > 2000) {
      if (this.message.fields.length) {
        this.message.fields.pop();
      } else {
        this.message.description =
          this.message.description?.slice(0, 1800) ?? "";
      }
    }
  }

  getMessage(): Discord.MessageEmbed {
    return this.message;
  }

  code(code: string, language: string | undefined, isEscaped: boolean): string {
    void language, isEscaped;
    this.append(`\`\`\`${language}\n${code}\`\`\``);
    return "";
  }

  blockquote(quote: string): string {
    this.append(`> ${quote}\n\n`);
    return "";
  }

  html(html: string): string {
    // TODO
    return html;
  }

  heading(
    text: string,
    level: 1 | 2 | 3 | 4 | 5 | 6,
    raw: string,
    slugger: Slugger
  ): string {
    void slugger, raw;
    if (level === 1) {
      this.message.setTitle(text);
    } else {
      this.inDescription = false;
      this.message.fields.push({ name: text, value: "", inline: false });
    }
    return raw;
  }

  hr(): string {
    // TODO
    this.append("---\n\n");
    return "\n---\n";
  }

  list(body: string, ordered: boolean, start: number): string {
    void body, ordered, start;
    // TODO
    this.append(
      mark(
        this.currentList.accumulator
          .map(
            (item) =>
              `${ordered ? `${++this.currentList.counter}.` : "-"} ${item}`
          )
          .join("\n")
      ) + "\n"
    );
    this.currentList.accumulator = [];
    this.currentList.counter = 0;
    // inDescription = false;
    // message.fields.push({ name: text, value: "", inline: false });
    return "";
  }

  listitem(text: string): string {
    // TODO
    this.currentList.accumulator.push(text);
    return "";
  }

  checkbox(checked: boolean): string {
    // TODO
    return checked ? "[x] " : "[ ] ";
  }

  paragraph(text: string): string {
    // TODO
    // content += text;
    this.append(`${text}\n\n`);
    return text;
  }

  table(header: string, body: string): string {
    // TODO
    return `${header}|${body}`;
  }

  tablerow(content: string): string {
    // TODO
    return content;
  }

  tablecell(
    content: string,
    flags: {
      header: boolean;
      align: "center" | "left" | "right" | null;
    }
  ): string {
    // TODO
    void flags;
    return content;
  }

  // INLINE
  strong(text: string): string {
    return `**${text}**`;
  }

  // INLINE
  em(text: string): string {
    return `*${text}*`;
  }

  // INLINE
  codespan(code: string): string {
    // return `${code}`;
    // append(`\`${code}\``);
    return `\`${code}\``;
  }

  // INLINE
  br(): string {
    return "\n";
  }

  // INLINE
  del(text: string): string {
    // append(`~~${text}~~`);
    return `~~${text}~~`;
  }

  // INLINE
  link(href: string | null, title: string | null, text: string): string {
    void title;
    // append(`[${text?? ""}](${href})`);
    return `[${text ?? ""}](${href})`;
  }

  // INLINE
  image(href: string | null, title: string | null, text: string): string {
    void title, text;
    this.message.image = { url: href ?? "" };
    return text;
  }

  // INLINE
  text(text: string): string {
    // TODO: Figure out how to append regular text to the doc, but still pass content of other tags back to it's handler
    // append(text);
    return text;
  }
}

export default MarkdownEmbedRenderer;
