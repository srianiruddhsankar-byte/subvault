import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const resend = new Resend(process.env.RESEND_API_KEY!)

type Subscription = {
  id: string
  user_id: string
  service_name: string
  price: number
  billing_cycle: string
  renewal_date: string
  status: string
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

  for (const sub of (subscriptions || []) as Subscription[]) {
    const renewalDate = new Date(sub.renewal_date)
    renewalDate.setHours(0, 0, 0, 0)
    const diff = daysBetween(today, renewalDate)

    if ([7, 3, 1, 0].includes(diff)) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(sub.user_id)
      if (userError || !userData.user?.email) continue
      const userEmail = userData.user.email

      await resend.emails.send({
        from: 'SubVault <onboarding@resend.dev>',
        to: userEmail,
        subject: `Renewal reminder: ${sub.service_name}`,
        text: `Your ${sub.service_name} subscription (₹${sub.price}) renews on ${sub.renewal_date}.`,
      })

      remindersSent.push({ service: sub.service_name, email: userEmail, diff })
    }
  }

  return NextResponse.json({ sent: remindersSent.length, details: remindersSent })
}