#!/usr/bin/env node
import { Command } from "commander";
import {
  NodeRandomSource,
  analyzeKeyBytes,
  analyzePassphraseGuess,
  analyzePasswordGuess,
  defaultWordlist,
  generateKeyMaterial,
  generatePassphrases,
  generatePasswords,
  keyPresets,
  passwordPresets
} from "@quantum-aware/core";

import { formatHumanResult, formatJsonResult } from "./format";
import { resolveKeyOptions, resolvePassphraseOptions, resolvePasswordOptions } from "./options";

const program = new Command();
const source = new NodeRandomSource();

function parseBoolean(value: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error("Expected true or false.");
}

function outputResult(mode: string, results: ReturnType<typeof generatePasswords> | ReturnType<typeof generatePassphrases> | ReturnType<typeof generateKeyMaterial>, json?: boolean) {
  const rendered = json ? formatJsonResult(mode, results) : formatHumanResult(mode, results);
  process.stdout.write(`${rendered}\n`);
}

program
  .name("qa")
  .description("Quantum-Aware: local-only high-entropy secret generation with educational quantum-adjusted estimates.")
  .version("0.1.0");

const generateCommand = program.command("generate").description("Generate secrets locally");

generateCommand
  .command("password")
  .description("Generate one or more random passwords")
  .option("--length <number>", "password length")
  .option("--lowercase <boolean>", "include lowercase letters", parseBoolean)
  .option("--uppercase <boolean>", "include uppercase letters", parseBoolean)
  .option("--digits <boolean>", "include digits", parseBoolean)
  .option("--symbols <boolean>", "include symbols", parseBoolean)
  .option("--exclude-ambiguous", "exclude visually confusing characters")
  .option("--exclude-duplicates", "avoid duplicate characters where possible")
  .option("--require-each-type", "require at least one character from each enabled group")
  .option("--custom-symbols <characters>", "override symbol set")
  .option("--charset <characters>", "full charset override")
  .option("--avoid-confusing", "avoid known confusing character combinations")
  .option("--count <number>", "number of outputs")
  .option("--preset <id>", "apply a password preset")
  .option("--json", "output structured JSON")
  .action((input) => outputResult("password", generatePasswords(resolvePasswordOptions(input), source), input.json));

generateCommand
  .command("passphrase")
  .description("Generate one or more passphrases")
  .option("--words <number>", "word count")
  .option("--separator <value>", "separator between words")
  .option("--capitalization <mode>", "lowercase | capitalized | uppercase | random")
  .option("--digits-prefix <value>", "prepend digits")
  .option("--digits-suffix <value>", "append digits")
  .option("--symbol-prefix <value>", "prepend symbols")
  .option("--symbol-suffix <value>", "append symbols")
  .option("--count <number>", "number of outputs")
  .option("--json", "output structured JSON")
  .action((input) => outputResult("passphrase", generatePassphrases(resolvePassphraseOptions(input), source), input.json));

generateCommand
  .command("key")
  .description("Generate key material or opaque secrets")
  .option("--bytes <number>", "number of random bytes")
  .option("--format <format>", "hex | base64 | raw-bytes")
  .option("--count <number>", "number of outputs")
  .option("--preset <id>", "apply a key preset")
  .option("--json", "output structured JSON")
  .action((input) => outputResult("key", generateKeyMaterial(resolveKeyOptions(input), source), input.json));

program
  .command("analyze")
  .description("Estimate entropy and brute-force difficulty from a known model")
  .option("--mode <mode>", "password | passphrase | key", "password")
  .option("--length <number>", "password length")
  .option("--charset-size <number>", "password charset size")
  .option("--words <number>", "passphrase word count")
  .option("--wordlist-size <number>", "passphrase wordlist size")
  .option("--bytes <number>", "key byte length")
  .option("--json", "output structured JSON")
  .action((input) => {
    const mode = input.mode;
    const analysis = mode === "passphrase"
      ? analyzePassphraseGuess(Number.parseInt(input.words ?? "6", 10), Number.parseInt(input.wordlistSize ?? String(defaultWordlist.words.length), 10))
      : mode === "key"
        ? analyzeKeyBytes(Number.parseInt(input.bytes ?? "32", 10))
        : analyzePasswordGuess(Number.parseInt(input.charsetSize ?? "72", 10), Number.parseInt(input.length ?? "20", 10));

    const payload = input.json
      ? JSON.stringify({ mode, analysis }, null, 2)
      : [
          `Mode: ${mode}`,
          `Entropy: ${analysis.entropyBits.toFixed(1)} bits`,
          `Search space: ${analysis.searchSpaceSize}`,
          `Strength: ${analysis.strength}`,
          analysis.classicalEstimate,
          analysis.quantumEstimate,
          analysis.explanation
        ].join("\n");
    process.stdout.write(`${payload}\n`);
  });

const presetsCommand = program.command("presets").description("List built-in presets");

presetsCommand
  .command("list")
  .description("List password and key presets")
  .option("--json", "output structured JSON")
  .action((input) => {
    const payload = {
      password: passwordPresets,
      key: keyPresets,
      passphraseWordlist: { id: defaultWordlist.id, label: defaultWordlist.label, size: defaultWordlist.words.length }
    };
    process.stdout.write(`${input.json ? JSON.stringify(payload, null, 2) : [
      "Password presets:",
      ...payload.password.map((preset) => `- ${preset.id}: ${preset.description}`),
      "",
      "Key presets:",
      ...payload.key.map((preset) => `- ${preset.id}: ${preset.description}`),
      "",
      `Passphrase wordlist: ${payload.passphraseWordlist.label} (${payload.passphraseWordlist.size} words)`
    ].join("\n")}\n`);
  });

program.parseAsync(process.argv);
