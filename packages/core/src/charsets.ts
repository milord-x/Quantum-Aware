import type { PasswordOptions } from "./types";

export const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
export const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const DIGITS = "0123456789";
export const DEFAULT_SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/";

const AMBIGUOUS = new Set(["0", "O", "o", "1", "l", "I", "|", "5", "S", "2", "Z", "6", "G", "8", "B"]);
const CONFUSING_SUBSTRINGS = ["rn", "vv", "cl", "0O", "O0", "1l", "l1", "Il", "lI", "I1", "1I"];

function uniqueCharacters(input: string): string {
  return [...new Set(input.split(""))].join("");
}

function filterAmbiguous(input: string): string {
  return input
    .split("")
    .filter((character) => !AMBIGUOUS.has(character))
    .join("");
}

export function getConfusingSubstrings(): string[] {
  return CONFUSING_SUBSTRINGS;
}

export function buildPasswordCharset(options: PasswordOptions): { charset: string; groups: string[] } {
  if (options.customCharset) {
    const charset = uniqueCharacters(options.customCharset);
    if (!charset) {
      throw new Error("Custom charset cannot be empty.");
    }
    return { charset, groups: [charset] };
  }

  const symbols = uniqueCharacters(options.customSymbols?.trim() ? options.customSymbols : DEFAULT_SYMBOLS);
  const groups = [
    options.includeLowercase ? LOWERCASE : "",
    options.includeUppercase ? UPPERCASE : "",
    options.includeDigits ? DIGITS : "",
    options.includeSymbols ? symbols : ""
  ]
    .filter(Boolean)
    .map((group) => (options.excludeAmbiguous ? filterAmbiguous(group) : group))
    .filter(Boolean);

  if (groups.length === 0) {
    throw new Error("Enable at least one character group or provide a custom charset.");
  }

  const charset = uniqueCharacters(groups.join(""));

  if (!charset) {
    throw new Error("No characters remain after applying filters.");
  }

  return { charset, groups };
}

export function hasConfusingCombination(value: string): boolean {
  return CONFUSING_SUBSTRINGS.some((item) => value.includes(item));
}
