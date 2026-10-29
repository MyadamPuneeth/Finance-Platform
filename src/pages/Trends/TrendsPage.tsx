import { useState } from 'react';
import { useSummary, useTransactions } from '../../adapters';
import { MonthPicker } from '../../components/MonthPicker/MonthPicker';
import { LineChartCard } from '../../components/Charts/LineChartCard';
import { BarChartCard } from '../../components/Charts/BarChartCard';
import { PieChartCard } from '../../components/Charts/PieChartCard';
import { currentMonthKey } from '../../core/utils/date';
import styles from './TrendsPage.module.css';

export function TrendsPage() {
  const [month, setMonth] = useState(currentMonthKey());
  const { transactions, loading } = useTransactions();
  const { trend, breakdown } = useSummary(transactions, month);

  if (loading) {
    return (
      <div className={styles.page}>
        <h2>Trends</h2>
        <p>Loading trends…</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={styles.page}>
        <h2>Trends</h2>
        <p>No transactions yet. Import a CSV to see income, expense and category trends.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2>Trends</h2>
      <MonthPicker value={month} onChange={setMonth} label="Category breakdown month" />

      <LineChartCard
        title="Income, expenses and net over time"
        data={trend}
        xKey="month"
        lines={[
          { key: 'income', label: 'Income', color: 'var(--color-income)' },
          { key: 'expenses', label: 'Expenses', color: 'var(--color-expense)' },
          { key: 'net', label: 'Net', color: 'var(--color-primary)' },
        ]}
      />

      <BarChartCard
        title="Income vs. expenses vs. net by month"
        data={trend}
        xKey="month"
        bars={[
          { key: 'income', label: 'Income', color: 'var(--color-income)' },
          { key: 'expenses', label: 'Expenses', color: 'var(--color-expense)' },
          { key: 'net', label: 'Net', color: 'var(--color-primary)' },
        ]}
      />

      <PieChartCard
        title="Spending by category for the selected month"
        data={breakdown.map((b) => ({ name: b.category, value: b.amount }))}
      />
    </div>
  );
}
