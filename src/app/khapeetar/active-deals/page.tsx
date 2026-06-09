'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import { Loader2, Zap, MessageSquare, Clock, ShieldCheck, Briefcase } from 'lucide-react'
import { formatINR } from '@/lib/utils'

export default function ActiveDeals() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [deals, setDeals]               = useState<any[]>([])
  const [acceptedJobs, setAcceptedJobs] = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [completing, setCompleting]     = useState<string | null>(null)
  const [hoveredCard, setHoveredCard]   = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn]     = useState<string | null>(null)

  const fetchAll = async () => {
    const [dealsRes, jobsRes] = await Promise.all([
      fetch('/api/deals').then(r => r.json()),
      fetch('/api/khapeetar/my-jobs').then(r => r.json()),
    ])
    if (dealsRes.success) {
      setDeals(dealsRes.data.filter((d: any) => d.status === 'active' || d.status === 'completed'))
    }
    if (jobsRes.success) setAcceptedJobs(jobsRes.data)
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/khapeetar/login'); return }
    fetchAll()
  }, [session, status])

  const markComplete = async (id: string) => {
    setCompleting(id)
    try {
      const res  = await fetch(`/api/deals/${id}/complete`, { method: 'POST' })
      const json = await res.json()
      if (!json.success) alert(json.error || 'Could not mark complete')
      else fetchAll()
    } finally { setCompleting(null) }
  }

  const markJobComplete = async (jobId: string) => {
    setCompleting(`job-${jobId}`)
    try {
      const res  = await fetch(`/api/jobs/${jobId}/complete`, { method: 'POST' })
      const json = await res.json()
      if (json.success) { alert(json.message); await fetchAll() }
      else alert(json.error)
    } finally { setCompleting(null) }
  }

  if (status === 'loading' || loading) {
    return (
      <KhapeetarLayout>
        <style jsx global>{`
          @keyframes adFloatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
          @keyframes adSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        `}</style>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', width:'300px', height:'300px', background:'radial-gradient(circle,rgba(16,185,129,0.12) 0%,transparent 70%)', borderRadius:'50%', animation:'adFloatOrb 4s ease-in-out infinite' }} />
          <Loader2 style={{ animation:'adSpin 1s linear infinite', color:'#34d399', width:'36px', height:'36px', position:'relative', zIndex:1 }} />
          <p style={{ marginTop:'16px', color:'#52525b', fontSize:'14px', letterSpacing:'0.05em', position:'relative', zIndex:1 }}>Loading active deals...</p>
        </div>
      </KhapeetarLayout>
    )
  }

  const activeDealsCount    = deals.filter(d => d.status === 'active').length
  const completedDealsCount = deals.filter(d => d.status === 'completed').length
  const activeJobsCount     = acceptedJobs.filter(j => j.status === 'assigned').length
  const completedJobsCount  = acceptedJobs.filter(j => j.status === 'completed').length
  const totalActive    = activeDealsCount + activeJobsCount
  const totalCompleted = completedDealsCount + completedJobsCount

  return (
    <KhapeetarLayout>
      <style jsx global>{`
        @keyframes adFloatOrb  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
        @keyframes adFloatOrb2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-15px) scale(1.03)} }
        @keyframes adFloatOrb3 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(20px,25px) scale(1.03)} 80%{transform:translate(-15px,-10px) scale(0.97)} }
        @keyframes adFadeInUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes adFadeInDown  { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes adFadeInStagger { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes adShimmer     { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes adPulseDot    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }
        @keyframes adSpin        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', position:'relative', overflow:'hidden', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-60px', right:'-30px', width:'420px', height:'420px', background:'radial-gradient(circle,rgba(16,185,129,0.05) 0%,transparent 70%)', borderRadius:'50%', animation:'adFloatOrb 10s ease-in-out infinite' }} />
          <div style={{ position:'absolute', top:'50%', left:'-80px', width:'350px', height:'350px', background:'radial-gradient(circle,rgba(139,92,246,0.04) 0%,transparent 70%)', borderRadius:'50%', animation:'adFloatOrb2 13s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'-40px', right:'30%', width:'300px', height:'300px', background:'radial-gradient(circle,rgba(20,184,166,0.03) 0%,transparent 70%)', borderRadius:'50%', animation:'adFloatOrb3 16s ease-in-out infinite' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        {/* Header */}
        <div style={{ position:'relative', zIndex:1, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)', backdropFilter:'blur(20px)', animation:'adFadeInDown 0.5s ease-out' }}>
          <div style={{ padding:'28px 32px', maxWidth:'1200px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ width:'42px', height:'42px', borderRadius:'14px', background:'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(20,184,166,0.08))', border:'1px solid rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(16,185,129,0.08)' }}>
                <Zap size={20} color="#34d399" />
              </div>
              <div>
                <h1 style={{ fontSize:'22px', fontWeight:800, margin:0, background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Active Deals</h1>
                <p style={{ fontSize:'13px', color:'#52525b', margin:'2px 0 0 0', fontWeight:500 }}>Your ongoing and completed work</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.12)', borderRadius:'10px' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#34d399', boxShadow:'0 0 8px rgba(52,211,153,0.5)', animation:'adPulseDot 2s ease-in-out infinite' }} />
                <span style={{ fontSize:'12px', color:'#34d399', fontWeight:700 }}>{totalActive} Active</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.12)', borderRadius:'10px' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#a78bfa' }} />
                <span style={{ fontSize:'12px', color:'#a78bfa', fontWeight:700 }}>{totalCompleted} Done</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ position:'relative', zIndex:1, padding:'28px 32px', maxWidth:'1200px', margin:'0 auto' }}>

          {deals.length === 0 && acceptedJobs.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'100px 0', animation:'adFadeInUp 0.6s ease-out' }}>
              <div style={{ width:'80px', height:'80px', borderRadius:'24px', background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px' }}>
                <Zap size={32} color="#27272a" />
              </div>
              <p style={{ fontSize:'16px', fontWeight:600, color:'#52525b', margin:'0 0 4px 0' }}>No active deals yet</p>
              <p style={{ fontSize:'13px', color:'#3f3f46', margin:0 }}>Your ongoing and completed work will appear here</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'28px' }}>

              {/* ── JOB CONTRACTS ─────────────────────────────────────── */}
              {acceptedJobs.length > 0 && (
                <div>
                  <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'#3f3f46', margin:'0 0 14px 0', display:'flex', alignItems:'center', gap:8 }}>
                    <Briefcase size={13} color="#52525b" /> Job Contracts ({acceptedJobs.length})
                  </p>
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    {acceptedJobs.map((job: any, index: number) => {
                      const isCompleted = job.status === 'completed'
                      const isH = hoveredCard === `job-${job.id}`
                      const ac  = isCompleted ? 'rgba(139,92,246,' : 'rgba(16,185,129,'

                      return (
                        <div key={job.id}
                          onMouseEnter={() => setHoveredCard(`job-${job.id}`)}
                          onMouseLeave={() => setHoveredCard(null)}
                          style={{ position:'relative', overflow:'hidden', background: isH ? `linear-gradient(135deg,${ac}0.08) 0%,${ac}0.03) 100%)` : `linear-gradient(135deg,${ac}0.05) 0%,${ac}0.015) 100%)`, border:`1px solid ${isH ? `${ac}0.2)` : `${ac}0.1)`}`, borderRadius:20, padding:24, backdropFilter:'blur(20px)', transition:'all .35s ease', transform: isH ? 'translateY(-3px)' : 'translateY(0)', boxShadow: isH ? `0 12px 40px ${ac}0.08)` : '0 2px 10px rgba(0,0,0,0.1)', animation:`adFadeInStagger .4s ease-out ${index * 0.08}s both` }}>

                          <div style={{ position:'absolute', top:'16px', bottom:'16px', left:0, width:'3px', background:`linear-gradient(180deg,${isCompleted ? '#a78bfa' : '#34d399'},transparent)`, borderRadius:'0 4px 4px 0', opacity: isH ? 1 : 0.6 }} />

                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12, flexWrap:'wrap', gap:10 }}>
                            <div>
                              <h3 style={{ fontSize:17, fontWeight:700, color:'#fff', margin:'0 0 4px 0' }}>{job.title}</h3>
                              <p style={{ fontSize:13, color:'#71717a', margin:0 }}>
                                {job.category} · with <span style={{ color:'#a1a1aa' }}>{job.artist?.name}</span>
                              </p>
                            </div>
                            <span style={{ padding:'6px 14px', borderRadius:999, background:`${ac}0.1)`, border:`1px solid ${ac}0.2)`, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color: isCompleted ? '#a78bfa' : '#34d399', display:'flex', alignItems:'center', gap:6 }}>
                              <span style={{ width:6, height:6, borderRadius:'50%', background: isCompleted ? '#a78bfa' : '#34d399', animation: !isCompleted ? 'adPulseDot 2s ease-in-out infinite' : 'none' }} />
                              {isCompleted ? 'completed' : 'assigned'}
                            </span>
                          </div>

                          <div style={{ display:'flex', gap:12, marginBottom:18, flexWrap:'wrap' }}>
                            <div style={{ background:`${ac}0.06)`, border:`1px solid ${ac}0.12)`, borderRadius:14, padding:'12px 18px', minWidth:120, position:'relative', overflow:'hidden' }}>
                              {!isCompleted && <div style={{ position:'absolute', inset:0, background:`linear-gradient(90deg,transparent,${ac}0.04),transparent)`, backgroundSize:'200% 100%', animation:'adShimmer 3s linear infinite', pointerEvents:'none' }} />}
                              <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', fontWeight:600, margin:'0 0 4px 0', position:'relative' }}>
                                {isCompleted ? '💸 Paid' : '🔒 Escrowed'}
                              </p>
                              <p style={{ fontSize:17, fontWeight:800, color: isCompleted ? '#a78bfa' : '#34d399', margin:0, position:'relative' }}>
                                ₹{Number(job.escrowAmount || job.budget).toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'12px 18px' }}>
                              <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', fontWeight:600, margin:'0 0 4px 0' }}>📋 Category</p>
                              <p style={{ fontSize:14, fontWeight:600, color:'#a1a1aa', margin:0 }}>{job.category}</p>
                            </div>
                            {isCompleted && (
                              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'12px 18px' }}>
                                <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', fontWeight:600, margin:'0 0 4px 0' }}>📊 Status</p>
                                <p style={{ fontSize:13, fontWeight:600, color:'#fbbf24', margin:0 }}>Awaiting fund release</p>
                              </div>
                            )}
                          </div>

                          <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
                            <button onClick={() => router.push(`/khapeetar/jobs/${job.id}/chat`)}
                              onMouseEnter={() => setHoveredBtn(`jchat-${job.id}`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 20px', background: hoveredBtn === `jchat-${job.id}` ? 'linear-gradient(135deg,rgba(16,185,129,0.18),rgba(20,184,166,0.12))' : 'rgba(16,185,129,0.08)', border:`1px solid ${hoveredBtn === `jchat-${job.id}` ? 'rgba(16,185,129,0.35)' : 'rgba(16,185,129,0.2)'}`, borderRadius:12, color:'#34d399', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .3s ease', fontFamily:'inherit', transform: hoveredBtn === `jchat-${job.id}` ? 'translateY(-1px)' : 'translateY(0)', boxShadow: hoveredBtn === `jchat-${job.id}` ? '0 4px 20px rgba(16,185,129,0.12)' : 'none' }}>
                              <MessageSquare size={14} /> Open Chat
                            </button>

                            {!isCompleted && !job.khapeetarCompleted && (
                              <button onClick={() => markJobComplete(job.id)} disabled={completing === `job-${job.id}`}
                                onMouseEnter={() => setHoveredBtn(`jcomp-${job.id}`)}
                                onMouseLeave={() => setHoveredBtn(null)}
                                style={{ position:'relative', display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', background: completing === `job-${job.id}` ? 'rgba(16,185,129,0.3)' : hoveredBtn === `jcomp-${job.id}` ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#10b981,#14b8a6)', border:'none', borderRadius:12, color:'#000', fontSize:13, fontWeight:700, cursor: completing === `job-${job.id}` ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', transform: hoveredBtn === `jcomp-${job.id}` && completing !== `job-${job.id}` ? 'translateY(-2px)' : 'translateY(0)', boxShadow: hoveredBtn === `jcomp-${job.id}` && completing !== `job-${job.id}` ? '0 6px 28px rgba(16,185,129,0.3)' : '0 2px 12px rgba(16,185,129,0.15)', opacity: completing === `job-${job.id}` ? 0.6 : 1, overflow:'hidden' }}>
                                {hoveredBtn === `jcomp-${job.id}` && completing !== `job-${job.id}` && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)', backgroundSize:'200% 100%', animation:'adShimmer 1.5s linear infinite', pointerEvents:'none' }} />}
                                {completing === `job-${job.id}` ? <div style={{ width:15, height:15, border:'2px solid rgba(0,0,0,0.2)', borderTopColor:'#000', borderRadius:'50%', animation:'adSpin .8s linear infinite' }} /> : <ShieldCheck size={14} style={{ position:'relative' }} />}
                                <span style={{ position:'relative' }}>{completing === `job-${job.id}` ? 'Completing...' : 'Complete Deal'}</span>
                              </button>
                            )}

                            {!isCompleted && job.khapeetarCompleted && (
                              <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, color:'#52525b', fontSize:13, fontWeight:600 }}>
                                <Clock size={14} style={{ animation:'adPulseDot 2s ease-in-out infinite' }} /> Waiting for Artist
                              </div>
                            )}

                            {isCompleted && (
                              <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'12px 18px', background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.1)', borderRadius:14, position:'relative', overflow:'hidden' }}>
                                <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.03),transparent)', backgroundSize:'200% 100%', animation:'adShimmer 4s linear infinite', pointerEvents:'none' }} />
                                <ShieldCheck size={16} color="#a78bfa" style={{ position:'relative' }} />
                                <div style={{ position:'relative' }}>
                                  <p style={{ fontSize:13, fontWeight:600, color:'#a78bfa', margin:0 }}>✅ Deal Completed</p>
                                  <p style={{ fontSize:11, color:'#71717a', margin:'2px 0 0 0' }}>Funds awaiting admin release</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── STANDARD DEALS ────────────────────────────────────── */}
              {deals.length > 0 && (
                <div>
                  {acceptedJobs.length > 0 && (
                    <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'#3f3f46', margin:'0 0 14px 0' }}>
                      Deal Requests ({deals.length})
                    </p>
                  )}
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    {deals.map((deal, index) => {
                      const isCompleted = deal.status === 'completed'
                      const isActive    = deal.status === 'active'
                      const isH         = hoveredCard === deal.id
                      const ac          = isCompleted ? 'rgba(139,92,246,' : 'rgba(16,185,129,'
                      const yourCut     = Math.round((deal.acceptedBudget || deal.budget) * 0.90)
                      const dealValue   = deal.acceptedBudget || deal.budget

                      return (
                        <div key={deal.id}
                          onMouseEnter={() => setHoveredCard(deal.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                          style={{ position:'relative', overflow:'hidden', background: isH ? `linear-gradient(135deg,${ac}0.08) 0%,${ac}0.03) 100%)` : `linear-gradient(135deg,${ac}0.05) 0%,${ac}0.015) 100%)`, border:`1px solid ${isH ? `${ac}0.2)` : `${ac}0.1)`}`, borderRadius:20, padding:28, backdropFilter:'blur(20px)', transition:'all .35s cubic-bezier(0.4,0,0.2,1)', transform: isH ? 'translateY(-3px)' : 'translateY(0)', boxShadow: isH ? `0 12px 40px ${ac}0.08),0 0 60px ${ac}0.03)` : '0 2px 10px rgba(0,0,0,0.1)', animation:`adFadeInStagger .4s ease-out ${index * 0.08}s both` }}>

                          <div style={{ position:'absolute', top:'16px', bottom:'16px', left:0, width:'3px', background:`linear-gradient(180deg,${isCompleted ? '#a78bfa' : '#34d399'},transparent)`, borderRadius:'0 4px 4px 0', opacity: isH ? 1 : 0.6, transition:'opacity .3s ease' }} />
                          <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'120px', height:'120px', background:`radial-gradient(circle,${ac}0.06) 0%,transparent 70%)`, borderRadius:'50%', opacity: isH ? 1 : 0.3, transition:'opacity .3s ease', pointerEvents:'none' }} />
                          {isCompleted && isH && <div style={{ position:'absolute', inset:0, background:`linear-gradient(90deg,transparent,${ac}0.04),transparent)`, backgroundSize:'200% 100%', animation:'adShimmer 3s linear infinite', pointerEvents:'none' }} />}

                          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12, position:'relative' }}>
                            <div style={{ flex:1, minWidth:0 }}>
                              <h3 style={{ fontSize:17, fontWeight:700, color:'#fff', margin:'0 0 4px 0', lineHeight:1.3 }}>{deal.projectTitle}</h3>
                              {deal.artist?.name && <p style={{ fontSize:13, color:'#52525b', margin:'4px 0 0 0', fontWeight:500 }}>with <span style={{ color:'#71717a' }}>{deal.artist.name}</span></p>}
                            </div>
                            <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', background:`${ac}0.1)`, color: isCompleted ? '#a78bfa' : '#34d399', border:`1px solid ${ac}0.2)`, borderRadius:10, flexShrink:0, marginLeft:12 }}>
                              <span style={{ width:6, height:6, borderRadius:'50%', background: isCompleted ? '#a78bfa' : '#34d399', boxShadow:`0 0 6px ${isCompleted ? 'rgba(167,139,250,0.5)' : 'rgba(52,211,153,0.5)'}`, animation: isActive ? 'adPulseDot 2s ease-in-out infinite' : 'none' }} />
                              {deal.status}
                            </span>
                          </div>

                          <p style={{ color:'#71717a', fontSize:14, lineHeight:1.6, margin:'0 0 20px 0', position:'relative' }}>{deal.description}</p>

                          <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
                            <div style={{ position:'relative', overflow:'hidden', background: isCompleted ? 'rgba(139,92,246,0.06)' : 'rgba(16,185,129,0.06)', border:`1px solid ${isCompleted ? 'rgba(139,92,246,0.12)' : 'rgba(16,185,129,0.12)'}`, borderRadius:14, padding:'14px 20px', minWidth:140 }}>
                              {isActive && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(16,185,129,0.04),transparent)', backgroundSize:'200% 100%', animation:'adShimmer 3s linear infinite', pointerEvents:'none' }} />}
                              <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', fontWeight:600, margin:'0 0 4px 0', position:'relative' }}>{isCompleted ? '💸 Paid Out' : '🔒 Escrowed'}</p>
                              <p style={{ fontSize:18, fontWeight:800, color: isCompleted ? '#a78bfa' : '#34d399', margin:0, position:'relative' }}>{formatINR(yourCut)}</p>
                              <span style={{ fontSize:11, color:'#3f3f46', fontWeight:500 }}>your cut</span>
                            </div>
                            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'14px 20px', minWidth:120 }}>
                              <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', fontWeight:600, margin:'0 0 4px 0' }}>📋 Deal Value</p>
                              <p style={{ fontSize:16, fontWeight:700, color:'#a1a1aa', margin:0 }}>{formatINR(dealValue)}</p>
                            </div>
                            <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)', borderRadius:14, padding:'14px 20px' }}>
                              <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', fontWeight:600, margin:'0 0 4px 0' }}>📊 Your Share</p>
                              <p style={{ fontSize:16, fontWeight:800, color:'#34d399', margin:0 }}>90%</p>
                            </div>
                          </div>

                          {isActive && (
                            <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center', position:'relative' }}>
                              <button onClick={() => router.push(`/deals/chat/${deal.id}`)}
                                onMouseEnter={() => setHoveredBtn(`chat-${deal.id}`)}
                                onMouseLeave={() => setHoveredBtn(null)}
                                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 20px', background: hoveredBtn === `chat-${deal.id}` ? 'linear-gradient(135deg,rgba(16,185,129,0.18),rgba(20,184,166,0.12))' : 'rgba(16,185,129,0.08)', border:`1px solid ${hoveredBtn === `chat-${deal.id}` ? 'rgba(16,185,129,0.35)' : 'rgba(16,185,129,0.2)'}`, borderRadius:12, color:'#34d399', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .3s ease', fontFamily:'inherit', transform: hoveredBtn === `chat-${deal.id}` ? 'translateY(-1px)' : 'translateY(0)', boxShadow: hoveredBtn === `chat-${deal.id}` ? '0 4px 20px rgba(16,185,129,0.12)' : 'none' }}>
                                <MessageSquare size={15} /> Open Chat
                              </button>

                              {deal.khapeetarCompleted ? (
                                <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, color:'#52525b', fontSize:13, fontWeight:600 }}>
                                  <Clock size={15} style={{ animation:'adPulseDot 2s ease-in-out infinite' }} /> Waiting for Artist
                                </div>
                              ) : (
                                <button onClick={() => markComplete(deal.id)} disabled={completing === deal.id}
                                  onMouseEnter={() => setHoveredBtn(`complete-${deal.id}`)}
                                  onMouseLeave={() => setHoveredBtn(null)}
                                  style={{ position:'relative', display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', background: completing === deal.id ? 'rgba(16,185,129,0.3)' : hoveredBtn === `complete-${deal.id}` ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#10b981,#14b8a6)', border:'none', borderRadius:12, color: completing === deal.id ? 'rgba(0,0,0,0.5)' : '#000', fontSize:13, fontWeight:700, cursor: completing === deal.id ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', transform: hoveredBtn === `complete-${deal.id}` && completing !== deal.id ? 'translateY(-2px)' : 'translateY(0)', boxShadow: hoveredBtn === `complete-${deal.id}` && completing !== deal.id ? '0 6px 28px rgba(16,185,129,0.3)' : '0 2px 12px rgba(16,185,129,0.15)', opacity: completing === deal.id ? 0.6 : 1, overflow:'hidden' }}>
                                  {hoveredBtn === `complete-${deal.id}` && completing !== deal.id && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)', backgroundSize:'200% 100%', animation:'adShimmer 1.5s linear infinite', pointerEvents:'none' }} />}
                                  {completing === deal.id ? <div style={{ width:15, height:15, border:'2px solid rgba(0,0,0,0.2)', borderTopColor:'#000', borderRadius:'50%', animation:'adSpin .8s linear infinite' }} /> : <ShieldCheck size={15} style={{ position:'relative' }} />}
                                  <span style={{ position:'relative' }}>{completing === deal.id ? 'Completing...' : 'Complete Deal'}</span>
                                </button>
                              )}
                            </div>
                          )}

                          {isCompleted && (
                            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 18px', background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.1)', borderRadius:14, position:'relative', overflow:'hidden' }}>
                              <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.03),transparent)', backgroundSize:'200% 100%', animation:'adShimmer 4s linear infinite', pointerEvents:'none' }} />
                              <div style={{ width:32, height:32, borderRadius:10, background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, position:'relative' }}>
                                <ShieldCheck size={16} color="#a78bfa" />
                              </div>
                              <div style={{ position:'relative' }}>
                                <p style={{ fontSize:13, fontWeight:600, color:'#a78bfa', margin:0 }}>✅ Deal Completed</p>
                                <p style={{ fontSize:12, color:'#71717a', margin:'2px 0 0 0', fontWeight:500 }}>{formatINR(yourCut)} awaiting admin release</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </KhapeetarLayout>
  )
}