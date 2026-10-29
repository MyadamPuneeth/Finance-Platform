import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Budget, Transaction } from '../domain/types';

interface FinanceDB extends DBSchema {
  transactions: {
    key: string;
    value: Transaction;
    indexes: {
      'by-date': string;
      'by-category': string;
      'by-type': string;
      'by-dedupeKey': string;
    };
  };
  budgets: {
    key: string;
    value: Budget;
    indexes: { 'by-month': string };
  };
}

let dbPromise: Promise<IDBPDatabase<FinanceDB>> | null = null;

export function getDb(): Promise<IDBPDatabase<FinanceDB>> {
  if (!dbPromise) {
    dbPromise = openDB<FinanceDB>('finance-analyzer', 1, {
      upgrade(db) {
        const transactions = db.createObjectStore('transactions', { keyPath: 'id' });
        transactions.createIndex('by-date', 'date');
        transactions.createIndex('by-category', 'category');
        transactions.createIndex('by-type', 'type');
        transactions.createIndex('by-dedupeKey', 'dedupeKey', { unique: true });

        const budgets = db.createObjectStore('budgets', { keyPath: 'id' });
        budgets.createIndex('by-month', 'month');
      },
    });
  }
  return dbPromise;
}
