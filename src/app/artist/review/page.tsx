'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import { formatINR, formatStreams, calculateBreakeven } from '@/lib/utils'
import {
  Music, ArrowLeft, Send, Edit2,
  TrendingUp, Users, Mic2, Calendar,
  BarChart2, Loader2, AlertCircle
} from 'lucide-react'

const SESSION_KEY = 'fb_wizard_draft'
const REVENUE_PER_STREAM = 0.0005

export default function ReviewPage() {
  const router = useRouter()
  const [draft, setDraft]       = useState<any>(null)
  const [publishing, setPublishing] = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) { router.replace('/artist/raise-funds'); return }
    setDraft(JSON.parse(raw))
  }, [router])

  if (!draft) {
    return (
      <ArtistLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-purple-400" size={32} />
        </div>
      </ArtistLayout>
    )
  }

  const { songDetail, distribution, funding } = draft
  const fanShare        = funding.fanRevenueShare
  const artistRetains   = 100 - fanShare
  const platformFee     = Math.round(funding.totalFundingAsk * 0.05)
  const artistReceives  = funding.totalFundingAsk - platformFee
  const breakeven       = calculateBreakeven(funding.totalFundingAsk, fanShare)
  const fanPayPerStream = REVENUE_PER_STREAM * (fanShare / 100)
  const totalBudget     = Object.values(funding.budget as Record<string, number>).reduce((a, b) => a + b, 0)

  const publish = async () => {
    setPublishing(true)
    setError('')
    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songDetail, distribution, funding }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error?.message || 'Unknown error')
      sessionStorage.removeItem(SESSION_KEY)
      router.push('/artist/my-songs')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setPublishing(false)
    }
  }

  const Chip = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-4">
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  )

  const Divider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-white/6" />
      <span className="text-xs text-zinc-600 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-white/6" />
    </div>
  )

  return (
    <ArtistLayout>
      <div className="min-h-screen bg-black">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-white/6 px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} /> Back to wizard
          </button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300">Draft — Not published yet</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white/6 border border-white/10 text-zinc-300 rounded-xl text-sm hover:bg-white/10 transition-all"
            >
              <Edit2 size={14} /> Edit
            </button>
            <button
              onClick={publish}
              disabled={publishing}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              {publishing
                ? <><Loader2 size={14} className="animate-spin" /> Publishing...</>
                : <><Send size={14} /> Publish Song</>
              }
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Hero card */}
          <div className="relative rounded-3xl border border-white/8 overflow-hidden bg-gradient-to-br from-purple-900/20 via-black to-pink-900/10 p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex gap-6 items-start relative">
              {/* Cover art */}
              <div className="w-28 h-28 rounded-2xl border border-white/10 overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                {songDetail.coverArtUrl
                  ? <img src={songDetail.coverArtUrl} alt="cover" className="w-full h-full object-cover" />
                  : <Music size={32} className="text-zinc-600" />
                }
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                    {distribution.primaryGenre || 'Genre TBD'}
                  </span>
                  <span className="text-xs bg-white/5 text-zinc-400 border border-white/10 px-2.5 py-0.5 rounded-full">
                    {songDetail.language}
                  </span>
                  {distribution.explicitLyrics && (
                    <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full">E</span>
                  )}
                </div>
                <h1 className="text-3xl font-semibold tracking-tight mb-1">
                  {songDetail.title || 'Untitled Song'}
                </h1>
                <p className="text-zinc-500 text-sm mb-3">
                  by <span className="text-zinc-300">{distribution.primaryArtist || 'Unknown Artist'}</span>
                  {distribution.additionalArtists?.length > 0 &&
                    ` ft. ${distribution.additionalArtists.join(', ')}`}
                </p>
                {/* Audio preview */}
                {songDetail.demoFile && (
                  <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5 w-fit">
                    <span>♪</span> Demo uploaded: {songDetail.demoFile.name ?? 'demo.mp3'}
                  </div>
                )}
              </div>
            </div>
            {funding.campaignStory && (
              <p className="mt-5 text-sm text-zinc-400 leading-relaxed border-t border-white/6 pt-5">
                {funding.campaignStory}
              </p>
            )}
          </div>

          {/* Funding summary */}
          <div>
            <Divider label="Funding Details" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <Chip label="Funding Ask"   value={formatINR(funding.totalFundingAsk)} />
              <Chip label="You Receive"   value={formatINR(artistReceives)}          sub="after 5% platform fee" />
              <Chip label="Fan Share"     value={`${fanShare}%`}                    sub="of song revenue" />
              <Chip label="You Retain"    value={`${artistRetains}%`}               sub="of song revenue" />
            </div>
          </div>

          {/* Finance deep-dive */}
          <div>
            <Divider label="Economics" />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Breakeven */}
              <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 size={16} className="text-purple-400" />
                  <span className="text-sm font-medium">Breakeven Analysis</span>
                </div>
                <div className="space-y-3">
                  {[
                    ['Revenue / Stream',    '₹0.0005 (0.05 paise)'],
                    ['Fan Payout / Stream', `₹${fanPayPerStream.toFixed(7)}`],
                    ['Breakeven Streams',   formatStreams(breakeven)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <span className="text-zinc-500">{k}</span>
                      <span className="font-medium text-white">{v}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-600 mt-3">
                  Fans collectively need <strong className="text-zinc-400">{formatStreams(breakeven)} streams</strong> to earn back {formatINR(funding.totalFundingAsk)}
                </p>
              </div>

              {/* Royalty split */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-sm font-medium">Royalty Split (per 1M streams)</span>
                </div>
                {(() => {
                  const perMillion = 0.0005 * 1_000_000 // ₹500
                  const fanPool    = perMillion * (fanShare / 100)
                  const artistPool = perMillion * (artistRetains / 100)
                  return (
                    <div className="space-y-3">
                      {[
                        { label: 'Total Revenue',   val: formatINR(perMillion), color: 'text-white' },
                        { label: `Fan Pool (${fanShare}%)`,    val: formatINR(fanPool),    color: 'text-purple-300' },
                        { label: `Artist (${artistRetains}%)`, val: formatINR(artistPool), color: 'text-green-300' },
                      ].map(({ label, val, color }) => (
                        <div key={label} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                          <span className="text-zinc-500">{label}</span>
                          <span className={`font-semibold ${color}`}>{val}</span>
                        </div>
                      ))}
                    </div>
                  )
                })()}
                {/* Visual bar */}
                <div className="mt-4 h-2 rounded-full overflow-hidden bg-white/8 flex">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all" style={{ width: `${fanShare}%` }} />
                </div>
                <div className="flex justify-between text-xs text-zinc-600 mt-1">
                  <span>Fans {fanShare}%</span>
                  <span>You {artistRetains}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign terms */}
          <div>
            <Divider label="Campaign Terms" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              <Chip label="Min Investment"   value="₹100" />
              <Chip label="Campaign Ends"    value={new Date(songDetail.campaignEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
              <Chip label="Release Status"   value={distribution.releaseStatus === 'released' ? 'Already Released' : 'Unreleased'} />
              <Chip label="Royalty Sharing"  value={funding.royaltySharingOn ? 'Enabled' : 'Disabled'} />
              <Chip label="Free Beat"        value={distribution.hasFreeBeat ? 'Yes' : 'No'} />
              <Chip label="Explicit Lyrics"  value={distribution.explicitLyrics ? 'Yes' : 'No'} />
            </div>
          </div>

          {/* Budget */}
          {totalBudget > 0 && (
            <div>
              <Divider label="Budget Allocation" />
              <div className="mt-4 bg-white/3 border border-white/8 rounded-2xl p-5">
                <div className="space-y-3">
                  {[
                    ['🎹 Production',    funding.budget.production],
                    ['🎚️ Mix & Master', funding.budget.mixMaster],
                    ['🎬 Video / Promo', funding.budget.videoPromo],
                    ['📣 Marketing',     funding.budget.marketing],
                    ['📦 Other',         funding.budget.other],
                  ].filter(([, v]) => (v as number) > 0).map(([k, v]) => (
                    <div key={k as string} className="flex items-center gap-3">
                      <span className="text-sm text-zinc-400 flex-1">{k as string}</span>
                      <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500/60 to-pink-500/60 rounded-full"
                          style={{ width: `${Math.round(((v as number) / totalBudget) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-white w-24 text-right">
                        {formatINR(v as number)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t border-white/8 text-sm">
                    <span className="text-zinc-500">Total Budgeted</span>
                    <span className={`font-semibold ${totalBudget > funding.totalFundingAsk ? 'text-red-400' : 'text-green-400'}`}>
                      {formatINR(totalBudget)}
                      {totalBudget > funding.totalFundingAsk && ' ⚠️ exceeds ask'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom publish CTA */}
          <div className="border-t border-white/6 pt-6 flex flex-col items-center gap-4">
            <p className="text-xs text-zinc-600 text-center max-w-sm">
              By publishing you confirm you own 100% rights to this song and agree to the FannyBags Artist Agreement. This cannot be undone after admin approval.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-white/5 border border-white/10 text-zinc-400 rounded-xl text-sm hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={publish}
                disabled={publishing}
                className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
              >
                {publishing
                  ? <><Loader2 size={14} className="animate-spin" /> Publishing...</>
                  : <><Send size={14} /> Publish Song</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </ArtistLayout>
  )
}