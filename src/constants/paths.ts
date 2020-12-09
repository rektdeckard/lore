import path from "path";

const CONTENT = path.join(__dirname, "../../src/content");

export const Paths = {
  CONTENT,
  SESSIONS: path.join(CONTENT, "sessions"),
  PEOPLE: path.join(CONTENT, "people"),
  PLACES: path.join(CONTENT, "places"),
  LORE: path.join(CONTENT, "lore"),
  META: path.join(CONTENT, "meta"),
};
