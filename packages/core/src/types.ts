export type StrengthLabel = "Weak" | "Moderate" | "Strong" | "Very Strong" | "Extreme";

export interface EntropyAssessment {
  entropyBits: number;
  searchSpaceSize: string;
  classicalEstimate: string;
  quantumEstimate: string;
  strength: StrengthLabel;
  explanation: string;
  assumptions: string[];
}

export interface PasswordOptions {
  length: number;
  includeLowercase?: boolean;
  includeUppercase?: boolean;
  includeDigits?: boolean;
  includeSymbols?: boolean;
  excludeAmbiguous?: boolean;
  excludeDuplicates?: boolean;
  requireEachSelectedType?: boolean;
  customSymbols?: string;
  customCharset?: string;
  avoidVisuallyConfusingCombinations?: boolean;
  count?: number;
}

export type PassphraseCapitalization = "lowercase" | "capitalized" | "uppercase" | "random";

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  capitalization: PassphraseCapitalization;
  digitsPrefix?: string;
  digitsSuffix?: string;
  symbolPrefix?: string;
  symbolSuffix?: string;
  count?: number;
  wordlist?: string[];
}

export interface KeyMaterialOptions {
  bytes: number;
  format: "hex" | "base64" | "raw-bytes";
  count?: number;
}

export interface GeneratedSecret<TOptions> {
  value: string;
  entropyBits: number;
  analysis: EntropyAssessment;
  warnings: string[];
  options: TOptions;
}

export interface PasswordPreset {
  id: string;
  label: string;
  description: string;
  options: PasswordOptions;
}

export interface KeyPreset {
  id: string;
  label: string;
  description: string;
  options: KeyMaterialOptions;
}

export interface WordlistDescriptor {
  id: string;
  label: string;
  words: string[];
}

export interface RandomSource {
  randomBytes(length: number): Uint8Array;
}
