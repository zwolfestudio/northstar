import { useState } from "react";
import { loadCollection, saveCollection } from "../services/storage";

function useCollection<T extends { id: string }>(
  key: string,
  seed: T[],
  normalize?: (raw: unknown[]) => T[]
) {
  const [items, setItems] = useState<T[]>(() => loadCollection<T>(key, seed, normalize));

  const persist = (next: T[]) => {
    setItems(next);
    saveCollection(key, next);
  };

  const addItem = (item: T) => persist([...items, item]);

  const updateItem = (id: string, updates: Partial<T>) =>
    persist(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));

  const removeItem = (id: string) => persist(items.filter((item) => item.id !== id));

  return { items, addItem, updateItem, removeItem };
}

export default useCollection;
