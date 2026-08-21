# Changelog

## [2.1.1] - 2026-08-21

### Changed
- Removed progress bar from the questionnaire view
- Share code input and copy button now stack vertically on small screens

## [2.1.0] - 2026-08-17

### Added
- Word-pair share codes (e.g. `bright-ocean`) replace raw UUIDs as the user-facing partner code — over 1 million unique combinations
- First-visit onboarding tutorial: three-step overlay explaining the app concept, the share code, and how to back up the account
- Account recovery link: a secret URL (`/recover/<uuid>`) that restores a session on a new device, accessible from settings and the onboarding
- "Konto sichern" section in settings: shows the backup link with a copy button and a visible URL for manual copying

### Fixed
- Matches were visible to a user who guessed a partner's code, even if the partner never connected back — matches now require a mutual connection from both sides
- Pointer cursor missing on all interactive buttons

## [1.2.1-beta.1] - unreleased

### Fixed
- Privacy mode blur now also applies to question text in the questionnaire overview panel

## [1.2.0] - 2026-06-18

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
- Mobile layout: `ShareCode` and `PartnerCodeInput` no longer render nested card wrappers when used inside parent cards; input+button rows stack vertically on small screens
- Joining with a partner code when the user already has answers now skips the questionnaire and goes directly to results

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
