import type { RenewalUrgency } from './subscription-utils'
import { AlertCircle, Clock, CalendarClock, CheckCircle2 } from 'lucide-react'

export const urgencyStyles: Record<
  RenewalUrgency,
  { border: string; bg: string; dot: string; label: string; icon: typeof AlertCircle }
> = {
  urgent: {
    border: 'border-alert',
    bg: 'bg-alert/15',
    dot: 'bg-alert',
    label: 'Red — renewing in 0–3 days',
    icon: AlertCircle,
  },
  soon: {
    border: 'border-[#F59E0B]',
    bg: 'bg-[#F59E0B]/15',
    dot: 'bg-[#F59E0B]',
    label: 'Amber — renewing in 4–7 days',
    icon: Clock,
  },
  upcoming: {
    border: 'border-[#1E3A5F]',
    bg: 'bg-[#1E3A5F]/15',
    dot: 'bg-[#1E3A5F]',
    label: 'Navy — renewing in 8–30 days',
    icon: CalendarClock,
  },
  safe: {
    border: 'border-green',
    bg: 'bg-green/15',
    dot: 'bg-green',
    label: 'Green — renewing more than 30 days away',
    icon: CheckCircle2,
  },
}
export const trialColor = '#8B5CF6'