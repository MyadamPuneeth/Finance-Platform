import { useId, useState } from 'react'
import styles from './BudgetForm.module.css'

export interface BudgetFormProps {
  category: string
  initialLimit: number
  onSave: (limit: number) => void
  className?: string
}

/** Single-row form for editing one category's budget limit; save is disabled until the value changes to something valid. */
export function BudgetForm({ category, initialLimit, onSave, className }: BudgetFormProps) {
  const [limitInput, setLimitInput] = useState(String(initialLimit))
  const [syncedLimit, setSyncedLimit] = useState(initialLimit)
  const inputId = useId()

  // Re-sync when the parent provides a new baseline (e.g. after a successful save).
  if (initialLimit !== syncedLimit) {
    setSyncedLimit(initialLimit)
    setLimitInput(String(initialLimit))
  }

  const parsedLimit = Number(limitInput)
  const isInvalid = limitInput.trim() === '' || Number.isNaN(parsedLimit) || parsedLimit < 0
  const isUnchanged = !isInvalid && parsedLimit === initialLimit

  return (
    <form
      className={className ? `${styles.row} ${className}` : styles.row}
      onSubmit={(event) => {
        event.preventDefault()
        if (!isInvalid && !isUnchanged) onSave(parsedLimit)
      }}
    >
      <span className={styles.category}>{category}</span>
      <label htmlFor={inputId} className={styles.visuallyHidden}>
        Monthly budget limit for {category}
      </label>
      <input
        id={inputId}
        type="number"
        min={0}
        step="0.01"
        className={styles.input}
        value={limitInput}
        onChange={(event) => setLimitInput(event.target.value)}
        aria-invalid={isInvalid}
      />
      <button type="submit" className={styles.save} disabled={isInvalid || isUnchanged}>
        Save
      </button>
    </form>
  )
}
