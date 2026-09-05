// The full set of categories used across known-services.json plus "Other"
// for anything manually typed that doesn't match a known service.
// Single source of truth — the Add/Edit form dropdowns pull from this.
export const CATEGORIES = [
  'AI Tools',
  'Books',
  'Bundle',
  'Cloud Storage',
  'Delivery',
  'Design',
  'Developer Tools',
  'Education',
  'Finance',
  'Fitness',
  'Food Delivery',
  'Gaming',
  'Insurance',
  'Internet',
  'Marketing',
  'Mobile',
  'Music',
  'News',
  'Other',
  'Productivity',
  'Reading',
  'Security',
  'Shopping',
  'Streaming',
  'Transport',
  'Wellness',
] as const

export type Category = (typeof CATEGORIES)[number]