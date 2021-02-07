import { PathLike } from "fs";
import { Nullable } from "./types";

interface Bookmark {
  path?: PathLike;
  contents: string;
  title?: string;
}

interface Entry {
  path?: PathLike;
  contents: string;
}

let bookmark: Nullable<Bookmark>;
let entryCache: Map<PathLike, Entry> = new Map();

function setBookmark(newBookmark: Bookmark) {
  bookmark = newBookmark;
}

function getBookmark(): Nullable<Bookmark> {
  return bookmark;
}

function clearBookmark() {
  bookmark = null;
}

function find(path: PathLike) {
  return entryCache.get(path);
}

function cache(entry: Entry) {
  if (!entry.path) return;
  entryCache.set(entry.path, entry);
}

function nuke(entry: Entry) {
  entryCache.delete(entry.path!!);
}

function has(path: PathLike) {
  return entryCache.has(path);
}

function clear() {
  entryCache.clear();
  clearBookmark();
}

export default {
  setBookmark,
  getBookmark,
  clearBookmark,
  find,
  cache,
  nuke,
  has,
  clear,
};
