import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatStreams(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('en-IN')
}

export function calculateBreakeven(totalFundingAsk: number, fanRevenueShare: number): number {
  if (totalFundingAsk <= 0 || fanRevenueShare <= 0) return 0
  const revenuePerStream   = 0.05
  const fanPayoutPerStream = revenuePerStream * (fanRevenueShare / 100)
  return Math.ceil(totalFundingAsk / fanPayoutPerStream)
}

export function progressPct(raised: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(100, Math.round((raised / target) * 100))
}