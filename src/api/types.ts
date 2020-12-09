import { PathLike } from "fs";

export interface Bookmark {
  path: PathLike;
  page: number;
}

export type SortCallback = (a: string, b: string) => number;
