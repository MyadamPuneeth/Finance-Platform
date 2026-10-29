import { useCallback, useEffect, useState } from 'react';
import {
  deleteTransaction as deleteTransactionRepo,
  getAllTransactions,
  updateTransaction,
} from '../core/services/transactionsRepo';
import type { Category, Transaction } from '../core/domain/types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const txs = await getAllTransactions();
    setTransactions(txs);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateCategory = useCallback(async (id: string, category: Category) => {
    await updateTransaction(id, { category, categoryIsManual: true });
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, category, categoryIsManual: true } : t)));
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    await deleteTransactionRepo(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { transactions, loading, updateCategory, deleteTransaction, refresh };
}
