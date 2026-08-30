'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatAmount } from '@/lib/currencies'

type CategoryItem = {
  name: string
  value: number
}

const COLORS = ['#1E3A5F', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#3B82F6', '#EC4899']

export default function CategoryChart({
  data,
  currency,
}: {
  data: CategoryItem[]
  currency: string
}) {
  if (data.length === 0) return null

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-navy">Spending by Category</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatAmount(Number(value), currency)} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}