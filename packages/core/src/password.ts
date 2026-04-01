import { assessEntropy, entropyFromCharset } from "./analysis";
import { buildPasswordCharset, hasConfusingCombination } from "./charsets";
import { pickFromCharset, secureShuffle } from "./random";
import type { GeneratedSecret, PasswordOptions, RandomSource } from "./types";

const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 20,
  includeLowercase: true,
  includeUppercase: true,
  includeDigits: true,
  includeSymbols: true,
  excludeAmbiguous: false,
  excludeDuplicates: false,
  requireEachSelectedType: true,
  avoidVisuallyConfusingCombinations: false,
  count: 1
};

function validatePasswordOptions(options: PasswordOptions): PasswordOptions {
  const resolved = { ...DEFAULT_PASSWORD_OPTIONS, ...options };

  if (!Number.isInteger(resolved.length) || resolved.length <= 0) {
    throw new Error("Password length must be a positive integer.");
  }

  if (!Number.isInteger(resolved.count) || (resolved.count ?? 1) <= 0) {
    throw new Error("Password count must be a positive integer.");
  }

  return resolved;
}

function generatePasswordValue(options: PasswordOptions, source: RandomSource): { value: string; warnings: string[]; charsetSize: number } {
  const warnings: string[] = [];
  const { charset, groups } = buildPasswordCharset(options);

  if (options.requireEachSelectedType && !options.customCharset && options.length < groups.length) {
    throw new Error("Password length is too short to include at least one character from each selected group.");
  }

  const maxAttempts = 256;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const required = options.requireEachSelectedType ? groups.map((group) => pickFromCharset(group, source)) : [];
    const characters = [...required];
    const used = new Set(characters);

    while (characters.length < options.length) {
      const next = pickFromCharset(charset, source);
      if (options.excludeDuplicates && used.has(next) && used.size < charset.length) {
        continue;
      }

      characters.push(next);
      used.add(next);
    }

    const value = secureShuffle(characters, source).join("");
    if (options.avoidVisuallyConfusingCombinations && hasConfusingCombination(value)) {
      continue;
    }

    if (options.excludeDuplicates && options.length > charset.length) {
      warnings.push("Duplicate avoidance could only be partially honored because the requested length exceeds the unique character pool.");
    }

    return { value, warnings, charsetSize: charset.length };
  }

  throw new Error("Unable to generate a password that satisfies the selected constraints. Relax one or more filters and try again.");
}

export function generatePasswords(options: PasswordOptions, source: RandomSource): GeneratedSecret<PasswordOptions>[] {
  const resolved = validatePasswordOptions(options);
  const outputs: GeneratedSecret<PasswordOptions>[] = [];

  for (let index = 0; index < (resolved.count ?? 1); index += 1) {
    const { value, warnings, charsetSize } = generatePasswordValue(resolved, source);
    const entropyBits = entropyFromCharset(charsetSize, resolved.length);
    outputs.push({
      value,
      entropyBits,
      analysis: assessEntropy(entropyBits, "password"),
      warnings,
      options: resolved
    });
  }

  return outputs;
}

export const passwordDefaults = DEFAULT_PASSWORD_OPTIONS;
