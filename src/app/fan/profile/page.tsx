'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import FanLayout from '@/components/fan/FanLayout'

export default function FanProfilePage() {
  const { data: session } = useSession()
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  const profileFields = [
    {
      key: 'name',
      label: 'Full Name',
      value: session?.user?.name || '—',
      emoji: '👤',
      color: '#f472b6',
      bg: 'rgba(236,72,153,0.06)',
      border: 'rgba(236,72,153,0.12)',
    },
    {
      key: 'email',
      label: 'Email Address',
      value: session?.user?.email || '—',
      emoji: '📧',
      color: '#60a5fa',
      bg: 'rgba(59,130,246,0.06)',
      border: 'rgba(59,130,246,0.12)',
    },
    {
      key: 'role',
      label: 'Account Type',
      value: session?.user?.role || 'fan',
      emoji: '🎵',
      color: '#c084fc',
      bg: 'rgba(168,85,247,0.06)',
      border: 'rgba(168,85,247,0.12)',
      capitalize: true,
    },
  ]

  return (
    <FanLayout>
      <style jsx global>{`
        @keyframes fpFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes fpFloatOrb2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.03)}}
        @keyframes fpFloatOrb3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(20px,25px) scale(1.03)}80%{transform:translate(-15px,-10px) scale(0.97)}}
        @keyframes fpFadeInDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fpFadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fpFadeInStagger{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fpGradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fpAvatarFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-3px) rotate(2deg)}}
        @keyframes fpPulseRing{0%{transform:scale(1);opacity:0.4}100%{transform:scale(1.8);opacity:0}}
        @keyframes fpPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#06060a',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-40px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)', borderRadius: '50%', animation: 'fpFloatOrb 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '45%', left: '-100px', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)', borderRadius: '50%', animation: 'fpFloatOrb2 13s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '30%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)', borderRadius: '50%', animation: 'fpFloatOrb3 16s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        </div>

        {/* Header */}
        <div style={{
          position: 'relative', zIndex: 1,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
          backdropFilter: 'blur(20px)',
          animation: 'fpFadeInDown 0.5s ease-out',
        }}>
          <div style={{ padding: '28px 32px', maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(236,72,153,0.14), rgba(168,85,247,0.10))',
              border: '1px solid rgba(236,72,153,0.16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(236,72,153,0.08)',
              fontSize: '20px',
            }}>👤</div>
            <div>
              <h1 style={{
                fontSize: '22px', fontWeight: 800, margin: 0,
                background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Profile</h1>
              <p style={{ fontSize: '13px', color: '#52525b', margin: '2px 0 0 0', fontWeight: 500 }}>
                Your account information
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '32px 32px 48px', maxWidth: '900px', margin: '0 auto' }}>

          {/* Profile card */}
          <div style={{
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '28px', padding: '36px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(236,72,153,0.03)',
            animation: 'fpFadeInUp 0.6s ease-out 0.1s both',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent, #ec4899, #a855f7, transparent)',
              backgroundSize: '200% 100%',
              animation: 'fpGradientShift 4s ease-in-out infinite',
            }} />
            {/* Inner glow */}
            <div style={{
              position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
              width: '200px', height: '80px',
              background: 'radial-gradient(ellipse, rgba(236,72,153,0.06) 0%, transparent 70%)',
              filter: 'blur(20px)', pointerEvents: 'none',
            }} />

            {/* Avatar section */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              marginBottom: '36px', position: 'relative',
            }}>
              {/* Avatar */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                {/* Pulse ring */}
                <div style={{
                  position: 'absolute', inset: '-10px', borderRadius: '28px',
                  border: '2px solid rgba(236,72,153,0.15)',
                  animation: 'fpPulseRing 3s ease-out infinite',
                }} />
                {/* Glow */}
                <div style={{
                  position: 'absolute', inset: '-14px',
                  background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
                  borderRadius: '32px', filter: 'blur(14px)',
                }} />
                <div style={{
                  position: 'relative',
                  width: '80px', height: '80px', borderRadius: '24px',
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(236,72,153,0.3)',
                  animation: 'fpAvatarFloat 4s ease-in-out infinite',
                  fontSize: '36px',
                }}>
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : '?'}
                </div>
                {/* Online dot */}
                <div style={{
                  position: 'absolute', bottom: '-2px', right: '-2px',
                  width: '20px', height: '20px',
                  background: '#10b981', borderRadius: '50%',
                  border: '3px solid #06060a',
                  boxShadow: '0 0 10px rgba(16,185,129,0.5)',
                }} />
              </div>

              <h2 style={{
                fontSize: '24px', fontWeight: 800, margin: '0 0 4px 0',
                background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {session?.user?.name || 'Fan User'}
              </h2>
              <p style={{ fontSize: '14px', color: '#71717a', margin: '0 0 8px 0', fontWeight: 500 }}>
                {session?.user?.email || '—'}
              </p>

              {/* Role badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '5px 14px',
                background: 'rgba(236,72,153,0.08)',
                border: '1px solid rgba(236,72,153,0.15)',
                borderRadius: '20px',
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#f472b6',
                  boxShadow: '0 0 6px rgba(244,114,182,0.5)',
                  animation: 'fpPulseDot 2s ease-in-out infinite',
                }} />
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  color: '#f472b6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {session?.user?.role || 'fan'} account
                </span>
              </div>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px', margin: '0 0 28px 0',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            }} />

            {/* Profile fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {profileFields.map((field, index) => {
                const isH = hoveredStat === field.key
                return (
                  <div
                    key={field.key}
                    onMouseEnter={() => setHoveredStat(field.key)}
                    onMouseLeave={() => setHoveredStat(null)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '18px 22px',
                      background: isH
                        ? `linear-gradient(135deg, ${field.bg}, rgba(255,255,255,0.03))`
                        : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isH ? field.border : 'rgba(255,255,255,0.04)'}`,
                      borderRadius: '18px',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      transform: isH ? 'translateX(4px)' : 'translateX(0)',
                      cursor: 'default',
                      animation: `fpFadeInStagger 0.4s ease-out ${0.2 + index * 0.08}s both`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: field.bg,
                        border: `1px solid ${field.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', flexShrink: 0,
                        transition: 'transform 0.3s ease',
                        transform: isH ? 'scale(1.08)' : 'scale(1)',
                      }}>{field.emoji}</div>
                      <div>
                        <p style={{
                          fontSize: '10px', textTransform: 'uppercase',
                          letterSpacing: '0.1em', color: '#52525b',
                          fontWeight: 700, margin: '0 0 4px 0',
                        }}>{field.label}</p>
                        <p style={{
                          fontSize: '15px', fontWeight: 600,
                          color: isH ? field.color : '#d4d4d8',
                          margin: 0,
                          textTransform: field.capitalize ? 'capitalize' : 'none',
                          transition: 'color 0.3s ease',
                          textShadow: isH ? `0 0 12px ${field.bg}` : 'none',
                        }}>
                          {field.value}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <span style={{
                      color: isH ? field.color : '#27272a',
                      transition: 'all 0.3s ease',
                      transform: isH ? 'translateX(2px)' : 'translateX(0)',
                      fontSize: '16px',
                    }}>→</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Account info card */}
          <div style={{
            marginTop: '20px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px', padding: '20px 24px',
            animation: 'fpFadeInUp 0.5s ease-out 0.5s both',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px',
                }}>🛡️</div>
                <span style={{ fontSize: '13px', color: '#52525b', fontWeight: 600 }}>
                  Account verified & secured
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                {[
                  { icon: '🔒', text: 'Encrypted' },
                  { icon: '✅', text: 'Verified' },
                  { icon: '🎵', text: 'Active' },
                ].map((badge, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '11px', color: '#3f3f46', fontWeight: 500,
                  }}>
                    <span style={{ fontSize: '12px' }}>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FanLayout>
  )
}