'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2 } from 'lucide-react'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'admin') {
      router.push('/')
      return
    }

    fetch('/api/admin/overview')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setStats(j.data)
        }
      })
      .finally(() => setLoading(false))
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <style jsx global>{`
          @keyframes adFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
          @keyframes adSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        `}</style>
        <div style={{
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          minHeight:'100vh',background:'#06060a',position:'relative',overflow:'hidden',
        }}>
          <div style={{position:'absolute',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(239,68,68,0.12) 0%,transparent 70%)',borderRadius:'50%',animation:'adFloatOrb 4s ease-in-out infinite'}}/>
          <Loader2 style={{animation:'adSpin 1s linear infinite',color:'#f87171',width:'36px',height:'36px',position:'relative',zIndex:1}}/>
          <p style={{marginTop:'16px',color:'#52525b',fontSize:'14px',position:'relative',zIndex:1}}>Loading dashboard...</p>
        </div>
      </AdminLayout>
    )
  }

  const cards = [
    { key:'songs',       label:'Songs',       value:stats.songs,       emoji:'🎵', color:'#f472b6', bg:'rgba(236,72,153,0.06)',  border:'rgba(236,72,153,0.12)', glow:'rgba(236,72,153,0.06)' },
    { key:'artists',     label:'Artists',      value:stats.artists,     emoji:'🎤', color:'#818cf8', bg:'rgba(99,102,241,0.06)',  border:'rgba(99,102,241,0.12)', glow:'rgba(99,102,241,0.06)' },
    { key:'fans',        label:'Fans',         value:stats.fans,        emoji:'👥', color:'#60a5fa', bg:'rgba(59,130,246,0.06)',  border:'rgba(59,130,246,0.12)', glow:'rgba(59,130,246,0.06)' },
    { key:'khapeetars',  label:'Khapeetars',   value:stats.khapeetars,  emoji:'⚡', color:'#34d399', bg:'rgba(16,185,129,0.06)',  border:'rgba(16,185,129,0.12)', glow:'rgba(16,185,129,0.06)' },
    { key:'investments', label:'Investments',  value:stats.investments, emoji:'💎', color:'#c084fc', bg:'rgba(168,85,247,0.06)',  border:'rgba(168,85,247,0.12)', glow:'rgba(168,85,247,0.06)' },
    { key:'deals',       label:'Deals',        value:stats.deals,       emoji:'🤝', color:'#fbbf24', bg:'rgba(245,158,11,0.06)',  border:'rgba(245,158,11,0.12)', glow:'rgba(245,158,11,0.06)' },
    { key:'revenue',     label:'Revenue',      value:`₹${stats.totalRevenue.toLocaleString('en-IN')}`, emoji:'💰', color:'#4ade80', bg:'rgba(74,222,128,0.06)', border:'rgba(74,222,128,0.12)', glow:'rgba(74,222,128,0.06)' },
  ]

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes adFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes adFloatOrb2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.03)}}
        @keyframes adFloatOrb3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(20px,25px) scale(1.03)}80%{transform:translate(-15px,-10px) scale(0.97)}}
        @keyframes adFadeInDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes adFadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes adFadeInStagger{from{opacity:0;transform:translateY(16px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes adGradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes adShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes adPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        @keyframes adCountUp{from{opacity:0;transform:translateY(8px) scale(0.9)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>

      <div style={{
        minHeight:'100vh',background:'#06060a',color:'#ffffff',
        position:'relative',overflow:'hidden',
        fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0}}>
          <div style={{position:'absolute',top:'-80px',right:'-40px',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(239,68,68,0.05) 0%,transparent 70%)',borderRadius:'50%',animation:'adFloatOrb 10s ease-in-out infinite'}}/>
          <div style={{position:'absolute',top:'45%',left:'-100px',width:'420px',height:'420px',background:'radial-gradient(circle,rgba(99,102,241,0.04) 0%,transparent 70%)',borderRadius:'50%',animation:'adFloatOrb2 13s ease-in-out infinite'}}/>
          <div style={{position:'absolute',bottom:'-60px',right:'30%',width:'320px',height:'320px',background:'radial-gradient(circle,rgba(16,185,129,0.03) 0%,transparent 70%)',borderRadius:'50%',animation:'adFloatOrb3 16s ease-in-out infinite'}}/>
          <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,backgroundSize:'60px 60px'}}/>
        </div>

        {/* Header */}
        <div style={{
          position:'relative',zIndex:1,
          borderBottom:'1px solid rgba(255,255,255,0.05)',
          background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)',
          backdropFilter:'blur(20px)',
          animation:'adFadeInDown 0.5s ease-out',
        }}>
          <div style={{padding:'28px 32px',maxWidth:'1400px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
              <div style={{
                width:'44px',height:'44px',borderRadius:'14px',
                background:'linear-gradient(135deg,rgba(239,68,68,0.14),rgba(249,115,22,0.10))',
                border:'1px solid rgba(239,68,68,0.16)',
                display:'flex',alignItems:'center',justifyContent:'center',
                boxShadow:'0 4px 16px rgba(239,68,68,0.08)',
                fontSize:'20px',
              }}>🛡️</div>
              <div>
                <h1 style={{fontSize:'22px',fontWeight:800,margin:0,background:'linear-gradient(135deg,#ffffff 0%,#a1a1aa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  Admin Dashboard
                </h1>
                <p style={{fontSize:'13px',color:'#52525b',margin:'2px 0 0 0',fontWeight:500}}>
                  Platform control center
                </p>
              </div>
            </div>

            {/* Status badge */}
            <div style={{
              display:'flex',alignItems:'center',gap:'8px',
              padding:'8px 16px',
              background:'rgba(16,185,129,0.06)',
              border:'1px solid rgba(16,185,129,0.12)',
              borderRadius:'12px',
            }}>
              <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'#34d399',boxShadow:'0 0 8px rgba(52,211,153,0.5)',animation:'adPulseDot 2s ease-in-out infinite'}}/>
              <span style={{fontSize:'12px',fontWeight:700,color:'#34d399'}}>All systems operational</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{position:'relative',zIndex:1,padding:'28px 32px 48px',maxWidth:'1400px',margin:'0 auto'}}>

          {/* Stats grid */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))',
            gap:'16px',
            marginBottom:'28px',
          }}>
            {cards.map((card, index) => {
              const isH = hoveredCard === card.key

              return (
                <div
                  key={card.key}
                  onMouseEnter={() => setHoveredCard(card.key)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    position:'relative',overflow:'hidden',
                    background: `linear-gradient(135deg, ${card.bg} 0%, rgba(255,255,255,0.02) 100%)`,
                    border:`1px solid ${isH ? card.border : 'rgba(255,255,255,0.06)'}`,
                    borderRadius:'22px',padding:'28px',
                    backdropFilter:'blur(14px)',
                    transition:'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                    transform: isH ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: isH
                      ? `0 16px 50px ${card.glow}, 0 0 60px ${card.glow}`
                      : '0 2px 10px rgba(0,0,0,0.12)',
                    animation:`adFadeInStagger 0.5s ease-out ${index * 0.07}s both`,
                    cursor:'default',
                  }}
                >
                  {/* Corner glow */}
                  <div style={{
                    position:'absolute',top:'-24px',right:'-24px',width:'120px',height:'120px',
                    background:`radial-gradient(circle, ${card.glow} 0%, transparent 70%)`,
                    borderRadius:'50%',pointerEvents:'none',
                    opacity: isH ? 1 : 0.4,
                    transition:'opacity 0.3s ease',
                  }}/>

                  {/* Shimmer on hover */}
                  {isH && (
                    <div style={{
                      position:'absolute',inset:0,
                      background:`linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)`,
                      backgroundSize:'200% 100%',
                      animation:'adShimmer 2s linear infinite',
                      pointerEvents:'none',
                    }}/>
                  )}

                  {/* Bottom accent line */}
                  <div style={{
                    position:'absolute',bottom:0,
                    left: isH ? '0' : '20%',
                    right: isH ? '0' : '20%',
                    height:'2px',
                    background:`linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                    transition:'all 0.4s ease',
                    opacity: isH ? 0.7 : 0.15,
                  }}/>

                  {/* Emoji icon */}
                  <div style={{
                    width:'48px',height:'48px',borderRadius:'16px',
                    background: card.bg,
                    border:`1px solid ${card.border}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'22px',
                    marginBottom:'18px',
                    position:'relative',
                    transition:'all 0.3s ease',
                    transform: isH ? 'scale(1.1) rotate(3deg)' : 'scale(1) rotate(0deg)',
                    boxShadow: isH ? `0 4px 20px ${card.glow}` : 'none',
                  }}>{card.emoji}</div>

                  {/* Label */}
                  <p style={{
                    fontSize:'12px',color:'#52525b',fontWeight:700,
                    textTransform:'uppercase',letterSpacing:'0.08em',
                    margin:'0 0 8px 0',position:'relative',
                  }}>{card.label}</p>

                  {/* Value */}
                  <p style={{
                    fontSize: card.key === 'revenue' ? '26px' : '32px',
                    fontWeight:800,
                    color: card.color,
                    margin:0,lineHeight:1.1,
                    position:'relative',
                    animation:'adCountUp 0.5s ease-out',
                    textShadow: isH ? `0 0 20px ${card.glow}` : 'none',
                    transition:'text-shadow 0.3s ease',
                  }}>
                    {card.value}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Quick overview bar */}
          <div style={{
            display:'flex',alignItems:'center',justifyContent:'space-between',
            flexWrap:'wrap',gap:'16px',
            background:'linear-gradient(135deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.01) 100%)',
            border:'1px solid rgba(255,255,255,0.05)',
            borderRadius:'20px',padding:'20px 24px',
            animation:'adFadeInUp 0.5s ease-out 0.6s both',
          }}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{
                width:'34px',height:'34px',borderRadius:'10px',
                background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.12)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:'16px',
              }}>📊</div>
              <span style={{fontSize:'14px',color:'#71717a',fontWeight:600}}>Platform Summary</span>
            </div>

            <div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
              {[
                { label:'Total Users', value: stats.artists + stats.fans + stats.khapeetars, color:'#60a5fa' },
                { label:'Active Deals', value: stats.deals, color:'#fbbf24' },
                { label:'Revenue', value:`₹${stats.totalRevenue.toLocaleString('en-IN')}`, color:'#4ade80' },
              ].map((item, i) => (
                <div key={i} style={{textAlign:'center'}}>
                  <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#3f3f46',fontWeight:700,margin:'0 0 4px 0'}}>{item.label}</p>
                  <p style={{fontSize:'16px',fontWeight:800,color:item.color,margin:0}}>{item.value}</p>
                </div>
              ))}
            </div>

            <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#4ade80',boxShadow:'0 0 6px rgba(74,222,128,0.5)',animation:'adPulseDot 2s ease-in-out infinite'}}/>
              <span style={{fontSize:'11px',color:'#52525b',fontWeight:600}}>Live data</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}