import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './BarChartCard.module.css'

export interface BarChartSeries {
  key: string
  color?: string
  label?: string
}

export interface BarChartCardProps {
  title: string
  data: Record<string, number | string>[]
  xKey: string
  bars: BarChartSeries[]
  className?: string
}

/** Default color rotation used when a series doesn't specify its own color. */
const DEFAULT_COLORS = ['var(--color-primary)', 'var(--color-income)', 'var(--color-expense)']

/** Card-wrapped bar chart (Recharts), e.g. budget vs. actual by category. */
export function BarChartCard({ title, data, xKey, bars, className }: BarChartCardProps) {
  return (
    <section className={className ? `${styles.card} ${className}` : styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {data.length === 0 ? (
        <p className={styles.empty}>No data to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} stroke="var(--color-text-muted)" fontSize={12} />
            <YAxis stroke="var(--color-text-muted)" fontSize={12} />
            <Tooltip />
            <Legend />
            {bars.map((bar, index) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.label ?? bar.key}
                fill={bar.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
