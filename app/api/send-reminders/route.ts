import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { sendReminderEmail } from '@/lib/send-reminder-email'
import { formatAmount } from '@/lib/currencies'
import { formatDate } from '@/lib/subscription-utils'

type Subscription = {
  id: string
  user_id: string
  service_name: string
  price: number
  billing_cycle: string
  renewal_date: string
  status: string
  overdue_notified: boolean
}

function daysBetween(date1: Date, date2: Date) {
  const oneDay = 1000 * 60 * 60 * 24
  return Math.round((date2.getTime() - date1.getTime()) / oneDay)
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const headersList = await headers()
  const authHeader = headersList.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('status', 'Active')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const remindersSent = []

    console.log('Total active subscriptions found:', subscriptions?.length)

  for (const sub of (subscriptions || []) as Subscription[]) {
    const renewalDate = new Date(sub.renewal_date)
    renewalDate.setHours(0, 0, 0, 0)
    const diff = daysBetween(today, renewalDate)

    console.log(`${sub.service_name}: renewal_date=${sub.renewal_date}, diff=${diff}`)

    let reminderType: '7-day' | '3-day' | '1-day' | 'overdue' | null = null

    if (diff === 7) reminderType = '7-day'
    else if (diff === 3) reminderType = '3-day'
    else if (diff === 1) reminderType = '1-day'
    else if (diff < 0 && !sub.overdue_notified) reminderType = 'overdue'

    if (!reminderType) continue

    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(sub.user_id)
    if (userError || !userData.user?.email) continue
    const userEmail = userData.user.email
    const currency = userData.user.user_metadata?.currency || 'INR'

    const result = await sendReminderEmail({
      to: userEmail,
      serviceName: sub.service_name,
      price: formatAmount(sub.price, currency),
      renewalDate: formatDate(sub.renewal_date),
      reminderType,
    })

    if (result.success) {
      remindersSent.push({ service: sub.service_name, email: userEmail, reminderType })

      if (reminderType === 'overdue') {
        await supabase
          .from('subscriptions')
          .update({ overdue_notified: true })
          .eq('id', sub.id)
      }
    }
  }

  return NextResponse.json({ sent: remindersSent.length, details: remindersSent })
}