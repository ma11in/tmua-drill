# TMUA Mental Maths Drill

A free, [Zetamac](https://arithmetic.zetamac.com/)-style timed trainer for the mental-calculation skills the **TMUA** (Test of Mathematics for University Admission) expects you to do *without a calculator*.

Pick the skills you want, set a timer, and answer as many as you can. At the end you get your score, accuracy, per-skill breakdown, and a full review of every question with the correct answers.

**[▶ Live demo](https://YOUR-USERNAME.github.io/tmua-drill/)** ← replace this link after you deploy

---

## Why

Stock arithmetic trainers only cover +, −, ×, ÷. The TMUA needs much more held in your head: exact trig values, surd simplification, completing the square, discriminants, log evaluation, scaled Pythagorean triples, definite integrals, AP/GP sums, and so on. This tool drills all of those, and lets you isolate exactly which ones to practise.

The skill set was chosen by working through the official TMUA past papers (2016–2023) plus a recalled 2025 paper, tagging the mental-calculation type of every question, and keeping the *recall + fluency* skills (the things that should be automatic) rather than the multi-step problem-solving.

## Skills covered

12 groups, ~50 question generators:

- **Pure arithmetic** — addition, subtraction, multiplication, division, fractions, percentages
- **Recall** — squares (11²–25²), cubes, powers of 2, binomial coefficients
- **Number theory** — smallest prime factor, HCF/LCM, binary ↔ decimal
- **Surds** — simplify √n, rationalise denominators, expand (a + b√c)²
- **Algebra** — expand, factorise/solve quadratics, complete the square, discriminant, substitution, simultaneous equations, quadratic-inequality boundaries, modulus equations
- **Indices & logs** — index laws, solve aˣ = N, evaluate logs
- **Trigonometry** — exact values, double-angle (via Pythagorean triples), the sin²+cos²=1 identity, cosine rule, ½ab sin C area, counting solutions in an interval, period / max / min
- **Coordinate geometry** — distance (scaled triples), midpoint, perpendicular gradient, circle centre from general form
- **Calculus** — differentiate at a point, definite integrals, stationary points
- **Sequences** — AP sum, finite GP sum, GP sum to infinity
- **Functions** — composition, evaluating modulus expressions
- **Geometry formulas** — Pythagoras (scaled triples), circle area/circumference, regular-polygon interior angle

Four presets are built in: **Zetamac classic**, **TMUA Tier 1**, **+ Tier 2**, and **Everything**.

## How to use

- Type your answer and press **Enter**. Press **Tab** to skip (counts as wrong).
- **Input syntax:**
  - Square root: type `sqrt` or press **Shift+S** → √
  - Pi: type `pi` or press **Shift+P** → π
  - Fractions: `3/4` (decimals like `0.75` also accepted)
  - Surds: `2sqrt5`, `2√5`, or `2 sqrt 5` all work
  - Two answers (e.g. roots): `2,-3` — order doesn't matter
- A live preview renders your input as proper maths as you type.

## Running it locally

It's a single self-contained HTML file. Just open `index.html` in any modern browser — no install, no server, no internet required (after first load; it pulls the [KaTeX](https://katex.org/) maths-rendering library from a CDN).

## Tech

Plain HTML, CSS, and vanilla JavaScript. Maths rendered with KaTeX. No build step, no dependencies to install, no tracking, no accounts.

## Disclaimer

This is an independent, unofficial practice tool. It is **not affiliated with or endorsed by** Cambridge Assessment Admissions Testing, the University of Cambridge, or the TMUA. All question values are randomly generated.

## License

Free to use, copy, modify, and share.
