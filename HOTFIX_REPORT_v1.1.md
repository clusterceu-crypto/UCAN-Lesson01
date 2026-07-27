# UCAN Lesson 01 — Functional Hotfix v1.1 Report

## Scope

Controlled Correction Round 2 was completed exclusively from `UCAN_Lesson_01_Functional_Hotfix_v1.0_Checkpoint.zip`.

Google Drive, GitHub, legacy Lesson 01 packages, previous ZIP files, and external HTML/CSS/JS sources were not used.

## Changed files

- `index.html`
- `css/style.css`
- `js/script.js`
- `HOTFIX_REPORT_v1.1.md`

## Resolved defects

### DEFECT 1 — Reading minutes

Removed all 13 learner-facing `.time-hint` elements and the opening-page estimated-time block. No empty clock line or icon remains. Page numbering and block names were not changed.

### DEFECT 2 — Real direct PDF download

The button `Завантажити мою картку PDF` now creates the PDF programmatically. The implementation does not call `window.print()`, does not use browser print, and does not open Print Preview.

**PDF implementation**

1. The artifact is composed on browser canvas pages with an A4 aspect ratio.
2. Ukrainian text is rendered by the browser font stack.
3. Text width is measured and wrapped automatically.
4. Long values continue onto additional canvas pages.
5. Each canvas page is encoded to JPEG bytes.
6. A PDF 1.4 file is assembled in JavaScript with one image XObject per page.
7. A PDF Blob is downloaded through a temporary `<a download>` element.
8. JPEG conversion is synchronous inside the click handler so the download remains connected to the user action.

The PDF contains only:

- UCAN logo text;
- `Картка кліматичного виклику`;
- date;
- community name;
- all card fields;
- `Артефакт Портфеля мера`.

Browser QA generated a real PDF payload of 7,585,555 bytes. `pdfinfo` accepted the file and reported **10 pages**. The first and last pages were rendered to PNG and confirmed as non-blank. The intended filename captured from the download action was:

`Картка_кліматичного_виклику_Тестова_громада_2026-07-25.pdf`

### DEFECT 3 — AI helper prompts

All three scenarios are functional:

1. `Перевірити логіку картки`
2. `Допомогти уточнити формулювання`
3. `Перевірити реалістичність першого кроку`

Each scenario now has:

- a separate `Показати prompt` action;
- a visible full prompt;
- current card values inserted when displayed and copied;
- `Не заповнено` for empty fields;
- a separate `Скопіювати prompt` button;
- confirmation `Скопійовано`;
- the complete five-line safety instruction.

Browser QA confirmed that all three prompts were non-empty, contained current card data, contained the empty-field marker, and contained no `undefined` or `null` values.

### DEFECT 4 — Next lesson URL

The final button now uses the controlled temporary URL:

`https://clusterceu-crypto.github.io/UCAN-Lesson02`

The button uses the existing same-tab `window.location.assign()` navigation logic. Chromium recorded the exact navigation request in the current page target.

## Browser verification

Browser engine: `Chrome/144.0.7559.96`.

Test mode: actual Chromium execution and interaction through the DevTools Protocol. Because this environment blocks local HTTP and `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`, the unchanged lesson HTML, CSS, and JavaScript were loaded into a Chromium document-content harness. A browser-side localStorage-compatible store and clipboard-compatible interface were used so persistence and copy workflows could be exercised without changing production files.

| Test | Result | Evidence |
|---|---|---|
| Timing labels | PASS | No learner-facing minute labels or estimated-time block |
| Image lightbox | PASS | Click opens; Escape closes; body scroll lock toggles |
| Interactive Decision Gate | PASS | A remains locked; B opens practical task |
| Form persistence | PASS | Worksheet values restored from localStorage-compatible browser store |
| AI scenario logic | PASS | Prompt 1463 chars; data, empty marker, safety and copy verified |
| AI scenario wording | PASS | Prompt 1413 chars; data, empty marker, safety and copy verified |
| AI scenario first-step | PASS | Prompt 1522 chars; data, empty marker, safety and copy verified |
| AI service links | PASS | ChatGPT and Gemini actions preserved |
| Direct PDF download | PASS | Картка_кліматичного_виклику_Тестова_громада_2026-07-25.pdf (7585555 bytes); PDF bytes downloaded; print not called |
| Copy Artifact | PASS | Artifact text copied with community and fields |
| Lesson 02 navigation | PASS | https://clusterceu-crypto.github.io/UCAN-Lesson02 requested in current tab |
| JavaScript console | PASS | No Runtime exceptions or console.error entries |

## Explicit confirmations

- `window.print()` is absent from `index.html`, `style.css`, and `script.js`.
- Browser print and Print Preview are not used.
- A PDF payload was downloaded by Chromium and began with the `%PDF-` signature.
- Long Ukrainian answers produced 10 pages with automatic wrapping.
- The first and last PDF pages rendered successfully.
- All three prompt scenarios displayed non-empty text.
- All three prompt copy actions showed `Скопійовано` and copied the displayed prompt.
- Image Lightbox passed click, Escape, and body-scroll-lock checks.
- Interactive Decision Gate passed: A remained locked and B opened page 11.
- Worksheet persistence passed across browser lesson reinitialization.
- Copy Artifact passed.
- Lesson 02 generated the exact current-tab navigation request.
- No JavaScript runtime exception or `console.error` was recorded.

## Known limitations

- The input ZIP does not contain the referenced `assets` directory. No visual asset was added or modified. Lightbox behavior was tested with a temporary runtime image source; deployment still requires the approved PNG files at their existing relative paths.
- The environment blocks local HTTP and `file://` browser navigation. Therefore, browser QA used Chromium document-content injection rather than target hosting. Target-hosting review remains required.
- In the opaque browser harness, Chromium stored the downloaded evidence file on disk under the generic name `download`; the application’s actual `<a download>` value was captured and verified as `Картка_кліматичного_виклику_Тестова_громада_2026-07-25.pdf`.
- ChatGPT and Gemini links were checked for their exact href and target attributes. No authenticated external-service session was exercised.

## Final status

🟢 Ready for Target-Hosting Manual Review
