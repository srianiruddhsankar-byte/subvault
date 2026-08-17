'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { formatAmount } from '@/lib/currencies'

type SpendingItem = {
  name: string
  monthly: number
}

export default function SpendingChart({
  data,
  currency,
}: {
  data: SpendingItem[]
  currency: string
}) {
  if (data.length === 0) return null

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-navy">Top Subscriptions by Cost</h2>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 50)}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 13 }} />
          <Tooltip formatter={(value) => [formatAmount(Number(value), currency), 'Monthly']} />
          <Bar dataKey="monthly" fill="#1E3A5F" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}