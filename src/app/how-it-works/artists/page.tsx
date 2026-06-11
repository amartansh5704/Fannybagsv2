'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Music, Mic2, Users, Wallet, Briefcase, Upload,
  ChevronRight, ArrowRight, Shield, Zap, DollarSign,
  PieChart, Star, CheckCircle, Target, TrendingUp,
} from 'lucide-react'

const FUNDING_STEPS = [
  {
    num: '01', icon: Upload, title: 'Upload Your Song',
    desc: 'Add your song details — title, demo, cover art, and distribution info. Set your funding target and how much revenue you\'ll share with fans.',
    color: '#c084fc', bg: 'rgba(168,85,247,',
  },
  {
    num: '02', icon: Target, title: 'Campaign Goes Live',
    desc: 'Once approved, fans can discover your song and invest. Share your campaign link on social media to attract supporters.',
    color: '#60a5fa', bg: 'rgba(59,130,246,',
  },
  {
    num: '03', icon: DollarSign, title: 'Get Funded',
    desc: 'As fans invest, your campaign fills up. Once the admin releases funds, 95% goes directly to your wallet (5% platform fee).',
    color: '#34d399', bg: 'rgba(16,185,129,',
  },
  {
    num: '04', icon: TrendingUp, title: 'Release & Earn',
    desc: 'Use the funds to produce, mix, and promote your song. As it streams, royalties flow back — to you and your fan investors.',
    color: '#fbbf24', bg: 'rgba(245,158,11,',
  },
]

const GIG_STEPS = [
  {
    num: '01', icon: Briefcase, title: 'Post a Job',
    desc: 'Need a music video, mixing, mastering, or design? Post a job with your requirements and budget.',
    color: '#c084fc', bg: 'rgba(168,85,247,',
  },
  {
    num: '02', icon: Users, title: 'Receive Proposals',
    desc: 'Khapeetars (verified freelancers) send proposals with their bid, delivery time, and portfolio.',
    color: '#60a5fa', bg: 'rgba(59,130,246,',
  },
  {
    num: '03', icon: Shield, title: 'Escrow Protection',
    desc: 'Accept a proposal and your budget is held in escrow. The khapeetar only gets paid when you\'re happy with the work.',
    color: '#34d399', bg: 'rgba(16,185,129,',
  },
  {
    num: '04', icon: CheckCircle, title: 'Approve & Release',
    desc: 'Review the delivered work. Both parties mark complete → funds are released. 90% to khapeetar, 10% platform fee.',
    color: '#fbbf24', bg: 'rgba(245,158,11,',
  },
]

const FAQS = [
  { q: 'How much does it cost?', a: 'Posting a campaign or job is free. We take a 5% fee on campaign funds released and a 10% fee on job payouts.' },
  { q: 'How do I share revenue with fans?', a: 'You decide the fan revenue share % when creating your campaign — typically 10-30%. Fans earn proportionally based on their investment.' },
  { q: 'Is the escrow safe?', a: 'Yes. Funds are held securely and only released when both you and the khapeetar confirm the work is complete.' },
  { q: 'Can I accept deal offers from khapeetars?', a: 'Absolutely. Khapeetars can send you work proposals directly. You\'ll see them in your Deals section.' },
]

export default function HowItWorksArtistsPage() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn]   = useState<string | null>(null)
  const [openFaq, setOpenFaq]         = useState<number | null>(null)
  const [activeTab, setActiveTab]     = useState<'funding' | 'gigs'>('funding')

  const currentSteps = activeTab === 'funding' ? FUNDING_STEPS : GIG_STEPS

  return (
    <>
      <style>{`
        @keyframes hiwFadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hiwFadeInDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hiwFadeInStagger { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hiwFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.04)} }
        @keyframes hiwGradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes hiwPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', position:'relative', overflow:'hidden' }}>

        {/* Ambient */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-100px', left:'-60px', width:600, height:600, background:'radial-gradient(circle,rgba(168,85,247,0.06) 0%,transparent 70%)', borderRadius:'50%', animation:'hiwFloat 12s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'-80px', right:'-80px', width:500, height:500, background:'radial-gradient(circle,rgba(236,72,153,0.04) 0%,transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        {/* Nav */}
        <nav style={{ position:'relative', zIndex:10, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', animation:'hiwFadeInDown 0.5s ease-out' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#8b5cf6,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Mic2 size={18} color="#fff" />
              </div>
              <span style={{ fontSize:18, fontWeight:800, color:'#fff' }}>FannyBags</span>
            </Link>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Link href="/artist/login" style={{ padding:'8px 16px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#a1a1aa', fontSize:13, fontWeight:600, textDecoration:'none' }}>Log in</Link>
              <Link href="/artist/signup" style={{ padding:'8px 20px', borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#db2777)', color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                Join as Artist
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ position:'relative', zIndex:1, maxWidth:900, margin:'0 auto', padding:'80px 32px 60px', textAlign:'center', animation:'hiwFadeInUp 0.6s ease-out' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 20px', background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.15)', borderRadius:999, marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#c084fc', animation:'hiwPulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize:12, fontWeight:700, color:'#c084fc', letterSpacing:'0.05em' }}>FOR ARTISTS</span>
          </div>

          <h1 style={{ fontSize:'clamp(36px,6vw,56px)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.03em', margin:'0 0 20px 0' }}>
            <span style={{ background:'linear-gradient(135deg,#fff,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Fund Your Music.</span>
            <br />
            <span style={{ color:'#c084fc' }}>Find Your Team.</span>
          </h1>

          <p style={{ fontSize:18, color:'#71717a', lineHeight:1.7, maxWidth:620, margin:'0 auto 36px' }}>
            Raise funds from fans who believe in your music. Post gigs to find producers, designers, and video creators. All with escrow protection.
          </p>

          <div style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
            <Link href="/artist/raise-funds" style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 28px', background:'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 20px rgba(124,58,237,0.3)' }}>
              Start a Campaign <ArrowRight size={16} />
            </Link>
            <Link href="/artist/jobs/new" style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 28px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, color:'#a1a1aa', fontSize:15, fontWeight:600, textDecoration:'none' }}>
              <Briefcase size={16} /> Post a Job
            </Link>
          </div>
        </section>

        {/* Tab switcher */}
        <section style={{ position:'relative', zIndex:1, maxWidth:1000, margin:'0 auto', padding:'0 32px 20px', textAlign:'center' }}>
          <div style={{ display:'inline-flex', gap:4, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:4 }}>
            {[
              { key:'funding' as const, label:'💰 Crowdfunding', icon: DollarSign },
              { key:'gigs' as const,    label:'💼 Post Gigs',    icon: Briefcase },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  padding:'10px 24px', borderRadius:10, border:'none', cursor:'pointer',
                  fontSize:13, fontWeight:700, fontFamily:'inherit',
                  transition:'all 0.3s ease',
                  background: activeTab === tab.key ? 'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(236,72,153,0.1))' : 'transparent',
                  color: activeTab === tab.key ? '#c084fc' : '#52525b',
                  ...(activeTab === tab.key ? { border:'1px solid rgba(168,85,247,0.2)' } : {}),
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section style={{ position:'relative', zIndex:1, maxWidth:1000, margin:'0 auto', padding:'20px 32px 80px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:18 }}>
            {currentSteps.map((step, i) => {
              const isH = hoveredStep === `${activeTab}-${step.num}`
              return (
                <div key={`${activeTab}-${step.num}`}
                  onMouseEnter={() => setHoveredStep(`${activeTab}-${step.num}`)}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{
                    background: isH ? `linear-gradient(135deg,${step.bg}0.08),rgba(255,255,255,0.03))` : 'rgba(255,255,255,0.03)',
                    border:`1px solid ${isH ? `${step.bg}0.25)` : 'rgba(255,255,255,0.06)'}`,
                    borderRadius:20, padding:26,
                    transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    transform: isH ? 'translateY(-4px)' : 'translateY(0)',
                    animation:`hiwFadeInStagger 0.5s ease-out ${0.1 + i * 0.08}s both`,
                  }}>
                  <p style={{ fontSize:11, fontWeight:800, color:step.color, letterSpacing:'0.1em', margin:'0 0 14px 0', opacity:0.6 }}>{step.num}</p>
                  <div style={{ width:42, height:42, borderRadius:13, background:`${step.bg}0.1)`, border:`1px solid ${step.bg}0.2)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                    <step.icon size={20} color={step.color} />
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'#fff', margin:'0 0 8px 0' }}>{step.title}</h3>
                  <p style={{ fontSize:13, color:'#71717a', lineHeight:1.7, margin:0 }}>{step.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ position:'relative', zIndex:1, maxWidth:700, margin:'0 auto', padding:'0 32px 80px' }}>
          <h2 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:'0 0 28px 0', textAlign:'center' }}>FAQs</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div key={i} onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{ background: isOpen ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)', border:`1px solid ${isOpen ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.06)'}`, borderRadius:16, padding:'18px 22px', cursor:'pointer', transition:'all 0.3s ease' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <p style={{ fontSize:14, fontWeight:600, color:'#fff', margin:0 }}>{faq.q}</p>
                    <ChevronRight size={16} color="#52525b" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition:'transform 0.3s ease', flexShrink:0 }} />
                  </div>
                  {isOpen && <p style={{ fontSize:13, color:'#71717a', lineHeight:1.7, margin:'12px 0 0 0' }}>{faq.a}</p>}
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section style={{ position:'relative', zIndex:1, maxWidth:700, margin:'0 auto', padding:'0 32px 100px', textAlign:'center' }}>
          <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,rgba(168,85,247,0.1),rgba(236,72,153,0.06))', border:'1px solid rgba(168,85,247,0.18)', borderRadius:28, padding:'48px 36px' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#8b5cf6,#ec4899,#8b5cf6)', backgroundSize:'200% 100%', animation:'hiwGradShift 4s ease-in-out infinite' }} />
            <h2 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 12px 0' }}>Ready to launch?</h2>
            <p style={{ fontSize:15, color:'#71717a', margin:'0 0 28px 0' }}>Your fans are waiting to invest in your next hit.</p>
            <Link href="/artist/signup" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', background:'linear-gradient(135deg,#7c3aed,#db2777)', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 20px rgba(124,58,237,0.3)' }}>
              Join as Artist <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}