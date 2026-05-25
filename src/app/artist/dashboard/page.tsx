'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import {
  Music2, Briefcase, TrendingUp,
  Users, Zap, Loader2, ArrowRight,
} from 'lucide-react'

interface DashboardData {
  totalSongs:       number
  totalKhapeetars:  number
  totalFundsRaised: number
  activeDeals:      number
  totalFans:        number
}

function formatINR(n: number) {
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`
  if (n >= 1_000)   return `₹${(n / 1_000).toFixed(1)}K`
  return `₹${n.toLocaleString('en-IN')}`
}

const CARDS = (d: DashboardData) => [
  {
    label:   'Songs Uploaded',
    value:   d.totalSongs,
    icon:    Music2,
    color:   'from-purple-500/20 to-purple-500/5',
    border:  'border-purple-500/20',
    icon_bg: 'bg-purple-500/15',
    icon_cl: 'text-purple-400',
    href:    '/artist/my-songs',
    format:  (v: number) => v.toString(),
  },
  {
    label:   'Funds Raised',
    value:   d.totalFundsRaised,
    icon:    TrendingUp,
    color:   'from-emerald-500/20 to-emerald-500/5',
    border:  'border-emerald-500/20',
    icon_bg: 'bg-emerald-500/15',
    icon_cl: 'text-emerald-400',
    href:    '/artist/raise-funds',
    format:  formatINR,
  },
  {
    label:   'Active Deals',
    value:   d.activeDeals,
    icon:    Briefcase,
    color:   'from-pink-500/20 to-pink-500/5',
    border:  'border-pink-500/20',
    icon_bg: 'bg-pink-500/15',
    icon_cl: 'text-pink-400',
    href:    '/artist/deals',
    format:  (v: number) => v.toString(),
  },
  {
    label:   'Fans Invested',
    value:   d.totalFans,
    icon:    Users,
    color:   'from-sky-500/20 to-sky-500/5',
    border:  'border-sky-500/20',
    icon_bg: 'bg-sky-500/15',
    icon_cl: 'text-sky-400',
    href:    '/artist/raise-funds',
    format:  (v: number) => v.toString(),
  },
  {
    label:   'Khapeetars Worked With',
    value:   d.totalKhapeetars,
    icon:    Zap,
    color:   'from-amber-500/20 to-amber-500/5',
    border:  'border-amber-500/20',
    icon_bg: 'bg-amber-500/15',
    icon_cl: 'text-amber-400',
    href:    '/artist/find-khapeetar',
    format:  (v: number) => v.toString(),
  },
]

const QUICK_LINKS = [
  { label: 'Raise Funds',    href: '/artist/raise-funds',    desc: 'Launch a new campaign' },
  { label: 'Find Khapeetar', href: '/artist/find-khapeetar', desc: 'Hire music professionals' },
  { label: 'My Songs',       href: '/artist/my-songs',       desc: 'Manage your catalogue' },
  { label: 'Work & Deals',   href: '/artist/deals',          desc: 'View negotiations' },
]

export default function ArtistDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [data, setData]       = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/artist/login'); return }

    fetch('/api/artist/dashboard')
      .then(r => r.json())
      .then(j => {
        if (j.success) setData(j.data)
        else setError(j.error || 'Failed to load')
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [session, status])

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Artist'

  if (status === 'loading' || loading) {
    return (
      <ArtistLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-purple-400" size={28} />
        </div>
      </ArtistLayout>
    )
  }

  return (
    <ArtistLayout>
      <div className="min-h-screen bg-black text-white">

        {/* Header */}
        <div className="border-b border-white/5 px-8 py-6">
          <p className="text-sm text-zinc-500 mb-1">Welcome back</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {firstName} <span className="text-zinc-600">✦</span>
          </h1>
        </div>

        <div className="px-8 py-8 space-y-8 max-w-6xl">

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl px-5 py-4">
              {error}
            </div>
          )}

          {/* Metric cards */}
          {data && (
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">Overview</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {CARDS(data).map(({ label, value, icon: Icon, color, border, icon_bg, icon_cl, href, format }) => (
                  <button
                    key={label}
                    onClick={() => router.push(href)}
                    className={`group relative bg-gradient-to-b ${color} border ${border} rounded-2xl p-5 text-left hover:scale-[1.02] transition-all duration-200 hover:shadow-lg`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${icon_bg} flex items-center justify-center mb-4`}>
                      <Icon size={17} className={icon_cl} />
                    </div>
                    <p className="text-2xl font-bold text-white tabular-nums">
                      {format(value)}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1 leading-tight">{label}</p>
                    <ArrowRight
                      size={13}
                      className="absolute top-4 right-4 text-zinc-700 group-hover:text-zinc-400 transition-colors"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">Quick Actions</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {QUICK_LINKS.map(({ label, href, desc }) => (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className="group bg-white/3 hover:bg-white/6 border border-white/8 rounded-2xl px-5 py-4 text-left transition-all duration-200"
                >
                  <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </ArtistLayout>
  )
}