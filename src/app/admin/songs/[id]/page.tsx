'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Loader2, ArrowLeft, TrendingUp, Send, CheckCircle, ExternalLink,
} from 'lucide-react'

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export default function AdminSongDetailPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()

  const [song, setSong]                 = useState<any>(null)
  const [loading, setLoading]           = useState(true)
  const [distributing, setDistributing] = useState(false)
  const [success, setSuccess]           = useState('')
  const [error, setError]               = useState('')

  const [form, setForm] = useState({
    revenueAmount: '',
    spotifyStreams: '',
    youtubeStreams: '',
    appleStreams:   '',
  })

  const fetchSong = () => {
    fetch(`/api/admin/songs/${id}`)
      .then(r => r.json())
      .then(j => { if (j.success) setSong(j.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchSong() }, [id])

  const distribute = async () => {
    setError(''); setSuccess('')
    const amount = Number(form.revenueAmount)
    if (!amount || amount <= 0) { setError('Enter a valid revenue amount'); return }

    setDistributing(true)
    try {
      const res  = await fetch(`/api/admin/songs/${id}/distribute`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revenueAmount: amount,
          spotifyStreams: Number(form.spotifyStreams || 0),
          youtubeStreams: Number(form.youtubeStreams || 0),
          appleStreams:   Number(form.appleStreams   || 0),
        }),
      })
      const json = await res.json()
      if (!json.success) { setError(json.error || 'Distribution failed'); return }
      setSuccess(json.message)
      setForm({ revenueAmount: '', spotifyStreams: '', youtubeStreams: '', appleStreams: '' })
      fetchSong()
    } catch {
      setError('Network error')
    } finally {
      setDistributing(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-red-400" size={28} />
        </div>
      </AdminLayout>
    )
  }

  if (!song) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-3">
          <p className="text-red-400">Song not found</p>
          <button onClick={() => router.back()} className="text-sm text-zinc-400">Back</button>
        </div>
      </AdminLayout>
    )
  }

  const campaign    = song.campaign
  const dist        = song.distribution
  const totalRaised = campaign?.amountRaised    ?? 0
  const fundingAsk  = campaign?.totalFundingAsk ?? 0
  const fanShare    = campaign?.fanRevenueShare  ?? 0
  const artistShare = 100 - fanShare

  return (
    <AdminLayout>
      <div className="min-h-screen bg-black text-white">

        {/* Header */}
        <div className="border-b border-white/5 px-8 py-5 flex items-center gap-4">
          <button onClick={() => router.back()} className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-semibold">{song.title}</h1>
            <p className="text-sm text-zinc-500">{song.artist?.name} · {song.language}</p>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6 max-w-4xl">

          {/* Song meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Status',     val: song.status },
              { label: 'Genre',      val: song.genre ?? '—' },
              { label: 'Artist',     val: song.artist?.name },
              { label: 'Stage Name', val: song.artist?.artistProfile?.stageName ?? '—' },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/3 border border-white/8 rounded-xl p-3">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="text-sm font-medium mt-0.5 capitalize">{val}</p>
              </div>
            ))}
          </div>

          {/* Distribution Details Panel */}
          {dist ? (
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Distribution Details</p>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5 space-y-5">

                {/* Core metadata */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Release Status', val: dist.releaseStatus || '—' },
                    { label: 'Release Name',   val: dist.releaseName   || '—' },
                    { label: 'Primary Genre',  val: dist.primaryGenre  || '—' },
                    { label: 'Release Type',   val: dist.releaseType   || '—' },
                    { label: 'Release Date',   val: dist.releaseDate
                        ? new Date(dist.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—' },
                    { label: 'Primary Artist', val: dist.primaryArtist || '—' },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-white/3 border border-white/6 rounded-xl p-3">
                      <p className="text-xs text-zinc-500">{label}</p>
                      <p className="text-sm font-medium mt-0.5 capitalize">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Boolean flags */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Explicit Lyrics',   val: dist.explicitLyrics    },
                    { label: 'Free Beat Used',     val: dist.hasFreeBeat       },
                    { label: 'Migration Approved', val: dist.migrationApproved },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-white/3 border border-white/6 rounded-xl p-3">
                      <p className="text-xs text-zinc-500">{label}</p>
                      <p className={`text-sm font-semibold mt-0.5 ${val ? 'text-emerald-400' : 'text-zinc-400'}`}>
                        {val ? 'Yes' : 'No'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Additional artists */}
                {dist.additionalArtists?.length > 0 && (
                  <div className="bg-white/3 border border-white/6 rounded-xl p-3">
                    <p className="text-xs text-zinc-500 mb-1">Additional Artists</p>
                    <p className="text-sm text-zinc-200">{dist.additionalArtists.join(', ')}</p>
                  </div>
                )}

                {/* Song file link */}
                {dist.songFileUrl && (
                  <div className="bg-white/3 border border-white/6 rounded-xl p-3">
                    <p className="text-xs text-zinc-500 mb-1">Song File</p>
                    <a href={dist.songFileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors">
                      Open Song File <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Contributors */}
                {Array.isArray(dist.contributors) && dist.contributors.length > 0 && (
                  <div className="bg-white/3 border border-white/6 rounded-xl p-3">
                    <p className="text-xs text-zinc-500 mb-2">Contributors</p>
                    <div className="space-y-2">
                      {dist.contributors.map((c: { name: string; role: string }, i: number) => (
                        <div key={i} className="flex items-center justify-between">
                          <p className="text-sm text-zinc-200">{c.name}</p>
                          <span className="text-xs bg-white/5 border border-white/10 text-zinc-400 px-2 py-0.5 rounded-full">
                            {c.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Streaming profile links */}
                {(dist.spotifyLink || dist.appleMusicLink) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dist.spotifyLink && (
                      <div className="bg-white/3 border border-white/6 rounded-xl p-3">
                        <p className="text-xs text-zinc-500 mb-1">Spotify Profile</p>
                        <a href={dist.spotifyLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors truncate max-w-full">
                          {dist.spotifyLink} <ExternalLink size={12} className="flex-shrink-0" />
                        </a>
                      </div>
                    )}
                    {dist.appleMusicLink && (
                      <div className="bg-white/3 border border-white/6 rounded-xl p-3">
                        <p className="text-xs text-zinc-500 mb-1">Apple Music Profile</p>
                        <a href={dist.appleMusicLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-pink-400 hover:text-pink-300 transition-colors truncate max-w-full">
                          {dist.appleMusicLink} <ExternalLink size={12} className="flex-shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Distribution Details</p>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <p className="text-sm text-zinc-500">No distribution data submitted for this song yet.</p>
              </div>
            </div>
          )}

          {/* Campaign data */}
          {campaign && (
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Campaign</p>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: 'Funding Ask',      val: formatINR(fundingAsk) },
                    { label: 'Raised',           val: formatINR(totalRaised) },
                    { label: 'Fan Revenue %',    val: `${fanShare}%` },
                    { label: 'Artist Revenue %', val: `${artistShare}%` },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <p className="text-xs text-zinc-500">{label}</p>
                      <p className="text-sm font-semibold mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-red-500 to-pink-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (totalRaised / fundingAsk) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  {fundingAsk > 0 ? Math.round((totalRaised / fundingAsk) * 100) : 0}% funded
                </p>
              </div>
            </div>
          )}

          {/* Investors */}
          {campaign?.investments?.length > 0 && (
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">
                Investors ({campaign.investments.length})
              </p>
              <div className="space-y-2">
                {campaign.investments.map((inv: any) => (
                  <div key={inv.id} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{inv.fan?.name}</p>
                      <p className="text-xs text-zinc-500">{inv.fan?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-300">{formatINR(inv.amount)}</p>
                      <p className="text-xs text-zinc-500">{inv.ownershipPct.toFixed(2)}% ownership</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          {song.metrics && (
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Metrics</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total Streams',   val: (song.metrics.totalStreams ?? 0).toLocaleString('en-IN') },
                  { label: 'Total Revenue',   val: formatINR(song.metrics.totalRevenue ?? 0) },
                  { label: 'Artist Earnings', val: formatINR(song.metrics.artistEarnings ?? 0) },
                  { label: 'Fan Payouts',     val: formatINR(song.metrics.fanPayoutsTotal ?? 0) },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white/3 border border-white/8 rounded-xl p-3">
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="text-sm font-bold mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaign Escrow Release */}
          {campaign && (
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Campaign Escrow Release</p>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Raised',        val: formatINR(totalRaised),                   color: '' },
                    { label: 'Escrow Held',          val: formatINR(campaign.escrowHeldAmount || 0), color: 'text-amber-300' },
                    { label: 'Admin Fee (5%)',        val: formatINR(totalRaised * 0.05),            color: 'text-red-300' },
                    { label: 'Artist Release (95%)', val: formatINR(totalRaised * 0.95),            color: 'text-emerald-300' },
                  ].map(({ label, val, color }) => (
                    <div key={label}>
                      <p className="text-xs text-zinc-500">{label}</p>
                      <p className={`text-sm font-semibold mt-0.5 ${color}`}>{val}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm">
                  {campaign.fundsReleased ? (
                    <span className="text-emerald-400">
                      Funds released on{' '}
                      {campaign.releasedAt
                        ? new Date(campaign.releasedAt).toLocaleDateString('en-IN')
                        : 'completed'}
                    </span>
                  ) : (
                    <span className="text-amber-300">Funds currently held in admin escrow</span>
                  )}
                </div>
                {!campaign.fundsReleased && totalRaised > 0 && (
                  <button
                    onClick={async () => {
                      const ok = confirm('Release campaign funds to artist?')
                      if (!ok) return
                      const res  = await fetch(`/api/admin/songs/${song.id}/release-funds`, { method: 'POST' })
                      const json = await res.json()
                      if (!json.success) { alert(json.error || 'Release failed'); return }
                      alert('Funds released successfully')
                      fetchSong()
                    }}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl font-medium"
                  >
                    Release Campaign Funds
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Royalty Distribution Panel */}
          {campaign && (
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Distribute Royalties</p>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5 space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-300">
                  Distributing will debit admin wallet and credit artist ({artistShare}%) + {campaign.investments.length} fan investor(s) ({fanShare}%) proportionally.
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider">Total Revenue (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">₹</span>
                      <input
                        type="number"
                        value={form.revenueAmount}
                        onChange={e => setForm(f => ({ ...f, revenueAmount: e.target.value }))}
                        placeholder="100000"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3 py-3 text-sm outline-none focus:border-red-500/60 transition-all placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                  {[
                    { key: 'spotifyStreams', label: 'Spotify Streams' },
                    { key: 'youtubeStreams', label: 'YouTube Streams' },
                    { key: 'appleStreams',   label: 'Apple Music Streams' },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs text-zinc-500 uppercase tracking-wider">{label}</label>
                      <input
                        type="number"
                        value={(form as any)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm outline-none focus:border-red-500/60 transition-all placeholder:text-zinc-600"
                      />
                    </div>
                  ))}
                </div>

                {form.revenueAmount && Number(form.revenueAmount) > 0 && (
                  <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3 space-y-1 text-sm">
                    <p className="text-xs text-zinc-500 mb-2">Distribution preview</p>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Artist ({artistShare}%)</span>
                      <span className="text-white font-medium">
                        {formatINR(Math.round(Number(form.revenueAmount) * (artistShare / 100)))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">All fans ({fanShare}%)</span>
                      <span className="text-emerald-300 font-medium">
                        {formatINR(Math.round(Number(form.revenueAmount) * (fanShare / 100)))}
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}
                {success && (
                  <div className="flex items-start gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                    <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                    {success}
                  </div>
                )}

                <button
                  onClick={distribute}
                  disabled={distributing || !form.revenueAmount}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {distributing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Distribute Royalties
                </button>
              </div>
            </div>
          )}

          {/* Distribution History */}
          {song.royaltyDistributions?.length > 0 && (
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Distribution History</p>
              <div className="space-y-2">
                {song.royaltyDistributions.map((d: any) => (
                  <div key={d.id} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{formatINR(d.revenueAmount)}</p>
                      <p className="text-xs text-zinc-500">
                        {d.payouts.length} payouts ·{' '}
                        {new Date(d.distributedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </p>
                    </div>
                    <TrendingUp size={14} className="text-zinc-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  )
}