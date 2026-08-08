'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AddSubscriptionForm() {
  const [serviceName, setServiceName] = useState('')
  const [price, setPrice] = useState('')
  const [billingCycle, setBillingCycle] = useState('Monthly')
  const [renewalDate, setRenewalDate] = useState('')
  const [status, setStatus] = useState('Active')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      service_name: serviceName,
      price: parseFloat(price),
      billing_cycle: billingCycle,
      renewal_date: renewalDate,
      status: status,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/profile')
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
        <select
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value)}
        >
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