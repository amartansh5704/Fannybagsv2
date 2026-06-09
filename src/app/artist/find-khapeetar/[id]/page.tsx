'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ArtistLayout from '@/components/artist/ArtistLayout'
import {
  Loader2, MapPin, Wallet, User, Briefcase,
  Star, Music, Image as ImageIcon,
  Video, ExternalLink,
} from 'lucide-react'

const AVAIL_COLOR: Record<string, { bg: string; color: string; border: string; dot: string }> = {
  'Available Now': { bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.25)', dot: '#34d399' },
  'Part-Time':     { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24', border: 'rgba(245,158,11,0.25)', dot: '#fbbf24' },
  'Busy':          { bg: 'rgba(239,68,68,0.1)',   color: '#f87171', border: 'rgba(239,68,68,0.25)',  dot: '#f87171' },
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px',
  padding: '14px 16px', color: '#fff', fontSize: '14px', outline: 'none',
  transition: 'all 0.2s ease', fontFamily: 'inherit', boxSizing: 'border-box',
}

const sectionCard: React.CSSProperties = {
  background: 'linear-gradient(135deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
  padding: '28px', backdropFilter: 'blur(20px)',
}

const sectionTitle = (emoji: string, label: string) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
    <div style={{
      width: 34, height: 34, borderRadius: 10, fontSize: 16,
      background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{emoji}</div>
    <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>{label}</h2>
  </div>
)

export default function KhapeetarDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const { data: session, status } = useSession()

  const requestDialogRef = useRef<HTMLDialogElement>(null)

  const id = params.id as string

  const [profile, setProfile] = useState<any>(null)
  const [wallet,  setWallet]  = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)

  const [form, setForm] = useState({
    projectTitle: '', workType: '', description: '',
    budget: '', deadline: '', message: '',
    competingOffer: false, offerGroupId: '',
  })

  const loadWallet = async () => {
    const res  = await fetch('/api/wallet')
    const json = await res.json()
    if (json.success) setWallet(json.data.wallet)
  }

  const loadProfile = async () => {
    const res  = await fetch(`/api/khapeetar/${id}`)
    const json = await res.json()
    if (json.success) setProfile(json.data)
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/artist/login'); return }
    Promise.all([loadProfile(), loadWallet()]).finally(() => setLoading(false))
  }, [status, session])

  const sendRequest = async () => {
    if (!form.projectTitle || !form.workType || !form.description || !form.budget) {
      alert('Please fill all required fields'); return
    }
    setSending(true)
    const finalOfferGroupId = form.competingOffer ? (form.offerGroupId || crypto.randomUUID()) : null
    const res  = await fetch('/api/deals', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        khapeetarId: id, projectTitle: form.projectTitle, workType: form.workType,
        description: form.description, budget: Number(form.budget),
        deadline: form.deadline || null, message: form.message || null,
        offerGroupId: finalOfferGroupId,
      }),
    })
    const json = await res.json()
    if (json.success) {
      alert('Work request sent')
      requestDialogRef.current?.close()
      setForm({ projectTitle:'', workType:'', description:'', budget:'', deadline:'', message:'', competingOffer:false, offerGroupId:'' })
      await loadWallet()
    } else alert(json.error || 'Failed')
    setSending(false)
  }

  if (loading) {
    return (
      <ArtistLayout>
        <style jsx global>{`
          @keyframes kdFloatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
          @keyframes kdSpin { to{transform:rotate(360deg)} }
        `}</style>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', width:'300px', height:'300px', background:'radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%)', borderRadius:'50%', animation:'kdFloatOrb 4s ease-in-out infinite' }} />
          <Loader2 style={{ animation:'kdSpin 1s linear infinite', color:'#a78bfa', width:40, height:40, position:'relative', zIndex:1 }} />
          <p style={{ marginTop:16, color:'#52525b', fontSize:14, position:'relative', zIndex:1 }}>Loading profile...</p>
        </div>
      </ArtistLayout>
    )
  }

  const budget        = Number(form.budget || 0)
  const walletBalance = wallet?.balance || 0
  const insufficient  = budget > walletBalance
  const shortfall     = Math.max(0, budget - walletBalance)
  const avColor       = AVAIL_COLOR[profile?.availability] ?? AVAIL_COLOR['Available Now']

  const portfolioImages = (profile?.portfolioLinks ?? []).filter((url: string) =>
    !url.includes('/video/') && !url.match(/\.(mp4|webm|mov)$/i)
  )
  const portfolioAudio = (profile?.portfolioLinks ?? []).filter((url: string) =>
    url.includes('/video/') || url.match(/\.(mp4|webm|mov|mp3|wav|flac)$/i)
  )

  const focusStyle = (e: React.FocusEvent<any>) => {
    e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
    e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(139,92,246,0.1)'
  }
  const blurStyle = (e: React.FocusEvent<any>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
    e.currentTarget.style.boxShadow   = 'none'
  }

  return (
    <ArtistLayout>
      <style jsx global>{`
        @keyframes kdFloatOrb  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
        @keyframes kdFloatOrb2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-15px) scale(1.03)} }
        @keyframes kdFadeInUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kdGradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes kdPulseDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }
        @keyframes kdSpin      { to{transform:rotate(360deg)} }
        @keyframes kdImgReveal { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
        @keyframes kdLightbox  { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }

        dialog::backdrop { background:rgba(0,0,0,0.8); backdrop-filter:blur(12px); }
        dialog { border:none; padding:0; background:transparent; }
        dialog[open] { animation:kdFadeInUp 0.3s ease-out; }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type="number"] { -moz-appearance:textfield; }

        .kd-scrollbar::-webkit-scrollbar { width:6px; }
        .kd-scrollbar::-webkit-scrollbar-track { background:transparent; }
        .kd-scrollbar::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:3px; }
        .kd-scrollbar::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.15); }
      `}</style>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', animation: 'kdLightbox 0.2s ease-out',
          }}
        >
          <img src={lightbox} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 16 }} />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', top: 20, right: 20, width: 40, height: 40, borderRadius: 10,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
            }}
          >✕</button>
        </div>
      )}

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', position:'relative', overflow:'hidden', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient orbs */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-100px', right:'-60px', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)', borderRadius:'50%', animation:'kdFloatOrb 8s ease-in-out infinite' }} />
          <div style={{ position:'absolute', top:'40%', left:'-120px', width:'400px', height:'400px', background:'radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)', borderRadius:'50%', animation:'kdFloatOrb2 10s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'-50px', right:'25%', width:'350px', height:'350px', background:'radial-gradient(circle,rgba(236,72,153,0.05) 0%,transparent 70%)', borderRadius:'50%', animation:'kdFloatOrb 12s ease-in-out infinite' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        <div style={{ position:'relative', zIndex:1, padding:'32px 24px', maxWidth:'1300px', margin:'0 auto', animation:'kdFadeInUp 0.5s ease-out' }}>

          {/* Back */}
          <button
            onClick={() => router.back()}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateX(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.color='#a1a1aa'; e.currentTarget.style.transform='translateX(0)' }}
            style={{ marginBottom:32, display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, color:'#a1a1aa', fontSize:14, fontWeight:500, cursor:'pointer', transition:'all 0.3s ease', fontFamily:'inherit' }}
          >← Back</button>

          {/* 2-col layout */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:28, alignItems:'start' }}>

            {/* ── LEFT ─────────────────────────────────────────── */}
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

              {/* Hero profile card */}
              <div style={{ ...sectionCard, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#8b5cf6,#ec4899,#8b5cf6)', backgroundSize:'200% 100%', animation:'kdGradShift 4s ease-in-out infinite' }} />
                <div style={{ position:'absolute', top:'-10px', left:'20%', right:'20%', height:20, background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.3),rgba(236,72,153,0.3),transparent)', filter:'blur(15px)' }} />

                <div style={{ display:'flex', alignItems:'flex-start', gap:24, flexWrap:'wrap' }}>
                  <div style={{ position:'relative' }}>
                    <div style={{ position:'absolute', inset:'-4px', background:'linear-gradient(135deg,rgba(139,92,246,0.5),rgba(236,72,153,0.5))', borderRadius:20, filter:'blur(12px)', opacity:0.6 }} />
                    <div style={{ position:'relative', width:80, height:80, borderRadius:20, background:'linear-gradient(135deg,#8b5cf6,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(139,92,246,0.3)', fontSize:32, fontWeight:800, color:'#fff' }}>
                      {profile?.name?.charAt(0)?.toUpperCase() ?? <User size={30} color="#fff" />}
                    </div>
                    <div style={{ position:'absolute', bottom:'-2px', right:'-2px', width:20, height:20, background: avColor.dot, borderRadius:'50%', border:'3px solid #06060a', boxShadow:`0 0 10px ${avColor.dot}80` }} />
                  </div>

                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:8 }}>
                      <h1 style={{ fontSize:28, fontWeight:800, background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1.2, margin:0 }}>
                        {profile?.name || 'Khapeetar'}
                      </h1>
                      {profile?.isVerified && <Star size={16} color="#fbbf24" fill="#fbbf24" />}
                      <span style={{ padding:'4px 12px', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', background:avColor.bg, color:avColor.color, border:`1px solid ${avColor.border}`, borderRadius:20, display:'flex', alignItems:'center', gap:5 }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:avColor.dot, display:'inline-block', animation:'kdPulseDot 2s ease-in-out infinite' }} />
                        {profile?.availability || 'Available'}
                      </span>
                    </div>

                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
                      {profile?.primaryRole && (
                        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.15)', borderRadius:10, color:'#c4b5fd', fontSize:13, fontWeight:500 }}>
                          <Briefcase size={13} color="#a78bfa" />{profile.primaryRole}
                        </div>
                      )}
                      {(profile?.city || profile?.state) && (
                        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', background:'rgba(236,72,153,0.08)', border:'1px solid rgba(236,72,153,0.15)', borderRadius:10, color:'#f9a8d4', fontSize:13, fontWeight:500 }}>
                          <MapPin size={13} color="#f472b6" />{[profile.city, profile.state].filter(Boolean).join(', ')}
                        </div>
                      )}
                      {profile?.workMode && (
                        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#a1a1aa', fontSize:13, fontWeight:500 }}>
                          {profile.workMode === 'Remote' ? '🏠' : profile.workMode === 'Onsite' ? '🏢' : '🔄'} {profile.workMode}
                        </div>
                      )}
                    </div>

                    <div style={{ display:'flex', gap:28, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                      {[
                        { value: profile?.experienceYears ? `${profile.experienceYears}y` : '—', label:'Experience' },
                        { value: profile?.projectsCompleted ?? '—', label:'Projects' },
                        { value: profile?.startingBudget > 0 ? `₹${Number(profile.startingBudget).toLocaleString('en-IN')}` : 'Negotiable', label:'Starting at' },
                      ].map((s, i) => (
                        <div key={i}>
                          <p style={{ fontSize:18, fontWeight:800, color: i === 2 ? '#c084fc' : '#fff', margin:0, lineHeight:1.2 }}>{s.value}</p>
                          <p style={{ fontSize:10, color:'#52525b', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:3, fontWeight:600 }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div style={sectionCard}>
                {sectionTitle('✍️', 'About')}
                <p style={{ color:'#a1a1aa', lineHeight:1.8, fontSize:15, margin:0 }}>
                  {profile?.bio || 'No bio available for this khapeetar yet.'}
                </p>
              </div>

              {/* Skills */}
              {profile?.skills?.length > 0 && (
                <div style={sectionCard}>
                  {sectionTitle('⚡', 'Skills')}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {profile.skills.map((s: string) => (
                      <span key={s} style={{ padding:'7px 14px', borderRadius:999, fontSize:13, fontWeight:600, background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.18)', color:'#c4b5fd' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social + Credits */}
              {(profile?.instagram || profile?.youtube || profile?.spotifyCredits) && (
                <div style={sectionCard}>
                  {sectionTitle('🔗', 'Links & Credits')}
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {profile.instagram && (
                      <a href={profile.instagram.startsWith('http') ? profile.instagram : `https://instagram.com/${profile.instagram.replace('@','')}`}
                        target="_blank" rel="noreferrer"
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, textDecoration:'none', color:'#f9a8d4', fontSize:14, fontWeight:500 }}>
                        📸 {profile.instagram}
                        <ExternalLink size={12} style={{ marginLeft:'auto', color:'#52525b' }} />
                      </a>
                    )}
                    {profile.youtube && (
                      <a href={profile.youtube.startsWith('http') ? profile.youtube : `https://${profile.youtube}`}
                        target="_blank" rel="noreferrer"
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, textDecoration:'none', color:'#fca5a5', fontSize:14, fontWeight:500 }}>
                        🎬 {profile.youtube}
                        <ExternalLink size={12} style={{ marginLeft:'auto', color:'#52525b' }} />
                      </a>
                    )}
                    {profile.spotifyCredits && (
                      <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12 }}>
                        <Music size={16} color="#4ade80" style={{ marginTop:2, flexShrink:0 }} />
                        <div>
                          <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 4px 0' }}>Spotify Credits</p>
                          <p style={{ fontSize:14, color:'#a1a1aa', margin:0, lineHeight:1.6 }}>{profile.spotifyCredits}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Portfolio images */}
              {portfolioImages.length > 0 && (
                <div style={sectionCard}>
                  {sectionTitle('🎨', `Portfolio — ${portfolioImages.length} image${portfolioImages.length !== 1 ? 's' : ''}`)}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12 }}>
                    {portfolioImages.map((url: string, i: number) => (
                      <div
                        key={url}
                        onClick={() => setLightbox(url)}
                        style={{ position:'relative', overflow:'hidden', borderRadius:14, cursor:'zoom-in', border:'1px solid rgba(255,255,255,0.07)', background:'#0d0d12', transition:'all 0.3s ease', animation:`kdImgReveal 0.4s ease-out ${i * 0.05}s both` }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px) scale(1.02)'; e.currentTarget.style.borderColor='rgba(139,92,246,0.3)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.4)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0) scale(1)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none' }}
                      >
                        <img src={url} alt="" style={{ width:'100%', height:160, objectFit:'cover', display:'block' }} />
                        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 50%)', pointerEvents:'none' }} />
                        <div style={{ position:'absolute', bottom:8, left:8, padding:'3px 8px', borderRadius:6, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', fontSize:10, fontWeight:600, color:'#a1a1aa', display:'flex', alignItems:'center', gap:4 }}>
                          <ImageIcon size={9} /> Image
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize:11, color:'#3f3f46', margin:'12px 0 0 0', fontWeight:500 }}>Click any image to enlarge</p>
                </div>
              )}

              {/* Portfolio audio */}
              {portfolioAudio.length > 0 && (
                <div style={sectionCard}>
                  {sectionTitle('🎵', `Audio / Video Samples — ${portfolioAudio.length} track${portfolioAudio.length !== 1 ? 's' : ''}`)}
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    {portfolioAudio.map((url: string, i: number) => {
                      const isVideo = url.match(/\.(mp4|webm|mov)$/i) || url.includes('/video/')
                      return (
                        <div key={url} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'14px 16px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                            {isVideo ? <Video size={13} color="#c084fc" /> : <Music size={13} color="#c084fc" />}
                            <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#52525b' }}>
                              {isVideo ? 'Video' : 'Audio'} #{i + 1}
                            </span>
                            <a href={url} target="_blank" rel="noreferrer" style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#8b5cf6', textDecoration:'none', fontWeight:600 }}>
                              <ExternalLink size={11} /> Open
                            </a>
                          </div>
                          {isVideo ? (
                            <video controls src={url} style={{ width:'100%', borderRadius:10, maxHeight:240 }} />
                          ) : (
                            <audio controls src={url} style={{ width:'100%', borderRadius:10 }} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                {[
                  { icon:'🛡️', title:'Verified',   sub:'Identity confirmed',    color:'rgba(16,185,129,' },
                  { icon:'⚡', title:'Fast Reply',  sub:'Usually within hours',  color:'rgba(245,158,11,' },
                  { icon:'✨', title:'Top Rated',   sub:'Highly recommended',    color:'rgba(139,92,246,' },
                ].map((item, i) => (
                  <div key={i}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=`${item.color}0.3)`; e.currentTarget.style.transform='translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(0)' }}
                    style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'20px 16px', textAlign:'center', cursor:'default', transition:'all 0.3s ease' }}
                  >
                    <div style={{ fontSize:24, marginBottom:8 }}>{item.icon}</div>
                    <p style={{ fontSize:13, fontWeight:600, color:'#fff', margin:0 }}>{item.title}</p>
                    <p style={{ fontSize:11, color:'#52525b', marginTop:2 }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT sidebar ──────────────────────────────────── */}
            <div style={{ position:'sticky', top:32, display:'flex', flexDirection:'column', gap:16 }}>

              {/* Quick info card */}
              <div style={{ ...sectionCard, padding:20 }}>
                <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#3f3f46', margin:'0 0 14px 0' }}>Quick Info</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    { label:'Primary Role',    value: profile?.primaryRole },
                    { label:'Experience',      value: profile?.experienceYears ? `${profile.experienceYears} years` : null },
                    { label:'Projects Done',   value: profile?.projectsCompleted ? `${profile.projectsCompleted}` : null },
                    { label:'Starting Budget', value: profile?.startingBudget > 0 ? `₹${Number(profile.startingBudget).toLocaleString('en-IN')}` : 'Negotiable' },
                    { label:'Work Mode',       value: profile?.workMode },
                    { label:'Availability',    value: profile?.availability },
                    { label:'Location',        value: [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') || null },
                  ].filter(r => r.value).map((row, i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize:12, color:'#52525b', fontWeight:600 }}>{row.label}</span>
                      <span style={{ fontSize:12, color:'#a1a1aa', fontWeight:600, textAlign:'right', maxWidth:'60%' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wallet + action card */}
              <div style={{ ...sectionCard, position:'relative', overflow:'hidden', padding:24 }}>
                <div style={{ position:'absolute', top:20, right:20, width:120, height:120, background:'radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)', borderRadius:'50%' }} />

                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24, position:'relative' }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Wallet size={20} color="#34d399" />
                  </div>
                  <div>
                    <p style={{ fontSize:10, textTransform:'uppercase', letterSpacing:'0.12em', color:'#52525b', fontWeight:600, margin:0 }}>Wallet Balance</p>
                    <p style={{ fontSize:26, fontWeight:800, color:'#34d399', lineHeight:1.2, margin:0, textShadow:'0 0 20px rgba(52,211,153,0.3)' }}>
                      ₹{walletBalance.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => requestDialogRef.current?.showModal()}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 40px rgba(139,92,246,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(139,92,246,0.25)' }}
                  style={{ width:'100%', padding:18, borderRadius:14, background:'linear-gradient(135deg,#7c3aed,#db2777)', border:'none', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', transition:'all 0.3s ease', boxShadow:'0 4px 24px rgba(139,92,246,0.25)', fontFamily:'inherit' }}
                >🚀 Send Work Request</button>
              </div>

              {/* Escrow info */}
              <div style={{ background:'rgba(59,130,246,0.04)', border:'1px solid rgba(59,130,246,0.1)', borderRadius:14, padding:16 }}>
                <p style={{ fontSize:12, color:'#71717a', lineHeight:1.6, margin:0 }}>
                  💡 Your budget will be held securely in escrow until the work is completed or the request expires.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── REQUEST MODAL ─────────────────────────────────────── */}
        <dialog ref={requestDialogRef} style={{ width:680, maxWidth:'95vw', maxHeight:'90vh', borderRadius:24, overflow:'hidden', boxShadow:'0 25px 80px rgba(0,0,0,0.6)' }}>
          <div style={{ background:'#0f0f14', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, overflow:'hidden' }}>
            <div style={{ padding:'24px 28px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.15))', border:'1px solid rgba(139,92,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🚀</div>
                <div>
                  <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', margin:0 }}>Send Work Request</h2>
                  <p style={{ fontSize:12, color:'#52525b', margin:'2px 0 0 0' }}>to {profile?.name}</p>
                </div>
              </div>
              <button onClick={() => requestDialogRef.current?.close()}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#71717a' }}
                style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#71717a', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s ease', fontFamily:'inherit' }}>✕</button>
            </div>

            <div className="kd-scrollbar" style={{ padding:'24px 28px', overflowY:'auto', maxHeight:'calc(90vh - 80px)' }}>
              {/* Wallet bar */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.12)', borderRadius:14, padding:'14px 18px', marginBottom:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, color:'#34d399' }}>
                  <Wallet size={16} /><span style={{ fontSize:13, fontWeight:600 }}>Wallet Balance</span>
                </div>
                <span style={{ fontSize:14, fontWeight:800, color:'#34d399' }}>₹{walletBalance.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[
                  { label:'Project Title', placeholder:'e.g. Album Cover Design', key:'projectTitle', type:'input' },
                  { label:'Work Type',     placeholder:'e.g. Design, Music Production', key:'workType', type:'input' },
                  { label:'Description',   placeholder:'Describe the work you need in detail...', key:'description', type:'textarea' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display:'block', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'#71717a', marginBottom:8 }}>
                      {field.label} <span style={{ color:'#ef4444' }}>*</span>
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea placeholder={field.placeholder} rows={3} value={(form as any)[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        style={{ ...inputStyle, resize:'none' as const }}
                        onFocus={focusStyle} onBlur={blurStyle} />
                    ) : (
                      <input placeholder={field.placeholder} value={(form as any)[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                    )}
                  </div>
                ))}

                {/* Budget */}
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'#71717a', marginBottom:8 }}>
                    Budget (₹) <span style={{ color:'#ef4444' }}>*</span>
                  </label>
                  <input type="number" placeholder="0" value={form.budget}
                    onChange={e => setForm({ ...form, budget: e.target.value })}
                    style={{ ...inputStyle, fontSize:16, fontWeight:700 }}
                    onFocus={focusStyle} onBlur={blurStyle} />
                </div>

                {/* Competing offer */}
                <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:18 }}>
                  <label style={{ display:'flex', alignItems:'flex-start', gap:14, cursor:'pointer' }}>
                    <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${form.competingOffer ? '#8b5cf6' : '#3f3f46'}`, background:form.competingOffer ? '#8b5cf6' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s ease', flexShrink:0, marginTop:2 }}>
                      {form.competingOffer && <span style={{ color:'#fff', fontSize:12, fontWeight:700 }}>✓</span>}
                    </div>
                    <input type="checkbox" checked={form.competingOffer}
                      onChange={e => setForm({ ...form, competingOffer: e.target.checked, offerGroupId: e.target.checked && !form.offerGroupId ? crypto.randomUUID() : form.offerGroupId })}
                      style={{ display:'none' }} />
                    <div>
                      <p style={{ fontSize:14, fontWeight:600, color:'#fff', margin:0 }}>⚔️ Competing Offer</p>
                      <p style={{ fontSize:12, color:'#52525b', margin:'4px 0 0 0', lineHeight:1.5 }}>Enable if you&apos;re sending the same project to multiple khapeetars. Only one will be accepted.</p>
                    </div>
                  </label>
                </div>

                {/* Insufficient */}
                {insufficient && (
                  <div style={{ display:'flex', alignItems:'center', gap:14, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:14, padding:'16px 18px' }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:'rgba(239,68,68,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>⚠️</div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:'#f87171', margin:0 }}>Insufficient Balance</p>
                      <p style={{ fontSize:12, color:'rgba(248,113,113,0.6)', margin:'2px 0 0 0' }}>Add ₹{shortfall.toLocaleString('en-IN')} more to proceed</p>
                    </div>
                  </div>
                )}

                {/* Deadline */}
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'#71717a', marginBottom:8 }}>
                    Deadline <span style={{ color:'#3f3f46' }}>(optional)</span>
                  </label>
                  <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                    style={{ ...inputStyle, colorScheme:'dark' as any }} onFocus={focusStyle} onBlur={blurStyle} />
                </div>

                {/* Message */}
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'#71717a', marginBottom:8 }}>
                    Message <span style={{ color:'#3f3f46' }}>(optional)</span>
                  </label>
                  <textarea placeholder="Any additional notes..." rows={2} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize:'none' as const }} onFocus={focusStyle} onBlur={blurStyle} />
                </div>

                {/* Buttons */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, paddingTop:8 }}>
                  <button onClick={() => requestDialogRef.current?.close()}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#a1a1aa' }}
                    style={{ padding:16, borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#a1a1aa', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 0.3s ease', fontFamily:'inherit' }}>
                    Cancel
                  </button>
                  <button onClick={sendRequest} disabled={sending || insufficient}
                    onMouseEnter={e => { if (!sending && !insufficient) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 30px rgba(139,92,246,0.4)' } }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 16px rgba(139,92,246,0.2)' }}
                    style={{ padding:16, borderRadius:14, background:(sending||insufficient) ? '#27272a' : 'linear-gradient(135deg,#7c3aed,#db2777)', border:'none', color:(sending||insufficient) ? '#52525b' : '#fff', fontSize:14, fontWeight:700, cursor:(sending||insufficient) ? 'not-allowed' : 'pointer', transition:'all 0.3s ease', fontFamily:'inherit', boxShadow:(sending||insufficient) ? 'none' : '0 2px 16px rgba(139,92,246,0.2)' }}>
                    {sending ? '⏳ Sending...' : '🚀 Send Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </ArtistLayout>
  )
}