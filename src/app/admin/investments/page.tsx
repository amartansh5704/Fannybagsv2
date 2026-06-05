'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2 } from 'lucide-react'

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    fetch('/api/admin/investments')
      .then(r => r.json())
      .then(j => {
        if (j.success) setInvestments(j.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = searchQuery.trim()
    ? investments.filter(inv =>
        inv.campaign?.song?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.fan?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.campaign?.song?.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : investments

  const summary = useMemo(() => ({
    total: investments.length,
    totalAmount: investments.reduce((s, inv) => s + (inv.amount || 0), 0),
    totalStreams: investments.reduce((s, inv) => s + (inv.campaign?.song?.metrics?.totalStreams || 0), 0),
    totalRevenue: investments.reduce((s, inv) => s + (inv.campaign?.song?.metrics?.totalRevenue || 0), 0),
  }), [investments])

  if (loading) {
    return (
      <AdminLayout>
        <style jsx global>{`
          @keyframes aiFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
          @keyframes aiSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        `}</style>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#06060a',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)',borderRadius:'50%',animation:'aiFloatOrb 4s ease-in-out infinite'}}/>
          <Loader2 style={{animation:'aiSpin 1s linear infinite',color:'#c084fc',width:'36px',height:'36px',position:'relative',zIndex:1}}/>
          <p style={{marginTop:'16px',color:'#52525b',fontSize:'14px',position:'relative',zIndex:1}}>Loading investments...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes aiFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes aiFloatOrb2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.03)}}
        @keyframes aiFloatOrb3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(20px,25px) scale(1.03)}80%{transform:translate(-15px,-10px) scale(0.97)}}
        @keyframes aiFadeInDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes aiFadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes aiFadeInStagger{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes aiPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        @keyframes aiShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        input[type="text"]:focus{outline:none}
      `}</style>

      <div style={{
        minHeight:'100vh',background:'#06060a',color:'#ffffff',
        position:'relative',overflow:'hidden',
        fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0}}>
          <div style={{position:'absolute',top:'-80px',right:'-40px',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(168,85,247,0.05) 0%,transparent 70%)',borderRadius:'50%',animation:'aiFloatOrb 10s ease-in-out infinite'}}/>
          <div style={{position:'absolute',top:'45%',left:'-100px',width:'420px',height:'420px',background:'radial-gradient(circle,rgba(236,72,153,0.04) 0%,transparent 70%)',borderRadius:'50%',animation:'aiFloatOrb2 13s ease-in-out infinite'}}/>
          <div style={{position:'absolute',bottom:'-60px',right:'30%',width:'320px',height:'320px',background:'radial-gradient(circle,rgba(59,130,246,0.03) 0%,transparent 70%)',borderRadius:'50%',animation:'aiFloatOrb3 16s ease-in-out infinite'}}/>
          <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,backgroundSize:'60px 60px'}}/>
        </div>

        {/* Header */}
        <div style={{
          position:'relative',zIndex:1,
          borderBottom:'1px solid rgba(255,255,255,0.05)',
          background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)',
          backdropFilter:'blur(20px)',
          animation:'aiFadeInDown 0.5s ease-out',
        }}>
          <div style={{padding:'28px 32px',maxWidth:'1300px',margin:'0 auto'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px',marginBottom:'20px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                <div style={{
                  width:'44px',height:'44px',borderRadius:'14px',
                  background:'linear-gradient(135deg,rgba(168,85,247,0.14),rgba(139,92,246,0.10))',
                  border:'1px solid rgba(168,85,247,0.16)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  boxShadow:'0 4px 16px rgba(168,85,247,0.08)',
                  fontSize:'20px',
                }}>💎</div>
                <div>
                  <h1 style={{fontSize:'22px',fontWeight:800,margin:0,background:'linear-gradient(135deg,#ffffff 0%,#a1a1aa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                    All Investments
                  </h1>
                  <p style={{fontSize:'13px',color:'#52525b',margin:'2px 0 0 0',fontWeight:500}}>
                    Platform-wide investment overview
                  </p>
                </div>
              </div>

              <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',fontSize:'14px',pointerEvents:'none'}}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search song, fan, artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                      width:'260px',
                      background: focused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                      border:`1px solid ${focused ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius:'12px',padding:'10px 14px 10px 38px',
                      color:'#fff',fontSize:'13px',
                      transition:'all 0.3s ease',fontFamily:'inherit',boxSizing:'border-box',
                      boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.08)' : 'none',
                    }}
                  />
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 14px',background:'rgba(168,85,247,0.06)',border:'1px solid rgba(168,85,247,0.12)',borderRadius:'10px'}}>
                  <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#c084fc',boxShadow:'0 0 6px rgba(192,132,252,0.5)',animation:'aiPulseDot 2s ease-in-out infinite'}}/>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#c084fc'}}>{filtered.length} investment{filtered.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Summary stats */}
            <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
              {[
                { label:'Total Invested', value:`₹${summary.totalAmount.toLocaleString('en-IN')}`, color:'#c084fc', bg:'rgba(168,85,247,0.06)', border:'rgba(168,85,247,0.12)' },
                { label:'Total Streams',  value:summary.totalStreams.toLocaleString(), color:'#60a5fa', bg:'rgba(59,130,246,0.06)', border:'rgba(59,130,246,0.12)' },
                { label:'Total Revenue',  value:`₹${summary.totalRevenue.toLocaleString('en-IN')}`, color:'#4ade80', bg:'rgba(74,222,128,0.06)', border:'rgba(74,222,128,0.12)' },
              ].map((s,i) => {
                const sH = hoveredStat === s.label
                return (
                  <div
                    key={s.label}
                    onMouseEnter={() => setHoveredStat(s.label)}
                    onMouseLeave={() => setHoveredStat(null)}
                    style={{
                      flex:'1 1 200px',
                      background: sH ? `linear-gradient(135deg,${s.bg},rgba(255,255,255,0.03))` : s.bg,
                      border:`1px solid ${sH ? s.border : 'rgba(255,255,255,0.05)'}`,
                      borderRadius:'16px',padding:'18px',
                      transition:'all 0.3s ease',
                      transform: sH ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: sH ? `0 8px 24px rgba(0,0,0,0.2),0 0 30px ${s.bg}` : 'none',
                      animation:`aiFadeInStagger 0.4s ease-out ${0.1 + i * 0.06}s both`,
                    }}
                  >
                    <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#52525b',fontWeight:700,margin:'0 0 6px 0'}}>{s.label}</p>
                    <p style={{fontSize:'22px',fontWeight:800,color:s.color,margin:0,textShadow: sH ? `0 0 14px ${s.bg}` : 'none',transition:'text-shadow 0.3s ease'}}>{s.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{position:'relative',zIndex:1,padding:'28px 32px 48px',maxWidth:'1300px',margin:'0 auto'}}>
          {filtered.length === 0 ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'100px 0',animation:'aiFadeInUp 0.6s ease-out'}}>
              <div style={{width:'80px',height:'80px',borderRadius:'24px',background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px',fontSize:'32px'}}>💎</div>
              <p style={{fontSize:'16px',fontWeight:600,color:'#52525b',margin:'0 0 4px 0'}}>{searchQuery ? 'No matching investments' : 'No investments yet'}</p>
              <p style={{fontSize:'13px',color:'#3f3f46',margin:0}}>{searchQuery ? 'Try a different search' : 'Fan investments will appear here'}</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {filtered.map((inv, index) => {
                const isH = hoveredCard === inv.id
                const songTitle = inv.campaign?.song?.title || 'Untitled'
                const fanName = inv.fan?.name || 'Unknown Fan'
                const artistName = inv.campaign?.song?.artist?.name || 'Unknown Artist'
                const streams = inv.campaign?.song?.metrics?.totalStreams || 0
                const revenue = inv.campaign?.song?.metrics?.totalRevenue || 0

                const metrics = [
                  { key:'amount',    label:'💰 Amount',    value:`₹${(inv.amount || 0).toLocaleString('en-IN')}`, color:'#d4d4d8' },
                  { key:'ownership', label:'🎯 Ownership', value:`${inv.ownershipPct || 0}%`,                     color:'#f472b6' },
                  { key:'streams',   label:'🎧 Streams',   value:streams.toLocaleString(),                        color:'#60a5fa' },
                  { key:'revenue',   label:'💵 Revenue',   value:`₹${revenue.toLocaleString('en-IN')}`,           color:'#4ade80' },
                ]

                const colors = [
                  { bg:'rgba(168,85,247,0.06)', border:'rgba(168,85,247,0.14)', text:'#c084fc' },
                  { bg:'rgba(236,72,153,0.06)', border:'rgba(236,72,153,0.14)', text:'#f472b6' },
                  { bg:'rgba(59,130,246,0.06)', border:'rgba(59,130,246,0.14)', text:'#60a5fa' },
                  { bg:'rgba(16,185,129,0.06)', border:'rgba(16,185,129,0.14)', text:'#34d399' },
                  { bg:'rgba(245,158,11,0.06)', border:'rgba(245,158,11,0.14)', text:'#fbbf24' },
                  { bg:'rgba(99,102,241,0.06)', border:'rgba(99,102,241,0.14)', text:'#818cf8' },
                ]
                const cIdx = (songTitle || '').length % colors.length
                const c = colors[cIdx]

                return (
                  <div
                    key={inv.id}
                    onMouseEnter={() => setHoveredCard(inv.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
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
                        ? `0 14px 40px rgba(0,0,0,0.3), 0 0 50px ${c.bg}`
                        : '0 2px 10px rgba(0,0,0,0.1)',
                      animation:`aiFadeInStagger 0.4s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* Left accent */}
                    <div style={{position:'absolute',top:'16px',bottom:'16px',left:0,width:'3px',background:`linear-gradient(180deg,${c.text},transparent)`,borderRadius:'0 3px 3px 0',opacity:isH?1:0.4,transition:'opacity 0.3s ease'}}/>

                    {/* Corner glow */}
                    <div style={{position:'absolute',top:'-20px',right:'-20px',width:'120px',height:'120px',background:`radial-gradient(circle,${c.bg} 0%,transparent 70%)`,borderRadius:'50%',pointerEvents:'none',opacity:isH?1:0.3,transition:'opacity 0.3s ease'}}/>

                    {/* Header */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'16px',flexWrap:'wrap',marginBottom:'18px',position:'relative'}}>
                      <div style={{flex:1,minWidth:0}}>
                        <h2 style={{fontSize:'17px',fontWeight:700,color:'#fff',margin:'0 0 6px 0',lineHeight:1.3}}>{songTitle}</h2>
                        <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                          <p style={{fontSize:'13px',color:'#71717a',margin:0,fontWeight:500}}>
                            👤 <span style={{color:'#a1a1aa'}}>{fanName}</span>
                          </p>
                          <p style={{fontSize:'13px',color:'#71717a',margin:0,fontWeight:500}}>
                            🎤 <span style={{color:'#a1a1aa'}}>{artistName}</span>
                          </p>
                        </div>
                      </div>

                      {/* Ownership badge */}
                      <span style={{
                        padding:'6px 14px',
                        background:'rgba(236,72,153,0.08)',
                        border:'1px solid rgba(236,72,153,0.15)',
                        borderRadius:'12px',
                        fontSize:'13px',fontWeight:800,
                        color:'#f472b6',
                        flexShrink:0,
                      }}>
                        {inv.ownershipPct || 0}% owned
                      </span>
                    </div>

                    {/* Metrics */}
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',gap:'10px',position:'relative'}}>
                      {metrics.map((m) => {
                        const mH = hoveredStat === `${inv.id}-${m.key}`
                        return (
                          <div
                            key={m.key}
                            onMouseEnter={() => setHoveredStat(`${inv.id}-${m.key}`)}
                            onMouseLeave={() => setHoveredStat(null)}
                            style={{
                              background: mH ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)',
                              border:`1px solid ${mH ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`,
                              borderRadius:'14px',padding:'14px',
                              transition:'all 0.25s ease',
                              transform: mH ? 'translateY(-2px)' : 'translateY(0)',
                              cursor:'default',
                            }}
                          >
                            <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 6px 0'}}>{m.label}</p>
                            <p style={{
                              fontSize:'16px',fontWeight:700,color:m.color,margin:0,
                              textShadow: mH ? `0 0 12px ${m.color}30` : 'none',
                              transition:'text-shadow 0.3s ease',
                            }}>{m.value}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}