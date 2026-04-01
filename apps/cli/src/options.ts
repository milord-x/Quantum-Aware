import { getKeyPreset, getPasswordPreset, keyMaterialDefaults, passphraseDefaults, passwordDefaults } from "@quantum-aware/core";

export interface PasswordCommandOptions {
  length?: string;
  lowercase?: boolean;
  uppercase?: boolean;
  digits?: boolean;
  symbols?: boolean;
  excludeAmbiguous?: boolean;
  excludeDuplicates?: boolean;
  requireEachType?: boolean;
  customSymbols?: string;
  charset?: string;
  avoidConfusing?: boolean;
  count?: string;
  preset?: string;
}

export interface PassphraseCommandOptions {
  words?: string;
  separator?: string;
  capitalization?: "lowercase" | "capitalized" | "uppercase" | "random";
  digitsPrefix?: string;
  digitsSuffix?: string;
  symbolPrefix?: string;
  symbolSuffix?: string;
  count?: string;
}

export interface KeyCommandOptions {
  bytes?: string;
  format?: "hex" | "base64" | "raw-bytes";
  count?: string;
  preset?: string;
}

export function resolvePasswordOptions(input: PasswordCommandOptions) {
  const preset = input.preset ? getPasswordPreset(input.preset)?.options : undefined;
  return {
    ...passwordDefaults,
    ...preset,
    length: Number.parseInt(input.length ?? String(preset?.length ?? passwordDefaults.length), 10),
    includeLowercase: input.lowercase ?? preset?.includeLowercase ?? passwordDefaults.includeLowercase,
    includeUppercase: input.uppercase ?? preset?.includeUppercase ?? passwordDefaults.includeUppercase,
    includeDigits: input.digits ?? preset?.includeDigits ?? passwordDefaults.includeDigits,
    includeSymbols: input.symbols ?? preset?.includeSymbols ?? passwordDefaults.includeSymbols,
    excludeAmbiguous: input.excludeAmbiguous ?? preset?.excludeAmbiguous ?? passwordDefaults.excludeAmbiguous,
    excludeDuplicates: input.excludeDuplicates ?? preset?.excludeDuplicates ?? passwordDefaults.excludeDuplicates,
    requireEachSelectedType: input.requireEachType ?? preset?.requireEachSelectedType ?? passwordDefaults.requireEachSelectedType,
    customSymbols: input.customSymbols ?? preset?.customSymbols ?? passwordDefaults.customSymbols,
    customCharset: input.charset ?? preset?.customCharset ?? passwordDefaults.customCharset,
    avoidVisuallyConfusingCombinations: input.avoidConfusing ?? preset?.avoidVisuallyConfusingCombinations ?? passwordDefaults.avoidVisuallyConfusingCombinations,
    count: Number.parseInt(input.count ?? String(preset?.count ?? passwordDefaults.count), 10)
  };
}

export function resolvePassphraseOptions(input: PassphraseCommandOptions) {
  return {
    ...passphraseDefaults,
    wordCount: Number.parseInt(input.words ?? String(passphraseDefaults.wordCount), 10),
    separator: input.separator ?? passphraseDefaults.separator,
    capitalization: input.capitalization ?? passphraseDefaults.capitalization,
    digitsPrefix: input.digitsPrefix,
    digitsSuffix: input.digitsSuffix,
    symbolPrefix: input.symbolPrefix,
    symbolSuffix: input.symbolSuffix,
    count: Number.parseInt(input.count ?? String(passphraseDefaults.count), 10),
    wordlist: passphraseDefaults.wordlist
  };
}

export function resolveKeyOptions(input: KeyCommandOptions) {
  const preset = input.preset ? getKeyPreset(input.preset)?.options : undefined;
  return {
    ...keyMaterialDefaults,
    ...preset,
    bytes: Number.parseInt(input.bytes ?? String(preset?.bytes ?? keyMaterialDefaults.bytes), 10),
    format: input.format ?? preset?.format ?? keyMaterialDefaults.format,
    count: Number.parseInt(input.count ?? String(preset?.count ?? keyMaterialDefaults.count), 10)
  };
}
