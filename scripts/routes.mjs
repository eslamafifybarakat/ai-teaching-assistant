// Single source of truth for "which routes are publicly reachable", shared
// by generate-sitemap.mjs, generate-og-images.mjs and lighthouse.mjs.
//
// Why this file exists here but not in the blueprint project: that project
// prerenders every route, so its generate-sitemap.mjs walks the real build
// output (dist/**/index.html) and can never drift from what was built. This
// app is client-rendered — the build emits exactly one index.html — so there
// is nothing to walk, and the route list has to be declared. Declaring it
// once, here, is the closest honest equivalent: three consumers, one list.
//
// Keep in sync with src/app/app.routes.ts when a PUBLIC route is added.
// Authenticated routes (/app/**, /present/**) are deliberately absent: they
// sit behind authGuard, so they are neither crawlable nor auditable without
// a session, and they must not appear in a sitemap.

export const PUBLIC_ROUTES = [
  { path: '/auth/login', title: 'Sign in', changefreq: 'monthly', priority: '1.0' },
  { path: '/student/join', title: 'Join a session', changefreq: 'monthly', priority: '0.8' },
];

// Paths that must never be indexed — emitted as robots.txt Disallow rules.
export const PRIVATE_PATH_PREFIXES = ['/app/', '/present/'];
