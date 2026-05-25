'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import { formatINR, formatStreams, progressPct, calculateBreakeven } from '@/lib/utils'
import {
  ArrowLeft, Music, TrendingUp, Users, Mic2,
  BarChart2, Loader2, DollarSign, Activity, Star
} from 'lucide-react'
import Link from 'next/link'

const REVENUE_PER_STREAM = 0.0005

const STATUS_STYLES: Record<string, string> = {
  pending_approval: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  live:             'bg-green-500/15  text-green-300  border-green-500/30',
  funded:           'bg-blue-500/15   text-blue-300   border-blue-500/30',
  failed:           'bg-red-500/15    text-red-400    border-red-500/30',
  draft:            'bg-white/8       text-zinc-400   border-white/10',
}
const STATUS_LABELS: Record<string, string> = {
  pending_approval: '⏳ Pending Admin Review',
  live:             '🟢 Live',
  funded:           '✅ Funded',
  failed:           '❌ Failed',
  draft:            '📝 Draft',
}

export default function SongDetailPage() {
  const { id }            = useParams<{ id: string }>()
  const [song, setSong]   = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then(r => r.json())
      .then(j => { if (j.success) setSong(j.data); else setError('Song not found') })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <ArtistLayout>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-purple-400" size={32} />
      </div>
    </ArtistLayout>
  )

  if (error || !song) return (
    <ArtistLayout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-400">{error || 'Song not found'}</p>
        <Link href="/artist/my-songs" className="text-sm text-purple-400 hover:underline">← Back to My Songs</Link>
      </div>
    </ArtistLayout>
  )

  const c         = song.campaign
  const m         = song.metrics
  const dist      = song.distribution
  const fanShare  = c?.fanRevenueShare ?? 0
  const artistPct = 100 - fanShare
  const pct       = c ? progressPct(c.amountRaised, c.totalFundingAsk) : 0
  const breakeven = c ? calculateBreakeven(c.totalFundingAsk, fanShare) : 0
  const fanPayPS  = REVENUE_PER_STREAM * (fanShare / 100)
  const status    = c?.status ?? song.status ?? 'draft'

  // Per 1M streams projections
  const perM        = REVENUE_PER_STREAM * 1_000_000
  const fanPoolPerM  = perM * (fanShare / 100)
  const artistPerM   = perM * (artistPct / 100)

  const StatCard = ({ icon: Icon, label, value, sub, color = 'text-white' }: {
    icon: any; label: string; value: string; sub?: string; color?: string
  }) => (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-zinc-500" />
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-xl font-semibold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  )

  const LiveBadge = () => (
    <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
      Live from backend
    </span>
  )

  return (
    <ArtistLayout>
      <div className="min-h-screen bg-black">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-white/6 px-8 py-4 flex items-center justify-between">
          <Link href="/artist/my-songs" className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> My Songs
          </Link>
          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}>
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          {/* Hero */}
          <div className="relative rounded-3xl border border-white/8 overflow-hidden bg-gradient-to-br from-purple-900/20 via-black to-pink-900/10 p-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="flex gap-6 items-start relative">
              <div className="w-32 h-32 rounded-2xl border border-white/10 overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                {song.coverArtUrl
                  ? <img src={song.coverArtUrl} alt={song.title} className="w-full h-full object-cover" />
                  : <Music size={36} className="text-zinc-600" />
                }
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {song.genre && (
                    <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full">{song.genre}</span>
                  )}
                  <span className="text-xs bg-white/5 text-zinc-400 border border-white/10 px-2.5 py-0.5 rounded-full">{song.language}</span>
                  {dist?.explicitLyrics && (
                    <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full">E</span>
                  )}
                </div>
                <h1 className="text-3xl font-semibold tracking-tight mb-1">{song.title}</h1>
                <p className="text-zinc-500 text-sm mb-2">
                  by <span className="text-zinc-300">{dist?.primaryArtist || song.artist?.name || '—'}</span>
                  {dist?.additionalArtists?.length > 0 && ` ft. ${dist.additionalArtists.join(', ')}`}
                </p>
                <p className="text-xs text-zinc-600">
                  Created {new Date(song.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            {song.description && (
              <p className="mt-5 text-sm text-zinc-400 leading-relaxed border-t border-white/6 pt-5">{song.description}</p>
            )}
          </div>

          {/* Funding progress */}
          {c && (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <DollarSign size={15} className="text-green-400" /> Funding Progress
                </h2>
                <span className="text-2xl font-bold text-white">{pct}%</span>
              </div>
              <div className="h-2 bg-white/6 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                {[
                  { label: 'Raised',  val: formatINR(c.amountRaised),    color: 'text-green-300' },
                  { label: 'Target',  val: formatINR(c.totalFundingAsk), color: 'text-white' },
                  { label: 'Remaining', val: formatINR(Math.max(0, c.totalFundingAsk - c.amountRaised)), color: 'text-zinc-400' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="text-center">
                    <p className="text-xs text-zinc-600 mb-0.5">{label}</p>
                    <p className={`text-base font-semibold ${color}`}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finance grid */}
          <div>
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BarChart2 size={14} /> Financial Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={TrendingUp}  label="Fan Share"        value={`${fanShare}%`}                   color="text-purple-300" />
              <StatCard icon={TrendingUp}  label="Artist Retains"   value={`${artistPct}%`}                  color="text-green-300" />
              <StatCard icon={BarChart2}   label="Breakeven"        value={formatStreams(breakeven)}          sub="streams needed" />
              <StatCard icon={DollarSign}  label="Fan Payout/Stream" value={`₹${fanPayPS.toFixed(7)}`} />
            </div>
          </div>

          {/* Royalty projections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Star size={14} className="text-purple-400" /> Per 1M Streams Projection
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Revenue',          val: formatINR(perM),        color: 'text-white' },
                  { label: `Fan Pool (${fanShare}%)`, val: formatINR(fanPoolPerM), color: 'text-purple-300' },
                  { label: `You (${artistPct}%)`,     val: formatINR(artistPerM),  color: 'text-green-300' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex justify-between text-sm border-b border-white/6 pb-2 last:border-0 last:pb-0">
                    <span className="text-zinc-500">{label}</span>
                    <span className={`font-semibold ${color}`}>{val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-1.5 rounded-full overflow-hidden bg-white/8 flex">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full" style={{ width: `${fanShare}%` }} />
              </div>
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>Fans {fanShare}%</span><span>You {artistPct}%</span>
              </div>
            </div>

            {/* Live metrics */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                <Activity size={14} className="text-green-400" /> Live Metrics
              </h3>
              <p className="text-xs text-zinc-600 mb-4">Updated from backend in real-time</p>
              <div className="space-y-3">
                {[
                  { label: 'Total Streams',      val: formatStreams(m?.totalStreams ?? 0) },
                  { label: 'Monthly Streams',    val: formatStreams(m?.monthlyStreams ?? 0) },
                  { label: 'Total Revenue',      val: formatINR(m?.totalRevenue ?? 0) },
                  { label: 'Monthly Revenue',    val: formatINR(m?.monthlyRevenue ?? 0) },
                  { label: 'Fan Payouts Total',  val: formatINR(m?.fanPayoutsTotal ?? 0) },
                  { label: 'Artist Earnings',    val: formatINR(m?.artistEarnings ?? 0) },
                  { label: 'Total Investors',    val: String(m?.totalInvestors ?? 0) },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-500">{label}</span>
                      <LiveBadge />
                    </div>
                    <span className="font-medium text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Distribution info */}
          {dist && (
            <div>
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Mic2 size={14} /> Distribution Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Release Status',  val: dist.releaseStatus === 'released' ? 'Released' : 'Unreleased' },
                  { label: 'Primary Artist',  val: dist.primaryArtist || '—' },
                  { label: 'Genre',           val: dist.primaryGenre  || '—' },
                  { label: 'Explicit Lyrics', val: dist.explicitLyrics ? 'Yes' : 'No' },
                  { label: 'Free Beat',       val: dist.hasFreeBeat   ? 'Yes' : 'No' },
                  { label: 'Release Date',    val: dist.releaseDate ? new Date(dist.releaseDate).toLocaleDateString('en-IN') : '—' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3">
                    <p className="text-xs text-zinc-600 mb-1">{label}</p>
                    <p className="text-sm font-medium text-white">{val}</p>
                  </div>
                ))}
              </div>
              {dist.additionalArtists?.length > 0 && (
                <div className="mt-3 bg-white/3 border border-white/8 rounded-xl px-4 py-3">
                  <p className="text-xs text-zinc-600 mb-1">Featured Artists</p>
                  <p className="text-sm text-white">{dist.additionalArtists.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {/* Investments (if any) */}
          {c?.investments?.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users size={14} /> Fan Investments
              </h2>
              <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/6 text-xs text-zinc-600 uppercase tracking-wider">
                      <th className="text-left px-4 py-3">Fan ID</th>
                      <th className="text-right px-4 py-3">Amount</th>
                      <th className="text-right px-4 py-3">Ownership</th>
                      <th className="text-right px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.investments.map((inv: any) => (
                      <tr key={inv.id} className="border-b border-white/4 last:border-0">
                        <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{inv.fanId.slice(0, 8)}…</td>
                        <td className="px-4 py-3 text-right text-white font-medium">{formatINR(inv.amount)}</td>
                        <td className="px-4 py-3 text-right text-purple-300">{inv.ownershipPct.toFixed(2)}%</td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">{inv.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ArtistLayout>
  )
}