import { PathLike } from "fs";

export enum DocType {
  SESSION,
  PERSON,
  PLACE,
  LORE,
  META,
}

export interface Bookmark {
  path: PathLike;
  page: number;
}

export type SortCallback = (a: string, b: string) => number;
