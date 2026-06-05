'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import {
  Loader2,
  Briefcase,
  CheckCircle,
  XCircle,
  MessageCircle,
  Clock,
  ShieldCheck,
  Crown,
} from 'lucide-react'
import { formatINR } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  pending: { bg: 'rgba(245,158,11,0.08)', text: '#fbbf24', border: 'rgba(245,158,11,0.2)', glow: 'rgba(245,158,11,0.05)' },
  accepted: { bg: 'rgba(6,182,212,0.08)', text: '#22d3ee', border: 'rgba(6,182,212,0.2)', glow: 'rgba(6,182,212,0.05)' },
  countered: { bg: 'rgba(59,130,246,0.08)', text: '#60a5fa', border: 'rgba(59,130,246,0.2)', glow: 'rgba(59,130,246,0.05)' },
  active: { bg: 'rgba(16,185,129,0.08)', text: '#34d399', border: 'rgba(16,185,129,0.2)', glow: 'rgba(16,185,129,0.05)' },
  rejected: { bg: 'rgba(239,68,68,0.08)', text: '#f87171', border: 'rgba(239,68,68,0.2)', glow: 'rgba(239,68,68,0.05)' },
  cancelled: { bg: 'rgba(113,113,122,0.08)', text: '#a1a1aa', border: 'rgba(113,113,122,0.2)', glow: 'rgba(113,113,122,0.05)' },
  completed: { bg: 'rgba(139,92,246,0.08)', text: '#a78bfa', border: 'rgba(139,92,246,0.2)', glow: 'rgba(139,92,246,0.05)' },
}

export default function ArtistDealsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [completing, setCompleting] = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const fetchDeals = () => {
    fetch('/api/deals')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setDeals(j.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/artist/login')
      return
    }

    fetchDeals()
  }, [session, status])

  const act = async (
    id: string,
    action: string,
    extra?: Record<string, any>
  ) => {
    setActing(id)

    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...extra,
        }),
      })

      const json = await res.json()

      if (!json.success) {
        alert(json.error || 'Action failed')
      } else {
        fetchDeals()
      }
    } finally {
      setActing(null)
    }
  }

  const counterDeal = async (dealId: string) => {
    const amount = prompt('Enter counter amount')
    if (!amount) return

    const msg = prompt('Counter message (optional)')

    await act(dealId, 'counter', {
      counterBudget: Number(amount),
      counterMessage: msg || '',
    })
  }

  const selectCandidate = async (deal: any) => {
    const amount =
      deal.acceptedBudget ||
      deal.counterBudget ||
      deal.budget

    const ok = confirm(
      `Escrow ${formatINR(amount)} and select ${deal.khapeetar?.name}?`
    )

    if (!ok) return

    await act(deal.id, 'select_candidate')
  }

  const markComplete = async (id: string) => {
    setCompleting(id)

    try {
      const res = await fetch(`/api/deals/${id}/complete`, {
        method: 'POST',
      })

      const json = await res.json()

      if (!json.success) {
        alert(json.error || 'Could not mark complete')
      } else {
        fetchDeals()
      }
    } finally {
      setCompleting(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <ArtistLayout>
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
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb 4s ease-in-out infinite',
          }} />
          <Loader2 style={{
            animation: 'spin 1s linear infinite',
            color: '#a78bfa',
            width: '40px',
            height: '40px',
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
          }}>Loading deals...</p>
        </div>
      </ArtistLayout>
    )
  }

  const btnStyle = (
    bgColor: string,
    borderColor: string,
    textColor: string,
    hoverBg: string,
    id: string,
  ): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: hoveredBtn === id ? hoverBg : bgColor,
    border: `1px solid ${borderColor}`,
    borderRadius: '12px',
    color: textColor,
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    fontFamily: 'inherit',
    transform: hoveredBtn === id ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: hoveredBtn === id ? `0 4px 20px ${bgColor}` : 'none',
  })

  return (
    <ArtistLayout>
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInStagger {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .deals-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .deals-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .deals-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.06);
          border-radius: 3px;
        }
        .deals-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.12);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#06060a',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
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
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb 8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '-100px',
            width: '380px',
            height: '380px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb2 10s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            right: '30%',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb 12s ease-in-out infinite',
          }} />
          {/* Grid overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Header */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 32px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '28px 0',
            animation: 'fadeInUp 0.5s ease-out',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '6px',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.15))',
                border: '1px solid rgba(139,92,246,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(139,92,246,0.1)',
              }}>
                <Briefcase size={20} color="#a78bfa" />
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
                  Work & Deals
                </h1>
                <p style={{
                  fontSize: '13px',
                  color: '#52525b',
                  margin: '2px 0 0 0',
                  fontWeight: 500,
                }}>
                  Manage negotiations and collaborations
                </p>
              </div>
            </div>

            {/* Stats bar */}
            {deals.length > 0 && (
              <div style={{
                display: 'flex',
                gap: '24px',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.04)',
              }}>
                {[
                  { label: 'Total', value: deals.length, color: '#a1a1aa' },
                  { label: 'Active', value: deals.filter(d => d.status === 'active').length, color: '#34d399' },
                  { label: 'Pending', value: deals.filter(d => d.status === 'pending').length, color: '#fbbf24' },
                  { label: 'Completed', value: deals.filter(d => d.status === 'completed').length, color: '#a78bfa' },
                ].map((stat, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: stat.color,
                      boxShadow: `0 0 8px ${stat.color}40`,
                    }} />
                    <span style={{
                      fontSize: '12px',
                      color: '#71717a',
                      fontWeight: 500,
                    }}>
                      {stat.label}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      color: '#fff',
                      fontWeight: 700,
                    }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="deals-scrollbar" style={{
          position: 'relative',
          zIndex: 1,
          padding: '28px 32px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {deals.length === 0 ? (
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
                <Briefcase size={32} color="#3f3f46" />
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#52525b',
                margin: 0,
              }}>No deals yet</p>
              <p style={{
                fontSize: '13px',
                color: '#3f3f46',
                marginTop: '6px',
              }}>Your work requests and negotiations will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {deals.map((deal, index) => {
                const isKhapeetarOrigin =
                  deal.negotiationStage === 'khapeetar_offer'

                const statusStyle = STATUS_CONFIG[deal.status] || STATUS_CONFIG.cancelled
                const isHovered = hoveredCard === deal.id

                return (
                  <div
                    key={deal.id}
                    onMouseEnter={() => setHoveredCard(deal.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      background: isHovered
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
                      border: `1px solid ${isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '20px',
                      padding: '28px',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: isHovered
                        ? `0 8px 40px rgba(0,0,0,0.3), 0 0 60px ${statusStyle.glow}`
                        : '0 2px 10px rgba(0,0,0,0.1)',
                      animation: `fadeInStagger 0.4s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* Left accent bar */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      bottom: '16px',
                      left: 0,
                      width: '3px',
                      background: `linear-gradient(180deg, ${statusStyle.text}, transparent)`,
                      borderRadius: '0 4px 4px 0',
                    }} />

                    {/* Status glow */}
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '120px',
                      height: '120px',
                      background: `radial-gradient(circle, ${statusStyle.glow} 0%, transparent 70%)`,
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }} />

                    {/* Top row: title + status */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                      position: 'relative',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: '17px',
                          fontWeight: 700,
                          color: '#fff',
                          margin: 0,
                          lineHeight: 1.3,
                        }}>
                          {deal.projectTitle}
                        </h3>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '6px',
                          flexWrap: 'wrap',
                        }}>
                          <span style={{
                            fontSize: '13px',
                            color: '#71717a',
                            fontWeight: 500,
                          }}>
                            {deal.khapeetar?.name}
                          </span>
                          <span style={{
                            width: '3px',
                            height: '3px',
                            borderRadius: '50%',
                            background: '#3f3f46',
                            display: 'inline-block',
                          }} />
                          <span style={{
                            fontSize: '13px',
                            color: '#52525b',
                            fontWeight: 500,
                          }}>
                            {deal.workType}
                          </span>
                        </div>

                        {/* Tags */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                          {isKhapeetarOrigin && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              fontSize: '11px',
                              fontWeight: 600,
                              background: 'rgba(16,185,129,0.08)',
                              color: '#34d399',
                              border: '1px solid rgba(16,185,129,0.15)',
                              borderRadius: '8px',
                            }}>
                              <span style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: '#34d399',
                                animation: 'pulse-dot 2s ease-in-out infinite',
                              }} />
                              Incoming from Khapeetar
                            </span>
                          )}

                          {deal.offerGroupId && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              fontSize: '11px',
                              fontWeight: 600,
                              background: 'rgba(6,182,212,0.08)',
                              color: '#22d3ee',
                              border: '1px solid rgba(6,182,212,0.15)',
                              borderRadius: '8px',
                            }}>
                              ⚔️ Multi-offer
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status badge */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        background: statusStyle.bg,
                        color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`,
                        borderRadius: '10px',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: statusStyle.text,
                          boxShadow: `0 0 6px ${statusStyle.text}`,
                          animation: deal.status === 'active' || deal.status === 'pending'
                            ? 'pulse-dot 2s ease-in-out infinite'
                            : 'none',
                        }} />
                        {deal.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{
                      color: '#71717a',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      margin: '0 0 20px 0',
                    }}>
                      {deal.description}
                    </p>

                    {/* Financial info cards */}
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '14px',
                        padding: '12px 18px',
                        minWidth: '120px',
                      }}>
                        <p style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#52525b',
                          fontWeight: 600,
                          margin: '0 0 4px 0',
                        }}>Budget</p>
                        <p style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#fff',
                          margin: 0,
                        }}>
                          {formatINR(deal.budget)}
                        </p>
                      </div>

                      {deal.counterBudget && (
                        <div style={{
                          background: 'rgba(245,158,11,0.06)',
                          border: '1px solid rgba(245,158,11,0.15)',
                          borderRadius: '14px',
                          padding: '12px 18px',
                          minWidth: '120px',
                        }}>
                          <p style={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#52525b',
                            fontWeight: 600,
                            margin: '0 0 4px 0',
                          }}>Counter Offer</p>
                          <p style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#fbbf24',
                            margin: 0,
                          }}>
                            {formatINR(deal.counterBudget)}
                          </p>
                        </div>
                      )}

                      {deal.escrowAmount && (
                        <div style={{
                          background: 'rgba(16,185,129,0.06)',
                          border: '1px solid rgba(16,185,129,0.15)',
                          borderRadius: '14px',
                          padding: '12px 18px',
                          minWidth: '120px',
                          position: 'relative',
                          overflow: 'hidden',
                        }}>
                          {/* Shimmer on escrow */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.05), transparent)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 3s linear infinite',
                          }} />
                          <p style={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#52525b',
                            fontWeight: 600,
                            margin: '0 0 4px 0',
                            position: 'relative',
                          }}>🔒 Escrow</p>
                          <p style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#34d399',
                            margin: 0,
                            position: 'relative',
                            textShadow: '0 0 12px rgba(52,211,153,0.3)',
                          }}>
                            {formatINR(deal.escrowAmount)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Counter message */}
                    {deal.counterMessage && (
                      <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '14px',
                        padding: '16px 18px',
                        marginBottom: '20px',
                        borderLeft: '3px solid rgba(139,92,246,0.3)',
                      }}>
                        <p style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#52525b',
                          fontWeight: 600,
                          margin: '0 0 6px 0',
                        }}>💬 Message</p>
                        <p style={{
                          fontSize: '13px',
                          color: '#a1a1aa',
                          margin: 0,
                          lineHeight: 1.6,
                          fontStyle: 'italic',
                        }}>
                          &ldquo;{deal.counterMessage}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}>
                      {/* PENDING KHAPEETAR OFFER */}
                      {deal.status === 'pending' && isKhapeetarOrigin && (
                        <>
                          <button
                            onClick={() => act(deal.id, 'accept')}
                            disabled={acting === deal.id}
                            onMouseEnter={() => setHoveredBtn(`accept-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={btnStyle(
                              'rgba(16,185,129,0.08)',
                              'rgba(16,185,129,0.2)',
                              '#34d399',
                              'rgba(16,185,129,0.15)',
                              `accept-${deal.id}`,
                            )}
                          >
                            <CheckCircle size={14} />
                            Accept
                          </button>

                          <button
                            onClick={() => counterDeal(deal.id)}
                            onMouseEnter={() => setHoveredBtn(`counter-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={btnStyle(
                              'rgba(59,130,246,0.08)',
                              'rgba(59,130,246,0.2)',
                              '#60a5fa',
                              'rgba(59,130,246,0.15)',
                              `counter-${deal.id}`,
                            )}
                          >
                            ↩ Counter
                          </button>

                          <button
                            onClick={() => act(deal.id, 'reject')}
                            onMouseEnter={() => setHoveredBtn(`reject-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={btnStyle(
                              'rgba(239,68,68,0.08)',
                              'rgba(239,68,68,0.2)',
                              '#f87171',
                              'rgba(239,68,68,0.15)',
                              `reject-${deal.id}`,
                            )}
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </>
                      )}

                      {/* COUNTERED */}
                      {deal.status === 'countered' && (
                        <>
                          <button
                            onClick={() => act(deal.id, 'accept_counter')}
                            onMouseEnter={() => setHoveredBtn(`ac-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={btnStyle(
                              'rgba(16,185,129,0.08)',
                              'rgba(16,185,129,0.2)',
                              '#34d399',
                              'rgba(16,185,129,0.15)',
                              `ac-${deal.id}`,
                            )}
                          >
                            <CheckCircle size={14} />
                            Accept Counter
                          </button>

                          <button
                            onClick={() => act(deal.id, 'reject_counter')}
                            onMouseEnter={() => setHoveredBtn(`rc-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={btnStyle(
                              'rgba(239,68,68,0.08)',
                              'rgba(239,68,68,0.2)',
                              '#f87171',
                              'rgba(239,68,68,0.15)',
                              `rc-${deal.id}`,
                            )}
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </>
                      )}

                      {/* ACCEPTED — SELECT CANDIDATE */}
                      {deal.status === 'accepted' && (
                        <button
                          onClick={() => selectCandidate(deal)}
                          disabled={acting === deal.id}
                          onMouseEnter={() => setHoveredBtn(`sel-${deal.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{
                            ...btnStyle(
                              'rgba(6,182,212,0.08)',
                              'rgba(6,182,212,0.2)',
                              '#22d3ee',
                              'rgba(6,182,212,0.15)',
                              `sel-${deal.id}`,
                            ),
                            background: hoveredBtn === `sel-${deal.id}`
                              ? 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(139,92,246,0.15))'
                              : 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.06))',
                            border: `1px solid ${hoveredBtn === `sel-${deal.id}` ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.2)'}`,
                            boxShadow: hoveredBtn === `sel-${deal.id}`
                              ? '0 4px 24px rgba(6,182,212,0.2)'
                              : 'none',
                          }}
                        >
                          <Crown size={14} />
                          Select Candidate & Fund Escrow
                        </button>
                      )}

                      {/* ACTIVE */}
                      {deal.status === 'active' && (
                        <>
                          <button
                            onClick={() => router.push(`/deals/chat/${deal.id}`)}
                            onMouseEnter={() => setHoveredBtn(`chat-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={{
                              ...btnStyle(
                                'rgba(139,92,246,0.08)',
                                'rgba(139,92,246,0.2)',
                                '#a78bfa',
                                'rgba(139,92,246,0.15)',
                                `chat-${deal.id}`,
                              ),
                              background: hoveredBtn === `chat-${deal.id}`
                                ? 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(236,72,153,0.1))'
                                : 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.05))',
                            }}
                          >
                            <MessageCircle size={14} />
                            Open Chat
                          </button>

                          {deal.artistCompleted ? (
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 18px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              borderRadius: '12px',
                              color: '#52525b',
                              fontSize: '13px',
                              fontWeight: 600,
                            }}>
                              <Clock size={14} style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                              Waiting for Khapeetar
                            </div>
                          ) : (
                            <button
                              onClick={() => markComplete(deal.id)}
                              disabled={completing === deal.id}
                              onMouseEnter={() => setHoveredBtn(`comp-${deal.id}`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              style={{
                                ...btnStyle(
                                  'rgba(16,185,129,0.08)',
                                  'rgba(16,185,129,0.2)',
                                  '#34d399',
                                  'rgba(16,185,129,0.15)',
                                  `comp-${deal.id}`,
                                ),
                                opacity: completing === deal.id ? 0.5 : 1,
                                cursor: completing === deal.id ? 'not-allowed' : 'pointer',
                              }}
                            >
                              <ShieldCheck size={14} />
                              {completing === deal.id ? 'Completing...' : 'Complete Deal'}
                            </button>
                          )}
                        </>
                      )}

                      {/* COMPLETED */}
                      {deal.status === 'completed' && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 18px',
                          background: 'rgba(139,92,246,0.08)',
                          border: '1px solid rgba(139,92,246,0.15)',
                          borderRadius: '12px',
                          color: '#a78bfa',
                          fontSize: '13px',
                          fontWeight: 600,
                        }}>
                          <ShieldCheck size={14} />
                          ✅ Deal Completed
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ArtistLayout>
  )
}