# UI Harmonization Change Log — Lesson 01

Candidate: UCAN Lesson 01 UI Harmonized Candidate v1.0  
Date: 2026-07-23

Interface changes: canonical header/page label/progress/reset; fixed bottom navigation; shared card/button/responsive layer; direct local PDF with single action “Зберегти PDF”; accessible AI preview/copy and official platform links; privacy/status/focus support.

Preserved: 13 pages, educational text, fields, decision gate, quiz options and keys, AI prompt substance, external evidence links, approved assets and alt text.

Source release was not overwritten.

## AI Support Page Harmonization Sprint 01

### AIH-L01-001
- **File:** index.html
- **Element:** AI Support Page
- **Previous state:** AI block embedded in practical page with one generic prompt.
- **New state:** Dedicated page after practice and before test with three canonical modes, visible preview, one copy action, official external actions and visible safety boundary.
- **Reason:** Canonical AI Support Page contract.
- **Content impact:** None outside the AI Support Page; practical artifact fields and approved subject context preserved.
- **Functional impact:** Page count increases by one; test and completion logic remain keyed to existing page IDs.
- **Regression status:** Static and targeted browser QA required/completed in Sprint evidence.

### AIH-L01-002
- **File:** js/script.js
- **Element:** AI prompt behavior
- **Previous state:** Single generic prompt builder.
- **New state:** Mode-aware prompt builder using unchanged practical fields and current localStorage reads.
- **Reason:** Canonical AI Support Page contract.
- **Content impact:** None outside the AI Support Page; practical artifact fields and approved subject context preserved.
- **Functional impact:** No new persistence; learner-triggered copy only.
- **Regression status:** Static and targeted browser QA required/completed in Sprint evidence.


## Interface Harmonization Sprint 02
- IH02-L01-001: AI Support moved into the practical artifact page; separate AI page removed. Content impact: none outside approved AI interface copy.
- IH02-L01-002: third AI mode changed to completeness and weak-point review; prompt does not rewrite or shorten learner work.
- IH02-L01-003: page headers standardized to block label + title + optional lead; duplicate time/page-number display removed.
- IH02-L01-004: page route/count recalculated automatically after page removal. Regression status: pending final QA.
