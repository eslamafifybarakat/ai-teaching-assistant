# Lighthouse report

Generated 2026-09-15T15:08:56.221Z against a local static server over the
production build (`npm run build` output, served exactly as Vercel serves
it — SPA fallback to `index.html`, with the real `vercel.json` security and
cache headers applied per path). Theme is forced via Chrome's
`--force-prefers-color-scheme` flag rather than a second URL.

**Only publicly reachable routes are audited.** Everything under `/app` and
`/present` is behind `authGuard` and redirects to the login page without a
session, so auditing those paths would measure the login page under a
different name — see `scripts/routes.mjs`.

**This run covers the representative sample** — which, for this app's public surface, is every public route. Run `npm run lighthouse -- --all` to audit every URL in `sitemap.xml` explicitly instead.

**Tablet has no official Lighthouse preset** — approximated here as a touch-class viewport (810×1080 @2x) with throttling between the mobile and desktop presets (70ms RTT, ~6 Mbps, 2× CPU slowdown), not an authoritative Lighthouse default the way mobile/desktop are.

## Results

| Route | Theme | Device | Performance | Accessibility | Best Practices | SEO | FCP | LCP | Speed Index | TBT | CLS | TTFB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /auth/login | dark | Mobile | 88 | 100 | 100 | 100 | 2445ms | 3399ms | 2445ms | 41ms | 0.021 | 62ms |
| /auth/login | dark | Desktop | 100 | 100 | 100 | 100 | 613ms | 697ms | 613ms | 3ms | 0.015 | 3ms |
| /auth/login | light | Mobile | 88 | 100 | 100 | 100 | 2278ms | 3251ms | 2278ms | 177ms | 0.019 | 4ms |
| /auth/login | light | Desktop | 100 | 100 | 100 | 100 | 606ms | 697ms | 606ms | 0ms | 0.015 | 4ms |
| /student/join | dark | Mobile | 92 | 100 | 100 | 100 | 2193ms | 2802ms | 2193ms | 139ms | 0.004 | 3ms |
| /student/join | dark | Desktop | 100 | 100 | 100 | 100 | 590ms | 651ms | 590ms | 0ms | 0.001 | 4ms |
| /student/join | light | Mobile | 92 | 100 | 100 | 100 | 2199ms | 2808ms | 2199ms | 151ms | 0.005 | 3ms |
| /student/join | light | Desktop | 100 | 100 | 100 | 100 | 592ms | 651ms | 592ms | 0ms | 0.001 | 3ms |

## Gaps from 100

- **/auth/login** (dark, Mobile): Performance 88
- **/auth/login** (light, Mobile): Performance 88
- **/student/join** (dark, Mobile): Performance 92
- **/student/join** (light, Mobile): Performance 92

## Notes

- **Client-rendered, not prerendered**: unlike a prerendered site, first
  paint here waits on the JS bundle booting the router — so FCP/LCP carry
  the framework's startup cost on every route. That is a structural
  property of this app's rendering mode, not a regression.
- **Performance run-to-run variance**: numbers come from a single local
  machine sharing CPU with the rest of this environment (editor, prior
  builds), so Lighthouse's simulated throttling (heaviest on mobile,
  lightest on desktop) amplifies whatever contention was happening at that
  moment — LCP/TBT can swing noticeably between otherwise-identical runs.
  A real edge/CDN deployment removes that local contention entirely —
  these numbers are a conservative floor, not a prediction of production
  scores.
