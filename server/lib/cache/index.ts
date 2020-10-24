import equal from "fast-deep-equal/es6";
import type { Nullable, Key, Entry, CacheMap, Cache } from "./types";

const create_entry = <T>(
  key: Key,
  value: T,
  next: Nullable<Entry<T>> = null
) => ({ key, value, next, prev: null });

export const cache: Cache = <T>(size: number) => {
  if (size <= 0) {
    throw new Error("Invalid limit size specified");
  }

  let length = 0;
  let top: Nullable<Entry<T>> = null;
  let bottom: Nullable<Entry<T>> = null;
  let cache: CacheMap<T> = new Map();

  const set = (key: Key, entry?: Entry<T>) => {
    cache.set(key, entry || (top as Entry<T>));
    length++;
    return;
  };
  const update = (key: Key, value: T, override_ref = false) => {
    let entry = cache.get(key);
    if (typeof entry === "undefined") {
      throw new Error(
        `Cache has "undefined" value for "${key.toString()}" key`
      );
    }

    if (!override_ref && equal(entry.value, value) && top) {
      top.prev = entry;
      top = entry;
      remove(key);
      return set(key, entry);
    }

    entry = create_entry<T>(key, value, top);
    (top as Entry<T>).prev = entry;
    top = entry;
    remove(key);
    return set(key, entry);
  };

  const write = (key: Key, value: T, override_ref = false) => {
    validateCache(key);

    if (!cache.has(key) && !top) {
      top = bottom = create_entry<T>(key, value);

      return set(key);
    }

    if (!cache.has(key) && top) {
      const entry = create_entry<T>(key, value, top);
      top.prev = entry;
      top = entry;

      return set(key);
    }

    return update(key, value, override_ref);
  };

  const read = (key: Key) => {
    if (cache.has(key)) {
      const entry = cache.get(key);
      if (typeof entry === "undefined") {
        throw new Error(
          `Cache has "undefined" value for "${key.toString()}" key`
        );
      }
      remove(key);
      write(key, entry.value);

      return entry.value;
    }

    return undefined;
  };

  const remove = (key: Key) => {
    const entry = cache.get(key);

    if (entry?.prev !== null && entry?.prev?.next) {
      entry.prev.next = entry?.next;
    } else {
      top = entry?.next ?? null;
    }

    if (entry?.next !== null && entry?.next?.prev) {
      entry.next.prev = entry?.prev;
    } else {
      bottom = entry?.prev ?? null;
    }

    cache.delete(key);
    length--;
  };

  const clear = () => {
    length = 0;
    top = null;
    bottom = null;
    cache = new Map();
  };

  const validateCache = (key: Key) => {
    if (length + 1 > size && !cache.has(key) && bottom) {
      remove(bottom.key);
    }
  };

  return { clear, remove, read, write };
};
