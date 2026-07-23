const STORAGE_VERSION = 1;

type StoredCollection<T> = {
  version: number;
  data: T[];
};

function isStoredCollection<T>(value: unknown): value is StoredCollection<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "version" in value &&
    "data" in value &&
    Array.isArray((value as StoredCollection<T>).data)
  );
}

/**
 * Loads a collection from localStorage. Understands two shapes on disk:
 * the current { version, data } wrapper, and the bare array Northstar
 * v0.1 used to write directly. Either way, the result is normalized and
 * re-saved so the next load doesn't have to do this again.
 */
export function loadCollection<T>(
  key: string,
  fallback: T[],
  normalize?: (raw: unknown[]) => T[]
): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) {
    // First-ever load: persist the seed immediately so its generated
    // ids are stable from here on, instead of regenerating (and
    // orphaning any stored reference to them) on every future load.
    saveCollection(key, fallback);
    return fallback;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fallback;
  }

  let items: unknown[] | null = null;
  if (isStoredCollection<T>(parsed)) {
    items = parsed.data;
  } else if (Array.isArray(parsed)) {
    items = parsed;
  }

  if (!items) return fallback;

  const normalized = normalize ? normalize(items) : (items as T[]);
  saveCollection(key, normalized);
  return normalized;
}

export function saveCollection<T>(key: string, data: T[]): void {
  const payload: StoredCollection<T> = { version: STORAGE_VERSION, data };
  localStorage.setItem(key, JSON.stringify(payload));
}

type StoredValue<T> = {
  version: number;
  data: T;
};

function isStoredValue<T>(value: unknown): value is StoredValue<T> {
  return typeof value === "object" && value !== null && "version" in value && "data" in value;
}

/**
 * Same versioned envelope as loadCollection/saveCollection, but for a
 * single value (e.g. dashboard preferences) rather than an array of
 * records with ids.
 */
export function loadValue<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fallback;
  }

  return isStoredValue<T>(parsed) ? parsed.data : fallback;
}

export function saveValue<T>(key: string, value: T): void {
  const payload: StoredValue<T> = { version: STORAGE_VERSION, data: value };
  localStorage.setItem(key, JSON.stringify(payload));
}
