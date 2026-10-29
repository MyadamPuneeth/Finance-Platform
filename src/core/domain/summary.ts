import { CATEGORIES } from './types';
import type { Category, Transaction } from './types';

export interface MonthlySummary {
  income: number;
  expenses: number;
  net: number;
  byCategory: Record<Category, number>;
  topCategories: { category: Category; amount: number }[];
}

export function monthlySummary(transactions: Transaction[], month: string): MonthlySummary {
  const inMonth = transactions.filter((t) => t.date.startsWith(month));

  const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
  let income = 0;
  let expenses = 0;

  for (const t of inMonth) {
    if (t.type === 'income') {
      income += t.amount;
    } else {
      expenses += t.amount;
      byCategory[t.category] += t.amount;
    }
  }

  const topCategories = CATEGORIES.filter((c) => c !== 'Income' && byCategory[c] > 0)
    .map((category) => ({ category, amount: byCategory[category] }))
    .sort((a, b) => b.amount - a.amount);

  return { income, expenses, net: income - expenses, byCategory, topCategories };
}

export function trendSeries(
  transactions: Transaction[],
): { month: string; income: number; expenses: number; net: number }[] {
  const months = new Set(transactions.map((t) => t.date.slice(0, 7)));
  // 'YYYY-MM' sorts correctly as a plain string, including across year boundaries.
  return Array.from(months)
    .sort()
    .map((month) => {
      const { income, expenses, net } = monthlySummary(transactions, month);
      return { month, income, expenses, net };
    });
}

export function categoryBreakdown(transactions: Transaction[], month: string): { category: Category; amount: number }[] {
  return monthlySummary(transactions, month).topCategories;
}
