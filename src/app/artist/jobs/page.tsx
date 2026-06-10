'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import { Loader2, Plus, Briefcase, Clock, Users, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string; label: string }> = {
  open:      { color:'#34d399', bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.2)',  label:'Open'     },
  closed:    { color:'#f87171', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.2)',   label:'Closed'   },
  assigned:  { color:'#fbbf24', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.2)',  label:'Assigned' },
  completed: { color:'#a78bfa', bg:'rgba(139,92,246,0.1)',  border:'rgba(139,92,246,0.2)',  label:'Completed'},
  paid:      { color:'#34d399', bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.2)',  label:'Paid'     },
  refunded:  { color:'#f87171', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.2)',   label:'Refunded' },
}

export default function ArtistJobsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [jobs, setJobs]           = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [hoveredJob, setHoveredJob]   = useState<string | null>(null)
  const [hoveredKhap, setHoveredKhap] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/artist/login'); return }
    fetch('/api/jobs')
      .then(r => r.json())
      .then(j => { if (j.success) setJobs(j.data) })
      .finally(() => setLoading(false))
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <ArtistLayout>
        <style>{`@keyframes jSpin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <Loader2 style={{ animation:'jSpin 1s linear infinite', color:'#a855f7', width:32, height:32 }} />
          <p style={{ marginTop:14, color:'#52525b', fontSize:13 }}>Loading jobs...</p>
        </div>
      </ArtistLayout>
    )
  }

  return (
    <ArtistLayout>
      <style jsx global>{`
        @keyframes jSpin     { to{transform:rotate(360deg)} }
        @keyframes jFadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes jPulseDot { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Header */}
        <div style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', padding:'22px 32px' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,rgba(168,85,247,0.14),rgba(236,72,153,0.08))', border:'1px solid rgba(168,85,247,0.16)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Briefcase size={20} color="#c084fc" />
              </div>
              <div>
                <h1 style={{ fontSize:22, fontWeight:800, margin:0, background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>My Jobs</h1>
                <p style={{ fontSize:13, color:'#52525b', margin:'2px 0 0 0', fontWeight:500 }}>Manage your posted jobs</p>
              </div>
            </div>
            <Link href="/artist/jobs/new"
              style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 20px', background:'linear-gradient(135deg,#7c3aed,#db2777)', border:'none', borderRadius:14, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', textDecoration:'none', boxShadow:'0 4px 20px rgba(124,58,237,0.3)' }}>
              <Plus size={16} /> Post a Job
            </Link>
          </div>
        </div>

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'28px 32px 60px' }}>
          {jobs.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 0', gap:14 }}>
              <div style={{ width:72, height:72, borderRadius:20, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>📋</div>
              <p style={{ color:'#52525b', fontSize:16, fontWeight:600, margin:0 }}>No jobs posted yet</p>
              <p style={{ color:'#3f3f46', fontSize:13, margin:0 }}>Post your first job to find the right khapeetar</p>
              <Link href="/artist/jobs/new"
                style={{ marginTop:8, display:'flex', alignItems:'center', gap:8, padding:'11px 22px', background:'linear-gradient(135deg,#7c3aed,#db2777)', border:'none', borderRadius:13, color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none' }}>
                <Plus size={15} /> Post a Job
              </Link>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {jobs.map((job, idx) => {
                const s       = STATUS_STYLE[job.status] ?? STATUS_STYLE.open
                const isH     = hoveredJob  === job.id
                const isKhapH = hoveredKhap === job.id

                // khapeetar profile id comes from the included relation
                const khapeetarProfileId = job.khapeetarProfile?.id ?? null

                return (
                  <div
                    key={job.id}
                    onMouseEnter={() => setHoveredJob(job.id)}
                    onMouseLeave={() => setHoveredJob(null)}
                    style={{
                      display:'flex', alignItems:'center', gap:16, padding:'20px 24px',
                      background: isH ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isH ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius:18, textDecoration:'none', color:'inherit',
                      transition:'all .25s ease', cursor:'default',
                      transform: isH ? 'translateX(3px)' : 'translateX(0)',
                      animation:`jFadeInUp .35s ease-out ${idx * 0.05}s both`,
                    }}
                  >
                    {/* Icon */}
                    <Link href={`/artist/jobs/${job.id}`} style={{ textDecoration:'none', flexShrink:0 }}>
                      <div style={{ width:46, height:46, borderRadius:13, background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                        💼
                      </div>
                    </Link>

                    {/* Info — clicking title goes to job detail */}
                    <Link href={`/artist/jobs/${job.id}`} style={{ flex:1, minWidth:0, textDecoration:'none', color:'inherit' }}>
                      <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:'0 0 4px 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.title}</p>
                      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                        <span style={{ fontSize:12, color:'#71717a', fontWeight:500 }}>{job.category}</span>
                        <span style={{ fontSize:10, color:'#3f3f46' }}>·</span>
                        <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#71717a' }}>
                          <Users size={11} /> {job.proposals?.length ?? 0} proposal{job.proposals?.length !== 1 ? 's' : ''}
                        </span>
                        {job.deadline && (
                          <>
                            <span style={{ fontSize:10, color:'#3f3f46' }}>·</span>
                            <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#71717a' }}>
                              <Clock size={11} /> Due {new Date(job.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                            </span>
                          </>
                        )}

                        {/* ── KHAPEETAR PROFILE LINK — shown when job is assigned ── */}
                        {khapeetarProfileId && (
                          <>
                            <span style={{ fontSize:10, color:'#3f3f46' }}>·</span>
                            <button
                              onClick={e => { e.preventDefault(); router.push(`/artist/find-khapeetar/${khapeetarProfileId}`) }}
                              onMouseEnter={() => setHoveredKhap(job.id)}
                              onMouseLeave={() => setHoveredKhap(null)}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                background: isKhapH ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.06)',
                                border: `1px solid ${isKhapH ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.15)'}`,
                                borderRadius: 6, padding: '2px 8px',
                                color: isKhapH ? '#c4b5fd' : '#a78bfa',
                                fontSize: 11, fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s ease',
                                fontFamily: 'inherit',
                              }}
                            >
                              {job.khapeetarProfile?.name ?? 'Khapeetar'} <ExternalLink size={10} />
                            </button>
                          </>
                        )}
                      </div>
                    </Link>

                    {/* Right side */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
                      <div>
                        <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 2px 0' }}>Budget</p>
                        <p style={{ fontSize:15, fontWeight:800, color:'#c084fc', margin:0 }}>
                          ₹{Number(job.budget).toLocaleString('en-IN')}
                          {job.budgetMax ? ` – ₹${Number(job.budgetMax).toLocaleString('en-IN')}` : ''}
                        </p>
                      </div>
                      <div style={{ padding:'5px 12px', borderRadius:999, background:s.bg, border:`1px solid ${s.border}`, fontSize:11, fontWeight:700, color:s.color }}>{s.label}</div>
                      <Link href={`/artist/jobs/${job.id}`} style={{ textDecoration:'none' }}>
                        <ChevronRight size={16} color="#3f3f46" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ArtistLayout>
  )
}