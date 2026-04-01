# Contributing

Thanks for helping improve Quantum-Aware.

## Principles

- Keep security wording conservative and technically honest
- Never replace secure randomness with convenience APIs such as `Math.random()`
- Avoid adding telemetry, analytics, or remote storage
- Keep generated values local unless a user explicitly exports them outside the project
- Prefer shared logic in `packages/core`

## Setup

```bash
npm install
npm run build -w @quantum-aware/core
```

## Workflow

```bash
npm test
npm run build
```

## Pull requests

- Explain the security impact of your change
- Update docs when user-facing behavior changes
- Add or update tests for core logic and CLI behavior
- Avoid overstated language such as "unbreakable" or "quantum-proof"
