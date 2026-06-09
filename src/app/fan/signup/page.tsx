'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Loader2, Eye, EyeOff } from 'lucide-react'

const INTERESTS = ['Hip-Hop', 'Indie', 'Bollywood', 'Electronic', 'R&B', 'Folk', 'Rock', 'Pop', 'Classical', 'Punjabi']

export default function FanSignup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    investmentInterests: [] as string[],
    city: '', country: 'India',
  })

  const u = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const toggleInterest = (i: string) => setForm(f => ({
    ...f,
    investmentInterests: f.investmentInterests.includes(i)
      ? f.investmentInterests.filter(x => x !== i)
      : [...f.investmentInterests, i],
  }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (!form.phone.trim()) { setError('Phone number is required'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'fan' }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error?.message || 'Signup failed')
      const loginRes = await signIn('credentials', {
        email: form.email, password: form.password, role: 'fan', redirect: false,
      })
      if (loginRes?.error) throw new Error(loginRes.error)
      router.push('/fan/discover')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally { setLoading(false) }
  }

  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    background: focused === fieldName ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === fieldName ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '14px', padding: '14px 16px',
    color: '#fff', fontSize: '14px', outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    fontFamily: 'inherit', boxSizing: 'border-box' as const,
    boxShadow: focused === fieldName ? '0 0 0 3px rgba(236,72,153,0.08),0 4px 16px rgba(236,72,153,0.08)' : 'none',
  })

  const labelStyle = (fieldName?: string): React.CSSProperties => ({
    display: 'block', fontSize: '11px', fontWeight: 600,
    textTransform: 'uppercase' as const, letterSpacing: '0.1em',
    color: fieldName && focused === fieldName ? '#f472b6' : '#52525b',
    marginBottom: '8px', transition: 'color 0.3s ease',
  })

  return (
    <>
      <style jsx global>{`
        @keyframes floatOrb  { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,15px) scale(0.95)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,-30px) scale(1.08)} }
        @keyframes floatOrb3 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(20px,25px) scale(1.03)} 80%{transform:translate(-15px,-10px) scale(0.97)} }
        @keyframes fadeInUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInDown{ from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes iconFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-4px) rotate(3deg)} }
        @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse-ring{ 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(1.8);opacity:0} }
        @keyframes gradient-shift{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 10%,50%,90%{transform:translateX(-4px)} 30%,70%{transform:translateX(4px)} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus {
          -webkit-box-shadow:0 0 0 30px #0a0a0f inset !important;
          -webkit-text-fill-color:#ffffff !important;
          transition:background-color 5000s ease-in-out 0s;
        }
        .signup-scroll::-webkit-scrollbar { width:5px; }
        .signup-scroll::-webkit-scrollbar-track { background:transparent; }
        .signup-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.05);border-radius:3px; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{ position:'absolute', top:'10%', left:'15%', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(236,72,153,0.06) 0%,transparent 70%)', borderRadius:'50%', animation:'floatOrb 12s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'10%', right:'10%', width:'400px', height:'400px', background:'radial-gradient(circle,rgba(168,85,247,0.05) 0%,transparent 70%)', borderRadius:'50%', animation:'floatOrb2 15s ease-in-out infinite' }} />
          <div style={{ position:'absolute', top:'50%', left:'60%', width:'300px', height:'300px', background:'radial-gradient(circle,rgba(244,114,182,0.04) 0%,transparent 70%)', borderRadius:'50%', animation:'floatOrb3 18s ease-in-out infinite' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center,transparent 40%,#06060a 100%)' }} />
        </div>

        {/* Nav */}
        <nav style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 32px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:'rgba(6,6,10,0.6)', backdropFilter:'blur(20px)', animation:'fadeInDown 0.5s ease-out' }}>
          <Link href="/" onMouseEnter={() => setHovered('logo')} onMouseLeave={() => setHovered(null)} style={{ textDecoration:'none' }}>
            <span style={{ fontSize:'15px', fontWeight:700, background:'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.01em', transition:'all 0.3s ease', filter: hovered === 'logo' ? 'brightness(1.3)' : 'brightness(1)' }}>FannyBags</span>
          </Link>
          <span style={{ fontSize:'11px', color:'#3f3f46', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', padding:'4px 12px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)', borderRadius:'8px' }}>Fan Signup</span>
        </nav>

        {/* Main */}
        <div className="signup-scroll" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', position:'relative', zIndex:1 }}>
          <div style={{ width:'100%', maxWidth:'500px', animation:'fadeInUp 0.6s ease-out' }}>

            {/* Header */}
            <div style={{ textAlign:'center', marginBottom:'32px' }}>
              <div style={{ position:'relative', display:'inline-block', marginBottom:'20px' }}>
                <div style={{ position:'absolute', inset:'-8px', borderRadius:'20px', border:'2px solid rgba(236,72,153,0.15)', animation:'pulse-ring 3s ease-out infinite' }} />
                <div style={{ position:'absolute', inset:'-12px', background:'radial-gradient(circle,rgba(236,72,153,0.2) 0%,transparent 70%)', borderRadius:'24px', filter:'blur(12px)' }} />
                <div style={{ position:'relative', width:'56px', height:'56px', borderRadius:'18px', background:'linear-gradient(135deg,#ec4899,#f43f5e)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(236,72,153,0.3)', animation:'iconFloat 4s ease-in-out infinite' }}>
                  <Users size={24} color="#fff" />
                </div>
              </div>
              <h1 style={{ fontSize:'26px', fontWeight:800, margin:'0 0 6px 0', background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.02em' }}>Create Fan Account</h1>
              <p style={{ fontSize:'14px', color:'#52525b', margin:0, fontWeight:500 }}>Back artists. Earn royalties. 🎵</p>
            </div>

            {/* Form card */}
            <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'24px', padding:'32px', backdropFilter:'blur(20px)', boxShadow:'0 20px 60px rgba(0,0,0,0.3),0 0 80px rgba(236,72,153,0.03)' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#ec4899,#a855f7,transparent)', backgroundSize:'200% 100%', animation:'gradient-shift 4s ease-in-out infinite' }} />

              <form onSubmit={submit} style={{ position:'relative' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>

                  {/* Name */}
                  <div>
                    <label style={labelStyle('name')}>Full Name <span style={{ color:'#ef4444' }}>*</span></label>
                    <input required value={form.name} onChange={e => u('name', e.target.value)} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} placeholder="Priya Singh" style={inputStyle('name')} />
                  </div>

                  {/* Phone — now required, full width */}
                  <div>
                    <label style={labelStyle('phone')}>
                      Phone <span style={{ color:'#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => u('phone', e.target.value)}
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused(null)}
                      placeholder="+91 98765 43210"
                      style={inputStyle('phone')}
                    />
                    {!form.phone.trim() && (
                      <p style={{ fontSize:11, color:'#52525b', margin:'5px 0 0 2px', fontWeight:500 }}>
                        Required — used for account verification
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle('email')}>Email <span style={{ color:'#ef4444' }}>*</span></label>
                    <input type="email" required value={form.email} onChange={e => u('email', e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} placeholder="priya@example.com" style={inputStyle('email')} />
                  </div>

                  {/* Password */}
                  <div>
                    <label style={labelStyle('password')}>
                      Password <span style={{ color:'#ef4444' }}>*</span>
                      <span style={{ color:'#3f3f46', fontWeight:500, textTransform:'none' as const, letterSpacing:'0' }}> (min 8 chars)</span>
                    </label>
                    <div style={{ position:'relative' }}>
                      {focused === 'password' && <div style={{ position:'absolute', inset:'-1px', borderRadius:'15px', background:'linear-gradient(135deg,rgba(236,72,153,0.25),rgba(168,85,247,0.15))', filter:'blur(4px)', pointerEvents:'none' }} />}
                      <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => u('password', e.target.value)} onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} placeholder="••••••••" style={{ ...inputStyle('password'), paddingRight:'48px', position:'relative' as const }} />
                      <button type="button" onClick={() => setShowPw(!showPw)} onMouseEnter={() => setHovered('eye')} onMouseLeave={() => setHovered(null)}
                        style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color: hovered === 'eye' ? '#f472b6' : '#52525b', cursor:'pointer', padding:'4px', display:'flex', alignItems:'center', justifyContent:'center', transition:'color 0.2s ease', zIndex:2 }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {form.password.length > 0 && (
                      <div style={{ marginTop:'10px' }}>
                        <div style={{ height:'3px', borderRadius:'2px', background:'rgba(255,255,255,0.04)', overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${Math.min(100,(form.password.length/8)*100)}%`, background: form.password.length >= 8 ? 'linear-gradient(90deg,#ec4899,#f472b6)' : form.password.length >= 5 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)', borderRadius:'2px', transition:'all 0.3s ease' }} />
                        </div>
                        <p style={{ fontSize:'11px', marginTop:'4px', color: form.password.length >= 8 ? '#f472b6' : '#fbbf24', fontWeight:500 }}>
                          {form.password.length >= 8 ? '✓ Strong enough' : `${8 - form.password.length} more characters needed`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* City + Country */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                    <div>
                      <label style={labelStyle('city')}>City</label>
                      <input value={form.city} onChange={e => u('city', e.target.value)} onFocus={() => setFocused('city')} onBlur={() => setFocused(null)} placeholder="Delhi" style={inputStyle('city')} />
                    </div>
                    <div>
                      <label style={labelStyle('country')}>Country</label>
                      <input value={form.country} onChange={e => u('country', e.target.value)} onFocus={() => setFocused('country')} onBlur={() => setFocused(null)} placeholder="India" style={inputStyle('country')} />
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label style={labelStyle()}>🎵 Music Interests</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'4px' }}>
                      {INTERESTS.map(i => {
                        const selected = form.investmentInterests.includes(i)
                        return (
                          <button key={i} type="button" onClick={() => toggleInterest(i)} onMouseEnter={() => setHovered(`int-${i}`)} onMouseLeave={() => setHovered(null)}
                            style={{ padding:'8px 16px', borderRadius:'20px', fontSize:'12px', fontWeight:600, border:`1px solid ${selected ? 'rgba(236,72,153,0.4)' : hovered === `int-${i}` ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`, background: selected ? 'linear-gradient(135deg,rgba(236,72,153,0.15),rgba(168,85,247,0.1))' : hovered === `int-${i}` ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', color: selected ? '#f472b6' : '#a1a1aa', cursor:'pointer', transition:'all 0.25s cubic-bezier(0.4,0,0.2,1)', fontFamily:'inherit', transform: hovered === `int-${i}` ? 'translateY(-1px)' : 'translateY(0)', boxShadow: selected ? '0 2px 12px rgba(236,72,153,0.1)' : 'none' }}>
                            {selected && '✓ '}{i}
                          </button>
                        )
                      })}
                    </div>
                    {form.investmentInterests.length > 0 && (
                      <p style={{ fontSize:'11px', color:'#f472b6', marginTop:'10px', fontWeight:600 }}>🎧 {form.investmentInterests.length} genre{form.investmentInterests.length > 1 ? 's' : ''} selected</p>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:'14px', padding:'14px 16px', animation:'shake 0.4s ease-out' }}>
                      <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'14px' }}>⚠️</div>
                      <p style={{ fontSize:'13px', color:'#f87171', margin:0, fontWeight:500 }}>{error}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button type="submit" disabled={loading} onMouseEnter={() => setHovered('submit')} onMouseLeave={() => setHovered(null)}
                    style={{ position:'relative', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'16px', background: loading ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#ec4899,#f43f5e)', border:'none', borderRadius:'14px', color: loading ? '#52525b' : '#fff', fontSize:'14px', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)', fontFamily:'inherit', letterSpacing:'0.01em', transform: !loading && hovered === 'submit' ? 'translateY(-2px)' : 'translateY(0)', boxShadow: !loading && hovered === 'submit' ? '0 8px 40px rgba(236,72,153,0.35),0 0 60px rgba(236,72,153,0.1)' : loading ? 'none' : '0 4px 20px rgba(236,72,153,0.2)', overflow:'hidden', marginTop:'4px' }}>
                    {!loading && hovered === 'submit' && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)', backgroundSize:'200% 100%', animation:'shimmer 1.5s linear infinite' }} />}
                    {loading ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} /><span style={{ position:'relative' }}>Creating Account...</span></> : <span style={{ position:'relative' }}>Create Fan Account ✓</span>}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div style={{ textAlign:'center', marginTop:'24px', animation:'fadeInUp 0.8s ease-out' }}>
              <p style={{ fontSize:'13px', color:'#3f3f46', margin:0, fontWeight:500 }}>
                Already have an account?{' '}
                <Link href="/fan/login" onMouseEnter={() => setHovered('login')} onMouseLeave={() => setHovered(null)}
                  style={{ color: hovered === 'login' ? '#f9a8d4' : '#f472b6', textDecoration:'none', fontWeight:600, borderBottom:`1px solid ${hovered === 'login' ? 'rgba(249,168,212,0.4)' : 'transparent'}`, paddingBottom:'1px', transition:'all 0.2s ease' }}>
                  Sign in
                </Link>
              </p>
            </div>

            <div style={{ display:'flex', justifyContent:'center', gap:'24px', marginTop:'28px', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.03)' }}>
              {[{ icon:'🔒', text:'Secure' }, { icon:'🎵', text:'Music First' }, { icon:'💰', text:'Earn Royalties' }].map((badge, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:'#27272a', fontWeight:500 }}>
                  <span style={{ fontSize:'12px' }}>{badge.icon}</span>
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