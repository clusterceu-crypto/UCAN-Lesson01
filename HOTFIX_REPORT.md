# UCAN Lesson 01 — Controlled Functional Hotfix v1.0 Report

**Date:** 2026-07-25  
**Source of Truth:** `UCAN_Lesson_01_Controlled_UX_Revision_v1.0_Checkpoint.zip`  
**Output:** `UCAN_Lesson_01_Functional_Hotfix_v1.0_Checkpoint.zip`

## 1. Changed files

| File | Change |
|---|---|
| `index.html` | Restored the three-scenario AI-helper interface; added PDF feedback region; moved the lightbox markup before script initialization. |
| `css/style.css` | Added functional layout rules for the three AI scenarios and strengthened modal/mobile interaction behavior. |
| `js/script.js` | Corrected lightbox operation; added three scenario-specific prompts; replaced Print Dialog behavior with direct Canvas-to-PDF generation; preserved existing gates, storage, navigation, and copy logic. |
| `CHANGE_LOG.md` | Added the Functional Hotfix v1.0 entry. |
| `MANUAL_VERIFICATION_STATUS.md` | Replaced the superseded verification status with current local functional results. |
| `HOTFIX_REPORT.md` | Added this report. |

## 2. Resolved defects

### FIX 1 — Image Lightbox

Resolved:

- opens on image click;
- supports keyboard activation with Enter or Space;
- closes with X;
- closes when the learner clicks outside the enlarged image;
- closes with Escape;
- locks body scrolling while open;
- restores focus to the triggering image;
- does not open a new tab.

Root cause corrected: the original script initialized before the modal markup existed in the parsed document.

### FIX 2 — AI Helper

Restored three learner-facing scenarios:

1. `Перевірити логіку картки`;
2. `Допомогти уточнити формулювання`;
3. `Перевірити реалістичність першого кроку`.

Each scenario now has:

- a separate complete prompt;
- a separate Copy button;
- current values from every practical-card field at the moment of copying;
- the required safety instruction;
- preserved `Відкрити ChatGPT` and `Відкрити Gemini` links.

### FIX 3 — PDF Export

Resolved:

- the PDF button no longer invokes `print()`, Print Preview, or the browser Print Dialog;
- the browser creates and downloads the PDF directly;
- Ukrainian text is rendered through browser Canvas and preserved as page imagery;
- long responses paginate across A4 pages;
- the filename follows:
  `Картка_кліматичного_виклику_<громада>_<YYYY-MM-DD>.pdf`.

The PDF contains only:

- UCAN logo treatment;
- artifact title;
- date;
- community;
- all card fields;
- `Артефакт Портфеля мера` marker.

## 3. Local verification

### Static verification

- JavaScript syntax passed.
- Required DOM elements and three AI scenario controls are present.
- The modal appears before the main script in the document.
- No active `window.print()` or `print()` call remains.
- The last lesson page is byte-for-byte unchanged.

**Final page SHA-256:**  
`5f50110940c61cea6c7234fc126097255e238fdf6649a7bf9a104da741d262fb`

### Controlled Chromium verification

Passed:

- desktop lightbox open/close behavior;
- mobile lightbox fit and Escape behavior;
- localStorage form persistence;
- Interactive Decision Gate regression;
- three distinct AI prompts with current data and safety instruction;
- direct PDF download and filename;
- absence of Print Dialog invocation;
- quiz and final-page navigation;
- artifact clipboard copy;
- controlled next-lesson placeholder;
- no JavaScript page or console errors.

### PDF verification

- test PDF size: 178,768 bytes;
- PDF version: 1.4;
- A4 page size: 595 × 842 pt;
- rendered successfully with the project PDF renderer;
- Ukrainian characters visually verified;
- long-answer stress test produced a valid 10-page PDF.

## 4. Regression status

| Check | Status |
|---|---|
| Last page unchanged | Passed |
| Practical fields work | Passed |
| Practical data save/restore | Passed |
| Interactive Decision Gate | Passed |
| Lesson navigation | Passed |
| Copy Artifact | Passed |
| Quiz gate | Passed |
| Controlled next-lesson behavior | Passed |

## 5. Known limitations

1. The supplied checkpoint ZIP does not contain the real `assets/` directory. The hotfix preserves all approved PNG references but does not add or alter PNG files. Lightbox logic was tested with controlled placeholder images.
2. The next-lesson URL remains the existing controlled empty placeholder because no verified URL was present in the source checkpoint.
3. Generated PDF pages are image-based. Ukrainian characters render correctly, but PDF text is not selectable or searchable.
4. Direct PDF generation requires a modern browser with Canvas, Blob, object URL, and download-attribute support.
5. A final manual review remains required in the real hosting/LMS environment with the production assets and deployment security policy.

## 6. Final status

🟢 Image Lightbox Fixed  
🟢 AI Helper Restored  
🟢 Direct PDF Export Added  
🟢 Regression Checks Passed  
🟢 Ready for target-hosting manual review
