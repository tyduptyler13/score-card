# Scorecard

A lightweight scorecard for card-game nights. Track players, rounds, and running
totals in the browser — no account, backend, or spreadsheet required.

**Live app:** https://tyduptyler13.github.io/score-card/

## Games supported

| Game | Scoring style |
| --- | --- |
| Phase 10 | Round penalties with phase-completion tracking; lowest total wins. |
| Five Crowns | 11 rounds of leftover-card points; lowest total wins. |
| Rummy 500 | Melds minus cards left in hand; highest total wins. |
| Golf | Per-hole card values; lowest total wins. |
| Win Conditions | Free-form win statements with no numeric scoring. |

Each game includes a built-in "How to score" reference on its setup screen.

### Rummy 500 options

- Selectable target score: 250, 300, 500, or 1000 points.
- Optional "must go out to win" rule.
- Per-round entry for melded points and cards left in hand, with the net score
  calculated automatically.
- Card reference: A = 15 (1 or 5 when used low), K/Q/J/10 = 10, 2–9 = face
  value, Joker = 15.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check with TypeScript and build for production. |
| `npm run preview` | Preview the production build locally. |

## How it works

- Games are stored in `localStorage` under `score-card.games.v1`.
- The app is fully client-side and works offline after loading.
- Game rules, scoring, standings, and winner detection live in `src/games.ts`.
- Each game type renders a dedicated scorecard component.

## Project structure

```text
src/
  App.tsx                  App shell and view routing
  games.ts                 Game metadata, scoring, standings, winners
  storage.ts               localStorage persistence
  types.ts                 Game and setup types
  index.css                Global styles
  screens/
    HomeScreen.tsx         Game list and new-game picker
    SetupScreen.tsx        Player names and per-game options
    ScorecardScreen.tsx    Standings, winner banner, scorecard switcher
    scorecards/
      Phase10Card.tsx
      FiveCrownsCard.tsx
      Rummy500Card.tsx
      GolfCard.tsx
      WinConditionsCard.tsx
      shared.tsx           Shared score input and round header
```

## Tech stack

- React 19
- TypeScript
- Vite 7
- Plain CSS

## Deployment

The live site is published with GitHub Pages from the `gh-pages` branch:

https://tyduptyler13.github.io/score-card/

To publish an update, run `npm run build` and deploy the generated `dist/`
directory to the `gh-pages` branch.
