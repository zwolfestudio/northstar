import { beforeEach, describe, expect, it } from "vitest";
import { loadCollection, saveCollection, loadValue, saveValue } from "./storage";

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage() as unknown as Storage;
});

type Widget = { id: string; label: string };

describe("loadCollection / saveCollection", () => {
  it("returns and persists the seed on first load", () => {
    const seed: Widget[] = [{ id: "a", label: "First" }];
    const result = loadCollection("widgets", seed);

    expect(result).toEqual(seed);
    expect(localStorage.getItem("widgets")).not.toBeNull();

    // Regression test for the Phase 3 bug: seed ids must be stable
    // across reloads, which requires the seed to be persisted on
    // first *read*, not first write. A different seed passed on a
    // later "load" should be ignored in favor of what's stored.
    const laterSeed: Widget[] = [{ id: "b", label: "Different id, same slot" }];
    expect(loadCollection("widgets", laterSeed)).toEqual(seed);
  });

  it("round-trips a saved collection", () => {
    const data: Widget[] = [
      { id: "a", label: "One" },
      { id: "b", label: "Two" },
    ];
    saveCollection("widgets", data);

    expect(loadCollection("widgets", [])).toEqual(data);
  });

  it("upgrades a legacy bare-array shape written by pre-versioning code", () => {
    localStorage.setItem("widgets", JSON.stringify([{ id: "a", label: "Legacy" }]));

    const result = loadCollection<Widget>("widgets", []);
    expect(result).toEqual([{ id: "a", label: "Legacy" }]);

    const raw = JSON.parse(localStorage.getItem("widgets")!);
    expect(raw).toHaveProperty("version");
    expect(raw).toHaveProperty("data");
  });

  it("applies a normalize function and persists the normalized result", () => {
    localStorage.setItem("widgets", JSON.stringify([{ id: "a" }]));

    const normalize = (raw: unknown[]): Widget[] =>
      raw.map((entry) => ({
        id: (entry as Partial<Widget>).id ?? "unknown",
        label: (entry as Partial<Widget>).label ?? "Untitled",
      }));

    const result = loadCollection<Widget>("widgets", [], normalize);
    expect(result).toEqual([{ id: "a", label: "Untitled" }]);

    // A later load with no normalize function should return the
    // already-normalized data, since it was persisted.
    expect(loadCollection<Widget>("widgets", [])).toEqual([{ id: "a", label: "Untitled" }]);
  });

  it("falls back to the given fallback on corrupt JSON", () => {
    localStorage.setItem("widgets", "{not valid json");
    const fallback: Widget[] = [{ id: "fallback", label: "Fallback" }];

    expect(loadCollection("widgets", fallback)).toEqual(fallback);
  });
});

describe("loadValue / saveValue", () => {
  it("returns the fallback when nothing is stored", () => {
    expect(loadValue("setting", { enabled: false })).toEqual({ enabled: false });
  });

  it("round-trips a saved value", () => {
    saveValue("setting", { enabled: true });
    expect(loadValue("setting", { enabled: false })).toEqual({ enabled: true });
  });

  it("falls back when the stored shape doesn't match the versioned envelope", () => {
    localStorage.setItem("setting", JSON.stringify({ enabled: true }));
    expect(loadValue("setting", { enabled: false })).toEqual({ enabled: false });
  });
});
