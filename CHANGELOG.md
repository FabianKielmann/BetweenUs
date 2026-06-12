# Changelog

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
