# BetweenUs — Claude Instructions

## What this app is

Couples compatibility app (inspired by Spicer). Partners privately answer intimate questions; only mutual "yes" answers are revealed. **No backend** — everything runs on localStorage and shareable Base64 codes.

Two-way exchange flow: User A answers → gets Code A → User B joins with Code A, answers → gets Code B → shares back → both see matches.

## Stack

- **Svelte 5** (runes mode) + SvelteKit + TypeScript
- **Tailwind CSS v4** via `@tailwindcss/vite` Vite plugin — configured in `vite.config.ts`
- `@sveltejs/adapter-static` with `fallback: 'index.html'`
- Dev server on `0.0.0.0:5173` (LAN-accessible from Raspberry Pi at `192.168.178.10:5173`)

## Key source layout

```
src/
  lib/
    components/       # UI components (Svelte 5)
    data/
      questions.json  # user-editable, gitignored
      questions.ts    # loader
    stores/answers.ts
    utils/
      encoding.ts     # Base64 share codes + checksum
      matching.ts     # mutual answer comparison
      session.ts      # localStorage session state
    types/index.ts
  routes/
    +page.svelte      # home / start
    join/             # User B entry point
    questionnaire/    # answer flow
    results/          # match reveal
```

## Deployment

- Deploy: `npm run build` → zip from **inside** `build/` (not from project root) → scp to server → clear web root → unzip

```bash
npm run build
cd build && zip -r /tmp/betweenus.zip .
# scp the zip to your server, clear the web root, unzip, delete zip
```

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
- **Versioning:** `dev` carries a pre-release version (e.g. `1.1.0-beta.1`). When `dev` is ready to release, merge to `main`, bump to clean semver (`1.1.0`), tag, deploy.
- Always push tags alongside branches.

### No i18n
- App is English-only. All strings are hardcoded in components.
- Paraglide and a custom i18n system were both attempted and removed. Do not suggest adding i18n unless explicitly asked.

### No backend
- All features must work with localStorage + share codes only. Do not suggest adding a server, database, or auth system unless explicitly asked.

## Coding style

- No comments unless the WHY is non-obvious.
- No docstrings.
- No extra error handling for scenarios that can't happen.
- No abstractions beyond what the task requires.
