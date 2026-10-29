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
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey} tick={TICK} axisLine={false} tickLine={false} tickMargin={8} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} width={48} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={LEGEND_STYLE} />
            {lines.map((line, index) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.label ?? line.key}
                stroke={line.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--color-surface)' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
