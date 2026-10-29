import { getDb } from './db';
import type { Budget } from '../domain/types';

export async function upsertBudget(budget: Budget): Promise<void> {
  const db = await getDb();
  await db.put('budgets', budget);
}

export async function getAllBudgets(): Promise<Budget[]> {
  const db = await getDb();
  return db.getAll('budgets');
}
