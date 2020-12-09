import path from "path";
import * as Handlers from "./handlers";

export const CONTENT_PATH = path.join(__dirname, "../../src/content");
export const SESSIONS_PATH = path.join(CONTENT_PATH, "sessions");
export const PEOPLE_PATH = path.join(CONTENT_PATH, "people");
export const PLACES_PATH = path.join(CONTENT_PATH, "places");
export const LORE_PATH = path.join(CONTENT_PATH, "lore");

export default Handlers;
