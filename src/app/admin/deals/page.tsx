'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2 } from 'lucide-react'

const STATUS_CONFIG: Record<
  string,
  {
    text: string
    bg: string
    border: string
    glow: string
  }
> = {
  completed: {
    text: '#4ade80',
    bg: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.18)',
    glow: 'rgba(34,197,94,0.08)',
  },
  active: {
    text: '#fbbf24',
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.18)',
    glow: 'rgba(245,158,11,0.08)',
  },
  admin_released: {
    text: '#60a5fa',
    bg: 'rgba(59,130,246,0.10)',
    border: 'rgba(59,130,246,0.18)',
    glow: 'rgba(59,130,246,0.08)',
  },
  refunded: {
    text: '#f87171',
    bg: 'rgba(239,68,68,0.10)',
    border: 'rgba(239,68,68,0.18)',
    glow: 'rgba(239,68,68,0.08)',
  },
}

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] || {
    text: '#d4d4d8',
    bg: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.10)',
    glow: 'rgba(255,255,255,0.05)',
  }

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)

  const loadDeals = async () => {
    try {
      const res = await fetch('/api/admin/deals')
      const data = await res.json()

      if (data.success) {
        setDeals(data.data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeals()
  }, [])

  const handleAction = async (
    dealId: string,
    action: 'release_funds' | 'refund_artist'
  ) => {
    try {
      setLoadingId(dealId + action)

      const res = await fetch(
        `/api/admin/deals/${dealId}/action`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action,
          }),
        }
      )

      const data = await res.json()

      if (!data.success) {
        alert(data.error || 'Action failed')
        return
      }

      await loadDeals()

      alert(data.message)
    } catch (err) {
      console.error(err)
      alert('Action failed')
    } finally {
      setLoadingId(null)
    }
  }

  const summary = useMemo(() => {
    return {
      total: deals.length,
      active: deals.filter((d) => d.status === 'active').length,
      released: deals.filter((d) => d.status === 'admin_released').length,
      refunded: deals.filter((d) => d.status === 'refunded').length,
    }
  }, [deals])

  if (loading) {
    return (
      <AdminLayout>
        <style jsx global>{`
          @keyframes admDealsFloatOrb {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          @keyframes admDealsSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#06060a',
            position: 'relative',
            overflow: 'hidden',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '999px',
              background:
                'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)',
              animation: 'admDealsFloatOrb 4s ease-in-out infinite',
            }}
          />
          <Loader2
            style={{
              width: '36px',
              height: '36px',
              color: '#f87171',
              animation: 'admDealsSpin 1s linear infinite',
              position: 'relative',
              zIndex: 1,
            }}
          />
          <p
            style={{
              marginTop: '14px',
              color: '#52525b',
              fontSize: '14px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Loading deals...
          </p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes admDealsFloatOrb {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes admDealsFloatOrb2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-14px) scale(1.03); }
        }
        @keyframes admDealsFloatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(18px, -12px) scale(1.04); }
        }
        @keyframes admDealsFadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes admDealsFadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes admDealsFadeInStagger {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes admDealsGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes admDealsPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.35); }
        }
        @keyframes admDealsSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
              width: '480px',
              height: '480px',
              borderRadius: '999px',
              background:
                'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)',
              animation: 'admDealsFloatOrb 10s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '45%',
              left: '-120px',
              width: '420px',
              height: '420px',
              borderRadius: '999px',
              background:
                'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
              animation: 'admDealsFloatOrb2 13s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              right: '30%',
              width: '340px',
              height: '340px',
              borderRadius: '999px',
              background:
                'radial-gradient(circle, rgba(168,85,247,0.03) 0%, transparent 70%)',
              animation: 'admDealsFloatOrb3 16s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
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
            animation: 'admDealsFadeInDown 0.5s ease-out',
          }}
        >
          <div
            style={{
              padding: '28px 32px',
              maxWidth: '1350px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg, rgba(239,68,68,0.14), rgba(245,158,11,0.10))',
                  border: '1px solid rgba(239,68,68,0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(239,68,68,0.08)',
                  fontSize: '20px',
                }}
              >
                🤝
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
                  All Deals
                </h1>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#52525b',
                    margin: '2px 0 0 0',
                    fontWeight: 500,
                  }}
                >
                  Manage fund release and refunds
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              {[
                { label: 'Total', value: summary.total, color: '#d4d4d8', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.08)' },
                { label: 'Active', value: summary.active, color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
                { label: 'Released', value: summary.released, color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)' },
                { label: 'Refunded', value: summary.refunded, color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}55`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      color: item.color,
                      fontWeight: 700,
                    }}
                  >
                    {item.label}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '28px 32px 48px',
            maxWidth: '1350px',
            margin: '0 auto',
          }}
        >
          {deals.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '100px 0',
                animation: 'admDealsFadeInUp 0.6s ease-out',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '24px',
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  fontSize: '34px',
                }}
              >
                📭
              </div>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#52525b',
                  margin: '0 0 4px 0',
                }}
              >
                No deals found
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#3f3f46',
                  margin: 0,
                }}
              >
                Deals will appear here when created on the platform
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {deals.map((deal, index) => {
                const isHovered = hoveredCard === deal.id
                const status = getStatusConfig(deal.status)
                const isReleasing = loadingId === deal.id + 'release_funds'
                const isRefunding = loadingId === deal.id + 'refund_artist'

                return (
                  <div
                    key={deal.id}
                    onMouseEnter={() => setHoveredCard(deal.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      background: isHovered
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
                      border: `1px solid ${isHovered ? status.border : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '24px',
                      padding: '24px',
                      backdropFilter: 'blur(16px)',
                      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: isHovered
                        ? `0 14px 40px rgba(0,0,0,0.35), 0 0 50px ${status.glow}`
                        : '0 2px 10px rgba(0,0,0,0.12)',
                      animation: `admDealsFadeInStagger 0.45s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* Accent line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '16px',
                        bottom: '16px',
                        width: '3px',
                        borderRadius: '0 3px 3px 0',
                        background: `linear-gradient(180deg, ${status.text}, transparent)`,
                        opacity: isHovered ? 1 : 0.45,
                        transition: 'opacity 0.3s ease',
                      }}
                    />

                    {/* Corner glow */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-24px',
                        right: '-24px',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${status.glow} 0%, transparent 70%)`,
                        pointerEvents: 'none',
                        opacity: isHovered ? 1 : 0.35,
                        transition: 'opacity 0.3s ease',
                      }}
                    />

                    {/* Top row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap',
                        marginBottom: '18px',
                        position: 'relative',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h2
                          style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#fff',
                            margin: '0 0 6px 0',
                            lineHeight: 1.3,
                          }}
                        >
                          {deal.projectTitle}
                        </h2>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          <p
                            style={{
                              fontSize: '13px',
                              color: '#71717a',
                              margin: 0,
                              fontWeight: 500,
                            }}
                          >
                            Artist:{' '}
                            <span style={{ color: '#d4d4d8' }}>
                              {deal.artist?.name || 'Unknown'}
                            </span>
                          </p>

                          <p
                            style={{
                              fontSize: '13px',
                              color: '#71717a',
                              margin: 0,
                              fontWeight: 500,
                            }}
                          >
                            Khapeetar:{' '}
                            <span style={{ color: '#d4d4d8' }}>
                              {deal.khapeetar?.name || 'Unknown'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '7px 14px',
                          borderRadius: '999px',
                          background: status.bg,
                          border: `1px solid ${status.border}`,
                          color: status.text,
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: status.text,
                            boxShadow: `0 0 6px ${status.text}`,
                            animation:
                              deal.status === 'active'
                                ? 'admDealsPulseDot 2s ease-in-out infinite'
                                : 'none',
                          }}
                        />
                        {deal.status}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '12px',
                        marginBottom: deal.status === 'active' ? '22px' : '0',
                      }}
                    >
                      {[
                        {
                          label: 'Budget',
                          value: `₹${Number(deal.budget || 0).toLocaleString('en-IN')}`,
                          color: '#d4d4d8',
                          emoji: '💰',
                        },
                        {
                          label: 'Accepted',
                          value: `₹${Number(deal.acceptedBudget || 0).toLocaleString('en-IN')}`,
                          color: '#60a5fa',
                          emoji: '✅',
                        },
                        {
                          label: 'Escrow',
                          value: `₹${Number(deal.escrowAmount || 0).toLocaleString('en-IN')}`,
                          color: '#34d399',
                          emoji: '🔒',
                        },
                        {
                          label: 'Stage',
                          value: deal.negotiationStage || '-',
                          color: '#c084fc',
                          emoji: '🧭',
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          style={{
                            background: 'rgba(255,255,255,0.025)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            padding: '16px',
                          }}
                        >
                          <p
                            style={{
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: '#52525b',
                              fontWeight: 700,
                              margin: '0 0 6px 0',
                            }}
                          >
                            {item.emoji} {item.label}
                          </p>
                          <p
                            style={{
                              fontSize: '16px',
                              fontWeight: 700,
                              color: item.color,
                              margin: 0,
                              textTransform:
                                item.label === 'Stage'
                                  ? 'none'
                                  : 'none',
                            }}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Admin actions */}
                    {deal.status === 'active' && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          position: 'relative',
                        }}
                      >
                        <button
                          onClick={() =>
                            handleAction(
                              deal.id,
                              'release_funds'
                            )
                          }
                          disabled={isReleasing}
                          onMouseEnter={() =>
                            setHoveredBtn(`release-${deal.id}`)
                          }
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            borderRadius: '14px',
                            border: 'none',
                            background: isReleasing
                              ? 'rgba(255,255,255,0.04)'
                              : 'linear-gradient(135deg, #16a34a, #22c55e)',
                            color: isReleasing ? '#52525b' : '#04130a',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: isReleasing ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: 'inherit',
                            transform:
                              hoveredBtn === `release-${deal.id}` && !isReleasing
                                ? 'translateY(-1px)'
                                : 'translateY(0)',
                            boxShadow:
                              hoveredBtn === `release-${deal.id}` && !isReleasing
                                ? '0 8px 24px rgba(34,197,94,0.25)'
                                : '0 2px 10px rgba(34,197,94,0.12)',
                            overflow: 'hidden',
                            opacity: isReleasing ? 0.5 : 1,
                          }}
                        >
                          {hoveredBtn === `release-${deal.id}` &&
                            !isReleasing && (
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background:
                                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                                  backgroundSize: '200% 100%',
                                  animation:
                                    'admDealsGradientShift 1.6s linear infinite',
                                  pointerEvents: 'none',
                                }}
                              />
                            )}

                          {isReleasing ? (
                            <>
                              <Loader2
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  animation: 'admDealsSpin 1s linear infinite',
                                }}
                              />
                              Releasing...
                            </>
                          ) : (
                            <>✅ Release Funds</>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            const confirmed = confirm(
                              'Refund escrow back to artist?'
                            )

                            if (!confirmed) return

                            handleAction(
                              deal.id,
                              'refund_artist'
                            )
                          }}
                          disabled={isRefunding}
                          onMouseEnter={() =>
                            setHoveredBtn(`refund-${deal.id}`)
                          }
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            borderRadius: '14px',
                            border: 'none',
                            background: isRefunding
                              ? 'rgba(255,255,255,0.04)'
                              : 'linear-gradient(135deg, #dc2626, #ef4444)',
                            color: isRefunding ? '#52525b' : '#fff',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: isRefunding ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: 'inherit',
                            transform:
                              hoveredBtn === `refund-${deal.id}` && !isRefunding
                                ? 'translateY(-1px)'
                                : 'translateY(0)',
                            boxShadow:
                              hoveredBtn === `refund-${deal.id}` && !isRefunding
                                ? '0 8px 24px rgba(239,68,68,0.22)'
                                : '0 2px 10px rgba(239,68,68,0.12)',
                            overflow: 'hidden',
                            opacity: isRefunding ? 0.5 : 1,
                          }}
                        >
                          {hoveredBtn === `refund-${deal.id}` &&
                            !isRefunding && (
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background:
                                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                                  backgroundSize: '200% 100%',
                                  animation:
                                    'admDealsGradientShift 1.6s linear infinite',
                                  pointerEvents: 'none',
                                }}
                              />
                            )}

                          {isRefunding ? (
                            <>
                              <Loader2
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  animation: 'admDealsSpin 1s linear infinite',
                                }}
                              />
                              Refunding...
                            </>
                          ) : (
                            <>↩ Refund Artist</>
                          )}
                        </button>
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