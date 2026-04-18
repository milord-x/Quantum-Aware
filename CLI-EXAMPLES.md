# Quantum-Aware CLI Examples

Short examples for the `qa` command.

## Passwords

```bash
qa generate password --length 24
qa generate password --preset balanced
qa generate password --preset developer-strong --json
```

## Passphrases

```bash
qa generate passphrase --words 5
qa generate passphrase --words 6 --json
qa generate passphrase --words 4 --separator=-
```

## Key material

```bash
qa generate key --bytes 32
qa generate key --bytes 32 --json
qa generate key --bytes 64 --preset api-token
```

## Analysis helpers

```bash
qa analyze --mode password --length 20 --charset-size 72
qa presets list
```

## Notes

- Prefer JSON output when piping results into other tools.
- Treat generated values as secrets even if they are only for testing.
- Re-run generation instead of reusing sample values shown in screenshots or docs.
