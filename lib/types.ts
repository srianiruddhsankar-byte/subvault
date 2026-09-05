export type Subscription = {
  id: string
  user_id: string
  service_name: string
  price: number
  billing_cycle: string
  renewal_date: string
  status: string
  category: string
  notes: string | null
  is_trial: boolean
}