# Personal Finance Analyzer

A client-only, single-user personal finance tracker. Import CSV transactions, auto-categorize spending, manage per-category budgets, visualize trends, and generate monthly summaries. There is no backend and no auth. Everything runs and persists in your browser (IndexedDB).

## Stack

React, Vite, TypeScript, `idb` (IndexedDB), Recharts, PapaParse, Zod, Vitest, CSS Modules.

## Getting started

```
npm install
npm run dev      # start dev server
npm run build    # type-check and build
npm run lint
npm test         # unit tests (Vitest)
```

## CSV format

Fixed headers, no column mapping: `date`, `description`, `amount`, and optional `type` (`income` | `expense`) and `account`. Duplicate rows are skipped on import.

## Structure

```
src/
  core/        framework-free logic: types, categorization, dedupe, budgets, summaries, validation, IndexedDB services
  adapters/    thin React hooks bridging the UI to core
  components/  shared presentational UI
  pages/       one folder per screen (Import, Transactions, Budgets, Trends, Monthly Summary)
```

Dependencies flow one way: `pages`/`components` → `adapters` → `core`. Monthly summaries and trends are always computed on demand, never stored. Manual category edits are never overwritten by auto-categorization.
