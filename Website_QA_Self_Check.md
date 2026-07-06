# Website QA Self-Check — UCAN Lesson 01

## Self-check summary
Static self-check completed after UX/LX corrections. This is not a final Website QA decision.

| QA area | Status | Notes |
|---|---|---|
| Final Lesson alignment | Closed | Lesson title, main idea, practical result, test and practical task retained. |
| Legacy content absence | Closed | No legacy HTML or old practical artifact introduced during this correction build. |
| Ukrainian interface | Closed | Navigation, buttons, labels, messages and page titles remain Ukrainian. |
| Navigation order | Closed | Page order is now: Початок; Карта заняття; Навіщо Вам це заняття; Теоретичний блок 1; Теоретичний блок 2; Приклади міст; Управлінська логіка Smart City; Типова помилка; Корисні ресурси; Практична ситуація; Практичне завдання; Перевірка знань; Підсумок і наступний крок. |
| Progress indicators | Closed | Progress is calculated dynamically from the 13 screen sequence. |
| PDF / print export | Closed | Export button remains visible; preview updates before print; print document includes all participant answers. |
| Knowledge Check Gate | Closed | Final page remains locked until quiz is passed; quizPassed state is stored in localStorage. |
| localStorage | Closed | Worksheet and reflection inputs, current page, highest page and quiz status remain stored. |
| External resources | Closed | Existing resource links open in a new tab with rel="noopener noreferrer". |
| Approved assets | Closed | Only A01-A05 approved visual assets are referenced. |
| Mobile | Closed | Responsive styles retained; wide tables include horizontal scroll hints. |
| Accessibility | Closed | Skip link, semantic sections, alt text, table scopes and focus styles retained. |
| Placeholder governance | Closed | Video, official sources and AI consultant remain clearly marked as placeholders without unsupported URLs. |

## Static checks performed
- 13 lesson screens detected.
- Resources page detected before Practical Situation.
- Four transition notes detected.
- Required UX blocks detected: capabilities, time, recommended videos, portfolio, AI consultant.
- Approved image paths confirmed in local `/assets` folder.
- JavaScript syntax check passed with `node -c`.

## Known deferred items
- Browser-level click-through QA should still be completed by Final Website QA.
- SVS verification is required before replacing city-source placeholders.
- Video Integration Matrix is required before adding real video metadata or URLs.
