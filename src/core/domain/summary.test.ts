import { describe, expect, it } from 'vitest';
import { categoryBreakdown, monthlySummary, trendSeries } from './summary';
import type { Transaction } from './types';

let idCounter = 0;
function tx(overrides: Partial<Transaction>): Transaction {
  idCounter += 1;
  return {
    id: `tx-${idCounter}`,
    date: '2024-05-01',
    description: 'test',
    amount: 10,
    type: 'expense',
    category: 'Other',
    categoryIsManual: false,
    dedupeKey: `key-${idCounter}`,
    importedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('monthlySummary', () => {
  it('totals income, expenses, net and per-category spend for the given month', () => {
    const transactions = [
      tx({ date: '2024-05-01', type: 'income', amount: 1000, category: 'Income' }),
      tx({ date: '2024-05-02', type: 'expense', amount: 50, category: 'Food' }),
      tx({ date: '2024-05-03', type: 'expense', amount: 30, category: 'Food' }),
      tx({ date: '2024-05-04', type: 'expense', amount: 20, category: 'Transport' }),
      tx({ date: '2024-06-01', type: 'expense', amount: 999, category: 'Food' }), // different month
    ];

    const summary = monthlySummary(transactions, '2024-05');
    expect(summary.income).toBe(1000);
    expect(summary.expenses).toBe(100);
    expect(summary.net).toBe(900);
    expect(summary.byCategory.Food).toBe(80);
    expect(summary.byCategory.Transport).toBe(20);
    expect(summary.topCategories).toEqual([
      { category: 'Food', amount: 80 },
      { category: 'Transport', amount: 20 },
    ]);
  });

  it('excludes zero-spend categories and Income from topCategories', () => {
    const transactions = [tx({ date: '2024-05-01', type: 'income', amount: 500, category: 'Income' })];
    const summary = monthlySummary(transactions, '2024-05');
    expect(summary.topCategories).toEqual([]);
  });
});

describe('categoryBreakdown', () => {
  it('matches monthlySummary topCategories for the same month', () => {
    const transactions = [
      tx({ date: '2024-05-01', type: 'expense', amount: 40, category: 'Bills' }),
      tx({ date: '2024-05-02', type: 'expense', amount: 10, category: 'Rent' }),
    ];
    const breakdown = categoryBreakdown(transactions, '2024-05');
    expect(breakdown).toEqual([
      { category: 'Bills', amount: 40 },
      { category: 'Rent', amount: 10 },
    ]);
  });
});

describe('trendSeries', () => {
  it('sorts months chronologically across a year boundary', () => {
    const transactions = [
      tx({ date: '2025-01-15', type: 'expense', amount: 10, category: 'Food' }),
      tx({ date: '2024-12-01', type: 'expense', amount: 20, category: 'Food' }),
      tx({ date: '2024-11-01', type: 'income', amount: 100, category: 'Income' }),
    ];
    const trend = trendSeries(transactions);
    expect(trend.map((t) => t.month)).toEqual(['2024-11', '2024-12', '2025-01']);
    expect(trend[1]).toEqual({ month: '2024-12', income: 0, expenses: 20, net: -20 });
  });
});
