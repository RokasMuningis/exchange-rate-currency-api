import { Cache } from ".";

describe("Least Recently Used Cache", () => {
    describe("#write()", () => {
        let cache = Cache(2);
        beforeEach(() => {
            cache = Cache(2);
        });
        
        it("should be able to enter entries", () => {
            cache.write('a', 0);
            cache.write('b', 1);

            expect(cache.read('a')).toEqual(0);
            expect(cache.read('b')).toEqual(1);
        });
        it("should be able to overwrite least recently used entry", () => {
            cache.write('a', 0);
            cache.write('b', 1);
            cache.write('c', 2);

            expect(cache.read('a')).toEqual(undefined);
            expect(cache.read('b')).toEqual(1);
            expect(cache.read('c')).toEqual(2);
        });
        it("should be able to update entry", () => {
            cache.write('a', 0);
            expect(cache.read('a')).toEqual(0);
            
            cache.write('a', 1);
            expect(cache.read('a')).toEqual(1);
        });
        it("should retain pointer to old value, when equal object with different pointer is passed", () => {
            cache.write('a', { name: 'John Doe' });
            const value = cache.read('a');
            
            cache.write('a', { name: 'John Doe' });
            expect(value).toBe(cache.read('a'));
        });

        it("should not retain pointer to old value, when override_ref argument is true", () => {
            cache.write('a', { name: 'John Doe' });
            const value = cache.read('a');
            
            cache.write('a', { name: 'John Doe' }, true);
            expect(value).not.toBe(cache.read('a'));
        });
    });

    describe("#read()", () => {
        let cache = Cache(2);
        beforeEach(() => {
            cache = Cache(2);
            cache.write('a', 0);
        });

        it("should retrieve value by key", () => {
            expect(cache.read('a')).toEqual(0)
        });
        it("should put most recently readied value to top of stack", () => {
            cache.write('b', 1);
            cache.read('a');
            cache.write('c', 2);

            expect(cache.read('a')).toEqual(0);
            expect(cache.read('b')).toEqual(undefined);
            expect(cache.read('c')).toEqual(2);
        });
    });

    describe("#remove()", () => {
        let cache = Cache(2);
        beforeEach(() => {
            cache = Cache(2);
        });
        it("should be able to remove entry by key", () => {
            cache.write('a', 0);
            cache.write('b', 1);
            
            cache.remove('b')

            expect(cache.read('a')).toEqual(0);
            expect(cache.read('b')).toEqual(undefined);
        });
    });

    describe("#clear()", () => {
        let cache = Cache(2);
        beforeEach(() => {
            cache = Cache(2);
        });
        it("should be able to clear cache", () => {
            cache.write('a', 0);
            cache.write('b', 1);

            cache.clear();

            expect(cache.read('a')).toEqual(undefined);
            expect(cache.read('b')).toEqual(undefined);
        });
    });
});