'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import { Loader2, Music } from 'lucide-react'

export default function SongDetailPage() {
  const params = useParams()
  const router = useRouter()

  const [song, setSong] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const [projectTitle, setProjectTitle] = useState('')
  const [workType, setWorkType] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')

  useEffect(() => {
    fetch('/api/fan/discover')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          const found = j.data.find(
            (s: any) => s.id === params.id
          )
          setSong(found)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const sendRequest = async () => {
    setSending(true)
    const res = await fetch('/api/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        artistId: song.artist.id,
        projectTitle,
        workType,
        description,
        budget,
      }),
    })

    const json = await res.json()

    if (!json.success) {
      alert(json.error || 'Failed')
      setSending(false)
      return
    }

    router.push('/khapeetar/deals')
  }

  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    background: focused === fieldName ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === fieldName ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '14px',
    padding: '14px 16px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    boxShadow: focused === fieldName
      ? '0 0 0 3px rgba(16,185,129,0.08), 0 4px 16px rgba(16,185,129,0.08)'
      : 'none',
  })

  const labelStyle = (fieldName: string): React.CSSProperties => ({
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: focused === fieldName ? '#34d399' : '#52525b',
    marginBottom: '8px',
    transition: 'color 0.3s ease',
  })

  if (loading) {
    return (
      <KhapeetarLayout>
        <style jsx global>{`
          @keyframes floatOrb {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', background: '#06060a',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            borderRadius: '50%', animation: 'floatOrb 4s ease-in-out infinite',
          }} />
          <Loader2 style={{
            animation: 'spin 1s linear infinite', color: '#34d399',
            width: '36px', height: '36px', position: 'relative', zIndex: 1,
          }} />
          <p style={{ marginTop: '16px', color: '#52525b', fontSize: '14px', letterSpacing: '0.05em', position: 'relative', zIndex: 1 }}>
            Loading song...
          </p>
        </div>
      </KhapeetarLayout>
    )
  }

  if (!song) {
    return (
      <KhapeetarLayout>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', background: '#06060a',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '24px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
          }}>
            <Music size={32} color="#27272a" />
          </div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#52525b' }}>Song not found</p>
        </div>
      </KhapeetarLayout>
    )
  }

  const progress = Math.min(
    100,
    (song.campaign?.amountRaised / song.campaign?.totalFundingAsk) * 100 || 0
  )

  return (
    <KhapeetarLayout>
      <style jsx global>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.03); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes imageReveal {
          from { opacity: 0; transform: scale(1.04); }
          to { opacity: 1; transform: scale(1); }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px #0a0a0f inset !important;
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        textarea {
          font-family: inherit;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#06060a',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient background */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: '-80px', right: '-40px',
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
            borderRadius: '50%', animation: 'floatOrb 10s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '-80px',
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 70%)',
            borderRadius: '50%', animation: 'floatOrb2 13s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Back button */}
        <div style={{
          position: 'relative', zIndex: 1,
          padding: '24px 32px 0',
          maxWidth: '1200px', margin: '0 auto',
          animation: 'fadeInUp 0.4s ease-out',
        }}>
          <button
            onClick={() => router.back()}
            onMouseEnter={() => setHovered('back')}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              background: hovered === 'back' ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${hovered === 'back' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: '12px',
              color: hovered === 'back' ? '#fff' : '#71717a',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit',
              transform: hovered === 'back' ? 'translateX(-2px)' : 'translateX(0)',
            }}
          >
            ← Back
          </button>
        </div>

        {/* Main content */}
        <div style={{
          position: 'relative', zIndex: 1,
          padding: '28px 32px 48px',
          maxWidth: '1200px', margin: '0 auto',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '32px',
            alignItems: 'start',
          }}>

            {/* Left — Song info */}
            <div style={{ animation: 'fadeInLeft 0.6s ease-out' }}>
              {/* Cover art */}
              <div style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '1 / 1',
                background: '#0d0d12',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                {/* Glow behind cover */}
                <div style={{
                  position: 'absolute',
                  inset: '-20px',
                  background: 'radial-gradient(circle at center, rgba(16,185,129,0.08) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }} />

                {song.coverArtUrl ? (
                  <img
                    src={song.coverArtUrl}
                    alt={song.title}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      position: 'relative', zIndex: 1,
                      animation: 'imageReveal 0.6s ease-out',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0d0d12, #141420)',
                    position: 'relative', zIndex: 1,
                  }}>
                    <div style={{
                      width: '80px', height: '80px', borderRadius: '24px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Music size={36} color="#27272a" />
                    </div>
                  </div>
                )}

                {/* Bottom gradient overlay */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '40%',
                  background: 'linear-gradient(to top, rgba(6,6,10,0.7) 0%, transparent 100%)',
                  zIndex: 2,
                }} />
              </div>

              {/* Song metadata */}
              <div style={{ marginTop: '24px' }}>
                <h1 style={{
                  fontSize: '28px', fontWeight: 800,
                  margin: '0 0 6px 0', lineHeight: 1.2,
                  background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {song.title}
                </h1>
                <p style={{
                  fontSize: '15px', color: '#71717a', margin: '0 0 24px 0', fontWeight: 500,
                }}>
                  by <span style={{ color: '#a1a1aa' }}>{song.artist?.name}</span>
                </p>

                {/* Campaign info */}
                {song.campaign && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '18px', padding: '20px',
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                      marginBottom: '14px',
                    }}>
                      <div>
                        <p style={{
                          fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em',
                          color: '#52525b', fontWeight: 600, margin: '0 0 4px 0',
                        }}>💰 Raised</p>
                        <p style={{
                          fontSize: '20px', fontWeight: 800, color: '#34d399', margin: 0,
                          textShadow: '0 0 16px rgba(52,211,153,0.2)',
                        }}>
                          ₹{song.campaign.amountRaised?.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em',
                          color: '#52525b', fontWeight: 600, margin: '0 0 4px 0',
                        }}>🎯 Goal</p>
                        <p style={{
                          fontSize: '16px', fontWeight: 700, color: '#71717a', margin: 0,
                        }}>
                          ₹{song.campaign.totalFundingAsk?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      position: 'relative', height: '6px',
                      background: 'rgba(255,255,255,0.05)', borderRadius: '3px',
                      overflow: 'hidden', marginBottom: '10px',
                    }}>
                      <div style={{
                        height: '100%', width: `${progress}%`,
                        background: 'linear-gradient(90deg, #10b981, #14b8a6)',
                        backgroundSize: '200% 100%',
                        animation: 'gradient-shift 3s ease-in-out infinite',
                        borderRadius: '3px',
                        boxShadow: '0 0 10px rgba(16,185,129,0.3)',
                        transition: 'width 0.5s ease',
                      }} />
                      <div style={{
                        position: 'absolute', top: 0, left: 0,
                        width: `${progress}%`, height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s linear infinite',
                      }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 700,
                        color: progress >= 100 ? '#34d399' : '#52525b',
                      }}>
                        {progress >= 100 ? '🎉 Fully Funded' : `${Math.round(progress)}% funded`}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: '#34d399',
                          boxShadow: '0 0 6px rgba(52,211,153,0.5)',
                          animation: 'pulse-dot 2s ease-in-out infinite',
                        }} />
                        <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>Active campaign</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Request form */}
            <div style={{ animation: 'fadeInRight 0.6s ease-out' }}>
              <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '24px', padding: '32px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(16,185,129,0.02)',
              }}>
                {/* Top gradient accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: 'linear-gradient(90deg, transparent, #10b981, #14b8a6, transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 4s ease-in-out infinite',
                }} />

                {/* Inner top glow */}
                <div style={{
                  position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)',
                  width: '180px', height: '60px',
                  background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)',
                  filter: 'blur(16px)', pointerEvents: 'none',
                }} />

                {/* Form header */}
                <div style={{ marginBottom: '28px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(20,184,166,0.1))',
                      border: '1px solid rgba(16,185,129,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px',
                    }}>🚀</div>
                    <h2 style={{
                      fontSize: '20px', fontWeight: 800, margin: 0,
                      background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      Send Work Request
                    </h2>
                  </div>
                  <p style={{ fontSize: '13px', color: '#52525b', margin: 0, fontWeight: 500 }}>
                    to <span style={{ color: '#34d399', fontWeight: 600 }}>{song.artist?.name}</span> for &ldquo;{song.title}&rdquo;
                  </p>
                </div>

                {/* Form fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>
                  <div>
                    <label style={labelStyle('projectTitle')}>
                      Project Title <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      placeholder="e.g. Mix & Master the track"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      onFocus={() => setFocused('projectTitle')}
                      onBlur={() => setFocused(null)}
                      style={inputStyle('projectTitle')}
                    />
                  </div>

                  <div>
                    <label style={labelStyle('workType')}>
                      Work Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      placeholder="e.g. Mixing, Mastering, Production"
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value)}
                      onFocus={() => setFocused('workType')}
                      onBlur={() => setFocused(null)}
                      style={inputStyle('workType')}
                    />
                  </div>

                  <div>
                    <label style={labelStyle('description')}>
                      Description <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      placeholder="Describe what you'll bring to this project..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onFocus={() => setFocused('description')}
                      onBlur={() => setFocused(null)}
                      rows={5}
                      style={{
                        ...inputStyle('description'),
                        resize: 'none' as const,
                        minHeight: '130px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={labelStyle('budget')}>
                      Budget (₹) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                        color: '#52525b', fontSize: '15px', fontWeight: 600,
                        pointerEvents: 'none',
                      }}>₹</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        onFocus={() => setFocused('budget')}
                        onBlur={() => setFocused(null)}
                        style={{
                          ...inputStyle('budget'),
                          paddingLeft: '34px',
                          fontWeight: 700,
                          fontSize: '16px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={sendRequest}
                    disabled={sending}
                    onMouseEnter={() => setHovered('submit')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      position: 'relative',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '16px',
                      background: sending
                        ? 'rgba(255,255,255,0.04)'
                        : 'linear-gradient(135deg, #10b981, #14b8a6)',
                      border: 'none',
                      borderRadius: '14px',
                      color: sending ? '#52525b' : '#000',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: sending ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      fontFamily: 'inherit',
                      transform: hovered === 'submit' && !sending ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: hovered === 'submit' && !sending
                        ? '0 8px 40px rgba(16,185,129,0.35)'
                        : sending ? 'none' : '0 4px 20px rgba(16,185,129,0.2)',
                      opacity: sending ? 0.5 : 1,
                      overflow: 'hidden',
                      marginTop: '6px',
                    }}
                  >
                    {/* Shimmer */}
                    {hovered === 'submit' && !sending && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s linear infinite',
                        pointerEvents: 'none',
                      }} />
                    )}
                    {sending ? (
                      <>
                        <div style={{
                          width: '16px', height: '16px',
                          border: '2px solid rgba(255,255,255,0.2)',
                          borderTopColor: '#fff',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        <span style={{ position: 'relative' }}>Sending Request...</span>
                      </>
                    ) : (
                      <span style={{ position: 'relative' }}>🚀 Send Work Request</span>
                    )}
                  </button>

                  {/* Footer note */}
                  <p style={{
                    fontSize: '12px', color: '#27272a', textAlign: 'center',
                    margin: 0, fontWeight: 500,
                  }}>
                    💡 The artist will review and respond to your request
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </KhapeetarLayout>
  )
}