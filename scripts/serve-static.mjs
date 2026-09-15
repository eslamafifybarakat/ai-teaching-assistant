// Serves the production build locally exactly the way a static host does —
// real files where they exist, SPA fallback to index.html for everything
// else, and the real vercel.json security/cache headers applied per path.
//
// This replaces the blueprint project's serve-ssr.mjs: that project ships an
// Express SSR server bundle to run; this one is client-rendered, so there is
// no server/ output and "serving the build" means serving static files.
//
// Usage: node scripts/serve-static.mjs [--port 5000]
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const args = process.argv.slice(2);
const portArg = args.findIndex((a) => a === '--port');
const PORT = portArg !== -1 ? Number(args[portArg + 1]) : Number(process.env.PORT ?? 5000);

const root = path.dirname(fileURLToPath(import.meta.url));
const browserDir = path.join(root, '..', 'dist', 'ai-teaching-assistant', 'browser');

if (!existsSync(browserDir)) {
  console.error(`Build output not found at ${browserDir} — run "npm run build" first.`);
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

const vercelConfig = JSON.parse(readFileSync(path.join(root, '..', 'vercel.json'), 'utf8'));
const headerRules = (vercelConfig.headers ?? []).map((rule) => ({
  regex: new RegExp(`^${rule.source}$`),
  headers: rule.headers,
}));

function headersFor(urlPath) {
  const merged = {};
  for (const rule of headerRules) {
    if (rule.regex.test(urlPath)) {
      for (const { key, value } of rule.headers) merged[key] = value;
    }
  }
  return merged;
}

createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(browserDir, urlPath);

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  // SPA fallback: any path the router owns has no file of its own.
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = path.join(browserDir, 'index.html');
  }

  try {
    const content = readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
      ...headersFor(urlPath),
    });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Serving ${path.relative(path.join(root, '..'), browserDir)} on http://localhost:${PORT}`);
});
