'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2 } from 'lucide-react'

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    fetch('/api/admin/users?role=artist')
      .then(r => r.json())
      .then(j => {
        if (j.success) setArtists(j.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = searchQuery.trim()
    ? artists.filter(a =>
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : artists

  if (loading) {
    return (
      <AdminLayout>
        <style jsx global>{`
          @keyframes aaFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
          @keyframes aaSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        `}</style>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#06060a',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)',borderRadius:'50%',animation:'aaFloatOrb 4s ease-in-out infinite'}}/>
          <Loader2 style={{animation:'aaSpin 1s linear infinite',color:'#818cf8',width:'36px',height:'36px',position:'relative',zIndex:1}}/>
          <p style={{marginTop:'16px',color:'#52525b',fontSize:'14px',position:'relative',zIndex:1}}>Loading artists...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes aaFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes aaFloatOrb2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.03)}}
        @keyframes aaFloatOrb3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(20px,25px) scale(1.03)}80%{transform:translate(-15px,-10px) scale(0.97)}}
        @keyframes aaFadeInDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes aaFadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes aaFadeInStagger{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes aaGradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes aaPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        input[type="text"]:focus{outline:none}
      `}</style>

      <div style={{
        minHeight:'100vh',background:'#06060a',color:'#ffffff',
        position:'relative',overflow:'hidden',
        fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0}}>
          <div style={{position:'absolute',top:'-80px',right:'-40px',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 70%)',borderRadius:'50%',animation:'aaFloatOrb 10s ease-in-out infinite'}}/>
          <div style={{position:'absolute',top:'45%',left:'-100px',width:'420px',height:'420px',background:'radial-gradient(circle,rgba(168,85,247,0.04) 0%,transparent 70%)',borderRadius:'50%',animation:'aaFloatOrb2 13s ease-in-out infinite'}}/>
          <div style={{position:'absolute',bottom:'-60px',right:'30%',width:'320px',height:'320px',background:'radial-gradient(circle,rgba(236,72,153,0.03) 0%,transparent 70%)',borderRadius:'50%',animation:'aaFloatOrb3 16s ease-in-out infinite'}}/>
          <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,backgroundSize:'60px 60px'}}/>
        </div>

        {/* Header */}
        <div style={{
          position:'relative',zIndex:1,
          borderBottom:'1px solid rgba(255,255,255,0.05)',
          background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)',
          backdropFilter:'blur(20px)',
          animation:'aaFadeInDown 0.5s ease-out',
        }}>
          <div style={{padding:'28px 32px',maxWidth:'1200px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
              <div style={{
                width:'44px',height:'44px',borderRadius:'14px',
                background:'linear-gradient(135deg,rgba(99,102,241,0.14),rgba(168,85,247,0.10))',
                border:'1px solid rgba(99,102,241,0.16)',
                display:'flex',alignItems:'center',justifyContent:'center',
                boxShadow:'0 4px 16px rgba(99,102,241,0.08)',
                fontSize:'20px',
              }}>🎤</div>
              <div>
                <h1 style={{fontSize:'22px',fontWeight:800,margin:0,background:'linear-gradient(135deg,#ffffff 0%,#a1a1aa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  Artists
                </h1>
                <p style={{fontSize:'13px',color:'#52525b',margin:'2px 0 0 0',fontWeight:500}}>
                  Manage registered artists
                </p>
              </div>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
              {/* Search */}
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',fontSize:'14px',pointerEvents:'none'}}>🔍</span>
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    width:'240px',
                    background: focused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                    border:`1px solid ${focused ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius:'12px',padding:'10px 14px 10px 38px',
                    color:'#fff',fontSize:'13px',
                    transition:'all 0.3s ease',fontFamily:'inherit',
                    boxSizing:'border-box',
                    boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.08)' : 'none',
                  }}
                />
              </div>

              {/* Count badge */}
              <div style={{
                display:'flex',alignItems:'center',gap:'6px',
                padding:'8px 14px',
                background:'rgba(99,102,241,0.06)',
                border:'1px solid rgba(99,102,241,0.12)',
                borderRadius:'10px',
              }}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#818cf8',boxShadow:'0 0 6px rgba(129,140,248,0.5)',animation:'aaPulseDot 2s ease-in-out infinite'}}/>
                <span style={{fontSize:'12px',fontWeight:700,color:'#818cf8'}}>
                  {filtered.length} artist{filtered.length !== 1 ? 's' : ''}
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
              padding:'100px 0',animation:'aaFadeInUp 0.6s ease-out',
            }}>
              <div style={{width:'80px',height:'80px',borderRadius:'24px',background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px',fontSize:'32px'}}>
                🎤
              </div>
              <p style={{fontSize:'16px',fontWeight:600,color:'#52525b',margin:'0 0 4px 0'}}>
                {searchQuery ? 'No matching artists' : 'No artists yet'}
              </p>
              <p style={{fontSize:'13px',color:'#3f3f46',margin:0}}>
                {searchQuery ? 'Try a different search term' : 'Registered artists will appear here'}
              </p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {filtered.map((artist, index) => {
                const isH = hoveredCard === artist.id
                const initial = artist.name ? artist.name.charAt(0).toUpperCase() : '?'

                // Generate a consistent color from name
                const colors = [
                  { bg:'rgba(99,102,241,0.08)', border:'rgba(99,102,241,0.15)', text:'#818cf8', grad:'from-indigo-500 to-blue-500' },
                  { bg:'rgba(236,72,153,0.08)', border:'rgba(236,72,153,0.15)', text:'#f472b6', grad:'from-pink-500 to-rose-500' },
                  { bg:'rgba(168,85,247,0.08)', border:'rgba(168,85,247,0.15)', text:'#c084fc', grad:'from-purple-500 to-violet-500' },
                  { bg:'rgba(16,185,129,0.08)', border:'rgba(16,185,129,0.15)', text:'#34d399', grad:'from-emerald-500 to-teal-500' },
                  { bg:'rgba(59,130,246,0.08)', border:'rgba(59,130,246,0.15)', text:'#60a5fa', grad:'from-blue-500 to-cyan-500' },
                  { bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.15)', text:'#fbbf24', grad:'from-amber-500 to-yellow-500' },
                ]
                const colorIdx = (artist.name || '').length % colors.length
                const c = colors[colorIdx]

                const gradients = [
                  'linear-gradient(135deg, #6366f1, #3b82f6)',
                  'linear-gradient(135deg, #ec4899, #f43f5e)',
                  'linear-gradient(135deg, #a855f7, #7c3aed)',
                  'linear-gradient(135deg, #10b981, #14b8a6)',
                  'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  'linear-gradient(135deg, #f59e0b, #eab308)',
                ]
                const avatarGrad = gradients[colorIdx]

                return (
                  <div
                    key={artist.id}
                    onMouseEnter={() => setHoveredCard(artist.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      position:'relative',overflow:'hidden',
                      display:'flex',alignItems:'center',justifyContent:'space-between',
                      gap:'16px',flexWrap:'wrap',
                      padding:'20px 24px',
                      background: isH
                        ? 'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0.025) 100%)'
                        : 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
                      border:`1px solid ${isH ? c.border : 'rgba(255,255,255,0.06)'}`,
                      borderRadius:'20px',
                      backdropFilter:'blur(16px)',
                      transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                      transform: isH ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: isH
                        ? `0 10px 35px rgba(0,0,0,0.3), 0 0 40px ${c.bg}`
                        : '0 2px 10px rgba(0,0,0,0.1)',
                      animation:`aaFadeInStagger 0.4s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* Left accent */}
                    <div style={{
                      position:'absolute',top:'16px',bottom:'16px',left:0,width:'3px',
                      background:`linear-gradient(180deg, ${c.text}, transparent)`,
                      borderRadius:'0 3px 3px 0',
                      opacity: isH ? 1 : 0.4,
                      transition:'opacity 0.3s ease',
                    }}/>

                    {/* Corner glow */}
                    <div style={{
                      position:'absolute',top:'-20px',right:'-20px',width:'100px',height:'100px',
                      background:`radial-gradient(circle, ${c.bg} 0%, transparent 70%)`,
                      borderRadius:'50%',pointerEvents:'none',
                      opacity: isH ? 1 : 0.2,
                      transition:'opacity 0.3s ease',
                    }}/>

                    {/* Avatar + info */}
                    <div style={{display:'flex',alignItems:'center',gap:'16px',flex:1,minWidth:0,position:'relative'}}>
                      {/* Avatar */}
                      <div style={{
                        width:'48px',height:'48px',borderRadius:'14px',
                        background: avatarGrad,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:'18px',fontWeight:800,color:'#fff',
                        flexShrink:0,
                        boxShadow: isH ? `0 4px 20px ${c.bg}` : 'none',
                        transition:'all 0.3s ease',
                        transform: isH ? 'scale(1.06)' : 'scale(1)',
                      }}>
                        {initial}
                      </div>

                      <div style={{minWidth:0}}>
                        <p style={{
                          fontSize:'15px',fontWeight:700,color:'#fff',margin:'0 0 3px 0',
                          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                        }}>
                          {artist.name || 'Unnamed Artist'}
                        </p>
                        <p style={{
                          fontSize:'13px',color:'#52525b',margin:0,fontWeight:500,
                          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                        }}>
                          {artist.email || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Right side badges */}
                    <div style={{display:'flex',alignItems:'center',gap:'10px',flexShrink:0,position:'relative'}}>
                      {/* Role badge */}
                      <span style={{
                        padding:'5px 12px',
                        background: c.bg,
                        border:`1px solid ${c.border}`,
                        borderRadius:'10px',
                        fontSize:'11px',fontWeight:700,
                        color: c.text,
                        textTransform:'uppercase',
                        letterSpacing:'0.06em',
                      }}>
                        Artist
                      </span>

                      {/* Status dot */}
                      <div style={{
                        width:'8px',height:'8px',borderRadius:'50%',
                        background: '#34d399',
                        boxShadow:'0 0 8px rgba(52,211,153,0.5)',
                      }}/>

                      {/* Arrow */}
                      <span style={{
                        color: isH ? c.text : '#27272a',
                        transition:'all 0.3s ease',
                        transform: isH ? 'translateX(2px)' : 'translateX(0)',
                        fontSize:'16px',
                        display:'inline-block',
                      }}>→</span>
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