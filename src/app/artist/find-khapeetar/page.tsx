'use client'

import { useEffect, useState } from 'react'
import ArtistLayout from '@/components/artist/ArtistLayout'
import { Search, Loader2, Users, MapPin, Star, Music, Image as ImageIcon, Video } from 'lucide-react'
import Link from 'next/link'

const ROLES = ['All', 'Music Producer', 'Mix Engineer', 'Mastering Engineer', 'Beatmaker', 'Songwriter', 'Videographer', 'Marketer', 'A&R']
const WORK_MODES = ['All', 'Remote', 'Onsite', 'Hybrid']
const AVAIL = ['All', 'Available Now', 'Part-Time', 'Busy']

const AVAIL_COLOR: Record<string, { bg: string; color: string; border: string; dot: string }> = {
  'Available Now': { bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.25)', dot: '#34d399' },
  'Part-Time':     { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24', border: 'rgba(245,158,11,0.25)', dot: '#fbbf24' },
  'Busy':          { bg: 'rgba(239,68,68,0.1)',   color: '#f87171', border: 'rgba(239,68,68,0.25)',  dot: '#f87171' },
}

export default function FindKhapeetar() {
  const [profiles, setProfiles]     = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [role, setRole]             = useState('All')
  const [workMode, setWorkMode]     = useState('All')
  const [avail, setAvail]           = useState('All')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredImg, setHoveredImg]   = useState<string | null>(null)

  const fetchProfiles = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)           params.set('search',       search)
    if (role !== 'All')   params.set('role',          role)
    if (workMode !== 'All') params.set('workMode',    workMode)
    if (avail !== 'All')  params.set('availability',  avail)

    fetch(`/api/khapeetar?${params}`)
      .then(r => r.json())
      .then(j => { if (j.success) setProfiles(j.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProfiles() }, [role, workMode, avail])

  return (
    <ArtistLayout>
      <style jsx global>{`
        @keyframes fkFloatOrb  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
        @keyframes fkFloatOrb2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-15px) scale(1.03)} }
        @keyframes fkFloatOrb3 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(20px,25px) scale(1.03)} 80%{transform:translate(-15px,-10px) scale(0.97)} }
        @keyframes fkFadeInDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fkFadeInUp   { from{opacity:0;transform:translateY(14px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes fkGradShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes fkPulseDot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }
        @keyframes fkSpin       { to{transform:rotate(360deg)} }
        @keyframes fkImgReveal  { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }

        .fk-search::placeholder { color:#3f3f46; }
        .fk-search:focus { outline:none; border-color:rgba(168,85,247,0.4); box-shadow:0 0 0 3px rgba(168,85,247,0.08); }
        .fk-pill { padding:7px 14px; border-radius:999px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.03); color:#52525b; transition:all .2s ease; font-family:inherit; }
        .fk-pill:hover { border-color:rgba(255,255,255,0.14); color:#a1a1aa; }
        .fk-pill.active { background:rgba(168,85,247,0.12); border-color:rgba(168,85,247,0.35); color:#d8b4fe; }
        .fk-scroll::-webkit-scrollbar { width:4px; }
        .fk-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.06); border-radius:2px; }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#06060a', color: '#fff',
        position: 'relative', overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>

        {/* Ambient bg */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-40px', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(168,85,247,0.06) 0%,transparent 70%)', borderRadius: '50%', animation: 'fkFloatOrb 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '40%', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(236,72,153,0.04) 0%,transparent 70%)', borderRadius: '50%', animation: 'fkFloatOrb2 13s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '30%', width: '350px', height: '350px', background: 'radial-gradient(circle,rgba(139,92,246,0.03) 0%,transparent 70%)', borderRadius: '50%', animation: 'fkFloatOrb3 16s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
        </div>

        {/* Header */}
        <div style={{
          position: 'relative', zIndex: 1,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)',
          backdropFilter: 'blur(20px)',
          animation: 'fkFadeInDown 0.4s ease-out',
        }}>
          <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'linear-gradient(135deg,rgba(168,85,247,0.14),rgba(236,72,153,0.08))',
                border: '1px solid rgba(168,85,247,0.16)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(168,85,247,0.08)',
                fontSize: 20,
              }}>⚡</div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Find Khapeetar
                </h1>
                <p style={{ fontSize: 13, color: '#52525b', margin: '2px 0 0 0', fontWeight: 500 }}>
                  Hire music professionals for your project
                </p>
              </div>
            </div>

            {!loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)', borderRadius: 12 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#c084fc', boxShadow: '0 0 8px rgba(192,132,252,0.5)', animation: 'fkPulseDot 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#c084fc' }}>{profiles.length} professional{profiles.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '24px 32px 48px', maxWidth: 1400, margin: '0 auto' }}>

          {/* Search */}
          <form
            onSubmit={e => { e.preventDefault(); fetchProfiles() }}
            style={{ position: 'relative', marginBottom: 20 }}
          >
            <Search size={15} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none' }} />
            <input
              className="fk-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, skill, role..."
              style={{
                width: '100%', height: 52, paddingLeft: 44, paddingRight: 120,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, color: '#fff', fontSize: 14, boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                height: 36, padding: '0 18px', border: 'none', borderRadius: 10,
                background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Search
            </button>
          </form>

          {/* Filters */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20, padding: '20px 24px', marginBottom: 24,
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            {[
              { label: 'Role', options: ROLES, value: role, set: setRole },
              { label: 'Work Mode', options: WORK_MODES, value: workMode, set: setWorkMode },
              { label: 'Availability', options: AVAIL, value: avail, set: setAvail },
            ].map(f => (
              <div key={f.label}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3f3f46', margin: '0 0 10px 0' }}>{f.label}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {f.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => f.set(opt)}
                      className={`fk-pill${f.value === opt ? ' active' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 14 }}>
              <Loader2 style={{ animation: 'fkSpin 1s linear infinite', color: '#a855f7', width: 32, height: 32 }} />
              <p style={{ color: '#52525b', fontSize: 14, margin: 0 }}>Finding professionals...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && profiles.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 12 }}>
              <Users size={40} color="#27272a" />
              <p style={{ color: '#52525b', fontSize: 15, fontWeight: 600, margin: 0 }}>No Khapeetars found</p>
              <p style={{ color: '#3f3f46', fontSize: 13, margin: 0 }}>Try adjusting your filters</p>
            </div>
          )}

          {/* Grid */}
          {!loading && profiles.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 18,
            }}>
              {profiles.map((p, idx) => {
                const isH     = hoveredCard === p.id
                const avColor = AVAIL_COLOR[p.availability] ?? AVAIL_COLOR['Available Now']

                // Portfolio items — images and audio/video
                const portfolioImages = (p.portfolioLinks ?? []).filter((url: string) =>
                  !url.includes('/video/') && !url.match(/\.(mp4|webm|mov)$/i)
                )
                const portfolioAudio = (p.portfolioLinks ?? []).filter((url: string) =>
                  url.includes('/video/') || url.match(/\.(mp4|webm|mov|mp3|wav|flac)$/i)
                )

                return (
                  <Link
                    key={p.id}
                    href={`/artist/find-khapeetar/${p.id}`}
                    onMouseEnter={() => setHoveredCard(p.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display: 'block', textDecoration: 'none', color: 'inherit',
                      position: 'relative', overflow: 'hidden',
                      background: isH
                        ? 'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)'
                        : 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
                      border: `1px solid ${isH ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 20,
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                      transform: isH ? 'translateY(-5px) scale(1.01)' : 'translateY(0) scale(1)',
                      boxShadow: isH
                        ? '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.08)'
                        : '0 2px 12px rgba(0,0,0,0.15)',
                      animation: `fkFadeInUp 0.45s ease-out ${idx * 0.06}s both`,
                    }}
                  >
                    {/* Top accent on hover */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                      background: 'linear-gradient(90deg,transparent,#a855f7,#ec4899,transparent)',
                      backgroundSize: '200% 100%',
                      animation: isH ? 'fkGradShift 2s ease-in-out infinite' : 'none',
                      opacity: isH ? 1 : 0, transition: 'opacity 0.3s ease', zIndex: 2,
                    }} />

                    {/* Portfolio image strip — shows first 3 images */}
                    {portfolioImages.length > 0 && (
                      <div style={{
                        position: 'relative', height: 160, overflow: 'hidden',
                        background: '#0d0d12', borderRadius: '19px 19px 0 0',
                      }}>
                        <div style={{ display: 'flex', height: '100%' }}>
                          {portfolioImages.slice(0, 3).map((url: string, i: number) => (
                            <div
                              key={url}
                              onMouseEnter={() => setHoveredImg(url)}
                              onMouseLeave={() => setHoveredImg(null)}
                              style={{
                                flex: i === 0 ? 2 : 1,
                                position: 'relative', overflow: 'hidden',
                                borderRight: i < Math.min(portfolioImages.length, 3) - 1
                                  ? '1px solid rgba(0,0,0,0.3)' : 'none',
                              }}
                            >
                              <img
                                src={url}
                                alt=""
                                style={{
                                  width: '100%', height: '100%', objectFit: 'cover',
                                  display: 'block',
                                  transition: 'transform 0.4s ease',
                                  transform: isH ? 'scale(1.06)' : 'scale(1)',
                                  animation: 'fkImgReveal 0.5s ease-out',
                                }}
                              />
                              {/* Dark overlay */}
                              <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to top,rgba(6,6,10,0.5) 0%,transparent 60%)',
                              }} />
                            </div>
                          ))}
                        </div>

                        {/* More images badge */}
                        {portfolioImages.length > 3 && (
                          <div style={{
                            position: 'absolute', bottom: 8, right: 10,
                            padding: '3px 8px', borderRadius: 8,
                            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                            fontSize: 11, fontWeight: 700, color: '#a1a1aa',
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}>
                            <ImageIcon size={10} />
                            +{portfolioImages.length - 3} more
                          </div>
                        )}

                        {/* Audio badge */}
                        {portfolioAudio.length > 0 && (
                          <div style={{
                            position: 'absolute', bottom: 8, left: 10,
                            padding: '3px 8px', borderRadius: 8,
                            background: 'rgba(168,85,247,0.6)', backdropFilter: 'blur(8px)',
                            fontSize: 11, fontWeight: 700, color: '#fff',
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}>
                            <Music size={10} />
                            {portfolioAudio.length} audio
                          </div>
                        )}
                      </div>
                    )}

                    {/* No portfolio — placeholder */}
                    {portfolioImages.length === 0 && (
                      <div style={{
                        height: 100, borderRadius: '19px 19px 0 0', overflow: 'hidden',
                        background: 'linear-gradient(135deg,rgba(168,85,247,0.06),rgba(236,72,153,0.04))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                      }}>
                        <ImageIcon size={20} color="#27272a" />
                        {portfolioAudio.length > 0 && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '4px 10px', borderRadius: 8,
                            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
                            fontSize: 12, fontWeight: 600, color: '#c084fc',
                          }}>
                            <Music size={12} />
                            {portfolioAudio.length} audio track{portfolioAudio.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card body */}
                    <div style={{ padding: '18px 20px 20px' }}>

                      {/* Avatar + name row */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                          background: 'linear-gradient(135deg,rgba(168,85,247,0.4),rgba(236,72,153,0.3))',
                          border: '1px solid rgba(168,85,247,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, fontWeight: 800, color: '#fff',
                        }}>
                          {p.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                            <h3 style={{
                              fontSize: 15, fontWeight: 700, color: '#fff', margin: 0,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>{p.name}</h3>
                            {p.isVerified && (
                              <Star size={12} color="#fbbf24" fill="#fbbf24" />
                            )}
                          </div>
                          <p style={{
                            fontSize: 12, color: '#c084fc', margin: 0, fontWeight: 600,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>{p.primaryRole}</p>
                        </div>

                        {/* Availability badge */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
                          padding: '4px 10px', borderRadius: 999,
                          background: avColor.bg, border: `1px solid ${avColor.border}`,
                          fontSize: 10, fontWeight: 700, color: avColor.color,
                        }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: avColor.dot, animation: 'fkPulseDot 2s ease-in-out infinite' }} />
                          {p.availability === 'Available Now' ? 'Open' : p.availability}
                        </div>
                      </div>

                      {/* Location + work mode */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                        {(p.city || p.state) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#71717a' }}>
                            <MapPin size={11} color="#52525b" />
                            {[p.city, p.state].filter(Boolean).join(', ')}
                          </div>
                        )}
                        {p.workMode && (
                          <div style={{
                            padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                            color: '#52525b',
                          }}>
                            {p.workMode === 'Remote' ? '🏠' : p.workMode === 'Onsite' ? '🏢' : '🔄'} {p.workMode}
                          </div>
                        )}
                      </div>

                      {/* Bio snippet */}
                      {p.bio && (
                        <p style={{
                          fontSize: 12, color: '#71717a', margin: '0 0 12px 0', lineHeight: 1.6,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {p.bio}
                        </p>
                      )}

                      {/* Skills */}
                      {p.skills?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                          {p.skills.slice(0, 4).map((s: string) => (
                            <span key={s} style={{
                              padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                              color: '#71717a',
                            }}>{s}</span>
                          ))}
                          {p.skills.length > 4 && (
                            <span style={{
                              padding: '3px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                              background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)',
                              color: '#c084fc',
                            }}>+{p.skills.length - 4}</span>
                          )}
                        </div>
                      )}

                      {/* Audio preview — first audio track inline */}
                      {portfolioAudio.length > 0 && (
                        <div style={{ marginBottom: 14 }} onClick={e => e.preventDefault()}>
                          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', margin: '0 0 6px 0' }}>
                            🎵 Audio Sample
                          </p>
                          <audio
                            controls
                            src={portfolioAudio[0]}
                            style={{ width: '100%', borderRadius: 8 }}
                          />
                        </div>
                      )}

                      {/* Footer — budget + stats */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)',
                      }}>
                        <div>
                          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46', fontWeight: 700, margin: '0 0 2px 0' }}>Starting at</p>
                          <p style={{
                            fontSize: 16, fontWeight: 800, color: '#c084fc', margin: 0,
                            textShadow: isH ? '0 0 12px rgba(192,132,252,0.3)' : 'none',
                            transition: 'text-shadow 0.3s ease',
                          }}>
                            {p.startingBudget > 0 ? `₹${Number(p.startingBudget).toLocaleString('en-IN')}` : 'Negotiable'}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: 14, textAlign: 'right' }}>
                          {p.experienceYears > 0 && (
                            <div>
                              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46', fontWeight: 700, margin: '0 0 2px 0' }}>Exp</p>
                              <p style={{ fontSize: 14, fontWeight: 700, color: '#a1a1aa', margin: 0 }}>{p.experienceYears}y</p>
                            </div>
                          )}
                          {p.projectsCompleted > 0 && (
                            <div>
                              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3f3f46', fontWeight: 700, margin: '0 0 2px 0' }}>Projects</p>
                              <p style={{ fontSize: 14, fontWeight: 700, color: '#a1a1aa', margin: 0 }}>{p.projectsCompleted}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hover CTA */}
                      {isH && (
                        <div style={{
                          marginTop: 12,
                          padding: '10px',
                          borderRadius: 12,
                          background: 'linear-gradient(135deg,rgba(168,85,247,0.12),rgba(236,72,153,0.08))',
                          border: '1px solid rgba(168,85,247,0.2)',
                          textAlign: 'center',
                          fontSize: 13, fontWeight: 700, color: '#c084fc',
                          animation: 'fkFadeInUp 0.2s ease-out',
                        }}>
                          ✦ View Profile & Send Request
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ArtistLayout>
  )
}