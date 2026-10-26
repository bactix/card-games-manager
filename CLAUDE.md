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

### New card game (`src/features/games/<game>/`)
- Implement `GameModule` from `features/games/types.ts` and export it from `<game>/index.ts`.
- A game with its own flow has `rules.ts` (pure functions: `initialState`, `reduce`, `isFinished`, `getResult`, no UI imports) and `Screen.tsx` (its match UI).
- Games scored round by round can use `createRoundScoreGame` from `games/shared/`.
- Register the game in `games/registry.ts`. Nothing else in the app changes.
- Ending a match early is handled for every game by `MatchScreen` (`features/matches`), using the game's `getResult`. Games must not implement their own "end match" button, and their `Screen` must handle `readOnly` when the match was ended before `isFinished` is true.
- Match state is plain JSON so it can be stored locally or sent to an API.

### Rules
1. `app/` contains routes only. Logic and UI live in `features/`.
2. A feature imports another feature only through that feature's `index.ts`, never its internal files.
3. Screens and hooks use `repository.ts`; they never import `.local` or `.api` files directly.
4. `lib/` and `components/` never import from `features/`.
5. Add packages with `npx expo install <package>`.
