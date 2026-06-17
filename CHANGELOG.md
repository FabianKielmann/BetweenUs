# Changelog

## [1.2.0-beta.2] - unreleased

### Fixed
- Mobile layout: `ShareCode` and `PartnerCodeInput` no longer render nested card wrappers when used inside parent cards; input+button rows stack vertically on small screens

## [1.2.0-beta.1] - unreleased

### Added
- "Vielleicht besprechen" section in results: pairs where at least one partner answered "Vielleicht" (and neither said "Nein") appear in a second amber-styled section below the mutual-yes matches
- Partner join via URL deep-link: `/join?code=...` pre-fills and auto-submits the code input, so User A can share a direct link instead of a raw code string
- "Link kopieren" button on the share code card: copies the full join URL to clipboard
- Answer summary on completion screen: yes/maybe/no counts shown as coloured pills so users can reflect before sharing their code
- Code-regeneration warning: an amber banner appears after re-completing the questionnaire when a code was previously shared, reminding the user their partner needs the new code
- QR code on the share screen: encodes the join deep-link so the partner can scan directly without typing
- PWA support: app is installable on Android/iOS home screens and works fully offline (service worker with Workbox precache, `manifest.webmanifest`, icons)
- Prettier + `prettier-plugin-svelte` with `npm run format` script

### Fixed
- `html lang` attribute corrected from `"en"` to `"de"` to match the German UI

## [1.1.0-beta.2] - unreleased

### Added
- Question overview panel: tap "Übersicht" on the questionnaire page to see all answers as a colour-coded dot grid (green/yellow/red/grey) and jump directly to any question

## [1.0.1] - 2026-06-12

### Fixed
- 404 on direct navigation and page reload for non-root routes — disable SSR and add Apache `.htaccess` rewrite rules

## [1.0.0] - 2026-06-12

### Added
- Initial MVP: questionnaire flow, Base64 share codes, mutual match reveal
- Resume session: pick up mid-questionnaire across page reloads
- Discreet mode: blur questions when coding in public (`PUBLIC_PRIVACY_MODE` env var)
- Mobile-optimised button layout with icons on questionnaire
- Own share code always visible when revisiting the results page
- Partner code input accessible from results page with a "change" toggle
- `questions.example.json` for open-source forks; `questions.json` gitignored
- `.env.example` documenting required environment variables

### Changed
- UI strings settled on German
- Results copy uses correct German pluralisation (Frage/Fragen)

### Fixed
- Progress bar not updating on back navigation (Svelte 5 array reactivity)
