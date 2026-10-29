import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import styles from './PieChartCard.module.css'

export interface PieChartDatum {
  name: string
  value: number
}

export interface PieChartCardProps {
  title: string
  data: PieChartDatum[]
  colors?: string[]
  className?: string
}

/** Default color rotation used when `colors` isn't given. */
const DEFAULT_COLORS = ['var(--color-primary)', 'var(--color-income)', 'var(--color-expense)']

/** Card-wrapped pie chart (Recharts) with a legend, e.g. spending breakdown by category. */
export function PieChartCard({ title, data, colors, className }: PieChartCardProps) {
  const palette = colors ?? DEFAULT_COLORS
  return (
    <section className={className ? `${styles.card} ${className}` : styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {data.length === 0 ? (
        <p className={styles.empty}>No data to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={palette[index % palette.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
