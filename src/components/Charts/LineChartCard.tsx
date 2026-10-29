import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './LineChartCard.module.css'

export interface LineChartSeries {
  key: string
  color?: string
  label?: string
}

export interface LineChartCardProps {
  title: string
  data: Record<string, number | string>[]
  xKey: string
  lines: LineChartSeries[]
  className?: string
}

/** Default color rotation used when a series doesn't specify its own color. */
const DEFAULT_COLORS = ['var(--color-primary)', 'var(--color-income)', 'var(--color-expense)']

/** Card-wrapped line chart (Recharts) for trend series, e.g. spending over time. */
export function LineChartCard({ title, data, xKey, lines, className }: LineChartCardProps) {
  return (
    <section className={className ? `${styles.card} ${className}` : styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {data.length === 0 ? (
        <p className={styles.empty}>No data to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} stroke="var(--color-text-muted)" fontSize={12} />
            <YAxis stroke="var(--color-text-muted)" fontSize={12} />
            <Tooltip />
            <Legend />
            {lines.map((line, index) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.label ?? line.key}
                stroke={line.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
