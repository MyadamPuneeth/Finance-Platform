import { useState } from 'react';
import { CATEGORIES, useBudgets, useSummary, useTransactions } from '../../adapters';
import type { Category } from '../../adapters';
import { MonthPicker } from '../../components/MonthPicker/MonthPicker';
import { BudgetForm } from '../../components/Forms/BudgetForm';
import { BudgetStatusBadge } from '../../components/Badge/BudgetStatusBadge';
import { computeBudgetStatus } from '../../core/domain/budget';
import { currentMonthKey } from '../../core/utils/date';
import { formatCurrency } from '../../core/utils/currency';
import styles from './BudgetsPage.module.css';

const BUDGET_CATEGORIES = CATEGORIES.filter((c): c is Exclude<Category, 'Income'> => c !== 'Income');

export function BudgetsPage() {
  const [month, setMonth] = useState(currentMonthKey());
  const { budgets, loading: budgetsLoading, upsertBudget } = useBudgets();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { summary } = useSummary(transactions, month);

  if (budgetsLoading || transactionsLoading) {
    return (
      <div className={styles.page}>
        <h2>Budgets</h2>
        <p>Loading budgets…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2>Budgets</h2>
      <MonthPicker value={month} onChange={setMonth} />

      <ul className={styles.list}>
        {BUDGET_CATEGORIES.map((category) => {
          const budget = budgets.find((b) => b.category === category && b.month === month);
          const limitAmount = budget?.limitAmount ?? 0;
          const actualSpend = summary.byCategory[category];
          const { remaining, status } = computeBudgetStatus(limitAmount, actualSpend);

          return (
            <li key={category} className={styles.row}>
              <BudgetForm
                category={category}
                initialLimit={limitAmount}
                onSave={(limit) =>
                  void upsertBudget({ id: `${category}:${month}`, category, month, limitAmount: limit })
                }
                className={styles.form}
              />
              <span className={styles.spend}>Spent: {formatCurrency(actualSpend)}</span>
              <span className={styles.remaining}>
                {remaining >= 0
                  ? `${formatCurrency(remaining)} remaining`
                  : `${formatCurrency(Math.abs(remaining))} over budget`}
              </span>
              <BudgetStatusBadge status={status} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
