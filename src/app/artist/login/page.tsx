'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music, Loader2, Eye, EyeOff } from 'lucide-react'

export default function ArtistLogin() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      role: 'artist',
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError(
        res.error === 'CredentialsSignin'
          ? 'Invalid email or password'
          : res.error
      )
    } else {
      router.push('/artist/raise-funds')
    }
  }

  return (
    <>
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #050505;
          color: white;
          overflow: hidden;
          position: relative;
          font-family: Inter, sans-serif;
        }

        .bgGlow1 {
          position: absolute;
          width: 400px;
          height: 400px;
          background: rgba(217, 70, 239, 0.15);
          filter: blur(120px);
          top: -100px;
          left: -100px;
          border-radius: 999px;
        }

        .bgGlow2 {
          position: absolute;
          width: 400px;
          height: 400px;
          background: rgba(139, 92, 246, 0.15);
          filter: blur(120px);
          bottom: -100px;
          right: -100px;
          border-radius: 999px;
        }

        .nav {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 48px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: white;
        }

        .logo {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          background: linear-gradient(135deg,#ec4899,#8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 40px rgba(217,70,239,0.35);
        }

        .brandTitle {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .brandSub {
          color: #71717a;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .main {
          position: relative;
          z-index: 10;
          min-height: calc(100vh - 100px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }

        .card {
          width: 100%;
          max-width: 1200px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(30px);
          border-radius: 36px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          box-shadow: 0 0 80px rgba(168,85,247,0.08);
        }

        .left {
          padding: 60px;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .badge {
          display: inline-flex;
          padding: 10px 18px;
          border-radius: 999px;
          background: rgba(217,70,239,0.1);
          border: 1px solid rgba(217,70,239,0.2);
          color: #f0abfc;
          font-size: 12px;
          margin-bottom: 30px;
        }

        .headline {
          font-size: 72px;
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.05em;
        }

        .desc {
          margin-top: 28px;
          color: #a1a1aa;
          font-size: 18px;
          line-height: 1.7;
          max-width: 500px;
        }

        .right {
          padding: 70px 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .formWrap {
          width: 100%;
          max-width: 420px;
        }

        .welcome {
          font-size: 54px;
          font-weight: 700;
          letter-spacing: -0.04em;
          margin-bottom: 14px;
        }

        .sub {
          color: #a1a1aa;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .field {
          margin-bottom: 20px;
        }

        .label {
          display: block;
          margin-bottom: 10px;
          color: #71717a;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .inputWrap {
          position: relative;
        }

        .input {
          width: 100%;
          height: 58px;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 0 20px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .input:focus {
          border-color: rgba(217,70,239,0.45);
          box-shadow: 0 0 0 4px rgba(217,70,239,0.12);
        }

        .passwordInput {
          padding-right: 58px;
        }

        .toggle {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #71717a;
          cursor: pointer;
        }

        .submit {
          width: 100%;
          height: 58px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(135deg,#ec4899,#8b5cf6);
          color: white;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 0 40px rgba(217,70,239,0.25);
        }

        .submit:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }

        .error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5;
          padding: 14px 16px;
          border-radius: 16px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .footer {
          margin-top: 28px;
          text-align: center;
          color: #71717a;
          font-size: 14px;
        }

        .footer a {
          color: #e879f9;
          text-decoration: none;
          font-weight: 600;
        }

        @media (max-width: 980px) {
          .card {
            grid-template-columns: 1fr;
          }

          .left {
            display: none;
          }

          .right {
            padding: 50px 28px;
          }

          .welcome {
            font-size: 42px;
          }

          .nav {
            padding: 20px 24px;
          }
        }
      `}</style>

      <div className="page">
        <div className="bgGlow1" />
        <div className="bgGlow2" />

        <nav className="nav">
          <Link href="/" className="brand">
            <div className="logo">
              <Music size={24} />
            </div>

            <div>
              <div className="brandTitle">FANNYBAGS</div>
              <div className="brandSub">Artist Platform</div>
            </div>
          </Link>
        </nav>

        <div className="main">
          <div className="card">
            <div className="left">
              <div>
                <div className="badge">Music Funding Infrastructure</div>

                <div className="headline">
                  Build Your
                  <br />
                  Music Empire.
                </div>

                <div className="desc">
                  Access fan-powered funding, artist analytics,
                  campaign management and advanced music monetization tools.
                </div>
              </div>
            </div>

            <div className="right">
              <div className="formWrap">
                <div className="welcome">Welcome Back</div>

                <div className="sub">
                  Sign in to continue managing your artist profile and campaigns.
                </div>

                <form onSubmit={submit}>
                  {error && <div className="error">{error}</div>}

                  <div className="field">
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="artist@example.com"
                      className="input"
                    />
                  </div>

                  <div className="field">
                    <label className="label">Password</label>

                    <div className="inputWrap">
                      <input
                        type={showPw ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input passwordInput"
                      />

                      <button
                        type="button"
                        className="toggle"
                        onClick={() => setShowPw(!showPw)}
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="submit"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In to Dashboard'
                    )}
                  </button>
                </form>

                <div className="footer">
                  Don&apos;t have an account?{' '}
                  <Link href="/artist/signup">
                    Create Artist Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
