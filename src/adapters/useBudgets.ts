import { useCallback, useEffect, useState } from 'react';
import { getAllBudgets, upsertBudget as upsertBudgetRepo } from '../core/services/budgetsRepo';
import type { Budget } from '../core/domain/types';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await getAllBudgets();
    setBudgets(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upsertBudget = useCallback(async (budget: Budget) => {
    await upsertBudgetRepo(budget);
    setBudgets((prev) => [...prev.filter((b) => b.id !== budget.id), budget]);
  }, []);

  return { budgets, loading, upsertBudget, refresh };
}
