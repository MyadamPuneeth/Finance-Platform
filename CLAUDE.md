# Personal Finance Analyzer

Client-only single-user personal finance tracker: import CSV transactions, auto-categorize spending, manage per-category budgets, visualize trends, generate monthly summaries. No backend, no auth — everything runs and persists in the browser.

## Stack

- React + Vite + TypeScript
- Persistence: IndexedDB via `idb`
- Charts: Recharts
- CSV parse/export: PapaParse
- Validation: Zod
- Tests: Vitest (+ `fake-indexeddb` for repo tests)
- Styling: CSS Modules + `src/styles/tokens.css` custom properties — no Tailwind
- No router (plain tab-state view switching in `App.tsx`), no Zustand/Redux, no `date-fns`

Commands: `npm run dev`, `npm run build`, `npm run lint`, `npx tsc --noEmit`, `npx vitest run`

## Architecture (strict layering)

```
src/
  core/        framework-free logic — domain types, categorization, dedupe, budget math,
               summary aggregation, Zod validation, IndexedDB services, pure utils.
               Zero React imports. Must run and be testable in plain Node.
  adapters/    thin React bridge — hooks (useTransactions, useBudgets, useImportCsv, useSummary).
               `adapters/index.ts` is the ONLY entry point the UI imports from.
  components/  shared, reusable, presentational UI only. No data fetching or business logic.
  pages/       one folder per screen, composes components + adapters hooks.
```

Rules:
- Dependencies flow one way: `pages`/`components` → `adapters` → `core`. Never the reverse.
- `core` never imports React or anything UI-related.
- Monthly summaries, trend series, and category breakdowns are **never stored** — always computed on demand from transactions + budgets (`core/domain/summary.ts`). Don't add a cache/store for them.
- Manual category edits set `categoryIsManual: true` and must never be silently overwritten by auto-categorization.

## Domain model

See `src/core/domain/types.ts` for `Transaction` and `Budget`. Key points: `amount` is always a positive magnitude, sign lives in `type: 'income' | 'expense'`. Fixed category list (8 categories, no user-defined categories). Dedupe uses a plain composite string key (`date|amount|type|description`), not a hash.

## Conventions

- Keep `core` pure and framework-free — if you're tempted to import React there, the logic belongs in `adapters` instead.
- Unit test `core/` logic (categorize, dedupe, budget, summary, validation, csv, repos). Don't write tests for pages/components/charts — low-risk single-user tool.
- No new dependencies without a clear reason the current stack can't do the job (see "Explicitly skipped" in the plan history — Tailwind, date-fns, react-router, state libraries were deliberately rejected).
- CSV import expects fixed headers (`date`, `description`, `amount`, optional `type`/`account`) — no column-mapping UI.
