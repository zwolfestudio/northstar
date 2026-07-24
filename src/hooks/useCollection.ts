import { useState } from "react";
import { loadCollection, saveCollection } from "../services/storage";

function useCollection<T extends { id: string; updatedAt: string }>(
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

  // Every update touches updatedAt, unless the caller already stamped
  // one - a record that's been added/edited/toggled just changed, by
  // definition. Missing this made "last updated" meaningless: Mission/
  // Project edits (Increase Progress, task toggles) never set it.
  const updateItem = (id: string, updates: Partial<T>) =>
    persist(
      items.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: updates.updatedAt ?? new Date().toISOString() }
          : item
      )
    );

  const removeItem = (id: string) => persist(items.filter((item) => item.id !== id));

  return { items, addItem, updateItem, removeItem };
}

export default useCollection;
