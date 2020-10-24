import equal from "fast-deep-equal/es6";
import type { LRU } from "./types";;

const Entry = <T>(key: LRU.Key, value: T, next: LRU.Nullable<LRU.Entry<T>> = null) => ({ key, value, next, prev: null });
export const Cache = <T>(size: number) => {
    if (size <= 0) {
        throw new Error('Invalid limit size specified');
    }

    let length = 0;
    let top: LRU.Nullable<LRU.Entry<T>> = null;
    let bottom: LRU.Nullable<LRU.Entry<T>> = null;
    let cache: LRU.CacheMap<T> = new Map();

    const set = (key: LRU.Key, entry?: LRU.Entry<T>) => {
        cache.set(key, entry || top!);
        length++;
        return;
    }
    const update = (key: LRU.Key, value: T, override_ref: boolean = false) => {
        let entry = cache.get(key);
        if (typeof entry === 'undefined') {
            throw new Error(`Cache has "undefined" value for "${key.toString()}" key`);
        }

        if (!override_ref && equal(entry.value, value)) {
            top!.prev = entry;
            top = entry;
            remove(key);
            return set(key, entry);
        }

        entry = Entry<T>(key, value, top);
        top!.prev = entry;
        top = entry;
        remove(key);
        return set(key, entry);
    }

    const write = (key: LRU.Key, value: T, override_ref: boolean = false) => {
        validateCache(key);

        if (!cache.has(key) && !top) {
            top = bottom = Entry<T>(key, value);

            return set(key);
        }
        
        if (!cache.has(key)) {
            const entry = Entry<T>(key, value, top);
            top!.prev = entry;
            top = entry;

            return set(key);
        }

        return update(key, value, override_ref);
    }

    const read = (key: LRU.Key) => {
        if (cache.has(key)) {
            const entry = cache.get(key);
            if (typeof entry === 'undefined') {
                throw new Error(`Cache has "undefined" value for "${key.toString()}" key`);
            }
            remove(key);
            write(key, entry.value);

            return entry.value;
        }

        return undefined;
    }

    const remove = (key: LRU.Key) => {
        const entry = cache.get(key);
        
        if (entry?.prev !== null && entry?.prev?.next) {
            entry.prev.next = entry?.next;
        } else {
            top = entry?.next ?? null
        }

        if (entry?.next !== null && entry?.next?.prev) {
            entry.next.prev = entry?.prev;
        } else {
            bottom = entry?.prev ?? null
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

    const validateCache = (key: LRU.Key) => {
        if (length + 1 > size && !cache.has(key)) {
            remove(bottom?.key!);
        }
    }

    return { clear, remove, read, write };
};
