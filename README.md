# ELIZA

Chat with ELIZA, Joseph Weizenbaum's 1966 "therapist" chatbot, recreated in the browser
with a retro typewriter interface.

Live: https://eliza.pknspace.com

## Features

- The original ELIZA (DOCTOR script), via Norbert Landsteiner's faithful `elizabot` port.
- Extra keywords and synonyms for more natural modern conversation.
- Replies type out letter by letter, like a 1960s terminal.
- Saying goodbye ends the session, and a new one can be started.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · elizabot · Vitest. No backend.

## Development

```bash
npm install
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:5173 |
| `npm run build` | Typecheck and production build into `dist/` |
| `npm run typecheck` | TypeScript check (`tsc -b`) |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run check` | Typecheck, lint and tests |
| `npm run deploy` | Checks, builds and uploads to the VPS |
| `npm run deploy:dry` | Same, but only previews the upload |

## Deployment

The site is static: `npm run build` writes `dist/`, which is synced to a VPS where
Caddy serves it directly (no restart needed).

1. One-time setup: copy `.env.example` to `.env.prod.local` (git-ignored) and fill in
   `DEPLOY_HOST`, `DEPLOY_PORT` and `DEPLOY_DIR`. You also need SSH key access to the server.
2. Deploy:
   ```bash
   npm run deploy:dry   # preview what would change
   npm run deploy       # checks, build, upload
   ```

## How it works

- `src/eliza/eliza.ts` wraps `elizabot` without changing its engine. Before the first
  bot is created it merges the extra keywords and synonyms from `extraKeywords.ts` into
  elizabot's data, because elizabot parses that data only once.
- ELIZA matches keywords in what you type, picks a decomposition rule, and reassembles
  your own words into a reply ("I feel sad" → "Do you often feel sad?").
- `eliza.test.ts` runs the bot in non-random mode so replies are deterministic.
