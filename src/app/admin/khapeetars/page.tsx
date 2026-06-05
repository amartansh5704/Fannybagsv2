'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2 } from 'lucide-react'

export default function AdminKhapeetarsPage() {
  const [khapeetars, setKhapeetars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    fetch('/api/admin/khapeetars')
      .then(r => r.json())
      .then(j => {
        if (j.success) setKhapeetars(j.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = searchQuery.trim()
    ? khapeetars.filter(k =>
        k.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.primaryRole?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : khapeetars

  if (loading) {
    return (
      <AdminLayout>
        <style jsx global>{`
          @keyframes akFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
          @keyframes akSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        `}</style>
        <div style={{
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          minHeight:'100vh',background:'#06060a',position:'relative',overflow:'hidden',
        }}>
          <div style={{position:'absolute',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(16,185,129,0.12) 0%,transparent 70%)',borderRadius:'50%',animation:'akFloatOrb 4s ease-in-out infinite'}}/>
          <Loader2 style={{animation:'akSpin 1s linear infinite',color:'#34d399',width:'36px',height:'36px',position:'relative',zIndex:1}}/>
          <p style={{marginTop:'16px',color:'#52525b',fontSize:'14px',position:'relative',zIndex:1}}>Loading khapeetars...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes akFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes akFloatOrb2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.03)}}
        @keyframes akFloatOrb3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(20px,25px) scale(1.03)}80%{transform:translate(-15px,-10px) scale(0.97)}}
        @keyframes akFadeInDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes akFadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes akFadeInStagger{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes akPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        @keyframes akGradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        input[type="text"]:focus{outline:none}
      `}</style>

      <div style={{
        minHeight:'100vh',background:'#06060a',color:'#ffffff',
        position:'relative',overflow:'hidden',
        fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0}}>
          <div style={{position:'absolute',top:'-80px',right:'-40px',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(16,185,129,0.05) 0%,transparent 70%)',borderRadius:'50%',animation:'akFloatOrb 10s ease-in-out infinite'}}/>
          <div style={{position:'absolute',top:'45%',left:'-100px',width:'420px',height:'420px',background:'radial-gradient(circle,rgba(20,184,166,0.04) 0%,transparent 70%)',borderRadius:'50%',animation:'akFloatOrb2 13s ease-in-out infinite'}}/>
          <div style={{position:'absolute',bottom:'-60px',right:'30%',width:'320px',height:'320px',background:'radial-gradient(circle,rgba(52,211,153,0.03) 0%,transparent 70%)',borderRadius:'50%',animation:'akFloatOrb3 16s ease-in-out infinite'}}/>
          <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,backgroundSize:'60px 60px'}}/>
        </div>

        {/* Header */}
        <div style={{
          position:'relative',zIndex:1,
          borderBottom:'1px solid rgba(255,255,255,0.05)',
          background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)',
          backdropFilter:'blur(20px)',
          animation:'akFadeInDown 0.5s ease-out',
        }}>
          <div style={{padding:'28px 32px',maxWidth:'1200px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
              <div style={{
                width:'44px',height:'44px',borderRadius:'14px',
                background:'linear-gradient(135deg,rgba(16,185,129,0.14),rgba(20,184,166,0.10))',
                border:'1px solid rgba(16,185,129,0.16)',
                display:'flex',alignItems:'center',justifyContent:'center',
                boxShadow:'0 4px 16px rgba(16,185,129,0.08)',
                fontSize:'20px',
              }}>⚡</div>
              <div>
                <h1 style={{fontSize:'22px',fontWeight:800,margin:0,background:'linear-gradient(135deg,#ffffff 0%,#a1a1aa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  All Khapeetars
                </h1>
                <p style={{fontSize:'13px',color:'#52525b',margin:'2px 0 0 0',fontWeight:500}}>
                  Manage registered khapeetar profiles
                </p>
              </div>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
              {/* Search */}
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',fontSize:'14px',pointerEvents:'none'}}>🔍</span>
                <input
                  type="text"
                  placeholder="Search name, city, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    width:'260px',
                    background: focused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                    border:`1px solid ${focused ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius:'12px',padding:'10px 14px 10px 38px',
                    color:'#fff',fontSize:'13px',
                    transition:'all 0.3s ease',fontFamily:'inherit',
                    boxSizing:'border-box',
                    boxShadow: focused ? '0 0 0 3px rgba(16,185,129,0.08)' : 'none',
                  }}
                />
              </div>

              {/* Count badge */}
              <div style={{
                display:'flex',alignItems:'center',gap:'6px',
                padding:'8px 14px',
                background:'rgba(16,185,129,0.06)',
                border:'1px solid rgba(16,185,129,0.12)',
                borderRadius:'10px',
              }}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#34d399',boxShadow:'0 0 6px rgba(52,211,153,0.5)',animation:'akPulseDot 2s ease-in-out infinite'}}/>
                <span style={{fontSize:'12px',fontWeight:700,color:'#34d399'}}>
                  {filtered.length} khapeetar{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{position:'relative',zIndex:1,padding:'28px 32px 48px',maxWidth:'1200px',margin:'0 auto'}}>
          {filtered.length === 0 ? (
            <div style={{
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
              padding:'100px 0',animation:'akFadeInUp 0.6s ease-out',
            }}>
              <div style={{width:'80px',height:'80px',borderRadius:'24px',background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px',fontSize:'32px'}}>⚡</div>
              <p style={{fontSize:'16px',fontWeight:600,color:'#52525b',margin:'0 0 4px 0'}}>
                {searchQuery ? 'No matching khapeetars' : 'No khapeetars yet'}
              </p>
              <p style={{fontSize:'13px',color:'#3f3f46',margin:0}}>
                {searchQuery ? 'Try a different search term' : 'Registered khapeetars will appear here'}
              </p>
            </div>
          ) : (
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))',
              gap:'16px',
            }}>
              {filtered.map((k, index) => {
                const isH = hoveredCard === k.id
                const initial = k.name ? k.name.charAt(0).toUpperCase() : '?'

                const colors = [
                  { bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.16)',  text:'#34d399',  grad:'linear-gradient(135deg,#10b981,#14b8a6)' },
                  { bg:'rgba(20,184,166,0.08)',   border:'rgba(20,184,166,0.16)',  text:'#2dd4bf',  grad:'linear-gradient(135deg,#14b8a6,#06b6d4)' },
                  { bg:'rgba(99,102,241,0.08)',   border:'rgba(99,102,241,0.16)',  text:'#818cf8',  grad:'linear-gradient(135deg,#6366f1,#3b82f6)' },
                  { bg:'rgba(168,85,247,0.08)',   border:'rgba(168,85,247,0.16)',  text:'#c084fc',  grad:'linear-gradient(135deg,#a855f7,#7c3aed)' },
                  { bg:'rgba(245,158,11,0.08)',   border:'rgba(245,158,11,0.16)',  text:'#fbbf24',  grad:'linear-gradient(135deg,#f59e0b,#eab308)' },
                  { bg:'rgba(59,130,246,0.08)',   border:'rgba(59,130,246,0.16)',  text:'#60a5fa',  grad:'linear-gradient(135deg,#3b82f6,#06b6d4)' },
                ]
                const cIdx = (k.name || '').length % colors.length
                const c = colors[cIdx]

                return (
                  <div
                    key={k.id}
                    onMouseEnter={() => setHoveredCard(k.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      position:'relative',overflow:'hidden',
                      background: isH
                        ? `linear-gradient(135deg,${c.bg},rgba(255,255,255,0.03))`
                        : 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
                      border:`1px solid ${isH ? c.border : 'rgba(255,255,255,0.06)'}`,
                      borderRadius:'22px',padding:'24px',
                      backdropFilter:'blur(16px)',
                      transition:'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                      transform: isH ? 'translateY(-4px)' : 'translateY(0)',
                      boxShadow: isH
                        ? `0 14px 40px rgba(0,0,0,0.3),0 0 50px ${c.bg}`
                        : '0 2px 10px rgba(0,0,0,0.1)',
                      animation:`akFadeInStagger 0.4s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* Top accent */}
                    <div style={{
                      position:'absolute',top:0,left:0,right:0,height:'2px',
                      background:`linear-gradient(90deg,transparent,${c.text},transparent)`,
                      opacity: isH ? 0.8 : 0.2,
                      transition:'opacity 0.3s ease',
                    }}/>

                    {/* Corner glow */}
                    <div style={{
                      position:'absolute',top:'-20px',right:'-20px',width:'120px',height:'120px',
                      background:`radial-gradient(circle,${c.bg} 0%,transparent 70%)`,
                      borderRadius:'50%',pointerEvents:'none',
                      opacity: isH ? 1 : 0.3,
                      transition:'opacity 0.3s ease',
                    }}/>

                    {/* Avatar + name */}
                    <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'16px',position:'relative'}}>
                      <div style={{
                        width:'52px',height:'52px',borderRadius:'16px',
                        background: c.grad,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:'20px',fontWeight:800,color:'#fff',
                        flexShrink:0,
                        boxShadow: isH ? `0 4px 20px ${c.bg}` : 'none',
                        transition:'all 0.3s ease',
                        transform: isH ? 'scale(1.06)' : 'scale(1)',
                      }}>
                        {initial}
                      </div>

                      <div style={{minWidth:0,flex:1}}>
                        <h2 style={{
                          fontSize:'16px',fontWeight:700,color:'#fff',margin:'0 0 3px 0',
                          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                        }}>
                          {k.name || 'Unnamed'}
                        </h2>

                        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
                          {k.city && (
                            <span style={{fontSize:'12px',color:'#71717a',fontWeight:500}}>
                              📍 {k.city}
                            </span>
                          )}
                          {k.primaryRole && (
                            <span style={{
                              fontSize:'11px',fontWeight:700,
                              padding:'2px 8px',
                              background: c.bg,
                              border:`1px solid ${c.border}`,
                              borderRadius:'6px',
                              color: c.text,
                              textTransform:'uppercase',
                              letterSpacing:'0.05em',
                            }}>
                              {k.primaryRole}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {k.bio ? (
                      <p style={{
                        fontSize:'13px',color:'#71717a',lineHeight:1.6,margin:'0 0 16px 0',
                        display:'-webkit-box',
                        WebkitLineClamp:'3',
                        WebkitBoxOrient:'vertical',
                        overflow:'hidden',
                        position:'relative',
                      }}>
                        {k.bio}
                      </p>
                    ) : (
                      <p style={{fontSize:'13px',color:'#3f3f46',margin:'0 0 16px 0',fontStyle:'italic'}}>
                        No bio available
                      </p>
                    )}

                    {/* Stats row */}
                    <div style={{
                      display:'flex',gap:'10px',flexWrap:'wrap',
                      paddingTop:'14px',
                      borderTop:'1px solid rgba(255,255,255,0.04)',
                      position:'relative',
                    }}>
                      {[
                        { label:'Experience', value: k.experienceYears ? `${k.experienceYears} yr${k.experienceYears !== 1 ? 's' : ''}` : '—', emoji:'📅' },
                        { label:'Projects',   value: k.projectsCompleted ? `${k.projectsCompleted}` : '—',      emoji:'✅' },
                        { label:'Rate',       value: k.startingBudget ? `₹${Number(k.startingBudget).toLocaleString('en-IN')}` : '—', emoji:'💰' },
                      ].map((stat) => (
                        <div key={stat.label} style={{
                          flex:'1 1 80px',
                          background:'rgba(255,255,255,0.03)',
                          border:'1px solid rgba(255,255,255,0.04)',
                          borderRadius:'12px',
                          padding:'10px 12px',
                          textAlign:'center',
                        }}>
                          <p style={{fontSize:'10px',color:'#3f3f46',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',margin:'0 0 4px 0'}}>
                            {stat.emoji} {stat.label}
                          </p>
                          <p style={{fontSize:'14px',fontWeight:700,color:c.text,margin:0}}>
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Work mode + availability */}
                    {(k.workMode || k.availability) && (
                      <div style={{
                        display:'flex',gap:'8px',marginTop:'12px',flexWrap:'wrap',
                        position:'relative',
                      }}>
                        {k.workMode && (
                          <span style={{
                            fontSize:'11px',fontWeight:600,padding:'4px 10px',
                            background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',
                            borderRadius:'8px',color:'#71717a',
                          }}>
                            {k.workMode === 'Remote' ? '🏠' : k.workMode === 'Onsite' ? '🏢' : '🔄'} {k.workMode}
                          </span>
                        )}
                        {k.availability && (
                          <span style={{
                            fontSize:'11px',fontWeight:600,padding:'4px 10px',
                            background: k.availability === 'Available Now'
                              ? 'rgba(16,185,129,0.06)' : k.availability === 'Busy'
                              ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                            border: k.availability === 'Available Now'
                              ? '1px solid rgba(16,185,129,0.12)' : k.availability === 'Busy'
                              ? '1px solid rgba(239,68,68,0.12)' : '1px solid rgba(245,158,11,0.12)',
                            borderRadius:'8px',
                            color: k.availability === 'Available Now' ? '#34d399'
                              : k.availability === 'Busy' ? '#f87171' : '#fbbf24',
                          }}>
                            {k.availability === 'Available Now' ? '🟢' : k.availability === 'Busy' ? '🔴' : '🟡'} {k.availability}
                          </span>
                        )}
                      </div>
                    )}
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