import { cache } from ".";

describe("Least Recently Used cache", () => {
  describe("#write()", () => {
    let numberscache = cache(2);
    beforeEach(() => {
      numberscache = cache(2);
    });

    it("should be able to enter entries", () => {
      numberscache.write("a", 0);
      numberscache.write("b", 1);

      expect(numberscache.read("a")).toEqual(0);
      expect(numberscache.read("b")).toEqual(1);
    });
    it("should be able to overwrite least recently used entry", () => {
      numberscache.write("a", 0);
      numberscache.write("b", 1);
      numberscache.write("c", 2);

      expect(numberscache.read("a")).toEqual(undefined);
      expect(numberscache.read("b")).toEqual(1);
      expect(numberscache.read("c")).toEqual(2);
    });
    it("should be able to update entry", () => {
      numberscache.write("a", 0);
      expect(numberscache.read("a")).toEqual(0);

      numberscache.write("a", 1);
      expect(numberscache.read("a")).toEqual(1);
    });
    it("should retain pointer to old value, when equal object with different pointer is passed", () => {
      numberscache.write("a", { name: "John Doe" });
      const value = numberscache.read("a");

      numberscache.write("a", { name: "John Doe" });
      expect(value).toBe(numberscache.read("a"));
    });

    it("should not retain pointer to old value, when override_ref argument is true", () => {
      numberscache.write("a", { name: "John Doe" });
      const value = numberscache.read("a");

      numberscache.write("a", { name: "John Doe" }, true);
      expect(value).not.toBe(numberscache.read("a"));
    });
  });

  describe("#read()", () => {
    let numberscache = cache(2);
    beforeEach(() => {
      numberscache = cache(2);
      numberscache.write("a", 0);
    });

    it("should retrieve value by key", () => {
      expect(numberscache.read("a")).toEqual(0);
    });
    it("should put most recently readied value to top of stack", () => {
      numberscache.write("b", 1);
      numberscache.read("a");
      numberscache.write("c", 2);

      expect(numberscache.read("a")).toEqual(0);
      expect(numberscache.read("b")).toEqual(undefined);
      expect(numberscache.read("c")).toEqual(2);
    });
  });

  describe("#remove()", () => {
    let numberscache = cache(2);
    beforeEach(() => {
      numberscache = cache(2);
    });
    it("should be able to remove entry by key", () => {
      numberscache.write("a", 0);
      numberscache.write("b", 1);

      numberscache.remove("b");

      expect(numberscache.read("a")).toEqual(0);
      expect(numberscache.read("b")).toEqual(undefined);
    });
  });

  describe("#clear()", () => {
    let numberscache = cache(2);
    beforeEach(() => {
      numberscache = cache(2);
    });
    it("should be able to clear cache", () => {
      numberscache.write("a", 0);
      numberscache.write("b", 1);

      numberscache.clear();

      expect(numberscache.read("a")).toEqual(undefined);
      expect(numberscache.read("b")).toEqual(undefined);
    });
  });
});
