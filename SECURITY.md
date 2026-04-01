# Security Policy

## Reporting a vulnerability

If you believe you have found a security issue in Quantum-Aware, please report it privately to the maintainers before public disclosure. Include:

- affected version or commit
- reproduction steps
- expected impact
- any suggested remediation if available

Do not include real secrets in reports.

## In scope

- insecure secret generation
- incorrect use of cryptographic randomness APIs
- accidental remote transmission or persistence of generated values
- clipboard handling issues that unnecessarily retain secret material
- misleading security claims in code or documentation

## Out of scope

- vulnerabilities in third-party tools outside the repository unless directly caused by this project
- issues requiring browser extensions, malware, or local machine compromise unless Quantum-Aware meaningfully worsens the risk
- theoretical claims without a concrete implementation issue

## Audit status

Quantum-Aware is not audited unless a release explicitly states otherwise. Treat the project as open source software that should be reviewed and tested before use in high-stakes environments.

## Supported versions

Only the latest main branch and latest tagged release should be considered for security fixes.
