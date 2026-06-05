# TMUA Mental Maths Drill

*Created by [ma11in](https://github.com/ma11in) · free & open-source (MIT)*

A free, [Zetamac](https://arithmetic.zetamac.com/)-style timed trainer for the mental-calculation skills the **TMUA** (Test of Mathematics for University Admission) expects you to do *without a calculator*.

Pick the skills you want, set a timer, choose random or adaptive practice, and answer as many as you can. At the end you get your score, accuracy, per-skill breakdown, and a full review of every question with the correct answers. Saved progress also tracks per-skill response-time, timeout, speed, and readiness diagnostics.

**[▶ Live demo](https://ma11in.github.io/tmua-drill/)**

---

## Why

Stock arithmetic trainers only cover +, −, ×, ÷. The TMUA needs much more held in your head: exact trig values, surd simplification, completing the square, discriminants, log evaluation, scaled Pythagorean triples, definite integrals, AP/GP sums, and so on. This tool drills a broad set of those no-calculator fluency moves, and lets you isolate exactly which ones to practise.

The skill set is designed with reference to the official TMUA specification, Notes on Logic and Proof, and official/specimen/practice papers. It focuses on the *recall + fluency* layer (the things that should be automatic), not full multi-step MCQ modelling or a complete Paper 2 proof course. See [`docs/source-map.json`](docs/source-map.json) for the generator-by-generator coverage map.

## Skills covered

13 groups of question generators:

- **Pure arithmetic** — addition, subtraction, multiplication, division, fractions, percentages
- **Recall** — squares (11²–25²), cubes, powers of 2, binomial coefficients
- **Number theory** — smallest prime factor, HCF/LCM, binary ↔ decimal
- **Surds** — simplify √n, rationalise denominators, expand (a + b√c)²
- **Algebra** — expand, factorise/solve quadratics, complete the square, discriminant, substitution, remainder theorem, simultaneous equations, quadratic-inequality boundaries, modulus equations
- **Indices & logs** — index laws, solve aˣ = N, evaluate logs
- **Trigonometry** — exact values, double-angle (via Pythagorean triples), the sin²+cos²=1 identity, cosine rule, ½ab sin C area, counting solutions in an interval, period / max / min
- **Coordinate geometry** — distance (scaled triples), midpoint, perpendicular gradient, straight-line equation facts, circle centre/radius from general form
- **Calculus** — differentiate at a point, definite integrals, trapezium-rule estimates, stationary points
- **Sequences** — AP sum, recurrence terms, finite GP sum, GP sum to infinity
- **Functions** — composition, evaluating modulus expressions
- **Geometry formulas** — Pythagoras (scaled triples), circle area/circumference, arc/sector formulae in radians, regular-polygon interior angle
- **Logic & proof fluency** — necessary/sufficient direction, if/only-if/iff translation, converse/contrapositive, compound negation, quantifier negation, counterexample patterns, proof-error spotting

Four presets are built in: **Zetamac classic**, **TMUA Tier 1**, **+ Tier 2**, and **Everything**.

## How to use this in TMUA prep

Use this as a fluency supplement, not as a replacement for timed TMUA papers.

- Do short daily drills to make routine no-calculator moves automatic.
- Use **Weakness-weighted** mode when you want the app to bias practice toward slower or less accurate skills.
- Use **Review recent misses** after a session to replay questions you got wrong or timed out on.
- Keep doing official specimen/practice/past papers under timed conditions for full MCQ strategy, multi-step reasoning, and Paper 2 proof practice.

## How to use

- Type your answer and press **Enter**. Press **Esc** to skip (counts as wrong).
- Use **Random mix** for benchmarking, **Weakness-weighted** to bias future questions towards weaker or slower skills, or **Review recent misses** to replay questions you previously got wrong or timed out on.
- **Input syntax:**
  - Square root: type `sqrt`, press **Shift+S**, or use the √ helper button
  - Pi: type `pi`, press **Shift+P**, or use the π helper button
  - Fractions: `3/4` (decimals like `0.75` also accepted)
  - Surds: `2sqrt5`, `2√5`, or `2 sqrt 5` all work
  - Two answers (e.g. roots): `2,-3` — order doesn't matter
- A live preview renders your input as proper maths as you type.

## Running it locally

It's a single self-contained HTML file. Just open `index.html` in any modern browser — no install, no server, no internet required. The [KaTeX](https://katex.org/) maths-rendering library and fonts are bundled into the file; the app does not fetch KaTeX from a CDN at runtime.

Gameplay works when opening the file directly. Saved progress uses browser `localStorage`; on `file://` URLs, persistence behaviour can vary by browser. For the most reliable saved history, serve the folder over HTTP, for example with `python -m http.server`.

Progress is saved per browser/device. If you clear browser data, saved progress disappears.

Use the Progress screen to export JSON backups, import a JSON backup, or export CSV for spreadsheet analysis.

The score counts submitted answers only. If time expires with a question still on screen, that question is shown in the recap as timed out and unscored.

## Tech

Plain HTML, CSS, and vanilla JavaScript. Maths rendered with KaTeX. No build step, no dependencies to install, no tracking, no accounts.

## Testing

Run the local regression harness with:

```bash
node tests/regression.mjs
```

It checks answer-normalisation regressions, generated canonical answers and alternatives, generated-format invariants, inequality equivalence and complement rejection, seeded generation for every generator, skill-group wiring, storage sanitisation, timeout diagnostics, per-skill timing aggregation, miss replay hooks, export/import controls, and accessibility hooks.

## Disclaimer

This is an independent, unofficial practice tool. It is **not affiliated with or endorsed by** Cambridge Assessment Admissions Testing, the University of Cambridge, or the TMUA. All question values are randomly generated.

## License

© 2026 ma11in. Released under the [MIT License](LICENSE) — you're free to use, modify, and share it, but you must keep the copyright and license notice (i.e. credit the author).
