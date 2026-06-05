'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import {
  Loader2,
  Inbox,
  CheckCircle,
  XCircle,
  RefreshCcw,
  X,
  MessageCircle,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import { formatINR } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  pending:   { bg: 'rgba(245,158,11,0.08)',  text: '#fbbf24', border: 'rgba(245,158,11,0.2)',  glow: 'rgba(245,158,11,0.05)' },
  accepted:  { bg: 'rgba(6,182,212,0.08)',    text: '#22d3ee', border: 'rgba(6,182,212,0.2)',    glow: 'rgba(6,182,212,0.05)' },
  countered: { bg: 'rgba(59,130,246,0.08)',   text: '#60a5fa', border: 'rgba(59,130,246,0.2)',   glow: 'rgba(59,130,246,0.05)' },
  active:    { bg: 'rgba(16,185,129,0.08)',   text: '#34d399', border: 'rgba(16,185,129,0.2)',   glow: 'rgba(16,185,129,0.05)' },
  rejected:  { bg: 'rgba(239,68,68,0.08)',    text: '#f87171', border: 'rgba(239,68,68,0.2)',    glow: 'rgba(239,68,68,0.05)' },
  cancelled: { bg: 'rgba(113,113,122,0.08)',  text: '#a1a1aa', border: 'rgba(113,113,122,0.2)',  glow: 'rgba(113,113,122,0.05)' },
  completed: { bg: 'rgba(139,92,246,0.08)',   text: '#a78bfa', border: 'rgba(139,92,246,0.2)',   glow: 'rgba(139,92,246,0.05)' },
}

export default function KhapeetarDealsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [completing, setCompleting] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)

  const [counterOpen, setCounterOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [counterBudget, setCounterBudget] = useState('')
  const [counterMessage, setCounterMessage] = useState('')

  const fetchDeals = () => {
    fetch('/api/deals')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setDeals(j.data)
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/khapeetar/login')
      return
    }

    fetchDeals()
  }, [session, status])

  const action = async (
    id: string,
    act: string,
    extra = {}
  ) => {
    setActing(id)

    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: act,
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

  const markComplete = async (id: string) => {
    setCompleting(id)

    try {
      const res = await fetch(`/api/deals/${id}/complete`, {
        method: 'POST',
      })

      const json = await res.json()

      if (!json.success) {
        alert(json.error || 'Could not complete deal')
      } else {
        fetchDeals()
      }
    } finally {
      setCompleting(null)
    }
  }

  // Button style helper
  const actionBtnStyle = (
    bgColor: string,
    borderColor: string,
    textColor: string,
    hoverBg: string,
    id: string,
    disabled?: boolean
  ): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '11px 20px',
    background: hoveredBtn === id ? hoverBg : bgColor,
    border: `1px solid ${hoveredBtn === id && !disabled ? borderColor.replace('0.2)', '0.4)') : borderColor}`,
    borderRadius: '12px',
    color: textColor,
    fontSize: '13px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    fontFamily: 'inherit',
    transform: hoveredBtn === id && !disabled ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: hoveredBtn === id && !disabled ? `0 4px 20px ${bgColor}` : 'none',
    opacity: disabled ? 0.5 : 1,
  })

  if (status === 'loading' || loading) {
    return (
      <KhapeetarLayout>
        <style jsx global>{`
          @keyframes floatOrb { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', background: '#06060a', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            borderRadius: '50%', animation: 'floatOrb 4s ease-in-out infinite',
          }} />
          <Loader2 style={{ animation: 'spin 1s linear infinite', color: '#34d399', width: '36px', height: '36px', position: 'relative', zIndex: 1 }} />
          <p style={{ marginTop: '16px', color: '#52525b', fontSize: '14px', letterSpacing: '0.05em', position: 'relative', zIndex: 1 }}>Loading deals...</p>
        </div>
      </KhapeetarLayout>
    )
  }

  const pendingCount = deals.filter(d => d.status === 'pending').length
  const activeCount = deals.filter(d => d.status === 'active').length
  const completedCount = deals.filter(d => d.status === 'completed').length

  return (
    <KhapeetarLayout>
      <style jsx global>{`
        @keyframes floatOrb { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
        @keyframes floatOrb2 { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-15px) scale(1.03); } }
        @keyframes floatOrb3 { 0%, 100% { transform: translate(0,0) scale(1); } 40% { transform: translate(20px,25px) scale(1.03); } 80% { transform: translate(-15px,-10px) scale(0.97); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInStagger { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.92) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        .deals-scroll::-webkit-scrollbar { width: 5px; }
        .deals-scroll::-webkit-scrollbar-track { background: transparent; }
        .deals-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#06060a', color: '#ffffff',
        position: 'relative', overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-30px', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', borderRadius: '50%', animation: 'floatOrb 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '50%', left: '-80px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)', borderRadius: '50%', animation: 'floatOrb2 13s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-40px', right: '30%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 70%)', borderRadius: '50%', animation: 'floatOrb3 16s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        </div>

        {/* Header */}
        <div style={{
          position: 'relative', zIndex: 1,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
          backdropFilter: 'blur(20px)',
          animation: 'fadeInDown 0.5s ease-out',
        }}>
          <div style={{ padding: '28px 32px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.08))',
                  border: '1px solid rgba(16,185,129,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.08)',
                }}>
                  <Inbox size={20} color="#34d399" />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '22px', fontWeight: 800, margin: 0,
                    background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>All Deals</h1>
                  <p style={{ fontSize: '13px', color: '#52525b', margin: '2px 0 0 0', fontWeight: 500 }}>
                    Manage collaborations and negotiations
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'Total', val: deals.length, color: '#a1a1aa' },
                  { label: 'Pending', val: pendingCount, color: '#fbbf24' },
                  { label: 'Active', val: activeCount, color: '#34d399' },
                  { label: 'Done', val: completedCount, color: '#a78bfa' },
                ].map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 12px',
                    background: `${s.color}08`,
                    border: `1px solid ${s.color}18`,
                    borderRadius: '8px',
                  }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: s.color, boxShadow: `0 0 6px ${s.color}50`,
                    }} />
                    <span style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>{s.label}</span>
                    <span style={{ fontSize: '12px', color: '#fff', fontWeight: 700 }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="deals-scroll" style={{
          position: 'relative', zIndex: 1,
          padding: '28px 32px', maxWidth: '1200px', margin: '0 auto',
        }}>
          {deals.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '100px 0', animation: 'fadeInUp 0.6s ease-out',
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
              }}>
                <Inbox size={32} color="#27272a" />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#52525b', margin: '0 0 4px 0' }}>No deals yet</p>
              <p style={{ fontSize: '13px', color: '#3f3f46', margin: 0 }}>Incoming and outgoing deals will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {deals.map((deal, index) => {
                const outgoing = deal.negotiationStage === 'khapeetar_offer'
                const statusStyle = STATUS_CONFIG[deal.status] || STATUS_CONFIG.cancelled
                const isHovered = hoveredCard === deal.id

                return (
                  <div
                    key={deal.id}
                    onMouseEnter={() => setHoveredCard(deal.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      position: 'relative', overflow: 'hidden',
                      background: isHovered
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
                      border: `1px solid ${isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '20px', padding: '28px',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: isHovered
                        ? `0 8px 40px rgba(0,0,0,0.3), 0 0 60px ${statusStyle.glow}`
                        : '0 2px 10px rgba(0,0,0,0.1)',
                      animation: `fadeInStagger 0.4s ease-out ${index * 0.06}s both`,
                    }}
                  >
                    {/* Left accent */}
                    <div style={{
                      position: 'absolute', top: '16px', bottom: '16px', left: 0, width: '3px',
                      background: `linear-gradient(180deg, ${statusStyle.text}, transparent)`,
                      borderRadius: '0 4px 4px 0',
                      opacity: isHovered ? 1 : 0.5,
                      transition: 'opacity 0.3s ease',
                    }} />

                    {/* Corner glow */}
                    <div style={{
                      position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px',
                      background: `radial-gradient(circle, ${statusStyle.glow} 0%, transparent 70%)`,
                      borderRadius: '50%', pointerEvents: 'none',
                      opacity: isHovered ? 1 : 0.3, transition: 'opacity 0.3s ease',
                    }} />

                    {/* Header */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      marginBottom: '14px', position: 'relative',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.3 }}>
                          {deal.projectTitle}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#71717a', margin: '4px 0 0 0', fontWeight: 500 }}>
                          {outgoing
                            ? `Sent to ${deal.artist?.name || 'Artist'}`
                            : `From ${deal.artist?.name || 'Artist'}`}
                        </p>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            padding: '4px 10px', fontSize: '11px', fontWeight: 600,
                            background: outgoing ? 'rgba(6,182,212,0.08)' : 'rgba(16,185,129,0.08)',
                            color: outgoing ? '#22d3ee' : '#34d399',
                            border: `1px solid ${outgoing ? 'rgba(6,182,212,0.15)' : 'rgba(16,185,129,0.15)'}`,
                            borderRadius: '8px',
                          }}>
                            <span style={{
                              width: '5px', height: '5px', borderRadius: '50%',
                              background: outgoing ? '#22d3ee' : '#34d399',
                              animation: deal.status === 'pending' ? 'pulse-dot 2s ease-in-out infinite' : 'none',
                            }} />
                            {outgoing ? '↗ Your request' : '↙ Incoming'}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '6px 14px', fontSize: '11px', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        background: statusStyle.bg, color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`,
                        borderRadius: '10px', flexShrink: 0, marginLeft: '12px',
                      }}>
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: statusStyle.text,
                          boxShadow: `0 0 6px ${statusStyle.text}`,
                          animation: (deal.status === 'active' || deal.status === 'pending') ? 'pulse-dot 2s ease-in-out infinite' : 'none',
                        }} />
                        {deal.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0', position: 'relative' }}>
                      {deal.description}
                    </p>

                    {/* Financial cards */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '14px', padding: '12px 18px', minWidth: '110px',
                      }}>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', fontWeight: 600, margin: '0 0 4px 0' }}>💰 Budget</p>
                        <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>{formatINR(deal.budget)}</p>
                      </div>

                      {deal.counterBudget && (
                        <div style={{
                          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
                          borderRadius: '14px', padding: '12px 18px', minWidth: '110px',
                        }}>
                          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', fontWeight: 600, margin: '0 0 4px 0' }}>↩ Counter</p>
                          <p style={{ fontSize: '15px', fontWeight: 700, color: '#fbbf24', margin: 0 }}>{formatINR(deal.counterBudget)}</p>
                        </div>
                      )}

                      {deal.deadline && (
                        <div style={{
                          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '14px', padding: '12px 18px',
                        }}>
                          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', fontWeight: 600, margin: '0 0 4px 0' }}>📅 Deadline</p>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#a1a1aa', margin: 0 }}>
                            {new Date(deal.deadline).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    {deal.message && (
                      <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '14px', padding: '16px 18px', marginBottom: '20px',
                        borderLeft: '3px solid rgba(16,185,129,0.25)',
                      }}>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', fontWeight: 600, margin: '0 0 6px 0' }}>💬 Message</p>
                        <p style={{ fontSize: '13px', color: '#a1a1aa', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                          &ldquo;{deal.message}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', position: 'relative' }}>

                      {/* INCOMING PENDING */}
                      {!outgoing && deal.status === 'pending' && (
                        <>
                          <button
                            onClick={() => action(deal.id, 'accept')}
                            disabled={acting === deal.id}
                            onMouseEnter={() => setHoveredBtn(`accept-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={actionBtnStyle(
                              'rgba(16,185,129,0.08)', 'rgba(16,185,129,0.2)', '#34d399',
                              'rgba(16,185,129,0.15)', `accept-${deal.id}`, acting === deal.id
                            )}
                          >
                            <CheckCircle size={15} /> Accept
                          </button>

                          <button
                            onClick={() => action(deal.id, 'reject')}
                            disabled={acting === deal.id}
                            onMouseEnter={() => setHoveredBtn(`reject-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={actionBtnStyle(
                              'rgba(239,68,68,0.08)', 'rgba(239,68,68,0.2)', '#f87171',
                              'rgba(239,68,68,0.15)', `reject-${deal.id}`, acting === deal.id
                            )}
                          >
                            <XCircle size={15} /> Reject
                          </button>

                          <button
                            onClick={() => { setSelectedDeal(deal); setCounterOpen(true) }}
                            onMouseEnter={() => setHoveredBtn(`counter-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={actionBtnStyle(
                              'rgba(245,158,11,0.08)', 'rgba(245,158,11,0.2)', '#fbbf24',
                              'rgba(245,158,11,0.15)', `counter-${deal.id}`
                            )}
                          >
                            <RefreshCcw size={15} /> Counter
                          </button>
                        </>
                      )}

                      {/* OUTGOING COUNTERED */}
                      {outgoing && deal.status === 'countered' && (
                        <>
                          <button
                            onClick={() => action(deal.id, 'accept_counter')}
                            disabled={acting === deal.id}
                            onMouseEnter={() => setHoveredBtn(`ac-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={actionBtnStyle(
                              'rgba(16,185,129,0.08)', 'rgba(16,185,129,0.2)', '#34d399',
                              'rgba(16,185,129,0.15)', `ac-${deal.id}`, acting === deal.id
                            )}
                          >
                            <CheckCircle size={15} /> Accept Counter
                          </button>
                          <button
                            onClick={() => action(deal.id, 'reject_counter')}
                            disabled={acting === deal.id}
                            onMouseEnter={() => setHoveredBtn(`rc-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={actionBtnStyle(
                              'rgba(239,68,68,0.08)', 'rgba(239,68,68,0.2)', '#f87171',
                              'rgba(239,68,68,0.15)', `rc-${deal.id}`, acting === deal.id
                            )}
                          >
                            <XCircle size={15} /> Reject
                          </button>
                        </>
                      )}

                      {/* ACCEPTED */}
                      {deal.status === 'accepted' && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '11px 20px',
                          background: 'rgba(6,182,212,0.06)',
                          border: '1px solid rgba(6,182,212,0.15)',
                          borderRadius: '12px', color: '#22d3ee',
                          fontSize: '13px', fontWeight: 600,
                        }}>
                          <Clock size={15} style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                          Waiting for artist selection
                        </div>
                      )}

                      {/* ACTIVE */}
                      {deal.status === 'active' && (
                        <>
                          <button
                            onClick={() => router.push(`/deals/chat/${deal.id}`)}
                            onMouseEnter={() => setHoveredBtn(`chat-${deal.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={{
                              ...actionBtnStyle(
                                'rgba(139,92,246,0.08)', 'rgba(139,92,246,0.2)', '#a78bfa',
                                'rgba(139,92,246,0.15)', `chat-${deal.id}`
                              ),
                              background: hoveredBtn === `chat-${deal.id}`
                                ? 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(236,72,153,0.1))'
                                : 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.05))',
                            }}
                          >
                            <MessageCircle size={15} /> Open Chat
                          </button>

                          {deal.khapeetarCompleted ? (
                            <div style={{
                              display: 'inline-flex', alignItems: 'center', gap: '8px',
                              padding: '11px 20px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              borderRadius: '12px', color: '#52525b',
                              fontSize: '13px', fontWeight: 600,
                            }}>
                              <Clock size={15} style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                              Waiting for Artist
                            </div>
                          ) : (
                            <button
                              onClick={() => markComplete(deal.id)}
                              disabled={completing === deal.id}
                              onMouseEnter={() => setHoveredBtn(`comp-${deal.id}`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              style={{
                                ...actionBtnStyle(
                                  'rgba(16,185,129,0.08)', 'rgba(16,185,129,0.2)', '#34d399',
                                  'rgba(16,185,129,0.15)', `comp-${deal.id}`, completing === deal.id
                                ),
                              }}
                            >
                              {completing === deal.id ? (
                                <div style={{
                                  width: '15px', height: '15px',
                                  border: '2px solid rgba(52,211,153,0.3)',
                                  borderTopColor: '#34d399',
                                  borderRadius: '50%',
                                  animation: 'spin 0.8s linear infinite',
                                }} />
                              ) : (
                                <ShieldCheck size={15} />
                              )}
                              {completing === deal.id ? 'Completing...' : 'Complete Deal'}
                            </button>
                          )}
                        </>
                      )}

                      {/* CANCELLED */}
                      {deal.status === 'cancelled' && deal.offerGroupId && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '11px 18px',
                          background: 'rgba(113,113,122,0.06)',
                          border: '1px solid rgba(113,113,122,0.1)',
                          borderRadius: '12px', color: '#71717a',
                          fontSize: '13px', fontWeight: 600,
                        }}>
                          <XCircle size={15} /> Artist selected another khapeetar
                        </div>
                      )}

                      {/* COMPLETED */}
                      {deal.status === 'completed' && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '10px',
                          padding: '12px 18px',
                          background: 'rgba(139,92,246,0.06)',
                          border: '1px solid rgba(139,92,246,0.12)',
                          borderRadius: '12px',
                          position: 'relative', overflow: 'hidden',
                        }}>
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.03), transparent)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 4s linear infinite',
                            pointerEvents: 'none',
                          }} />
                          <ShieldCheck size={16} color="#a78bfa" style={{ position: 'relative' }} />
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa', position: 'relative' }}>
                            ✅ Deal completed
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Counter Offer Modal */}
        {counterOpen && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setCounterOpen(false) }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(12px)',
              zIndex: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
              animation: 'backdropIn 0.2s ease-out',
            }}
          >
            <div style={{
              width: '100%', maxWidth: '520px',
              background: '#0f0f14',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,158,11,0.05)',
              animation: 'modalIn 0.3s ease-out',
            }}>
              {/* Modal header */}
              <div style={{
                padding: '24px 28px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px',
                  }}>↩</div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Counter Offer</h2>
                    <p style={{ fontSize: '12px', color: '#52525b', margin: '2px 0 0 0' }}>
                      For: {selectedDeal?.projectTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCounterOpen(false)}
                  onMouseEnter={() => setHoveredBtn('modal-close')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: hoveredBtn === 'modal-close' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: hoveredBtn === 'modal-close' ? '#fff' : '#71717a',
                    fontSize: '16px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease', fontFamily: 'inherit',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal body */}
              <div style={{ padding: '24px 28px' }}>
                {/* Original budget reference */}
                {selectedDeal && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px', padding: '14px 18px', marginBottom: '20px',
                  }}>
                    <span style={{ fontSize: '13px', color: '#52525b', fontWeight: 500 }}>Original Budget</span>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#a1a1aa' }}>
                      {formatINR(selectedDeal.budget)}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '11px', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      color: focused === 'counter-amount' ? '#fbbf24' : '#52525b',
                      marginBottom: '8px', transition: 'color 0.3s ease',
                    }}>
                      Counter Amount (₹)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                        color: '#52525b', fontSize: '15px', fontWeight: 600,
                      }}>₹</span>
                      <input
                        type="number"
                        value={counterBudget}
                        onChange={(e) => setCounterBudget(e.target.value)}
                        onFocus={() => setFocused('counter-amount')}
                        onBlur={() => setFocused(null)}
                        placeholder="0"
                        style={{
                          width: '100%',
                          background: focused === 'counter-amount' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${focused === 'counter-amount' ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.07)'}`,
                          borderRadius: '14px',
                          padding: '14px 16px 14px 36px',
                          color: '#fff', fontSize: '16px', fontWeight: 700,
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          boxShadow: focused === 'counter-amount' ? '0 0 0 3px rgba(245,158,11,0.08)' : 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block', fontSize: '11px', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      color: focused === 'counter-msg' ? '#fbbf24' : '#52525b',
                      marginBottom: '8px', transition: 'color 0.3s ease',
                    }}>
                      Message <span style={{ color: '#3f3f46' }}>(optional)</span>
                    </label>
                    <textarea
                      value={counterMessage}
                      onChange={(e) => setCounterMessage(e.target.value)}
                      onFocus={() => setFocused('counter-msg')}
                      onBlur={() => setFocused(null)}
                      placeholder="Explain your counter offer..."
                      rows={4}
                      style={{
                        width: '100%',
                        background: focused === 'counter-msg' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${focused === 'counter-msg' ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.07)'}`,
                        borderRadius: '14px',
                        padding: '14px 16px',
                        color: '#fff', fontSize: '14px',
                        outline: 'none', resize: 'none',
                        transition: 'all 0.3s ease',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        boxShadow: focused === 'counter-msg' ? '0 0 0 3px rgba(245,158,11,0.08)' : 'none',
                      }}
                    />
                  </div>

                  {/* Modal actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '4px' }}>
                    <button
                      onClick={() => setCounterOpen(false)}
                      onMouseEnter={() => setHoveredBtn('modal-cancel')}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{
                        padding: '14px',
                        borderRadius: '14px',
                        background: hoveredBtn === 'modal-cancel' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${hoveredBtn === 'modal-cancel' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
                        color: hoveredBtn === 'modal-cancel' ? '#fff' : '#71717a',
                        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s ease', fontFamily: 'inherit',
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={async () => {
                        await action(selectedDeal.id, 'counter', {
                          counterBudget,
                          counterMessage,
                        })
                        setCounterOpen(false)
                        setCounterBudget('')
                        setCounterMessage('')
                      }}
                      onMouseEnter={() => setHoveredBtn('modal-send')}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{
                        position: 'relative',
                        padding: '14px',
                        borderRadius: '14px',
                        background: hoveredBtn === 'modal-send'
                          ? 'linear-gradient(135deg, #d97706, #f59e0b)'
                          : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        border: 'none',
                        color: '#000', fontSize: '14px', fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontFamily: 'inherit',
                        transform: hoveredBtn === 'modal-send' ? 'translateY(-1px)' : 'translateY(0)',
                        boxShadow: hoveredBtn === 'modal-send'
                          ? '0 6px 28px rgba(245,158,11,0.35)'
                          : '0 2px 16px rgba(245,158,11,0.2)',
                        overflow: 'hidden',
                      }}
                    >
                      {hoveredBtn === 'modal-send' && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s linear infinite',
                          pointerEvents: 'none',
                        }} />
                      )}
                      <span style={{ position: 'relative' }}>↩ Send Counter</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </KhapeetarLayout>
  )
}