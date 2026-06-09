'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import { Loader2, Search, Briefcase, Clock, Users } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  'All', 'Mixing', 'Mastering', 'Beat Production', 'Recording',
  'Video Editing', 'Reel Editing', 'Cover Art', 'Graphic Design',
  'Marketing', 'Playlist Promotion', 'Social Media Management',
  'Content Creation', 'Other',
]

const SORTS = [
  { val: 'newest',      label: 'Newest' },
  { val: 'oldest',      label: 'Oldest' },
  { val: 'budget_high', label: 'Highest Budget' },
]

export default function KhapeetarJobsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [jobs, setJobs]         = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort]         = useState('newest')
  const [hoveredJob, setHoveredJob] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/khapeetar/login'); return }
    fetchJobs()
  }, [session, status, category, sort])

  const fetchJobs = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)          params.set('search',   search)
    if (category !== 'All') params.set('category', category)
    params.set('sort', sort)

    fetch(`/api/khapeetar/jobs?${params}`)
      .then(r => r.json())
      .then(j => { if (j.success) setJobs(j.data) })
      .finally(() => setLoading(false))
  }

  if (status === 'loading') {
    return (
      <KhapeetarLayout>
        <style>{`@keyframes kjSpin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <Loader2 style={{ animation:'kjSpin 1s linear infinite', color:'#10b981', width:32, height:32 }} />
        </div>
      </KhapeetarLayout>
    )
  }

  return (
    <KhapeetarLayout>
      <style jsx global>{`
        @keyframes kjSpin    { to{transform:rotate(360deg)} }
        @keyframes kjFadeIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kjPulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        .kj-search::placeholder { color:#3f3f46; }
        .kj-search:focus { outline:none; border-color:rgba(16,185,129,0.4); box-shadow:0 0 0 3px rgba(16,185,129,0.08); }
        .kj-pill { padding:7px 14px; border-radius:999px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.03); color:#52525b; transition:all .2s ease; font-family:inherit; }
        .kj-pill:hover { border-color:rgba(255,255,255,0.14); color:#a1a1aa; }
        .kj-pill.active { background:rgba(16,185,129,0.12); border-color:rgba(16,185,129,0.35); color:#34d399; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-80px', right:'-40px', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        {/* Header */}
        <div style={{ position:'relative', zIndex:1, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', padding:'22px 32px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,rgba(16,185,129,0.14),rgba(20,184,166,0.08))', border:'1px solid rgba(16,185,129,0.16)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Briefcase size={20} color="#34d399" />
              </div>
              <div>
                <h1 style={{ fontSize:22, fontWeight:800, margin:0, background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Find Jobs</h1>
                <p style={{ fontSize:13, color:'#52525b', margin:'2px 0 0 0', fontWeight:500 }}>Browse open jobs from artists</p>
              </div>
            </div>
            {!loading && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.12)', borderRadius:12 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'#34d399', animation:'kjPulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize:12, fontWeight:700, color:'#34d399' }}>{jobs.length} open job{jobs.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ position:'relative', zIndex:1, maxWidth:1200, margin:'0 auto', padding:'24px 32px 48px' }}>

          {/* Search */}
          <form onSubmit={e => { e.preventDefault(); fetchJobs() }} style={{ position:'relative', marginBottom:20 }}>
            <Search size={15} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'#52525b', pointerEvents:'none' }} />
            <input className="kj-search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search jobs by title, category..."
              style={{ width:'100%', height:52, paddingLeft:44, paddingRight:120, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, color:'#fff', fontSize:14, boxSizing:'border-box', transition:'all .2s' }} />
            <button type="submit"
              style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', height:36, padding:'0 18px', border:'none', borderRadius:10, background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              Search
            </button>
          </form>

          {/* Filters */}
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, padding:'18px 22px', marginBottom:24, display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#3f3f46', margin:'0 0 10px 0' }}>Category</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)} className={`kj-pill${category === c ? ' active' : ''}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#3f3f46', margin:'0 0 10px 0' }}>Sort By</p>
              <div style={{ display:'flex', gap:6 }}>
                {SORTS.map(s => (
                  <button key={s.val} onClick={() => setSort(s.val)} className={`kj-pill${sort === s.val ? ' active' : ''}`}>{s.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 0', gap:14 }}>
              <Loader2 style={{ animation:'kjSpin 1s linear infinite', color:'#10b981', width:32, height:32 }} />
              <p style={{ color:'#52525b', fontSize:14, margin:0 }}>Finding jobs...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && jobs.length === 0 && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 0', gap:12 }}>
              <Briefcase size={40} color="#27272a" />
              <p style={{ color:'#52525b', fontSize:15, fontWeight:600, margin:0 }}>No jobs found</p>
              <p style={{ color:'#3f3f46', fontSize:13, margin:0 }}>Try adjusting your filters or check back later</p>
            </div>
          )}

          {/* Grid */}
          {!loading && jobs.length > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
              {jobs.map((job, idx) => {
                const isH = hoveredJob === job.id
                return (
                  <Link key={job.id} href={`/khapeetar/jobs/${job.id}`}
                    onMouseEnter={() => setHoveredJob(job.id)}
                    onMouseLeave={() => setHoveredJob(null)}
                    style={{
                      display:'block', textDecoration:'none', color:'inherit',
                      background: isH ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isH ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius:20, padding:'22px', transition:'all .3s ease',
                      transform: isH ? 'translateY(-4px)' : 'translateY(0)',
                      boxShadow: isH ? '0 16px 48px rgba(0,0,0,0.3),0 0 30px rgba(16,185,129,0.06)' : '0 2px 10px rgba(0,0,0,0.1)',
                      animation:`kjFadeIn .4s ease-out ${idx * 0.05}s both`,
                      position:'relative', overflow:'hidden',
                    }}>

                    {/* Top accent on hover */}
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#10b981,#14b8a6,transparent)', opacity: isH ? 1 : 0, transition:'opacity .3s ease' }} />

                    {/* Category badge */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                      <span style={{ padding:'4px 12px', borderRadius:999, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.15)', fontSize:11, fontWeight:700, color:'#34d399' }}>
                        {job.category}
                      </span>
                      <span style={{ fontSize:11, color:'#3f3f46', fontWeight:500 }}>
                        {new Date(job.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize:16, fontWeight:700, color:'#fff', margin:'0 0 8px 0', lineHeight:1.3 }}>{job.title}</h3>

                    {/* Artist */}
                    <p style={{ fontSize:12, color:'#71717a', margin:'0 0 12px 0' }}>by <span style={{ color:'#a1a1aa' }}>{job.artist?.name}</span></p>

                    {/* Description snippet */}
                    <p style={{ fontSize:13, color:'#71717a', margin:'0 0 16px 0', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as any, overflow:'hidden' }}>
                      {job.description}
                    </p>

                    {/* Footer */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#3f3f46', margin:'0 0 2px 0' }}>Budget</p>
                        <p style={{ fontSize:16, fontWeight:800, color:'#34d399', margin:0 }}>
                          ₹{Number(job.budget).toLocaleString('en-IN')}
                          {job.budgetMax ? ` – ₹${Number(job.budgetMax).toLocaleString('en-IN')}` : ''}
                        </p>
                      </div>
                      <div style={{ display:'flex', gap:12, textAlign:'right' }}>
                        {job.deadline && (
                          <div>
                            <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#3f3f46', margin:'0 0 2px 0' }}>Due</p>
                            <p style={{ fontSize:12, fontWeight:600, color:'#fbbf24', margin:0, display:'flex', alignItems:'center', gap:4 }}>
                              <Clock size={11} /> {new Date(job.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                            </p>
                          </div>
                        )}
                        <div>
                          <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#3f3f46', margin:'0 0 2px 0' }}>Proposals</p>
                          <p style={{ fontSize:12, fontWeight:600, color:'#a1a1aa', margin:0, display:'flex', alignItems:'center', gap:4 }}>
                            <Users size={11} /> {job.proposals?.length ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isH && (
                      <div style={{ marginTop:14, padding:'10px', borderRadius:10, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.15)', textAlign:'center', fontSize:13, fontWeight:700, color:'#34d399' }}>
                        ✦ View & Apply
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </KhapeetarLayout>
  )
}