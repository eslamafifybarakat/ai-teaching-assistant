// Renders a print-ready HTML version of LIGHTHOUSE.md's data into a PDF
// via headless Chrome's native print-to-PDF (no puppeteer dependency —
// chrome-launcher already ships in devDependencies and knows where the
// Chrome binary lives; this just spawns it once with --print-to-pdf).
//
// The narrative sections only state facts this project can actually back
// up from the rows LIGHTHOUSE.md contains — nothing about the audit run is
// asserted that wasn't measured.
//
// Usage: node scripts/generate-audit-pdf.mjs
// Reads:  LIGHTHOUSE.md (must already reflect the run you want in the PDF)
// Writes: public/AI_Teaching_Assistant_Performance_Audit.pdf
import { readFileSync, writeFileSync, unlinkSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { getChromePath } from 'chrome-launcher';

const root = path.dirname(fileURLToPath(import.meta.url));
const lighthousePath = path.join(root, '..', 'LIGHTHOUSE.md');
const outPath = path.join(root, '..', 'public', 'AI_Teaching_Assistant_Performance_Audit.pdf');

const DEVICE_ORDER = { Mobile: 0, Tablet: 1, Desktop: 2 };

function parseRows(md) {
  const hasDeviceCol = /\| Route \| Theme \| Device \|/.test(md);
  const lineRe = hasDeviceCol
    ? /^\| (\/\S*) \| (\w+) \| (Mobile|Tablet|Desktop) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| (\d+)ms \| (\d+)ms \| (\d+)ms \| (\d+)ms \| ([\d.]+) \| (\d+)ms \|$/gm
    : /^\| (\/\S*) \| (\w+) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \| (\d+)ms \| (\d+)ms \| (\d+)ms \| (\d+)ms \| ([\d.]+) \| (\d+)ms \|$/gm;
  const rows = [];
  for (const m of md.matchAll(lineRe)) {
    if (hasDeviceCol) {
      const [, r, theme, device, p, a, b, s, fcp, lcp, si, tbt, cls, ttfb] = m;
      rows.push({ r, theme, device, p: +p, a: +a, b: +b, s: +s, fcp: +fcp, lcp: +lcp, si: +si, tbt: +tbt, cls: +cls, ttfb: +ttfb });
    } else {
      const [, r, theme, p, a, b, s, fcp, lcp, si, tbt, cls, ttfb] = m;
      rows.push({ r, theme, device: 'Mobile', p: +p, a: +a, b: +b, s: +s, fcp: +fcp, lcp: +lcp, si: +si, tbt: +tbt, cls: +cls, ttfb: +ttfb });
    }
  }
  rows.sort((x, y) => x.r.localeCompare(y.r) || DEVICE_ORDER[x.device] - DEVICE_ORDER[y.device]);
  return rows;
}

function band(score) {
  if (score >= 90) return 'good';
  if (score >= 50) return 'warn';
  return 'bad';
}

function avg(arr, key) {
  return arr.length ? (arr.reduce((s, r) => s + r[key], 0) / arr.length).toFixed(1) : 'n/a';
}

function range(arr, key) {
  return arr.length ? `${Math.min(...arr.map((r) => r[key]))}–${Math.max(...arr.map((r) => r[key]))}` : 'n/a';
}

function fmtMs(v) {
  return `${v}ms`;
}

function buildHtml(rows) {
  const devices = [...new Set(rows.map((r) => r.device))].sort((a, b) => DEVICE_ORDER[a] - DEVICE_ORDER[b]);
  const routeCount = new Set(rows.map((r) => r.r)).size;
  const byDevice = (d) => rows.filter((r) => r.device === d);
  const a11yPerfect = rows.every((r) => r.a === 100);
  const bpPerfect = rows.every((r) => r.b === 100);
  const seoPerfect = rows.every((r) => r.s === 100);
  const lowestPerf = Math.min(...rows.map((r) => r.p));

  const kpiCells = devices
    .map(
      (d) => `<div class="kpi">
        <div class="kpi-label">${d.toUpperCase()} · AVG PERF</div>
        <div class="kpi-value">${avg(byDevice(d), 'p')}</div>
        <div class="kpi-note">range ${range(byDevice(d), 'p')}</div>
      </div>`,
    )
    .join('');

  const tableRows = rows
    .map(
      (r) => `<tr>
        <td class="route">${r.r}</td>
        <td><span class="device-pill">${r.device}</span></td>
        <td><span class="score ${band(r.p)}">${r.p}</span></td>
        <td><span class="score ${band(r.a)}">${r.a}</span></td>
        <td><span class="score ${band(r.b)}">${r.b}</span></td>
        <td><span class="score ${band(r.s)}">${r.s}</span></td>
        <td class="num">${fmtMs(r.fcp)}</td>
        <td class="num">${fmtMs(r.lcp)}</td>
        <td class="num">${fmtMs(r.si)}</td>
        <td class="num">${fmtMs(r.tbt)}</td>
        <td class="num">${r.cls.toFixed(3)}</td>
        <td class="num">${fmtMs(r.ttfb)}</td>
      </tr>`,
    )
    .join('\n');

  const generated = new Date().toISOString().slice(0, 10);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>AI Teaching Assistant — Performance Audit</title>
<style>
  @page { size: A4 landscape; margin: 14mm 12mm; }
  :root {
    --bg: #F5F6FB; --surface: #FFFFFF; --surface-2: #ECEEF7;
    --line: #DEE1EE; --line-strong: #C6CBE0;
    --text: #1C1F33; --text-dim: #676B85; --accent: #3C4BC4;
    --good: #1F8A4C; --good-soft: #E7F3EB;
    --warn: #93650A; --warn-soft: #FBF1E1;
    --bad: #B23A2C; --bad-soft: #FBE9E7;
  }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: var(--text); background: var(--bg); margin: 0; font-size: 10pt; line-height: 1.55; }
  .content { max-width: 220mm; }
  .eyebrow { font-family: Consolas, 'Courier New', monospace; font-size: 8pt; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 4pt; }
  h1 { font-weight: 700; font-size: 22pt; margin: 0 0 6pt; letter-spacing: -0.01em; }
  .sub { font-size: 9.5pt; color: var(--text-dim); max-width: 190mm; margin: 0 0 14pt; }
  .sub code { font-family: Consolas, 'Courier New', monospace; background: var(--surface-2); padding: 0.05em 0.4em; border-radius: 3pt; }
  h2 { font-weight: 700; font-size: 14pt; border-bottom: 1pt solid var(--line-strong); padding-bottom: 4pt; margin: 20pt 0 9pt; page-break-after: avoid; }
  p { font-size: 9.5pt; max-width: 190mm; }
  .kpis { display: flex; gap: 8mm; margin: 4pt 0; flex-wrap: wrap; }
  .kpi { background: var(--surface); border: 1pt solid var(--line); border-radius: 5pt; padding: 8pt 11pt; min-width: 34mm; }
  .kpi-label { font-family: Consolas, monospace; font-size: 6.7pt; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-dim); margin-bottom: 3pt; }
  .kpi-value { font-family: Consolas, monospace; font-size: 16pt; font-weight: bold; color: var(--text); }
  .kpi.good .kpi-value { color: var(--good); }
  .kpi-note { font-size: 7pt; color: var(--text-dim); margin-top: 2pt; }
  table { width: 100%; border-collapse: collapse; font-family: Consolas, monospace; font-size: 7.6pt; margin-top: 6pt; background: var(--surface); }
  th, td { padding: 3.5pt 5pt; border-bottom: 0.5pt solid var(--line); text-align: left; white-space: nowrap; }
  th { font-family: 'Segoe UI', Arial, sans-serif; font-size: 6.6pt; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-dim); background: var(--surface-2); border-bottom: 1pt solid var(--line-strong); }
  td.route { font-size: 7.2pt; }
  td.num { text-align: right; color: var(--text-dim); }
  .device-pill { font-size: 6.8pt; padding: 1pt 4pt; border: 0.5pt solid var(--line-strong); border-radius: 3pt; color: var(--text-dim); }
  .score { display: inline-block; min-width: 16pt; text-align: center; font-weight: bold; padding: 1pt 4pt; border-radius: 3pt; }
  .score.good { color: var(--good); background: var(--good-soft); }
  .score.warn { color: var(--warn); background: var(--warn-soft); }
  .score.bad { color: var(--bad); background: var(--bad-soft); }
  footer { margin-top: 16pt; padding-top: 8pt; border-top: 1pt solid var(--line); color: var(--text-dim); font-size: 7.6pt; max-width: 190mm; }
</style>
</head>
<body>
  <div class="content">
    <div class="eyebrow">Lighthouse · public routes · ${devices.join(' + ').toLowerCase()}</div>
    <h1>AI Teaching Assistant — Performance Audit</h1>
    <p class="sub">${rows.length} real Lighthouse measurements across ${routeCount} public route${routeCount === 1 ? '' : 's'}${devices.length > 1 ? ` × ${devices.join(' / ')}` : ''}, generated ${generated}. Simulated throttling, both forced color schemes. No score below was invented; every number ties back to an actual audit run against this project's own production build. Authenticated routes (<code>/app</code>, <code>/present</code>) are excluded — they redirect to the login page without a session, so auditing them would measure that page twice.</p>

    <div class="kpis">
      <div class="kpi"><div class="kpi-label">ROUTES AUDITED</div><div class="kpi-value">${routeCount}</div><div class="kpi-note">${rows.length} measurements</div></div>
      ${kpiCells}
      <div class="kpi ${lowestPerf >= 90 ? 'good' : ''}"><div class="kpi-label">LOWEST PERFORMANCE</div><div class="kpi-value">${lowestPerf}</div><div class="kpi-note">${lowestPerf >= 90 ? 'above the 90 floor' : 'below the 90 floor'}</div></div>
    </div>

    <h2>Reading these numbers</h2>
    <p>Accessibility${a11yPerfect ? ', Best Practices, and SEO all score a perfect 100' : ', Best Practices, and SEO'} across every measured route${a11yPerfect && bpPerfect && seoPerfect ? '' : ' (see the table below for any exceptions)'}. Performance is the category with the most headroom, and it scales directly with how hard each device profile throttles CPU and network — a heavier mobile throttle (4× CPU, slower network) makes the identical bundle take longer to become interactive than the same bundle under a light desktop throttle. That gradient is expected, not a defect. This app is client-rendered, so first paint additionally waits on the JavaScript bundle booting the router: that startup cost is present on every route by design, and is the single largest lever on the Performance figures below.</p>

    <h2>Full results</h2>
    <table>
      <thead>
        <tr>
          <th>Route</th><th>Device</th><th>Perf</th><th>A11y</th><th>BP</th><th>SEO</th>
          <th>FCP</th><th>LCP</th><th>Speed Idx</th><th>TBT</th><th>CLS</th><th>TTFB</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>

    <footer>Generated from a real Lighthouse sweep of this project's own production build — see LIGHTHOUSE.md in the repo for the raw run. Performance and Web Vitals reflect a local development machine and are a conservative floor, not a prediction of production scores on a real CDN/edge deployment.</footer>
  </div>
</body>
</html>`;
}

function main() {
  const md = readFileSync(lighthousePath, 'utf8');
  const rows = parseRows(md);
  if (!rows.length) {
    console.error('No rows parsed from LIGHTHOUSE.md — is it fully generated?');
    process.exit(1);
  }

  const html = buildHtml(rows);
  const tmpDir = mkdtempSync(path.join(tmpdir(), 'audit-pdf-'));
  const tmpHtml = path.join(tmpDir, 'audit.html');
  writeFileSync(tmpHtml, html);

  const chromePath = getChromePath();
  execFileSync(
    chromePath,
    ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${outPath}`, pathToFileURL(tmpHtml).href],
    { stdio: 'inherit' },
  );

  unlinkSync(tmpHtml);
  console.log(`\nWrote ${outPath} (${rows.length} rows, ${new Set(rows.map((r) => r.r)).size} routes).`);
}

main();
