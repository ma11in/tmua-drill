# QA Report

Date: 2026-06-05

## Summary

This pass checks the prep-ready sharing changes: source-backed scope wording, regression coverage, rendered desktop/mobile layout, logic multiple-choice display, results recap, progress view, and recent-miss review mode.

Verdict: **passed for the tested surfaces**. The app is suitable to describe as a TMUA no-calculator fluency supplement, not a full TMUA paper simulator.

## Sources Checked

- Local: `tmua papers/TMUA Specification 2021.pdf`
- Local: `tmua papers/TMUA Notes on Logic and Proof 2021.pdf`
- Official web, checked 2026-06-05: `https://esat-tmua.ac.uk/about-the-tests/tmua-test/`
- Official web, checked 2026-06-05: `https://esat-tmua.ac.uk/prepare/`

## Automated Checks

Command:

```bash
node tests/regression.mjs
```

Result:

```txt
ok: regression checks passed
```

The regression harness now checks:

- answer-normalisation regressions;
- generated canonical answers and alternatives;
- generated-format invariants;
- inequality equivalence and complement rejection;
- seeded generation for every generator;
- skill-group wiring;
- storage sanitisation;
- timeout diagnostics;
- per-skill timing aggregation;
- miss replay hooks;
- export/import controls;
- accessibility hooks;
- README source-map links and app scope disclaimer;
- every generator in `index.html` has one entry in `docs/source-map.json`;
- every source-map entry has a valid claim level and resolved source reference.

## Browser QA

Environment:

- Local preview URL: `http://127.0.0.1:8765/`
- Browser surface: Codex in-app Browser
- Desktop viewport: default `1280px` wide viewport
- Mobile viewport: `390px x 844px`

Checks:

| Surface | Result |
|---|---|
| Desktop setup screen | Passed: title, scope disclaimer, 69 skill checkboxes, and the three practice modes rendered; no horizontal overflow detected. |
| Desktop logic-only game | Passed: answer input focused, four logic choices rendered as separate tiles, and submitting `A` advanced the question while updating the wrong count. |
| Desktop results recap | Passed: timed-out question shown as unscored, recap preserved logic choices, and skill breakdown rendered. |
| Desktop progress view | Passed: progress screen rendered with chart/table area, best panel, and JSON/CSV/import controls. |
| Mobile setup screen | Passed: skill grid collapsed to one column; no horizontal overflow detected. |
| Mobile logic-only game | Passed: four logic choices rendered as one-column tiles within the viewport; no horizontal overflow detected. |
| Review recent misses | Passed: after a saved miss, `Review recent misses` started a review game and rendered the missed logic question. |
| Console health | Passed: no browser console errors or warnings observed during the tested flows. |

## Remaining Unverified

- Real Firefox and Safari rendering; this pass used the Codex in-app Browser only.
- GitHub Pages rendering after the draft PR is merged.
- Full manual import/export file round-trip with user-selected files.
- Long multi-session history behaviour after months of saved sessions.
- Screen-reader behaviour with actual assistive technology, beyond DOM/live-region checks.
