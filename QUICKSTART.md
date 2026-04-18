# Quantum-Aware Quick Start

A minimal local workflow for checking that both the web app and CLI are wired correctly.

## 1. Install dependencies

```bash
npm install
```

## 2. Run the web app

```bash
npm run dev:web
```

Open the local URL printed by Vite.

## 3. Run the CLI

```bash
npm run dev:cli -- generate password --length 20
```

## 4. Run the test suite

```bash
npm test
```

## 5. Build the full workspace

```bash
npm run build
```

## Fast verification checklist

- web app starts without runtime errors
- CLI prints generated output locally
- tests pass
- production build completes

## Common reminder

Quantum-Aware is local-first. Generated values should stay on the current machine unless the user explicitly exports them.
