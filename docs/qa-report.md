# QA Report

Date: 2026-06-05

## Summary

This pass checks the prep-ready sharing changes: source-backed scope wording, regression coverage, rendered desktop/mobile layout, expanded logic multiple-choice display, results recap, progress view, recent-miss review mode, and progress import/replay safeguards.

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
- miss replay hooks with generator version, answer, and signature metadata;
- stale replay fallback so outdated replay candidates cannot leak through after retries;
- import deduplication by session ID;
- export/import controls;
- accessibility hooks;
- richer logic prompt coverage and fresh-question repeat guard;
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
| Desktop setup screen | Passed: title, scope disclaimer, 73 skill checkboxes, and the three practice modes rendered; no horizontal overflow detected. |
| Desktop preset labels | Passed: Tier 2 label now reads `+ Tier 2 (coords + calc + sequences + logic)`. |
| Desktop logic-only game | Passed: answer input focused, logic choices rendered as separate tiles, and submitting `A` advanced the question while updating the wrong count. |
| Desktop expanded logic prompts | Passed: sampled prompts included only-if/iff translation, compound contrapositive/negation, and proof-error spotting; no consecutive duplicate prompt appeared in the sampled run. |
| Desktop results recap | Passed: timed-out question shown as unscored, recap preserved logic choices, and skill breakdown rendered. |
| Desktop progress view | Passed: progress screen rendered with chart/table area, best panel, and JSON/CSV/import controls. |
| Mobile setup screen | Passed: skill grid collapsed to one column; no horizontal overflow detected. |
| Mobile logic-only game | Passed: logic choices rendered as one-column tiles within the viewport; no horizontal overflow detected. |
| Review recent misses | Passed: after a saved miss, `Review recent misses` started a review game and rendered the missed logic question. |
| Console health | Passed: no browser console errors or warnings observed during the tested flows. |

## Remaining Unverified

- Real Firefox and Safari rendering; this pass used the Codex in-app Browser only.
- GitHub Pages rendering after the draft PR is merged.
- Full manual import/export file round-trip with user-selected files.
- Long multi-session history behaviour after months of saved sessions.
- Screen-reader behaviour with actual assistive technology, beyond DOM/live-region checks.
