'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import { Loader2, Music } from 'lucide-react'

export default function KhapeetarFindSongsPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/fan/discover')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setSongs(j.data)
        }
      })
      .finally(() => setLoading(false))
  }, [])

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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#06060a',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb 4s ease-in-out infinite',
          }} />
          <Loader2 style={{
            animation: 'spin 1s linear infinite',
            color: '#34d399',
            width: '36px',
            height: '36px',
            position: 'relative',
            zIndex: 1,
          }} />
          <p style={{
            marginTop: '16px',
            color: '#52525b',
            fontSize: '14px',
            letterSpacing: '0.05em',
            position: 'relative',
            zIndex: 1,
          }}>Discovering songs...</p>
        </div>
      </KhapeetarLayout>
    )
  }

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
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(20px, 25px) scale(1.03); }
          80% { transform: translate(-15px, -10px) scale(0.97); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInStagger {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
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
        @keyframes progressFill {
          from { width: 0%; }
          to { width: var(--target-width); }
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
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
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
        <div style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}>
          <div style={{
            position: 'absolute',
            top: '-80px',
            right: '-40px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb 10s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb2 13s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            right: '30%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(52,211,153,0.03) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb3 16s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Header */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
          backdropFilter: 'blur(20px)',
          animation: 'fadeInDown 0.5s ease-out',
        }}>
          <div style={{
            padding: '28px 32px',
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.08))',
                  border: '1px solid rgba(16,185,129,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.08)',
                }}>
                  <Music size={20} color="#34d399" />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    margin: 0,
                    background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Find Songs
                  </h1>
                  <p style={{
                    fontSize: '13px',
                    color: '#52525b',
                    margin: '2px 0 0 0',
                    fontWeight: 500,
                  }}>
                    Discover artists and send collaboration requests
                  </p>
                </div>
              </div>

              {/* Count badge */}
              {songs.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.12)',
                  borderRadius: '12px',
                }}>
                  <div style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#34d399',
                    boxShadow: '0 0 8px rgba(52,211,153,0.5)',
                    animation: 'pulse-dot 2s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontSize: '12px',
                    color: '#34d399',
                    fontWeight: 700,
                  }}>
                    {songs.length} song{songs.length !== 1 ? 's' : ''} available
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: '28px 32px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {songs.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '100px 0',
              animation: 'fadeInUp 0.6s ease-out',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <Music size={32} color="#27272a" />
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#52525b',
                margin: '0 0 4px 0',
              }}>No songs available</p>
              <p style={{
                fontSize: '13px',
                color: '#3f3f46',
                margin: 0,
              }}>Songs from artists will appear here</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {songs.map((song, index) => {
                const progress = Math.min(
                  100,
                  (song.campaign.amountRaised / song.campaign.totalFundingAsk) * 100
                )
                const isHovered = hoveredCard === song.id

                return (
                  <Link
                    key={song.id}
                    href={`/khapeetar/find-songs/${song.id}`}
                    onMouseEnter={() => setHoveredCard(song.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      position: 'relative',
                      overflow: 'hidden',
                      background: isHovered
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
                      border: `1px solid ${isHovered ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '20px',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                      transform: isHovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                      boxShadow: isHovered
                        ? '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(16,185,129,0.08)'
                        : '0 2px 12px rgba(0,0,0,0.15)',
                      animation: `fadeInStagger 0.5s ease-out ${index * 0.07}s both`,
                    }}
                  >
                    {/* Top accent line */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #10b981, #14b8a6, transparent)',
                      backgroundSize: '200% 100%',
                      animation: isHovered ? 'gradient-shift 2s ease-in-out infinite' : 'none',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: 2,
                    }} />

                    {/* Cover Art */}
                    <div style={{
                      position: 'relative',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      background: '#0d0d12',
                    }}>
                      {song.coverArtUrl ? (
                        <img
                          src={song.coverArtUrl}
                          alt={song.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                            animation: 'imageReveal 0.5s ease-out',
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #0d0d12, #141420)',
                        }}>
                          <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Music size={28} color="#27272a" />
                          </div>
                        </div>
                      )}

                      {/* Image overlay gradient */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        background: 'linear-gradient(to top, rgba(6,6,10,0.8) 0%, transparent 100%)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                      }} />

                      {/* Hover overlay badge */}
                      {isHovered && (
                        <div style={{
                          position: 'absolute',
                          bottom: '14px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 18px',
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(20,184,166,0.9))',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#000',
                          whiteSpace: 'nowrap',
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                          animation: 'fadeInUp 0.2s ease-out',
                        }}>
                          ✦ View Details
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '20px' }}>
                      {/* Title & artist */}
                      <div style={{ marginBottom: '16px' }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#fff',
                          margin: '0 0 4px 0',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          transition: 'color 0.2s ease',
                        }}>
                          {song.title}
                        </h3>
                        <p style={{
                          fontSize: '13px',
                          color: '#71717a',
                          margin: 0,
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          by <span style={{ color: '#a1a1aa' }}>{song.artist?.name}</span>
                        </p>
                      </div>

                      {/* Funding section */}
                      <div>
                        {/* Raised / goal row */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          marginBottom: '10px',
                        }}>
                          <div>
                            <p style={{
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: '#52525b',
                              fontWeight: 600,
                              margin: '0 0 2px 0',
                            }}>Raised</p>
                            <p style={{
                              fontSize: '16px',
                              fontWeight: 800,
                              color: '#34d399',
                              margin: 0,
                              textShadow: isHovered ? '0 0 12px rgba(52,211,153,0.3)' : 'none',
                              transition: 'text-shadow 0.3s ease',
                            }}>
                              ₹{song.campaign.amountRaised.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: '#52525b',
                              fontWeight: 600,
                              margin: '0 0 2px 0',
                            }}>Goal</p>
                            <p style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#71717a',
                              margin: 0,
                            }}>
                              ₹{song.campaign.totalFundingAsk.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          height: '6px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          marginBottom: '12px',
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: progress >= 100
                              ? 'linear-gradient(90deg, #10b981, #34d399)'
                              : 'linear-gradient(90deg, #10b981, #14b8a6)',
                            backgroundSize: '200% 100%',
                            animation: isHovered ? 'gradient-shift 2s ease-in-out infinite' : 'none',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease',
                            boxShadow: isHovered ? '0 0 10px rgba(16,185,129,0.4)' : 'none',
                          }} />
                          {/* Shimmer on hover */}
                          {isHovered && (
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: `${progress}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 1.5s linear infinite',
                            }} />
                          )}
                        </div>

                        {/* Progress % and CTA */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: progress >= 100 ? '#34d399' : '#52525b',
                            letterSpacing: '0.02em',
                          }}>
                            {progress >= 100 ? '🎉 Fully Funded' : `${Math.round(progress)}% funded`}
                          </span>

                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: isHovered ? '#34d399' : '#52525b',
                            transition: 'color 0.3s ease',
                            letterSpacing: '0.01em',
                          }}>
                            Collaborate
                            <span style={{
                              display: 'inline-block',
                              transition: 'transform 0.3s ease',
                              transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                            }}>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </KhapeetarLayout>
  )
}