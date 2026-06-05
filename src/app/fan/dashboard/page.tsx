'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import FanLayout from '@/components/fan/FanLayout'
import {
  Loader2,
  TrendingUp,
  Wallet,
  Radio,
  Percent,
  Music2,
} from 'lucide-react'

export default function FanDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/fan/login')
      return
    }

    fetch('/api/fan/investments')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setInvestments(j.data)
        }
      })
      .finally(() => setLoading(false))
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <FanLayout>
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#06060a',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              background:
                'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'floatOrb 4s ease-in-out infinite',
            }}
          />
          <Loader2
            style={{
              animation: 'spin 1s linear infinite',
              color: '#f472b6',
              width: '36px',
              height: '36px',
              position: 'relative',
              zIndex: 1,
            }}
          />
          <p
            style={{
              marginTop: '16px',
              color: '#52525b',
              fontSize: '14px',
              letterSpacing: '0.05em',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Loading dashboard...
          </p>
        </div>
      </FanLayout>
    )
  }

  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.amount,
    0
  )

  const totalPayout = investments.reduce(
    (sum, inv) => sum + inv.analytics.estimatedPayout,
    0
  )

  const totalStreams = investments.reduce(
    (sum, inv) => sum + inv.analytics.totalStreams,
    0
  )

  const avgROI =
    investments.length > 0
      ? investments.reduce((sum, inv) => sum + inv.analytics.roi, 0) /
        investments.length
      : 0

  const stats = [
    {
      key: 'invested',
      label: 'Total Invested',
      value: `₹${totalInvested.toLocaleString('en-IN')}`,
      icon: Wallet,
      color: '#f472b6',
      bg: 'rgba(236,72,153,0.08)',
      border: 'rgba(236,72,153,0.14)',
      glow: 'rgba(236,72,153,0.08)',
    },
    {
      key: 'returns',
      label: 'Estimated Returns',
      value: `₹${totalPayout.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: '#34d399',
      bg: 'rgba(16,185,129,0.08)',
      border: 'rgba(16,185,129,0.14)',
      glow: 'rgba(16,185,129,0.08)',
    },
    {
      key: 'streams',
      label: 'Portfolio Streams',
      value: totalStreams.toLocaleString(),
      icon: Radio,
      color: '#60a5fa',
      bg: 'rgba(59,130,246,0.08)',
      border: 'rgba(59,130,246,0.14)',
      glow: 'rgba(59,130,246,0.08)',
    },
    {
      key: 'roi',
      label: 'Avg ROI',
      value: `${avgROI.toFixed(1)}%`,
      icon: Percent,
      color: '#c084fc',
      bg: 'rgba(168,85,247,0.08)',
      border: 'rgba(168,85,247,0.14)',
      glow: 'rgba(168,85,247,0.08)',
    },
  ]

  return (
    <FanLayout>
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
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.35); }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#06060a',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Ambient background */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-40px',
              width: '500px',
              height: '500px',
              background:
                'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'floatOrb 10s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '45%',
              left: '-100px',
              width: '420px',
              height: '420px',
              background:
                'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'floatOrb2 13s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              right: '30%',
              width: '320px',
              height: '320px',
              background:
                'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'floatOrb3 16s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
            backdropFilter: 'blur(20px)',
            animation: 'fadeInDown 0.5s ease-out',
          }}
        >
          <div
            style={{
              padding: '28px 32px',
              maxWidth: '1250px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg, rgba(236,72,153,0.14), rgba(168,85,247,0.10))',
                  border: '1px solid rgba(236,72,153,0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(236,72,153,0.08)',
                }}
              >
                <TrendingUp size={20} color="#f472b6" />
              </div>

              <div>
                <h1
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    margin: 0,
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Fan Dashboard
                </h1>
                <p
                  style={{
                    color: '#52525b',
                    fontSize: '13px',
                    margin: '3px 0 0 0',
                    fontWeight: 500,
                  }}
                >
                  Your investment performance
                  {session?.user?.name ? (
                    <>
                      {' '}·{' '}
                      <span style={{ color: '#f472b6' }}>
                        {session.user.name}
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(236,72,153,0.06)',
                border: '1px solid rgba(236,72,153,0.12)',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#f472b6',
                  boxShadow: '0 0 8px rgba(244,114,182,0.5)',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#f472b6',
                }}
              >
                {investments.length} active holding{investments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '28px 32px 48px',
            maxWidth: '1250px',
            margin: '0 auto',
          }}
        >
          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              const isHovered = hoveredStat === stat.key

              return (
                <div
                  key={stat.key}
                  onMouseEnter={() => setHoveredStat(stat.key)}
                  onMouseLeave={() => setHoveredStat(null)}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255,255,255,0.02) 100%)`,
                    border: `1px solid ${isHovered ? stat.border : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '20px',
                    padding: '24px',
                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isHovered
                      ? `0 14px 40px ${stat.glow}, 0 0 50px ${stat.glow}`
                      : '0 2px 10px rgba(0,0,0,0.12)',
                    animation: `fadeInStagger 0.5s ease-out ${index * 0.08}s both`,
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-24px',
                      right: '-24px',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`,
                      opacity: isHovered ? 1 : 0.5,
                      transition: 'opacity 0.3s ease',
                    }}
                  />

                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s linear infinite',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '14px',
                      background: stat.bg,
                      border: `1px solid ${stat.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      position: 'relative',
                      transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <Icon size={19} color={stat.color} />
                  </div>

                  <p
                    style={{
                      fontSize: '12px',
                      color: '#52525b',
                      margin: '0 0 8px 0',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      position: 'relative',
                    }}
                  >
                    {stat.label}
                  </p>

                  <p
                    style={{
                      fontSize: '28px',
                      fontWeight: 800,
                      color: stat.color,
                      margin: 0,
                      lineHeight: 1.1,
                      position: 'relative',
                      textShadow: isHovered ? `0 0 18px ${stat.glow}` : 'none',
                      transition: 'text-shadow 0.3s ease',
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Investments section */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '24px',
              padding: '28px',
              backdropFilter: 'blur(18px)',
              animation: 'fadeInUp 0.6s ease-out 0.25s both',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background:
                  'linear-gradient(90deg, transparent, #ec4899, #a855f7, transparent)',
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(236,72,153,0.08)',
                    border: '1px solid rgba(236,72,153,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp size={18} color="#f472b6" />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#fff',
                      margin: 0,
                    }}
                  >
                    Active Investments
                  </h2>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#52525b',
                      margin: '3px 0 0 0',
                      fontWeight: 500,
                    }}
                  >
                    Track your songs, ownership, ROI and projected payouts
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#71717a',
                  fontWeight: 600,
                }}
              >
                {investments.length} position{investments.length !== 1 ? 's' : ''}
              </div>
            </div>

            {investments.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '72px 0 56px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '82px',
                    height: '82px',
                    borderRadius: '24px',
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                  }}
                >
                  <Music2 size={34} color="#27272a" />
                </div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#52525b',
                    margin: '0 0 6px 0',
                  }}
                >
                  No investments yet
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#3f3f46',
                    margin: 0,
                  }}
                >
                  Once you fund a song, your holdings will appear here
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {investments.map((inv, index) => {
                  const roiPositive = inv.analytics.roi >= 0
                  const rowKey = inv.id

                  return (
                    <div
                      key={inv.id}
                      onMouseEnter={() => setHoveredCard(rowKey)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap',
                        padding: '18px',
                        borderRadius: '18px',
                        background:
                          hoveredCard === rowKey
                            ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        border: `1px solid ${
                          hoveredCard === rowKey
                            ? 'rgba(236,72,153,0.16)'
                            : 'rgba(255,255,255,0.05)'
                        }`,
                        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                        transform:
                          hoveredCard === rowKey
                            ? 'translateY(-2px)'
                            : 'translateY(0)',
                        boxShadow:
                          hoveredCard === rowKey
                            ? '0 10px 30px rgba(236,72,153,0.06)'
                            : '0 2px 8px rgba(0,0,0,0.08)',
                        animation: `fadeInStagger 0.45s ease-out ${0.35 + index * 0.06}s both`,
                      }}
                    >
                      {/* Left */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '16px',
                            background:
                              inv.campaign.song.coverArtUrl
                                ? `url(${inv.campaign.song.coverArtUrl}) center/cover no-repeat`
                                : 'linear-gradient(135deg, rgba(236,72,153,0.14), rgba(168,85,247,0.08))',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden',
                          }}
                        >
                          {!inv.campaign.song.coverArtUrl && (
                            <Music2 size={20} color="#f472b6" />
                          )}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: '15px',
                              fontWeight: 700,
                              color: '#fff',
                              margin: '0 0 4px 0',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {inv.campaign.song.title}
                          </p>
                          <p
                            style={{
                              fontSize: '13px',
                              color: '#71717a',
                              margin: 0,
                              fontWeight: 500,
                            }}
                          >
                            {inv.campaign.song.artist.name}
                          </p>
                        </div>
                      </div>

                      {/* Right */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flexWrap: 'wrap',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <div
                          style={{
                            padding: '10px 14px',
                            background: 'rgba(236,72,153,0.08)',
                            border: '1px solid rgba(236,72,153,0.12)',
                            borderRadius: '12px',
                            minWidth: '110px',
                            textAlign: 'right',
                          }}
                        >
                          <p
                            style={{
                              fontSize: '10px',
                              color: '#52525b',
                              margin: '0 0 4px 0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              fontWeight: 700,
                            }}
                          >
                            Ownership
                          </p>
                          <p
                            style={{
                              fontSize: '14px',
                              color: '#f472b6',
                              fontWeight: 700,
                              margin: 0,
                            }}
                          >
                            {inv.ownershipPct.toFixed(2)}%
                          </p>
                        </div>

                        <div
                          style={{
                            padding: '10px 14px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            minWidth: '110px',
                            textAlign: 'right',
                          }}
                        >
                          <p
                            style={{
                              fontSize: '10px',
                              color: '#52525b',
                              margin: '0 0 4px 0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              fontWeight: 700,
                            }}
                          >
                            Invested
                          </p>
                          <p
                            style={{
                              fontSize: '14px',
                              color: '#d4d4d8',
                              fontWeight: 700,
                              margin: 0,
                            }}
                          >
                            ₹{inv.amount.toLocaleString('en-IN')}
                          </p>
                        </div>

                        <div
                          style={{
                            padding: '10px 14px',
                            background: roiPositive
                              ? 'rgba(16,185,129,0.08)'
                              : 'rgba(239,68,68,0.08)',
                            border: roiPositive
                              ? '1px solid rgba(16,185,129,0.12)'
                              : '1px solid rgba(239,68,68,0.12)',
                            borderRadius: '12px',
                            minWidth: '92px',
                            textAlign: 'right',
                          }}
                        >
                          <p
                            style={{
                              fontSize: '10px',
                              color: '#52525b',
                              margin: '0 0 4px 0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              fontWeight: 700,
                            }}
                          >
                            ROI
                          </p>
                          <p
                            style={{
                              fontSize: '14px',
                              color: roiPositive ? '#34d399' : '#f87171',
                              fontWeight: 700,
                              margin: 0,
                            }}
                          >
                            {inv.analytics.roi.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {/* Bottom info strip */}
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '12px',
                          flexWrap: 'wrap',
                          marginTop: '2px',
                          paddingTop: '12px',
                          borderTop: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: '18px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#52525b',
                              fontWeight: 500,
                            }}
                          >
                            Streams:{' '}
                            <span style={{ color: '#a1a1aa', fontWeight: 700 }}>
                              {inv.analytics.totalStreams.toLocaleString()}
                            </span>
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#52525b',
                              fontWeight: 500,
                            }}
                          >
                            Est. Payout:{' '}
                            <span style={{ color: '#34d399', fontWeight: 700 }}>
                              ₹{inv.analytics.estimatedPayout.toLocaleString('en-IN')}
                            </span>
                          </span>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#f472b6',
                              animation: 'pulse-dot 2s ease-in-out infinite',
                            }}
                          />
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#71717a',
                              fontWeight: 600,
                            }}
                          >
                            Live analytics
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </FanLayout>
  )
}