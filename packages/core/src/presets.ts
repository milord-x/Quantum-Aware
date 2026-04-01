import type { KeyPreset, PasswordPreset } from "./types";

export const passwordPresets: PasswordPreset[] = [
  {
    id: "balanced",
    label: "Balanced",
    description: "A strong default for general account passwords.",
    options: { length: 20, includeLowercase: true, includeUppercase: true, includeDigits: true, includeSymbols: true, requireEachSelectedType: true }
  },
  {
    id: "maximum-entropy",
    label: "Maximum entropy",
    description: "Long mixed-character password for offline attack resistance.",
    options: { length: 32, includeLowercase: true, includeUppercase: true, includeDigits: true, includeSymbols: true, requireEachSelectedType: true }
  },
  {
    id: "easy-to-read",
    label: "Easy to read",
    description: "Removes confusing characters for manual entry.",
    options: { length: 18, includeLowercase: true, includeUppercase: true, includeDigits: true, includeSymbols: false, excludeAmbiguous: true, avoidVisuallyConfusingCombinations: true, requireEachSelectedType: true }
  },
  {
    id: "web-account",
    label: "Web account",
    description: "Balanced mixed-character profile for everyday web logins.",
    options: { length: 18, includeLowercase: true, includeUppercase: true, includeDigits: true, includeSymbols: true, requireEachSelectedType: true }
  },
  {
    id: "banking-critical",
    label: "Banking / critical account",
    description: "Longer profile for especially sensitive accounts.",
    options: { length: 24, includeLowercase: true, includeUppercase: true, includeDigits: true, includeSymbols: true, requireEachSelectedType: true }
  },
  {
    id: "manager-master",
    label: "Password manager master password",
    description: "Long mixed secret intended for storage in memory, not easy manual entry.",
    options: { length: 28, includeLowercase: true, includeUppercase: true, includeDigits: true, includeSymbols: true, excludeAmbiguous: true, requireEachSelectedType: true }
  },
  {
    id: "developer-strong",
    label: "Developer strong password",
    description: "Strong mixed set suitable for local tooling and admin surfaces.",
    options: { length: 22, includeLowercase: true, includeUppercase: true, includeDigits: true, includeSymbols: true, customSymbols: "!@#$%^&*-_=+", requireEachSelectedType: true }
  }
];

export const keyPresets: KeyPreset[] = [
  { id: "api-token", label: "API token", description: "Good default for opaque bearer-style tokens.", options: { bytes: 24, format: "base64" } },
  { id: "local-encryption-key", label: "Local encryption key", description: "32 bytes of raw randomness for symmetric key material.", options: { bytes: 32, format: "hex" } },
  { id: "recovery-secret", label: "Recovery secret", description: "High-entropy recovery material for offline storage.", options: { bytes: 32, format: "base64" } },
  { id: "machine-secret", label: "Machine secret", description: "Server or service secret with conservative entropy margin.", options: { bytes: 48, format: "hex" } }
];

export function getPasswordPreset(id: string): PasswordPreset | undefined {
  return passwordPresets.find((preset) => preset.id === id);
}

export function getKeyPreset(id: string): KeyPreset | undefined {
  return keyPresets.find((preset) => preset.id === id);
}
