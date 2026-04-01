import { describe, expect, it } from "vitest";

import { buildPasswordCharset, entropyFromBytes, generateKeyMaterial, generatePassphrases, generatePasswords, NodeRandomSource } from "../src/index";

describe("core package", () => {
  const source = new NodeRandomSource();

  it("builds a charset without ambiguous characters when requested", () => {
    const { charset } = buildPasswordCharset({
      length: 12,
      includeLowercase: true,
      includeUppercase: true,
      includeDigits: true,
      includeSymbols: false,
      excludeAmbiguous: true
    });

    expect(charset).not.toMatch(/[0O1lI]/);
  });

  it("generates passwords with requested count and required groups", () => {
    const passwords = generatePasswords({
      length: 16,
      includeLowercase: true,
      includeUppercase: true,
      includeDigits: true,
      includeSymbols: true,
      requireEachSelectedType: true,
      count: 3
    }, source);

    expect(passwords).toHaveLength(3);
    expect(passwords[0]?.value).toMatch(/[a-z]/);
    expect(passwords[0]?.value).toMatch(/[A-Z]/);
    expect(passwords[0]?.value).toMatch(/[0-9]/);
  });

  it("rejects invalid password configs", () => {
    expect(() => generatePasswords({ length: 0 }, source)).toThrow(/length/);
    expect(() => generatePasswords({ length: 4, includeLowercase: false, includeUppercase: false, includeDigits: false, includeSymbols: false }, source)).toThrow(/Enable at least one/);
  });

  it("formats passphrases with separators and affixes", () => {
    const [passphrase] = generatePassphrases({
      wordCount: 4,
      separator: ".",
      capitalization: "capitalized",
      digitsSuffix: "42",
      symbolPrefix: "!",
      wordlist: ["alpha", "bravo", "charlie", "delta"]
    }, source);

    expect(passphrase.value.startsWith("!")).toBe(true);
    expect(passphrase.value.endsWith("42")).toBe(true);
    expect(passphrase.value).toContain(".");
  });

  it("computes byte entropy honestly", () => {
    expect(entropyFromBytes(32)).toBe(256);
  });

  it("generates key material with warnings for short lengths", () => {
    const [key] = generateKeyMaterial({ bytes: 8, format: "hex" }, source);
    expect(key.value).toHaveLength(16);
    expect(key.warnings[0]).toMatch(/short/);
  });
});
