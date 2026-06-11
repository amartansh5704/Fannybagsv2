'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import FanLayout from '@/components/fan/FanLayout'
import { Loader2, Music } from 'lucide-react'

export default function FanDiscoverPage() {
  const { data: session, status } = useSession()

  const [songs, setSongs]           = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    // ── Load for EVERYONE — no auth required ─────────────────────────────
    if (status === 'loading') return
    fetch('/api/fan/discover')
      .then(r => r.json())
      .then(j => { if (j.success) setSongs(j.data) })
      .finally(() => setLoading(false))
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <FanLayout>
        <style jsx global>{`
          @keyframes fanDiscoverFloatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
          @keyframes fanDiscoverSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        `}</style>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', width:'300px', height:'300px', background:'radial-gradient(circle,rgba(236,72,153,0.12) 0%,transparent 70%)', borderRadius:'50%', animation:'fanDiscoverFloatOrb 4s ease-in-out infinite' }} />
          <Loader2 style={{ animation:'fanDiscoverSpin 1s linear infinite', color:'#f472b6', width:'36px', height:'36px', position:'relative', zIndex:1 }} />
          <p style={{ marginTop:'16px', color:'#52525b', fontSize:'14px', letterSpacing:'0.05em', position:'relative', zIndex:1 }}>Discovering campaigns...</p>
        </div>
      </FanLayout>
    )
  }

  return (
    <FanLayout>
      <style jsx global>{`
        @keyframes fanDiscoverFloatOrb  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
        @keyframes fanDiscoverFloatOrb2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-15px) scale(1.03)} }
        @keyframes fanDiscoverFloatOrb3 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(20px,25px) scale(1.03)} 80%{transform:translate(-15px,-10px) scale(0.97)} }
        @keyframes fanDiscoverFadeInDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fanDiscoverFadeInUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes fanDiscoverFadeInStagger { from{opacity:0;transform:translateY(16px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes fanDiscoverGradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes fanDiscoverShimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fanDiscoverPulseDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }
        @keyframes fanDiscoverImageReveal { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', position:'relative', overflow:'hidden', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient bg */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-80px', right:'-40px', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(236,72,153,0.06) 0%,transparent 70%)', borderRadius:'50%', animation:'fanDiscoverFloatOrb 10s ease-in-out infinite' }} />
          <div style={{ position:'absolute', top:'40%', left:'-100px', width:'400px', height:'400px', background:'radial-gradient(circle,rgba(168,85,247,0.04) 0%,transparent 70%)', borderRadius:'50%', animation:'fanDiscoverFloatOrb2 13s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'-60px', right:'30%', width:'350px', height:'350px', background:'radial-gradient(circle,rgba(244,114,182,0.03) 0%,transparent 70%)', borderRadius:'50%', animation:'fanDiscoverFloatOrb3 16s ease-in-out infinite' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        {/* Header */}
        <div style={{ position:'relative', zIndex:1, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)', backdropFilter:'blur(20px)', animation:'fanDiscoverFadeInDown 0.5s ease-out' }}>
          <div style={{ padding:'28px 32px', maxWidth:'1400px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'linear-gradient(135deg,rgba(236,72,153,0.14),rgba(244,63,94,0.08))', border:'1px solid rgba(236,72,153,0.16)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(236,72,153,0.08)' }}>
                <Music size={20} color="#f472b6" />
              </div>
              <div>
                <h1 style={{ fontSize:'22px', fontWeight:800, margin:0, background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Discover Songs
                </h1>
                <p style={{ fontSize:'13px', color:'#52525b', margin:'2px 0 0 0', fontWeight:500 }}>
                  Invest in live artist campaigns
                </p>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              {songs.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 16px', background:'rgba(236,72,153,0.06)', border:'1px solid rgba(236,72,153,0.12)', borderRadius:'12px' }}>
                  <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#f472b6', boxShadow:'0 0 8px rgba(244,114,182,0.5)', animation:'fanDiscoverPulseDot 2s ease-in-out infinite' }} />
                  <span style={{ fontSize:'12px', fontWeight:700, color:'#f472b6' }}>
                    {songs.length} live campaign{songs.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Guest CTA — sign up prompt in header */}
              {!session && (
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Link href="/fan/login" style={{ padding:'8px 16px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#a1a1aa', fontSize:13, fontWeight:600, textDecoration:'none', transition:'all 0.2s' }}>
                    Log in
                  </Link>
                  <Link href="/fan/signup" style={{ padding:'8px 18px', borderRadius:10, background:'linear-gradient(135deg,#ec4899,#f43f5e)', border:'none', color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                    Sign up to Invest
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guest banner */}
        {!session && (
          <div style={{ position:'relative', zIndex:1, padding:'0 32px', maxWidth:'1400px', margin:'16px auto 0' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, padding:'16px 22px', background:'linear-gradient(135deg,rgba(236,72,153,0.06),rgba(168,85,247,0.04))', border:'1px solid rgba(236,72,153,0.12)', borderRadius:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:18 }}>💎</span>
                <p style={{ margin:0, fontSize:13, color:'#a1a1aa', fontWeight:500 }}>
                  <strong style={{ color:'#fff' }}>Browse freely.</strong> Create a free account to invest and earn royalties from your favourite songs.
                </p>
              </div>
              <Link href="/fan/signup" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 20px', background:'linear-gradient(135deg,#ec4899,#f43f5e)', borderRadius:10, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', whiteSpace:'nowrap', boxShadow:'0 4px 16px rgba(236,72,153,0.25)' }}>
                Create Free Account →
              </Link>
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ position:'relative', zIndex:1, padding:'28px 32px', maxWidth:'1400px', margin:'0 auto' }}>
          {songs.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'100px 0', animation:'fanDiscoverFadeInUp 0.6s ease-out' }}>
              <div style={{ width:'80px', height:'80px', borderRadius:'24px', background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px' }}>
                <Music size={32} color="#27272a" />
              </div>
              <p style={{ fontSize:'16px', fontWeight:600, color:'#52525b', margin:'0 0 4px 0' }}>No live campaigns</p>
              <p style={{ fontSize:'13px', color:'#3f3f46', margin:0 }}>Active artist campaigns will appear here</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'20px' }}>
              {songs.map((song, index) => {
                const progress  = Math.min(100, (song.campaign.amountRaised / song.campaign.totalFundingAsk) * 100)
                const isHovered = hoveredCard === song.id

                return (
                  <Link
                    key={song.id}
                    href={`/fan/discover/${song.id}`}
                    onMouseEnter={() => setHoveredCard(song.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display:'block', textDecoration:'none', color:'inherit',
                      position:'relative', overflow:'hidden',
                      background: isHovered
                        ? 'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)'
                        : 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
                      border:`1px solid ${isHovered ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius:'20px', backdropFilter:'blur(20px)',
                      transition:'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                      transform: isHovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                      boxShadow: isHovered
                        ? '0 20px 60px rgba(0,0,0,0.4),0 0 40px rgba(236,72,153,0.08)'
                        : '0 2px 12px rgba(0,0,0,0.15)',
                      animation:`fanDiscoverFadeInStagger 0.5s ease-out ${index * 0.07}s both`,
                    }}
                  >
                    {/* Top hover accent */}
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#ec4899,#a855f7,transparent)', backgroundSize:'200% 100%', animation: isHovered ? 'fanDiscoverGradientShift 2s ease-in-out infinite' : 'none', opacity: isHovered ? 1 : 0, transition:'opacity 0.3s ease', zIndex:2 }} />

                    {/* Cover Art */}
                    <div style={{ position:'relative', aspectRatio:'1/1', overflow:'hidden', background:'#0d0d12' }}>
                      {song.coverArtUrl ? (
                        <img src={song.coverArtUrl} alt={song.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.5s cubic-bezier(0.4,0,0.2,1)', transform: isHovered ? 'scale(1.06)' : 'scale(1)', animation:'fanDiscoverImageReveal 0.5s ease-out' }} />
                      ) : (
                        <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0d0d12,#141420)' }}>
                          <div style={{ width:'64px', height:'64px', borderRadius:'20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Music size={28} color="#27272a" />
                          </div>
                        </div>
                      )}

                      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'60%', background:'linear-gradient(to top,rgba(6,6,10,0.85) 0%,transparent 100%)', opacity: isHovered ? 1 : 0, transition:'opacity 0.4s ease' }} />

                      {/* Hover CTA — changes based on auth */}
                      {isHovered && (
                        <div style={{ position:'absolute', bottom:'14px', left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'center', gap:'6px', padding:'8px 18px', background:'linear-gradient(135deg,rgba(236,72,153,0.9),rgba(244,63,94,0.9))', borderRadius:'20px', fontSize:'12px', fontWeight:700, color:'#fff', whiteSpace:'nowrap', backdropFilter:'blur(8px)', boxShadow:'0 4px 20px rgba(236,72,153,0.3)', animation:'fanDiscoverFadeInUp 0.2s ease-out' }}>
                          {session ? '✦ Invest Now' : '✦ View & Invest'}
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div style={{ padding:'20px' }}>
                      <div style={{ marginBottom:'16px' }}>
                        <h3 style={{ fontSize:'16px', fontWeight:700, color:'#fff', margin:'0 0 4px 0', lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {song.title}
                        </h3>
                        <p style={{ fontSize:'13px', color:'#71717a', margin:0, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          by <span style={{ color:'#a1a1aa' }}>{song.artist?.name}</span>
                        </p>
                      </div>

                      {/* Funding */}
                      <div>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'10px' }}>
                          <div>
                            <p style={{ fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', fontWeight:600, margin:'0 0 2px 0' }}>💰 Raised</p>
                            <p style={{ fontSize:'16px', fontWeight:800, color:'#f472b6', margin:0, textShadow: isHovered ? '0 0 12px rgba(244,114,182,0.3)' : 'none', transition:'text-shadow 0.3s ease' }}>
                              ₹{song.campaign.amountRaised.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <p style={{ fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', fontWeight:600, margin:'0 0 2px 0' }}>🎯 Target</p>
                            <p style={{ fontSize:'13px', fontWeight:600, color:'#71717a', margin:0 }}>
                              ₹{song.campaign.totalFundingAsk.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ position:'relative', width:'100%', height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'3px', overflow:'hidden', marginBottom:'10px' }}>
                          <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#ec4899,#f43f5e)', backgroundSize:'200% 100%', animation: isHovered ? 'fanDiscoverGradientShift 2s ease-in-out infinite' : 'none', borderRadius:'3px', boxShadow: isHovered ? '0 0 10px rgba(236,72,153,0.4)' : 'none', transition:'box-shadow 0.3s ease' }} />
                          {isHovered && (
                            <div style={{ position:'absolute', top:0, left:0, width:`${progress}%`, height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', backgroundSize:'200% 100%', animation:'fanDiscoverShimmer 1.5s linear infinite' }} />
                          )}
                        </div>

                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <span style={{ fontSize:'11px', fontWeight:700, color: progress >= 100 ? '#f472b6' : '#52525b' }}>
                            {progress >= 100 ? '🎉 Fully Funded' : `${Math.round(progress)}% funded`}
                          </span>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'4px 10px', background:'rgba(236,72,153,0.08)', border:'1px solid rgba(236,72,153,0.15)', borderRadius:'20px', fontSize:'11px', fontWeight:700, color:'#f472b6' }}>
                            {song.campaign.fanRevenueShare}% share
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </FanLayout>
  )
}