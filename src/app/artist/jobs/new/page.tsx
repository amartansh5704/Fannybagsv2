'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import { Loader2, ArrowLeft } from 'lucide-react'

const CATEGORIES = [
  'Mixing', 'Mastering', 'Beat Production', 'Recording',
  'Video Editing', 'Reel Editing', 'Cover Art', 'Graphic Design',
  'Marketing', 'Playlist Promotion', 'Social Media Management',
  'Content Creation', 'Other',
]

export default function PostJobPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [focused, setFocused]       = useState<string | null>(null)

  const [form, setForm] = useState({
    title:        '',
    category:     '',
    description:  '',
    budget:       '',
    budgetMax:    '',
    deadline:     '',
    requirements: '',
    budgetType:   'fixed' as 'fixed' | 'range',
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/artist/login'); return }
  }, [session, status])

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    setError('')
    if (!form.title.trim())       { setError('Job title is required'); return }
    if (!form.category)           { setError('Please select a category'); return }
    if (!form.description.trim()) { setError('Description is required'); return }
    if (!form.budget || Number(form.budget) <= 0) { setError('Valid budget is required'); return }

    setSubmitting(true)
    try {
      const res  = await fetch('/api/jobs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:        form.title.trim(),
          category:     form.category,
          description:  form.description.trim(),
          budget:       Number(form.budget),
          budgetMax:    form.budgetType === 'range' && form.budgetMax ? Number(form.budgetMax) : null,
          deadline:     form.deadline || null,
          requirements: form.requirements.trim() || null,
        }),
      })
      const json = await res.json()
      if (!json.success) { setError(json.error || 'Failed to post job'); return }
      router.push('/artist/jobs')
    } finally {
      setSubmitting(false)
    }
  }

  const inputSt = (field: string): React.CSSProperties => ({
    width: '100%', background: focused === field ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === field ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 13, padding: '13px 16px', color: '#fff', fontSize: 14, outline: 'none',
    transition: 'all .2s ease', fontFamily: 'inherit', boxSizing: 'border-box' as const,
    boxShadow: focused === field ? '0 0 0 3px rgba(124,58,237,0.08)' : 'none',
  })

  const labelSt = (field: string): React.CSSProperties => ({
    display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const,
    letterSpacing: '0.1em', color: focused === field ? '#c084fc' : '#52525b',
    marginBottom: 8, transition: 'color .2s ease',
  })

  if (status === 'loading') {
    return (
      <ArtistLayout>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <Loader2 style={{ animation:'spin 1s linear infinite', color:'#a855f7' }} size={28} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </ArtistLayout>
    )
  }

  return (
    <ArtistLayout>
      <style jsx global>{`
        @keyframes njSpin    { to{transform:rotate(360deg)} }
        @keyframes njFadeIn  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type="number"] { -moz-appearance:textfield; }
        select option { background:#0f0f14; color:#fff; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Header */}
        <div style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', padding:'20px 32px' }}>
          <div style={{ maxWidth:720, margin:'0 auto', display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={() => router.back()}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#71717a' }}
              style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#71717a', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', fontFamily:'inherit' }}>
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 style={{ fontSize:20, fontWeight:800, margin:0, background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Post a Job</h1>
              <p style={{ fontSize:12, color:'#52525b', margin:'2px 0 0 0' }}>Find the right khapeetar for your project</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ maxWidth:720, margin:'0 auto', padding:'32px 32px 60px', animation:'njFadeIn .4s ease-out' }}>

          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Title */}
            <div>
              <label style={labelSt('title')}>Job Title *</label>
              <input value={form.title} onChange={e => update('title', e.target.value)}
                onFocus={() => setFocused('title')} onBlur={() => setFocused(null)}
                placeholder="e.g. Need a Mix Engineer for my EP"
                style={inputSt('title')} />
            </div>

            {/* Category */}
            <div>
              <label style={labelSt('category')}>Category *</label>
              <select value={form.category} onChange={e => update('category', e.target.value)}
                onFocus={() => setFocused('category')} onBlur={() => setFocused(null)}
                style={{ ...inputSt('category'), cursor:'pointer', appearance:'none' as const }}>
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Description */}
            <div>
              <label style={labelSt('description')}>Description *</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)}
                onFocus={() => setFocused('description')} onBlur={() => setFocused(null)}
                rows={5} placeholder="Describe the work you need, your style, references..."
                style={{ ...inputSt('description'), resize:'none' as const, lineHeight:1.6 }} />
            </div>

            {/* Budget type toggle */}
            <div>
              <label style={{ ...labelSt('budget'), marginBottom: 12 }}>Budget *</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                {[{val:'fixed', label:'💰 Fixed Budget'}, {val:'range', label:'📊 Budget Range'}].map(opt => (
                  <button key={opt.val} onClick={() => update('budgetType', opt.val)}
                    style={{ padding:'12px 16px', borderRadius:13, cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:700, transition:'all .2s ease',
                      ...(form.budgetType === opt.val
                        ? { background:'rgba(124,58,237,0.12)', border:'1.5px solid rgba(124,58,237,0.3)', color:'#c084fc' }
                        : { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', color:'#71717a' }
                      ) }}>
                    {opt.label}
                  </button>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns: form.budgetType === 'range' ? '1fr 1fr' : '1fr', gap:12 }}>
                <div>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#3f3f46', marginBottom:6 }}>
                    {form.budgetType === 'range' ? 'Min (₹)' : 'Amount (₹)'}
                  </label>
                  <input type="number" value={form.budget} onChange={e => update('budget', e.target.value)}
                    onFocus={() => setFocused('budget')} onBlur={() => setFocused(null)}
                    placeholder="e.g. 2000" style={inputSt('budget')} />
                </div>
                {form.budgetType === 'range' && (
                  <div>
                    <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#3f3f46', marginBottom:6 }}>Max (₹)</label>
                    <input type="number" value={form.budgetMax} onChange={e => update('budgetMax', e.target.value)}
                      onFocus={() => setFocused('budgetMax')} onBlur={() => setFocused(null)}
                      placeholder="e.g. 8000" style={inputSt('budgetMax')} />
                  </div>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label style={labelSt('deadline')}>Deadline <span style={{ color:'#3f3f46', fontWeight:500, textTransform:'none', letterSpacing:0 }}>(optional)</span></label>
              <input type="date" value={form.deadline} onChange={e => update('deadline', e.target.value)}
                onFocus={() => setFocused('deadline')} onBlur={() => setFocused(null)}
                min={new Date().toISOString().split('T')[0]}
                style={{ ...inputSt('deadline'), colorScheme:'dark' as any }} />
            </div>

            {/* Additional requirements */}
            <div>
              <label style={labelSt('requirements')}>Additional Requirements <span style={{ color:'#3f3f46', fontWeight:500, textTransform:'none', letterSpacing:0 }}>(optional)</span></label>
              <textarea value={form.requirements} onChange={e => update('requirements', e.target.value)}
                onFocus={() => setFocused('requirements')} onBlur={() => setFocused(null)}
                rows={3} placeholder="Any specific tools, software, turnaround expectations..."
                style={{ ...inputSt('requirements'), resize:'none' as const, lineHeight:1.6 }} />
            </div>

            {/* Error */}
            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:12, padding:'12px 16px', fontSize:13, color:'#f87171' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <button onClick={() => router.back()}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#a1a1aa' }}
                style={{ padding:15, borderRadius:13, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#a1a1aa', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>
                Cancel
              </button>
              <button onClick={submit} disabled={submitting}
                onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(124,58,237,0.35)' } }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(124,58,237,0.2)' }}
                style={{ padding:15, borderRadius:13, background:submitting ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#7c3aed,#db2777)', border:'none', color:submitting ? '#52525b' : '#fff', fontSize:14, fontWeight:700, cursor:submitting ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 2px 12px rgba(124,58,237,0.2)' }}>
                {submitting ? <><Loader2 size={14} style={{ animation:'njSpin 1s linear infinite' }} /> Posting...</> : '🚀 Post Job'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ArtistLayout>
  )
}