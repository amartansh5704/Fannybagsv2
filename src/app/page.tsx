'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Music, Users, Headphones, ArrowRight, Zap } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = rootRef.current?.querySelectorAll('.fb-reveal') ?? []
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const roles = [
    {
      id: 'fan',
      icon: Users,
      title: 'Fan',
      subtitle: 'Back artists. Earn royalties.',
      description: 'Invest in songs before they blow up. Get real revenue share when they do.',
      features: ['Discover emerging artists', 'Fund songs from ₹101', 'Earn revenue participation', 'Track your portfolio'],
      cardClass: 'fan',
      icoEmoji: '🎧',
      nameIco: '💜',
      pct: '45% of users share this archetype',
      actionLabel: 'Min. pledge ₹101',
      ctaText: 'Back a song →',
      path: '/fan/signup'
    },
    {
      id: 'artist',
      icon: Music,
      title: 'Artist',
      subtitle: 'Fund your music. Keep control.',
      description: 'Raise capital from fans who believe in you. Hire professionals. Release on your terms.',
      features: ['Launch funding campaigns', 'Hire Khapeetars', 'Distribute music', 'Track royalties'],
      cardClass: 'artist',
      icoEmoji: '🎤',
      nameIco: '🎵',
      pct: '12% of users share this archetype',
      actionLabel: 'Free first campaign',
      ctaText: 'Start campaign →',
      path: '/artist/signup',
      featured: true
    },
    {
      id: 'khapeetar',
      icon: Headphones,
      title: 'Khapeetar',
      subtitle: 'Sell your skills. Get paid securely.',
      description: "Join India's first music professional marketplace. Get hired, deliver work, get paid via escrow.",
      features: ['Create service profile', 'Get discovered by artists', 'Secure escrow payments', 'Build your reputation'],
      cardClass: 'khap',
      icoEmoji: '🎛️',
      nameIco: '🎬',
      pct: '8% of users share this archetype',
      actionLabel: 'Verified badge on approval',
      ctaText: 'Apply now →',
      path: '/khapeetar/signup'
    }
  ]

  const howItWorks = [
    {
      step: '01',
      title: 'Artist creates a campaign',
      desc: 'Set your funding goal, revenue split, and what you need — mixing, video, promotion, or all of it.',
      emoji: '🎯',
    },
    {
      step: '02',
      title: 'Fans back the song',
      desc: 'Fans pledge from ₹100. Once the goal is hit, funds are released to the artist and Khapeetars.',
      emoji: '💸',
    },
    {
      step: '03',
      title: 'Khapeetars get hired',
      desc: 'Professionals apply, negotiate terms, and deliver work. All payments are secured via escrow.',
      emoji: '🛠️',
    },
    {
      step: '04',
      title: 'Revenue flows back',
      desc: 'Once the song earns, revenue is automatically split between the artist and fans.',
      emoji: '📈',
    },
  ]

  const scrollToCards = () => {
    document.getElementById('roles-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToHIW = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .fb-root { background: #000; min-height: 100vh; color: #f2f2f2; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

        .fb-nav { position: fixed; top: 0; left: 0; right: 0; height: 64px; display: flex; align-items: center; padding: 0 48px; background: rgba(0,0,0,0.88); backdrop-filter: blur(16px); border-bottom: 0.5px solid rgba(255,255,255,0.06); z-index: 100; justify-content: space-between; }
        .fb-nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 19px; color: #fff; letter-spacing: -0.4px; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .fb-logo-pip { width: 7px; height: 7px; border-radius: 50%; background: #ff6bff; display: inline-block; }
        .fb-nav-links { display: flex; gap: 36px; list-style: none; }
        .fb-nav-links a { color: #666; text-decoration: none; font-size: 13.5px; transition: color 0.2s; cursor: pointer; }
        .fb-nav-links a:hover { color: #ccc; }
        .fb-nav-right { display: flex; gap: 10px; }
        .fb-btn-nav { padding: 8px 18px; border-radius: 7px; font-size: 13px; font-family: inherit; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .fb-btn-ghost { background: transparent; border: 0.5px solid rgba(255,255,255,0.12); color: #888; }
        .fb-btn-ghost:hover { background: rgba(255,255,255,0.05); color: #ccc; }
        .fb-btn-white { background: #fff; border: none; color: #000; }
        .fb-btn-white:hover { background: #ddd; }

        .fb-side-index { position: fixed; right: 28px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 18px; z-index: 50; }
        .fb-si { display: flex; align-items: center; gap: 8px; justify-content: flex-end; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #2a2a2a; transition: color 0.2s; cursor: pointer; }
        .fb-si:hover { color: #666; }
        .fb-si.active { color: #e8b84b; }
        .fb-si-pip { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        .fb-ticker { position: fixed; top: 78px; left: 48px; font-size: 10px; letter-spacing: 2px; color: #222; text-transform: uppercase; z-index: 40; }

        .fb-hero { padding-top: 164px; padding-bottom: 56px; text-align: center; max-width: 760px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }
        .fb-eyebrow { display: inline-flex; align-items: center; gap: 7px; padding: 5px 14px; border-radius: 999px; border: 0.5px solid rgba(255,255,255,0.09); font-size: 11px; color: #666; margin-bottom: 30px; letter-spacing: 0.5px; text-transform: uppercase; }
        .fb-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #4fd9c4; display: inline-block; animation: fb-blink 2.2s infinite; }
        @keyframes fb-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .fb-h1 { font-family: 'Syne', sans-serif; font-size: clamp(46px,6.5vw,76px); font-weight: 800; line-height: 1.05; letter-spacing: -2.5px; color: #fff; margin-bottom: 22px; }
        .fb-grad { background: linear-gradient(120deg,#ff6bff 0%,#ff8c42 45%,#4fd9c4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .fb-hero-p { font-size: 16px; color: #888; max-width: 460px; margin: 0 auto 38px; font-weight: 300; line-height: 1.8; }
        .fb-hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .fb-btn-lp { padding: 13px 30px; border-radius: 9px; font-size: 14px; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.22s; border: none; }
        .fb-btn-lp-w { background: #fff; color: #000; }
        .fb-btn-lp-w:hover { background: #e0e0e0; transform: translateY(-2px); }
        .fb-btn-lp-g { background: transparent; border: 0.5px solid rgba(255,255,255,0.11); color: #888; }
        .fb-btn-lp-g:hover { color: #ccc; background: rgba(255,255,255,0.04); }

        .fb-stats-row { display: flex; justify-content: center; max-width: 620px; margin: 0 auto 80px; border: 0.5px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }
        .fb-stat-cell { flex: 1; padding: 22px 16px; text-align: center; border-right: 0.5px solid rgba(255,255,255,0.06); }
        .fb-stat-cell:last-child { border-right: none; }
        .fb-stat-n { font-family: 'Syne', sans-serif; font-size: 23px; font-weight: 700; color: #fff; letter-spacing: -0.8px; }
        .fb-stat-l { font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 1.2px; margin-top: 4px; }

        .fb-sec-wrap { max-width: 1100px; margin: 0 auto; padding: 0 40px 100px; }
        .fb-sec-top { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 44px; }
        .fb-sec-num { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #2a2a2a; }
        .fb-sec-title { font-family: 'Syne', sans-serif; font-size: clamp(26px,3vw,36px); font-weight: 700; letter-spacing: -0.8px; color: #fff; }
        .fb-sec-sub { font-size: 12.5px; color: #444; font-weight: 300; }

        .fb-cards-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .fb-arch-card { border-radius: 22px; overflow: hidden; background: #101010; border: 1px solid rgba(255,255,255,0.07); transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s; cursor: pointer; }
        .fb-arch-card:hover { transform: translateY(-8px) scale(1.012); }
        .fb-arch-card.artist:hover { box-shadow: 0 30px 80px rgba(255,140,0,0.2); }
        .fb-arch-card.fan:hover { box-shadow: 0 30px 80px rgba(200,60,255,0.2); }
        .fb-arch-card.khap:hover { box-shadow: 0 30px 80px rgba(56,208,240,0.2); }

        .fb-card-top { position: relative; height: 310px; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; }
        .fb-arch-card.artist .fb-card-top { background: linear-gradient(155deg,#ffd34e 0%,#ff8c00 35%,#ff4fa0 72%,#b020e8 100%); }
        .fb-arch-card.fan .fb-card-top { background: linear-gradient(155deg,#ffcce8 0%,#ff78c4 35%,#c040ff 70%,#6820d0 100%); }
        .fb-arch-card.khap .fb-card-top { background: linear-gradient(155deg,#a8f4ff 0%,#38d0f0 35%,#4880ff 70%,#1830c8 100%); }

        .fb-card-tag { position: absolute; top: 18px; left: 18px; font-size: 11px; color: rgba(255,255,255,0.7); font-weight: 400; }
        .fb-card-year { position: absolute; top: 18px; right: 18px; font-size: 11px; color: rgba(255,255,255,0.55); }
        .fb-card-char { font-size: 128px; line-height: 1; margin-bottom: -8px; filter: drop-shadow(0 24px 40px rgba(0,0,0,0.45)); transition: transform 0.4s cubic-bezier(0.23,1,0.32,1); user-select: none; position: relative; z-index: 2; }
        .fb-arch-card:hover .fb-card-char { transform: translateY(-14px) scale(1.07); }

        .fb-card-bottom { background: #101010; padding: 22px 22px 26px; }
        .fb-card-name-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
        .fb-card-ico { font-size: 17px; }
        .fb-card-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
        .fb-card-pct { font-size: 12px; color: #555; font-weight: 300; margin-bottom: 16px; }
        .fb-card-perks { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .fb-card-perks li { display: flex; align-items: center; gap: 9px; font-size: 12.5px; color: #bbb; font-weight: 300; }
        .fb-pk-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }
        .fb-arch-card.artist .fb-pk-dot { background: #ff8c00; }
        .fb-arch-card.fan .fb-pk-dot { background: #c040ff; }
        .fb-arch-card.khap .fb-pk-dot { background: #38d0f0; }
        .fb-card-divider { height: 0.5px; background: rgba(255,255,255,0.07); margin: 0 0 16px; }
        .fb-card-action { display: flex; align-items: center; justify-content: space-between; }
        .fb-card-action-label { font-size: 11px; color: #444; }
        .fb-card-cta { padding: 9px 17px; border-radius: 8px; font-size: 12.5px; font-weight: 500; border: none; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .fb-arch-card.artist .fb-card-cta { background: linear-gradient(110deg,#ff8c00,#ff4fa0); color: #fff; }
        .fb-arch-card.fan .fb-card-cta { background: linear-gradient(110deg,#c040ff,#6820d0); color: #fff; }
        .fb-arch-card.khap .fb-card-cta { background: linear-gradient(110deg,#38d0f0,#4880ff); color: #fff; }
        .fb-card-cta:hover { opacity: 0.83; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.4); }

        /* HOW IT WORKS */
        .fb-hiw-wrap { max-width: 1100px; margin: 0 auto; padding: 0 40px 120px; }
        .fb-hiw-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-top: 44px; }
        .fb-hiw-card { background: #0c0c0c; border: 0.5px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 28px 22px; position: relative; transition: border-color 0.3s, transform 0.3s; }
        .fb-hiw-card:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-4px); }
        .fb-hiw-step { font-family: 'Syne', sans-serif; font-size: 11px; letter-spacing: 2px; color: #2a2a2a; text-transform: uppercase; margin-bottom: 16px; }
        .fb-hiw-emoji { font-size: 36px; margin-bottom: 14px; display: block; }
        .fb-hiw-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 10px; letter-spacing: -0.3px; line-height: 1.3; }
        .fb-hiw-desc { font-size: 12.5px; color: #555; font-weight: 300; line-height: 1.7; }
        .fb-hiw-connector { position: absolute; top: 40px; right: -9px; width: 18px; height: 0.5px; background: rgba(255,255,255,0.08); z-index: 1; }

        .fb-footer { border-top: 0.5px solid rgba(255,255,255,0.05); max-width: 1100px; margin: 0 auto; padding: 24px 40px; display: flex; align-items: center; justify-content: space-between; }
        .fb-footer-brand { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #fff; }
        .fb-footer-copy { font-size: 11px; color: #333; }
        .fb-footer-links { display: flex; gap: 20px; }
        .fb-footer-links a { font-size: 11px; color: #333; text-decoration: none; transition: color 0.2s; }
        .fb-footer-links a:hover { color: #777; }

        .fb-reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fb-reveal.visible { opacity: 1; transform: translateY(0); }

        @media (max-width: 900px) {
          .fb-cards-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
          .fb-hiw-grid { grid-template-columns: 1fr 1fr; }
          .fb-hiw-connector { display: none; }
          .fb-nav-links, .fb-side-index, .fb-ticker { display: none; }
          .fb-footer { flex-direction: column; gap: 10px; text-align: center; }
          .fb-nav { padding: 0 20px; }
          .fb-sec-wrap, .fb-hiw-wrap { padding-left: 20px; padding-right: 20px; }
        }

        @media (max-width: 540px) {
          .fb-hiw-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="fb-root" ref={rootRef}>

        

        {/* Nav */}
        <nav className="fb-nav">
          <div className="fb-nav-logo" onClick={scrollToCards}>
            <span className="fb-logo-pip"></span>FannyBags
          </div>
          <ul className="fb-nav-links">
            <li><a onClick={() => router.push('/fan/signup')}>Discover</a></li>
            <li><a onClick={() => router.push('/khapeetar/signup')}>Marketplace</a></li>
            <li><a onClick={scrollToHIW}>How it works</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
          <div className="fb-nav-right">
            <button className="fb-btn-nav fb-btn-ghost" onClick={scrollToCards}>Log in</button>
            <button className="fb-btn-nav fb-btn-white" onClick={scrollToCards}>Join now</button>
          </div>
        </nav>

        {/* Hero */}
        <section className="fb-hero fb-reveal">
          <div className="fb-eyebrow">
            <span className="fb-eyebrow-dot"></span>Beta — now open
          </div>
          <h1 className="fb-h1">
            Where music<br />
            <span className="fb-grad">gets built</span>
          </h1>
          <p className="fb-hero-p">
            Fund songs. Build careers. Earn royalties. One platform connecting artists, fans, and music professionals.
          </p>
          <div className="fb-hero-btns">
            <button className="fb-btn-lp fb-btn-lp-w" onClick={scrollToCards}>Get early access</button>
            <button className="fb-btn-lp fb-btn-lp-g" onClick={scrollToHIW}>How it works ↓</button>
          </div>
        </section>

        {/* Stats */}
        <div className="fb-stats-row fb-reveal">
          <div className="fb-stat-cell"><div className="fb-stat-n">12K+</div><div className="fb-stat-l">Artists</div></div>
          <div className="fb-stat-cell"><div className="fb-stat-n">₹4.2Cr</div><div className="fb-stat-l">Funded</div></div>
          <div className="fb-stat-cell"><div className="fb-stat-n">340+</div><div className="fb-stat-l">Khapeetars</div></div>
          <div className="fb-stat-cell"><div className="fb-stat-n">98%</div><div className="fb-stat-l">Satisfaction</div></div>
        </div>

        {/* Role Cards */}
        <div className="fb-sec-wrap" id="roles-section">
          <div className="fb-sec-top fb-reveal">
            <div>
              <div className="fb-sec-num">01 — Choose your role</div>
              <div className="fb-sec-title">Your archetype on FannyBags</div>
            </div>
            <div className="fb-sec-sub">Pick your lane. Own your piece.</div>
          </div>

          <div className="fb-cards-grid">
            {roles.map((role, i) => (
              <div
                key={role.id}
                className={`fb-arch-card ${role.cardClass} fb-reveal`}
                style={{ transitionDelay: `${i * 0.1}s` }}
                onClick={() => router.push(role.path)}
              >
                <div className="fb-card-top">
                  <div className="fb-card-tag">Your Archetype</div>
                  <div className="fb-card-year">2026</div>
                  <div className="fb-card-char">{role.icoEmoji}</div>
                </div>
                <div className="fb-card-bottom">
                  <div className="fb-card-name-row">
                    <span className="fb-card-ico">{role.nameIco}</span>
                    <span className="fb-card-name">{role.title}</span>
                  </div>
                  <div className="fb-card-pct">{role.pct}</div>
                  <ul className="fb-card-perks">
                    {role.features.map((f) => (
                      <li key={f}><span className="fb-pk-dot"></span>{f}</li>
                    ))}
                  </ul>
                  <div className="fb-card-divider"></div>
                  <div className="fb-card-action">
                    <span className="fb-card-action-label">{role.actionLabel}</span>
                    <button
                      className="fb-card-cta"
                      onClick={(e) => { e.stopPropagation(); router.push(role.path) }}
                    >
                      {role.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="fb-hiw-wrap" id="how-it-works">
          <div className="fb-sec-top fb-reveal">
            <div>
              <div className="fb-sec-num">02 — Process</div>
              <div className="fb-sec-title">How it works</div>
            </div>
            <div className="fb-sec-sub">Four steps from idea to royalty.</div>
          </div>

          <div className="fb-hiw-grid">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="fb-hiw-card fb-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                {i < howItWorks.length - 1 && <div className="fb-hiw-connector"></div>}
                <div className="fb-hiw-step">{step.step}</div>
                <span className="fb-hiw-emoji">{step.emoji}</span>
                <div className="fb-hiw-title">{step.title}</div>
                <div className="fb-hiw-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
          <div className="fb-footer">
            <div className="fb-footer-brand">FannyBags</div>
            <div className="fb-footer-copy">© 2026 FannyBags. All rights reserved.</div>
            <div className="fb-footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Help</a>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}