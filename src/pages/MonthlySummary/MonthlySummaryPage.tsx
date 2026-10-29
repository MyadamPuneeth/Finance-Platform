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

  if (loading) {
    return (
      <div className={styles.page}>
        <h2>Monthly summary</h2>
        <p>Loading summary…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2>Monthly summary</h2>
      <MonthPicker value={month} onChange={setMonth} />

      {transactions.length === 0 ? (
        <p>No transactions yet. Import a CSV to see your summary.</p>
      ) : (
        <>
          <section className={styles.summaryCard} aria-label="Summary totals">
            <div className={styles.summaryItem}>
              <span className={styles.label}>Income</span>
              <span className={styles.income}>{formatCurrency(summary.income)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Expenses</span>
              <span className={styles.expense}>{formatCurrency(summary.expenses)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Net</span>
              <span>{formatCurrency(summary.net)}</span>
            </div>
          </section>

          <section>
            <h3>Top spending categories</h3>
            {summary.topCategories.length === 0 ? (
              <p>No spending recorded this month.</p>
            ) : (
              <ul className={styles.topList}>
                {summary.topCategories.map((c) => (
                  <li key={c.category}>
                    {c.category}: {formatCurrency(c.amount)}
                  </li>
                ))}
              </ul>
            )}
          </section>

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

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() =>
                downloadBlob(`transactions-${month}.csv`, buildTransactionsCsv(monthTransactions), 'text/csv')
              }
            >
              Export transactions (CSV)
            </button>
            <button
              type="button"
              onClick={() => downloadBlob(`summary-${month}.json`, JSON.stringify(summary, null, 2), 'application/json')}
            >
              Export summary (JSON)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
