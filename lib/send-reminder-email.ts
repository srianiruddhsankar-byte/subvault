import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type ReminderType = '7-day' | '3-day' | '1-day' | 'overdue'

type ReminderEmailParams = {
  to: string
  serviceName: string
  price: string // already formatted, e.g. "₹649.00"
  renewalDate: string // already formatted, e.g. "29 Aug 2026"
  reminderType: ReminderType
}

function getSubjectAndMessage(params: ReminderEmailParams): { subject: string; message: string } {
  const { serviceName, price, renewalDate, reminderType } = params

  switch (reminderType) {
    case '7-day':
      return {
        subject: `${serviceName} renews in 7 days`,
        message: `Your ${serviceName} subscription (${price}) renews on ${renewalDate}.`,
      }
    case '3-day':
      return {
        subject: `${serviceName} renews in 3 days`,
        message: `Just a heads up — your ${serviceName} subscription (${price}) renews on ${renewalDate}.`,
      }
    case '1-day':
      return {
        subject: `${serviceName} renews tomorrow`,
        message: `Your ${serviceName} subscription (${price}) renews tomorrow, ${renewalDate}.`,
      }
    case 'overdue':
      return {
        subject: `${serviceName} renewal is overdue`,
        message: `Your ${serviceName} subscription (${price}) was due to renew on ${renewalDate}. Update it in SubVault so your records stay accurate.`,
      }
  }
}

export async function sendReminderEmail(params: ReminderEmailParams) {
  const { subject, message } = getSubjectAndMessage(params)

  const { data, error } = await resend.emails.send({
    from: 'SubVault <onboarding@resend.dev>', // sandbox sender, works only to your own verified email until a domain is added
    to: params.to,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1E3A5F;">${subject}</h2>
        <p style="color: #333; font-size: 15px; line-height: 1.5;">${message}</p>
        
          href="https://subvault-gamma.vercel.app/subscriptions"
          style="display: inline-block; margin-top: 16px; background-color: #1E3A5F; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;"
        >
          View in SubVault
        </a>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send reminder email:', error)
    return { success: false, error }
  }

  return { success: true, data }
}