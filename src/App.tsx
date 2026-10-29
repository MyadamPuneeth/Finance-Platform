import { useState, type ReactNode } from 'react'
import { BudgetsIcon, ImportIcon, SummaryIcon, TransactionsIcon, TrendsIcon } from './components/Layout/icons'
import { AppShell } from './components/Layout/AppShell'
import { ImportPage } from './pages/Import/ImportPage'
import { TransactionsPage } from './pages/Transactions/TransactionsPage'
import { BudgetsPage } from './pages/Budgets/BudgetsPage'
import { TrendsPage } from './pages/Trends/TrendsPage'
import { MonthlySummaryPage } from './pages/MonthlySummary/MonthlySummaryPage'

type ViewKey = 'import' | 'transactions' | 'budgets' | 'trends' | 'summary'

const VIEWS: { key: ViewKey; label: string; icon: ReactNode }[] = [
  { key: 'import', icon: <ImportIcon />, label: 'Import' },
  { key: 'transactions', icon: <TransactionsIcon />, label: 'Transactions' },
  { key: 'budgets', icon: <BudgetsIcon />, label: 'Budgets' },
  { key: 'trends', icon: <TrendsIcon />, label: 'Trends' },
  { key: 'summary', icon: <SummaryIcon />, label: 'Monthly summary' },
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
