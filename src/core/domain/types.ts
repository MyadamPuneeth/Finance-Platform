export type TransactionType = 'income' | 'expense';

export const CATEGORIES = [
  'Income',
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Rent',
  'Healthcare',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Transaction {
  id: string; // uuid
  date: string; // ISO yyyy-mm-dd
  description: string;
  amount: number; // unsigned magnitude — sign lives in `type`, not here
  type: TransactionType;
  category: Category;
  categoryIsManual: boolean; // true once user overrides; must never be silently overwritten after that
  account?: string;
  dedupeKey: string; // `${date}|${amount}|${type}|${description.trim().toLowerCase()}`
  importedAt: string; // ISO timestamp
}

export interface Budget {
  id: string; // `${category}:${month}`  (category excludes 'Income')
  category: Exclude<Category, 'Income'>;
  month: string; // 'YYYY-MM'
  limitAmount: number;
}
