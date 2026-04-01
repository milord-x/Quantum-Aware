import type { RandomSource } from "./types";

interface WebCryptoLike {
  getRandomValues<T extends ArrayBufferView | null>(array: T): T;
}

export class NodeRandomSource implements RandomSource {
  randomBytes(length: number): Uint8Array {
    const output = new Uint8Array(length);
    globalThis.crypto.getRandomValues(output);
    return output;
  }
}

export class WebRandomSource implements RandomSource {
  private readonly cryptoApi: WebCryptoLike;

  constructor(cryptoApi: WebCryptoLike = globalThis.crypto as WebCryptoLike) {
    this.cryptoApi = cryptoApi;
  }

  randomBytes(length: number): Uint8Array {
    const output = new Uint8Array(length);
    this.cryptoApi.getRandomValues(output);
    return output;
  }
}

export function randomIndex(limit: number, source: RandomSource): number {
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error("Random selection limit must be a positive integer.");
  }

  const maxUint32 = 0x1_0000_0000;
  const threshold = maxUint32 - (maxUint32 % limit);

  while (true) {
    const bytes = source.randomBytes(4);
    const value = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(0, false);
    if (value < threshold) {
      return value % limit;
    }
  }
}

export function secureShuffle<T>(values: T[], source: RandomSource): T[] {
  const items = [...values];
  for (let index = items.length - 1; index > 0; index -= 1) {
    const nextIndex = randomIndex(index + 1, source);
    [items[index], items[nextIndex]] = [items[nextIndex] as T, items[index] as T];
  }
  return items;
}

export function pickFromCharset(charset: string, source: RandomSource): string {
  return charset[randomIndex(charset.length, source)] ?? "";
}
