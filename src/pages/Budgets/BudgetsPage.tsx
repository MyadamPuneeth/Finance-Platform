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

  const header = (
    <header className={styles.header}>
      <div>
        <h2>Budgets</h2>
        <p className={styles.subtitle}>Set a monthly limit for each category and track how much is left.</p>
      </div>
      <MonthPicker value={month} onChange={setMonth} />
    </header>
  );

  if (budgetsLoading || transactionsLoading) {
    return (
      <div className={styles.page} aria-busy="true">
        {header}
        <p className={styles.srOnly} role="status">Loading budgets…</p>
        <ul className={styles.grid} aria-hidden="true">
          {BUDGET_CATEGORIES.map((c) => (
            <li key={c} className={`${styles.card} ${styles.skeleton}`} />
          ))}
        </ul>
      </div>
    );
  }

  const rows = BUDGET_CATEGORIES.map((category) => {
    const budget = budgets.find((b) => b.category === category && b.month === month);
    const limitAmount = budget?.limitAmount ?? 0;
    const actualSpend = summary.byCategory[category];
    return { category, limitAmount, actualSpend, ...computeBudgetStatus(limitAmount, actualSpend) };
  });
  const totalLimit = rows.reduce((s, r) => s + r.limitAmount, 0);
  const totalSpent = rows.reduce((s, r) => s + r.actualSpend, 0);

  return (
    <div className={styles.page}>
      {header}

      <dl className={styles.totals}>
        <div>
          <dt>Total budgeted</dt>
          <dd>{formatCurrency(totalLimit)}</dd>
        </div>
        <div>
          <dt>Total spent</dt>
          <dd>{formatCurrency(totalSpent)}</dd>
        </div>
        <div>
          <dt>{totalLimit - totalSpent >= 0 ? 'Left to spend' : 'Over budget'}</dt>
          <dd className={totalLimit - totalSpent < 0 ? styles.over : undefined}>
            {formatCurrency(Math.abs(totalLimit - totalSpent))}
          </dd>
        </div>
      </dl>

      <ul className={styles.grid}>
        {rows.map(({ category, limitAmount, actualSpend, remaining, status }) => {
          const pct = limitAmount > 0 ? Math.min(100, (actualSpend / limitAmount) * 100) : 0;
          return (
            <li key={category} className={styles.card}>
              <BudgetForm
                category={category}
                initialLimit={limitAmount}
                onSave={(limit) =>
                  void upsertBudget({ id: `${category}:${month}`, category, month, limitAmount: limit })
                }
                className={styles.form}
              />
              <div
                className={styles.track}
                role="progressbar"
                aria-label={`${category} spending`}
                aria-valuemin={0}
                aria-valuemax={limitAmount}
                aria-valuenow={Math.min(actualSpend, limitAmount)}
                aria-valuetext={`${formatCurrency(actualSpend)} of ${formatCurrency(limitAmount)} spent`}
              >
                <div className={`${styles.fill} ${styles[status] ?? ''}`} style={{ width: `${pct}%` }} />
              </div>
              <div className={styles.figures}>
                <div>
                  <span className={styles.label}>Spent</span>
                  <span className={styles.amount}>{formatCurrency(actualSpend)}</span>
                </div>
                <div className={styles.right}>
                  <span className={styles.label}>{remaining >= 0 ? 'Remaining' : 'Over budget'}</span>
                  <span className={`${styles.amount} ${remaining < 0 ? styles.over : ''}`}>
                    {formatCurrency(Math.abs(remaining))}
                  </span>
                </div>
              </div>
              <BudgetStatusBadge status={status} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
