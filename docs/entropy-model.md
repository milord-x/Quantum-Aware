# Entropy Model

## Overview

Quantum-Aware estimates entropy under the assumption of uniform secure randomness.

## Passwords

For random passwords, the model is:

`entropy = log2(charset_size) * length`

This assumes each position is selected independently from the same effective charset.

## Passphrases

For passphrases, the model is:

`entropy = log2(wordlist_size) * word_count`

Prefix and suffix formatting can help with compatibility and memorability, but the base estimate comes from word choice count.

## Key material

For raw random bytes, the model is:

`entropy = bytes * 8`

This is the cleanest estimate because each byte is assumed to come directly from a cryptographically secure random source.

## Strength thresholds

- `Weak`: under 50 bits
- `Moderate`: 50 to under 72 bits
- `Strong`: 72 to under 96 bits
- `Very Strong`: 96 to under 128 bits
- `Extreme`: 128 bits and above

These are intentionally conservative labels for user guidance.

## Quantum-adjusted estimate

The quantum-adjusted view is a simplified educational approximation inspired by Grover-style search. A common shorthand is that generic search pressure may behave more like roughly half the classical bit margin.

This is not a guarantee that a practical quantum brute-force attack exists for every secret, nor does it apply equally to every protocol or storage model.
