'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

type SpendingItem = {
  name: string
  monthly: number
}

export default function SpendingChart({ data }: { data: SpendingItem[] }) {
  if (data.length === 0) return null

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-navy">Top Subscriptions by Cost</h2>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 50)}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 13 }} />
          <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Monthly']} />
          <Bar dataKey="monthly" fill="#1E3A5F" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}