import { PathLike } from "fs";
import { Nullable } from "./types";

interface Bookmark {
  path?: PathLike;
  contents: string;
  title?: string;
}

let bookmark: Nullable<Bookmark>;

function setBookmark(newBookmark: Bookmark) {
  bookmark = newBookmark;
}

function getBookmark(): Nullable<Bookmark> {
  return bookmark;
}

function clearBookmark() {
  bookmark = null;
}

export default {
  setBookmark,
  getBookmark,
  clearBookmark,
};
