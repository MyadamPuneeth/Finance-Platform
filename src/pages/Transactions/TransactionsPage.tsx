import { useMemo, useState } from 'react';
import { CATEGORIES, useTransactions } from '../../adapters';
import type { Category, Transaction, TransactionType } from '../../adapters';
import { Table } from '../../components/Table/Table';
import { CategorySelect } from '../../components/Forms/CategorySelect';
import { formatDate } from '../../core/utils/date';
import { formatCurrency } from '../../core/utils/currency';
import styles from './TransactionsPage.module.css';

type TypeFilter = 'All' | TransactionType;
type CategoryFilter = 'All' | Category;

function Header() {
  return (
    <header className={styles.header}>
      <h2>Transactions</h2>
      <p className={styles.subtitle}>Browse, filter and recategorize everything you have imported.</p>
    </header>
  );
}

export function TransactionsPage() {
  const { transactions, loading, updateCategory, deleteTransaction } = useTransactions();
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [type, setType] = useState<TypeFilter>('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((t) => {
      if (category !== 'All' && t.category !== category) return false;
      if (type !== 'All' && t.type !== type) return false;
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      if (query && !t.description.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [transactions, category, type, from, to, search]);

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this transaction? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteTransaction(id);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <p role="status" className={styles.subtitle}>
          Loading transactions…
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <form className={styles.filters} role="search" aria-label="Filter transactions">
        <div className={styles.field}>
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as CategoryFilter)}
          >
            <option value="All">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="filter-type">Type</label>
          <select id="filter-type" value={type} onChange={(event) => setType(event.target.value as TypeFilter)}>
            <option value="All">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="filter-from">From date</label>
          <input id="filter-from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="filter-to">To date</label>
          <input id="filter-to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="filter-search">Search description</label>
          <input
            id="filter-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by description"
          />
        </div>
      </form>

      <Table<Transaction>
        columns={[
          { key: 'date', header: 'Date', render: (t) => formatDate(t.date) },
          { key: 'description', header: 'Description' },
          {
            key: 'amount',
            header: 'Amount',
            align: 'right',
            render: (t) => (
              <span className={t.type === 'income' ? styles.income : styles.expense}>
                {t.type === 'expense' ? '−' : '+'}
                {formatCurrency(t.amount)}
              </span>
            ),
          },
          { key: 'type', header: 'Type' },
          {
            key: 'category',
            header: 'Category',
            render: (t) => (
              <CategorySelect
                value={t.category}
                onChange={(next) => void updateCategory(t.id, next as Category)}
                categories={CATEGORIES}
                label={`Category for ${t.description}`}
                hideLabel
              />
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (t) => (
              <button
                type="button"
                className={styles.deleteButton}
                aria-label={`Delete transaction ${t.description}`}
                onClick={() => handleDelete(t.id)}
                disabled={deletingId === t.id}
              >
                {deletingId === t.id ? 'Deleting…' : 'Delete'}
              </button>
            ),
          },
        ]}
        rows={filtered}
        getRowKey={(t) => t.id}
        emptyMessage={
          transactions.length === 0
            ? 'No transactions yet. Go to Import and upload a CSV to get started.'
            : 'No transactions match your filters.'
        }
      />
    </div>
  );
}
