# quantum-aware

CLI package for Quantum-Aware.

Global install:

```bash
npm install -g quantum-aware
```

Usage:

```bash
qa generate password --length 20
qa generate passphrase --words 6
qa generate key --bytes 32 --json
```

This CLI generates values locally and provides conservative classical and quantum-aware brute-force estimates.
