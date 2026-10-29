import type { ReactNode } from 'react'
import styles from './AppShell.module.css'

export interface AppShellView {
  key: string
  label: string
}

export interface AppShellProps {
  /** Key of the currently active view, must match one of `views[].key`. */
  activeView: string
  /** Called with a view's key when its nav tab is activated. */
  onNavigate: (view: string) => void
  /** Tabs rendered in the nav bar, in order. */
  views: AppShellView[]
  /** Content of the active page, rendered below the nav. */
  children: ReactNode
  className?: string
}

/** Page chrome: title header + horizontal tab nav, with the active page rendered below. */
export function AppShell({ activeView, onNavigate, views, children, className }: AppShellProps) {
  return (
    <div className={className ? `${styles.shell} ${className}` : styles.shell}>
      <header className={styles.header}>
        <h1 className={styles.title}>Personal Finance Analyzer</h1>
      </header>
      <nav className={styles.nav} aria-label="Main">
        {views.map((view) => {
          const isActive = view.key === activeView
          return (
            <button
              key={view.key}
              type="button"
              className={isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onNavigate(view.key)}
            >
              {view.label}
            </button>
          )
        })}
      </nav>
      <main className={styles.content}>{children}</main>
    </div>
  )
}
