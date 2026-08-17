# BetweenUs — Claude Instructions

## What this app is

Couples compatibility app. Partners answer intimate questions one at a time; only mutual "yes" (and "maybe") answers are revealed. Anonymous identity: each user gets a UUID on first visit, stored in an httpOnly cookie + localStorage. Partners connect by sharing their UUID codes.

## Stack

- **Svelte 5** (runes mode) + SvelteKit + TypeScript
- **Tailwind CSS v4** via `@tailwindcss/vite` Vite plugin — configured in `vite.config.ts`
- `@sveltejs/adapter-node` — runs as a Node.js server process
- **SQLite** via `better-sqlite3` — DB file at `./data/betweenus.db` (or `DB_PATH` env var)
- **Web Push** via `web-push` — VAPID keys in env vars
- Dev server on `0.0.0.0:5173` (LAN-accessible from Raspberry Pi at `192.168.178.10:5173`)

## Key source layout

```
src/
  hooks.server.ts           # DB init trigger + attach locals.userId from cookie
  lib/
    components/             # UI components (Svelte 5)
    data/
      questions.json        # user-editable, gitignored
      questions.ts          # loader (also used by db.ts for seeding)
    server/
      db.ts                 # SQLite singleton, schema creation, question seeding
      push.ts               # Web Push notification helper
    utils/
      matching.ts           # groupByCategory (findMatches/findMaybeMatches are now SQL queries)
    types/index.ts
  routes/
    +layout.server.ts       # user identity lifecycle (create UUID, set cookie)
    +layout.svelte          # app shell: top nav (desktop) + bottom nav (mobile) + recovery
    +page.server.ts         # redirect → /fragen
    fragen/                 # answer one random question at a time
    matches/                # always-accessible match results
    einstellungen/          # user code, partner connect, push notification toggle
    api/
      answers/              # POST: upsert answer + trigger push if new match
      identity/recover/     # POST: re-set cookie from localStorage UUID
      push/subscribe/       # POST/DELETE: manage Web Push subscription
```

## Deployment

Runs as a Node.js process on Uberspace via supervisord. Build output is self-contained.

```bash
npm run build
rsync -avz --delete --exclude 'node_modules' \
  build/ suprmn@columba.uberspace.de:/home/suprmn/betweenus/build/
ssh -i ~/.ssh/betweenus_deploy suprmn@columba.uberspace.de \
  'supervisorctl restart betweenus'
```

Required env vars on server: `PORT`, `HOST`, `ORIGIN`, `DB_PATH`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `PUBLIC_VAPID_PUBLIC_KEY`.

Pre-create DB directory once: `mkdir -p /home/suprmn/betweenus/data`

## Hard rules

### Tailwind
- Always use `@tailwindcss/vite` (Vite plugin). Never `@tailwindcss/postcss`.
- The PostCSS plugin produces an empty CSS file in production — this was already discovered and fixed.
- Do not suggest downgrading to Tailwind v3. v4 only.

### Svelte 5 reactivity
- Arrays/objects must be **reassigned** to trigger reactivity, not mutated in place.
- Wrong: `arr.push(x)` / `arr[i] = y`
- Right: `arr = [...arr, x]` / `arr = arr.map(...)`
- This caused a real bug (progress bar not updating on back navigation).

### Git / GitHub
- Use plain `git` commands. Never use the `gh` CLI.
- **Branching strategy:**
  - `main` — stable releases only, always deployed
  - `dev` — next release in progress; always reflects what will become the next version
  - `feature/*` — individual features branched off `dev`, merged back into `dev` when ready
  - `fix/*` — bug fixes; branch off `main` for hotfixes, off `dev` for pre-release fixes
- **Versioning:** `dev` carries a pre-release version (e.g. `2.0.0-beta.1`). When `dev` is ready to release, merge to `main`, bump to clean semver (`2.0.0`), tag, deploy.
- Always push tags alongside branches.

### No i18n
- App is German-only. All strings are hardcoded in components.
- Paraglide and a custom i18n system were both attempted and removed. Do not suggest adding i18n unless explicitly asked.

### No extra backend
- All features must use the existing SvelteKit server routes + SQLite. Do not suggest adding external services, a separate API server, or an auth library unless explicitly asked.

## Coding style

- No comments unless the WHY is non-obvious.
- No docstrings.
- No extra error handling for scenarios that can't happen.
- No abstractions beyond what the task requires.
