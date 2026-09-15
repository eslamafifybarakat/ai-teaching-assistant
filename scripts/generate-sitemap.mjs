// Generates sitemap.xml + robots.txt into the build output.
// Runs automatically after `ng build` as the last step of every "build:*"
// script (see package.json / scripts/with-build-lock.mjs).
//
// The route list comes from scripts/routes.mjs rather than from a walk of
// the build output: this app is client-rendered, so the build emits a single
// index.html and there are no per-route files to discover. See the comment
// at the top of routes.mjs for why that differs from the blueprint project.
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PUBLIC_ROUTES, PRIVATE_PATH_PREFIXES } from './routes.mjs';

const SITE_URL = process.env.SITE_URL ?? 'https://example.com';
const root = path.dirname(fileURLToPath(import.meta.url));
const browserDir = process.env.LH_BROWSER_DIR
  ? path.resolve(process.env.LH_BROWSER_DIR)
  : path.join(root, '..', 'dist', 'ai-teaching-assistant', 'browser');

if (!existsSync(browserDir)) {
  console.error(`Build output not found at ${browserDir} — run "ng build" first.`);
  process.exit(1);
}

const lastmod = new Date().toISOString().slice(0, 10);

const entries = PUBLIC_ROUTES.map(
  ({ path: url, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

const robots = `User-agent: *
Allow: /
${PRIVATE_PATH_PREFIXES.map((p) => `Disallow: ${p}`).join('\n')}

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(path.join(browserDir, 'sitemap.xml'), sitemap);
writeFileSync(path.join(browserDir, 'robots.txt'), robots);

console.log(
  `sitemap.xml written with ${PUBLIC_ROUTES.length} public URLs ` +
    `(robots.txt alongside it, disallowing ${PRIVATE_PATH_PREFIXES.join(' and ')}).`,
);
