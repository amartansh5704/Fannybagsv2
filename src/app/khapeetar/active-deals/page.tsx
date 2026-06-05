'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import {
  Loader2, Zap, MessageSquare,
  Clock, ShieldCheck,
} from 'lucide-react'
import { formatINR } from '@/lib/utils'

export default function ActiveDeals() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [deals, setDeals]           = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn]   = useState<string | null>(null)

  const fetchDeals = () => {
    fetch('/api/deals')
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setDeals(j.data.filter((d: any) => d.status === 'active' || d.status === 'completed'))
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/khapeetar/login'); return }
    fetchDeals()
  }, [session, status])

  const markComplete = async (id: string) => {
    setCompleting(id)
    try {
      const res  = await fetch(`/api/deals/${id}/complete`, { method: 'POST' })
      const json = await res.json()
      if (!json.success) alert(json.error || 'Could not mark complete')
      else fetchDeals()
    } finally {
      setCompleting(null)
    }
  }

  if (status === 'loading' || loading) {
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
          }}>Loading active deals...</p>
        </div>
      </KhapeetarLayout>
    )
  }

  const activeCount = deals.filter(d => d.status === 'active').length
  const completedCount = deals.filter(d => d.status === 'completed').length

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
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes completedPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.1); }
          50% { box-shadow: 0 0 20px 4px rgba(139,92,246,0.05); }
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
            top: '50%',
            left: '-80px',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb2 13s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            right: '30%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(20,184,166,0.03) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb3 16s ease-in-out infinite',
          }} />
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
                  <Zap size={20} color="#34d399" />
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
                    Active Deals
                  </h1>
                  <p style={{
                    fontSize: '13px',
                    color: '#52525b',
                    margin: '2px 0 0 0',
                    fontWeight: 500,
                  }}>
                    Your ongoing and completed work
                  </p>
                </div>
              </div>

              {/* Stats pills */}
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.12)',
                  borderRadius: '10px',
                }}>
                  <div style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#34d399',
                    boxShadow: '0 0 8px rgba(52,211,153,0.5)',
                    animation: 'pulse-dot 2s ease-in-out infinite',
                  }} />
                  <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700 }}>
                    {activeCount} Active
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: 'rgba(139,92,246,0.06)',
                  border: '1px solid rgba(139,92,246,0.12)',
                  borderRadius: '10px',
                }}>
                  <div style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#a78bfa',
                  }} />
                  <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 700 }}>
                    {completedCount} Done
                  </span>
                </div>
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
                <Zap size={32} color="#27272a" />
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#52525b',
                margin: '0 0 4px 0',
              }}>No active deals yet</p>
              <p style={{
                fontSize: '13px',
                color: '#3f3f46',
                margin: 0,
              }}>Your ongoing and completed work will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {deals.map((deal, index) => {
                const isCompleted = deal.status === 'completed'
                const isActive = deal.status === 'active'
                const isHovered = hoveredCard === deal.id

                const accentColor = isCompleted
                  ? { r: 139, g: 92, b: 246 }
                  : { r: 16, g: 185, b: 129 }

                const ac = `rgba(${accentColor.r},${accentColor.g},${accentColor.b},`

                const yourCut = Math.round((deal.acceptedBudget || deal.budget) * 0.90)
                const dealValue = deal.acceptedBudget || deal.budget

                return (
                  <div
                    key={deal.id}
                    onMouseEnter={() => setHoveredCard(deal.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      background: isHovered
                        ? `linear-gradient(135deg, ${ac}0.08) 0%, ${ac}0.03) 100%)`
                        : `linear-gradient(135deg, ${ac}0.05) 0%, ${ac}0.015) 100%)`,
                      border: `1px solid ${isHovered ? `${ac}0.2)` : `${ac}0.1)`}`,
                      borderRadius: '20px',
                      padding: '28px',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                      boxShadow: isHovered
                        ? `0 12px 40px ${ac}0.08), 0 0 60px ${ac}0.03)`
                        : '0 2px 10px rgba(0,0,0,0.1)',
                      animation: `fadeInStagger 0.4s ease-out ${index * 0.08}s both`,
                    }}
                  >
                    {/* Left accent bar */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      bottom: '16px',
                      left: 0,
                      width: '3px',
                      background: isCompleted
                        ? 'linear-gradient(180deg, #a78bfa, transparent)'
                        : 'linear-gradient(180deg, #34d399, transparent)',
                      borderRadius: '0 4px 4px 0',
                      transition: 'opacity 0.3s ease',
                      opacity: isHovered ? 1 : 0.6,
                    }} />

                    {/* Corner glow */}
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '120px',
                      height: '120px',
                      background: `radial-gradient(circle, ${ac}0.06) 0%, transparent 70%)`,
                      borderRadius: '50%',
                      opacity: isHovered ? 1 : 0.3,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                    }} />

                    {/* Completed shimmer */}
                    {isCompleted && isHovered && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(90deg, transparent, ${ac}0.04), transparent)`,
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s linear infinite',
                        pointerEvents: 'none',
                      }} />
                    )}

                    {/* Header row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
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
                        {deal.artist?.name && (
                          <p style={{
                            fontSize: '13px',
                            color: '#52525b',
                            margin: '4px 0 0 0',
                            fontWeight: 500,
                          }}>
                            with <span style={{ color: '#71717a' }}>{deal.artist.name}</span>
                          </p>
                        )}
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
                        background: `${ac}0.1)`,
                        color: isCompleted ? '#a78bfa' : '#34d399',
                        border: `1px solid ${ac}0.2)`,
                        borderRadius: '10px',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: isCompleted ? '#a78bfa' : '#34d399',
                          boxShadow: `0 0 6px ${isCompleted ? 'rgba(167,139,250,0.5)' : 'rgba(52,211,153,0.5)'}`,
                          animation: isActive ? 'pulse-dot 2s ease-in-out infinite' : 'none',
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
                      position: 'relative',
                    }}>
                      {deal.description}
                    </p>

                    {/* Financial cards */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                    }}>
                      {/* Your cut card */}
                      <div style={{
                        position: 'relative',
                        overflow: 'hidden',
                        background: isCompleted
                          ? 'rgba(139,92,246,0.06)'
                          : 'rgba(16,185,129,0.06)',
                        border: `1px solid ${isCompleted ? 'rgba(139,92,246,0.12)' : 'rgba(16,185,129,0.12)'}`,
                        borderRadius: '14px',
                        padding: '14px 20px',
                        minWidth: '140px',
                      }}>
                        {/* Shimmer for escrow */}
                        {isActive && (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.04), transparent)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 3s linear infinite',
                            pointerEvents: 'none',
                          }} />
                        )}
                        <p style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#52525b',
                          fontWeight: 600,
                          margin: '0 0 4px 0',
                          position: 'relative',
                        }}>
                          {isCompleted ? '💸 Paid Out' : '🔒 Escrowed'}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '6px',
                          position: 'relative',
                        }}>
                          <p style={{
                            fontSize: '18px',
                            fontWeight: 800,
                            color: isCompleted ? '#a78bfa' : '#34d399',
                            margin: 0,
                            textShadow: isHovered
                              ? `0 0 16px ${isCompleted ? 'rgba(167,139,250,0.3)' : 'rgba(52,211,153,0.3)'}`
                              : 'none',
                            transition: 'text-shadow 0.3s ease',
                          }}>
                            {formatINR(yourCut)}
                          </p>
                          <span style={{
                            fontSize: '11px',
                            color: '#3f3f46',
                            fontWeight: 500,
                          }}>your cut</span>
                        </div>
                      </div>

                      {/* Deal value card */}
                      <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '14px',
                        padding: '14px 20px',
                        minWidth: '120px',
                      }}>
                        <p style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#52525b',
                          fontWeight: 600,
                          margin: '0 0 4px 0',
                        }}>
                          📋 Deal Value
                        </p>
                        <p style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#a1a1aa',
                          margin: 0,
                        }}>
                          {formatINR(dealValue)}
                        </p>
                      </div>

                      {/* Earnings percentage */}
                      <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: '14px',
                        padding: '14px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                        <p style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#52525b',
                          fontWeight: 600,
                          margin: '0 0 4px 0',
                        }}>
                          📊 Your Share
                        </p>
                        <p style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#34d399',
                          margin: 0,
                        }}>90%</p>
                      </div>
                    </div>

                    {/* Action buttons for ACTIVE deals */}
                    {isActive && (
                      <div style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        position: 'relative',
                      }}>
                        {/* Chat button */}
                        <button
                          onClick={() => router.push(`/deals/chat/${deal.id}`)}
                          onMouseEnter={() => setHoveredBtn(`chat-${deal.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '11px 20px',
                            background: hoveredBtn === `chat-${deal.id}`
                              ? 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(20,184,166,0.12))'
                              : 'rgba(16,185,129,0.08)',
                            border: `1px solid ${hoveredBtn === `chat-${deal.id}` ? 'rgba(16,185,129,0.35)' : 'rgba(16,185,129,0.2)'}`,
                            borderRadius: '12px',
                            color: '#34d399',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                            fontFamily: 'inherit',
                            transform: hoveredBtn === `chat-${deal.id}` ? 'translateY(-1px)' : 'translateY(0)',
                            boxShadow: hoveredBtn === `chat-${deal.id}` ? '0 4px 20px rgba(16,185,129,0.12)' : 'none',
                          }}
                        >
                          <MessageSquare size={15} />
                          Open Chat
                        </button>

                        {deal.khapeetarCompleted ? (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '11px 20px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                            color: '#52525b',
                            fontSize: '13px',
                            fontWeight: 600,
                          }}>
                            <Clock size={15} style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                            Waiting for Artist
                          </div>
                        ) : (
                          <button
                            onClick={() => markComplete(deal.id)}
                            disabled={completing === deal.id}
                            onMouseEnter={() => setHoveredBtn(`complete-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={{
                              position: 'relative',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '11px 22px',
                              background: completing === deal.id
                                ? 'rgba(16,185,129,0.3)'
                                : hoveredBtn === `complete-${deal.id}`
                                  ? 'linear-gradient(135deg, #10b981, #059669)'
                                  : 'linear-gradient(135deg, #10b981, #14b8a6)',
                              border: 'none',
                              borderRadius: '12px',
                              color: completing === deal.id ? 'rgba(0,0,0,0.5)' : '#000',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: completing === deal.id ? 'not-allowed' : 'pointer',
                              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                              fontFamily: 'inherit',
                              transform: hoveredBtn === `complete-${deal.id}` && completing !== deal.id
                                ? 'translateY(-2px)'
                                : 'translateY(0)',
                              boxShadow: hoveredBtn === `complete-${deal.id}` && completing !== deal.id
                                ? '0 6px 28px rgba(16,185,129,0.3)'
                                : '0 2px 12px rgba(16,185,129,0.15)',
                              opacity: completing === deal.id ? 0.6 : 1,
                              overflow: 'hidden',
                            }}
                          >
                            {/* Shimmer on hover */}
                            {hoveredBtn === `complete-${deal.id}` && completing !== deal.id && (
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.5s linear infinite',
                                pointerEvents: 'none',
                              }} />
                            )}
                            {completing === deal.id ? (
                              <div style={{
                                width: '15px',
                                height: '15px',
                                border: '2px solid rgba(0,0,0,0.2)',
                                borderTopColor: '#000',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                              }} />
                            ) : (
                              <ShieldCheck size={15} style={{ position: 'relative' }} />
                            )}
                            <span style={{ position: 'relative' }}>
                              {completing === deal.id ? 'Completing...' : 'Complete Deal'}
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Completed state */}
                    {isCompleted && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '14px 18px',
                        background: 'rgba(139,92,246,0.06)',
                        border: '1px solid rgba(139,92,246,0.1)',
                        borderRadius: '14px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        {/* Subtle shimmer */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.03), transparent)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 4s linear infinite',
                          pointerEvents: 'none',
                        }} />

                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: 'rgba(139,92,246,0.1)',
                          border: '1px solid rgba(139,92,246,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          position: 'relative',
                        }}>
                          <ShieldCheck size={16} color="#a78bfa" />
                        </div>
                        <div style={{ position: 'relative' }}>
                          <p style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#a78bfa',
                            margin: 0,
                          }}>
                            ✅ Deal Completed
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#71717a',
                            margin: '2px 0 0 0',
                            fontWeight: 500,
                          }}>
                            {formatINR(yourCut)} has been paid to your wallet
                          </p>
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
    </KhapeetarLayout>
  )
}