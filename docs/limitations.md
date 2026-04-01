# Limitations

Quantum-Aware helps generate stronger secrets, but it has important limits.

## Technical limits

- Entropy estimates depend on secure randomness and model assumptions
- Password presets cannot know the hash policy, rate limits, or attack surface of a third-party service
- Quantum-adjusted estimates are intentionally simplified and should not be treated as predictions
- The built-in passphrase wordlist is modest and can be expanded in future versions

## Operational limits

- Strong secrets can still be stolen by phishing, malware, or social engineering
- Clipboard copying can expose secrets to other local software on a compromised machine
- Reuse across systems still creates avoidable risk
- Poor storage practices can undo the benefit of strong generation

## Product limits

- No browser extension or native secure storage integration yet
- No server-side policy validation for third-party sites
- No post-quantum public-key cryptography features
