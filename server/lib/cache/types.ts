export type Nullable<T> = null | T;
export type Key = string | symbol;
export type CacheMap<T> = Map<Key, Entry<T>>;
export interface Entry<T> {
  key: Key;
  value: T;
  prev: Nullable<Entry<T>>;
  next: Nullable<Entry<T>>;
}

interface read<T> {
  (key: Key): T | undefined;
}

interface write<T> {
  (key: Key, value: T, override_ref?: boolean): void;
}

interface remove {
  (key: Key): void;
}

interface clear {
  (): void;
}

export interface Cache {
  <T>(size: number): {
    /**
     * Retrieve entry by key
     * @param key - key by which entry should be retrieved
     * @returns T | undefined
     */
    read: read<T>;
    /**
     * Writes value to cache by key
     * @param key - key by which entry should be stored
     * @param value - entry's value
     * @param override_ref (optional) - wherever object/array reference should be overwritten
     */
    write: write<T>;
    /**
     * Removes entry by key
     * @param key - key by which entry should be removed
     */
    remove: remove;
    /**
     * Clears cache
     */
    clear: clear;
  };
}
