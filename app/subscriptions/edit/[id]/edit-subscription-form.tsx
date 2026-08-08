'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Subscription = {
  id: string
  service_name: string
  price: number
  billing_cycle: string
  renewal_date: string
  status: string
}

export default function EditSubscriptionForm({ sub }: { sub: Subscription }) {
  const [serviceName, setServiceName] = useState(sub.service_name)
  const [price, setPrice] = useState(String(sub.price))
  const [billingCycle, setBillingCycle] = useState(sub.billing_cycle)
  const [renewalDate, setRenewalDate] = useState(sub.renewal_date)
  const [status, setStatus] = useState(sub.status)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase
      .from('subscriptions')
      .update({
        service_name: serviceName,
        price: parseFloat(price),
        billing_cycle: billingCycle,
        renewal_date: renewalDate,
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sub.id)

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/subscriptions')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Service Name</label>
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Price</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Billing Cycle</label>
        <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>
      <div>
        <label>Renewal Date</label>
        <input
          type="date"
          value={renewalDate}
          onChange={(e) => setRenewalDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Active">Active</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}