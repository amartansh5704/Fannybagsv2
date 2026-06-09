'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import { Loader2, ArrowLeft, Users, CheckCircle, XCircle } from 'lucide-react'

const PROPOSAL_STATUS: Record<string, { color: string; bg: string; border: string; label: string }> = {
  pending:  { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  label: 'Pending' },
  accepted: { color: '#34d399', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  label: 'Accepted' },
  rejected: { color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   label: 'Rejected' },
}

export default function ArtistJobDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const id     = params.id as string

  const [job, setJob]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing]   = useState<string | null>(null)

  const load = async () => {
    const res  = await fetch(`/api/jobs/${id}`)
    const json = await res.json()
    if (json.success) setJob(json.data)
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/artist/login'); return }
    load()
  }, [session, status])

  const acceptProposal = async (proposalId: string) => {
    setActing(proposalId)
    try {
      const res  = await fetch(`/api/jobs/${id}/accept`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId }),
      })
      const json = await res.json()
      if (!json.success) { alert(json.error || 'Failed to accept'); return }
      await load()
    } finally {
      setActing(null)
    }
  }

  const rejectProposal = async (proposalId: string) => {
    setActing(proposalId)
    await fetch(`/api/jobs/${id}/proposals`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId, status: 'rejected' }),
    })
    await load()
    setActing(null)
  }

  const markComplete = async () => {
    const res  = await fetch(`/api/jobs/${id}/complete`, { method: 'POST' })
    const json = await res.json()
    if (json.success) { alert(json.message); await load() }
    else alert(json.error)
  }

  if (status === 'loading' || loading) {
    return (
      <ArtistLayout>
        <style>{`@keyframes ajSpin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <Loader2 style={{ animation:'ajSpin 1s linear infinite', color:'#a855f7', width:32, height:32 }} />
        </div>
      </ArtistLayout>
    )
  }

  if (!job) {
    return (
      <ArtistLayout>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <p style={{ color:'#52525b' }}>Job not found</p>
        </div>
      </ArtistLayout>
    )
  }

  return (
    <ArtistLayout>
      <style jsx global>{`
        @keyframes ajSpin   { to{transform:rotate(360deg)} }
        @keyframes ajFadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Header */}
        <div style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', padding:'20px 32px' }}>
          <div style={{ maxWidth:1000, margin:'0 auto', display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={() => router.back()}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#71717a' }}
              style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#71717a', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', fontFamily:'inherit' }}>
              <ArrowLeft size={16} />
            </button>
            <div style={{ flex:1, minWidth:0 }}>
              <h1 style={{ fontSize:18, fontWeight:800, margin:0, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.title}</h1>
              <p style={{ fontSize:12, color:'#52525b', margin:'2px 0 0 0' }}>{job.category} · Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
            </div>
            <div style={{ padding:'5px 14px', borderRadius:999, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', fontSize:12, fontWeight:700, color:'#34d399', flexShrink:0 }}>
              {job.status.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1000, margin:'0 auto', padding:'28px 32px 60px', display:'flex', flexDirection:'column', gap:24, animation:'ajFadeIn .4s ease-out' }}>

          {/* Chat + Complete section — shown when job is assigned */}
          {job.status === 'assigned' && (
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', padding:'18px 22px', background:'rgba(16,185,129,0.04)', border:'1px solid rgba(16,185,129,0.12)', borderRadius:18 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:700, color:'#34d399', margin:'0 0 2px 0' }}>
                  🔒 Escrow Active — ₹{Number(job.escrowAmount || job.budget).toLocaleString('en-IN')} held by admin
                </p>
                <p style={{ fontSize:12, color:'#52525b', margin:0 }}>
                  Chat with khapeetar and mark complete when work is done
                </p>
              </div>
              <div style={{ display:'flex', gap:10, flexShrink:0, alignItems:'center' }}>
                <button onClick={() => router.push(`/artist/jobs/${id}/chat`)}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(139,92,246,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 20px', background:'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(236,72,153,0.08))', border:'1px solid rgba(139,92,246,0.2)', borderRadius:12, color:'#c084fc', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all .3s ease' }}>
                  💬 Open Chat
                </button>

                {!job.artistCompleted ? (
                  <button onClick={markComplete}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(16,185,129,0.3)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                    style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 20px', background:'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(20,184,166,0.08))', border:'1px solid rgba(16,185,129,0.2)', borderRadius:12, color:'#34d399', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all .3s ease' }}>
                    ✅ Mark Complete
                  </button>
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, color:'#52525b', fontSize:13, fontWeight:600 }}>
                    ⏳ Waiting for khapeetar to confirm
                  </div>
                )}
              </div>
            </div>
          )}

          {job.status === 'completed' && (
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'16px 22px', background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.15)', borderRadius:18, flexWrap:'wrap' }}>
              <span style={{ fontSize:18 }}>✅</span>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:700, color:'#a78bfa', margin:'0 0 2px 0' }}>Deal Completed</p>
                <p style={{ fontSize:12, color:'#52525b', margin:0 }}>Admin will release funds to khapeetar</p>
              </div>
              <button onClick={() => router.push(`/artist/jobs/${id}/chat`)}
                style={{ padding:'9px 18px', borderRadius:10, background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', color:'#c084fc', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                View Chat
              </button>
            </div>
          )}

          {/* Job details */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'24px 28px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:20 }}>
              {[
                { label:'Budget', value:`₹${Number(job.budget).toLocaleString('en-IN')}${job.budgetMax ? ` – ₹${Number(job.budgetMax).toLocaleString('en-IN')}` : ''}`, color:'#c084fc' },
                { label:'Proposals', value:`${job.proposals?.length ?? 0}`, color:'#60a5fa' },
                { label:'Deadline', value: job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : 'Flexible', color:'#fbbf24' },
              ].map(item => (
                <div key={item.label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:14, padding:'16px' }}>
                  <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 6px 0' }}>{item.label}</p>
                  <p style={{ fontSize:17, fontWeight:800, color:item.color, margin:0 }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 8px 0' }}>Description</p>
              <p style={{ fontSize:14, color:'#a1a1aa', margin:0, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{job.description}</p>
            </div>

            {job.requirements && (
              <div>
                <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 8px 0' }}>Additional Requirements</p>
                <p style={{ fontSize:14, color:'#a1a1aa', margin:0, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{job.requirements}</p>
              </div>
            )}
          </div>

          {/* Proposals */}
          {job.status === 'open' && (
            <div>
              <h2 style={{ fontSize:16, fontWeight:700, color:'#fff', margin:'0 0 14px 0' }}>
                Proposals ({job.proposals?.length ?? 0})
              </h2>

              {(!job.proposals || job.proposals.length === 0) ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 0', gap:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:18 }}>
                  <Users size={36} color="#27272a" />
                  <p style={{ color:'#52525b', fontSize:14, fontWeight:600, margin:0 }}>No proposals yet</p>
                  <p style={{ color:'#3f3f46', fontSize:12, margin:0 }}>Khapeetars will start applying soon</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {job.proposals.map((p: any, idx: number) => {
                    const s = PROPOSAL_STATUS[p.status] ?? PROPOSAL_STATUS.pending
                    return (
                      <div key={p.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:'20px 24px', animation:`ajFadeIn .3s ease-out ${idx * 0.05}s both` }}>
                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:14, flexWrap:'wrap', marginBottom:14 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                            <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,rgba(16,185,129,0.3),rgba(20,184,166,0.2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:800, color:'#fff' }}>
                              {p.khapeetar?.name?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                              <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>{p.khapeetar?.name}</p>
                              <p style={{ fontSize:12, color:'#52525b', margin:'2px 0 0 0' }}>
                                {p.khapeetar?.khapeetarProfile?.primaryRole || 'Khapeetar'} · {p.deliveryDays} day{p.deliveryDays !== 1 ? 's' : ''} delivery
                              </p>
                            </div>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <p style={{ fontSize:17, fontWeight:800, color:'#c084fc', margin:0 }}>₹{Number(p.bidAmount).toLocaleString('en-IN')}</p>
                            <div style={{ padding:'4px 12px', borderRadius:999, background:s.bg, border:`1px solid ${s.border}`, fontSize:11, fontWeight:700, color:s.color }}>{s.label}</div>
                          </div>
                        </div>

                        <p style={{ fontSize:13, color:'#a1a1aa', lineHeight:1.7, margin:'0 0 16px 0' }}>{p.message}</p>

                        {p.status === 'pending' && (
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                            <button onClick={() => rejectProposal(p.id)} disabled={acting === p.id}
                              onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.12)' }}
                              onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.07)' }}
                              style={{ padding:'11px', borderRadius:12, background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)', color:'#f87171', fontSize:13, fontWeight:700, cursor:acting === p.id ? 'not-allowed' : 'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all .2s ease', opacity: acting === p.id ? 0.5 : 1 }}>
                              <XCircle size={14} /> Decline
                            </button>
                            <button onClick={() => acceptProposal(p.id)} disabled={acting === p.id}
                              onMouseEnter={e => { if (acting !== p.id) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(16,185,129,0.3)' } }}
                              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                              style={{ padding:'11px', borderRadius:12, background: acting === p.id ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#10b981,#059669)', border:'none', color: acting === p.id ? '#52525b' : '#fff', fontSize:13, fontWeight:700, cursor: acting === p.id ? 'not-allowed' : 'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all .3s ease' }}>
                              {acting === p.id
                                ? <><Loader2 size={13} style={{ animation:'ajSpin 1s linear infinite' }} /> Holding Escrow...</>
                                : <><CheckCircle size={14} /> Accept & Hold Escrow</>
                              }
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Accepted proposal summary when assigned */}
          {(job.status === 'assigned' || job.status === 'completed') && job.proposals?.length > 0 && (
            <div>
              <h2 style={{ fontSize:16, fontWeight:700, color:'#fff', margin:'0 0 14px 0' }}>Accepted Proposal</h2>
              {job.proposals.filter((p: any) => p.status === 'accepted').map((p: any) => (
                <div key={p.id} style={{ background:'rgba(16,185,129,0.04)', border:'1px solid rgba(16,185,129,0.15)', borderRadius:18, padding:'20px 24px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,rgba(16,185,129,0.3),rgba(20,184,166,0.2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:800, color:'#fff' }}>
                      {p.khapeetar?.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>{p.khapeetar?.name}</p>
                      <p style={{ fontSize:12, color:'#52525b', margin:'2px 0 0 0' }}>{p.deliveryDays} day{p.deliveryDays !== 1 ? 's' : ''} delivery · ₹{Number(p.bidAmount).toLocaleString('en-IN')}</p>
                    </div>
                    <div style={{ marginLeft:'auto', padding:'4px 12px', borderRadius:999, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', fontSize:11, fontWeight:700, color:'#34d399' }}>Accepted</div>
                  </div>
                  <p style={{ fontSize:13, color:'#a1a1aa', lineHeight:1.7, margin:0 }}>{p.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ArtistLayout>
  )
}