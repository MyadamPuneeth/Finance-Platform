import { useId } from 'react'
import styles from './CategorySelect.module.css'

export interface CategorySelectProps {
  value: string
  onChange: (category: string) => void
  categories: readonly string[]
  /** Accessible label text. Defaults to "Category". */
  label?: string
  id?: string
  /** Visually hide the label (e.g. inline in a table cell) while keeping it accessible. */
  hideLabel?: boolean
  className?: string
}

/** Labeled select for picking one of the fixed categories. */
export function CategorySelect({
  value,
  onChange,
  categories,
  label = 'Category',
  id,
  hideLabel = false,
  className,
}: CategorySelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  return (
    <div className={className ? `${styles.field} ${className}` : styles.field}>
      <label htmlFor={selectId} className={hideLabel ? styles.visuallyHidden : styles.label}>
        {label}
      </label>
      <select
        id={selectId}
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  )
}
