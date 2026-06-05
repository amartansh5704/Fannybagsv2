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
    accent:  '#a855f7',
    glow:    'rgba(168,85,247,0.15)',
    border:  'rgba(168,85,247,0.2)',
    href:    '/artist/my-songs',
    format:  (v: number) => v.toString(),
  },
  {
    label:   'Funds Raised',
    value:   d.totalFundsRaised,
    icon:    TrendingUp,
    accent:  '#10b981',
    glow:    'rgba(16,185,129,0.15)',
    border:  'rgba(16,185,129,0.2)',
    href:    '/artist/raise-funds',
    format:  formatINR,
  },
  {
    label:   'Active Deals',
    value:   d.activeDeals,
    icon:    Briefcase,
    accent:  '#ec4899',
    glow:    'rgba(236,72,153,0.15)',
    border:  'rgba(236,72,153,0.2)',
    href:    '/artist/deals',
    format:  (v: number) => v.toString(),
  },
  {
    label:   'Fans Invested',
    value:   d.totalFans,
    icon:    Users,
    accent:  '#38bdf8',
    glow:    'rgba(56,189,248,0.15)',
    border:  'rgba(56,189,248,0.2)',
    href:    '/artist/raise-funds',
    format:  (v: number) => v.toString(),
  },
  {
    label:   'Khapeetars Worked With',
    value:   d.totalKhapeetars,
    icon:    Zap,
    accent:  '#f59e0b',
    glow:    'rgba(245,158,11,0.15)',
    border:  'rgba(245,158,11,0.2)',
    href:    '/artist/find-khapeetar',
    format:  (v: number) => v.toString(),
  },
]

const QUICK_LINKS = [
  { label: 'Raise Funds',    href: '/artist/raise-funds',    desc: 'Launch a new campaign',    emoji: '🚀' },
  { label: 'Find Khapeetar', href: '/artist/find-khapeetar', desc: 'Hire music professionals',  emoji: '🎛️' },
  { label: 'My Songs',       href: '/artist/my-songs',       desc: 'Manage your catalogue',     emoji: '🎵' },
  { label: 'Work & Deals',   href: '/artist/deals',          desc: 'View negotiations',         emoji: '🤝' },
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
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#09090f' }}>
          <Loader2 style={{ color:'#a855f7', animation:'spin 1s linear infinite' }} size={28} />
        </div>
      </ArtistLayout>
    )
  }

  return (
    <ArtistLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .db-root { min-height: 100vh; background: #09090f; color: #f0f0f8; font-family: 'DM Sans', sans-serif; }

        /* HEADER */
        .db-header { padding: 32px 40px 28px; border-bottom: 0.5px solid rgba(255,255,255,0.05); position: relative; overflow: hidden; }
        .db-header::before { content:''; position:absolute; top:-60px; right:-60px; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%); pointer-events:none; }
        .db-header-eyebrow { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #2a2a3a; margin-bottom: 8px; }
        .db-header-name { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.8px; display: flex; align-items: center; gap: 10px; }
        .db-header-spark { background: linear-gradient(120deg, #c084fc, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .db-header-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(124,58,237,0.1); border: 0.5px solid rgba(124,58,237,0.2); border-radius: 999px; padding: 4px 12px; font-size: 11px; color: #9f7aea; margin-top: 10px; }
        .db-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: #a855f7; display: inline-block; animation: db-blink 2s infinite; }
        @keyframes db-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        /* CONTENT */
        .db-content { padding: 36px 40px; max-width: 1200px; }

        /* SECTION LABEL */
        .db-section-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #222; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .db-section-label::after { content:''; flex:1; height:0.5px; background:rgba(255,255,255,0.04); }

        /* ERROR */
        .db-error { background: rgba(239,68,68,0.07); border: 0.5px solid rgba(239,68,68,0.18); border-radius: 12px; padding: 13px 18px; font-size: 13px; color: #f87171; margin-bottom: 28px; }

        /* METRIC CARDS */
        .db-metrics-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 40px; }
        .db-metric-card { background: #0d0d18; border-radius: 16px; padding: 20px 18px; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.25s cubic-bezier(0.23,1,0.32,1), box-shadow 0.25s; text-align: left; border: none; font-family: inherit; }
        .db-metric-card:hover { transform: translateY(-4px); }
        .db-metric-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .db-metric-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .db-metric-arrow { color: #1e1e2e; transition: color 0.2s; }
        .db-metric-card:hover .db-metric-arrow { color: #555; }
        .db-metric-value { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
        .db-metric-label { font-size: 11px; color: #333; font-weight: 300; line-height: 1.4; }
        .db-metric-glow { position: absolute; bottom: -20px; right: -20px; width: 80px; height: 80px; border-radius: 50%; filter: blur(30px); opacity: 0.6; pointer-events: none; }

        /* QUICK LINKS */
        .db-quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 40px; }
        .db-quick-card { background: #0d0d18; border: 0.5px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 18px 18px; cursor: pointer; text-align: left; transition: all 0.2s; font-family: inherit; }
        .db-quick-card:hover { background: #111120; border-color: rgba(124,58,237,0.2); transform: translateY(-2px); }
        .db-quick-emoji { font-size: 22px; margin-bottom: 10px; display: block; }
        .db-quick-label { font-family: 'Syne', sans-serif; font-size: 13.5px; font-weight: 700; color: #ddd; margin-bottom: 4px; letter-spacing: -0.2px; }
        .db-quick-desc { font-size: 11.5px; color: #333; font-weight: 300; }
        .db-quick-card:hover .db-quick-label { color: #c084fc; }

        /* ACTIVITY PLACEHOLDER */
        .db-activity { background: #0d0d18; border: 0.5px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; }
        .db-activity-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 16px; letter-spacing: -0.2px; }
        .db-activity-empty { text-align: center; padding: 32px 0; }
        .db-activity-empty-icon { font-size: 36px; margin-bottom: 10px; opacity: 0.3; }
        .db-activity-empty-text { font-size: 12px; color: #222; }

        @media (max-width: 1100px) { .db-metrics-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 800px) {
          .db-metrics-grid { grid-template-columns: repeat(2,1fr); }
          .db-quick-grid { grid-template-columns: repeat(2,1fr); }
          .db-content, .db-header { padding-left: 20px; padding-right: 20px; }
        }
        @media (max-width: 500px) { .db-metrics-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="db-root">

        {/* HEADER */}
        <div className="db-header">
          <div className="db-header-eyebrow">Artist Portal</div>
          <div className="db-header-name">
            Hey, <span className="db-header-spark">{firstName}</span> ✦
          </div>
          <div className="db-header-badge">
            <span className="db-badge-dot"></span>
            Dashboard active
          </div>
        </div>

        {/* CONTENT */}
        <div className="db-content">

          {error && <div className="db-error">{error}</div>}

          {/* METRIC CARDS */}
          {data && (
            <div style={{ marginBottom: '40px' }}>
              <div className="db-section-label">Overview</div>
              <div className="db-metrics-grid">
                {CARDS(data).map(({ label, value, icon: Icon, accent, glow, border, href, format }) => (
                  <button
                    key={label}
                    className="db-metric-card"
                    style={{ border: `0.5px solid ${border}` }}
                    onClick={() => router.push(href)}
                  >
                    <div
                      className="db-metric-glow"
                      style={{ background: glow }}
                    />
                    <div className="db-metric-top">
                      <div
                        className="db-metric-icon"
                        style={{ background: `${glow}` }}
                      >
                        <Icon size={16} style={{ color: accent }} />
                      </div>
                      <ArrowRight size={13} className="db-metric-arrow" />
                    </div>
                    <div className="db-metric-value">{format(value)}</div>
                    <div className="db-metric-label">{label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUICK LINKS */}
          <div style={{ marginBottom: '40px' }}>
            <div className="db-section-label">Quick Actions</div>
            <div className="db-quick-grid">
              {QUICK_LINKS.map(({ label, href, desc, emoji }) => (
                <button
                  key={href}
                  className="db-quick-card"
                  onClick={() => router.push(href)}
                >
                  <span className="db-quick-emoji">{emoji}</span>
                  <div className="db-quick-label">{label}</div>
                  <div className="db-quick-desc">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div>
            <div className="db-section-label">Recent Activity</div>
            <div className="db-activity">
              <div className="db-activity-title">Timeline</div>
              <div className="db-activity-empty">
                <div className="db-activity-empty-icon">🎵</div>
                <div className="db-activity-empty-text">No activity yet — raise your first campaign to get started.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </ArtistLayout>
  )
}