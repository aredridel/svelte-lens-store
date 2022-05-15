import { get, writable } from "svelte/store";
import { test, expect, describe } from "vitest";

import { bijectiveMapping, focusOnProperty } from "./index";

describe("bijectiveMapping", () => {
  test("round trip", () => {
    const base = writable(`{"hello":"world"}`);

    const mapped = bijectiveMapping(base, JSON.parse, JSON.stringify);

    expect(get(mapped)).toEqual({ hello: "world" });

    mapped.set([1, 2, 3]);

    expect(get(base)).toBe("[1,2,3]");
  });
});

describe("focusOnProperty", () => {
  test("round trip", () => {
    const base = writable({ hello: "world" } as { hello: any });

    const mapped = focusOnProperty(base, "hello");

    expect(get(mapped)).toEqual("world");

    mapped.set([1, 2, 3]);

    expect(get(base)).toEqual({ hello: [1, 2, 3] });
  });
});
