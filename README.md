# Ismoiljon Masharipov — Portfolio

Personal portfolio and blog for a full-stack software engineer based in Seoul.
Bilingual (English / 한국어), data-driven, and self-hosted on a Raspberry Pi via
Coolify with scale-to-zero.

**Live:** https://portfolio.ismaildev.uz

---

## Tech stack

- **Next.js 14** (App Router, `output: "standalone"`) · **React 18** · **TypeScript**
- **Tailwind CSS** + **shadcn/ui** primitives
- **Framer Motion** + **Magic UI** `blur-fade` entrance animations
- **MDX** blog (`content/`) rendered with `react-markdown` + `rehype-pretty-code` / `shiki`
- **pnpm** package manager
- Deployed with **Docker → Coolify → Traefik → Cloudflare Tunnel → Sablier** (see [Deployment](#deployment))

## Design

Clean editorial-minimal: a serif display face (Newsreader) over Inter body text, a
single indigo accent, generous whitespace, and no heavyweight canvas effects — tuned
to read well for recruiters and load fast on a phone.

---

## Project structure

```
src/
  app/
    page.tsx              # Home page (client component; renders all sections)
    layout.tsx            # Root layout: fonts, providers, navbar, scroll progress
    globals.css           # Design tokens (CSS vars, incl. --brand accent)
    blog/                 # Blog index + [slug] pages
    admin/                # Password-gated content editor UI
    api/
      portfolio/route.ts  # GET: static DATA merged with admin overrides
      admin/route.ts      # POST: writes admin overrides to src/data/dynamic.json
      track/route.ts      # POST: visit/click analytics (Telegram + analytics.json)
  data/
    resume.tsx            # <- SINGLE SOURCE OF CONTENT: profile, work, projects, skills...
    ko-translations.ts    # Korean translations for the above
    blog.ts               # Blog post loading helpers
  components/             # UI components (project-card, resume-card, navbar, ...)
content/                  # MDX blog posts
public/
  presentations/<slug>/index.html   # Standalone HTML project deep-dives
  *.pdf, *.png, *.mp4               # Resume, avatar, project media
Dockerfile               # Multi-stage standalone build for Coolify
```

### Where to edit content

- **Everything on the home page** (name, summary, work, education, projects, skills,
  languages, hackathons, contact links) lives in [`src/data/resume.tsx`](./src/data/resume.tsx).
- **Korean copy** for the same content lives in [`src/data/ko-translations.ts`](./src/data/ko-translations.ts);
  the EN/KR toggle in the navbar switches between them.
- **Blog posts** are MDX files in [`content/`](./content/) — the filename is the URL slug.
- **Project presentations** are self-contained HTML pages under
  `public/presentations/<slug>/index.html`. Link to them as
  `/presentations/<slug>/index.html` (the explicit `index.html` is required — see
  [Deployment gotchas](#gotchas)).

---

## Getting started locally

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Other scripts:

```bash
pnpm build          # production build (standalone output)
pnpm start          # run the production build
pnpm lint
```

### Environment variables

Create a `.env` (not committed). Only the admin/analytics features need these — the
public site runs without them.

| Var | Purpose |
|-----|---------|
| `PORT` | Port for the server (default 3000) |
| `ADMIN_PASSWORD` | Password gate for the `/admin` content editor |
| `TELEGRAM_BOT_TOKEN` | Bot token for visit/click notifications (optional) |
| `TELEGRAM_CHAT_ID` | Chat to notify (optional) |

`src/data/dynamic.json` (admin-panel overrides) and `analytics.json` (visit log) are
runtime state and are **git-ignored** — they're generated, not source.

---

## Deployment

The site is **self-hosted on a Raspberry Pi 5**, not Vercel. The flow:

```
git push (develop)  ->  Coolify builds the Dockerfile  ->  Traefik routes by domain
                                                           ->  Cloudflare Tunnel exposes it
                                                           ->  Sablier sleeps it when idle,
                                                              wakes it on the next request
```

- **Coolify** builds the image from the `Dockerfile` on push to `develop` and runs the
  container. (Deploys can also be triggered via the Coolify API.)
- **Traefik** reverse-proxies `portfolio.ismaildev.uz` to the container by Docker label.
- **Cloudflare Tunnel** exposes it publicly with no open ports and automatic TLS.
- **Sablier** scales the container to zero after 10 minutes idle and shows a custom
  "waking up" page while it cold-starts on the next request (~1–3s).

> Full server architecture, per-app config, and operational notes live in the private
> `SERVER_README.md` on the host — this section is the app-level summary.

### Build

The [`Dockerfile`](./Dockerfile) is a standard multi-stage standalone build
(deps → build → runner) that copies `.next/standalone`, `.next/static`, and `public/`
into a slim `node:22-alpine` runner with a `HEALTHCHECK`.

<a name="gotchas"></a>
### Deployment gotchas (learned the hard way)

- **Next.js standalone doesn't bind `0.0.0.0` by default.** The generated `server.js`
  binds to the ambient `HOSTNAME` (Docker sets this to the container ID), so a
  `127.0.0.1` healthcheck is refused. The Dockerfile sets `ENV HOSTNAME="0.0.0.0"`.
- **Static files in `public/` subdirectories need an explicit `index.html`.** Next.js
  standalone does not serve a directory index at a clean URL — `/presentations/x/`
  308-redirects to `/presentations/x`, which 404s. Link to
  `/presentations/x/index.html` instead.
- **`public/presentations/` must be committed.** Coolify builds from git; anything
  untracked never reaches the container (this previously 404'd every presentation).
- **Healthchecks use `127.0.0.1`, never `localhost`** — Alpine/musl resolves `localhost`
  unreliably inside containers.

---

## Credits

Originally based on the [dillionverma/portfolio](https://github.com/dillionverma/portfolio)
template, substantially redesigned and re-architected. Licensed under
[MIT](./LICENSE).
