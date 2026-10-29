import type { ReactNode } from 'react'
import styles from './Table.module.css'

export interface TableColumn<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  align?: 'left' | 'right'
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  /** Shown instead of an empty table body when `rows` is empty. */
  emptyMessage?: string
  className?: string
}

/** Generic data table with horizontal scroll on narrow screens and an empty-state message. */
export function Table<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = 'No data to display.',
  className,
}: TableProps<T>) {
  return (
    <div className={className ? `${styles.wrapper} ${className}` : styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={column.align === 'right' ? styles.alignRight : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={column.align === 'right' ? styles.alignRight : undefined}
                  >
                    {column.render
                      ? column.render(row)
                      : String((row as Record<string, unknown>)[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
