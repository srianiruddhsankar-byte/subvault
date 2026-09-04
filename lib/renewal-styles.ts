import type { RenewalUrgency } from './subscription-utils'

export const urgencyStyles: Record<
  RenewalUrgency,
  { border: string; bg: string; dot: string; label: string }
> = {
  urgent: {
    border: 'border-alert',
    bg: 'bg-alert/15',
    dot: 'bg-alert',
    label: 'Red — renewing in 0–3 days',
  },
  soon: {
    border: 'border-[#F59E0B]',
    bg: 'bg-[#F59E0B]/15',
    dot: 'bg-[#F59E0B]',
    label: 'Amber — renewing in 4–7 days',
  },
  upcoming: {
    border: 'border-[#1E3A5F]',
    bg: 'bg-[#1E3A5F]/15',
    dot: 'bg-[#1E3A5F]',
    label: 'Navy — renewing in 8–30 days',
  },
  safe: {
    border: 'border-green',
    bg: 'bg-green/15',
    dot: 'bg-green',
    label: 'Green — renewing more than 30 days away',
  },
}