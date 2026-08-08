'use client'

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

export default function SubscriptionCard({ sub }: { sub: Subscription }) {
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    const confirmed = confirm(`Delete ${sub.service_name}? This cannot be undone.`)
    if (!confirmed) return

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', sub.id)

    if (error) {
      alert('Error deleting: ' + error.message)
      return
    }

    router.refresh()
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '8px' }}>
      <p><strong>{sub.service_name}</strong></p>
      <p>Price: {sub.price}</p>
      <p>Billing Cycle: {sub.billing_cycle}</p>
      <p>Renewal Date: {sub.renewal_date}</p>
      <p>Status: {sub.status}</p>
      <button onClick={() => router.push(`/subscriptions/edit/${sub.id}`)}>
        Edit
      </button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}