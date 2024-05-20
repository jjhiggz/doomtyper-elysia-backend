import { describe, it, expect } from "bun:test";

import { StringHelpers } from "./string-helpers";
const { kebab, underscore } = StringHelpers;

describe("underscore", () => {
  it("should convert camelCase to snake_case", () => {
    expect(underscore("HelloWorld")).toBe("hello_world");
    expect(underscore("helloWorld")).toBe("hello_world");
    expect(underscore("redHotChiliPeppers")).toBe("red_hot_chili_peppers");
  });
});

describe("kebab", () => {
  it("should convert camelCase to snake_case", () => {
    expect(kebab("HelloWorld")).toBe("hello-world");
    expect(kebab("helloWorld")).toBe("hello-world");
    expect(kebab("redHotChiliPeppers")).toBe("red-hot-chili-peppers");
  });
});
