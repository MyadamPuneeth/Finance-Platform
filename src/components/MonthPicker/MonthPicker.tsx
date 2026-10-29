import { useId } from 'react'
import styles from './MonthPicker.module.css'

export interface MonthPickerProps {
  /** Selected month as 'YYYY-MM'. */
  value: string
  onChange: (month: string) => void
  /** If given, renders a select limited to these 'YYYY-MM' months instead of a free-form month input. */
  availableMonths?: string[]
  label?: string
  id?: string
  className?: string
}

function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split('-').map(Number)
  if (!year || !monthNum) return month
  const date = new Date(year, monthNum - 1, 1)
  return date.toLocaleDateString('default', { month: 'long', year: 'numeric' })
}

/** Month picker: a select of `availableMonths` when provided, else a native month input. */
export function MonthPicker({
  value,
  onChange,
  availableMonths,
  label = 'Month',
  id,
  className,
}: MonthPickerProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  return (
    <div className={className ? `${styles.field} ${className}` : styles.field}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
      </label>
      {availableMonths ? (
        <select
          id={fieldId}
          className={styles.control}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {formatMonthLabel(month)}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          type="month"
          className={styles.control}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  )
}
