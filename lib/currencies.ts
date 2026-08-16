export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD'

export const currencies: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$)' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (C$)' },
]

export function getCurrencySymbol(code: string | undefined | null): string {
  const match = currencies.find((c) => c.code === code)
  return match ? match.symbol : '₹' // default fallback
}