'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Loader2,
  Download,
  Music,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from 'lucide-react'

export default function AdminCampaignsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [songs, setSongs]           = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [expanded, setExpanded]     = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'admin') {
      router.push('/')
      return
    }

    fetch('/api/admin/campaigns')
      .then(r => r.json())
      .then(j => { if (j.success) setSongs(j.data) })
      .finally(() => setLoading(false))
  }, [session, status])

  const filtered = songs.filter(s => {
    const matchSearch =
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.artist?.name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const downloadCSV = () => {
    const headers = [
      'Song Title', 'Artist', 'Language', 'Genre', 'Status',
      'Cover Art URL', 'Demo URL',
      'Release Status', 'Release Type', 'Primary Genre',
      'Primary Artist', 'Additional Artists', 'Explicit',
      'Release Date', 'Song File URL', 'Has Free Beat',
      'Spotify Link', 'Apple Music Link', 'Contributors',
      'Funding Ask', 'Fan Revenue Share', 'Amount Raised',
      'Campaign End Date', 'Campaign Status',
      'Min Investment', 'Campaign Story',
      'Budget Production', 'Budget Mix Master',
      'Budget Video Promo', 'Budget Marketing', 'Budget Other',
    ]

    const rows = songs.map(s => {
      const c = s.campaign
      const d = s.distribution
      return [
        s.title,
        s.artist?.name,
        s.language,
        s.genre,
        s.status,
        s.coverArtUrl ?? '',
        s.demoUrl ?? '',
        d?.releaseStatus ?? '',
        d?.releaseType ?? '',
        d?.primaryGenre ?? '',
        d?.primaryArtist ?? '',
        (d?.additionalArtists ?? []).join(' | '),
        d?.explicitLyrics ? 'Yes' : 'No',
        d?.releaseDate ? new Date(d.releaseDate).toLocaleDateString('en-IN') : '',
        d?.songFileUrl ?? '',
        d?.hasFreeBeat ? 'Yes' : 'No',
        d?.spotifyLink ?? '',
        d?.appleMusicLink ?? '',
        (d?.contributors ?? []).map((x: any) => `${x.name} (${x.role})`).join(' | '),
        c?.totalFundingAsk ?? '',
        c?.fanRevenueShare ?? '',
        c?.amountRaised ?? '',
        c?.campaignEndDate ? new Date(c.campaignEndDate).toLocaleDateString('en-IN') : '',
        c?.status ?? '',
        c?.minInvestment ?? '',
        c?.campaignStory ?? '',
        c?.budgetProduction ?? '',
        c?.budgetMixMaster ?? '',
        c?.budgetVideoPromo ?? '',
        c?.budgetMarketing ?? '',
        c?.budgetOther ?? '',
      ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`)
    })

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `campaigns-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    pending_approval: { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
    live:             { bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.25)' },
    draft:            { bg: 'rgba(255,255,255,0.05)', color: '#71717a', border: 'rgba(255,255,255,0.1)' },
    completed:        { bg: 'rgba(99,102,241,0.1)',  color: '#818cf8', border: 'rgba(99,102,241,0.25)' },
    rejected:         { bg: 'rgba(239,68,68,0.1)',   color: '#f87171', border: 'rgba(239,68,68,0.25)'  },
  }

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', background: '#06060a',
        }}>
          <Loader2 style={{ animation: 'spin 1s linear infinite', color: '#f87171', width: 36, height: 36 }} />
          <p style={{ marginTop: 16, color: '#52525b', fontSize: 14 }}>Loading campaigns...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <style>{`
        @keyframes fadeInDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeInUp   { from { opacity:0; transform:translateY(12px);  } to { opacity:1; transform:translateY(0); } }
        @keyframes spin       { to   { transform: rotate(360deg); } }
        @keyframes pulseDot   { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(1.4); } }
        .camp-search::placeholder { color: #3f3f46; }
        .camp-search:focus { outline: none; border-color: rgba(239,68,68,0.3); box-shadow: 0 0 0 3px rgba(239,68,68,0.06); }
        .expand-section { animation: fadeInUp 0.25s ease-out; }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#06060a', color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>

        {/* Header */}
        <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)',
          backdropFilter: 'blur(20px)',
          animation: 'fadeInDown 0.4s ease-out',
        }}>
          <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'linear-gradient(135deg,rgba(239,68,68,0.14),rgba(249,115,22,0.10))',
                border: '1px solid rgba(239,68,68,0.16)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>🎵</div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Campaign Submissions
                </h1>
                <p style={{ fontSize: 13, color: '#52525b', margin: '2px 0 0 0', fontWeight: 500 }}>
                  All songs, distribution data & campaign details
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px',
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 10,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171', animation: 'pulseDot 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f87171' }}>{songs.length} total</span>
              </div>

              <button
                onClick={downloadCSV}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg,#ef4444,#f97316)',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(239,68,68,0.25)',
                }}
              >
                <Download size={14} />
                Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding: '20px 32px 0', maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} />
            <input
              className="camp-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by song or artist..."
              style={{
                width: '100%', height: 42, borderRadius: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                color: '#fff', fontSize: 13, paddingLeft: 38, paddingRight: 14,
                boxSizing: 'border-box', transition: 'all 0.2s',
              }}
            />
          </div>

          {/* Status filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['all', 'pending_approval', 'live', 'draft', 'completed', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', border: '1px solid',
                  transition: 'all 0.2s',
                  ...(statusFilter === s
                    ? { background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' }
                    : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)', color: '#52525b' }
                  ),
                }}
              >
                {s === 'all' ? 'All' : s === 'pending_approval' ? 'Pending' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ padding: '20px 32px 48px', maxWidth: 1400, margin: '0 auto' }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 12 }}>
              <Music size={40} color="#27272a" />
              <p style={{ color: '#52525b', fontSize: 15, fontWeight: 600, margin: 0 }}>No campaigns found</p>
              <p style={{ color: '#3f3f46', fontSize: 13, margin: 0 }}>Try adjusting your search or filter</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((song, idx) => {
                const c   = song.campaign
                const d   = song.distribution
                const sc  = statusColors[song.status] ?? statusColors['draft']
                const isExp = expanded === song.id
                const isH   = hoveredRow === song.id

                return (
                  <div
                    key={song.id}
                    onMouseEnter={() => setHoveredRow(song.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderRadius: 20,
                      border: `1px solid ${isH || isExp ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.06)'}`,
                      background: isH || isExp
                        ? 'linear-gradient(135deg,rgba(239,68,68,0.04) 0%,rgba(255,255,255,0.02) 100%)'
                        : 'rgba(255,255,255,0.02)',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      animation: `fadeInUp 0.4s ease-out ${idx * 0.04}s both`,
                    }}
                  >
                    {/* Row header — always visible */}
                    <div
                      onClick={() => setExpanded(isExp ? null : song.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '56px 1fr 160px 120px 130px 130px 48px',
                        alignItems: 'center',
                        gap: 16,
                        padding: '16px 20px',
                        cursor: 'pointer',
                      }}
                    >
                      {/* Cover art */}
                      <div style={{
                        width: 48, height: 48, borderRadius: 12, overflow: 'hidden',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {song.coverArtUrl
                          ? <img src={song.coverArtUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <Music size={18} color="#3f3f46" />
                        }
                      </div>

                      {/* Title + artist */}
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {song.title}
                        </p>
                        <p style={{ fontSize: 12, color: '#71717a', margin: '3px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {song.artist?.name} · {song.language} {song.genre ? `· ${song.genre}` : ''}
                        </p>
                      </div>

                      {/* Funding */}
                      <div>
                        <p style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, margin: '0 0 3px 0' }}>Funding Ask</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#f472b6', margin: 0 }}>
                          {c ? `₹${c.totalFundingAsk?.toLocaleString('en-IN')}` : '—'}
                        </p>
                      </div>

                      {/* Fan share */}
                      <div>
                        <p style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, margin: '0 0 3px 0' }}>Fan Share</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#c084fc', margin: 0 }}>
                          {c ? `${c.fanRevenueShare}%` : '—'}
                        </p>
                      </div>

                      {/* Release */}
                      <div>
                        <p style={{ fontSize: 11, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, margin: '0 0 3px 0' }}>Release</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#a1a1aa', margin: 0 }}>
                          {d?.releaseStatus ?? '—'}
                        </p>
                      </div>

                      {/* Status badge */}
                      <div>
                        <span style={{
                          display: 'inline-block', padding: '4px 10px', borderRadius: 999,
                          fontSize: 11, fontWeight: 700,
                          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                        }}>
                          {song.status === 'pending_approval' ? 'Pending' : song.status}
                        </span>
                      </div>

                      {/* Expand icon */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b' }}>
                        {isExp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExp && (
                      <div className="expand-section" style={{
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        padding: '24px 20px',
                        display: 'flex', flexDirection: 'column', gap: 24,
                      }}>

                        {/* Cover + Demo */}
                        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                          {/* Cover art large */}
                          <div>
                            <p style={labelStyle}>Cover Art</p>
                            {song.coverArtUrl ? (
                              <a href={song.coverArtUrl} target="_blank" rel="noreferrer">
                                <img
                                  src={song.coverArtUrl}
                                  alt="cover"
                                  style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', display: 'block' }}
                                />
                              </a>
                            ) : (
                              <div style={{ width: 120, height: 120, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Music size={28} color="#27272a" />
                              </div>
                            )}
                          </div>

                          {/* Demo audio */}
                          <div style={{ flex: 1, minWidth: 240 }}>
                            <p style={labelStyle}>Demo Track</p>
                            {song.demoUrl ? (
                              <div>
                                <audio
                                  controls
                                  src={song.demoUrl}
                                  style={{ width: '100%', borderRadius: 10, marginBottom: 8 }}
                                />
                                <a
                                  href={song.demoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ fontSize: 11, color: '#f87171', textDecoration: 'none' }}
                                >
                                  Open in new tab ↗
                                </a>
                              </div>
                            ) : (
                              <p style={valueStyle}>No demo uploaded</p>
                            )}
                          </div>
                        </div>

                        {/* Song Details */}
                        <Section title="🎵 Song Details">
                          <Grid>
                            <Field label="Title"    value={song.title} />
                            <Field label="Language" value={song.language} />
                            <Field label="Genre"    value={song.genre} />
                            <Field label="Status"   value={song.status} />
                            <Field label="Created"  value={new Date(song.createdAt).toLocaleDateString('en-IN')} />
                          </Grid>
                        </Section>

                        {/* Distribution */}
                        {d && (
                          <Section title="📦 Distribution Details">
                            <Grid>
                              <Field label="Release Status"    value={d.releaseStatus} />
                              <Field label="Release Type"      value={d.releaseType} />
                              <Field label="Release Name"      value={d.releaseName} />
                              <Field label="Primary Genre"     value={d.primaryGenre} />
                              <Field label="Release Date"      value={d.releaseDate ? new Date(d.releaseDate).toLocaleDateString('en-IN') : ''} />
                              <Field label="Primary Artist"    value={d.primaryArtist} />
                              <Field label="Explicit Lyrics"   value={d.explicitLyrics ? 'Yes' : 'No'} />
                              <Field label="Has Free Beat"     value={d.hasFreeBeat ? 'Yes' : 'No'} />
                              <Field label="Migration Approved" value={d.migrationApproved ? 'Yes' : 'No'} />
                              <Field label="Spotify Link"      value={d.spotifyLink} link={d.spotifyLink} />
                              <Field label="Apple Music Link"  value={d.appleMusicLink} link={d.appleMusicLink} />
                            </Grid>

                            {d.additionalArtists?.length > 0 && (
                              <div style={{ marginTop: 12 }}>
                                <p style={labelStyle}>Featured Artists</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                  {d.additionalArtists.map((a: string, i: number) => (
                                    <span key={i} style={tagStyle}>{a}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {d.contributors?.length > 0 && (
                              <div style={{ marginTop: 12 }}>
                                <p style={labelStyle}>Contributors</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                  {d.contributors.map((c: any, i: number) => (
                                    <span key={i} style={tagStyle}>{c.name} <span style={{ color: '#52525b' }}>({c.role})</span></span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {d.songFileUrl && (
                              <div style={{ marginTop: 12 }}>
                                <p style={labelStyle}>Song File</p>
                                <a href={d.songFileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#f87171' }}>
                                  Download / Open ↗
                                </a>
                              </div>
                            )}
                          </Section>
                        )}

                        {/* Campaign */}
                        {c && (
                          <Section title="💰 Campaign Details">
                            <Grid>
                              <Field label="Total Funding Ask"  value={`₹${c.totalFundingAsk?.toLocaleString('en-IN')}`} />
                              <Field label="Amount Raised"      value={`₹${c.amountRaised?.toLocaleString('en-IN')}`} />
                              <Field label="Fan Revenue Share"  value={`${c.fanRevenueShare}%`} />
                              <Field label="Min Investment"     value={`₹${c.minInvestment}`} />
                              <Field label="Campaign End Date"  value={c.campaignEndDate ? new Date(c.campaignEndDate).toLocaleDateString('en-IN') : ''} />
                              <Field label="Status"            value={c.status} />
                              <Field label="Royalty Sharing"   value={c.royaltySharingOn ? 'On' : 'Off'} />
                            </Grid>

                            {/* Budget breakdown */}
                            <div style={{ marginTop: 16 }}>
                              <p style={labelStyle}>Budget Breakdown</p>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                                {[
                                  ['Production',  c.budgetProduction],
                                  ['Mix/Master',  c.budgetMixMaster],
                                  ['Video/Promo', c.budgetVideoPromo],
                                  ['Marketing',   c.budgetMarketing],
                                  ['Other',       c.budgetOther],
                                ].map(([label, val]) => (
                                  <div key={label as string} style={{
                                    padding: '10px 14px', borderRadius: 12,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                  }}>
                                    <p style={{ fontSize: 10, color: '#52525b', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px 0' }}>{label as string}</p>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: '#f472b6', margin: 0 }}>
                                      ₹{(val as number)?.toLocaleString('en-IN') ?? '0'}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {c.campaignStory && (
                              <div style={{ marginTop: 16 }}>
                                <p style={labelStyle}>Campaign Story</p>
                                <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.7, margin: 0, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                                  {c.campaignStory}
                                </p>
                              </div>
                            )}
                          </Section>
                        )}

                        {/* Download row button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              const d2 = song.distribution
                              const c2 = song.campaign
                              const rows = [[
                                song.title, song.artist?.name, song.language, song.genre, song.status,
                                song.coverArtUrl ?? '', song.demoUrl ?? '',
                                d2?.releaseStatus ?? '', d2?.releaseType ?? '', d2?.primaryGenre ?? '',
                                d2?.primaryArtist ?? '', (d2?.additionalArtists ?? []).join(' | '),
                                d2?.explicitLyrics ? 'Yes' : 'No',
                                d2?.releaseDate ? new Date(d2.releaseDate).toLocaleDateString('en-IN') : '',
                                d2?.songFileUrl ?? '', d2?.hasFreeBeat ? 'Yes' : 'No',
                                d2?.spotifyLink ?? '', d2?.appleMusicLink ?? '',
                                (d2?.contributors ?? []).map((x: any) => `${x.name} (${x.role})`).join(' | '),
                                c2?.totalFundingAsk ?? '', c2?.fanRevenueShare ?? '',
                                c2?.amountRaised ?? '', c2?.campaignStory ?? '',
                              ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`)].join(',')

                              const blob = new Blob([rows], { type: 'text/csv' })
                              const url2 = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url2
                              a.download = `${song.title}-data.csv`
                              a.click()
                              URL.revokeObjectURL(url2)
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                              background: 'rgba(239,68,68,0.08)', color: '#f87171',
                              fontSize: 12, fontWeight: 700,
                              border: '1px solid rgba(239,68,68,0.15)',
                            } as any}
                          >
                            <Download size={13} />
                            Download this row
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

// ── Small reusable components ─────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 10, color: '#52525b', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  margin: '0 0 6px 0',
}

const valueStyle: React.CSSProperties = {
  fontSize: 13, color: '#a1a1aa', margin: 0, fontWeight: 500,
}

const tagStyle: React.CSSProperties = {
  padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#d4d4d8',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.05)', padding: '18px 20px',
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#d4d4d8', margin: '0 0 16px 0' }}>{title}</p>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
      {children}
    </div>
  )
}

function Field({ label, value, link }: { label: string; value?: string | null; link?: string | null }) {
  return (
    <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <p style={labelStyle}>{label}</p>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#f87171', fontWeight: 500, textDecoration: 'none' }}>
          {value || 'Open ↗'}
        </a>
      ) : (
        <p style={valueStyle}>{value || '—'}</p>
      )}
    </div>
  )
}