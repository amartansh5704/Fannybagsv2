'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music, Loader2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const GENRES = ['Hip-Hop / Rap', 'Indie Pop', 'R&B / Soul', 'Electronic', 'Folk / Acoustic', 'Bollywood Pop', 'Punjabi', 'Classical Fusion', 'Rock', 'Other']

export default function ArtistSignup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [showPw, setShowPw]   = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    stageName: '', genre: '', bio: '',
    city: '', country: 'India',
    instagram: '', spotify: '', youtube: '',
  })

  const u = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const canSubmit = !!(form.name && form.email && form.password && form.password.length >= 8)

  const submit = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'artist' }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error?.message || 'Signup failed')

      const loginRes = await signIn('credentials', {
        email:    form.email,
        password: form.password,
        role:     'artist',
        redirect: false,
      })
      if (loginRes?.error) throw new Error(loginRes.error)

      router.push('/artist/raise-funds')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .as-root { min-height: 100vh; background: #09090f; color: #f0f0f8; font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; }

        /* NAV */
        .as-nav { height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 0.5px solid rgba(255,255,255,0.06); background: rgba(9,9,15,0.95); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 10; }
        .as-nav-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; }
        .as-logo-icon { width: 28px; height: 28px; border-radius: 7px; background: linear-gradient(135deg,#7c3aed,#db2777); display: flex; align-items: center; justify-content: center; }
        .as-logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; letter-spacing: 1.5px; color: #fff; text-transform: uppercase; }
        .as-nav-tag { font-size: 11px; color: #2a2a3a; letter-spacing: 0.5px; }

        /* PAGE */
        .as-page { flex: 1; padding: 44px 40px 60px; max-width: 1060px; margin: 0 auto; width: 100%; }
        .as-page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.5px; margin-bottom: 4px; }
        .as-page-sub { font-size: 13px; color: #444; margin-bottom: 32px; }

        /* TWO CARDS SIDE BY SIDE */
        .as-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }

        /* CARD */
        .as-card { background: #0d0d18; border: 0.5px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 26px; }
        .as-card-title { font-family: 'Syne', sans-serif; font-size: 13.5px; font-weight: 700; color: #fff; margin-bottom: 20px; letter-spacing: -0.2px; display: flex; align-items: center; gap: 8px; }
        .as-card-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg,#7c3aed,#db2777); flex-shrink: 0; }

        /* FIELDS */
        .as-field { margin-bottom: 14px; }
        .as-field:last-of-type { margin-bottom: 0; }
        .as-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #333; margin-bottom: 7px; display: block; font-weight: 500; }
        .as-input { width: 100%; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #e0e0f0; outline: none; transition: all 0.2s; font-family: inherit; }
        .as-input::placeholder { color: #252535; }
        .as-input:focus { border-color: rgba(124,58,237,0.5); background: rgba(124,58,237,0.04); box-shadow: 0 0 0 3px rgba(124,58,237,0.06); }
        .as-pw-wrap { position: relative; }
        .as-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #333; cursor: pointer; background: none; border: none; padding: 0; transition: color 0.15s; }
        .as-eye:hover { color: #777; }
        .as-select { width: 100%; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #e0e0f0; outline: none; transition: all 0.2s; font-family: inherit; appearance: none; cursor: pointer; }
        .as-select:focus { border-color: rgba(124,58,237,0.5); background: rgba(124,58,237,0.04); }
        .as-select option { background: #111120; color: #e0e0f0; }
        .as-textarea { width: 100%; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; font-size: 13px; color: #e0e0f0; outline: none; transition: all 0.2s; font-family: inherit; resize: none; }
        .as-textarea:focus { border-color: rgba(124,58,237,0.5); background: rgba(124,58,237,0.04); }
        .as-textarea::placeholder { color: #252535; }
        .as-social-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }

        /* ERROR */
        .as-error { background: rgba(239,68,68,0.08); border: 0.5px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 11px 14px; font-size: 12.5px; color: #f87171; margin-top: 16px; }

        /* SUBMIT ROW — spans full width below both cards */
        .as-submit-row { margin-top: 20px; display: flex; flex-direction: column; align-items: stretch; gap: 14px; }
        .as-btn-primary { width: 100%; padding: 14px 24px; background: linear-gradient(135deg,#7c3aed,#db2777); border: none; border-radius: 11px; font-size: 14px; font-weight: 600; color: #fff; cursor: pointer; font-family: inherit; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; letter-spacing: 0.2px; }
        .as-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(124,58,237,0.3); }
        .as-btn-primary:disabled { opacity: 0.28; cursor: not-allowed; transform: none; box-shadow: none; }
        .as-signin-link { text-align: center; font-size: 12px; color: #333; }
        .as-signin-link a { color: #9f7aea; text-decoration: none; transition: color 0.2s; }
        .as-signin-link a:hover { color: #c084fc; }

        /* required star */
        .as-req { color: #7c3aed; margin-left: 2px; }

        @media (max-width: 720px) {
          .as-grid { grid-template-columns: 1fr; }
          .as-page { padding: 28px 20px 48px; }
          .as-nav { padding: 0 20px; }
          .as-social-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="as-root">

        {/* NAV */}
        <nav className="as-nav">
          <Link href="/" className="as-nav-logo">
            <div className="as-logo-icon"><Music size={14} color="#fff" /></div>
            <span className="as-logo-text">FannyBags</span>
          </Link>
          <span className="as-nav-tag">Artist Signup</span>
        </nav>

        {/* PAGE */}
        <div className="as-page">
          <div className="as-page-title">Create Artist Account</div>
          <p className="as-page-sub">Fund your music. Keep control. Fill in both sections below.</p>

          {/* TWO CARDS PARALLEL */}
          <div className="as-grid">

            {/* CARD 1 — Basic Info */}
            <div className="as-card">
              <div className="as-card-title">
                <span className="as-card-dot"></span>
                Basic Info
              </div>

              <div className="as-field">
                <label className="as-label">Full Name <span className="as-req">*</span></label>
                <input className="as-input" value={form.name} onChange={e => u('name', e.target.value)} placeholder="Rahul Sharma" />
              </div>
              <div className="as-field">
                <label className="as-label">Email <span className="as-req">*</span></label>
                <input className="as-input" type="email" value={form.email} onChange={e => u('email', e.target.value)} placeholder="rahul@example.com" />
              </div>
              <div className="as-field">
                <label className="as-label">Password <span className="as-req">*</span> <span style={{color:'#222',fontStyle:'italic',letterSpacing:0}}>min 8 chars</span></label>
                <div className="as-pw-wrap">
                  <input
                    className="as-input"
                    style={{ paddingRight: '42px' }}
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => u('password', e.target.value)}
                    placeholder="••••••••"
                  />
                  <button type="button" className="as-eye" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="as-field">
                <label className="as-label">Phone</label>
                <input className="as-input" type="tel" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>

            {/* CARD 2 — Artist Profile */}
            <div className="as-card">
              <div className="as-card-title">
                <span className="as-card-dot"></span>
                Artist Profile
              </div>

              <div className="as-field">
                <label className="as-label">Stage / Artist Name</label>
                <input className="as-input" value={form.stageName} onChange={e => u('stageName', e.target.value)} placeholder="Your artist name" />
              </div>
              <div className="as-field">
                <label className="as-label">Primary Genre</label>
                <select className="as-select" value={form.genre} onChange={e => u('genre', e.target.value)}>
                  <option value="">Select genre</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="as-field">
                <label className="as-label">City</label>
                <input className="as-input" value={form.city} onChange={e => u('city', e.target.value)} placeholder="Mumbai" />
              </div>
              <div className="as-field">
                <label className="as-label">Bio</label>
                <textarea className="as-textarea" value={form.bio} onChange={e => u('bio', e.target.value)} rows={3} placeholder="Tell fans about yourself..." />
              </div>
              <div className="as-field">
                <label className="as-label">Social Links</label>
                <div className="as-social-grid">
                  <input className="as-input" value={form.instagram} onChange={e => u('instagram', e.target.value)} placeholder="Instagram" />
                  <input className="as-input" value={form.spotify} onChange={e => u('spotify', e.target.value)} placeholder="Spotify" />
                  <input className="as-input" value={form.youtube} onChange={e => u('youtube', e.target.value)} placeholder="YouTube" />
                </div>
              </div>
            </div>

          </div>

          {/* ERROR + SUBMIT — full width below both cards */}
          {error && <div className="as-error">{error}</div>}

          <div className="as-submit-row">
            <button
              className="as-btn-primary"
              onClick={submit}
              disabled={loading || !canSubmit}
            >
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Creating account...</>
                : 'Create Artist Account ✓'
              }
            </button>
            <p className="as-signin-link">
              Already have an account?{' '}
              <Link href="/artist/login">Sign in</Link>
            </p>
          </div>

        </div>
      </div>
    </>
  )
}