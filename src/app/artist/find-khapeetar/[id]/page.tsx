'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ArtistLayout from '@/components/artist/ArtistLayout'
import {
  Loader2,
  MapPin,
  Wallet,
  User,
  Briefcase,
} from 'lucide-react'

export default function KhapeetarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const requestDialogRef = useRef<HTMLDialogElement>(null)
  const depositDialogRef = useRef<HTMLDialogElement>(null)

  const id = params.id as string

  const [profile, setProfile] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [depositing, setDepositing] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')

  const [form, setForm] = useState({
    projectTitle: '',
    workType: '',
    description: '',
    budget: '',
    deadline: '',
    message: '',
    competingOffer: false,
    offerGroupId: '',
  })

  const loadWallet = async () => {
    const res = await fetch('/api/wallet')
    const json = await res.json()

    if (json.success) {
      setWallet(json.data.wallet)
    }
  }

  const loadProfile = async () => {
    const res = await fetch(`/api/khapeetar/${id}`)
    const json = await res.json()

    if (json.success) {
      setProfile(json.data)
    }
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/artist/login')
      return
    }

    Promise.all([loadProfile(), loadWallet()]).finally(() =>
      setLoading(false)
    )
  }, [status, session])

  const deposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      alert('Enter valid amount')
      return
    }

    setDepositing(true)

    const res = await fetch('/api/wallet/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Number(depositAmount),
      }),
    })

    const json = await res.json()

    if (json.success) {
      setDepositAmount('')
      depositDialogRef.current?.close()
      await loadWallet()
    } else {
      alert(json.error || 'Deposit failed')
    }

    setDepositing(false)
  }

  const sendRequest = async () => {
    if (
      !form.projectTitle ||
      !form.workType ||
      !form.description ||
      !form.budget
    ) {
      alert('Please fill all required fields')
      return
    }

    setSending(true)

    const finalOfferGroupId = form.competingOffer
      ? form.offerGroupId || crypto.randomUUID()
      : null

    const res = await fetch('/api/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        khapeetarId: id,
        projectTitle: form.projectTitle,
        workType: form.workType,
        description: form.description,
        budget: Number(form.budget),
        deadline: form.deadline || null,
        message: form.message || null,
        offerGroupId: finalOfferGroupId,
      }),
    })

    const json = await res.json()

    if (json.success) {
      alert('Work request sent')
      requestDialogRef.current?.close()

      setForm({
        projectTitle: '',
        workType: '',
        description: '',
        budget: '',
        deadline: '',
        message: '',
        competingOffer: false,
        offerGroupId: '',
      })

      await loadWallet()
    } else {
      alert(json.error || 'Failed')
    }

    setSending(false)
  }

  if (loading) {
    return (
      <ArtistLayout>
        <style jsx global>{`
          @keyframes floatOrb {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
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
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
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
          }}>Loading profile...</p>
        </div>
      </ArtistLayout>
    )
  }

  const budget = Number(form.budget || 0)
  const walletBalance = wallet?.balance || 0
  const insufficient = budget > walletBalance
  const shortfall = Math.max(0, budget - walletBalance)

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
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.3); }
          50% { box-shadow: 0 0 40px rgba(139,92,246,0.5); }
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

        dialog::backdrop {
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(12px);
        }

        dialog {
          border: none;
          padding: 0;
          background: transparent;
        }

        dialog[open] {
          animation: fadeInUp 0.3s ease-out;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }

        .kd-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .kd-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .kd-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 3px;
        }
        .kd-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.15);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#06060a',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient background orbs */}
        <div style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}>
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-60px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb 8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '-120px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb2 10s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            right: '25%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb 12s ease-in-out infinite',
          }} />
          {/* Grid pattern overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Main content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: '32px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
          animation: 'fadeInUp 0.5s ease-out',
        }}>
          {/* Back button */}
          <button
            onClick={() => router.back()}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.transform = 'translateX(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = '#a1a1aa'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
            style={{
              marginBottom: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              color: '#a1a1aa',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              fontFamily: 'inherit',
            }}
          >
            ← Back
          </button>

          {/* Grid layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '28px',
          }}>
            {/* Use media query logic via max-width approach — we'll use CSS grid with minmax */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
              gap: '28px',
            }}>
              {/* Left column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', gridColumn: 'span 1' }}>
                {/* Profile card */}
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '36px',
                  backdropFilter: 'blur(20px)',
                }}>
                  {/* Top gradient accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6)',
                    backgroundSize: '200% 100%',
                    animation: 'gradient-shift 4s ease-in-out infinite',
                  }} />
                  {/* Glow behind accent */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '20%',
                    right: '20%',
                    height: '20px',
                    background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(236,72,153,0.3), transparent)',
                    filter: 'blur(15px)',
                  }} />

                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '24px',
                    flexWrap: 'wrap',
                  }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        inset: '-4px',
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.5), rgba(236,72,153,0.5))',
                        borderRadius: '20px',
                        filter: 'blur(12px)',
                        opacity: 0.6,
                      }} />
                      <div style={{
                        position: 'relative',
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(139,92,246,0.3)',
                      }}>
                        <User size={30} color="#fff" />
                      </div>
                      {/* Online dot */}
                      <div style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '20px',
                        height: '20px',
                        background: '#10b981',
                        borderRadius: '50%',
                        border: '3px solid #06060a',
                        boxShadow: '0 0 10px rgba(16,185,129,0.5)',
                      }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <h1 style={{
                          fontSize: '28px',
                          fontWeight: 800,
                          background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          lineHeight: 1.2,
                        }}>
                          {profile?.name || 'Khapeetar'}
                        </h1>
                        <span style={{
                          padding: '4px 12px',
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          background: 'rgba(16,185,129,0.1)',
                          color: '#34d399',
                          border: '1px solid rgba(16,185,129,0.2)',
                          borderRadius: '20px',
                        }}>
                          ● Available
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '14px',
                        flexWrap: 'wrap',
                      }}>
                        {profile?.primaryRole && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            background: 'rgba(139,92,246,0.08)',
                            border: '1px solid rgba(139,92,246,0.15)',
                            borderRadius: '10px',
                            color: '#c4b5fd',
                            fontSize: '13px',
                            fontWeight: 500,
                          }}>
                            <Briefcase size={13} color="#a78bfa" />
                            {profile.primaryRole}
                          </div>
                        )}

                        {profile?.city && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            background: 'rgba(236,72,153,0.08)',
                            border: '1px solid rgba(236,72,153,0.15)',
                            borderRadius: '10px',
                            color: '#f9a8d4',
                            fontSize: '13px',
                            fontWeight: 500,
                          }}>
                            <MapPin size={13} color="#f472b6" />
                            {profile.city}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div style={{
                        display: 'flex',
                        gap: '32px',
                        marginTop: '24px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        {[
                          { value: '—', label: 'Projects' },
                          { value: '—', label: 'Rating' },
                          { value: '—', label: 'Response' },
                        ].map((s, i) => (
                          <div key={i} style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{s.value}</p>
                            <p style={{
                              fontSize: '10px',
                              color: '#52525b',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              marginTop: '2px',
                              fontWeight: 600,
                            }}>{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* About card */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '32px',
                  backdropFilter: 'blur(20px)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(59,130,246,0.1)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Briefcase size={15} color="#60a5fa" />
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>About</h2>
                  </div>
                  <p style={{
                    color: '#a1a1aa',
                    lineHeight: 1.7,
                    fontSize: '15px',
                  }}>
                    {profile?.bio || 'No bio available for this khapeetar yet.'}
                  </p>
                </div>

                {/* Trust indicators */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { icon: '🛡️', title: 'Verified', sub: 'Identity confirmed', color: 'rgba(16,185,129,' },
                    { icon: '⚡', title: 'Fast Reply', sub: 'Usually within hours', color: 'rgba(245,158,11,' },
                    { icon: '✨', title: 'Top Rated', sub: 'Highly recommended', color: 'rgba(139,92,246,' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '16px',
                      padding: '20px 16px',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)'
                      e.currentTarget.style.borderColor = `${item.color}0.3)`
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{item.title}</p>
                      <p style={{ fontSize: '11px', color: '#52525b', marginTop: '2px' }}>{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column - sidebar */}
              <div>
                <div style={{ position: 'sticky', top: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Wallet card */}
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '28px',
                    backdropFilter: 'blur(20px)',
                  }}>
                    {/* Subtle inner glow */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      width: '120px',
                      height: '120px',
                      background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
                      borderRadius: '50%',
                    }} />

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginBottom: '28px',
                      position: 'relative',
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(16,185,129,0.1)',
                      }}>
                        <Wallet size={20} color="#34d399" />
                      </div>
                      <div>
                        <p style={{
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          color: '#52525b',
                          fontWeight: 600,
                        }}>Wallet Balance</p>
                        <p style={{
                          fontSize: '28px',
                          fontWeight: 800,
                          color: '#34d399',
                          lineHeight: 1.2,
                          textShadow: '0 0 20px rgba(52,211,153,0.3)',
                        }}>
                          ₹{walletBalance.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Deposit button */}
                    <button
                      onClick={() => depositDialogRef.current?.showModal()}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'
                        e.currentTarget.style.color = '#93c5fd'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                        e.currentTarget.style.color = '#a1a1aa'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#a1a1aa',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                        marginBottom: '12px',
                        fontFamily: 'inherit',
                      }}
                    >
                      + Add Funds
                    </button>

                    {/* Send request button */}
                    <button
                      onClick={() => requestDialogRef.current?.showModal()}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 40px rgba(139,92,246,0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,92,246,0.25)'
                      }}
                      style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                        boxShadow: '0 4px 24px rgba(139,92,246,0.25)',
                        fontFamily: 'inherit',
                        letterSpacing: '0.01em',
                      }}
                    >
                      🚀 Send Work Request
                    </button>
                  </div>

                  {/* Info tip */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(139,92,246,0.03) 100%)',
                    border: '1px solid rgba(59,130,246,0.1)',
                    borderRadius: '14px',
                    padding: '16px',
                  }}>
                    <p style={{
                      fontSize: '12px',
                      color: '#71717a',
                      lineHeight: 1.6,
                    }}>
                      💡 Your budget will be held securely in escrow until the work is completed or the request expires.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REQUEST MODAL */}
        <dialog
          ref={requestDialogRef}
          style={{
            width: '680px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(139,92,246,0.1)',
          }}
        >
          <div style={{
            background: '#0f0f14',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.15))',
                  border: '1px solid rgba(139,92,246,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}>
                  🚀
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Send Work Request</h2>
                  <p style={{ fontSize: '12px', color: '#52525b', margin: '2px 0 0 0' }}>Fill in the project details below</p>
                </div>
              </div>
              <button
                onClick={() => requestDialogRef.current?.close()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = '#71717a'
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#71717a',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="kd-scrollbar" style={{
              padding: '24px 28px',
              overflowY: 'auto',
              maxHeight: 'calc(90vh - 80px)',
            }}>
              {/* Wallet balance bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.12)',
                borderRadius: '14px',
                padding: '14px 18px',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                  <Wallet size={16} />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Wallet Balance</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#34d399' }}>
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Input helper function for consistent styling */}
                {[
                  { label: 'Project Title', placeholder: 'e.g. Album Cover Design', key: 'projectTitle', type: 'input' },
                  { label: 'Work Type', placeholder: 'e.g. Design, Music Production', key: 'workType', type: 'input' },
                  { label: 'Description', placeholder: 'Describe the work you need in detail...', key: 'description', type: 'textarea' },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#71717a',
                      marginBottom: '8px',
                    }}>
                      {field.label} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        placeholder={field.placeholder}
                        rows={3}
                        value={(form as any)[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '14px',
                          padding: '14px 16px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          resize: 'none',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      />
                    ) : (
                      <input
                        placeholder={field.placeholder}
                        value={(form as any)[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '14px',
                          padding: '14px 16px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      />
                    )}
                  </div>
                ))}

                {/* Budget */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#71717a',
                    marginBottom: '8px',
                  }}>
                    Budget (₹) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 700,
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Competing offer */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '18px',
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      border: form.competingOffer ? '2px solid #8b5cf6' : '2px solid #3f3f46',
                      background: form.competingOffer ? '#8b5cf6' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}>
                      {form.competingOffer && (
                        <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>✓</span>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={form.competingOffer}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          competingOffer: e.target.checked,
                          offerGroupId:
                            e.target.checked && !form.offerGroupId
                              ? crypto.randomUUID()
                              : form.offerGroupId,
                        })
                      }
                      style={{ display: 'none' }}
                    />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0 }}>
                        ⚔️ Competing Offer
                      </p>
                      <p style={{ fontSize: '12px', color: '#52525b', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                        Enable if you&apos;re sending the same project to multiple khapeetars. Only one will be accepted.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Insufficient warning */}
                {insufficient && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: '14px',
                    padding: '16px 18px',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(239,68,68,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '16px',
                    }}>
                      ⚠️
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#f87171', margin: 0 }}>Insufficient Balance</p>
                      <p style={{ fontSize: '12px', color: 'rgba(248,113,113,0.6)', margin: '2px 0 0 0' }}>
                        Add ₹{shortfall.toLocaleString('en-IN')} more to proceed
                      </p>
                    </div>
                  </div>
                )}

                {/* Deadline */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#71717a',
                    marginBottom: '8px',
                  }}>
                    Deadline <span style={{ color: '#3f3f46' }}>(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit',
                      colorScheme: 'dark',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#71717a',
                    marginBottom: '8px',
                  }}>
                    Message <span style={{ color: '#3f3f46' }}>(optional)</span>
                  </label>
                  <textarea
                    placeholder="Any additional notes..."
                    rows={2}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      resize: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Action buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  paddingTop: '8px',
                }}>
                  <button
                    onClick={() => depositDialogRef.current?.showModal()}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'
                      e.currentTarget.style.color = '#93c5fd'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.color = '#a1a1aa'
                    }}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#a1a1aa',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    + Add Funds
                  </button>

                  <button
                    onClick={sendRequest}
                    disabled={sending || insufficient}
                    onMouseEnter={(e) => {
                      if (!sending && !insufficient) {
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow = '0 6px 30px rgba(139,92,246,0.4)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 16px rgba(139,92,246,0.2)'
                    }}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      background: (sending || insufficient) ? '#27272a' : 'linear-gradient(135deg, #7c3aed, #db2777)',
                      border: 'none',
                      color: (sending || insufficient) ? '#52525b' : '#fff',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: (sending || insufficient) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit',
                      boxShadow: (sending || insufficient) ? 'none' : '0 2px 16px rgba(139,92,246,0.2)',
                    }}
                  >
                    {sending ? '⏳ Sending...' : '🚀 Send Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </dialog>

        {/* DEPOSIT MODAL */}
        <dialog
          ref={depositDialogRef}
          style={{
            width: '460px',
            maxWidth: '95vw',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.1)',
          }}
        >
          <div style={{
            background: '#0f0f14',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}>
                  💰
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Add Funds</h2>
                  <p style={{ fontSize: '12px', color: '#52525b', margin: '2px 0 0 0' }}>Deposit money to your wallet</p>
                </div>
              </div>
              <button
                onClick={() => depositDialogRef.current?.close()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = '#71717a'
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#71717a',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '28px' }}>
              {/* Current balance */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '14px 18px',
                marginBottom: '24px',
              }}>
                <span style={{ fontSize: '13px', color: '#52525b', fontWeight: 500 }}>Current Balance</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#34d399' }}>
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Amount input */}
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#71717a',
                marginBottom: '8px',
              }}>
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: 800,
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  marginBottom: '16px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />

              {/* Quick amounts */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '24px',
              }}>
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDepositAmount(String(amt))}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.color = '#71717a'
                    }}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#71717a',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}>
                <button
                  onClick={() => depositDialogRef.current?.close()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = '#a1a1aa'
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#a1a1aa',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={deposit}
                  disabled={depositing}
                  onMouseEnter={(e) => {
                    if (!depositing) {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 6px 30px rgba(59,130,246,0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 16px rgba(59,130,246,0.2)'
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: depositing ? '#27272a' : 'linear-gradient(135deg, #2563eb, #0891b2)',
                    border: 'none',
                    color: depositing ? '#52525b' : '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: depositing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                    boxShadow: depositing ? 'none' : '0 2px 16px rgba(59,130,246,0.2)',
                  }}
                >
                  {depositing ? '⏳ Processing...' : '💰 Deposit'}
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </ArtistLayout>
  )
}