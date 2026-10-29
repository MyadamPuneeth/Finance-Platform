import { useState } from 'react'
import { AppShell } from './components/Layout/AppShell'
import { ImportPage } from './pages/Import/ImportPage'
import { TransactionsPage } from './pages/Transactions/TransactionsPage'
import { BudgetsPage } from './pages/Budgets/BudgetsPage'
import { TrendsPage } from './pages/Trends/TrendsPage'
import { MonthlySummaryPage } from './pages/MonthlySummary/MonthlySummaryPage'

type ViewKey = 'import' | 'transactions' | 'budgets' | 'trends' | 'summary'

const VIEWS: { key: ViewKey; label: string }[] = [
  { key: 'import', label: 'Import' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'budgets', label: 'Budgets' },
  { key: 'trends', label: 'Trends' },
  { key: 'summary', label: 'Monthly summary' },
]

function App() {
  const [view, setView] = useState<ViewKey>('import')

  function renderActivePage() {
    switch (view) {
      case 'import':
        return <ImportPage />
      case 'transactions':
        return <TransactionsPage />
      case 'budgets':
        return <BudgetsPage />
      case 'trends':
        return <TrendsPage />
      case 'summary':
        return <MonthlySummaryPage />
    }
  }

  return (
    <AppShell activeView={view} onNavigate={(key) => setView(key as ViewKey)} views={VIEWS}>
      {renderActivePage()}
    </AppShell>
  )
}

export default App
