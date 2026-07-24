import type { Character } from "../models/character";

export const character: Character = {
  name: "",
  currentChapter: "",
  shortDescription: "",
  updatedAt: new Date().toISOString(),
};
