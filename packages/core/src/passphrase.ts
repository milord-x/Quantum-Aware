import { assessEntropy, entropyFromWordlist } from "./analysis";
import { defaultWordlist } from "./wordlists";
import { randomIndex } from "./random";
import type { GeneratedSecret, PassphraseCapitalization, PassphraseOptions, RandomSource } from "./types";

const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  wordCount: 6,
  separator: "-",
  capitalization: "lowercase",
  count: 1,
  wordlist: defaultWordlist.words
};

function applyCapitalization(word: string, mode: PassphraseCapitalization, source: RandomSource): string {
  switch (mode) {
    case "capitalized":
      return `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`;
    case "uppercase":
      return word.toUpperCase();
    case "random":
      return word
        .split("")
        .map((character) => (randomIndex(2, source) === 0 ? character.toLowerCase() : character.toUpperCase()))
        .join("");
    default:
      return word.toLowerCase();
  }
}

function validatePassphraseOptions(options: PassphraseOptions): PassphraseOptions {
  const resolved = { ...DEFAULT_PASSPHRASE_OPTIONS, ...options };
  if (!Number.isInteger(resolved.wordCount) || resolved.wordCount <= 0) {
    throw new Error("Word count must be a positive integer.");
  }
  if (!Number.isInteger(resolved.count) || (resolved.count ?? 1) <= 0) {
    throw new Error("Passphrase count must be a positive integer.");
  }
  if (!resolved.wordlist || resolved.wordlist.length < 2) {
    throw new Error("Passphrase wordlist must contain at least two words.");
  }
  return resolved;
}

function generatePassphraseValue(options: PassphraseOptions, source: RandomSource): string {
  const words = Array.from({ length: options.wordCount }, () => {
    const baseWord = options.wordlist?.[randomIndex(options.wordlist.length, source)] ?? "";
    return applyCapitalization(baseWord, options.capitalization, source);
  });

  return `${options.digitsPrefix ?? ""}${options.symbolPrefix ?? ""}${words.join(options.separator)}${options.symbolSuffix ?? ""}${options.digitsSuffix ?? ""}`;
}

export function generatePassphrases(options: PassphraseOptions, source: RandomSource): GeneratedSecret<PassphraseOptions>[] {
  const resolved = validatePassphraseOptions(options);
  const entropyBits = entropyFromWordlist(resolved.wordCount, resolved.wordlist?.length ?? 0);

  return Array.from({ length: resolved.count ?? 1 }, () => ({
    value: generatePassphraseValue(resolved, source),
    entropyBits,
    analysis: assessEntropy(entropyBits, "passphrase"),
    warnings: entropyBits < 60 ? ["Consider using more words or a larger wordlist for stronger offline brute-force resistance."] : [],
    options: resolved
  }));
}

export function regeneratePassphraseWord(existingValue: string, options: PassphraseOptions, source: RandomSource, targetIndex?: number): string {
  const resolved = validatePassphraseOptions(options);
  if (resolved.separator === "") {
    throw new Error("Single-word regeneration requires a non-empty separator.");
  }

  const prefix = `${resolved.digitsPrefix ?? ""}${resolved.symbolPrefix ?? ""}`;
  const suffix = `${resolved.symbolSuffix ?? ""}${resolved.digitsSuffix ?? ""}`;
  const core = existingValue.slice(prefix.length, existingValue.length - suffix.length);
  const words = core.split(resolved.separator);
  if (words.length !== resolved.wordCount) {
    throw new Error("Existing passphrase does not match the current passphrase settings.");
  }

  const index = targetIndex ?? randomIndex(words.length, source);
  const nextWord = applyCapitalization(resolved.wordlist?.[randomIndex(resolved.wordlist.length, source)] ?? "", resolved.capitalization, source);
  words[index] = nextWord;
  return `${prefix}${words.join(resolved.separator)}${suffix}`;
}

export const passphraseDefaults = DEFAULT_PASSPHRASE_OPTIONS;
