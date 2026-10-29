import type { ReactNode } from 'react'
import styles from './AppShell.module.css'

export interface AppShellView {
  key: string
  label: string
  icon?: ReactNode
}

export interface AppShellProps {
  /** Key of the currently active view, must match one of `views[].key`. */
  activeView: string
  /** Called with a view's key when its nav tab is activated. */
  onNavigate: (view: string) => void
  /** Tabs rendered in the nav bar, in order. */
  views: AppShellView[]
  /** Content of the active page, rendered beside the nav. */
  children: ReactNode
  className?: string
}

/** Page chrome: brand + sidebar nav (bottom tab bar on small screens), with the active page beside it. */
export function AppShell({ activeView, onNavigate, views, children, className }: AppShellProps) {
  return (
    <div className={className ? `${styles.shell} ${className}` : styles.shell}>
      <aside className={styles.sidebar}>
        <header className={styles.brand}>
          <svg className={styles.logo} width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
            <rect width="36" height="36" rx="10" fill="currentColor" opacity="0.14" />
            <path d="M9 24l6-7 5 4 7-10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className={styles.eyebrow}>Personal</p>
            <h1 className={styles.title}>Finance Analyzer</h1>
          </div>
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
                {view.icon}
                <span>{view.label}</span>
              </button>
            )
          })}
        </nav>
        <p className={styles.note}>Your data never leaves this browser.</p>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  )
}
