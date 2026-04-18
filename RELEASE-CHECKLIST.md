# Quantum-Aware Release Checklist

A lightweight checklist for tagging or publishing a release.

## Before release

- confirm `npm test` passes
- confirm `npm run build` passes
- verify web app still runs locally with `npm run dev:web`
- verify CLI examples still work with `npm run dev:cli`
- review wording for conservative security claims
- check that no generated secrets or local test artifacts were committed

## Documentation review

- update `README.md` if CLI flags or UX changed
- update `SECURITY.md` if disclosure expectations changed
- update screenshots only if they reflect current behavior

## Publish review

- confirm version bump is intentional
- confirm package metadata matches current project state
- confirm GitHub Pages configuration still matches the repository path

## Final sanity check

- release notes describe user-visible changes only
- no language such as "unbreakable" or "quantum-proof"
- latest tag points to a clean, buildable commit
