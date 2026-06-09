'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, ChevronRight, ChevronLeft, Loader2, Zap, Eye, EyeOff } from 'lucide-react'

const ALL_SKILLS = [
  'Music Producer', 'Mixing Engineer', 'Mastering Engineer', 'Recording Engineer',
  'Beatmaker', 'Songwriter', 'Vocalist', 'Session Musician',
  'Videographer', 'Video Editor', 'Graphic Designer',
  'Marketing Specialist', 'Social Media Manager', 'A&R', 'PR Manager',
]

const PRIMARY_ROLES = [
  'Music Producer', 'Mix Engineer', 'Mastering Engineer',
  'Beatmaker', 'Songwriter', 'Videographer', 'Video Editor',
  'Graphic Designer', 'Marketer', 'A&R', 'Session Musician',
]

const WORK_MODES   = ['Remote', 'Onsite', 'Hybrid']
const AVAILABILITY = ['Available Now', 'Part-Time', 'Busy']

interface FormData {
  name:              string
  email:             string
  password:          string
  phone:             string
  skills:            string[]
  primaryRole:       string
  city:              string
  state:             string
  country:           string
  workMode:          string
  availability:      string
  startingBudget:    string
  experienceYears:   string
  projectsCompleted: string
  bio:               string
  instagram:         string
  youtube:           string
  spotifyCredits:    string
}

const defaultForm: FormData = {
  name: '', email: '', password: '', phone: '',
  skills: [], primaryRole: '',
  city: '', state: '', country: 'India',
  workMode: 'Remote', availability: 'Available Now',
  startingBudget: '', experienceYears: '', projectsCompleted: '',
  bio: '', instagram: '', youtube: '', spotifyCredits: '',
}

const STEPS      = ['Basic Info', 'Skills & Role', 'Location', 'Pricing & Bio']
const STEP_ICONS = ['👤', '⚡', '📍', '💰']

export default function KhapeetarSignup() {
  const router = useRouter()
  const [step, setStep]         = useState(1)
  const [form, setForm]         = useState<FormData>(defaultForm)
  const [submitting, setSubmit] = useState(false)
  const [error, setError]       = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [focused, setFocused]   = useState<string | null>(null)
  const [hovered, setHovered]   = useState<string | null>(null)

  const update = (k: keyof FormData, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }))

  const toggleSkill = (skill: string) =>
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : [...f.skills, skill],
    }))

  const canProceed = (): boolean => {
    if (step === 1)
      return !!(
        form.name.trim() &&
        form.email.trim() &&
        form.password.length >= 8 &&
        form.phone.trim()           // ← phone now required on step 1
      )
    if (step === 2) return !!(form.skills.length > 0 && form.primaryRole)
    if (step === 3) return true
    if (step === 4) return !!form.bio.trim()
    return true
  }

  const submit = async () => {
    if (!form.phone.trim()) { setError('Phone number is required'); return }
    setSubmit(true); setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role:              'khapeetar',
          name:              form.name.trim(),
          email:             form.email.trim(),
          password:          form.password,
          phone:             form.phone.trim(),
          skills:            form.skills,
          primaryRole:       form.primaryRole,
          city:              form.city    || undefined,
          state:             form.state   || undefined,
          country:           form.country,
          workMode:          form.workMode,
          availability:      form.availability,
          startingBudget:    parseFloat(form.startingBudget)  || 0,
          experienceYears:   parseInt(form.experienceYears)   || 0,
          projectsCompleted: parseInt(form.projectsCompleted) || 0,
          bio:               form.bio           || undefined,
          instagram:         form.instagram     || undefined,
          youtube:           form.youtube       || undefined,
          spotifyCredits:    form.spotifyCredits || undefined,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error?.message || 'Signup failed')

      const loginRes = await signIn('credentials', {
        email: form.email.trim(), password: form.password,
        role: 'khapeetar', redirect: false,
      })
      if (loginRes?.error) throw new Error('Account created but login failed. Please sign in manually.')
      router.push('/khapeetar/dashboard')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally { setSubmit(false) }
  }

  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    background: focused === fieldName ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === fieldName ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '14px', padding: '14px 16px',
    color: '#fff', fontSize: '14px', outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    fontFamily: 'inherit', boxSizing: 'border-box' as const,
    boxShadow: focused === fieldName ? '0 0 0 3px rgba(16,185,129,0.08),0 4px 16px rgba(16,185,129,0.08)' : 'none',
  })

  const labelStyle = (fieldName?: string): React.CSSProperties => ({
    display: 'block', fontSize: '11px', fontWeight: 600,
    textTransform: 'uppercase' as const, letterSpacing: '0.1em',
    color: fieldName && focused === fieldName ? '#34d399' : '#52525b',
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
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse-ring{ 0%{transform:scale(1);opacity:0.3} 100%{transform:scale(2);opacity:0} }
        @keyframes shake     { 0%,100%{transform:translateX(0)} 10%,50%,90%{transform:translateX(-4px)} 30%,70%{transform:translateX(4px)} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus {
          -webkit-box-shadow:0 0 0 30px #0a0a0f inset !important;
          -webkit-text-fill-color:#ffffff !important;
          transition:background-color 5000s ease-in-out 0s;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type="number"] { -moz-appearance:textfield; }
        select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:40px !important; }
        select option { background:#18181b; color:#fff; padding:8px; }
        .signup-scrollbar::-webkit-scrollbar { width:5px; }
        .signup-scrollbar::-webkit-scrollbar-track { background:transparent; }
        .signup-scrollbar::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.06); border-radius:3px; }
        textarea { font-family:inherit; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient orbs */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{ position:'absolute', top:'5%', left:'10%', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%)', borderRadius:'50%', animation:'floatOrb 12s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'5%', right:'5%', width:'400px', height:'400px', background:'radial-gradient(circle,rgba(20,184,166,0.05) 0%,transparent 70%)', borderRadius:'50%', animation:'floatOrb2 15s ease-in-out infinite' }} />
          <div style={{ position:'absolute', top:'40%', right:'20%', width:'300px', height:'300px', background:'radial-gradient(circle,rgba(52,211,153,0.04) 0%,transparent 70%)', borderRadius:'50%', animation:'floatOrb3 18s ease-in-out infinite' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center,transparent 40%,#06060a 100%)' }} />
        </div>

        {/* Nav */}
        <nav style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 32px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:'rgba(6,6,10,0.6)', backdropFilter:'blur(20px)', animation:'fadeInDown 0.5s ease-out' }}>
          <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'linear-gradient(135deg,#10b981,#14b8a6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(16,185,129,0.25)' }}>
              <Zap size={15} color="#fff" />
            </div>
            <span style={{ fontSize:'15px', fontWeight:700, background:'linear-gradient(135deg,#34d399,#14b8a6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>FannyBags</span>
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <span style={{ fontSize:'12px', color:'#3f3f46', fontWeight:500 }}>Already have an account?</span>
            <Link href="/khapeetar/login"
              onMouseEnter={() => setHovered('signin')} onMouseLeave={() => setHovered(null)}
              style={{ fontSize:'12px', fontWeight:600, color: hovered === 'signin' ? '#6ee7b7' : '#34d399', textDecoration:'none', padding:'6px 14px', borderRadius:'10px', background: hovered === 'signin' ? 'rgba(16,185,129,0.08)' : 'transparent', border:'1px solid rgba(16,185,129,0.15)', transition:'all 0.3s ease' }}>
              Sign in
            </Link>
          </div>
        </nav>

        {/* Main */}
        <div className="signup-scrollbar" style={{ flex:1, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 20px', position:'relative', zIndex:1, overflowY:'auto' }}>
          <div style={{ width:'100%', maxWidth:'640px', animation:'fadeInUp 0.6s ease-out' }}>

            {/* Progress */}
            <div style={{ marginBottom:'36px', background:'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'20px', padding:'24px 28px', backdropFilter:'blur(20px)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0', marginBottom:'20px' }}>
                {STEPS.map((label, idx) => {
                  const n = idx + 1; const done = n < step; const active = n === step
                  return (
                    <div key={label} style={{ display:'flex', alignItems:'center', flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', cursor: done ? 'pointer' : 'default' }} onClick={() => done && setStep(n)}>
                        <div style={{ position:'relative', width:'40px', height:'40px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize: done ? '14px' : '13px', fontWeight:700, background: done ? 'rgba(16,185,129,0.12)' : active ? 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(20,184,166,0.15))' : 'rgba(255,255,255,0.03)', border:`1.5px solid ${done ? 'rgba(16,185,129,0.4)' : active ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.06)'}`, color: done ? '#34d399' : active ? '#34d399' : '#52525b', transition:'all 0.3s ease', boxShadow: active ? '0 0 20px rgba(16,185,129,0.15)' : 'none' }}>
                          {active && <div style={{ position:'absolute', inset:'-3px', borderRadius:'17px', border:'1.5px solid rgba(16,185,129,0.2)', animation:'pulse-ring 3s ease-out infinite', pointerEvents:'none' }} />}
                          {done ? <Check size={16} /> : STEP_ICONS[idx]}
                        </div>
                        <span style={{ fontSize:'10px', fontWeight: active ? 600 : 500, color: active ? '#fff' : done ? '#34d399' : '#3f3f46', whiteSpace:'nowrap', transition:'color 0.3s ease', letterSpacing:'0.02em' }}>{label}</span>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div style={{ flex:1, height:'2px', margin:'0 12px', marginBottom:'24px', borderRadius:'1px', background:'rgba(255,255,255,0.04)', position:'relative', overflow:'hidden' }}>
                          <div style={{ position:'absolute', top:0, left:0, bottom:0, width: done ? '100%' : '0%', background:'linear-gradient(90deg,#10b981,#14b8a6)', borderRadius:'1px', transition:'width 0.5s cubic-bezier(0.4,0,0.2,1)', boxShadow: done ? '0 0 8px rgba(16,185,129,0.3)' : 'none' }} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div style={{ height:'3px', borderRadius:'2px', background:'rgba(255,255,255,0.04)', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${((step-1)/(STEPS.length-1))*100}%`, background:'linear-gradient(90deg,#10b981,#14b8a6,#34d399)', backgroundSize:'200% 100%', animation:'gradient-shift 3s ease-in-out infinite', borderRadius:'2px', transition:'width 0.5s cubic-bezier(0.4,0,0.2,1)', boxShadow:'0 0 12px rgba(16,185,129,0.3)' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'12px' }}>
                <span style={{ fontSize:'11px', color:'#3f3f46', fontWeight:500 }}>Step {step} of {STEPS.length}</span>
                <span style={{ fontSize:'11px', color:'#34d399', fontWeight:600 }}>{Math.round(((step-1)/(STEPS.length-1))*100)}% complete</span>
              </div>
            </div>

            {/* Form card */}
            <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'24px', padding:'32px', backdropFilter:'blur(20px)', boxShadow:'0 20px 60px rgba(0,0,0,0.3),0 0 80px rgba(16,185,129,0.02)', marginBottom:'20px' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#10b981,#14b8a6,transparent)', backgroundSize:'200% 100%', animation:'gradient-shift 4s ease-in-out infinite' }} />

              <div style={{ animation:'slideIn 0.4s ease-out' }} key={step}>

                {/* STEP 1 */}
                {step === 1 && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                    <div style={{ marginBottom:'4px' }}>
                      <h2 style={{ fontSize:'20px', fontWeight:800, margin:'0 0 4px 0', background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Basic Information</h2>
                      <p style={{ fontSize:'13px', color:'#52525b', margin:0, fontWeight:500 }}>Let artists know who you are</p>
                    </div>

                    <div>
                      <label style={labelStyle('name')}>Full Name <span style={{ color:'#ef4444' }}>*</span></label>
                      <input value={form.name} onChange={e => update('name', e.target.value)} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} placeholder="Aman Verma" style={inputStyle('name')} />
                    </div>

                    <div>
                      <label style={labelStyle('email')}>Email <span style={{ color:'#ef4444' }}>*</span></label>
                      <input type="email" value={form.email} onChange={e => update('email', e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} placeholder="aman@example.com" style={inputStyle('email')} />
                    </div>

                    <div>
                      <label style={labelStyle('password')}>
                        Password <span style={{ color:'#ef4444' }}>*</span>
                        <span style={{ color:'#3f3f46', fontWeight:500, textTransform:'none' as const, letterSpacing:'0' }}> (min 8 chars)</span>
                      </label>
                      <div style={{ position:'relative' }}>
                        {focused === 'password' && <div style={{ position:'absolute', inset:'-1px', borderRadius:'15px', background:'linear-gradient(135deg,rgba(16,185,129,0.25),rgba(20,184,166,0.15))', filter:'blur(4px)', pointerEvents:'none' }} />}
                        <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} placeholder="••••••••" style={{ ...inputStyle('password'), paddingRight:'48px', position:'relative' as const }} />
                        <button type="button" onClick={() => setShowPw(p => !p)} onMouseEnter={() => setHovered('eye')} onMouseLeave={() => setHovered(null)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color: hovered === 'eye' ? '#34d399' : '#52525b', cursor:'pointer', padding:'4px', display:'flex', alignItems:'center', justifyContent:'center', transition:'color 0.2s ease', zIndex:2 }}>
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {form.password.length > 0 && (
                        <div style={{ marginTop:'10px' }}>
                          <div style={{ height:'3px', borderRadius:'2px', background:'rgba(255,255,255,0.04)', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${Math.min(100,(form.password.length/8)*100)}%`, background: form.password.length >= 8 ? 'linear-gradient(90deg,#10b981,#34d399)' : form.password.length >= 5 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)', borderRadius:'2px', transition:'all 0.3s ease' }} />
                          </div>
                          <p style={{ fontSize:'11px', marginTop:'4px', color: form.password.length >= 8 ? '#34d399' : '#fbbf24', fontWeight:500 }}>
                            {form.password.length >= 8 ? '✓ Strong enough' : `${8 - form.password.length} more characters needed`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Phone — now required */}
                    <div>
                      <label style={labelStyle('phone')}>
                        Phone <span style={{ color:'#ef4444' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => update('phone', e.target.value)}
                        onFocus={() => setFocused('phone')}
                        onBlur={() => setFocused(null)}
                        placeholder="+91 98765 43210"
                        style={inputStyle('phone')}
                      />
                      {!form.phone.trim() && (
                        <p style={{ fontSize:11, color:'#52525b', margin:'5px 0 0 2px', fontWeight:500 }}>
                          Required — used for artist verification
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
                    <div style={{ marginBottom:'4px' }}>
                      <h2 style={{ fontSize:'20px', fontWeight:800, margin:'0 0 4px 0', background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Skills & Role</h2>
                      <p style={{ fontSize:'13px', color:'#52525b', margin:0, fontWeight:500 }}>Select everything you can do</p>
                    </div>

                    <div>
                      <label style={labelStyle()}>
                        Skills <span style={{ color:'#ef4444' }}>*</span>
                        <span style={{ color:'#3f3f46', fontWeight:500, textTransform:'none' as const, letterSpacing:'0' }}> (select all that apply)</span>
                      </label>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'4px' }}>
                        {ALL_SKILLS.map(skill => {
                          const selected = form.skills.includes(skill)
                          return (
                            <button key={skill} type="button" onClick={() => toggleSkill(skill)} onMouseEnter={() => setHovered(`skill-${skill}`)} onMouseLeave={() => setHovered(null)}
                              style={{ padding:'8px 16px', borderRadius:'12px', fontSize:'12px', fontWeight:600, border:`1px solid ${selected ? 'rgba(16,185,129,0.4)' : hovered === `skill-${skill}` ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`, background: selected ? 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(20,184,166,0.1))' : hovered === `skill-${skill}` ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', color: selected ? '#34d399' : '#a1a1aa', cursor:'pointer', transition:'all 0.25s ease', fontFamily:'inherit', transform: hovered === `skill-${skill}` ? 'translateY(-1px)' : 'translateY(0)', boxShadow: selected ? '0 2px 12px rgba(16,185,129,0.1)' : 'none' }}>
                              {selected && '✓ '}{skill}
                            </button>
                          )
                        })}
                      </div>
                      {form.skills.length > 0 && <p style={{ fontSize:'11px', color:'#34d399', marginTop:'10px', fontWeight:600 }}>⚡ {form.skills.length} skill{form.skills.length > 1 ? 's' : ''} selected</p>}
                    </div>

                    <div>
                      <label style={labelStyle('primaryRole')}>Primary Role <span style={{ color:'#ef4444' }}>*</span></label>
                      <select value={form.primaryRole} onChange={e => update('primaryRole', e.target.value)} onFocus={() => setFocused('primaryRole')} onBlur={() => setFocused(null)} style={{ ...inputStyle('primaryRole'), cursor:'pointer' }}>
                        <option value="">Select your main role</option>
                        {PRIMARY_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                    <div style={{ marginBottom:'4px' }}>
                      <h2 style={{ fontSize:'20px', fontWeight:800, margin:'0 0 4px 0', background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Location & Availability</h2>
                      <p style={{ fontSize:'13px', color:'#52525b', margin:0, fontWeight:500 }}>Where are you based?</p>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                      <div>
                        <label style={labelStyle('city')}>City</label>
                        <input value={form.city} onChange={e => update('city', e.target.value)} onFocus={() => setFocused('city')} onBlur={() => setFocused(null)} placeholder="Mumbai" style={inputStyle('city')} />
                      </div>
                      <div>
                        <label style={labelStyle('state')}>State</label>
                        <input value={form.state} onChange={e => update('state', e.target.value)} onFocus={() => setFocused('state')} onBlur={() => setFocused(null)} placeholder="Maharashtra" style={inputStyle('state')} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle()}>Work Mode</label>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
                        {WORK_MODES.map(mode => {
                          const sel = form.workMode === mode
                          return (
                            <button key={mode} type="button" onClick={() => update('workMode', mode)} onMouseEnter={() => setHovered(`wm-${mode}`)} onMouseLeave={() => setHovered(null)}
                              style={{ padding:'14px', borderRadius:'14px', fontSize:'13px', fontWeight:600, border:`1.5px solid ${sel ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)'}`, background: sel ? 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(20,184,166,0.08))' : hovered === `wm-${mode}` ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)', color: sel ? '#34d399' : '#71717a', cursor:'pointer', transition:'all 0.3s ease', fontFamily:'inherit', boxShadow: sel ? '0 2px 16px rgba(16,185,129,0.1)' : 'none', transform: hovered === `wm-${mode}` ? 'translateY(-1px)' : 'translateY(0)' }}>
                              {mode === 'Remote' && '🏠 '}{mode === 'Onsite' && '🏢 '}{mode === 'Hybrid' && '🔄 '}{mode}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle()}>Availability</label>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
                        {AVAILABILITY.map(a => {
                          const sel = form.availability === a
                          return (
                            <button key={a} type="button" onClick={() => update('availability', a)} onMouseEnter={() => setHovered(`av-${a}`)} onMouseLeave={() => setHovered(null)}
                              style={{ padding:'14px', borderRadius:'14px', fontSize:'12px', fontWeight:600, border:`1.5px solid ${sel ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)'}`, background: sel ? 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(20,184,166,0.08))' : hovered === `av-${a}` ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)', color: sel ? '#34d399' : '#71717a', cursor:'pointer', transition:'all 0.3s ease', fontFamily:'inherit', boxShadow: sel ? '0 2px 16px rgba(16,185,129,0.1)' : 'none', transform: hovered === `av-${a}` ? 'translateY(-1px)' : 'translateY(0)' }}>
                              {a === 'Available Now' && '🟢 '}{a === 'Part-Time' && '🟡 '}{a === 'Busy' && '🔴 '}{a}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                    <div style={{ marginBottom:'4px' }}>
                      <h2 style={{ fontSize:'20px', fontWeight:800, margin:'0 0 4px 0', background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Pricing & Bio</h2>
                      <p style={{ fontSize:'13px', color:'#52525b', margin:0, fontWeight:500 }}>Tell artists what you offer</p>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
                      <div>
                        <label style={labelStyle('budget')}>Starting Budget (₹)</label>
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#52525b', fontSize:'14px', fontWeight:600 }}>₹</span>
                          <input type="number" value={form.startingBudget} onChange={e => update('startingBudget', e.target.value)} onFocus={() => setFocused('budget')} onBlur={() => setFocused(null)} placeholder="1500" style={{ ...inputStyle('budget'), paddingLeft:'32px' }} />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle('exp')}>Years of Exp</label>
                        <input type="number" value={form.experienceYears} onChange={e => update('experienceYears', e.target.value)} onFocus={() => setFocused('exp')} onBlur={() => setFocused(null)} placeholder="3" style={inputStyle('exp')} />
                      </div>
                      <div>
                        <label style={labelStyle('projects')}>Projects Done</label>
                        <input type="number" value={form.projectsCompleted} onChange={e => update('projectsCompleted', e.target.value)} onFocus={() => setFocused('projects')} onBlur={() => setFocused(null)} placeholder="25" style={inputStyle('projects')} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle('bio')}>Bio / Portfolio Description <span style={{ color:'#ef4444' }}>*</span></label>
                      <textarea value={form.bio} onChange={e => update('bio', e.target.value)} onFocus={() => setFocused('bio')} onBlur={() => setFocused(null)} rows={4} placeholder="Tell artists about yourself, your style, notable work, equipment..." style={{ ...inputStyle('bio'), resize:'none' as const }} />
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'6px' }}>
                        <div style={{ height:'2px', flex:1, marginRight:'12px', borderRadius:'1px', background:'rgba(255,255,255,0.04)', overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${Math.min(100,(form.bio.length/200)*100)}%`, background:'linear-gradient(90deg,#10b981,#14b8a6)', borderRadius:'1px', transition:'width 0.3s ease' }} />
                        </div>
                        <span style={{ fontSize:'11px', color:'#3f3f46', fontWeight:500, flexShrink:0 }}>{form.bio.length} chars</span>
                      </div>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                      <div>
                        <label style={labelStyle('insta')}>Instagram <span style={{ color:'#3f3f46' }}>(optional)</span></label>
                        <input value={form.instagram} onChange={e => update('instagram', e.target.value)} onFocus={() => setFocused('insta')} onBlur={() => setFocused(null)} placeholder="@yourhandle" style={inputStyle('insta')} />
                      </div>
                      <div>
                        <label style={labelStyle('yt')}>YouTube <span style={{ color:'#3f3f46' }}>(optional)</span></label>
                        <input value={form.youtube} onChange={e => update('youtube', e.target.value)} onFocus={() => setFocused('yt')} onBlur={() => setFocused(null)} placeholder="youtube.com/yourchannel" style={inputStyle('yt')} />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle('spotify')}>Spotify Credits <span style={{ color:'#3f3f46' }}>(optional)</span></label>
                      <input value={form.spotifyCredits} onChange={e => update('spotifyCredits', e.target.value)} onFocus={() => setFocused('spotify')} onBlur={() => setFocused(null)} placeholder="Songs you've worked on..." style={inputStyle('spotify')} />
                    </div>

                    {error && (
                      <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:'14px', padding:'14px 16px', animation:'shake 0.4s ease-out' }}>
                        <span style={{ fontSize:'16px' }}>⚠️</span>
                        <p style={{ fontSize:'13px', color:'#f87171', margin:0, fontWeight:500 }}>{error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <button type="button" onClick={() => setStep(s => s-1)} disabled={step === 1}
                onMouseEnter={() => step > 1 && setHovered('back')} onMouseLeave={() => setHovered(null)}
                style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 22px', background: hovered === 'back' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border:`1px solid ${hovered === 'back' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`, borderRadius:'14px', color: step === 1 ? '#27272a' : hovered === 'back' ? '#fff' : '#71717a', fontSize:'13px', fontWeight:600, cursor: step === 1 ? 'not-allowed' : 'pointer', transition:'all 0.3s ease', fontFamily:'inherit', opacity: step === 1 ? 0.3 : 1, transform: hovered === 'back' ? 'translateX(-2px)' : 'translateX(0)' }}>
                <ChevronLeft size={16} /> Back
              </button>

              <span style={{ fontSize:'11px', color:'#3f3f46', fontWeight:500, padding:'6px 14px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)', borderRadius:'8px' }}>
                Step {step} of {STEPS.length}
              </span>

              {step < STEPS.length ? (
                <button type="button" onClick={() => setStep(s => s+1)} disabled={!canProceed()}
                  onMouseEnter={() => canProceed() && setHovered('next')} onMouseLeave={() => setHovered(null)}
                  style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 22px', background: !canProceed() ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg,#10b981,#14b8a6)', border:'none', borderRadius:'14px', color: !canProceed() ? '#3f3f46' : '#fff', fontSize:'13px', fontWeight:700, cursor: !canProceed() ? 'not-allowed' : 'pointer', transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)', fontFamily:'inherit', opacity: !canProceed() ? 0.3 : 1, transform: hovered === 'next' ? 'translateX(2px)' : 'translateX(0)', boxShadow: hovered === 'next' && canProceed() ? '0 6px 30px rgba(16,185,129,0.3)' : canProceed() ? '0 2px 16px rgba(16,185,129,0.15)' : 'none', overflow:'hidden', position:'relative' as const }}>
                  {hovered === 'next' && canProceed() && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)', backgroundSize:'200% 100%', animation:'shimmer 1.5s linear infinite' }} />}
                  <span style={{ position:'relative' }}>Continue</span>
                  <ChevronRight size={16} style={{ position:'relative' }} />
                </button>
              ) : (
                <button type="button" onClick={submit} disabled={!canProceed() || submitting}
                  onMouseEnter={() => canProceed() && !submitting && setHovered('submit')} onMouseLeave={() => setHovered(null)}
                  style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 26px', background: (!canProceed()||submitting) ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg,#10b981,#14b8a6)', border:'none', borderRadius:'14px', color: (!canProceed()||submitting) ? '#3f3f46' : '#fff', fontSize:'13px', fontWeight:700, cursor: (!canProceed()||submitting) ? 'not-allowed' : 'pointer', transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)', fontFamily:'inherit', opacity: (!canProceed()||submitting) ? 0.4 : 1, transform: hovered === 'submit' ? 'translateY(-2px)' : 'translateY(0)', boxShadow: hovered === 'submit' ? '0 8px 40px rgba(16,185,129,0.35)' : '0 2px 16px rgba(16,185,129,0.15)', overflow:'hidden', position:'relative' as const }}>
                  {hovered === 'submit' && !submitting && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)', backgroundSize:'200% 100%', animation:'shimmer 1.5s linear infinite' }} />}
                  {submitting ? <><Loader2 size={15} style={{ animation:'spin 1s linear infinite', position:'relative' }} /><span style={{ position:'relative' }}>Creating Account...</span></> : <span style={{ position:'relative' }}>✓ Create Account</span>}
                </button>
              )}
            </div>

            <div style={{ textAlign:'center' }}>
              <p style={{ fontSize:'13px', color:'#3f3f46', margin:0, fontWeight:500 }}>
                Already have an account?{' '}
                <Link href="/khapeetar/login" onMouseEnter={() => setHovered('login-link')} onMouseLeave={() => setHovered(null)}
                  style={{ color: hovered === 'login-link' ? '#6ee7b7' : '#34d399', textDecoration:'none', fontWeight:600, borderBottom:`1px solid ${hovered === 'login-link' ? 'rgba(110,231,183,0.4)' : 'transparent'}`, paddingBottom:'1px', transition:'all 0.2s ease' }}>
                  Sign in here
                </Link>
              </p>
            </div>

            <div style={{ display:'flex', justifyContent:'center', gap:'24px', marginTop:'28px', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.03)' }}>
              {[{ icon:'🔒', text:'Secure Signup' }, { icon:'⚡', text:'Instant Setup' }, { icon:'🛡️', text:'Verified Platform' }].map((badge, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', color:'#27272a', fontWeight:500 }}>
                  <span style={{ fontSize:'13px' }}>{badge.icon}</span>
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