import type { Subscription } from './types'
import { formatDate } from './subscription-utils'

// Wraps a value in quotes and escapes any existing quotes inside it —
// handles service names that might contain commas (e.g. "Streaming, Movies").
function csvEscape(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportSubscriptionsToCSV(subs: Subscription[]): void {
  const headers = ['Service Name', 'Price', 'Billing Cycle', 'Renewal Date', 'Status', 'Category']

  const rows = subs.map((s) => [
    csvEscape(s.service_name),
    csvEscape(s.price),
    csvEscape(s.billing_cycle),
    csvEscape(formatDate(s.renewal_date)),
    csvEscape(s.status),
    csvEscape(s.category || 'Other'),
  ])

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

  // Create a downloadable file entirely in the browser — no server round trip needed.
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `subvault-subscriptions-${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}