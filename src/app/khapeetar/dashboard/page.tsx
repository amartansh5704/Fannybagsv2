'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import { Inbox, Zap, CheckCircle, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function KhapeetarDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [deals, setDeals]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState<string | null>(null)
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/khapeetar/login'); return }

    fetch('/api/deals')
      .then(r => r.json())
      .then(j => { if (j.success) setDeals(j.data) })
      .finally(() => setLoading(false))
  }, [session, status])

  const pending = deals.filter(d => d.status === 'pending').length
  const active  = deals.filter(d => d.status === 'active').length
  const done    = deals.filter(d => d.status === 'completed').length

  if (status === 'loading') {
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
          }}>Loading dashboard...</p>
        </div>
      </KhapeetarLayout>
    )
  }

  const statCards = [
    {
      key: 'pending',
      icon: Clock,
      label: 'Pending Requests',
      val: pending,
      color: '#fbbf24',
      gradientFrom: 'rgba(245,158,11,0.08)',
      gradientTo: 'rgba(245,158,11,0.02)',
      border: 'rgba(245,158,11,0.12)',
      glow: 'rgba(245,158,11,0.06)',
      emoji: '⏳',
    },
    {
      key: 'active',
      icon: Zap,
      label: 'Active Deals',
      val: active,
      color: '#34d399',
      gradientFrom: 'rgba(16,185,129,0.08)',
      gradientTo: 'rgba(16,185,129,0.02)',
      border: 'rgba(16,185,129,0.12)',
      glow: 'rgba(16,185,129,0.06)',
      emoji: '⚡',
    },
    {
      key: 'completed',
      icon: CheckCircle,
      label: 'Completed',
      val: done,
      color: '#60a5fa',
      gradientFrom: 'rgba(59,130,246,0.08)',
      gradientTo: 'rgba(59,130,246,0.02)',
      border: 'rgba(59,130,246,0.12)',
      glow: 'rgba(59,130,246,0.06)',
      emoji: '✅',
    },
  ]

  const quickLinks = [
    {
      key: 'all-deals',
      href: '/khapeetar/deals',
      icon: Inbox,
      iconColor: '#34d399',
      title: 'All Deals',
      subtitle: 'View and manage incoming work requests',
      emoji: '📥',
      accentColor: 'rgba(16,185,129,',
    },
    {
      key: 'active-deals',
      href: '/khapeetar/active-deals',
      icon: Zap,
      iconColor: '#fbbf24',
      title: 'Active Deals',
      subtitle: 'Manage your ongoing work',
      emoji: '⚡',
      accentColor: 'rgba(245,158,11,',
    },
  ]

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
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInStagger {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
            top: '-60px',
            right: '-30px',
            width: '420px',
            height: '420px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb 10s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '-80px',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb2 13s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            right: '25%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb3 16s ease-in-out infinite',
          }} />
          {/* Grid pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
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
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '6px',
                }}>
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
                    <span style={{ fontSize: '20px' }}>📊</span>
                  </div>
                  <h1 style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    margin: 0,
                    background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Dashboard
                  </h1>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#52525b',
                  margin: 0,
                  fontWeight: 500,
                }}>
                  Welcome back,{' '}
                  <span style={{
                    color: '#34d399',
                    fontWeight: 600,
                  }}>{session?.user?.name}</span>
                  {' '}👋
                </p>
              </div>

              {/* Time/date badge */}
              <div style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#34d399',
                  boxShadow: '0 0 8px rgba(52,211,153,0.5)',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }} />
                <span style={{
                  fontSize: '12px',
                  color: '#52525b',
                  fontWeight: 600,
                }}>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: '28px 32px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 0',
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  inset: '-12px',
                  background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(8px)',
                }} />
                <Loader2 style={{
                  animation: 'spin 1s linear infinite',
                  color: '#34d399',
                  width: '32px',
                  height: '32px',
                  position: 'relative',
                }} />
              </div>
              <p style={{
                marginTop: '16px',
                color: '#3f3f46',
                fontSize: '13px',
                fontWeight: 500,
              }}>Loading your data...</p>
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '32px',
              }}>
                {statCards.map((card, index) => {
                  const Icon = card.icon
                  const isHov = hoveredStat === card.key

                  return (
                    <div
                      key={card.key}
                      onMouseEnter={() => setHoveredStat(card.key)}
                      onMouseLeave={() => setHoveredStat(null)}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        background: `linear-gradient(135deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)`,
                        border: `1px solid ${isHov ? card.border : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: '20px',
                        padding: '28px',
                        cursor: 'default',
                        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                        transform: isHov ? 'translateY(-4px)' : 'translateY(0)',
                        boxShadow: isHov
                          ? `0 12px 40px ${card.glow}, 0 0 60px ${card.glow}`
                          : '0 2px 10px rgba(0,0,0,0.1)',
                        animation: `fadeInStagger 0.5s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      {/* Background glow */}
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '100px',
                        height: '100px',
                        background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)`,
                        borderRadius: '50%',
                        transition: 'opacity 0.3s ease',
                        opacity: isHov ? 1 : 0.3,
                      }} />

                      {/* Shimmer on hover */}
                      {isHov && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(90deg, transparent, ${card.glow}, transparent)`,
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2s linear infinite',
                          pointerEvents: 'none',
                        }} />
                      )}

                      {/* Icon container */}
                      <div style={{
                        position: 'relative',
                        width: '44px',
                        height: '44px',
                        borderRadius: '14px',
                        background: `${card.gradientFrom}`,
                        border: `1px solid ${card.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '18px',
                        transition: 'all 0.3s ease',
                        transform: isHov ? 'scale(1.08)' : 'scale(1)',
                        boxShadow: isHov ? `0 4px 20px ${card.glow}` : 'none',
                      }}>
                        <Icon size={20} color={card.color} />
                      </div>

                      {/* Value */}
                      <p style={{
                        position: 'relative',
                        fontSize: '36px',
                        fontWeight: 800,
                        color: '#fff',
                        margin: '0 0 4px 0',
                        lineHeight: 1,
                        animation: 'countUp 0.6s ease-out',
                        textShadow: isHov ? `0 0 20px ${card.glow}` : 'none',
                        transition: 'text-shadow 0.3s ease',
                      }}>
                        {card.val}
                      </p>

                      {/* Label */}
                      <p style={{
                        position: 'relative',
                        fontSize: '12px',
                        color: '#52525b',
                        margin: 0,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}>
                        {card.label}
                      </p>

                      {/* Bottom accent line */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: isHov ? '0' : '20%',
                        right: isHov ? '0' : '20%',
                        height: '2px',
                        background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                        transition: 'all 0.4s ease',
                        opacity: isHov ? 0.6 : 0.2,
                      }} />
                    </div>
                  )
                })}
              </div>

              {/* Quick links */}
              <div style={{ marginBottom: '8px' }}>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#27272a',
                  marginBottom: '14px',
                  paddingLeft: '4px',
                  animation: 'fadeInUp 0.6s ease-out 0.3s both',
                }}>
                  Quick Actions
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}>
                {quickLinks.map((link, index) => {
                  const Icon = link.icon
                  const isHov = hovered === link.key

                  return (
                    <Link
                      key={link.key}
                      href={link.href}
                      onMouseEnter={() => setHovered(link.key)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '18px',
                        padding: '24px',
                        background: isHov
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        border: `1px solid ${isHov ? `${link.accentColor}0.25)` : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: '18px',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                        transform: isHov ? 'translateY(-3px)' : 'translateY(0)',
                        boxShadow: isHov
                          ? `0 8px 30px ${link.accentColor}0.08)`
                          : '0 2px 8px rgba(0,0,0,0.05)',
                        backdropFilter: 'blur(12px)',
                        animation: `fadeInStagger 0.5s ease-out ${0.4 + index * 0.1}s both`,
                      }}
                    >
                      {/* Left accent bar */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: isHov ? '15%' : '30%',
                        bottom: isHov ? '15%' : '30%',
                        width: '3px',
                        borderRadius: '0 3px 3px 0',
                        background: `linear-gradient(180deg, ${link.iconColor}, transparent)`,
                        transition: 'all 0.3s ease',
                        opacity: isHov ? 0.8 : 0.3,
                      }} />

                      {/* Hover glow */}
                      {isHov && (
                        <div style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '100px',
                          height: '100px',
                          background: `radial-gradient(circle, ${link.accentColor}0.06) 0%, transparent 70%)`,
                          borderRadius: '50%',
                          pointerEvents: 'none',
                        }} />
                      )}

                      {/* Icon */}
                      <div style={{
                        position: 'relative',
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: `${link.accentColor}0.08)`,
                        border: `1px solid ${link.accentColor}0.15)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                        transform: isHov ? 'scale(1.06)' : 'scale(1)',
                        boxShadow: isHov ? `0 4px 16px ${link.accentColor}0.1)` : 'none',
                      }}>
                        <Icon size={22} color={link.iconColor} />
                      </div>

                      {/* Text */}
                      <div style={{ position: 'relative', flex: 1 }}>
                        <p style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#fff',
                          margin: '0 0 4px 0',
                          transition: 'color 0.2s ease',
                        }}>
                          {link.title}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: '#52525b',
                          margin: 0,
                          fontWeight: 500,
                          lineHeight: 1.4,
                        }}>
                          {link.subtitle}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div style={{
                        position: 'relative',
                        color: isHov ? link.iconColor : '#27272a',
                        transition: 'all 0.3s ease',
                        transform: isHov ? 'translateX(4px)' : 'translateX(0)',
                        fontSize: '18px',
                        flexShrink: 0,
                      }}>
                        →
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Recent activity placeholder */}
              <div style={{
                marginTop: '32px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '18px',
                padding: '24px',
                animation: 'fadeInUp 0.6s ease-out 0.6s both',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'rgba(139,92,246,0.08)',
                      border: '1px solid rgba(139,92,246,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                    }}>
                      📋
                    </div>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#a1a1aa',
                      margin: 0,
                    }}>Recent Activity</h3>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: '#27272a',
                    fontWeight: 600,
                    padding: '4px 10px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '6px',
                  }}>
                    {deals.length} total deals
                  </span>
                </div>

                {deals.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '32px 0',
                  }}>
                    <p style={{
                      fontSize: '32px',
                      marginBottom: '8px',
                    }}>📭</p>
                    <p style={{
                      fontSize: '13px',
                      color: '#3f3f46',
                      fontWeight: 500,
                      margin: 0,
                    }}>No deals yet — they&apos;ll show up here</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}>
                    {deals.slice(0, 4).map((deal, i) => {
                      const statusColors: Record<string, string> = {
                        pending: '#fbbf24',
                        active: '#34d399',
                        completed: '#a78bfa',
                        rejected: '#f87171',
                        countered: '#60a5fa',
                        accepted: '#22d3ee',
                        cancelled: '#71717a',
                      }
                      const dotColor = statusColors[deal.status] || '#71717a'

                      return (
                        <div
                          key={deal.id || i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.03)',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flex: 1,
                            minWidth: 0,
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: dotColor,
                              boxShadow: `0 0 6px ${dotColor}60`,
                              flexShrink: 0,
                            }} />
                            <span style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#d4d4d8',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {deal.projectTitle || 'Untitled'}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: dotColor,
                            padding: '3px 8px',
                            background: `${dotColor}12`,
                            borderRadius: '6px',
                            flexShrink: 0,
                            marginLeft: '8px',
                          }}>
                            {deal.status}
                          </span>
                        </div>
                      )
                    })}

                    {deals.length > 4 && (
                      <Link
                        href="/khapeetar/deals"
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          padding: '10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#34d399',
                          textDecoration: 'none',
                          borderRadius: '10px',
                          transition: 'all 0.2s ease',
                          marginTop: '4px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(16,185,129,0.06)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        View all {deals.length} deals →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </KhapeetarLayout>
  )
}