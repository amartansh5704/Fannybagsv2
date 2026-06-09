'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import { Loader2, ArrowLeft, Clock, Users, Send } from 'lucide-react'

export default function KhapeetarJobDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const id     = params.id as string

  const [job, setJob]           = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [error, setError]           = useState('')
  const [focused, setFocused]       = useState<string | null>(null)

  const [form, setForm] = useState({
    message:      '',
    bidAmount:    '',
    deliveryDays: '',
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/khapeetar/login'); return }

    fetch(`/api/jobs/${id}`)
      .then(r => r.json())
      .then(j => { if (j.success) setJob(j.data) })
      .finally(() => setLoading(false))
  }, [session, status])

  const submitProposal = async () => {
    setError('')
    if (!form.message.trim())     { setError('Please write a message'); return }
    if (!form.bidAmount || Number(form.bidAmount) <= 0) { setError('Enter a valid bid amount'); return }
    if (!form.deliveryDays || Number(form.deliveryDays) <= 0) { setError('Enter valid delivery days'); return }

    setSubmitting(true)
    try {
      const res  = await fetch(`/api/jobs/${id}/proposals`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:      form.message.trim(),
          bidAmount:    Number(form.bidAmount),
          deliveryDays: Number(form.deliveryDays),
        }),
      })
      const json = await res.json()
      if (!json.success) { setError(json.error || 'Failed to submit'); return }
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const inputSt = (field: string): React.CSSProperties => ({
    width:'100%', background: focused === field ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
    border:`1px solid ${focused === field ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius:13, padding:'13px 16px', color:'#fff', fontSize:14, outline:'none',
    transition:'all .2s ease', fontFamily:'inherit', boxSizing:'border-box' as const,
    boxShadow: focused === field ? '0 0 0 3px rgba(16,185,129,0.08)' : 'none',
  })

  if (status === 'loading' || loading) {
    return (
      <KhapeetarLayout>
        <style>{`@keyframes kjdSpin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <Loader2 style={{ animation:'kjdSpin 1s linear infinite', color:'#10b981', width:32, height:32 }} />
        </div>
      </KhapeetarLayout>
    )
  }

  if (!job) {
    return (
      <KhapeetarLayout>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <p style={{ color:'#52525b' }}>Job not found</p>
        </div>
      </KhapeetarLayout>
    )
  }

  const alreadyApplied = job.proposals?.some((p: any) => p.khapeetarId === session?.user?.id)

  return (
    <KhapeetarLayout>
      <style jsx global>{`
        @keyframes kjdSpin   { to{transform:rotate(360deg)} }
        @keyframes kjdFadeIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type="number"] { -moz-appearance:textfield; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Header */}
        <div style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', padding:'20px 32px' }}>
          <div style={{ maxWidth:900, margin:'0 auto', display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={() => router.back()}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#71717a' }}
              style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#71717a', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', fontFamily:'inherit' }}>
              <ArrowLeft size={16} />
            </button>
            <div style={{ flex:1, minWidth:0 }}>
              <h1 style={{ fontSize:18, fontWeight:800, margin:0, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.title}</h1>
              <p style={{ fontSize:12, color:'#52525b', margin:'2px 0 0 0' }}>{job.category} · by {job.artist?.name}</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:900, margin:'0 auto', padding:'28px 32px 60px', display:'grid', gridTemplateColumns:'1fr 380px', gap:24, alignItems:'start', animation:'kjdFadeIn .4s ease-out' }}>

          {/* Left — Job details */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[
                { label:'Budget', value:`₹${Number(job.budget).toLocaleString('en-IN')}${job.budgetMax ? `–₹${Number(job.budgetMax).toLocaleString('en-IN')}` : ''}`, color:'#34d399' },
                { label:'Proposals', value:`${job.proposals?.length ?? 0}`, color:'#60a5fa' },
                { label:'Deadline', value: job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short' }) : 'Flexible', color:'#fbbf24' },
              ].map(item => (
                <div key={item.label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'16px' }}>
                  <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 6px 0' }}>{item.label}</p>
                  <p style={{ fontSize:16, fontWeight:800, color:item.color, margin:0 }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:'22px' }}>
              <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 10px 0' }}>Description</p>
              <p style={{ fontSize:14, color:'#a1a1aa', margin:0, lineHeight:1.8, whiteSpace:'pre-wrap' }}>{job.description}</p>
            </div>

            {job.requirements && (
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:'22px' }}>
                <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 10px 0' }}>Additional Requirements</p>
                <p style={{ fontSize:14, color:'#a1a1aa', margin:0, lineHeight:1.8, whiteSpace:'pre-wrap' }}>{job.requirements}</p>
              </div>
            )}
          </div>

          {/* Right — Proposal form */}
          <div style={{ position:'sticky', top:24 }}>
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'24px', overflow:'hidden', position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#10b981,#14b8a6,transparent)' }} />

              {submitted || alreadyApplied ? (
                <div style={{ textAlign:'center', padding:'30px 0' }}>
                  <div style={{ fontSize:48, marginBottom:14 }}>✅</div>
                  <h3 style={{ fontSize:17, fontWeight:700, color:'#34d399', margin:'0 0 8px 0' }}>
                    {submitted ? 'Proposal Submitted!' : 'Already Applied'}
                  </h3>
                  <p style={{ fontSize:13, color:'#52525b', margin:0, lineHeight:1.6 }}>
                    {submitted ? 'The artist will review your proposal and get back to you.' : 'You have already submitted a proposal for this job.'}
                  </p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'#fff', margin:'0 0 20px 0' }}>Submit a Proposal</h3>

                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

                    <div>
                      <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color: focused === 'message' ? '#34d399' : '#52525b', marginBottom:8, transition:'color .2s' }}>
                        Your Message *
                      </label>
                      <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                        onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                        rows={4} placeholder="Why are you the best fit for this job?"
                        style={{ ...inputSt('message'), resize:'none' as const, lineHeight:1.6 }} />
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      <div>
                        <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color: focused === 'bid' ? '#34d399' : '#52525b', marginBottom:8, transition:'color .2s' }}>
                          Bid (₹) *
                        </label>
                        <input type="number" value={form.bidAmount} onChange={e => setForm(f => ({...f, bidAmount: e.target.value}))}
                          onFocus={() => setFocused('bid')} onBlur={() => setFocused(null)}
                          placeholder={`${Number(job.budget).toLocaleString('en-IN')}`}
                          style={inputSt('bid')} />
                      </div>
                      <div>
                        <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color: focused === 'days' ? '#34d399' : '#52525b', marginBottom:8, transition:'color .2s' }}>
                          Days *
                        </label>
                        <input type="number" value={form.deliveryDays} onChange={e => setForm(f => ({...f, deliveryDays: e.target.value}))}
                          onFocus={() => setFocused('days')} onBlur={() => setFocused(null)}
                          placeholder="7"
                          style={inputSt('days')} />
                      </div>
                    </div>

                    {error && (
                      <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:12, padding:'11px 14px', fontSize:13, color:'#f87171' }}>
                        ⚠️ {error}
                      </div>
                    )}

                    <button onClick={submitProposal} disabled={submitting}
                      onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(16,185,129,0.3)' } }}
                      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                      style={{ padding:15, borderRadius:13, background:submitting ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#10b981,#059669)', border:'none', color:submitting ? '#52525b' : '#fff', fontSize:14, fontWeight:700, cursor:submitting ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                      {submitting ? <><Loader2 size={14} style={{ animation:'kjdSpin 1s linear infinite' }} /> Submitting...</> : <><Send size={14} /> Submit Proposal</>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </KhapeetarLayout>
  )
}