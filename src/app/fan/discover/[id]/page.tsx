'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import FanLayout from '@/components/fan/FanLayout'
import { Loader2, Music } from 'lucide-react'

export default function SongDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [song, setSong] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [investing, setInvesting] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  // Deposit modal state
  const [depositOpen, setDepositOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

  const loadWallet = async () => {
    const res = await fetch('/api/wallet')
    const data = await res.json()
    if (data.success) {
      setWallet(data.data.wallet)
    }
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/fan/login')
      return
    }
    Promise.all([
      fetch(`/api/songs/${params.id}`).then((r) => r.json()),
      fetch('/api/wallet').then((r) => r.json()),
    ])
      .then(([songRes, walletRes]) => {
        if (songRes.success) setSong(songRes.data)
        if (walletRes.success) setWallet(walletRes.data.wallet)
      })
      .finally(() => setLoading(false))
  }, [session, status])

  const deposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      alert('Enter valid amount')
      return
    }
    setDepositing(true)
    await fetch('/api/wallet/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(depositAmount) }),
    })
    setDepositAmount('')
    setDepositOpen(false)
    setDepositing(false)
    await loadWallet()
  }

  const invest = async () => {
    setInvesting(true)
    const res = await fetch('/api/investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: song.campaign.id,
        amount: Number(amount),
      }),
    })
    const json = await res.json()
    if (json.success) {
      alert('Investment successful')
      setAmount('')
      dialogRef.current?.close()
      await loadWallet()
    } else {
      alert(json.error)
    }
    setInvesting(false)
  }

  if (status === 'loading' || loading) {
    return (
      <FanLayout>
        <style jsx global>{`
          @keyframes sdFloatOrb { 0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)} }
          @keyframes sdSpin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        `}</style>
        <div style={{
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          minHeight:'100vh',background:'#06060a',position:'relative',overflow:'hidden',
        }}>
          <div style={{
            position:'absolute',width:'300px',height:'300px',
            background:'radial-gradient(circle,rgba(236,72,153,0.12) 0%,transparent 70%)',
            borderRadius:'50%',animation:'sdFloatOrb 4s ease-in-out infinite',
          }}/>
          <Loader2 style={{animation:'sdSpin 1s linear infinite',color:'#f472b6',width:'36px',height:'36px',position:'relative',zIndex:1}}/>
          <p style={{marginTop:'16px',color:'#52525b',fontSize:'14px',letterSpacing:'0.05em',position:'relative',zIndex:1}}>
            Loading song...
          </p>
        </div>
      </FanLayout>
    )
  }

  if (!song) {
    return (
      <FanLayout>
        <div style={{
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          minHeight:'100vh',background:'#06060a',
        }}>
          <div style={{width:'80px',height:'80px',borderRadius:'24px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
            <Music size={32} color="#27272a"/>
          </div>
          <p style={{fontSize:'16px',fontWeight:600,color:'#52525b'}}>Song not found</p>
        </div>
      </FanLayout>
    )
  }

  const progress = Math.min(100,(song.campaign.amountRaised / song.campaign.totalFundingAsk) * 100)
  const investAmount = Number(amount || 0)
  const insufficient = investAmount > (wallet?.balance || 0)
  const ownership = investAmount > 0
    ? ((investAmount / song.campaign.totalFundingAsk) * song.campaign.fanRevenueShare).toFixed(2)
    : '0'

  // Breakeven calculation
  const fanRevenueShare = song.campaign.fanRevenueShare || 0
  const totalFundingAsk = song.campaign.totalFundingAsk || 0
  const revenuePerStream = 0.05
  const fanPayoutPerStream = revenuePerStream * (fanRevenueShare / 100)
  const breakevenStreams = fanRevenueShare > 0
    ? Math.round(totalFundingAsk / fanPayoutPerStream)
    : 0

  const fmtStreams = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toLocaleString('en-IN')
  }

  const statCards = [
    { key:'target', label:'🎯 Target',     value:`₹${totalFundingAsk.toLocaleString('en-IN')}`,    color:'#d4d4d8', bg:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.06)' },
    { key:'raised', label:'💰 Raised',     value:`₹${song.campaign.amountRaised.toLocaleString('en-IN')}`, color:'#f472b6', bg:'rgba(236,72,153,0.06)', border:'rgba(236,72,153,0.12)' },
    { key:'share',  label:'📊 Revenue Share', value:`${fanRevenueShare}%`,                          color:'#c084fc', bg:'rgba(168,85,247,0.06)', border:'rgba(168,85,247,0.12)' },
    { key:'wallet', label:'👛 Wallet',     value:`₹${(wallet?.balance || 0).toLocaleString('en-IN')}`, color:'#34d399', bg:'rgba(16,185,129,0.06)', border:'rgba(16,185,129,0.12)' },
  ]

  return (
    <FanLayout>
      <style jsx global>{`
        @keyframes sdFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes sdFloatOrb2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.03)}}
        @keyframes sdFadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sdFadeInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes sdFadeInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes sdFadeInStagger{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sdGradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes sdShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes sdPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        @keyframes sdImageReveal{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
        @keyframes sdSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes sdModalIn{from{opacity:0;transform:scale(0.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes sdBackdropIn{from{opacity:0}to{opacity:1}}
        @keyframes sdBreakevenPulse{0%,100%{text-shadow:0 0 20px rgba(196,181,253,0.2)}50%{text-shadow:0 0 40px rgba(196,181,253,0.4)}}
        dialog::backdrop{background:rgba(0,0,0,0.75);backdrop-filter:blur(12px)}
        dialog{border:none;padding:0;background:transparent}
        dialog[open]{animation:sdModalIn 0.3s ease-out}
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type="number"]{-moz-appearance:textfield}
      `}</style>

      <div style={{
        minHeight:'100vh',background:'#06060a',color:'#ffffff',
        position:'relative',overflow:'hidden',
        fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0}}>
          <div style={{position:'absolute',top:'-80px',right:'-40px',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(236,72,153,0.06) 0%,transparent 70%)',borderRadius:'50%',animation:'sdFloatOrb 10s ease-in-out infinite'}}/>
          <div style={{position:'absolute',bottom:'10%',left:'-80px',width:'400px',height:'400px',background:'radial-gradient(circle,rgba(168,85,247,0.04) 0%,transparent 70%)',borderRadius:'50%',animation:'sdFloatOrb2 13s ease-in-out infinite'}}/>
          <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,backgroundSize:'60px 60px'}}/>
        </div>

        {/* Back */}
        <div style={{position:'relative',zIndex:1,padding:'24px 32px 0',maxWidth:'1200px',margin:'0 auto',animation:'sdFadeInUp 0.4s ease-out'}}>
          <button
            onClick={() => router.back()}
            onMouseEnter={() => setHovered('back')}
            onMouseLeave={() => setHovered(null)}
            style={{
              display:'inline-flex',alignItems:'center',gap:'8px',
              padding:'10px 20px',
              background:hovered==='back'?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.03)',
              border:`1px solid ${hovered==='back'?'rgba(255,255,255,0.14)':'rgba(255,255,255,0.07)'}`,
              borderRadius:'12px',color:hovered==='back'?'#fff':'#71717a',
              fontSize:'13px',fontWeight:600,cursor:'pointer',
              transition:'all 0.3s ease',fontFamily:'inherit',
              transform:hovered==='back'?'translateX(-2px)':'translateX(0)',
            }}
          >← Back</button>
        </div>

        {/* Content */}
        <div style={{position:'relative',zIndex:1,padding:'28px 32px 48px',maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(min(100%,420px),1fr))',
            gap:'32px',alignItems:'start',
          }}>

            {/* Left — Cover + metadata */}
            <div style={{animation:'sdFadeInLeft 0.6s ease-out'}}>
              {/* Cover */}
              <div style={{
                position:'relative',borderRadius:'20px',overflow:'hidden',
                aspectRatio:'1 / 1',background:'#0d0d12',
                boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
              }}>
                <div style={{position:'absolute',inset:'-20px',background:'radial-gradient(circle at center,rgba(236,72,153,0.08) 0%,transparent 70%)',filter:'blur(20px)',pointerEvents:'none',zIndex:0}}/>
                {song.coverArtUrl ? (
                  <img src={song.coverArtUrl} alt={song.title} style={{width:'100%',height:'100%',objectFit:'cover',position:'relative',zIndex:1,animation:'sdImageReveal 0.6s ease-out'}}/>
                ) : (
                  <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0d0d12,#141420)',position:'relative',zIndex:1}}>
                    <div style={{width:'80px',height:'80px',borderRadius:'24px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Music size={36} color="#27272a"/>
                    </div>
                  </div>
                )}
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:'40%',background:'linear-gradient(to top,rgba(6,6,10,0.7) 0%,transparent 100%)',zIndex:2}}/>
              </div>

              {/* Song info */}
              <div style={{marginTop:'24px'}}>
                <h1 style={{fontSize:'28px',fontWeight:800,margin:'0 0 6px 0',lineHeight:1.2,background:'linear-gradient(135deg,#ffffff 0%,#d4d4d8 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  {song.title}
                </h1>
                <p style={{fontSize:'15px',color:'#71717a',margin:'0 0 20px 0',fontWeight:500}}>
                  by <span style={{color:'#a1a1aa'}}>{song.artist.name}</span>
                </p>

                {song.demoUrl && (
                  <div style={{
                    background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))',
                    border:'1px solid rgba(255,255,255,0.06)',
                    borderRadius:'16px',padding:'16px',marginBottom:'20px',
                  }}>
                    <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#52525b',fontWeight:700,margin:'0 0 10px 0'}}>🎧 Preview</p>
                    <audio controls style={{width:'100%',height:'36px',borderRadius:'8px',filter:'invert(0.85) hue-rotate(180deg)'}}>
                      <source src={song.demoUrl}/>
                    </audio>
                  </div>
                )}

                {(song.campaign.campaignStory || song.description) && (
                  <div style={{
                    background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',
                    borderRadius:'16px',padding:'18px',borderLeft:'3px solid rgba(236,72,153,0.25)',
                  }}>
                    <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#52525b',fontWeight:700,margin:'0 0 8px 0'}}>📖 About</p>
                    <p style={{fontSize:'14px',color:'#a1a1aa',lineHeight:1.7,margin:0}}>
                      {song.campaign.campaignStory || song.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Stats, progress, breakeven, CTA */}
            <div style={{animation:'sdFadeInRight 0.6s ease-out',display:'flex',flexDirection:'column',gap:'20px'}}>
              {/* Stats grid */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                {statCards.map((s,i) => {
                  const isH = hoveredStat === s.key
                  return (
                    <div
                      key={s.key}
                      onMouseEnter={() => setHoveredStat(s.key)}
                      onMouseLeave={() => setHoveredStat(null)}
                      style={{
                        position:'relative',overflow:'hidden',
                        background:isH?`linear-gradient(135deg,${s.bg},rgba(255,255,255,0.03))`:s.bg,
                        border:`1px solid ${isH?s.border:'rgba(255,255,255,0.05)'}`,
                        borderRadius:'18px',padding:'20px',
                        transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                        transform:isH?'translateY(-3px)':'translateY(0)',
                        boxShadow:isH?`0 10px 30px rgba(0,0,0,0.2),0 0 30px ${s.bg}`:'0 2px 8px rgba(0,0,0,0.1)',
                        animation:`sdFadeInStagger 0.4s ease-out ${0.1+i*0.06}s both`,
                      }}
                    >
                      <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 8px 0'}}>{s.label}</p>
                      <p style={{fontSize:'22px',fontWeight:800,color:s.color,margin:0,textShadow:isH?`0 0 14px ${s.bg}`:'none',transition:'text-shadow 0.3s ease'}}>
                        {s.value}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Progress bar section */}
              <div style={{
                background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))',
                border:'1px solid rgba(255,255,255,0.06)',
                borderRadius:'18px',padding:'20px',
                animation:'sdFadeInStagger 0.5s ease-out 0.4s both',
              }}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#52525b',textTransform:'uppercase',letterSpacing:'0.08em'}}>Campaign Progress</span>
                  <span style={{fontSize:'13px',fontWeight:700,color:progress>=100?'#f472b6':'#71717a'}}>
                    {progress>=100?'🎉 Fully Funded':`${Math.round(progress)}%`}
                  </span>
                </div>
                <div style={{position:'relative',width:'100%',height:'8px',background:'rgba(255,255,255,0.05)',borderRadius:'4px',overflow:'hidden'}}>
                  <div style={{
                    height:'100%',width:`${progress}%`,
                    background:'linear-gradient(90deg,#ec4899,#f43f5e)',
                    backgroundSize:'200% 100%',
                    animation:'sdGradientShift 3s ease-in-out infinite',
                    borderRadius:'4px',
                    boxShadow:'0 0 12px rgba(236,72,153,0.3)',
                    transition:'width 0.5s ease',
                  }}/>
                  <div style={{
                    position:'absolute',top:0,left:0,width:`${progress}%`,height:'100%',
                    background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',
                    backgroundSize:'200% 100%',
                    animation:'sdShimmer 2s linear infinite',
                  }}/>
                </div>
              </div>

              {/* BREAKEVEN BAR */}
              {fanRevenueShare > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.04))',
                  border: '1px solid rgba(168,85,247,0.15)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  animation: 'sdFadeInStagger 0.5s ease-out 0.5s both',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'rgba(168,85,247,0.1)',
                      border: '1px solid rgba(168,85,247,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      flexShrink: 0,
                    }}>📐</div>
                    <span style={{
                      fontSize: '13px',
                      color: '#71717a',
                      fontWeight: 600,
                    }}>Breakeven Streams</span>
                  </div>

                  <span style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#d8b4fe',
                    letterSpacing: '-0.02em',
                    textShadow: '0 0 16px rgba(216,180,254,0.2)',
                  }}>
                    {fmtStreams(breakevenStreams)}
                  </span>
                </div>
              )}

              {/* Invest button */}
              <button
                onClick={() => dialogRef.current?.showModal()}
                onMouseEnter={() => setHovered('invest')}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position:'relative',width:'100%',padding:'18px',
                  background:'linear-gradient(135deg,#ec4899,#f43f5e)',
                  border:'none',borderRadius:'16px',
                  color:'#fff',fontSize:'15px',fontWeight:700,
                  cursor:'pointer',fontFamily:'inherit',letterSpacing:'0.01em',
                  transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  transform:hovered==='invest'?'translateY(-2px)':'translateY(0)',
                  boxShadow:hovered==='invest'
                    ?'0 8px 40px rgba(236,72,153,0.35),0 0 60px rgba(236,72,153,0.1)'
                    :'0 4px 20px rgba(236,72,153,0.2)',
                  overflow:'hidden',
                  animation:'sdFadeInStagger 0.5s ease-out 0.6s both',
                }}
              >
                {hovered==='invest' && (
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',backgroundSize:'200% 100%',animation:'sdShimmer 1.5s linear infinite',pointerEvents:'none'}}/>
                )}
                <span style={{position:'relative'}}>💎 Buy Revenue Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* INVEST DIALOG */}
        <dialog
          ref={dialogRef}
          style={{width:'520px',maxWidth:'95vw',maxHeight:'90vh',borderRadius:'24px',overflow:'hidden',boxShadow:'0 25px 80px rgba(0,0,0,0.6),0 0 60px rgba(236,72,153,0.08)'}}
        >
          <div style={{background:'#0f0f14',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'24px',overflow:'hidden',display:'flex',flexDirection:'column',maxHeight:'90vh'}}>
            {/* Header */}
            <div style={{
              padding:'24px 28px',borderBottom:'1px solid rgba(255,255,255,0.06)',
              display:'flex',alignItems:'center',justifyContent:'space-between',
              background:'linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%)',
              flexShrink: 0,
            }}>
              <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'linear-gradient(135deg,rgba(236,72,153,0.15),rgba(244,63,94,0.1))',border:'1px solid rgba(236,72,153,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>💎</div>
                <div>
                  <h2 style={{fontSize:'18px',fontWeight:700,color:'#fff',margin:0}}>Invest in Song</h2>
                  <p style={{fontSize:'12px',color:'#52525b',margin:'2px 0 0 0'}}>{song.title} · {song.artist.name}</p>
                </div>
              </div>
              <button
                onClick={() => dialogRef.current?.close()}
                onMouseEnter={() => setHovered('modal-close')}
                onMouseLeave={() => setHovered(null)}
                style={{width:'36px',height:'36px',borderRadius:'10px',background:hovered==='modal-close'?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:hovered==='modal-close'?'#fff':'#71717a',fontSize:'18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s ease',fontFamily:'inherit'}}
              >✕</button>
            </div>

            {/* Scrollable body */}
            <div style={{
              padding: '24px 28px',
              overflowY: 'auto',
              flex: 1,
              WebkitOverflowScrolling: 'touch',
            }}>
              {/* Wallet balance */}
              <div style={{
                display:'flex',alignItems:'center',justifyContent:'space-between',
                background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.12)',
                borderRadius:'14px',padding:'14px 18px',marginBottom:'20px',
              }}>
                <span style={{fontSize:'13px',color:'#34d399',fontWeight:600}}>👛 Wallet Balance</span>
                <span style={{fontSize:'15px',fontWeight:800,color:'#34d399'}}>
                  ₹{(wallet?.balance || 0).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Amount input */}
              <div style={{marginBottom:'16px'}}>
                <label style={{display:'block',fontSize:'11px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:focused==='invest-amount'?'#f472b6':'#52525b',marginBottom:'8px',transition:'color 0.3s ease'}}>
                  Investment Amount (₹)
                </label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:'16px',top:'50%',transform:'translateY(-50%)',color:'#52525b',fontSize:'16px',fontWeight:600,pointerEvents:'none'}}>₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => setFocused('invest-amount')}
                    onBlur={() => setFocused(null)}
                    placeholder="0"
                    style={{
                      width:'100%',
                      background:focused==='invest-amount'?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.03)',
                      border:`1px solid ${focused==='invest-amount'?'rgba(236,72,153,0.5)':'rgba(255,255,255,0.07)'}`,
                      borderRadius:'14px',padding:'16px 18px 16px 38px',
                      color:'#fff',fontSize:'18px',fontWeight:700,outline:'none',
                      transition:'all 0.3s ease',fontFamily:'inherit',boxSizing:'border-box' as const,
                      boxShadow:focused==='invest-amount'?'0 0 0 3px rgba(236,72,153,0.08)':'none',
                    }}
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'20px'}}>
                {[500,1000,2500,5000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setAmount(String(amt))}
                    onMouseEnter={() => setHovered(`qa-${amt}`)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      padding:'10px',borderRadius:'10px',
                      background:hovered===`qa-${amt}`?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.03)',
                      border:`1px solid ${hovered===`qa-${amt}`?'rgba(255,255,255,0.14)':'rgba(255,255,255,0.06)'}`,
                      color:hovered===`qa-${amt}`?'#fff':'#71717a',
                      fontSize:'12px',fontWeight:600,cursor:'pointer',
                      transition:'all 0.2s ease',fontFamily:'inherit',
                    }}
                  >₹{amt.toLocaleString('en-IN')}</button>
                ))}
              </div>

              {/* Ownership preview */}
              {investAmount > 0 && (
                <div style={{
                  background:'linear-gradient(135deg,rgba(236,72,153,0.06),rgba(168,85,247,0.04))',
                  border:'1px solid rgba(236,72,153,0.12)',
                  borderRadius:'14px',padding:'16px 18px',marginBottom:'16px',
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'13px',color:'#71717a',fontWeight:600}}>You will own</span>
                    <span style={{fontSize:'18px',fontWeight:800,color:'#f472b6'}}>{ownership}%</span>
                  </div>
                </div>
              )}

              {/* Insufficient warning */}
              {insufficient && (
                <div style={{
                  display:'flex',alignItems:'center',gap:'10px',
                  background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',
                  borderRadius:'14px',padding:'14px 16px',marginBottom:'16px',
                }}>
                  <span style={{fontSize:'14px'}}>⚠️</span>
                  <p style={{fontSize:'13px',color:'#f87171',margin:0,fontWeight:500}}>Insufficient wallet balance</p>
                </div>
              )}

              {/* Actions */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <button
                  onClick={() => setDepositOpen(true)}
                  onMouseEnter={() => setHovered('modal-deposit')}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    padding:'16px',borderRadius:'14px',
                    background:hovered==='modal-deposit'?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.04)',
                    border:`1px solid ${hovered==='modal-deposit'?'rgba(59,130,246,0.4)':'rgba(255,255,255,0.08)'}`,
                    color:hovered==='modal-deposit'?'#93c5fd':'#a1a1aa',
                    fontSize:'14px',fontWeight:600,cursor:'pointer',
                    transition:'all 0.3s ease',fontFamily:'inherit',
                  }}
                >+ Deposit Money</button>

                <button
                  onClick={invest}
                  disabled={insufficient || investing}
                  onMouseEnter={() => setHovered('modal-invest')}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position:'relative',padding:'16px',borderRadius:'14px',
                    background:(insufficient||investing)?'rgba(255,255,255,0.03)':'linear-gradient(135deg,#ec4899,#f43f5e)',
                    border:'none',
                    color:(insufficient||investing)?'#3f3f46':'#fff',
                    fontSize:'14px',fontWeight:700,
                    cursor:(insufficient||investing)?'not-allowed':'pointer',
                    transition:'all 0.3s ease',fontFamily:'inherit',
                    transform:hovered==='modal-invest'&&!insufficient&&!investing?'translateY(-1px)':'translateY(0)',
                    boxShadow:hovered==='modal-invest'&&!insufficient&&!investing?'0 6px 28px rgba(236,72,153,0.35)':'none',
                    opacity:(insufficient||investing)?0.4:1,
                    overflow:'hidden',
                  }}
                >
                  {hovered==='modal-invest'&&!insufficient&&!investing && (
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',backgroundSize:'200% 100%',animation:'sdShimmer 1.5s linear infinite',pointerEvents:'none'}}/>
                  )}
                  {investing ? (
                    <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',position:'relative'}}>
                      <div style={{width:'15px',height:'15px',border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'#fff',borderRadius:'50%',animation:'sdSpin 0.8s linear infinite'}}/>
                      Investing...
                    </span>
                  ) : (
                    <span style={{position:'relative'}}>💎 Confirm</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </dialog>

        {/* DEPOSIT OVERLAY */}
        {depositOpen && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setDepositOpen(false) }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(12px)',
              zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
              animation: 'sdBackdropIn 0.2s ease-out',
            }}
          >
            <div style={{
              width: '100%', maxWidth: '420px',
              background: '#0f0f14',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.05)',
              animation: 'sdModalIn 0.3s ease-out',
            }}>
              {/* Header */}
              <div style={{
                padding: '24px 28px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px',
                  }}>💰</div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Add Funds</h2>
                    <p style={{ fontSize: '12px', color: '#52525b', margin: '2px 0 0 0' }}>Deposit to your wallet</p>
                  </div>
                </div>
                <button
                  onClick={() => setDepositOpen(false)}
                  onMouseEnter={() => setHovered('dep-close')}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: hovered === 'dep-close' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: hovered === 'dep-close' ? '#fff' : '#71717a',
                    fontSize: '18px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease', fontFamily: 'inherit',
                  }}
                >✕</button>
              </div>

              {/* Body */}
              <div style={{ padding: '28px' }}>
                {/* Current balance */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px', padding: '14px 18px', marginBottom: '24px',
                }}>
                  <span style={{ fontSize: '13px', color: '#52525b', fontWeight: 500 }}>Current Balance</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#34d399' }}>
                    ₹{(wallet?.balance || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Amount */}
                <label style={{
                  display: 'block', fontSize: '11px', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: focused === 'dep-amount' ? '#60a5fa' : '#52525b',
                  marginBottom: '8px', transition: 'color 0.3s ease',
                }}>Amount (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                    color: '#52525b', fontSize: '16px', fontWeight: 600,
                  }}>₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    onFocus={() => setFocused('dep-amount')}
                    onBlur={() => setFocused(null)}
                    style={{
                      width: '100%',
                      background: focused === 'dep-amount' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${focused === 'dep-amount' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: '14px', padding: '16px 18px 16px 38px',
                      color: '#fff', fontSize: '20px', fontWeight: 800, outline: 'none',
                      transition: 'all 0.3s ease', fontFamily: 'inherit',
                      boxSizing: 'border-box' as const,
                      boxShadow: focused === 'dep-amount' ? '0 0 0 3px rgba(59,130,246,0.08)' : 'none',
                      marginBottom: '16px',
                    }}
                  />
                </div>

                {/* Quick amounts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
                  {[500, 1000, 2000, 5000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setDepositAmount(String(amt))}
                      onMouseEnter={() => setHovered(`dqa-${amt}`)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        padding: '10px', borderRadius: '10px',
                        background: hovered === `dqa-${amt}` ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${hovered === `dqa-${amt}` ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
                        color: hovered === `dqa-${amt}` ? '#fff' : '#71717a',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s ease', fontFamily: 'inherit',
                      }}
                    >₹{amt.toLocaleString('en-IN')}</button>
                  ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    onClick={() => setDepositOpen(false)}
                    onMouseEnter={() => setHovered('dep-cancel')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      padding: '16px', borderRadius: '14px',
                      background: hovered === 'dep-cancel' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${hovered === 'dep-cancel' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
                      color: hovered === 'dep-cancel' ? '#fff' : '#a1a1aa',
                      fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.2s ease', fontFamily: 'inherit',
                    }}
                  >Cancel</button>

                  <button
                    onClick={deposit}
                    disabled={depositing}
                    onMouseEnter={() => setHovered('dep-confirm')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      position: 'relative', padding: '16px', borderRadius: '14px',
                      background: depositing ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #2563eb, #0891b2)',
                      border: 'none',
                      color: depositing ? '#52525b' : '#fff',
                      fontSize: '14px', fontWeight: 700,
                      cursor: depositing ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease', fontFamily: 'inherit',
                      transform: hovered === 'dep-confirm' && !depositing ? 'translateY(-1px)' : 'translateY(0)',
                      boxShadow: hovered === 'dep-confirm' && !depositing ? '0 6px 28px rgba(37,99,235,0.35)' : 'none',
                      opacity: depositing ? 0.4 : 1,
                      overflow: 'hidden',
                    }}
                  >
                    {hovered === 'dep-confirm' && !depositing && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'sdShimmer 1.5s linear infinite', pointerEvents: 'none',
                      }} />
                    )}
                    {depositing ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative' }}>
                        <div style={{
                          width: '15px', height: '15px',
                          border: '2px solid rgba(255,255,255,0.2)',
                          borderTopColor: '#fff', borderRadius: '50%',
                          animation: 'sdSpin 0.8s linear infinite',
                        }} />
                        Processing...
                      </span>
                    ) : (
                      <span style={{ position: 'relative' }}>💰 Deposit</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FanLayout>
  )
}