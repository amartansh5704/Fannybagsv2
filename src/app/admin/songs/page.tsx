'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2 } from 'lucide-react'

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    fetch('/api/admin/songs')
      .then(r => r.json())
      .then(j => {
        if (j.success) setSongs(j.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = searchQuery.trim()
    ? songs.filter(s =>
        s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.language?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : songs

  const statusConfig: Record<string, { color: string; bg: string; border: string; emoji: string }> = {
    active:    { color: '#34d399', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.15)', emoji: '🟢' },
    draft:     { color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)', emoji: '📝' },
    completed: { color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', emoji: '✅' },
    funded:    { color: '#c084fc', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.15)', emoji: '💰' },
  }
  const defaultStatus = { color: '#a1a1aa', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.08)', emoji: '📋' }

  if (loading) {
    return (
      <AdminLayout>
        <style jsx global>{`
          @keyframes asFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
          @keyframes asSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        `}</style>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#06060a',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(239,68,68,0.12) 0%,transparent 70%)',borderRadius:'50%',animation:'asFloatOrb 4s ease-in-out infinite'}}/>
          <Loader2 style={{animation:'asSpin 1s linear infinite',color:'#f87171',width:'36px',height:'36px',position:'relative',zIndex:1}}/>
          <p style={{marginTop:'16px',color:'#52525b',fontSize:'14px',position:'relative',zIndex:1}}>Loading songs...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes asFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes asFloatOrb2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.03)}}
        @keyframes asFloatOrb3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(20px,25px) scale(1.03)}80%{transform:translate(-15px,-10px) scale(0.97)}}
        @keyframes asFadeInDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes asFadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes asFadeInStagger{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes asPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        @keyframes asGradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes asShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        input[type="text"]:focus{outline:none}
      `}</style>

      <div style={{
        minHeight:'100vh',background:'#06060a',color:'#ffffff',
        position:'relative',overflow:'hidden',
        fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0}}>
          <div style={{position:'absolute',top:'-80px',right:'-40px',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(239,68,68,0.05) 0%,transparent 70%)',borderRadius:'50%',animation:'asFloatOrb 10s ease-in-out infinite'}}/>
          <div style={{position:'absolute',top:'45%',left:'-100px',width:'420px',height:'420px',background:'radial-gradient(circle,rgba(168,85,247,0.04) 0%,transparent 70%)',borderRadius:'50%',animation:'asFloatOrb2 13s ease-in-out infinite'}}/>
          <div style={{position:'absolute',bottom:'-60px',right:'30%',width:'320px',height:'320px',background:'radial-gradient(circle,rgba(236,72,153,0.03) 0%,transparent 70%)',borderRadius:'50%',animation:'asFloatOrb3 16s ease-in-out infinite'}}/>
          <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,backgroundSize:'60px 60px'}}/>
        </div>

        {/* Header */}
        <div style={{
          position:'relative',zIndex:1,
          borderBottom:'1px solid rgba(255,255,255,0.05)',
          background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)',
          backdropFilter:'blur(20px)',
          animation:'asFadeInDown 0.5s ease-out',
        }}>
          <div style={{padding:'28px 32px',maxWidth:'1300px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
              <div style={{
                width:'44px',height:'44px',borderRadius:'14px',
                background:'linear-gradient(135deg,rgba(239,68,68,0.14),rgba(236,72,153,0.10))',
                border:'1px solid rgba(239,68,68,0.16)',
                display:'flex',alignItems:'center',justifyContent:'center',
                boxShadow:'0 4px 16px rgba(239,68,68,0.08)',
                fontSize:'20px',
              }}>🎵</div>
              <div>
                <h1 style={{fontSize:'22px',fontWeight:800,margin:0,background:'linear-gradient(135deg,#ffffff 0%,#a1a1aa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  All Songs
                </h1>
                <p style={{fontSize:'13px',color:'#52525b',margin:'2px 0 0 0',fontWeight:500}}>
                  Manage songs and campaigns
                </p>
              </div>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',fontSize:'14px',pointerEvents:'none'}}>🔍</span>
                <input
                  type="text"
                  placeholder="Search title, artist, language..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    width:'280px',
                    background: focused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                    border:`1px solid ${focused ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius:'12px',padding:'10px 14px 10px 38px',
                    color:'#fff',fontSize:'13px',
                    transition:'all 0.3s ease',fontFamily:'inherit',boxSizing:'border-box',
                    boxShadow: focused ? '0 0 0 3px rgba(239,68,68,0.08)' : 'none',
                  }}
                />
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 14px',background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.12)',borderRadius:'10px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#f87171',boxShadow:'0 0 6px rgba(248,113,113,0.5)',animation:'asPulseDot 2s ease-in-out infinite'}}/>
                <span style={{fontSize:'12px',fontWeight:700,color:'#f87171'}}>{filtered.length} song{filtered.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{position:'relative',zIndex:1,padding:'28px 32px 48px',maxWidth:'1300px',margin:'0 auto'}}>
          {filtered.length === 0 ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'100px 0',animation:'asFadeInUp 0.6s ease-out'}}>
              <div style={{width:'80px',height:'80px',borderRadius:'24px',background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px',fontSize:'32px'}}>🎵</div>
              <p style={{fontSize:'16px',fontWeight:600,color:'#52525b',margin:'0 0 4px 0'}}>{searchQuery ? 'No matching songs' : 'No songs yet'}</p>
              <p style={{fontSize:'13px',color:'#3f3f46',margin:0}}>{searchQuery ? 'Try a different search' : 'Songs will appear here when artists create them'}</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {filtered.map((song, index) => {
                const isH = hoveredCard === song.id
                const st = statusConfig[song.campaign?.status] || defaultStatus
                const progress = song.campaign?.totalFundingAsk > 0
                  ? Math.min(100, ((song.campaign?.amountRaised || 0) / song.campaign.totalFundingAsk) * 100)
                  : 0

                const colors = [
                  { bg:'rgba(239,68,68,0.06)',  border:'rgba(239,68,68,0.14)',  text:'#f87171',  grad:'linear-gradient(135deg,#ef4444,#f43f5e)' },
                  { bg:'rgba(236,72,153,0.06)', border:'rgba(236,72,153,0.14)', text:'#f472b6',  grad:'linear-gradient(135deg,#ec4899,#f43f5e)' },
                  { bg:'rgba(168,85,247,0.06)', border:'rgba(168,85,247,0.14)', text:'#c084fc',  grad:'linear-gradient(135deg,#a855f7,#7c3aed)' },
                  { bg:'rgba(59,130,246,0.06)', border:'rgba(59,130,246,0.14)', text:'#60a5fa',  grad:'linear-gradient(135deg,#3b82f6,#06b6d4)' },
                  { bg:'rgba(16,185,129,0.06)', border:'rgba(16,185,129,0.14)', text:'#34d399',  grad:'linear-gradient(135deg,#10b981,#14b8a6)' },
                  { bg:'rgba(245,158,11,0.06)', border:'rgba(245,158,11,0.14)', text:'#fbbf24',  grad:'linear-gradient(135deg,#f59e0b,#eab308)' },
                ]
                const cIdx = (song.title || '').length % colors.length
                const c = colors[cIdx]

                return (
                  <Link
                    key={song.id}
                    href={`/admin/songs/${song.id}`}
                    onMouseEnter={() => setHoveredCard(song.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display:'block',textDecoration:'none',color:'inherit',
                      position:'relative',overflow:'hidden',
                      background: isH
                        ? 'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0.025) 100%)'
                        : 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
                      border:`1px solid ${isH ? c.border : 'rgba(255,255,255,0.06)'}`,
                      borderRadius:'22px',padding:'24px',
                      backdropFilter:'blur(16px)',
                      transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                      transform: isH ? 'translateY(-3px)' : 'translateY(0)',
                      boxShadow: isH
                        ? `0 14px 40px rgba(0,0,0,0.3),0 0 50px ${c.bg}`
                        : '0 2px 10px rgba(0,0,0,0.1)',
                      animation:`asFadeInStagger 0.4s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* Left accent */}
                    <div style={{position:'absolute',top:'16px',bottom:'16px',left:0,width:'3px',background:`linear-gradient(180deg,${c.text},transparent)`,borderRadius:'0 3px 3px 0',opacity:isH?1:0.4,transition:'opacity 0.3s ease'}}/>

                    {/* Corner glow */}
                    <div style={{position:'absolute',top:'-20px',right:'-20px',width:'120px',height:'120px',background:`radial-gradient(circle,${c.bg} 0%,transparent 70%)`,borderRadius:'50%',pointerEvents:'none',opacity:isH?1:0.3,transition:'opacity 0.3s ease'}}/>

                    {/* Header */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'14px',flexWrap:'wrap',marginBottom:'18px',position:'relative'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'14px',flex:1,minWidth:0}}>
                        {/* Song icon */}
                        <div style={{
                          width:'48px',height:'48px',borderRadius:'14px',
                          background: song.coverArtUrl
                            ? `url(${song.coverArtUrl}) center/cover no-repeat`
                            : c.grad,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          flexShrink:0,
                          border:'1px solid rgba(255,255,255,0.06)',
                          boxShadow: isH ? `0 4px 20px ${c.bg}` : 'none',
                          transition:'all 0.3s ease',
                          transform: isH ? 'scale(1.06)' : 'scale(1)',
                          overflow:'hidden',
                        }}>
                          {!song.coverArtUrl && <span style={{fontSize:'20px'}}>🎵</span>}
                        </div>

                        <div style={{minWidth:0}}>
                          <h2 style={{fontSize:'17px',fontWeight:700,color:'#fff',margin:'0 0 4px 0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                            {song.title}
                          </h2>
                          <p style={{fontSize:'13px',color:'#71717a',margin:0,fontWeight:500}}>
                            🎤 <span style={{color:'#a1a1aa'}}>{song.artist?.name || 'Unknown'}</span>
                            {song.language && (
                              <span style={{color:'#3f3f46'}}> · {song.language}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Status badge */}
                      <span style={{
                        display:'inline-flex',alignItems:'center',gap:'6px',
                        padding:'6px 14px',borderRadius:'12px',
                        background: st.bg,border:`1px solid ${st.border}`,
                        fontSize:'11px',fontWeight:700,color:st.color,
                        textTransform:'uppercase',letterSpacing:'0.06em',
                        flexShrink:0,
                      }}>
                        <span style={{
                          width:'6px',height:'6px',borderRadius:'50%',
                          background:st.color,boxShadow:`0 0 6px ${st.color}`,
                          animation: song.campaign?.status === 'active' ? 'asPulseDot 2s ease-in-out infinite' : 'none',
                        }}/>
                        {song.campaign?.status || 'unknown'}
                      </span>
                    </div>

                    {/* Metrics grid */}
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',gap:'10px',marginBottom:'16px',position:'relative'}}>
                      {[
                        { label:'🌐 Language',     value: song.language || '—',                                                  color:'#a1a1aa' },
                        { label:'💰 Funding Ask',  value:`₹${(song.campaign?.totalFundingAsk || 0).toLocaleString('en-IN')}`,    color:'#f87171' },
                        { label:'📊 Revenue Share',value:`${song.campaign?.fanRevenueShare || 0}%`,                               color:'#c084fc' },
                        { label:'💵 Raised',       value:`₹${(song.campaign?.amountRaised || 0).toLocaleString('en-IN')}`,        color:'#34d399' },
                      ].map((m) => (
                        <div key={m.label} style={{
                          background:'rgba(255,255,255,0.025)',
                          border:'1px solid rgba(255,255,255,0.04)',
                          borderRadius:'14px',padding:'14px',
                        }}>
                          <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 6px 0'}}>{m.label}</p>
                          <p style={{fontSize:'15px',fontWeight:700,color:m.color,margin:0}}>{m.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    {song.campaign?.totalFundingAsk > 0 && (
                      <div style={{position:'relative'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                          <span style={{fontSize:'11px',fontWeight:700,color:'#52525b',textTransform:'uppercase',letterSpacing:'0.06em'}}>Funding Progress</span>
                          <span style={{fontSize:'12px',fontWeight:700,color:progress >= 100 ? '#34d399' : '#71717a'}}>
                            {progress >= 100 ? '🎉 Funded' : `${Math.round(progress)}%`}
                          </span>
                        </div>
                        <div style={{height:'5px',background:'rgba(255,255,255,0.04)',borderRadius:'3px',overflow:'hidden'}}>
                          <div style={{
                            height:'100%',width:`${progress}%`,
                            background: c.grad,
                            backgroundSize:'200% 100%',
                            animation: isH ? 'asGradientShift 2s ease-in-out infinite' : 'none',
                            borderRadius:'3px',
                            boxShadow: isH ? `0 0 8px ${c.bg}` : 'none',
                            transition:'width 0.5s ease, box-shadow 0.3s ease',
                          }}/>
                          {isH && (
                            <div style={{
                              position:'absolute',top:0,left:0,width:`${progress}%`,height:'5px',
                              background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',
                              backgroundSize:'200% 100%',
                              animation:'asShimmer 1.5s linear infinite',
                              borderRadius:'3px',
                            }}/>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View arrow */}
                    <div style={{
                      display:'flex',justifyContent:'flex-end',marginTop:'14px',
                      position:'relative',
                    }}>
                      <span style={{
                        fontSize:'12px',fontWeight:700,
                        color: isH ? c.text : '#27272a',
                        transition:'all 0.3s ease',
                        display:'inline-flex',alignItems:'center',gap:'4px',
                      }}>
                        View Details
                        <span style={{
                          display:'inline-block',
                          transition:'transform 0.3s ease',
                          transform: isH ? 'translateX(3px)' : 'translateX(0)',
                        }}>→</span>
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}