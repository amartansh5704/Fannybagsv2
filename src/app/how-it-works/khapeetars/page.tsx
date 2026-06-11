'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Wrench, Send, MessageCircle, Shield, CheckCircle,
  ChevronRight, ArrowRight, DollarSign, Users,
  Briefcase, Star, Music, Palette, Video, Mic2,
} from 'lucide-react'

const STEPS = [
  {
    num: '01', icon: Users, title: 'Create Your Profile',
    desc: 'Sign up, set your skills (mixing, mastering, design, video editing, etc.), showcase your portfolio, and set your starting rate.',
    color: '#60a5fa', bg: 'rgba(59,130,246,',
  },
  {
    num: '02', icon: Send, title: 'Send Work Requests',
    desc: 'Browse artists on the platform. Found someone whose project excites you? Send them a deal offer with your proposed budget and scope.',
    color: '#c084fc', bg: 'rgba(168,85,247,',
  },
  {
    num: '03', icon: Briefcase, title: 'Apply to Jobs',
    desc: 'Artists post gigs — mixing, mastering, cover art, music videos, and more. Submit proposals with your bid, delivery time, and portfolio.',
    color: '#34d399', bg: 'rgba(16,185,129,',
  },
  {
    num: '04', icon: MessageCircle, title: 'Chat & Collaborate',
    desc: 'Once a deal or job is accepted, a private chat opens. Discuss details, share files, and iterate on the work.',
    color: '#fbbf24', bg: 'rgba(245,158,11,',
  },
  {
    num: '05', icon: Shield, title: 'Escrow Protection',
    desc: 'The artist\'s payment is held in escrow before work begins. You\'re guaranteed to get paid when both sides confirm completion.',
    color: '#f472b6', bg: 'rgba(236,72,153,',
  },
  {
    num: '06', icon: DollarSign, title: 'Get Paid (90%)',
    desc: 'When work is complete and both parties confirm, 90% is released to your wallet instantly. 10% platform fee.',
    color: '#34d399', bg: 'rgba(16,185,129,',
  },
]

const SERVICES = [
  { icon: Mic2,    label: 'Music Production', desc: 'Beats, arrangement, recording' },
  { icon: Music,   label: 'Mixing & Mastering', desc: 'Professional audio finishing' },
  { icon: Palette, label: 'Cover Art & Design', desc: 'Album art, logos, branding' },
  { icon: Video,   label: 'Music Videos', desc: 'Filming, editing, animation' },
  { icon: Star,    label: 'Marketing', desc: 'PR, social media, playlist pitching' },
  { icon: Wrench,  label: 'Other Services', desc: 'Lyrics, songwriting, session work' },
]

const FAQS = [
  { q: 'How do I get my first client?', a: 'Browse artists and send them deal offers for projects you\'re suited for. You can also apply to open jobs posted by artists. A complete profile with portfolio samples helps a lot.' },
  { q: 'When do I get paid?', a: 'Once both you and the artist mark the work as complete, the admin releases escrow. 90% goes to your wallet. You can withdraw anytime.' },
  { q: 'What if there\'s a dispute?', a: 'If the artist is unhappy, they can request a refund. The admin reviews the situation and makes a fair decision. Escrow protects both parties.' },
  { q: 'Is there a fee?', a: 'Yes — 10% platform fee on completed jobs and deals. No upfront costs to join or send proposals.' },
]

export default function HowItWorksKhapeetarsPage() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn]   = useState<string | null>(null)
  const [openFaq, setOpenFaq]         = useState<number | null>(null)

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
          <div style={{ position:'absolute', top:'-100px', right:'-60px', width:600, height:600, background:'radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)', borderRadius:'50%', animation:'hiwFloat 12s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:500, height:500, background:'radial-gradient(circle,rgba(168,85,247,0.04) 0%,transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        {/* Nav */}
        <nav style={{ position:'relative', zIndex:10, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', animation:'hiwFadeInDown 0.5s ease-out' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Wrench size={18} color="#fff" />
              </div>
              <span style={{ fontSize:18, fontWeight:800, color:'#fff' }}>FannyBags</span>
            </Link>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Link href="/khapeetar/login" style={{ padding:'8px 16px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#a1a1aa', fontSize:13, fontWeight:600, textDecoration:'none' }}>Log in</Link>
              <Link href="/khapeetar/signup" style={{ padding:'8px 20px', borderRadius:10, background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                Join as Khapeetar
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ position:'relative', zIndex:1, maxWidth:900, margin:'0 auto', padding:'80px 32px 60px', textAlign:'center', animation:'hiwFadeInUp 0.6s ease-out' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 20px', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.15)', borderRadius:999, marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#60a5fa', animation:'hiwPulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize:12, fontWeight:700, color:'#60a5fa', letterSpacing:'0.05em' }}>FOR KHAPEETARS (FREELANCERS)</span>
          </div>

          <h1 style={{ fontSize:'clamp(36px,6vw,56px)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.03em', margin:'0 0 20px 0' }}>
            <span style={{ background:'linear-gradient(135deg,#fff,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Work With Artists.</span>
            <br />
            <span style={{ color:'#60a5fa' }}>Get Paid Securely.</span>
          </h1>

          <p style={{ fontSize:18, color:'#71717a', lineHeight:1.7, maxWidth:620, margin:'0 auto 36px' }}>
            Send work proposals to artists, apply to their gigs, and get paid through escrow — your payment is guaranteed when the work is done.
          </p>

          <div style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
            <Link href="/khapeetar/signup"
              onMouseEnter={() => setHoveredBtn('hero-signup')} onMouseLeave={() => setHoveredBtn(null)}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 28px', background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', transition:'all 0.3s', transform: hoveredBtn==='hero-signup' ? 'translateY(-2px)' : 'none', boxShadow: hoveredBtn==='hero-signup' ? '0 8px 40px rgba(59,130,246,0.35)' : '0 4px 20px rgba(59,130,246,0.2)' }}>
              Join as Khapeetar <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Services */}
        <section style={{ position:'relative', zIndex:1, maxWidth:1000, margin:'0 auto', padding:'0 32px 60px' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'#52525b', marginBottom:10 }}>WHAT YOU CAN DO</p>
            <h2 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Offer Your Skills</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'20px 16px', textAlign:'center', animation:`hiwFadeInStagger 0.4s ease-out ${0.1 + i*0.05}s both` }}>
                <div style={{ width:40, height:40, borderRadius:12, background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                  <s.icon size={18} color="#60a5fa" />
                </div>
                <p style={{ fontSize:13, fontWeight:700, color:'#fff', margin:'0 0 4px 0' }}>{s.label}</p>
                <p style={{ fontSize:11, color:'#52525b', margin:0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section style={{ position:'relative', zIndex:1, maxWidth:1100, margin:'0 auto', padding:'0 32px 80px' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'#52525b', marginBottom:10 }}>STEP BY STEP</p>
            <h2 style={{ fontSize:32, fontWeight:800, color:'#fff', margin:0 }}>How It Works</h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16 }}>
            {STEPS.map((step, i) => {
              const isH = hoveredStep === step.num
              return (
                <div key={step.num}
                  onMouseEnter={() => setHoveredStep(step.num)}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{
                    background: isH ? `linear-gradient(135deg,${step.bg}0.08),rgba(255,255,255,0.03))` : 'rgba(255,255,255,0.03)',
                    border:`1px solid ${isH ? `${step.bg}0.25)` : 'rgba(255,255,255,0.06)'}`,
                    borderRadius:18, padding:22,
                    transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    transform: isH ? 'translateY(-4px)' : 'translateY(0)',
                    animation:`hiwFadeInStagger 0.5s ease-out ${0.15 + i*0.07}s both`,
                  }}>
                  <p style={{ fontSize:10, fontWeight:800, color:step.color, letterSpacing:'0.1em', margin:'0 0 12px 0', opacity:0.6 }}>{step.num}</p>
                  <div style={{ width:38, height:38, borderRadius:12, background:`${step.bg}0.1)`, border:`1px solid ${step.bg}0.2)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                    <step.icon size={18} color={step.color} />
                  </div>
                  <h3 style={{ fontSize:15, fontWeight:700, color:'#fff', margin:'0 0 6px 0' }}>{step.title}</h3>
                  <p style={{ fontSize:12, color:'#71717a', lineHeight:1.7, margin:0 }}>{step.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Deal flow visual */}
        <section style={{ position:'relative', zIndex:1, maxWidth:800, margin:'0 auto', padding:'0 32px 80px' }}>
          <div style={{ background:'linear-gradient(135deg,rgba(59,130,246,0.06),rgba(168,85,247,0.04))', border:'1px solid rgba(59,130,246,0.12)', borderRadius:24, padding:36 }}>
            <h3 style={{ fontSize:18, fontWeight:800, color:'#fff', margin:'0 0 24px 0', textAlign:'center' }}>Two Ways to Get Work</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <Send size={18} color="#c084fc" />
                  <h4 style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>Send Deals</h4>
                </div>
                <p style={{ fontSize:13, color:'#71717a', lineHeight:1.7, margin:0 }}>
                  Proactively reach out to artists. Send a work request with your proposed budget and scope. If they accept, you start working.
                </p>
              </div>
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <Briefcase size={18} color="#34d399" />
                  <h4 style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>Apply to Jobs</h4>
                </div>
                <p style={{ fontSize:13, color:'#71717a', lineHeight:1.7, margin:0 }}>
                  Artists post open gigs on the platform. Browse listings, submit proposals with your bid and delivery time, and get hired.
                </p>
              </div>
            </div>
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
                  style={{ background: isOpen ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)', border:`1px solid ${isOpen ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)'}`, borderRadius:16, padding:'18px 22px', cursor:'pointer', transition:'all 0.3s ease' }}>
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
          <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(168,85,247,0.06))', border:'1px solid rgba(59,130,246,0.18)', borderRadius:28, padding:'48px 36px' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#3b82f6,#8b5cf6,#3b82f6)', backgroundSize:'200% 100%', animation:'hiwGradShift 4s ease-in-out infinite' }} />
            <h2 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 12px 0' }}>Ready to start working?</h2>
            <p style={{ fontSize:15, color:'#71717a', margin:'0 0 28px 0' }}>Join FannyBags and connect with artists looking for your skills.</p>
            <Link href="/khapeetar/signup" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 20px rgba(59,130,246,0.3)' }}>
              Join as Khapeetar <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}