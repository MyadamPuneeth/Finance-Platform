// Installs indexedDB/IDBKeyRange/IDBRequest/etc as globals — idb needs all of them, not just
// indexedDB/IDBKeyRange, so we use fake-indexeddb's own global-setup entry point.
import 'fake-indexeddb/auto';

import { describe, expect, it } from 'vitest';
import { addTransactionsBulk, getAllTransactions } from './transactionsRepo';
import type { Transaction } from '../domain/types';

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: crypto.randomUUID(),
    date: '2024-05-01',
    description: 'test',
    amount: 10,
    type: 'expense',
    category: 'Other',
    categoryIsManual: false,
    dedupeKey: 'key-1',
    importedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('transactionsRepo (fake-indexeddb)', () => {
  it('adds transactions and reads them back', async () => {
    await addTransactionsBulk([tx({ dedupeKey: 'a' }), tx({ dedupeKey: 'b' })]);
    const all = await getAllTransactions();
    expect(all).toHaveLength(2);
    expect(all.map((t) => t.dedupeKey).sort()).toEqual(['a', 'b']);
  });

  it('does not create two rows for the same dedupeKey (unique index)', async () => {
    const before = (await getAllTransactions()).length;
    await addTransactionsBulk([tx({ dedupeKey: 'a' })]); // 'a' already exists from the previous test
    const after = await getAllTransactions();
    expect(after).toHaveLength(before);
  });
});
