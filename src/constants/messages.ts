import { MessageEmbed } from "discord.js";

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

export const HELP_MESSAGE = {
  embed: new MessageEmbed()
    .setColor("DARK_ORANGE")
    // .setAuthor("Lore WikiBot")
    .setTitle("Lore WikiBot Commands")
    .setDescription(
      `\
      Most commands are based on general questions like *who* or *what*. \
      A command with no arguments, \`!<question>\`, will list the relevant pages. \
      A command with a name argument, \`!<question> <name>\`, will pull up the specific page with that name. \
      It will also try to match parts of names, so this: \
      \`\`\`!who adabr\`\`\`will match the entry for *Adabra Gwynn*. \
      The first match found will be shown.\
      `
    )
    .addFields(
      { name: "\u200B", value: "\u200B" },
      { name: "!who", value: "People in the world", inline: true },
      { name: "!what", value: "Things and lore", inline: true },
      { name: "!where", value: "Locations in the world", inline: true },
      { name: "!when", value: "Notes from previous sessions", inline: true },
      { name: "!why", value: "Rules and materials", inline: true },
      { name: "!how", value: "Show this help doc", inline: true },
      // { name: '\u200B', value: '\u200B' },
      {
        name: "!more",
        value: "Show more contents of a truncated file",
        inline: true,
      },
      {
        name: "!recap",
        value: "Notes from the most recent session",
        inline: true,
      },
      { name: "\u200B", value: "\u200B" }
    )
    .addField(
      "!add",
      `Create a new document of type \`person\`, \`place\`, \`thing\`, \
      \`session\`, or \`meta\`. Follows the syntax \`!add <type> <name> <content>\`:\
      ${ADD_EXAMPLE}`
    ),
};
