// Generates per-route Open Graph images (1200×630) — one per publicly
// reachable route. Run manually with `npm run generate:og` whenever brand
// copy changes; outputs are committed static assets under public/og/, not
// generated on every build.
//
// Routes come from scripts/routes.mjs rather than from domain seed data:
// unlike the blueprint project's article list, this app's content (courses,
// lectures, question banks) lives behind authentication, so there is no
// public per-item page for a share card to point at.
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { PUBLIC_ROUTES } from './routes.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const ogDir = path.join(root, '..', 'public', 'og');
mkdirSync(ogDir, { recursive: true });

const WIDTH = 1200;
const HEIGHT = 630;
// Kept in sync with src/styles.scss' dark-surface tokens and the brand ramp.
const BG = '#141a45';
const ACCENT = '#818cf8';
const TEXT = '#f6f7fb';
const MUTED = '#a5b4fc';

const PRODUCT = 'AI Teaching Assistant';
const TAGLINE = 'Plan lectures, run live quizzes, and track how every student is doing.';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function cardSvg({ eyebrow, title, subtitle }) {
  const titleTspans = wrapText(title, 26)
    .map((line, i) => `<tspan x="88" dy="${i === 0 ? 0 : 74}">${esc(line)}</tspan>`)
    .join('');

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
    <rect x="1" y="1" width="${WIDTH - 2}" height="${HEIGHT - 2}" fill="none" stroke="rgba(165,180,252,0.25)" stroke-width="2"/>
    <rect x="88" y="72" width="72" height="72" rx="18" fill="none" stroke="${ACCENT}" stroke-width="3.2"/>
    <text x="124" y="118" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="${TEXT}">AI</text>
    <text x="192" y="118" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${TEXT}">${esc(PRODUCT)}</text>

    <text x="88" y="330" font-family="'Courier New', monospace" font-size="19" letter-spacing="3" fill="${ACCENT}">${esc(eyebrow.toUpperCase())}</text>
    <text x="88" y="410" font-family="Arial, sans-serif" font-size="60" font-weight="700" fill="${TEXT}">${titleTspans}</text>
    <text x="88" y="${HEIGHT - 70}" font-family="Arial, sans-serif" font-size="24" fill="${MUTED}">${esc(subtitle)}</text>
  </svg>`;
}

async function render(filename, opts) {
  await sharp(Buffer.from(cardSvg(opts))).png().toFile(path.join(ogDir, filename));
  console.log('OG image:', filename);
}

async function main() {
  await render('home.png', { eyebrow: 'Home', title: PRODUCT, subtitle: TAGLINE });

  for (const route of PUBLIC_ROUTES) {
    const slug = route.path.replace(/^\//, '').replace(/\//g, '-');
    await render(`${slug}.png`, { eyebrow: route.title, title: route.title, subtitle: TAGLINE });
  }

  console.log(`Done — ${1 + PUBLIC_ROUTES.length} OG images written to public/og/`);
}

main();
