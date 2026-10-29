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
const LEGEND_STYLE = { fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }


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
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={96}
              paddingAngle={2}
              stroke="var(--color-surface)"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={palette[index % palette.length]} />
              ))}
            </Pie>
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={LEGEND_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
