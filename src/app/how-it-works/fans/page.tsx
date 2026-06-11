'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Music, TrendingUp, Wallet, FileText, BarChart3,
  ChevronRight, ArrowRight, Shield, Zap, DollarSign,
  Headphones, PieChart, Users, Star, CheckCircle,
  Calculator,
} from 'lucide-react'

const STEPS = [
  {
    num: '01', icon: Headphones, title: 'Discover Songs',
    description: 'Browse live campaigns from independent artists. Listen to demos, read their stories, and find music you believe in.',
    detail: 'Every song on FannyBags is a real project by a real artist looking for supporters to bring their music to life.',
    color: '#f472b6', bg: 'rgba(236,72,153,',
  },
  {
    num: '02', icon: DollarSign, title: 'Invest Any Amount',
    description: 'Choose how much to invest — starting from just ₹100. Your money goes directly toward producing, mixing, and promoting the song.',
    detail: 'You get a proportional ownership of the song\'s streaming revenue based on your investment.',
    color: '#c084fc', bg: 'rgba(168,85,247,',
  },
  {
    num: '03', icon: FileText, title: 'Get a Legal Contract',
    description: 'A Royalty Share Agreement is auto-generated and downloaded instantly. This is your proof of ownership.',
    detail: 'The contract spells out your exact revenue share percentage, breakeven streams, and all legal terms.',
    color: '#60a5fa', bg: 'rgba(59,130,246,',
  },
  {
    num: '04', icon: TrendingUp, title: 'Earn Royalties Forever',
    description: 'Every time the song streams on Spotify, Apple Music, YouTube, or any platform — you earn your share automatically.',
    detail: 'Royalties are distributed periodically to your wallet. Track your earnings in real time from your dashboard.',
    color: '#34d399', bg: 'rgba(16,185,129,',
  },
]

const FAQS = [
  { q: 'How much can I earn?', a: 'It depends on how many streams the song gets. Use the Hit Calculator above to estimate returns based on different stream counts and rates.' },
  { q: 'Is my money safe?', a: 'Your investment goes into the song\'s production and promotion. A legally binding Royalty Share Agreement protects your ownership. However, like any investment, returns are not guaranteed — they depend on the song\'s streaming performance.' },
  { q: 'When do I get paid?', a: 'Royalties are distributed periodically as streaming revenue comes in. You can track and withdraw your earnings from your wallet anytime.' },
  { q: 'Can I invest in multiple songs?', a: 'Absolutely! Diversifying across multiple songs is encouraged — just like how music labels invest in many artists.' },
]

const STREAM_MARKS = [100_000, 250_000, 500_000, 1_000_000, 2_500_000, 5_000_000, 7_500_000, 10_000_000]

const RATE_MIN = 0.05
const RATE_MAX = 0.09
const FAN_SHARE_PCT = 50

const fmtStreams = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString('en-IN')
}
const fmtINR = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

export default function HowItWorksFansPage() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn]   = useState<string | null>(null)
  const [openFaq, setOpenFaq]         = useState<number | null>(null)
  const [hoveredResult, setHoveredResult] = useState<string | null>(null)

  // Calculator state
  const [fundingAsk, setFundingAsk]   = useState(15000)
  const [streamIndex, setStreamIndex] = useState(5)
  const [investment, setInvestment]   = useState('500')

  const streams    = STREAM_MARKS[streamIndex]
  const investAmt  = Math.max(0, Number(investment) || 0)
  const streamPct  = (streamIndex / (STREAM_MARKS.length - 1)) * 100
  const fundPct    = ((fundingAsk - 15000) / 5000) * 100

  // Ownership is fixed at 50% fan pool
  const ownershipPct = fundingAsk > 0 ? (investAmt / fundingAsk) * FAN_SHARE_PCT : 0

  // Calculate at LOW rate (0.05)
  const revLow        = streams * RATE_MIN
  const fanPoolLow    = revLow * (FAN_SHARE_PCT / 100)
  const earningsLow   = revLow * (ownershipPct / 100)
  const roiLow        = investAmt > 0 ? ((earningsLow - investAmt) / investAmt) * 100 : 0
  const isProfitLow   = earningsLow > investAmt

  // Calculate at HIGH rate (0.09)
  const revHigh       = streams * RATE_MAX
  const fanPoolHigh   = revHigh * (FAN_SHARE_PCT / 100)
  const earningsHigh  = revHigh * (ownershipPct / 100)
  const roiHigh       = investAmt > 0 ? ((earningsHigh - investAmt) / investAmt) * 100 : 0
  const isProfitHigh  = earningsHigh > investAmt

  // Breakeven at lowest rate (worst case)
  const breakevenStreams = ownershipPct > 0 ? Math.round(investAmt / (RATE_MIN * (ownershipPct / 100))) : 0

  // For the profit/loss banner — use low end as conservative
  const isProfit = isProfitLow

  // Range formatter
  const rangeINR = (lo: number, hi: number) => {
    if (lo === hi) return fmtINR(lo)
    return `${fmtINR(lo)} – ${fmtINR(hi)}`
  }
  const rangeROI = (lo: number, hi: number) => {
    const fmt = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(0)}%`
    if (Math.round(lo) === Math.round(hi)) return fmt(lo)
    return `${fmt(lo)} to ${fmt(hi)}`
  }

  return (
    <>
      <style>{`
        @keyframes hiwFadeInUp      { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hiwFadeInDown    { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hiwFadeInStagger { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hiwFloat         { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.04)} }
        @keyframes hiwFloat2        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes hiwGradShift     { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes hiwPulse         { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes hiwCountUp       { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .hiw-range {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 8px; border-radius: 999px;
          outline: none; cursor: pointer; transition: background 0.2s;
        }
        .hiw-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 24px; height: 24px; border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #f43f5e);
          border: 3px solid #06060a;
          box-shadow: 0 0 12px rgba(236,72,153,0.4), 0 2px 8px rgba(0,0,0,0.3);
          cursor: grab; transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .hiw-range::-webkit-slider-thumb:hover { transform: scale(1.15); box-shadow: 0 0 20px rgba(236,72,153,0.5); }
        .hiw-range::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.1); }
        .hiw-range::-moz-range-thumb {
          width: 24px; height: 24px; border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #f43f5e);
          border: 3px solid #06060a; box-shadow: 0 0 12px rgba(236,72,153,0.4); cursor: grab;
        }
        .hiw-range-purple::-webkit-slider-thumb { background: linear-gradient(135deg, #8b5cf6, #c084fc); box-shadow: 0 0 12px rgba(139,92,246,0.4), 0 2px 8px rgba(0,0,0,0.3); }
        .hiw-range-purple::-moz-range-thumb { background: linear-gradient(135deg, #8b5cf6, #c084fc); }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type="number"] { -moz-appearance:textfield; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', position:'relative', overflow:'hidden' }}>

        {/* Ambient */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-100px', right:'-60px', width:600, height:600, background:'radial-gradient(circle,rgba(236,72,153,0.06) 0%,transparent 70%)', borderRadius:'50%', animation:'hiwFloat 12s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:500, height:500, background:'radial-gradient(circle,rgba(168,85,247,0.05) 0%,transparent 70%)', borderRadius:'50%', animation:'hiwFloat2 16s ease-in-out infinite' }} />
          <div style={{ position:'absolute', top:'40%', left:'60%', width:400, height:400, background:'radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        {/* NAV */}
        <nav style={{ position:'relative', zIndex:10, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', animation:'hiwFadeInDown 0.5s ease-out' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#ec4899,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Music size={18} color="#fff" />
              </div>
              <span style={{ fontSize:18, fontWeight:800, color:'#fff', letterSpacing:'-0.02em' }}>FannyBags</span>
            </Link>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Link href="/fan/login" style={{ padding:'8px 16px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#a1a1aa', fontSize:13, fontWeight:600, textDecoration:'none' }}>Log in</Link>
              <Link href="/fan/signup"
                onMouseEnter={() => setHoveredBtn('nav-signup')} onMouseLeave={() => setHoveredBtn(null)}
                style={{ padding:'8px 20px', borderRadius:10, background:'linear-gradient(135deg,#ec4899,#f43f5e)', color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', transition:'all 0.2s', transform: hoveredBtn==='nav-signup' ? 'translateY(-1px)' : 'none', boxShadow: hoveredBtn==='nav-signup' ? '0 4px 20px rgba(236,72,153,0.3)' : 'none' }}>
                Start Investing
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ position:'relative', zIndex:1, maxWidth:900, margin:'0 auto', padding:'80px 32px 60px', textAlign:'center', animation:'hiwFadeInUp 0.6s ease-out' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 20px', background:'rgba(236,72,153,0.08)', border:'1px solid rgba(236,72,153,0.15)', borderRadius:999, marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#f472b6', animation:'hiwPulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize:12, fontWeight:700, color:'#f472b6', letterSpacing:'0.05em' }}>FOR FANS & INVESTORS</span>
          </div>
          <h1 style={{ fontSize:'clamp(36px,6vw,56px)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.03em', margin:'0 0 20px 0' }}>
            <span style={{ background:'linear-gradient(135deg,#fff 0%,#d4d4d8 50%,#f472b6 100%)', backgroundSize:'200% 100%', animation:'hiwGradShift 6s ease-in-out infinite', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Invest in Music.
            </span>
            <br /><span style={{ color:'#f472b6' }}>Earn Like a Label.</span>
          </h1>
          <p style={{ fontSize:18, color:'#71717a', lineHeight:1.7, maxWidth:620, margin:'0 auto 36px' }}>
            Music labels earn billions by investing in artists early. Now you can do the same — invest as little as ₹100, own a share of streaming royalties, and earn every time the song plays.
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
            <Link href="/fan/discover"
              onMouseEnter={() => setHoveredBtn('hero-discover')} onMouseLeave={() => setHoveredBtn(null)}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 28px', background:'linear-gradient(135deg,#ec4899,#f43f5e)', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', transition:'all 0.3s', transform: hoveredBtn==='hero-discover' ? 'translateY(-2px)' : 'none', boxShadow: hoveredBtn==='hero-discover' ? '0 8px 40px rgba(236,72,153,0.35)' : '0 4px 20px rgba(236,72,153,0.2)' }}>
              Browse Songs <ArrowRight size={16} />
            </Link>
            <Link href="/fan/signup" style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 28px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, color:'#a1a1aa', fontSize:15, fontWeight:600, textDecoration:'none' }}>
              Create Free Account
            </Link>
          </div>
        </section>

        {/* LABEL COMPARISON */}
        <section style={{ position:'relative', zIndex:1, maxWidth:900, margin:'0 auto', padding:'0 32px 60px' }}>
          <div style={{ textAlign:'center', marginBottom:40, animation:'hiwFadeInUp 0.6s ease-out 0.1s both' }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'#52525b', marginBottom:10 }}>THE OPPORTUNITY</p>
            <h2 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 10px 0' }}>Think Like a Music Label</h2>
            <p style={{ fontSize:15, color:'#52525b', maxWidth:500, margin:'0 auto' }}>Labels make money by investing in artists early. Here&apos;s how you do the same.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, borderRadius:20, overflow:'hidden', animation:'hiwFadeInUp 0.6s ease-out 0.2s both' }}>
            <div style={{ background:'rgba(236,72,153,0.08)', padding:'16px 24px', borderBottom:'1px solid rgba(236,72,153,0.12)' }}>
              <p style={{ fontSize:13, fontWeight:700, color:'#f472b6', margin:0 }}>🏢 Music Label</p>
            </div>
            <div style={{ background:'rgba(16,185,129,0.08)', padding:'16px 24px', borderBottom:'1px solid rgba(16,185,129,0.12)' }}>
              <p style={{ fontSize:13, fontWeight:700, color:'#34d399', margin:0 }}>💎 You (Fan Investor)</p>
            </div>
            {[
              ['Invests ₹10-50 lakhs per artist', 'Invest as low as ₹100'],
              ['Earns 80-95% of royalties', 'Earn proportional royalties'],
              ['Owns master rights', 'Own a revenue share (with legal contract)'],
              ['Portfolio of 100+ artists', 'Diversify across many songs'],
              ['Revenue compounds for years', 'Same compounding — songs stream forever'],
            ].map(([label, fan], i) => (
              <div key={i} style={{ display:'contents' }}>
                <div style={{ background:'rgba(255,255,255,0.02)', padding:'14px 24px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <p style={{ fontSize:13, color:'#71717a', margin:0 }}>{label}</p>
                </div>
                <div style={{ background:'rgba(255,255,255,0.02)', padding:'14px 24px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <p style={{ fontSize:13, color:'#a1a1aa', margin:0, fontWeight:500 }}>{fan}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS STEPS */}
        <section style={{ position:'relative', zIndex:1, maxWidth:1000, margin:'0 auto', padding:'0 32px 80px' }}>
          <div style={{ textAlign:'center', marginBottom:48, animation:'hiwFadeInUp 0.6s ease-out 0.3s both' }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'#52525b', marginBottom:10 }}>STEP BY STEP</p>
            <h2 style={{ fontSize:32, fontWeight:800, color:'#fff', margin:0 }}>How It Works</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {STEPS.map((step, i) => {
              const isH = hoveredStep === step.num
              return (
                <div key={step.num}
                  onMouseEnter={() => setHoveredStep(step.num)} onMouseLeave={() => setHoveredStep(null)}
                  style={{
                    position:'relative', overflow:'hidden',
                    background: isH ? `linear-gradient(135deg,${step.bg}0.08),rgba(255,255,255,0.03))` : 'rgba(255,255,255,0.03)',
                    border:`1px solid ${isH ? `${step.bg}0.25)` : 'rgba(255,255,255,0.06)'}`,
                    borderRadius:20, padding:28,
                    transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    transform: isH ? 'translateY(-4px)' : 'translateY(0)',
                    animation:`hiwFadeInStagger 0.5s ease-out ${0.35 + i * 0.08}s both`,
                  }}>
                  <p style={{ fontSize:11, fontWeight:800, color:step.color, letterSpacing:'0.1em', margin:'0 0 16px 0', opacity:0.6 }}>{step.num}</p>
                  <div style={{ width:44, height:44, borderRadius:14, background:`${step.bg}0.1)`, border:`1px solid ${step.bg}0.2)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                    <step.icon size={20} color={step.color} />
                  </div>
                  <h3 style={{ fontSize:17, fontWeight:700, color:'#fff', margin:'0 0 8px 0' }}>{step.title}</h3>
                  <p style={{ fontSize:13, color:'#71717a', lineHeight:1.7, margin:'0 0 12px 0' }}>{step.description}</p>
                  <p style={{ fontSize:12, color:'#3f3f46', lineHeight:1.6, margin:0, fontStyle:'italic' }}>{step.detail}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* ── HIT CALCULATOR ──────────────────────────────────────── */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section style={{ position:'relative', zIndex:1, maxWidth:900, margin:'0 auto', padding:'0 32px 80px', animation:'hiwFadeInUp 0.6s ease-out 0.5s both' }}>

          <div style={{ textAlign:'center', marginBottom:36 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px', background:'rgba(236,72,153,0.08)', border:'1px solid rgba(236,72,153,0.12)', borderRadius:999, marginBottom:16 }}>
              <Calculator size={14} color="#f472b6" />
              <span style={{ fontSize:12, fontWeight:700, color:'#f472b6', letterSpacing:'0.05em' }}>INTERACTIVE</span>
            </div>
            <h2 style={{ fontSize:32, fontWeight:800, color:'#fff', margin:'0 0 8px 0' }}>Hit Calculator</h2>
            <p style={{ fontSize:14, color:'#52525b', margin:0 }}>See your potential earnings across different streaming rates</p>
          </div>

          <div style={{
            position:'relative', overflow:'hidden',
            background:'linear-gradient(135deg,rgba(236,72,153,0.06),rgba(168,85,247,0.04),rgba(255,255,255,0.02))',
            border:'1px solid rgba(236,72,153,0.15)',
            borderRadius:28, padding:'36px 32px',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#ec4899,#a855f7,#3b82f6,#ec4899)', backgroundSize:'300% 100%', animation:'hiwGradShift 6s ease-in-out infinite' }} />
            <div style={{ position:'absolute', top:'-40px', right:'-40px', width:200, height:200, background:'radial-gradient(circle,rgba(236,72,153,0.12) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

            <div style={{ position:'relative', zIndex:1 }}>

              {/* ── Fixed info banner ────────────────────────────── */}
              <div style={{
                display:'flex', alignItems:'center', gap:12, padding:'14px 18px', marginBottom:28,
                background:'rgba(168,85,247,0.06)', border:'1px solid rgba(168,85,247,0.12)', borderRadius:14,
              }}>
                <span style={{ fontSize:18 }}>📊</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#c084fc', margin:0 }}>
                    Fan Revenue Pool: <strong>50%</strong> &nbsp;·&nbsp; Rate: <strong>₹0.05 – ₹0.09</strong> per stream
                  </p>
                  <p style={{ fontSize:11, color:'#52525b', margin:'2px 0 0 0' }}>
                    Results show earnings range from lowest to highest streaming rate
                  </p>
                </div>
              </div>

              {/* ── CONTROLS ─────────────────────────────────────── */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:32 }}>

                {/* Streams slider — full width */}
                <div style={{ gridColumn:'1 / -1' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                    <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#71717a' }}>
                      🎧 Total Streams
                    </label>
                    <span style={{ fontSize:24, fontWeight:800, color:'#f472b6', letterSpacing:'-0.02em', textShadow:'0 0 20px rgba(244,114,182,0.3)' }}>
                      {fmtStreams(streams)}
                    </span>
                  </div>
                  <input type="range" className="hiw-range"
                    min={0} max={STREAM_MARKS.length - 1} step={1} value={streamIndex}
                    onChange={e => setStreamIndex(Number(e.target.value))}
                    style={{ background:`linear-gradient(90deg, #ec4899 0%, #ec4899 ${streamPct}%, rgba(255,255,255,0.06) ${streamPct}%, rgba(255,255,255,0.06) 100%)` }}
                  />
                  {/* Stream marks */}
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, padding:'0 2px' }}>
                    {STREAM_MARKS.map((m, i) => (
                      <button key={m} onClick={() => setStreamIndex(i)}
                        style={{
                          background:'none', border:'none', cursor:'pointer', padding:0,
                          fontSize:9, fontWeight:700, color: i <= streamIndex ? '#f472b6' : '#27272a',
                          transition:'color 0.2s', fontFamily:'inherit',
                        }}>
                        {fmtStreams(m)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campaign ask slider */}
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                    <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#71717a' }}>
                      🎯 Campaign Ask
                    </label>
                    <span style={{ fontSize:18, fontWeight:800, color:'#c084fc' }}>{fmtINR(fundingAsk)}</span>
                  </div>
                  <input type="range" className="hiw-range hiw-range-purple"
                    min={15000} max={20000} step={500} value={fundingAsk}
                    onChange={e => setFundingAsk(Number(e.target.value))}
                    style={{ background:`linear-gradient(90deg, #8b5cf6 0%, #8b5cf6 ${fundPct}%, rgba(255,255,255,0.06) ${fundPct}%, rgba(255,255,255,0.06) 100%)` }}
                  />
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                    <span style={{ fontSize:10, color:'#3f3f46', fontWeight:600 }}>₹15K</span>
                    <span style={{ fontSize:10, color:'#3f3f46', fontWeight:600 }}>₹20K</span>
                  </div>
                </div>

                {/* Investment input */}
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#71717a', marginBottom:10 }}>
                    💎 Your Investment
                  </label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'#52525b', fontSize:16, fontWeight:700, pointerEvents:'none' }}>₹</span>
                    <input type="number" value={investment} onChange={e => setInvestment(e.target.value)} placeholder="500"
                      style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'14px 16px 14px 36px', color:'#fff', fontSize:18, fontWeight:800, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.2s ease' }}
                      onFocus={e => { e.currentTarget.style.borderColor='rgba(236,72,153,0.4)'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(236,72,153,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow='none' }}
                    />
                  </div>
                  <div style={{ display:'flex', gap:6, marginTop:10 }}>
                    {[100, 500, 1000, 2500, 5000].map(amt => (
                      <button key={amt} onClick={() => setInvestment(String(amt))}
                        style={{
                          flex:1, padding:'7px 0', borderRadius:8,
                          background: Number(investment)===amt ? 'rgba(236,72,153,0.12)' : 'rgba(255,255,255,0.03)',
                          border:`1px solid ${Number(investment)===amt ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.06)'}`,
                          color: Number(investment)===amt ? '#f472b6' : '#52525b',
                          fontSize:11, fontWeight:700, cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit',
                        }}>
                        ₹{amt >= 1000 ? `${amt/1000}K` : amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── DIVIDER ──────────────────────────────────────── */}
              <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)', margin:'8px 0 28px 0' }} />

              {/* ── RESULTS ──────────────────────────────────────── */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
                {[
                  { key:'revenue',  label:'Total Song Revenue', value: rangeINR(revLow, revHigh),         sub:`${fmtStreams(streams)} × ₹0.05–0.09`,    color:'#d4d4d8', bg:'rgba(255,255,255,' },
                  { key:'fanpool',  label:'Fan Pool (50%)',      value: rangeINR(fanPoolLow, fanPoolHigh), sub:'Half of total revenue',                  color:'#34d399', bg:'rgba(16,185,129,'  },
                  { key:'own',      label:'Your Ownership',      value: `${ownershipPct.toFixed(2)}%`,     sub:`₹${investAmt.toLocaleString('en-IN')} of ${fmtINR(fundingAsk)}`, color:'#c084fc', bg:'rgba(168,85,247,' },
                  { key:'earn',     label:'Your Earnings',       value: rangeINR(earningsLow, earningsHigh), sub:'Your share of revenue',                color:'#f472b6', bg:'rgba(236,72,153,'  },
                  { key:'roi',      label:'Return (ROI)',        value: rangeROI(roiLow, roiHigh),          sub: isProfit ? 'Net profit range' : 'Needs more streams', color: isProfitLow ? '#34d399' : isProfitHigh ? '#fbbf24' : '#f87171', bg: isProfitLow ? 'rgba(16,185,129,' : isProfitHigh ? 'rgba(245,158,11,' : 'rgba(239,68,68,' },
                  { key:'break',    label:'Breakeven At',        value: fmtStreams(breakevenStreams),        sub:'At ₹0.05/stream (worst case)',           color:'#fbbf24', bg:'rgba(245,158,11,'  },
                ].map((r) => {
                  const isH = hoveredResult === r.key
                  return (
                    <div key={r.key}
                      onMouseEnter={() => setHoveredResult(r.key)} onMouseLeave={() => setHoveredResult(null)}
                      style={{
                        position:'relative', overflow:'hidden',
                        background: isH ? `${r.bg}0.08)` : `${r.bg}0.04)`,
                        border:`1px solid ${isH ? `${r.bg}0.2)` : 'rgba(255,255,255,0.05)'}`,
                        borderRadius:16, padding:'18px 16px',
                        transition:'all 0.3s ease',
                        transform: isH ? 'translateY(-2px)' : 'translateY(0)',
                      }}>
                      <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b', margin:'0 0 6px 0' }}>
                        {r.label}
                      </p>
                      <p style={{
                        fontSize: r.key === 'earn' || r.key === 'roi' ? 20 : 17,
                        fontWeight:800, color:r.color, margin:'0 0 4px 0', letterSpacing:'-0.02em',
                        textShadow: (r.key === 'earn' || r.key === 'roi') && isH ? `0 0 16px ${r.bg}0.3)` : 'none',
                      }}>
                        {r.value}
                      </p>
                      <p style={{ fontSize:10, color:'#3f3f46', margin:0, fontWeight:500 }}>{r.sub}</p>
                    </div>
                  )
                })}
              </div>

              {/* ── PROFIT / LOSS BANNER ──────────────────────────── */}
              {investAmt > 0 && (
                <div style={{
                  marginTop:24, padding:'18px 22px', borderRadius:18,
                  background: isProfitLow
                    ? 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(52,211,153,0.04))'
                    : isProfitHigh
                      ? 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(251,191,36,0.04))'
                      : 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(248,113,113,0.04))',
                  border: `1px solid ${isProfitLow ? 'rgba(16,185,129,0.15)' : isProfitHigh ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'}`,
                  display:'flex', alignItems:'flex-start', gap:12,
                }}>
                  <span style={{ fontSize:24, flexShrink:0, marginTop:2 }}>
                    {isProfitLow ? '🚀' : isProfitHigh ? '📈' : '📉'}
                  </span>
                  <div>
                    {isProfitLow ? (
                      <>
                        <p style={{ fontSize:15, fontWeight:700, color:'#34d399', margin:'0 0 4px 0' }}>
                          Profitable at all rates!
                        </p>
                        <p style={{ fontSize:13, color:'#71717a', margin:0, lineHeight:1.6 }}>
                          At {fmtStreams(streams)} streams, your {fmtINR(investAmt)} investment earns <strong style={{ color:'#34d399' }}>{rangeINR(earningsLow, earningsHigh)}</strong> — a return of <strong style={{ color:'#34d399' }}>{rangeROI(roiLow, roiHigh)}</strong>.
                        </p>
                      </>
                    ) : isProfitHigh ? (
                      <>
                        <p style={{ fontSize:15, fontWeight:700, color:'#fbbf24', margin:'0 0 4px 0' }}>
                          Profitable at higher rates
                        </p>
                        <p style={{ fontSize:13, color:'#71717a', margin:0, lineHeight:1.6 }}>
                          At {fmtStreams(streams)} streams, you earn <strong style={{ color:'#fbbf24' }}>{rangeINR(earningsLow, earningsHigh)}</strong>. At ₹0.05/stream you lose {fmtINR(Math.abs(earningsLow - investAmt))}, but at ₹0.09/stream you profit {fmtINR(earningsHigh - investAmt)}.
                        </p>
                      </>
                    ) : (
                      <>
                        <p style={{ fontSize:15, fontWeight:700, color:'#f87171', margin:'0 0 4px 0' }}>
                          Needs more streams
                        </p>
                        <p style={{ fontSize:13, color:'#71717a', margin:0, lineHeight:1.6 }}>
                          At {fmtStreams(streams)} streams, your earnings are {rangeINR(earningsLow, earningsHigh)}. You need at least <strong style={{ color:'#fbbf24' }}>{fmtStreams(breakevenStreams)} streams</strong> to break even on {fmtINR(investAmt)}.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {!investAmt && (
                <div style={{ marginTop:24, padding:'14px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, textAlign:'center' }}>
                  <p style={{ fontSize:13, color:'#52525b', margin:0 }}>💡 Enter an investment amount above to see your potential returns</p>
                </div>
              )}

              <p style={{ fontSize:10, color:'#1a1a2e', textAlign:'center', marginTop:16, lineHeight:1.6 }}>
                * Estimates only. Actual returns depend on streaming performance. Rate varies by platform (Spotify, Apple Music, YouTube, etc.)
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ position:'relative', zIndex:1, maxWidth:700, margin:'0 auto', padding:'0 32px 80px' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <h2 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div key={i} onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{ background: isOpen ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)', border:`1px solid ${isOpen ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.06)'}`, borderRadius:16, padding:'18px 22px', cursor:'pointer', transition:'all 0.3s ease' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <p style={{ fontSize:14, fontWeight:600, color:'#fff', margin:0 }}>{faq.q}</p>
                    <ChevronRight size={16} color="#52525b" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition:'transform 0.3s ease', flexShrink:0 }} />
                  </div>
                  {isOpen && <p style={{ fontSize:13, color:'#71717a', lineHeight:1.7, margin:'12px 0 0 0', animation:'hiwFadeInUp 0.2s ease-out' }}>{faq.a}</p>}
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section style={{ position:'relative', zIndex:1, maxWidth:700, margin:'0 auto', padding:'0 32px 100px', textAlign:'center' }}>
          <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,rgba(236,72,153,0.1),rgba(168,85,247,0.06))', border:'1px solid rgba(236,72,153,0.18)', borderRadius:28, padding:'48px 36px' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#ec4899,#a855f7,#ec4899)', backgroundSize:'200% 100%', animation:'hiwGradShift 4s ease-in-out infinite' }} />
            <h2 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 12px 0' }}>Ready to invest in music?</h2>
            <p style={{ fontSize:15, color:'#71717a', margin:'0 0 28px 0' }}>It&apos;s free to sign up. Browse songs now — invest when you&apos;re ready.</p>
            <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
              <Link href="/fan/discover" style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 28px', background:'linear-gradient(135deg,#ec4899,#f43f5e)', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 20px rgba(236,72,153,0.3)' }}>
                💎 Browse Songs <ArrowRight size={16} />
              </Link>
              <Link href="/fan/signup" style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 28px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, color:'#a1a1aa', fontSize:15, fontWeight:600, textDecoration:'none' }}>
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}