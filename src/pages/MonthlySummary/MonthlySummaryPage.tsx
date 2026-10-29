import { useMemo, useState } from 'react';
import { useSummary, useTransactions } from '../../adapters';
import type { Transaction } from '../../adapters';
import { Table } from '../../components/Table/Table';
import { MonthPicker } from '../../components/MonthPicker/MonthPicker';
import { formatCurrency } from '../../core/utils/currency';
import { currentMonthKey, formatDate, toMonthKey } from '../../core/utils/date';
import { buildTransactionsCsv, downloadBlob } from '../../core/utils/export';
import styles from './MonthlySummaryPage.module.css';

export function MonthlySummaryPage() {
  const [month, setMonth] = useState(currentMonthKey());
  const { transactions, loading } = useTransactions();
  const { summary } = useSummary(transactions, month);

  const monthTransactions = useMemo(
    () => transactions.filter((t) => toMonthKey(t.date) === month),
    [transactions, month],
  );

  const header = (
    <header className={styles.header}>
      <div className={styles.headerText}>
        <h2>Monthly summary</h2>
        <p className={styles.subtitle}>Income, spending and where your money went.</p>
      </div>
      {!loading && <MonthPicker value={month} onChange={setMonth} />}
    </header>
  );

  if (loading) {
    return (
      <div className={styles.page}>
        {header}
        <p className={styles.empty} role="status">Loading summary…</p>
      </div>
    );
  }

  const maxCategory = Math.max(0, ...summary.topCategories.map((c) => c.amount));

  return (
    <div className={styles.page}>
      {header}

      {transactions.length === 0 ? (
        <p className={styles.empty}>No transactions yet. Import a CSV to see your summary.</p>
      ) : (
        <>
          <section className={styles.kpis} aria-label="Summary totals">
            <div className={`${styles.kpi} ${styles.kpiIncome}`}>
              <span className={styles.label}>Income</span>
              <span className={styles.value}>{formatCurrency(summary.income)}</span>
            </div>
            <div className={`${styles.kpi} ${styles.kpiExpense}`}>
              <span className={styles.label}>Expenses</span>
              <span className={styles.value}>{formatCurrency(summary.expenses)}</span>
            </div>
            <div className={`${styles.kpi} ${summary.net < 0 ? styles.kpiExpense : styles.kpiIncome}`}>
              <span className={styles.label}>Net</span>
              <span className={styles.value}>{formatCurrency(summary.net)}</span>
            </div>
          </section>

          <section className={styles.card} aria-labelledby="top-cats">
            <h3 id="top-cats" className={styles.cardTitle}>Top spending categories</h3>
            {summary.topCategories.length === 0 ? (
              <p className={styles.empty}>No spending recorded this month.</p>
            ) : (
              <ul className={styles.bars}>
                {summary.topCategories.map((c, i) => (
                  <li key={c.category} className={styles.barRow}>
                    <span className={styles.barName}>{c.category}</span>
                    <span className={styles.barAmount}>{formatCurrency(c.amount)}</span>
                    <span className={styles.track} aria-hidden="true">
                      <span
                        className={styles.fill}
                        style={{
                          width: `${maxCategory > 0 ? (c.amount / maxCategory) * 100 : 0}%`,
                          background: `var(--chart-${(i % 8) + 1})`,
                        }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.card} aria-labelledby="month-tx">
            <div className={styles.cardHead}>
              <h3 id="month-tx" className={styles.cardTitle}>Transactions</h3>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() =>
                    downloadBlob(`transactions-${month}.csv`, buildTransactionsCsv(monthTransactions), 'text/csv')
                  }
                >
                  Export transactions (CSV)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadBlob(`summary-${month}.json`, JSON.stringify(summary, null, 2), 'application/json')
                  }
                >
                  Export summary (JSON)
                </button>
              </div>
            </div>
            <Table<Transaction>
              columns={[
                { key: 'date', header: 'Date', render: (t) => formatDate(t.date) },
                { key: 'description', header: 'Description' },
                { key: 'amount', header: 'Amount', align: 'right', render: (t) => formatCurrency(t.amount) },
                { key: 'category', header: 'Category' },
              ]}
              rows={monthTransactions}
              getRowKey={(t) => t.id}
              emptyMessage="No transactions recorded this month."
            />
          </section>
        </>
      )}
    </div>
  );
}
