'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2 } from 'lucide-react'

const STATUS_CONFIG: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  completed:      { text: '#4ade80', bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.18)',   glow: 'rgba(34,197,94,0.08)' },
  active:         { text: '#fbbf24', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.18)',  glow: 'rgba(245,158,11,0.08)' },
  assigned:       { text: '#fbbf24', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.18)',  glow: 'rgba(245,158,11,0.08)' },
  admin_released: { text: '#60a5fa', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.18)',  glow: 'rgba(59,130,246,0.08)' },
  paid:           { text: '#60a5fa', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.18)',  glow: 'rgba(59,130,246,0.08)' },
  refunded:       { text: '#f87171', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.18)',   glow: 'rgba(239,68,68,0.08)' },
}

const getStatus = (s: string) =>
  STATUS_CONFIG[s] ?? { text:'#d4d4d8', bg:'rgba(255,255,255,0.08)', border:'rgba(255,255,255,0.10)', glow:'rgba(255,255,255,0.05)' }

export default function AdminDealsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [deals, setDeals]       = useState<any[]>([])
  const [jobs,  setJobs]        = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn]   = useState<string | null>(null)
  const [activeTab, setActiveTab]     = useState<'deals' | 'jobs'>('jobs')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'admin') { router.push('/'); return }
    loadAll()
  }, [session, status])

  const loadAll = async () => {
    const [dealsRes, jobsRes] = await Promise.all([
      fetch('/api/admin/deals').then(r => r.json()),
      fetch('/api/admin/jobs').then(r => r.json()),
    ])
    if (dealsRes.success) setDeals(dealsRes.data)
    if (jobsRes.success)  setJobs(jobsRes.data)
    setLoading(false)
  }

  const handleDealAction = async (dealId: string, action: 'release_funds' | 'refund_artist') => {
    setLoadingId(dealId + action)
    try {
      const res  = await fetch(`/api/admin/deals/${dealId}/action`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (!data.success) { alert(data.error || 'Action failed'); return }
      await loadAll()
      alert(data.message)
    } catch { alert('Action failed') }
    finally { setLoadingId(null) }
  }

  const handleJobAction = async (jobId: string, action: 'release' | 'refund') => {
    setLoadingId(jobId + action)
    try {
      const res  = await fetch(`/api/admin/jobs/${jobId}/${action}`, { method: 'POST' })
      const data = await res.json()
      if (!data.success) { alert(data.error || 'Action failed'); return }
      await loadAll()
      alert(data.message)
    } catch { alert('Action failed') }
    finally { setLoadingId(null) }
  }

  const summary = useMemo(() => ({
    totalDeals:     deals.length,
    activeDeals:    deals.filter(d => d.status === 'active').length,
    releasedDeals:  deals.filter(d => d.status === 'admin_released').length,
    refundedDeals:  deals.filter(d => d.status === 'refunded').length,
    totalJobs:      jobs.length,
    activeJobs:     jobs.filter(j => j.status === 'assigned').length,
    completedJobs:  jobs.filter(j => j.status === 'completed').length,
    paidJobs:       jobs.filter(j => j.status === 'paid').length,
    refundedJobs:   jobs.filter(j => j.status === 'refunded').length,
  }), [deals, jobs])

  if (loading) {
    return (
      <AdminLayout>
        <style>{`@keyframes adsSpin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <Loader2 style={{ animation:'adsSpin 1s linear infinite', color:'#f87171', width:36, height:36 }} />
          <p style={{ marginTop:14, color:'#52525b', fontSize:14 }}>Loading deals...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes adsSpin        { to{transform:rotate(360deg)} }
        @keyframes adsFadeInDown  { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes adsFadeInUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes adsFadeInStagger { from{opacity:0;transform:translateY(14px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes adsGradShift   { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes adsPulseDot    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.35)} }
        @keyframes adsFloatOrb    { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', position:'relative', overflow:'hidden', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-80px', right:'-40px', width:'480px', height:'480px', borderRadius:'999px', background:'radial-gradient(circle,rgba(239,68,68,0.06) 0%,transparent 70%)', animation:'adsFloatOrb 10s ease-in-out infinite' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        {/* Header */}
        <div style={{ position:'relative', zIndex:1, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)', backdropFilter:'blur(20px)', animation:'adsFadeInDown .5s ease-out' }}>
          <div style={{ padding:'28px 32px', maxWidth:'1350px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,rgba(239,68,68,0.14),rgba(245,158,11,0.10))', border:'1px solid rgba(239,68,68,0.16)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(239,68,68,0.08)', fontSize:20 }}>🤝</div>
              <div>
                <h1 style={{ fontSize:22, fontWeight:800, margin:0, background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>All Deals & Jobs</h1>
                <p style={{ fontSize:13, color:'#52525b', margin:'2px 0 0 0', fontWeight:500 }}>Manage escrow release and refunds</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {[
                { label:'Job Contracts', value: summary.totalJobs,     color:'#c084fc', bg:'rgba(168,85,247,0.08)', border:'rgba(168,85,247,0.15)' },
                { label:'Active Jobs',   value: summary.activeJobs,    color:'#fbbf24', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.15)' },
                { label:'Completed',     value: summary.completedJobs, color:'#34d399', bg:'rgba(16,185,129,0.08)', border:'rgba(16,185,129,0.15)' },
                { label:'Deals',         value: summary.totalDeals,    color:'#60a5fa', bg:'rgba(59,130,246,0.08)', border:'rgba(59,130,246,0.15)' },
              ].map(item => (
                <div key={item.label} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:item.bg, border:`1px solid ${item.border}`, borderRadius:12 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:item.color, boxShadow:`0 0 8px ${item.color}55` }} />
                  <span style={{ fontSize:12, color:item.color, fontWeight:700 }}>{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ padding:'0 32px 20px', maxWidth:'1350px', margin:'0 auto', display:'flex', gap:8 }}>
            {[
              { key:'jobs' as const,  label:`🏗️ Job Contracts (${summary.totalJobs})` },
              { key:'deals' as const, label:`🤝 Deal Requests (${summary.totalDeals})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ padding:'8px 18px', borderRadius:12, border:'1px solid', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all .2s ease',
                  ...(activeTab === tab.key
                    ? { background:'rgba(239,68,68,0.1)', borderColor:'rgba(239,68,68,0.3)', color:'#f87171' }
                    : { background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)', color:'#52525b' }
                  ) }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ position:'relative', zIndex:1, padding:'28px 32px 48px', maxWidth:'1350px', margin:'0 auto' }}>

          {/* ── JOB CONTRACTS TAB ─────────────────────────────────── */}
          {activeTab === 'jobs' && (
            <>
              {jobs.length === 0 ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'100px 0', animation:'adsFadeInUp .6s ease-out' }}>
                  <div style={{ width:'80px', height:'80px', borderRadius:'24px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', fontSize:34 }}>📭</div>
                  <p style={{ fontSize:'16px', fontWeight:600, color:'#52525b', margin:'0 0 4px 0' }}>No job contracts yet</p>
                  <p style={{ fontSize:'13px', color:'#3f3f46', margin:0 }}>Accepted job proposals will appear here</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {jobs.map((job, index) => {
                    const isH       = hoveredCard === `job-${job.id}`
                    const sc        = getStatus(job.status)
                    const isRelease = loadingId === `${job.id}release`
                    const isRefund  = loadingId === `${job.id}refund`
                    const canAct    = job.status === 'assigned' || job.status === 'completed'

                    return (
                      <div key={job.id}
                        onMouseEnter={() => setHoveredCard(`job-${job.id}`)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{ position:'relative', overflow:'hidden', background: isH ? 'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0.025) 100%)' : 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)', border:`1px solid ${isH ? sc.border : 'rgba(255,255,255,0.06)'}`, borderRadius:24, padding:24, backdropFilter:'blur(16px)', transition:'all .35s cubic-bezier(0.4,0,0.2,1)', transform: isH ? 'translateY(-2px)' : 'translateY(0)', boxShadow: isH ? `0 14px 40px rgba(0,0,0,0.35),0 0 50px ${sc.glow}` : '0 2px 10px rgba(0,0,0,0.12)', animation:`adsFadeInStagger .45s ease-out ${index * 0.05}s both` }}>

                        <div style={{ position:'absolute', left:0, top:'16px', bottom:'16px', width:3, borderRadius:'0 3px 3px 0', background:`linear-gradient(180deg,${sc.text},transparent)`, opacity: isH ? 1 : 0.45, transition:'opacity .3s ease' }} />
                        <div style={{ position:'absolute', top:'-24px', right:'-24px', width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle,${sc.glow} 0%,transparent 70%)`, pointerEvents:'none', opacity: isH ? 1 : 0.35, transition:'opacity .3s ease' }} />

                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap', marginBottom:16, position:'relative' }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <h2 style={{ fontSize:17, fontWeight:700, color:'#fff', margin:'0 0 6px 0', lineHeight:1.3 }}>{job.title}</h2>
                            <p style={{ fontSize:13, color:'#71717a', margin:0, fontWeight:500 }}>
                              Artist: <span style={{ color:'#d4d4d8' }}>{job.artist?.name}</span>
                              {job.khapeetar && <> · Khapeetar: <span style={{ color:'#d4d4d8' }}>{job.khapeetar?.name}</span></>}
                            </p>
                            <p style={{ fontSize:12, color:'#52525b', margin:'3px 0 0 0' }}>{job.category}</p>
                          </div>
                          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 14px', borderRadius:999, background:sc.bg, border:`1px solid ${sc.border}`, color:sc.text, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', flexShrink:0 }}>
                            <span style={{ width:6, height:6, borderRadius:'50%', background:sc.text, boxShadow:`0 0 6px ${sc.text}`, animation: job.status === 'assigned' || job.status === 'completed' ? 'adsPulseDot 2s ease-in-out infinite' : 'none' }} />
                            {job.status}
                          </div>
                        </div>

                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom: canAct ? 20 : 0 }}>
                          {[
                            { label:'Budget',      value:`₹${Number(job.budget||0).toLocaleString('en-IN')}`,        color:'#d4d4d8', emoji:'💰' },
                            { label:'Escrow',      value:`₹${Number(job.escrowAmount||0).toLocaleString('en-IN')}`,  color:'#34d399', emoji:'🔒' },
                            { label:'Artist',      value: job.artist?.name || '—',                                    color:'#60a5fa', emoji:'🎤' },
                            { label:'Khapeetar',   value: job.khapeetar?.name || 'Not assigned',                     color:'#c084fc', emoji:'⚡' },
                          ].map(item => (
                            <div key={item.label} style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:16, padding:16 }}>
                              <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', fontWeight:700, margin:'0 0 6px 0' }}>{item.emoji} {item.label}</p>
                              <p style={{ fontSize:15, fontWeight:700, color:item.color, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Completion status badges */}
                        {(job.status === 'assigned' || job.status === 'completed') && (
                          <div style={{ display:'flex', gap:8, marginBottom: canAct ? 16 : 0, flexWrap:'wrap' }}>
                            <div style={{ padding:'5px 12px', borderRadius:8, background: job.artistCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', border:`1px solid ${job.artistCompleted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`, fontSize:11, fontWeight:700, color: job.artistCompleted ? '#34d399' : '#52525b' }}>
                              🎤 Artist: {job.artistCompleted ? '✅ Complete' : '⏳ Pending'}
                            </div>
                            <div style={{ padding:'5px 12px', borderRadius:8, background: job.khapeetarCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', border:`1px solid ${job.khapeetarCompleted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`, fontSize:11, fontWeight:700, color: job.khapeetarCompleted ? '#34d399' : '#52525b' }}>
                              ⚡ Khapeetar: {job.khapeetarCompleted ? '✅ Complete' : '⏳ Pending'}
                            </div>
                          </div>
                        )}

                        {/* Admin actions */}
                        {canAct && (
                          <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', position:'relative' }}>
                            <div style={{ flex:1, padding:'12px 16px', background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.12)', borderRadius:12, marginBottom:0 }}>
                              <p style={{ fontSize:12, color:'#fbbf24', fontWeight:600, margin:0 }}>
                                ⚠️ Both parties confirmed completion. ₹{Number(job.escrowAmount||0).toLocaleString('en-IN')} is held in escrow.
                              </p>
                            </div>
                          </div>
                        )}

                        {canAct && (
                          <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginTop:12 }}>
                            <button onClick={() => handleJobAction(job.id, 'release')} disabled={!!isRelease}
                              onMouseEnter={() => setHoveredBtn(`jrel-${job.id}`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              style={{ position:'relative', display:'inline-flex', alignItems:'center', gap:8, padding:'12px 20px', borderRadius:14, border:'none', background: isRelease ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#16a34a,#22c55e)', color: isRelease ? '#52525b' : '#04130a', fontSize:13, fontWeight:700, cursor: isRelease ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', transform: hoveredBtn === `jrel-${job.id}` && !isRelease ? 'translateY(-1px)' : 'translateY(0)', boxShadow: hoveredBtn === `jrel-${job.id}` && !isRelease ? '0 8px 24px rgba(34,197,94,0.25)' : '0 2px 10px rgba(34,197,94,0.12)', opacity: isRelease ? 0.5 : 1, overflow:'hidden' }}>
                              {hoveredBtn === `jrel-${job.id}` && !isRelease && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)', backgroundSize:'200% 100%', animation:'adsGradShift 1.6s linear infinite', pointerEvents:'none' }} />}
                              {isRelease ? <><Loader2 style={{ width:14, height:14, animation:'adsSpin 1s linear infinite' }} /> Releasing...</> : <>✅ Release to Khapeetar</>}
                            </button>

                            <button onClick={() => { if (confirm('Refund escrow back to artist?')) handleJobAction(job.id, 'refund') }} disabled={!!isRefund}
                              onMouseEnter={() => setHoveredBtn(`jref-${job.id}`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              style={{ position:'relative', display:'inline-flex', alignItems:'center', gap:8, padding:'12px 20px', borderRadius:14, border:'none', background: isRefund ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#dc2626,#ef4444)', color: isRefund ? '#52525b' : '#fff', fontSize:13, fontWeight:700, cursor: isRefund ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', transform: hoveredBtn === `jref-${job.id}` && !isRefund ? 'translateY(-1px)' : 'translateY(0)', boxShadow: hoveredBtn === `jref-${job.id}` && !isRefund ? '0 8px 24px rgba(239,68,68,0.22)' : '0 2px 10px rgba(239,68,68,0.12)', opacity: isRefund ? 0.5 : 1, overflow:'hidden' }}>
                              {hoveredBtn === `jref-${job.id}` && !isRefund && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)', backgroundSize:'200% 100%', animation:'adsGradShift 1.6s linear infinite', pointerEvents:'none' }} />}
                              {isRefund ? <><Loader2 style={{ width:14, height:14, animation:'adsSpin 1s linear infinite' }} /> Refunding...</> : <>↩ Refund to Artist</>}
                            </button>
                          </div>
                        )}

                        {(job.status === 'paid' || job.status === 'refunded') && (
                          <div style={{ padding:'12px 18px', background: job.status === 'paid' ? 'rgba(59,130,246,0.06)' : 'rgba(239,68,68,0.06)', border:`1px solid ${job.status === 'paid' ? 'rgba(59,130,246,0.15)' : 'rgba(239,68,68,0.15)'}`, borderRadius:12 }}>
                            <p style={{ fontSize:13, fontWeight:600, color: job.status === 'paid' ? '#60a5fa' : '#f87171', margin:0 }}>
                              {job.status === 'paid' ? `✅ ₹${Number(job.escrowAmount||0).toLocaleString('en-IN')} released to khapeetar` : `↩ ₹${Number(job.escrowAmount||0).toLocaleString('en-IN')} refunded to artist`}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* ── DEAL REQUESTS TAB ─────────────────────────────────── */}
          {activeTab === 'deals' && (
            <>
              {deals.length === 0 ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'100px 0', animation:'adsFadeInUp .6s ease-out' }}>
                  <div style={{ width:80, height:80, borderRadius:24, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, fontSize:34 }}>📭</div>
                  <p style={{ fontSize:16, fontWeight:600, color:'#52525b', margin:'0 0 4px 0' }}>No deals found</p>
                  <p style={{ fontSize:13, color:'#3f3f46', margin:0 }}>Deals will appear here when created</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {deals.map((deal, index) => {
                    const isH        = hoveredCard === deal.id
                    const sc         = getStatus(deal.status)
                    const isReleasing = loadingId === deal.id + 'release_funds'
                    const isRefunding = loadingId === deal.id + 'refund_artist'

                    return (
                      <div key={deal.id}
                        onMouseEnter={() => setHoveredCard(deal.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{ position:'relative', overflow:'hidden', background: isH ? 'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0.025) 100%)' : 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)', border:`1px solid ${isH ? sc.border : 'rgba(255,255,255,0.06)'}`, borderRadius:24, padding:24, backdropFilter:'blur(16px)', transition:'all .35s cubic-bezier(0.4,0,0.2,1)', transform: isH ? 'translateY(-2px)' : 'translateY(0)', boxShadow: isH ? `0 14px 40px rgba(0,0,0,0.35),0 0 50px ${sc.glow}` : '0 2px 10px rgba(0,0,0,0.12)', animation:`adsFadeInStagger .45s ease-out ${index * 0.05}s both` }}>

                        <div style={{ position:'absolute', left:0, top:'16px', bottom:'16px', width:3, borderRadius:'0 3px 3px 0', background:`linear-gradient(180deg,${sc.text},transparent)`, opacity: isH ? 1 : 0.45, transition:'opacity .3s ease' }} />
                        <div style={{ position:'absolute', top:'-24px', right:'-24px', width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle,${sc.glow} 0%,transparent 70%)`, pointerEvents:'none', opacity: isH ? 1 : 0.35, transition:'opacity .3s ease' }} />

                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap', marginBottom:18, position:'relative' }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', margin:'0 0 6px 0', lineHeight:1.3 }}>{deal.projectTitle}</h2>
                            <p style={{ fontSize:13, color:'#71717a', margin:0, fontWeight:500 }}>
                              Artist: <span style={{ color:'#d4d4d8' }}>{deal.artist?.name || 'Unknown'}</span>
                              {' '}&middot; Khapeetar: <span style={{ color:'#d4d4d8' }}>{deal.khapeetar?.name || 'Unknown'}</span>
                            </p>
                          </div>
                          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 14px', borderRadius:999, background:sc.bg, border:`1px solid ${sc.border}`, color:sc.text, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', flexShrink:0 }}>
                            <span style={{ width:6, height:6, borderRadius:'50%', background:sc.text, boxShadow:`0 0 6px ${sc.text}`, animation: deal.status === 'active' ? 'adsPulseDot 2s ease-in-out infinite' : 'none' }} />
                            {deal.status}
                          </div>
                        </div>

                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom: deal.status === 'active' ? 22 : 0 }}>
                          {[
                            { label:'Budget',   value:`₹${Number(deal.budget||0).toLocaleString('en-IN')}`,        color:'#d4d4d8', emoji:'💰' },
                            { label:'Accepted', value:`₹${Number(deal.acceptedBudget||0).toLocaleString('en-IN')}`, color:'#60a5fa', emoji:'✅' },
                            { label:'Escrow',   value:`₹${Number(deal.escrowAmount||0).toLocaleString('en-IN')}`,   color:'#34d399', emoji:'🔒' },
                            { label:'Stage',    value: deal.negotiationStage || '-',                                 color:'#c084fc', emoji:'🧭' },
                          ].map(item => (
                            <div key={item.label} style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:16, padding:16 }}>
                              <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', fontWeight:700, margin:'0 0 6px 0' }}>{item.emoji} {item.label}</p>
                              <p style={{ fontSize:16, fontWeight:700, color:item.color, margin:0 }}>{item.value}</p>
                            </div>
                          ))}
                        </div>

                        {(deal.status === 'active' || deal.status === 'completed') && (
                          <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', position:'relative' }}>
                            <button onClick={() => handleDealAction(deal.id, 'release_funds')} disabled={isReleasing}
                              onMouseEnter={() => setHoveredBtn(`release-${deal.id}`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              style={{ position:'relative', display:'inline-flex', alignItems:'center', gap:8, padding:'12px 20px', borderRadius:14, border:'none', background: isReleasing ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#16a34a,#22c55e)', color: isReleasing ? '#52525b' : '#04130a', fontSize:13, fontWeight:700, cursor: isReleasing ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', transform: hoveredBtn === `release-${deal.id}` && !isReleasing ? 'translateY(-1px)' : 'translateY(0)', boxShadow: hoveredBtn === `release-${deal.id}` && !isReleasing ? '0 8px 24px rgba(34,197,94,0.25)' : '0 2px 10px rgba(34,197,94,0.12)', overflow:'hidden', opacity: isReleasing ? 0.5 : 1 }}>
                              {hoveredBtn === `release-${deal.id}` && !isReleasing && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)', backgroundSize:'200% 100%', animation:'adsGradShift 1.6s linear infinite', pointerEvents:'none' }} />}
                              {isReleasing ? <><Loader2 style={{ width:14, height:14, animation:'adsSpin 1s linear infinite' }} /> Releasing...</> : <>✅ Release Funds</>}
                            </button>

                            <button onClick={() => { if (confirm('Refund escrow back to artist?')) handleDealAction(deal.id, 'refund_artist') }} disabled={isRefunding}
                              onMouseEnter={() => setHoveredBtn(`refund-${deal.id}`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              style={{ position:'relative', display:'inline-flex', alignItems:'center', gap:8, padding:'12px 20px', borderRadius:14, border:'none', background: isRefunding ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#dc2626,#ef4444)', color: isRefunding ? '#52525b' : '#fff', fontSize:13, fontWeight:700, cursor: isRefunding ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', transform: hoveredBtn === `refund-${deal.id}` && !isRefunding ? 'translateY(-1px)' : 'translateY(0)', boxShadow: hoveredBtn === `refund-${deal.id}` && !isRefunding ? '0 8px 24px rgba(239,68,68,0.22)' : '0 2px 10px rgba(239,68,68,0.12)', overflow:'hidden', opacity: isRefunding ? 0.5 : 1 }}>
                              {hoveredBtn === `refund-${deal.id}` && !isRefunding && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)', backgroundSize:'200% 100%', animation:'adsGradShift 1.6s linear infinite', pointerEvents:'none' }} />}
                              {isRefunding ? <><Loader2 style={{ width:14, height:14, animation:'adsSpin 1s linear infinite' }} /> Refunding...</> : <>↩ Refund Artist</>}
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}