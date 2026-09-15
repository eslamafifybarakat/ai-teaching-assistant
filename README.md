# 🎓 AI Teaching Assistant — Interactive UI/UX Prototype

[![CI](https://github.com/eslamafifybarakat/ai-teaching-assistant/actions/workflows/ci.yml/badge.svg)](https://github.com/eslamafifybarakat/ai-teaching-assistant/actions/workflows/ci.yml)
[![Angular](https://img.shields.io/badge/Angular-22-dd0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Live demo → https://ai-teaching-assistant-hazel.vercel.app**

A fully interactive Angular 22 prototype of an AI-powered university/school
teaching platform: upload material → AI analysis → generate slides → present
→ run live quizzes → analyze weak concepts → reports. Six languages, full
RTL/LTR, dark mode, zoneless signals-based architecture, and zero real
backend — everything runs on realistic mock data and mock AI services.

## Quick start

```bash
npm install --legacy-peer-deps
npm start
```

Then open **http://localhost:4200**.

Common commands (the full surface is in `package.json`; what each
`scripts/*.mjs` does is in [Build & quality tooling](#build--quality-tooling)):

```bash
npm start                   # scripts/dev.mjs -> ng serve on :4200
npm run build               # production build + sitemap + CSP-hash rewrite, under a build lock
npm run build:staging       # same pipeline, --configuration staging (also :uat, :dev, :live)
npm run preview:live        # build, then serve the real output on :4000 exactly as a static host would
npm run lint                # ESLint flat config (TS + template accessibility)
npm run type-check          # tsc --noEmit — what CI runs
npm test                    # Vitest via @angular/build:unit-test
npm run lighthouse -- --devices=mobile,desktop    # real audit sweep -> LIGHTHOUSE.md
npm run generate:icons      # regenerate the favicon/PWA icon set from the SVG marks
npm run generate:og         # regenerate Open Graph share images
```

Requires Node.js **22.22.3+** (or 24.15+ / 26+) — this is Angular 22's
minimum. If `npm install` fails with an odd `arborist` error, upgrade npm
first: `npm install -g npm@latest`.

## Demo accounts (any password works — try `123456`)

| Role | Email |
|---|---|
| Professor | `professor@demo.edu` |
| Teaching Assistant | `ta@demo.edu` |
| School Teacher (picks a stage: primary/middle/secondary on first login) | `teacher@demo.edu` |
| Head of Department | `head@demo.edu` |
| Student | `student@demo.edu` |

Or skip login entirely as a student via **"Student? Join with a code"** on
the login screen (any code works, e.g. `TB-4821`).

## What's implemented

- **Auth**: login, demo account quick-login, forgot-password flow, school-stage picker
- **Dashboard**: stats, recent lectures, weak concepts, quick actions, activity feed
- **Courses**: list + detail (tabs: overview / lectures / students / materials / analytics / question bank)
- **Lecture wizard**: 6 steps — basics → upload → AI analysis → objectives → plan → slide generation
- **Slide editor**: reorder/duplicate/delete slides, AI action chips (simplify, expand, add example, etc.), speaker notes
- **Presentation mode**: fullscreen dark stage, timer, AI-ask, live-results toolbar
- **Live quiz**: question generation (topic/type/difficulty), simulated live-ticking responses, eye-icon answer reveal, weak-concept detection with "re-explain" suggestion
- **Student flow**: join by code/QR, answer questions, personal performance dashboard with badges
- **Question bank**: filterable list, AI generation
- **Analytics**: knowledge map, attendance, engagement, top students — all custom SVG charts, no chart library dependency
- **Reports**: lecture/quiz/student/course report tabs, mock export/print

## Architecture

```
src/app/
  core/        — layout shell, auth/theme/toast/i18n services, guards, models
  shared/      — 17 reusable UI primitives (button, card, modal, charts, etc.)
  domains/     — one folder per feature area (auth, dashboard, courses, lectures,
                 quiz, student, question-bank, analytics, reports, ai-assistant)
  infrastructure/ — mock data + mock data service (swap for a real API later)
```

- **Angular 22**, standalone components, zoneless change detection, signals throughout (`signal`, `computed`, `input`, `output`)
- New control flow only (`@if`/`@for`/`@switch`) — no `*ngIf`/`*ngFor`
- **i18n**: custom signal-based service (not a static-build i18n) so language
  switches instantly without a page reload. Translations live in
  `public/assets/i18n/{ar,en,zh,ru,ja,hi}.json`. Arabic is the default,
  RTL/LTR and per-language font stacks switch automatically via `<html lang>` / `<html dir>`.
- **Charts**: hand-built SVG bar/donut charts (`shared/components/bar-chart`,
  `donut-chart`) — no chart library dependency.
- **Mock AI**: `infrastructure/mock-services` simulate network delay and
  return canned-but-varied content, so the architecture is ready to swap in
  a real LLM call later without touching any component.

## Build & quality tooling

The build/quality infrastructure follows the **Angular 22 DDD Starter**
blueprint (`../angular22-ddd-starter/README.md`), adapted where this app
genuinely differs from it. The blueprint assumes a public, fully prerendered
site; this is a **client-rendered, login-gated app**, so SSR/prerendering and
the blueprint's `/ar` route-prefix i18n strategy were deliberately not
adopted — this app switches language in place, without a reload, across six
languages.

**Configuration**

- **Path aliases** in `tsconfig.json`: `@core/*`, `@shared/*`, `@domains/*`,
  `@layout/*`, `@infrastructure/*`, `@environments/*`, `@app/*`. Consumed
  directly by `@angular/build` — no separate wiring in `angular.json`.
- **Five environments** (`environment.ts` + `.dev`/`.staging`/`.uat`/`.prod`),
  swapped by `fileReplacements` per build configuration. Build-time config
  only — business data belongs in the domain layer, never here.
- **Schematics**: `addTypeToClassName: true` for component/directive/service.
  Angular 22's CLI otherwise drops the type suffix (`ng generate component
  foo` → `class Foo`). Note this affects only **newly generated** files; the
  existing components predate it and keep their unsuffixed names
  (`Login`, `Shell`, `Badge`).
- **ESLint** flat config (`angular-eslint` + `typescript-eslint`), including
  template accessibility rules. **Service worker** via `ngsw-config.json`,
  enabled in the production and staging configurations only.
- **`vercel.json`** as a reference config: SPA rewrite, full security header
  set, and a CSP whose `script-src` is not hand-maintained — see below.

**`scripts/` (13 files)**

| Script | What it does |
|---|---|
| `dev.mjs` | Runs `ng serve`, resolving configuration + port (the port is read off the npm script name, so `dev:4300` just works) |
| `clean.mjs` | Removes `dist/` and/or `.angular/cache` |
| `with-build-lock.mjs` | PID-checked lock so two builds can't corrupt the shared `dist/` |
| `stop-dev-server.mjs` | Cross-platform kill of anything on :4200/:4173/:5000 |
| `serve-static.mjs` | Serves the build with SPA fallback **and the real `vercel.json` headers** — replaces the blueprint's `serve-ssr.mjs`, since a CSR build has no server bundle |
| `vercel-build.mjs` | Picks the right `build:*` from Vercel's own `VERCEL_ENV`/branch vars |
| `routes.mjs` | The one list of publicly reachable routes, shared by the three scripts below |
| `generate-sitemap.mjs` | Writes `sitemap.xml` + `robots.txt` into the build output, disallowing `/app/` and `/present/` |
| `generate-csp-hashes.mjs` | Rewrites `vercel.json`'s CSP `script-src` to the exact hashes the build emits — no `'unsafe-inline'` |
| `generate-icons.mjs` | Renders the favicon/PWA icon set from the SVG marks via `sharp` |
| `generate-og-images.mjs` | Renders 1200×630 Open Graph share images |
| `lighthouse.mjs` | Serves the production build and runs real Lighthouse audits → `LIGHTHOUSE.md` |
| `generate-audit-pdf.mjs` | Renders `LIGHTHOUSE.md` into a print-ready PDF |

`routes.mjs` exists here but not in the blueprint, and the difference is the
point: the blueprint prerenders every route, so its sitemap script walks the
real build output and can never drift. A CSR build emits one `index.html`,
so there is nothing to walk and the public route list must be declared.
Authenticated routes are excluded from it deliberately — they are neither
crawlable nor auditable without a session.

**CI**: `.github/workflows/ci.yml` runs lint → type-check → test → build.
Every command in it was run locally and passes; it has not been exercised on
a real GitHub Actions runner.

## Measured quality status

Everything below was actually run against the real production build — no
figure here is estimated.

```text
BUILD                 PASS   (ng build production + sitemap + CSP-hash rewrite, one locked pipeline)
LINT                  PASS   (0 errors, 0 warnings)
TYPE-CHECK            PASS   (tsc -p tsconfig.app.json --noEmit)
TESTS                 PASS   (6 test files, 20 tests)
SERVICE WORKER        PASS   (ngsw.json + ngsw-worker.js present in production output)
STATIC SERVE          PASS   (/, /auth/login, /student/join, /app/dashboard, /sitemap.xml, /robots.txt -> 200)
CSP HASH REWRITE      PASS   (verified end-to-end: vercel.json script-src rewritten to the real build's hashes)
VERCEL                DEPLOYED   (https://ai-teaching-assistant-hazel.vercel.app — / /auth/login /student/join -> 200)
CI                    CONFIGURED, NOT RUN on a real runner
```

Lighthouse, 2 public routes × 2 themes × 2 devices = 8 real runs
(`npm run lighthouse -- --devices=mobile,desktop`; full table in
`LIGHTHOUSE.md`):

| | Mobile | Desktop |
|---|---|---|
| Performance | 88–92 | **100** |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |

Three real defects were found by this tooling and fixed:

- **`landmark-one-main`** — neither public page had a `<main>` landmark.
- **`color-contrast`** — `--color-text-subtle` was `#9498ad`, about 2.9:1 on
  the card surface, below the WCAG AA 4.5:1 minimum (the dark-theme value
  failed too, at ~4.2:1). Both were re-derived to ~5.2:1 / ~5.5:1.
- **Modal backdrop** — the click-outside-to-close veil was a `<div>` with a
  click handler wrapping the dialog, needing `stopPropagation()` and failing
  two keyboard-accessibility rules. It is now a real `<button>` positioned
  *beside* the dialog: siblings don't bubble to each other, so no
  `stopPropagation()` is needed at all. `modal.spec.ts` guards this.

## Known limits (it's a prototype)

- **Mobile Performance is 88–92, not ≥95**, and the cause is measured, not
  guessed: FCP is ~2.2–2.4s under the mobile profile (4× CPU, ~1.6 Mbps).
  Two things drive it, both structural:
  1. **Client rendering** — first paint waits on the JS bundle booting the
     router. Prerendering is the real fix and is out of scope here.
  2. **Five Google Font families** (including three CJK/Devanagari families
     for the `zh`/`ja`/`hi` locales) inlined into `index.html` by Angular's
     font optimization, making the document ~914 kB before compression.
     Disabling that inlining was tried and **measured worse** (FCP 2.4s →
     4.1s, Performance 88 → 72): the external stylesheet is render-blocking
     from a third-party origin, which costs more than the inlined copy,
     which compresses extremely well. The real fix is to load fewer
     families — e.g. ship only Arabic + Latin by default and fetch a CJK
     face on demand when that locale is selected — which is a product
     decision about the non-default locales, not a build setting.
- **Three component stylesheets exceed the 4 kB budget** (`lecture-wizard`,
  `shell`, `login` — by 196–467 bytes). Build warnings, not errors; the
  budget was left honest rather than raised to silence them.
- **`engines.node` is not pinned** in `package.json`, matching the blueprint
  (which records the same gap). Node 22.22.3 is what this was built against.
- **Brand assets are placeholders.** `public/{mark,logo,favicon,mask-icon}*.svg`
  are a plain "AI" monogram created so the icon/OG generators had real source
  material to render from and could be verified end-to-end. Swap them for
  real brand assets and re-run `npm run generate:icons && npm run generate:og`.
- **Only production is actually deployed.** `siteUrl` in
  `environment.staging.ts`/`.uat.ts`/`.dev.ts` points at the Vercel
  *branch alias* those branches would get (`…-git-<branch>-….vercel.app`);
  no such branch exists yet, so those URLs are predicted, not verified.
  `generate-sitemap.mjs` reads `SITE_URL`, falling back to Vercel's own
  `VERCEL_PROJECT_PRODUCTION_URL` — so the sitemap follows the real domain
  if it ever changes.

- No real backend — state resets on refresh (by design, per spec).
- Course/lecture mock **content** (student names, course titles, quiz
  questions, slide text) is authored in Arabic as the demo course's actual
  language — this is intentional, distinct from UI chrome (buttons, nav,
  labels), which is fully translated in all 6 languages.
- Google Fonts are loaded from a CDN — if you're offline, the app still
  works, it just falls back to system fonts.
