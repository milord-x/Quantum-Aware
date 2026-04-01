import { assessEntropy, entropyFromBytes, entropyFromCharset, entropyFromWordlist } from "./analysis";

export function analyzePasswordGuess(charsetSize: number, length: number) {
  if (charsetSize <= 0 || length <= 0) {
    throw new Error("Charset size and length must be positive.");
  }
  return assessEntropy(entropyFromCharset(charsetSize, length), "password");
}

export function analyzePassphraseGuess(wordCount: number, listSize: number) {
  if (wordCount <= 0 || listSize <= 1) {
    throw new Error("Word count must be positive and list size must be at least two.");
  }
  return assessEntropy(entropyFromWordlist(wordCount, listSize), "passphrase");
}

export function analyzeKeyBytes(bytes: number) {
  if (bytes <= 0) {
    throw new Error("Byte length must be positive.");
  }
  return assessEntropy(entropyFromBytes(bytes), "key material");
}
