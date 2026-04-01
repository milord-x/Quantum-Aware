import type { EntropyAssessment, StrengthLabel } from "./types";

function formatLargePower(base: number, exponent: number): string {
  const log10 = exponent * Math.log10(base);
  if (log10 < 6) {
    return Math.round(base ** exponent).toLocaleString("en-US");
  }

  const power = Math.floor(log10);
  const mantissa = 10 ** (log10 - power);
  return `${mantissa.toFixed(2)}e${power}`;
}

export function formatSearchSpaceFromEntropy(entropyBits: number): string {
  if (entropyBits <= 0) {
    return "1";
  }

  const log10 = entropyBits * Math.log10(2);
  if (log10 < 6) {
    return Math.round(2 ** entropyBits).toLocaleString("en-US");
  }

  const power = Math.floor(log10);
  const mantissa = 10 ** (log10 - power);
  return `${mantissa.toFixed(2)}e${power}`;
}

function labelForEntropy(entropyBits: number): StrengthLabel {
  if (entropyBits < 50) return "Weak";
  if (entropyBits < 72) return "Moderate";
  if (entropyBits < 96) return "Strong";
  if (entropyBits < 128) return "Very Strong";
  return "Extreme";
}

function yearsToText(years: number): string {
  if (years < 1 / 365) return "less than a day";
  if (years < 1) return "less than a year";
  if (years < 1_000) return `${Math.round(years).toLocaleString("en-US")} years`;
  if (years < 1_000_000) return `${(years / 1_000).toFixed(1)} thousand years`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} million years`;
  if (years < 1e15) return `${(years / 1_000_000_000).toFixed(1)} billion years`;
  return `${years.toExponential(2)} years`;
}

function estimateYears(entropyBits: number, guessesPerSecond: number): number {
  const attempts = 2 ** Math.max(entropyBits - 1, 0);
  return attempts / guessesPerSecond / 60 / 60 / 24 / 365;
}

export function assessEntropy(entropyBits: number, modeLabel: string): EntropyAssessment {
  const classicalYears = estimateYears(Math.min(entropyBits, 256), 1e12);
  const quantumAdjustedBits = entropyBits / 2;
  const quantumYears = estimateYears(Math.min(quantumAdjustedBits, 256), 1e9);
  const strength = labelForEntropy(entropyBits);

  return {
    entropyBits,
    searchSpaceSize: formatSearchSpaceFromEntropy(entropyBits),
    classicalEstimate: `At roughly 10^12 guesses/second, a full brute-force search for this ${modeLabel} would be on the order of ${yearsToText(classicalYears)} on average.`,
    quantumEstimate: `Simplified quantum-adjusted estimate: if a Grover-style speedup applied cleanly, the margin behaves more like about ${quantumAdjustedBits.toFixed(1)} effective bits, still implying about ${yearsToText(quantumYears)} at 10^9 quantum-style oracle steps/second. This is educational, not a guarantee.`,
    strength,
    explanation: `${strength} reflects an estimated ${entropyBits.toFixed(1)} bits under uniform-random assumptions. Real-world safety still depends on storage, phishing resistance, malware exposure, and whether an attacker can rate-limit guesses.`,
    assumptions: [
      "Entropy assumes uniform secure randomness and unbiased selection.",
      "Classical estimates use a simplified large-scale offline guessing model.",
      "Quantum-adjusted figures are educational approximations, not predictions of a practical attack."
    ]
  };
}

export function entropyFromCharset(charsetSize: number, length: number): number {
  return Math.log2(charsetSize) * length;
}

export function entropyFromWordlist(wordCount: number, listSize: number): number {
  return Math.log2(listSize) * wordCount;
}

export function entropyFromBytes(bytes: number): number {
  return bytes * 8;
}

export function formatSearchSpace(base: number, exponent: number): string {
  return formatLargePower(base, exponent);
}
