# Threat Model

## Goals

Quantum-Aware aims to improve the quality of locally generated secrets and help users reason about brute-force difficulty.

## Primary protections

- strong randomness from platform cryptographic APIs
- larger search spaces through configurable secret generation
- local-only operation with no backend or telemetry
- plain-language guidance on safe storage

## Threats considered

- attackers attempting offline brute-force guessing against leaked password hashes or opaque secrets
- users choosing weak lengths or overly small key sizes
- confusion around claims that quantum computing makes brute-force trivial
- accidental disclosure through logging or remote transmission

## Threats not solved

- phishing and social engineering
- malware, keyloggers, or clipboard stealers on the endpoint
- compromised browsers, operating systems, or developer workstations
- weak account recovery flows or server-side policy failures
- misuse of generated secrets after they leave the tool

## Design consequences

- no backend is required
- generated values are not uploaded
- copy actions are explicit and minimal
- wording stays conservative about future attack models
