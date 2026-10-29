import { useMemo } from 'react';
import { categoryBreakdown, monthlySummary, trendSeries } from '../core/domain/summary';
import type { Transaction } from '../core/domain/types';

export function useSummary(transactions: Transaction[], month: string) {
  return useMemo(
    () => ({
      summary: monthlySummary(transactions, month),
      trend: trendSeries(transactions),
      breakdown: categoryBreakdown(transactions, month),
    }),
    [transactions, month],
  );
}
