# UCAN Lesson 01 — Shared Runtime Migration Candidate v1.0

**Repository:** `clusterceu-crypto/UCAN-Lesson01`  
**Source baseline:** `develop@9b065c7dc6aba5f908da65b6dc6053a4b9404461`  
**Migration branch:** `migration/shared-runtime-v1.0`  
**Shared Runtime:** UCAN Shared Runtime v1.0  
**Runtime package SHA-256:** `bdfa455153dcc2ba6465ae0db8d2081494b47d9bd5c217ae2af653ee0f1a3c56`

## Status

Migration candidate. Not merged to `develop`, not promoted to `main`, and not an official Lesson 01 release.

## Architecture

```text
UCAN Shared Runtime v1.0
+ Lesson 01 configuration
+ Lesson 01-specific code
+ canonical Lesson 01 content and approved assets
```

The shared runtime files are integrated byte-for-byte. Lesson-specific semantics, including the Decision Gate approved answer and quiz keys, remain in `js/lesson.config.js` and `js/lesson.js`.

## Candidate verification

```bash
npm test
npm run test:static
npm run test:browser
```

Browser QA writes generated evidence under `test-results/`, which is excluded from the frozen candidate tree.

The candidate manifest is generated last and excludes only itself from its hash list. Historical Lesson 01 release evidence remains retained for audit history and does not define the migration candidate identity.

## Release boundary

No merge, tag, deployment, or official release promotion is authorized by this candidate alone.
