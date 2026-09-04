'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { currencies, CurrencyCode } from '@/lib/currencies'

export default function CurrencySelector({
  currentCurrency,
}: {
  currentCurrency: string
}) {
  const [currency, setCurrency] = useState(currentCurrency)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleChange = async (newCurrency: CurrencyCode) => {
    const previousCurrency = currency

    setCurrency(newCurrency)
    setSaving(true)
    setSaved(false)
    setError('')

    const { error: saveError } = await supabase.auth.updateUser({
      data: { currency: newCurrency },
    })

    setSaving(false)

    if (saveError) {
      setCurrency(previousCurrency)
      setError('Could not save. Please try again.')
      return
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mt-6">
      <label className="mb-1 block text-sm text-foreground">Currency</label>
      <select
        value={currency}
        onChange={(e) => handleChange(e.target.value as CurrencyCode)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-navy focus:outline-none"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
      {saving && <p className="mt-1 text-xs text-gray-400">Saving...</p>}
      {saved && <p className="mt-1 text-xs text-green">Saved</p>}
      {error && <p className="mt-1 text-xs text-alert">{error}</p>}
    </div>
  )
}