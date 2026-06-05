import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const sourceMap = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'source-map.json'), 'utf8'));
const katexMatch = html.match(/<script id="katex-bundled-js">([\s\S]*?)<\/script>/);
if (!katexMatch) throw new Error('Could not find bundled KaTeX script in index.html');
const match = html.match(/<script>\n([\s\S]*?)\n<\/script>\n<\/body>/);
if (!match) throw new Error('Could not find app script in index.html');

const katexCode = katexMatch[1];
const app = match[1];
new Function(app);

const core = app.slice(0, app.indexOf('//=========================================================\n// UI POPULATION'));
const progressStart = app.indexOf('const STORE_KEY');
const progressEnd = app.indexOf('function renderBestPanel');
const storage = { value: null };
const ctx = {
  document: { getElementById() {}, querySelectorAll() {} },
  localStorage: {
    getItem() { return storage.value; },
    setItem(_key, value) { storage.value = value; }
  }
};

vm.createContext(ctx);
vm.runInContext(katexCode, ctx);
vm.runInContext(
  core +
  '\nthis.GENERATORS=GENERATORS; this.GROUPS=GROUPS; this.checkAnswer=checkAnswer; this.withSeededRandom=withSeededRandom; this.state={history:[], duration:120, score:99, right:99}; ' +
  app.slice(progressStart, progressEnd) +
  '\nthis.loadHistory=loadHistory; this.saveHistory=saveHistory; this.recordSession=recordSession; this.aggregateSkillStats=aggregateSkillStats; this.HISTORY_SCHEMA_VERSION=HISTORY_SCHEMA_VERSION;',
  ctx
);

const checks = {
  unsimplifiedSurdRejected:
    !ctx.checkAnswer('sqrt72', { answer: '6sqrt2', alts: ['6sqrt(2)', '6√2', '6 sqrt 2'], kind: 'expr' }),
  exactTrigDecimalRejected:
    !ctx.checkAnswer('0.5', { answer: '1/2', kind: 'expr', exactOnly: true }),
  unicodeMinusAccepted:
    ctx.checkAnswer('−3', { answer: '-3', kind: 'numeric' }),
  reverseInequalityAccepted:
    ctx.checkAnswer('6>x', { answer: 'x<6', kind: 'expr' }),
  boundedInequalityAccepted:
    ctx.checkAnswer('x>2 and x<3', { answer: '2,3', alts: ['3,2', '2<x<3'], kind: 'pair' }),
  outsideInequalityAccepted:
    ctx.checkAnswer('x>3 or x<2', { answer: 'x<2 or x>3', kind: 'expr' }),
  outsideInequalityComplementRejected:
    !ctx.checkAnswer('x>2 or x<3', { answer: 'x<2 or x>3', kind: 'expr' }),
  outsideInequalityWideComplementRejected:
    !ctx.checkAnswer('x<3 or x>2', { answer: 'x<2 or x>3', kind: 'expr' }),
  outsideInequalityReversedOrderAccepted:
    ctx.checkAnswer('x>7 or x<1', { answer: 'x<1 or x>7', kind: 'expr' }),
  outsideInequalityReviewComplementRejected:
    !ctx.checkAnswer('x>1 or x<7', { answer: 'x<1 or x>7', kind: 'expr' }),
  outsideInequalityReviewWideComplementRejected:
    !ctx.checkAnswer('x<7 or x>1', { answer: 'x<1 or x>7', kind: 'expr' }),
  contradictoryInequalityRejected:
    !ctx.checkAnswer('x>3 and x<2', { answer: '2<x<3', kind: 'expr' }),
  malformedSessionDropped: (() => {
    storage.value = JSON.stringify([
      { t: 1, dur: 120, score: 2, right: 2, wrong: 0, perMin: 1, acc: 100, byGroup: { arith: { r: 2, n: 2 } }, misses: [{ key: 'add', seed: 'abc', t: 1 }] },
      { t: 'bad' }
    ]);
    const hist = ctx.loadHistory();
    return hist.length === 1 &&
      hist[0].byGroup.arith.r === 2 &&
      hist[0].unscored === 0 &&
      hist[0].misses.length === 1 &&
      hist[0].misses[0].seed === 'abc';
  })(),
  recordSessionUsesDerivedSkillTiming: (() => {
    storage.value = '[]';
    ctx.state.history = [
      { key: 'add', seed: 'right-seed', correct: true, scored: true, ms: 1200, t: 10 },
      { key: 'add', seed: 'wrong-seed', correct: false, scored: true, ms: 2400, t: 20 },
      { key: 'add', seed: 'timeout-seed', correct: false, scored: false, ms: 3000, t: 30 }
    ];
    const rec = ctx.recordSession().rec;
    return rec.schemaVersion === ctx.HISTORY_SCHEMA_VERSION &&
      rec.score === 1 &&
      rec.right === 1 &&
      rec.wrong === 1 &&
      rec.unscored === 1 &&
      rec.perMin === 0.5 &&
      rec.acc === 50 &&
      rec.byGroup.arith.n === 2 &&
      rec.bySkill.add.n === 2 &&
      rec.bySkill.add.r === 1 &&
      rec.bySkill.add.timedOut === 1 &&
      rec.bySkill.add.medianMs === 2400 &&
      rec.bySkill.add.meanMs === 2200 &&
      rec.bySkill.add.lastSeen === 30 &&
      rec.bySkill.add.recent.join(',') === 'true,false,false' &&
      rec.misses.length === 2 &&
      rec.misses.map(m => m.seed).join(',') === 'wrong-seed,timeout-seed';
  })(),
  seededGenerationIsRepeatable: (() => {
    const q1 = ctx.withSeededRandom('fixed-seed', () => ctx.GENERATORS.factorRoots.generate());
    const q2 = ctx.withSeededRandom('fixed-seed', () => ctx.GENERATORS.factorRoots.generate());
    return JSON.stringify(q1) === JSON.stringify(q2) && ctx.checkAnswer(q1.answer, q1);
  })(),
  aggregateSkillTimingUsesSamplesNotMedianOfMedians: (() => {
    storage.value = JSON.stringify([
      {
        t: 1, dur: 120, score: 0, right: 0, wrong: 1, unscored: 0, perMin: 0, acc: 0,
        byGroup: {},
        bySkill: {
          add: {
            r: 0, n: 1, timedOut: 0,
            totalMs: 20000, timeN: 1,
            fastestMs: 20000, slowestMs: 20000,
            samplesMs: [20000], medianMs: 20000, recent: [false], lastSeen: 1
          }
        }
      },
      {
        t: 2, dur: 120, score: 40, right: 40, wrong: 0, unscored: 0, perMin: 20, acc: 100,
        byGroup: {},
        bySkill: {
          add: {
            r: 40, n: 40, timedOut: 0,
            totalMs: 120000, timeN: 40,
            fastestMs: 3000, slowestMs: 3000,
            samplesMs: Array(20).fill(3000), medianMs: 3000, recent: Array(10).fill(true), lastSeen: 2
          }
        }
      }
    ]);
    const hist = ctx.loadHistory();
    const agg = ctx.aggregateSkillStats(hist).add;
    return agg.n === 41 && agg.r === 40 && agg.medianMs === 3000 && agg.meanMs === 3415;
  })(),
  adaptivePickerUsesCachedStats: (() => {
    const match = app.match(/function chooseQuestionKey\(\) \{([\s\S]*?)\n\}\n\nfunction renderTeX/);
    return !!match &&
      match[1].includes('state.adaptiveStats') &&
      !match[1].includes('loadHistory') &&
      !match[1].includes('aggregateSkillStatsFromHistory');
  })(),
  reviewRecentMissesLabelPresent:
    html.includes('<option value="misses">Review recent misses</option>'),
  reviewQueueAndSeededQuestionsPresent:
    app.includes('function buildReviewQueue') &&
    app.includes('function generateQuestion') &&
    app.includes('state.reviewQueue') &&
    app.includes('seed: state.current.seed'),
  noImmediateFreshRepeatGuardPresent:
    app.includes('lastQuestionSignature') &&
    app.includes('function questionSignature') &&
    app.includes('attempt < 8') &&
    app.includes('spec.replay || questionSignature(q) !== state.lastQuestionSignature'),
  sourceBackedGeneratorAddsPresent:
    ['remainderTheorem', 'lineEquation', 'trapeziumRule', 'recurrenceTerm', 'arcSector',
     'necessarySufficient', 'converseContrapositive', 'quantifierNegation', 'counterexamplePattern']
      .every(key => !!ctx.GENERATORS[key]),
  everyGeneratorAppearsOnceInGroups: (() => {
    const listed = ctx.GROUPS.flatMap(g => g.items);
    const unique = new Set(listed);
    return listed.length === unique.size &&
      Object.keys(ctx.GENERATORS).every(key => unique.has(key)) &&
      listed.every(key => !!ctx.GENERATORS[key]);
  })(),
  logicAnswerPromptsAccepted:
    ctx.checkAnswer('sufficient', { answer: 'sufficient', alts: ['suff'], kind: 'expr', exactOnly: true }) &&
    ctx.checkAnswer('a', { answer: 'A', kind: 'expr', exactOnly: true }),
  logicChoicesAreStructured: (() => {
    const logicKeys = ['necessarySufficient', 'converseContrapositive', 'quantifierNegation', 'counterexamplePattern'];
    for (const key of logicKeys) {
      for (let i = 0; i < 25; i++) {
        const q = ctx.withSeededRandom(`${key}-choice-shape-${i}`, () => ctx.GENERATORS[key].generate());
        if (!q.prompt || !Array.isArray(q.choices) || q.choices.length < 2 || !q.hint) return false;
        if (typeof q.promptText !== 'string' || q.promptText.length < 8) return false;
        if (!q.choices.every(choice => typeof choice.text === 'string' && choice.text.length > 0)) return false;
      }
    }
    return html.includes('.logic-choice') && html.includes('function renderQuestion');
  })(),
  progressExportImportControlsPresent:
    html.includes('id="exportJsonBtn"') &&
    html.includes('id="exportCsvBtn"') &&
    html.includes('id="importProgressBtn"'),
  accessibleFeedbackPresent:
    html.includes('id="answerStatus"') &&
    app.includes('setAnswerStatus(correct ?') &&
    html.includes('prefers-reduced-motion'),
  chartFallbackPresent:
    html.includes('id="chartTable"') &&
    app.includes('function renderChartTable'),
  readmeLinksSourceMap:
    readme.includes('docs/source-map.json') &&
    readme.includes('How to use this in TMUA prep') &&
    readme.includes('Use this as a fluency supplement'),
  appShowsScopeDisclaimer:
    html.includes('Drills recall and no-calculator fluency') &&
    html.includes('does not replace timed TMUA papers'),
  sourceMapCoversEveryGenerator: (() => {
    const allowedClaimLevels = new Set(['official-direct', 'official-adjacent', 'fluency-support']);
    const generatorKeys = Object.keys(ctx.GENERATORS).sort();
    if (sourceMap.schemaVersion !== 1) return false;
    if (!Array.isArray(sourceMap.sources) || !Array.isArray(sourceMap.generators)) return false;
    const mapped = sourceMap.generators.map(entry => entry.generatorKey).sort();
    if (mapped.length !== new Set(mapped).size) return false;
    if (JSON.stringify(mapped) !== JSON.stringify(generatorKeys)) return false;
    return sourceMap.generators.every(entry =>
      allowedClaimLevels.has(entry.claimLevel) &&
      Array.isArray(entry.sourceRefs) &&
      entry.sourceRefs.length > 0 &&
      entry.sourceRefs.every(ref => ref.sourceId && ref.section && ref.ref)
    );
  })(),
  sourceMapRefsResolve:
    (() => {
      const sourceIds = new Set(sourceMap.sources.map(source => source.id));
      return sourceMap.generators.every(entry =>
        entry.sourceRefs.every(ref => sourceIds.has(ref.sourceId))
      );
    })(),
  allSeededGenerationRepeatable: (() => {
    for (const [key, gen] of Object.entries(ctx.GENERATORS)) {
      for (let i = 0; i < 25; i++) {
        const seed = `${key}-repeat-${i}`;
        const q1 = ctx.withSeededRandom(seed, () => gen.generate());
        const q2 = ctx.withSeededRandom(seed, () => gen.generate());
        if (JSON.stringify(q1) !== JSON.stringify(q2)) return false;
      }
    }
    return true;
  })()
};

function hasReducibleAnswerFraction(answer) {
  const m = String(answer).match(/^(-?\d+)\/(-?\d+)$/);
  if (!m) return false;
  const a = Math.abs(Number(m[1])), b = Math.abs(Number(m[2]));
  const g = (x, y) => y ? g(y, x % y) : x;
  return b !== 0 && g(a, b) > 1;
}

function hasReducibleTeXTFrac(display) {
  const matches = [...String(display).matchAll(/\\tfrac\{(-?\d+)\}\{(-?\d+)\}/g)];
  const g = (x, y) => y ? g(y, x % y) : x;
  return matches.some(([, n, d]) => {
    const a = Math.abs(Number(n)), b = Math.abs(Number(d));
    return b !== 0 && g(a, b) > 1;
  });
}

function hasBadGeneratedFormat(q) {
  if (!q || typeof q.display !== 'string' || typeof q.answer !== 'string') return 'missing display/answer';
  const payload = `${q.display}\n${q.answer}`;
  if (!q.display.trim() || !q.answer.trim()) return 'empty display/answer';
  if (/NaN|Infinity/.test(payload)) return 'NaN/Infinity';
  if (/\b1sqrt/.test(q.answer)) return 'unit surd coefficient in answer';
  if (hasReducibleAnswerFraction(q.answer)) return 'reducible answer fraction';
  if (hasReducibleTeXTFrac(q.display)) return 'reducible display tfrac';
  return null;
}

let generatorFailure = null;
let generatorFormatFailure = null;
for (const [key, gen] of Object.entries(ctx.GENERATORS)) {
  for (let i = 0; i < 500; i++) {
    const q = ctx.withSeededRandom(`${key}-${i}`, () => gen.generate());
    const formatIssue = hasBadGeneratedFormat(q);
    if (formatIssue) {
      generatorFormatFailure = { key, q, formatIssue };
      break;
    }
    if (!ctx.checkAnswer(q.answer, q)) {
      generatorFailure = { key, q };
      break;
    }
    for (const alt of q.alts || []) {
      if (!ctx.checkAnswer(alt, q)) {
        generatorFailure = { key, q, alt };
        break;
      }
    }
    if (generatorFailure) break;
  }
  if (generatorFailure || generatorFormatFailure) break;
}

let katexRenderFailure = null;
for (const [key, gen] of Object.entries(ctx.GENERATORS)) {
  for (let i = 0; i < 100; i++) {
    const q = ctx.withSeededRandom(`${key}-katex-${i}`, () => gen.generate());
    try {
      ctx.katex.renderToString(q.display, { throwOnError: true });
    } catch (err) {
      katexRenderFailure = { key, display: q.display, message: err.message };
      break;
    }
  }
  if (katexRenderFailure) break;
}

const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length || generatorFailure || generatorFormatFailure || katexRenderFailure) {
  console.error(JSON.stringify({ failed, generatorFailure, generatorFormatFailure, katexRenderFailure }, null, 2));
  process.exit(1);
}

console.log('ok: regression checks passed');
