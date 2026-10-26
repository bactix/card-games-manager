@AGENTS.md

## Project architecture (card-games-manager)

Every new feature and every new card game MUST follow this structure.

```
src/
├── app/          Routes only (Expo Router). Thin files that render a screen from features/.
├── features/     One folder per domain: gangs, teams, matches, games, and any future feature.
├── lib/          Shared infrastructure with no domain knowledge (storage, repository contract, ids).
└── components/   Shared UI used by more than one feature.
```

### New feature (`src/features/<name>/`)
- `types.ts` – the feature's data types.
- `repository.ts` – the ONLY file that picks the data source; exports a `Repository<T>` from `@/lib/repository`.
- `repository.local.ts` – on-device version (AsyncStorage via `createLocalRepository`).
- `repository.api.ts` – added only when the feature gets an API; switch to it in `repository.ts` and nowhere else.
- `use<Name>.ts` – hook built on the repository (`useRepositoryList` for lists).
- `components/` – UI used only by this feature.
- `index.ts` – the public API of the feature (types and hooks). Features with no data layer skip the repository files.

### Card games
Games are data, not code: a `Game` (name, suit symbol, colour and default `GameRules`) stored by the `games` feature. Adding a game never needs a new folder; users create them in the app.
- Rules (`GameRules`): how the game ends (target score or set rounds), number of players and whether most or least points wins.
- A match (`features/matches`) keeps its own copy of the rules, so editing a game later never changes a game in progress.
- Scoring is pure and lives in `matches/scoring.ts`; screens never compute totals or winners themselves.
- A game that needs its own flow (not points per round) should get its own folder under `features/games/<game>/` with pure `rules.ts` and its own `Screen.tsx`, and the match screen should render it instead of the points table. Do not fork the scoreboard for it.
- Ending a match early is a match feature (`ScoreboardScreen` → game options); the leader under the rules wins.
- Match state is plain JSON so it can be stored locally or sent to an API.

### Rules
1. `app/` contains routes only. Logic and UI live in `features/`.
2. A feature imports another feature only through that feature's `index.ts`, never its internal files.
3. Screens and hooks use `repository.ts`; they never import `.local` or `.api` files directly.
4. `lib/` and `components/` never import from `features/`. Shared UI used by more than one feature goes in `components/`; colours and fonts come from `lib/theme.ts`.
5. Add packages with `npx expo install <package>`.
