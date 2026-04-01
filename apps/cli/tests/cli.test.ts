import { describe, expect, it } from "vitest";

import { resolveKeyOptions, resolvePassphraseOptions, resolvePasswordOptions } from "../src/options";

describe("cli option resolution", () => {
  it("resolves password preset and overrides", () => {
    const options = resolvePasswordOptions({ preset: "balanced", length: "24", excludeAmbiguous: true });
    expect(options.length).toBe(24);
    expect(options.excludeAmbiguous).toBe(true);
    expect(options.includeSymbols).toBe(true);
  });

  it("resolves passphrase defaults", () => {
    const options = resolvePassphraseOptions({ words: "5", separator: "_", capitalization: "uppercase" });
    expect(options.wordCount).toBe(5);
    expect(options.separator).toBe("_");
    expect(options.capitalization).toBe("uppercase");
  });

  it("resolves key presets", () => {
    const options = resolveKeyOptions({ preset: "api-token" });
    expect(options.bytes).toBe(24);
    expect(options.format).toBe("base64");
  });
});
