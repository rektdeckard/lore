import Discord from "discord.js";
import { Renderer, MarkedOptions } from "marked";

class MarkdownEmbedRenderer extends Renderer {
  message: Discord.MessageEmbed;
  content: string = "";
  options: MarkedOptions = {};

  constructor() {
    super();
    this.message = new Discord.MessageEmbed().setColor("RANDOM");
  }

  // code(code: string, language: string | undefined, isEscaped: boolean): string {
  //   void language, isEscaped;
  //   return code;
  // }

  // blockquote(quote: string): string {
  //   return quote;
  // }

  // html(html: string): string {
  //   // void html;
  //   return html;
  // }

  // heading(
  //   text: string,
  //   level: 1 | 2 | 3 | 4 | 5 | 6,
  //   raw: string,
  //   slugger: Slugger
  // ): string {
  //   void slugger, raw;
  //   if (level === 1) {
  //     this.message.title = text;
  //   } else {
  //     this.content += `**${text}**\n\n`;
  //   }
  //   return raw;
  // }

  // hr(): string {
  //   return "\n---\n";
  // }

  // list(body: string, ordered: boolean, start: number): string {
  //   return body;
  // }

  // listitem(text: string): string {
  //   return text;
  // }

  // checkbox(checked: boolean): string {
  //   return checked ? "[x]" : "[ ]";
  // }

  // paragraph(text: string): string {
  //   this.message.description += text;
  //   return text;
  // }

  // table(header: string, body: string): string {
  //   return `${header}|${body}`;
  // }

  // tablerow(content: string): string {
  //   return content;
  // }

  // tablecell(
  //   content: string,
  //   flags: {
  //     header: boolean;
  //     align: "center" | "left" | "right" | null;
  //   }
  // ): string {
  //   return content;
  // }

  // strong(text: string): string {
  //   return `**${text}**`;
  // }

  // em(text: string): string {
  //   return `*${text}*`;
  // }

  // codespan(code: string): string {
  //   return `${code}`;
  // }

  // br(): string {
  //   return "\n";
  // }

  // del(text: string): string {
  //   return `~~${text}~~`;
  // }

  // link(href: string | null, title: string | null, text: string): string {
  //   return `[${title}](${href})`;
  // }

  // image(href: string | null, title: string | null, text: string): string {
  //   return "";
  // }

  // text(text: string): string {
  //   return text;
  // }
}

export default MarkdownEmbedRenderer;
