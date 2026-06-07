import { describe, it, expect } from "vitest";
import { extractJson } from "./generate.ts";

describe("extractJson", () => {
  it("düz JSON'u ayıklar", () => {
    expect(extractJson('{"a":1}')).toEqual({ a: 1 });
  });

  it("```json bloğundan ayıklar", () => {
    expect(extractJson('```json\n{"a":2}\n```')).toEqual({ a: 2 });
  });

  it("etrafındaki metni yok sayar", () => {
    expect(extractJson('İşte sonuç: {"a":3} umarım yardımcı olur')).toEqual({ a: 3 });
  });

  it("JSON yoksa hata fırlatır", () => {
    expect(() => extractJson("hiç json yok")).toThrow();
  });
});
