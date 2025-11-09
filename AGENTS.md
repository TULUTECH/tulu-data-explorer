# Repository Guidelines

## Project Structure & Module Organization
This repository uses the Next.js App Router, so each route segment in `src/app` contains its page, layout, and loading states. Reusable UI sits in `src/components`, while Redux wiring lives in `src/store` (`ReduxProvider`, slices, and `store.ts`). Supporting code is grouped by concern: configuration helpers in `src/lib`, memoizable utilities in `src/helpers`, static lookups in `src/constants`, domain data inside `src/data`, and custom hooks in `src/hooks`. Static files stay under `public/`, and TypeScript declarations belong in `src/types`.

## Build, Test, and Development Commands
- `npm run dev` launches the local development server with hot reloading.
- `npm run build` produces the production bundle; use it to catch server-only regressions.
- `npm run start` runs the compiled app locally to mirror deployment behavior.
- `npm run lint` executes ESLint (Next + Prettier config) and should be clean before review.
- `npm run format` applies Prettier to the entire workspace after large edits or before committing.

## Coding Style & Naming Conventions
All source files should be TypeScript (`.ts` / `.tsx`). Prettier is the single source of truth for formatting (two-space indent, trailing commas, double quotes in JSX). Use PascalCase for components and file names in `src/components`, camelCase for variables and functions, and SCREAMING_SNAKE_CASE for shared constants. Prefer Tailwind utilities; add a helper class in `globals.css` only when a utility gap exists.

## Testing Guidelines
Automated testing is not yet wired, so new work should introduce tests alongside features. Add React Testing Library + Jest tests in a `src/tests` directory (or a colocated `__tests__` folder) and follow the `ComponentName.test.tsx` naming pattern. Focus on data-heavy behaviors—table filtering, Redux selectors, and helper utilities—until a `npm run test` script is established.

## Filtering & Aggregations
Dimension filters live in `dataExplorerSlice.dimensionFilters` and render through `DimensionValueFilters`. Derive dropdown values with `getDimensionValueMap(initialData)` and always run `filterByDimensionValues` before `aggregateDataByKeys` so WHERE-style clauses and metric-only summaries stay consistent with table selections. Use `calculateMetricTotals` + `CalculationsPanel` to surface total cost/revenue/impressions or derived KPIs (CTR, CPC, ROAS) for the currently filtered dataset.

## Commit & Pull Request Guidelines
Commits in this repo use short, imperative summaries (`added error handling`, `fixed imports`). Mirror that style, keep subjects under ~60 characters, and explain the why inside the body when needed. Pull requests must outline the change, list validation steps (`npm run dev`, screenshots for UI updates), link related issues, and call out temporary flags such as the commented authentication hooks so reviewers know what to watch.
