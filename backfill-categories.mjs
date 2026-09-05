import { createClient } from '@supabase/supabase-js'
import knownServices from './lib/known-services.json' with { type: 'json' }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

function getCategoryForService(serviceName) {
  const lower = serviceName.toLowerCase()
  const match = knownServices.find(
    (s) =>
      s.name.toLowerCase() === lower ||
      s.aliases?.some((alias) => alias.toLowerCase() === lower)
  )
  return match ? match.category : 'Other'
}

async function run() {
  const { data: subs, error } = await supabase.from('subscriptions').select('id, service_name')

  if (error) {
    console.error('Failed to fetch subscriptions:', error.message)
    process.exit(1)
  }

  console.log(`Found ${subs.length} subscriptions. Backfilling categories...`)

  for (const sub of subs) {
    const category = getCategoryForService(sub.service_name)
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ category })
      .eq('id', sub.id)

    if (updateError) {
      console.error(`Failed to update ${sub.service_name} (${sub.id}):`, updateError.message)
    } else {
      console.log(`✓ ${sub.service_name} → ${category}`)
    }
  }

  console.log('Backfill complete.')
}

run()