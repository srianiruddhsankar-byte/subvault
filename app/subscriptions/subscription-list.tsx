'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import SubscriptionCard from './subscription-card'
import type { Subscription } from '@/lib/types'

type SortOption = 'renewal_date' | 'price_high' | 'price_low' | 'name'
type FilterOption = 'All' | 'Active' | 'Cancelled'

export default function SubscriptionList({
  subscriptions,
  currency,
}: {
  subscriptions: Subscription[]
  currency: string
}) {
  const [sortBy, setSortBy] = useState<SortOption>('renewal_date')
  const [filterBy, setFilterBy] = useState<FilterOption>('All')
  const [query, setQuery] = useState('')

  const filteredAndSorted = useMemo(() => {
    let result = [...subscriptions]

    if (filterBy !== 'All') {
      result = result.filter((s) => s.status === filterBy)
    }

    if (query.trim() !== '') {
      const q = query.trim().toLowerCase()
      result = result.filter((s) => s.service_name.toLowerCase().includes(q))
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_high':
          return b.price - a.price
        case 'price_low':
          return a.price - b.price
        case 'name':
          return a.service_name.localeCompare(b.service_name)
        case 'renewal_date':
        default:
          return new Date(a.renewal_date).getTime() - new Date(b.renewal_date).getTime()
      }
    })

    return result
  }, [subscriptions, sortBy, filterBy, query])

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm focus:border-navy focus:outline-none"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-navy focus:outline-none"
        >
          <option value="renewal_date">Sort: Renewal Date</option>
          <option value="price_high">Sort: Price (High to Low)</option>
          <option value="price_low">Sort: Price (Low to High)</option>
          <option value="name">Sort: Name (A-Z)</option>
        </select>

        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as FilterOption)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-navy focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active Only</option>
          <option value="Cancelled">Cancelled Only</option>
        </select>
      </div>

      {filteredAndSorted.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredAndSorted.map((sub) => (
            <SubscriptionCard key={sub.id} sub={sub} currency={currency} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-card p-8 text-center shadow-sm">
          <p className="text-gray-500">
            {query.trim() !== ''
              ? `No subscriptions match "${query}".`
              : 'No subscriptions match this filter.'}
          </p>
        </div>
      )}
    </div>
  )
}