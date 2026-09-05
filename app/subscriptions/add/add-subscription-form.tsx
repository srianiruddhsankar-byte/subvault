'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ServiceAutocomplete from '@/components/ServiceAutocomplete'
import { KnownService } from '@/lib/search-services'
import { isRenewalDateTooFarInPast } from '@/lib/subscription-utils'

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

  const handleServiceSelect = (service: KnownService) => {
    setServiceName(service.name)
    if (service.avgPrice > 0) {
      setPrice(service.avgPrice.toString())
    }
  }

  const validate = (): string | null => {
    if (!serviceName.trim()) {
      return 'Service name is required.'
    }

    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return 'Price cannot be negative. Enter 0 for a free subscription.'
    }

    if (!renewalDate) {
      return 'Renewal date is required.'
    }

    if (isRenewalDateTooFarInPast(renewalDate, billingCycle)) {
      return `Renewal date is too far in the past for a ${billingCycle} subscription.`
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      service_name: serviceName.trim(),
      price: parseFloat(price),
      billing_cycle: billingCycle,
      renewal_date: renewalDate,
      status: status,
    })

    setLoading(false)

    if (error) {
      setError('Something went wrong saving your subscription. Please try again.')
      return
    }

    router.push('/subscriptions')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg bg-card p-8 shadow-sm">
      <div>
        <label className="mb-1 block text-sm text-foreground">Service Name</label>
        <ServiceAutocomplete
          value={serviceName}
          onChange={setServiceName}
          onSelect={handleServiceSelect}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-foreground">Price</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-navy focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-400">Enter 0 if this subscription is free.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm text-foreground">Billing Cycle</label>
        <select
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-navy focus:outline-none"
        >
          <option value="Monthly">Monthly (1 Month)</option>
          <option value="Quarterly">Quarterly (3 Months)</option>
          <option value="Half-Yearly">Half-Yearly (6 Months)</option>
          <option value="9-Monthly">9-Monthly (9 Months)</option>
          <option value="Yearly">Yearly (12 Months)</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-foreground">Renewal Date</label>
        <input
          type="date"
          value={renewalDate}
          onChange={(e) => setRenewalDate(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-navy focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-foreground">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-navy focus:outline-none"
        >
          <option value="Active">Active</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      {error && <p className="text-sm text-alert">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-md bg-navy px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}