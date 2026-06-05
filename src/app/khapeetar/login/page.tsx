'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Loader2, Eye, EyeOff } from 'lucide-react'

export default function KhapeetarLogin() {
  const router = useRouter()
  const [email, setEmail]   = useState('')
  const [password, setPass] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await signIn('credentials', { email, password, role: 'khapeetar', redirect: false })
    setLoading(false)
    if (res?.error) {
      setError(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error)
    } else {
      router.push('/khapeetar/dashboard')
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, -30px) scale(1.08); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(20px, 25px) scale(1.03); }
          80% { transform: translate(-15px, -10px) scale(0.97); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(3deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-4px); }
          30%, 70% { transform: translateX(4px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px #0a0a0f inset !important;
          -webkit-text-fill-color: #ffffff !important;
          border-color: rgba(255,255,255,0.08) !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#06060a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
            top: '10%',
            left: '15%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb 12s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb2 15s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '60%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'floatOrb3 18s ease-in-out infinite',
          }} />
          {/* Grid pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
          {/* Radial vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, #06060a 100%)',
          }} />
        </div>

        {/* Navigation */}
        <nav style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(6,6,10,0.6)',
          backdropFilter: 'blur(20px)',
          animation: 'fadeInDown 0.6s ease-out',
        }}>
          <Link
            href="/"
            style={{ textDecoration: 'none' }}
            onMouseEnter={() => setHovered('logo')}
            onMouseLeave={() => setHovered(null)}
          >
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #34d399, #14b8a6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.01em',
              transition: 'all 0.3s ease',
              filter: hovered === 'logo' ? 'brightness(1.3)' : 'brightness(1)',
            }}>
              FannyBags
            </span>
          </Link>
          <span style={{
            fontSize: '11px',
            color: '#3f3f46',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '8px',
          }}>
            Khapeetar Login
          </span>
        </nav>

        {/* Main content */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            animation: 'fadeInUp 0.7s ease-out',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              {/* Icon with glow */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
                {/* Pulse ring */}
                <div style={{
                  position: 'absolute',
                  inset: '-8px',
                  borderRadius: '20px',
                  border: '2px solid rgba(16,185,129,0.15)',
                  animation: 'pulse-ring 3s ease-out infinite',
                }} />
                {/* Glow */}
                <div style={{
                  position: 'absolute',
                  inset: '-12px',
                  background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
                  borderRadius: '24px',
                  filter: 'blur(12px)',
                }} />
                <div style={{
                  position: 'relative',
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(16,185,129,0.3)',
                  animation: 'iconFloat 4s ease-in-out infinite',
                }}>
                  <Zap size={24} color="#fff" />
                </div>
              </div>

              <h1 style={{
                fontSize: '26px',
                fontWeight: 800,
                margin: '0 0 6px 0',
                background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}>
                Welcome Back
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#52525b',
                margin: 0,
                fontWeight: 500,
              }}>
                Sign in to manage your work and earnings
              </p>
            </div>

            {/* Form card */}
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '24px',
              padding: '32px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 80px rgba(16,185,129,0.03)',
            }}>
              {/* Top accent gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #10b981, #14b8a6, transparent)',
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }} />
              {/* Inner glow */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '80px',
                background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }} />

              <form onSubmit={submit} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Email field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: focused === 'email' ? '#34d399' : '#52525b',
                      marginBottom: '8px',
                      transition: 'color 0.3s ease',
                    }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      {/* Input glow on focus */}
                      {focused === 'email' && (
                        <div style={{
                          position: 'absolute',
                          inset: '-1px',
                          borderRadius: '15px',
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(20,184,166,0.2))',
                          filter: 'blur(4px)',
                          pointerEvents: 'none',
                        }} />
                      )}
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        placeholder="you@example.com"
                        style={{
                          position: 'relative',
                          width: '100%',
                          background: focused === 'email'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${focused === 'email'
                            ? 'rgba(16,185,129,0.5)'
                            : 'rgba(255,255,255,0.07)'}`,
                          borderRadius: '14px',
                          padding: '14px 16px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          boxShadow: focused === 'email'
                            ? '0 0 0 3px rgba(16,185,129,0.08), 0 4px 16px rgba(16,185,129,0.1)'
                            : 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: focused === 'password' ? '#34d399' : '#52525b',
                      marginBottom: '8px',
                      transition: 'color 0.3s ease',
                    }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      {focused === 'password' && (
                        <div style={{
                          position: 'absolute',
                          inset: '-1px',
                          borderRadius: '15px',
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(20,184,166,0.2))',
                          filter: 'blur(4px)',
                          pointerEvents: 'none',
                        }} />
                      )}
                      <input
                        type={showPw ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPass(e.target.value)}
                        onFocus={() => setFocused('password')}
                        onBlur={() => setFocused(null)}
                        placeholder="••••••••"
                        style={{
                          position: 'relative',
                          width: '100%',
                          background: focused === 'password'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${focused === 'password'
                            ? 'rgba(16,185,129,0.5)'
                            : 'rgba(255,255,255,0.07)'}`,
                          borderRadius: '14px',
                          padding: '14px 48px 14px 16px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          boxShadow: focused === 'password'
                            ? '0 0 0 3px rgba(16,185,129,0.08), 0 4px 16px rgba(16,185,129,0.1)'
                            : 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        onMouseEnter={() => setHovered('eye')}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: hovered === 'eye' ? '#34d399' : '#52525b',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.2s ease',
                          zIndex: 2,
                        }}
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(239,68,68,0.06)',
                      border: '1px solid rgba(239,68,68,0.15)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      animation: 'shake 0.4s ease-out, fadeInUp 0.3s ease-out',
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'rgba(239,68,68,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '14px',
                      }}>
                        ⚠️
                      </div>
                      <p style={{
                        fontSize: '13px',
                        color: '#f87171',
                        margin: 0,
                        fontWeight: 500,
                      }}>
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
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
                      background: loading
                        ? 'rgba(255,255,255,0.05)'
                        : 'linear-gradient(135deg, #10b981, #14b8a6)',
                      border: 'none',
                      borderRadius: '14px',
                      color: loading ? '#52525b' : '#fff',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      fontFamily: 'inherit',
                      letterSpacing: '0.01em',
                      transform: !loading && hovered === 'submit' ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: !loading && hovered === 'submit'
                        ? '0 8px 40px rgba(16,185,129,0.35), 0 0 60px rgba(16,185,129,0.1)'
                        : loading
                          ? 'none'
                          : '0 4px 20px rgba(16,185,129,0.2)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Button shimmer effect */}
                    {!loading && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                        backgroundSize: '200% 100%',
                        animation: hovered === 'submit' ? 'shimmer 1.5s linear infinite' : 'none',
                      }} />
                    )}
                    {loading ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span style={{ position: 'relative' }}>Sign In</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer link */}
            <div style={{
              textAlign: 'center',
              marginTop: '24px',
              animation: 'fadeInUp 0.8s ease-out',
            }}>
              <p style={{
                fontSize: '13px',
                color: '#3f3f46',
                margin: 0,
                fontWeight: 500,
              }}>
                Don&apos;t have an account?{' '}
                <Link
                  href="/khapeetar/signup"
                  onMouseEnter={() => setHovered('signup')}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    color: hovered === 'signup' ? '#6ee7b7' : '#34d399',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    borderBottom: `1px solid ${hovered === 'signup' ? 'rgba(110,231,183,0.4)' : 'transparent'}`,
                    paddingBottom: '1px',
                  }}
                >
                  Sign up as Khapeetar
                </Link>
              </p>
            </div>

            {/* Trust badges */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '32px',
              animation: 'fadeInUp 0.9s ease-out',
            }}>
              {[
                { icon: '🔒', text: 'Secure' },
                { icon: '⚡', text: 'Fast' },
                { icon: '🛡️', text: 'Trusted' },
              ].map((badge, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  color: '#3f3f46',
                  fontWeight: 500,
                }}>
                  <span style={{ fontSize: '12px' }}>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}