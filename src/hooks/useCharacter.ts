import { useState } from "react";
import { loadValue, saveValue } from "../services/storage";
import { character as seedCharacter } from "../data/character";
import type { Character } from "../models/character";

const STORAGE_KEY = "northstar-character";

function useCharacter() {
  const [character, setCharacter] = useState<Character>(() =>
    loadValue<Character>(STORAGE_KEY, seedCharacter)
  );

  const updateCharacter = (updates: Partial<Character>) => {
    const next = { ...character, ...updates, updatedAt: new Date().toISOString() };
    setCharacter(next);
    saveValue(STORAGE_KEY, next);
  };

  return { character, updateCharacter };
}

export default useCharacter;
