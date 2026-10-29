import styles from './BudgetStatusBadge.module.css'

export type BudgetStatus = 'ok' | 'warning' | 'exceeded'

export interface BudgetStatusBadgeProps {
  status: BudgetStatus
  /** Defaults to "On track" / "Near limit" / "Over budget" based on `status`. */
  label?: string
  className?: string
}

const DEFAULT_LABELS: Record<BudgetStatus, string> = {
  ok: 'On track',
  warning: 'Near limit',
  exceeded: 'Over budget',
}

const STATUS_CLASS: Record<BudgetStatus, string> = {
  ok: styles.ok,
  warning: styles.warning,
  exceeded: styles.exceeded,
}

/** Small pill badge showing a budget's status as color + text (never color alone). */
export function BudgetStatusBadge({ status, label, className }: BudgetStatusBadgeProps) {
  const classes = [styles.badge, STATUS_CLASS[status], className].filter(Boolean).join(' ')
  return <span className={classes}>{label ?? DEFAULT_LABELS[status]}</span>
}
