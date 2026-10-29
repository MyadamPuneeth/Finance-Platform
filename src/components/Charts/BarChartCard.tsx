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
const DEFAULT_COLORS = Array.from({ length: 8 }, (_, i) => `var(--chart-${i + 1})`)

const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)',
    fontSize: 'var(--font-size-sm)',
  },
  itemStyle: { color: 'var(--color-text)', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' },
}
const TICK = { fill: 'var(--color-text-muted)', fontSize: 12 }
const LEGEND_STYLE = { fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }


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
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey} tick={TICK} axisLine={false} tickLine={false} tickMargin={8} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} width={48} />
            <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: 'var(--color-surface-raised)' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={LEGEND_STYLE} />
            {bars.map((bar, index) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.label ?? bar.key}
                fill={bar.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
