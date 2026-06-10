# BetweenUs

A private web app for couples to discover shared intimacy preferences.

## How It Works

1. One partner answers questions and gets a shareable code
2. The other partner enters the code and answers the same questions
3. Both see only the things they mutually said "yes" to

## Development

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or your network IP for remote access).

## Editing Questions

Questions are stored in **`src/lib/data/questions.json`** for easy editing.

**Format:**
```json
[
  {
    "id": "unique_id",
    "category": "Category Name",
    "text": "Question text here"
  }
]
```

**Tips:**
- Keep IDs unique (e.g., `pi_001`, `rf_002`)
- Categories group questions in the results view
- Questions appear in the order they're listed
- After editing, just refresh the browser - no rebuild needed

## Tech Stack

- **Svelte 5** + SvelteKit
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **localStorage** for data persistence (no backend needed)

## Privacy

- All data stored locally in browser
- Share codes are Base64-encoded (not encrypted)
- No accounts, no database, no tracking
