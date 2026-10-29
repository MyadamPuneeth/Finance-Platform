import { getDb } from './db';
import type { Transaction } from '../domain/types';

// shortcut: each row is added in its own auto-committing transaction (not one shared tx) so a
// unique-index race on a single row can be caught and skipped without aborting the rest of the
// batch — idb's wrapped requests don't exposing a way to preventDefault() on a single request's
// error within a shared transaction. Fine at single-user CSV-import volumes.
export async function addTransactionsBulk(txs: Transaction[]): Promise<void> {
  const db = await getDb();
  for (const tx of txs) {
    try {
      await db.add('transactions', tx);
    } catch {
      // duplicate dedupeKey (unique index) or other constraint race — skip this row, keep going
    }
  }
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const db = await getDb();
  return db.getAll('transactions');
}

export async function getAllDedupeKeys(): Promise<Set<string>> {
  const db = await getDb();
  const keys = await db.getAllKeysFromIndex('transactions', 'by-dedupeKey');
  return new Set(keys);
}

export async function updateTransaction(
  id: string,
  patch: Partial<Pick<Transaction, 'category' | 'categoryIsManual'>>,
): Promise<void> {
  const db = await getDb();
  const existing = await db.get('transactions', id);
  if (!existing) return;
  await db.put('transactions', { ...existing, ...patch });
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('transactions', id);
}
