import { assessEntropy, entropyFromBytes } from "./analysis";
import type { GeneratedSecret, KeyMaterialOptions, RandomSource } from "./types";

const DEFAULT_KEY_OPTIONS: KeyMaterialOptions = {
  bytes: 32,
  format: "hex",
  count: 1
};

function validateKeyOptions(options: KeyMaterialOptions): KeyMaterialOptions {
  const resolved = { ...DEFAULT_KEY_OPTIONS, ...options };
  if (!Number.isInteger(resolved.bytes) || resolved.bytes <= 0) {
    throw new Error("Byte length must be a positive integer.");
  }
  if (!Number.isInteger(resolved.count) || (resolved.count ?? 1) <= 0) {
    throw new Error("Key output count must be a positive integer.");
  }
  return resolved;
}

function encodeBytes(bytes: Uint8Array, format: KeyMaterialOptions["format"]): string {
  if (format === "raw-bytes") {
    return Array.from(bytes).join(",");
  }

  if (format === "hex") {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  if (typeof btoa === "function") {
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  return Buffer.from(bytes).toString("base64");
}

export function generateKeyMaterial(options: KeyMaterialOptions, source: RandomSource): GeneratedSecret<KeyMaterialOptions>[] {
  const resolved = validateKeyOptions(options);
  const entropyBits = entropyFromBytes(resolved.bytes);

  return Array.from({ length: resolved.count ?? 1 }, () => ({
    value: encodeBytes(source.randomBytes(resolved.bytes), resolved.format),
    entropyBits,
    analysis: assessEntropy(entropyBits, "key material"),
    warnings: resolved.bytes < 16 ? ["This byte length is short for many long-lived secrets. Consider 16 bytes or more, and 32 bytes for higher margins."] : [],
    options: resolved
  }));
}

export const keyMaterialDefaults = DEFAULT_KEY_OPTIONS;
