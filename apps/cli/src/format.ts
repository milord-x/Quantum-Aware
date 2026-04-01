import type { EntropyAssessment, GeneratedSecret } from "@quantum-aware/core";

function formatAnalysis(analysis: EntropyAssessment): string[] {
  return [
    `Entropy: ${analysis.entropyBits.toFixed(1)} bits`,
    `Search space: ${analysis.searchSpaceSize}`,
    `Strength: ${analysis.strength}`,
    `Classical estimate: ${analysis.classicalEstimate}`,
    `Quantum-aware estimate: ${analysis.quantumEstimate}`,
    `Notes: ${analysis.explanation}`
  ];
}

export function formatHumanResult<TOptions>(mode: string, entries: GeneratedSecret<TOptions>[]): string {
  return entries
    .map((entry, index) => {
      const lines = [
        `${mode} ${index + 1}`,
        `Value: ${entry.value}`,
        ...formatAnalysis(entry.analysis)
      ];
      if (entry.warnings.length > 0) {
        lines.push(`Warnings: ${entry.warnings.join(" | ")}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");
}

export function formatJsonResult<TOptions>(mode: string, entries: GeneratedSecret<TOptions>[]) {
  return JSON.stringify({ mode, results: entries }, null, 2);
}
