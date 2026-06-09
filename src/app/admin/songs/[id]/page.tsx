'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Loader2, ArrowLeft, TrendingUp, Send, CheckCircle, ExternalLink,
} from 'lucide-react'

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export default function AdminSongDetailPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()

  const [song, setSong]                 = useState<any>(null)
  const [loading, setLoading]           = useState(true)
  const [distributing, setDistributing] = useState(false)
  const [success, setSuccess]           = useState('')
  const [error, setError]               = useState('')
  const [hoveredBtn, setHoveredBtn]     = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const [form, setForm] = useState({
    revenueAmount: '',
    spotifyStreams: '',
    youtubeStreams: '',
    appleStreams:   '',
  })

  const fetchSong = () => {
    fetch(`/api/admin/songs/${id}`)
      .then(r => r.json())
      .then(j => { if (j.success) setSong(j.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchSong() }, [id])

  const distribute = async () => {
    setError(''); setSuccess('')
    const amount = Number(form.revenueAmount)
    if (!amount || amount <= 0) { setError('Enter a valid revenue amount'); return }

    setDistributing(true)
    try {
      const res  = await fetch(`/api/admin/songs/${id}/distribute`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revenueAmount: amount,
          spotifyStreams: Number(form.spotifyStreams || 0),
          youtubeStreams: Number(form.youtubeStreams || 0),
          appleStreams:   Number(form.appleStreams   || 0),
        }),
      })
      const json = await res.json()
      if (!json.success) { setError(json.error || 'Distribution failed'); return }
      setSuccess(json.message)
      setForm({ revenueAmount: '', spotifyStreams: '', youtubeStreams: '', appleStreams: '' })
      fetchSong()
    } catch {
      setError('Network error')
    } finally {
      setDistributing(false)
    }
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    background: focusedField === field ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focusedField === field ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '14px',
    padding: '13px 16px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    boxShadow: focusedField === field ? '0 0 0 3px rgba(239,68,68,0.08)' : 'none',
  })

  if (loading) {
    return (
      <AdminLayout>
        <style jsx global>{`
          @keyframes asdFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
          @keyframes asdSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        `}</style>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#06060a',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(239,68,68,0.12) 0%,transparent 70%)',borderRadius:'50%',animation:'asdFloatOrb 4s ease-in-out infinite'}}/>
          <Loader2 style={{animation:'asdSpin 1s linear infinite',color:'#f87171',width:'36px',height:'36px',position:'relative',zIndex:1}}/>
          <p style={{marginTop:'16px',color:'#52525b',fontSize:'14px',position:'relative',zIndex:1}}>Loading song...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!song) {
    return (
      <AdminLayout>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#06060a',gap:'12px'}}>
          <div style={{fontSize:'32px'}}>🎵</div>
          <p style={{color:'#f87171',fontSize:'15px',fontWeight:600}}>Song not found</p>
          <button onClick={() => router.back()} style={{fontSize:'13px',color:'#71717a',border:'none',cursor:'pointer',fontFamily:'inherit',padding:'8px 16px',borderRadius:'10px',background:'rgba(255,255,255,0.04)'}}>← Back</button>
        </div>
      </AdminLayout>
    )
  }

  const campaign    = song.campaign
  const dist        = song.distribution
  const totalRaised = campaign?.amountRaised    ?? 0
  const fundingAsk  = campaign?.totalFundingAsk ?? 0
  const fanShare    = campaign?.fanRevenueShare  ?? 0
  const artistShare = 100 - fanShare
  const progress    = fundingAsk > 0 ? Math.min(100, (totalRaised / fundingAsk) * 100) : 0

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes asdFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes asdFloatOrb2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.03)}}
        @keyframes asdFadeInDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes asdFadeInUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes asdFadeInStagger{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes asdGradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes asdShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes asdPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        @keyframes asdSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none}
        input[type="number"]{-moz-appearance:textfield}
      `}</style>

      <div style={{
        minHeight:'100vh',background:'#06060a',color:'#ffffff',
        position:'relative',overflow:'hidden',
        fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0}}>
          <div style={{position:'absolute',top:'-80px',right:'-40px',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(239,68,68,0.05) 0%,transparent 70%)',borderRadius:'50%',animation:'asdFloatOrb 10s ease-in-out infinite'}}/>
          <div style={{position:'absolute',bottom:'10%',left:'-80px',width:'400px',height:'400px',background:'radial-gradient(circle,rgba(168,85,247,0.04) 0%,transparent 70%)',borderRadius:'50%',animation:'asdFloatOrb2 13s ease-in-out infinite'}}/>
          <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,backgroundSize:'60px 60px'}}/>
        </div>

        {/* Header */}
        <div style={{
          position:'relative',zIndex:1,
          borderBottom:'1px solid rgba(255,255,255,0.05)',
          background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)',
          backdropFilter:'blur(20px)',
          animation:'asdFadeInDown 0.5s ease-out',
        }}>
          <div style={{padding:'22px 32px',maxWidth:'1050px',margin:'0 auto',display:'flex',alignItems:'center',gap:'16px'}}>
            <button
              onClick={() => router.back()}
              onMouseEnter={() => setHoveredBtn('back')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                display:'flex',alignItems:'center',justifyContent:'center',
                width:'38px',height:'38px',borderRadius:'12px',
                background: hoveredBtn==='back' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                border:`1px solid ${hoveredBtn==='back' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)'}`,
                color: hoveredBtn==='back' ? '#fff' : '#71717a',
                cursor:'pointer',transition:'all 0.25s ease',flexShrink:0,
              }}
            >
              <ArrowLeft size={17}/>
            </button>
            <div style={{display:'flex',alignItems:'center',gap:'14px',flex:1,minWidth:0}}>
              <div style={{
                width:'44px',height:'44px',borderRadius:'14px',
                background: song.coverArtUrl ? `url(${song.coverArtUrl}) center/cover no-repeat` : 'linear-gradient(135deg,#ef4444,#f43f5e)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:'20px',flexShrink:0,overflow:'hidden',
                boxShadow:'0 4px 16px rgba(239,68,68,0.15)',
              }}>
                {!song.coverArtUrl && '🎵'}
              </div>
              <div>
                <h1 style={{fontSize:'18px',fontWeight:800,margin:0,background:'linear-gradient(135deg,#ffffff 0%,#d4d4d8 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  {song.title}
                </h1>
                <p style={{fontSize:'13px',color:'#52525b',margin:'2px 0 0 0',fontWeight:500}}>
                  {song.artist?.name} · {song.language}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{position:'relative',zIndex:1,padding:'28px 32px 56px',maxWidth:'1050px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'24px'}}>

          {/* Section helper */}
          {(() => {
            const Section = ({ label, children, index = 0 }: { label: string; children: React.ReactNode; index?: number }) => (
              <div style={{animation:`asdFadeInStagger 0.4s ease-out ${index * 0.08}s both`}}>
                <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.14em',color:'#3f3f46',fontWeight:700,margin:'0 0 12px 0'}}>{label}</p>
                {children}
              </div>
            )

            const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
              <div style={{
                position:'relative',overflow:'hidden',
                background:'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
                border:'1px solid rgba(255,255,255,0.06)',
                borderRadius:'20px',padding:'22px',
                backdropFilter:'blur(14px)',
                ...style,
              }}>{children}</div>
            )

            const MetaCell = ({ label, value, color = '#d4d4d8', capitalize = false }: { label: string; value: string; color?: string; capitalize?: boolean }) => (
              <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.04)',borderRadius:'14px',padding:'14px'}}>
                <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 5px 0'}}>{label}</p>
                <p style={{fontSize:'14px',fontWeight:600,color,margin:0,textTransform:capitalize?'capitalize':'none'}}>{value}</p>
              </div>
            )

            return (
              <>
                {/* Song meta */}
                <Section label="Song Info" index={0}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'10px'}}>
                    <MetaCell label="Status"     value={song.status || '—'}                          color="#34d399" capitalize/>
                    <MetaCell label="Genre"      value={song.genre  || '—'}                          color="#a1a1aa"/>
                    <MetaCell label="Artist"     value={song.artist?.name || '—'}                    color="#60a5fa"/>
                    <MetaCell label="Stage Name" value={song.artist?.artistProfile?.stageName || '—'} color="#c084fc"/>
                  </div>
                </Section>

                {/* Distribution */}
                <Section label="Distribution Details" index={1}>
                  {dist ? (
                    <Card>
                      <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'10px'}}>
                          {[
                            { label:'Release Status', val: dist.releaseStatus || '—', color:'#34d399' },
                            { label:'Release Name',   val: dist.releaseName   || '—', color:'#d4d4d8' },
                            { label:'Primary Genre',  val: dist.primaryGenre  || '—', color:'#a1a1aa' },
                            { label:'Release Type',   val: dist.releaseType   || '—', color:'#a1a1aa' },
                            { label:'Release Date',   val: dist.releaseDate ? new Date(dist.releaseDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—', color:'#60a5fa' },
                            { label:'Primary Artist', val: dist.primaryArtist || '—', color:'#c084fc' },
                          ].map(({label,val,color}) => (
                            <MetaCell key={label} label={label} value={val} color={color}/>
                          ))}
                        </div>

                        {/* Boolean flags */}
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:'10px'}}>
                          {[
                            { label:'Explicit Lyrics',   val: dist.explicitLyrics },
                            { label:'Free Beat Used',    val: dist.hasFreeBeat },
                            { label:'Migration Approved',val: dist.migrationApproved },
                          ].map(({label,val}) => (
                            <div key={label} style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.04)',borderRadius:'14px',padding:'14px'}}>
                              <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 5px 0'}}>{label}</p>
                              <p style={{fontSize:'14px',fontWeight:700,color: val ? '#34d399' : '#71717a',margin:0}}>{val ? '✅ Yes' : '❌ No'}</p>
                            </div>
                          ))}
                        </div>

                        {/* Additional artists */}
                        {dist.additionalArtists?.length > 0 && (
                          <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.04)',borderRadius:'14px',padding:'14px'}}>
                            <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 6px 0'}}>Additional Artists</p>
                            <p style={{fontSize:'14px',color:'#a1a1aa',margin:0}}>{dist.additionalArtists.join(', ')}</p>
                          </div>
                        )}

                        {/* Song file */}
                        {dist.songFileUrl && (
                          <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.04)',borderRadius:'14px',padding:'14px'}}>
                            <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 6px 0'}}>Song File</p>
                            <a href={dist.songFileUrl} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'6px',fontSize:'13px',color:'#f87171',fontWeight:600,textDecoration:'none'}}>
                              Open Song File <ExternalLink size={12}/>
                            </a>
                          </div>
                        )}

                        {/* Contributors */}
                        {Array.isArray(dist.contributors) && dist.contributors.length > 0 && (
                          <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.04)',borderRadius:'14px',padding:'14px'}}>
                            <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 10px 0'}}>Contributors</p>
                            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                              {dist.contributors.map((c: {name:string;role:string}, i: number) => (
                                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                  <p style={{fontSize:'13px',color:'#a1a1aa',margin:0}}>{c.name}</p>
                                  <span style={{fontSize:'10px',padding:'3px 10px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'20px',color:'#71717a'}}>{c.role}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Streaming links */}
                        {(dist.spotifyLink || dist.appleMusicLink) && (
                          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'10px'}}>
                            {dist.spotifyLink && (
                              <div style={{background:'rgba(16,185,129,0.05)',border:'1px solid rgba(16,185,129,0.1)',borderRadius:'14px',padding:'14px'}}>
                                <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 6px 0'}}>Spotify</p>
                                <a href={dist.spotifyLink} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'6px',fontSize:'12px',color:'#34d399',fontWeight:600,textDecoration:'none'}}>
                                  Open Profile <ExternalLink size={11}/>
                                </a>
                              </div>
                            )}
                            {dist.appleMusicLink && (
                              <div style={{background:'rgba(236,72,153,0.05)',border:'1px solid rgba(236,72,153,0.1)',borderRadius:'14px',padding:'14px'}}>
                                <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 6px 0'}}>Apple Music</p>
                                <a href={dist.appleMusicLink} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'6px',fontSize:'12px',color:'#f472b6',fontWeight:600,textDecoration:'none'}}>
                                  Open Profile <ExternalLink size={11}/>
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ) : (
                    <Card>
                      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                        <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',flexShrink:0}}>📭</div>
                        <p style={{fontSize:'14px',color:'#52525b',margin:0}}>No distribution data submitted for this song yet.</p>
                      </div>
                    </Card>
                  )}
                </Section>

                {/* Campaign */}
                {campaign && (
                  <Section label="Campaign" index={2}>
                    <Card>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:'10px',marginBottom:'16px'}}>
                        {[
                          { label:'Funding Ask',      val: formatINR(fundingAsk),  color:'#d4d4d8' },
                          { label:'Raised',           val: formatINR(totalRaised), color:'#f87171' },
                          { label:'Fan Revenue %',    val: `${fanShare}%`,          color:'#c084fc' },
                          { label:'Artist Revenue %', val: `${artistShare}%`,       color:'#34d399' },
                        ].map(({label,val,color}) => <MetaCell key={label} label={label} value={val} color={color}/>)}
                      </div>
                      <div style={{height:'6px',background:'rgba(255,255,255,0.04)',borderRadius:'3px',overflow:'hidden',marginBottom:'8px'}}>
                        <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#ef4444,#f43f5e)',backgroundSize:'200% 100%',animation:'asdGradientShift 3s ease-in-out infinite',borderRadius:'3px',boxShadow:'0 0 10px rgba(239,68,68,0.2)',transition:'width 0.5s ease'}}/>
                      </div>
                      <p style={{fontSize:'11px',color:'#3f3f46',margin:0,fontWeight:600}}>{Math.round(progress)}% funded</p>
                    </Card>
                  </Section>
                )}

                {/* Investors */}
                {campaign?.investments?.length > 0 && (
                  <Section label={`Investors (${campaign.investments.length})`} index={3}>
                    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                      {campaign.investments.map((inv: any) => (
                        <div key={inv.id} style={{
                          display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',
                          padding:'16px 20px',
                          background:'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
                          border:'1px solid rgba(255,255,255,0.06)',
                          borderRadius:'16px',backdropFilter:'blur(12px)',
                        }}>
                          <div style={{display:'flex',alignItems:'center',gap:'12px',minWidth:0}}>
                            <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.15))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:800,color:'#a78bfa',flexShrink:0}}>
                              {inv.fan?.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div style={{minWidth:0}}>
                              <p style={{fontSize:'14px',fontWeight:600,color:'#fff',margin:'0 0 2px 0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{inv.fan?.name}</p>
                              <p style={{fontSize:'12px',color:'#52525b',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{inv.fan?.email}</p>
                            </div>
                          </div>
                          <div style={{textAlign:'right',flexShrink:0}}>
                            <p style={{fontSize:'15px',fontWeight:700,color:'#34d399',margin:'0 0 2px 0'}}>{formatINR(inv.amount)}</p>
                            <p style={{fontSize:'11px',color:'#52525b',margin:0,fontWeight:600}}>{inv.ownershipPct.toFixed(2)}% owned</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Metrics */}
                {song.metrics && (
                  <Section label="Metrics" index={4}>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'10px'}}>
                      {[
                        { label:'🎧 Total Streams',   val: (song.metrics.totalStreams??0).toLocaleString('en-IN'), color:'#60a5fa' },
                        { label:'💵 Total Revenue',   val: formatINR(song.metrics.totalRevenue??0),                color:'#34d399' },
                        { label:'🎤 Artist Earnings', val: formatINR(song.metrics.artistEarnings??0),              color:'#c084fc' },
                        { label:'💎 Fan Payouts',     val: formatINR(song.metrics.fanPayoutsTotal??0),             color:'#f472b6' },
                      ].map(({label,val,color}) => <MetaCell key={label} label={label} value={val} color={color}/>)}
                    </div>
                  </Section>
                )}

                {/* Escrow Release */}
                {campaign && (
                  <Section label="Campaign Escrow Release" index={5}>
                    <Card style={{background:'linear-gradient(135deg,rgba(16,185,129,0.04) 0%,rgba(255,255,255,0.015) 100%)',border:'1px solid rgba(16,185,129,0.1)'}}>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'10px',marginBottom:'16px'}}>
                        {[
                          { label:'Total Raised',       val: formatINR(totalRaised),              color:'#d4d4d8' },
                          { label:'Escrow Held',         val: formatINR(campaign.escrowHeldAmount||0), color:'#fbbf24' },
                          { label:'Admin Fee (5%)',       val: formatINR(totalRaised * 0.05),       color:'#f87171' },
                          { label:'Artist Release (95%)',val: formatINR(totalRaised * 0.95),       color:'#34d399' },
                        ].map(({label,val,color}) => <MetaCell key={label} label={label} value={val} color={color}/>)}
                      </div>
                      <div style={{padding:'14px 18px',background: campaign.fundsReleased ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)',border:`1px solid ${campaign.fundsReleased ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)'}`,borderRadius:'14px',marginBottom:'16px'}}>
                        {campaign.fundsReleased ? (
                          <span style={{fontSize:'13px',color:'#34d399',fontWeight:600}}>
                            ✅ Funds released on {campaign.releasedAt ? new Date(campaign.releasedAt).toLocaleDateString('en-IN') : 'completed'}
                          </span>
                        ) : (
                          <span style={{fontSize:'13px',color:'#fbbf24',fontWeight:600}}>⏳ Funds currently held in admin escrow</span>
                        )}
                      </div>
                      {!campaign.fundsReleased && totalRaised > 0 && (
                        <button
                          onClick={async () => {
                            const ok = confirm('Release campaign funds to artist?')
                            if (!ok) return
                            const res  = await fetch(`/api/admin/songs/${song.id}/release-funds`, { method: 'POST' })
                            const json = await res.json()
                            if (!json.success) { alert(json.error || 'Release failed'); return }
                            alert('Funds released successfully')
                            fetchSong()
                          }}
                          onMouseEnter={() => setHoveredBtn('release')}
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{
                            position:'relative',width:'100%',padding:'15px',
                            background: hoveredBtn==='release' ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#10b981,#34d399)',
                            border:'none',borderRadius:'14px',color:'#000',
                            fontSize:'14px',fontWeight:700,cursor:'pointer',
                            fontFamily:'inherit',transition:'all 0.3s ease',
                            transform: hoveredBtn==='release' ? 'translateY(-1px)' : 'translateY(0)',
                            boxShadow: hoveredBtn==='release' ? '0 6px 28px rgba(16,185,129,0.3)' : '0 2px 12px rgba(16,185,129,0.15)',
                            overflow:'hidden',
                          }}
                        >
                          {hoveredBtn==='release' && <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',backgroundSize:'200% 100%',animation:'asdShimmer 1.5s linear infinite',pointerEvents:'none'}}/>}
                          <span style={{position:'relative'}}>💸 Release Campaign Funds</span>
                        </button>
                      )}
                    </Card>
                  </Section>
                )}

                {/* Royalty Distribution */}
                {campaign && (
                  <Section label="Distribute Royalties" index={6}>
                    <Card style={{background:'linear-gradient(135deg,rgba(239,68,68,0.04) 0%,rgba(255,255,255,0.015) 100%)',border:'1px solid rgba(239,68,68,0.1)'}}>
                      {/* Info banner */}
                      <div style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'14px 16px',background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.12)',borderRadius:'14px',marginBottom:'18px'}}>
                        <span style={{fontSize:'16px',flexShrink:0}}>⚠️</span>
                        <p style={{fontSize:'12px',color:'#fbbf24',margin:0,lineHeight:1.6}}>
                          Distributing will debit admin wallet and credit artist ({artistShare}%) + {campaign.investments.length} fan investor(s) ({fanShare}%) proportionally.
                        </p>
                      </div>

                      {/* Inputs */}
                      <div style={{display:'flex',flexDirection:'column',gap:'14px',marginBottom:'16px'}}>
                        <div>
                          <label style={{display:'block',fontSize:'11px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:focusedField==='revenueAmount'?'#f87171':'#52525b',marginBottom:'8px',transition:'color 0.3s ease'}}>
                            💰 Total Revenue (₹) *
                          </label>
                          <div style={{position:'relative'}}>
                            <span style={{position:'absolute',left:'16px',top:'50%',transform:'translateY(-50%)',color:'#52525b',fontSize:'15px',fontWeight:600}}>₹</span>
                            <input
                              type="number"
                              value={form.revenueAmount}
                              onChange={e => setForm(f => ({...f, revenueAmount: e.target.value}))}
                              onFocus={() => setFocusedField('revenueAmount')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="100000"
                              style={{...inputStyle('revenueAmount'), paddingLeft:'36px', fontSize:'16px', fontWeight:700}}
                            />
                          </div>
                        </div>

                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'12px'}}>
                          {[
                            { key:'spotifyStreams', label:'🎵 Spotify Streams',     emoji:'🎵' },
                            { key:'youtubeStreams', label:'▶️ YouTube Streams',     emoji:'▶️' },
                            { key:'appleStreams',   label:'🍎 Apple Music Streams', emoji:'🍎' },
                          ].map(({key, label}) => (
                            <div key={key}>
                              <label style={{display:'block',fontSize:'11px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:focusedField===key?'#f87171':'#52525b',marginBottom:'8px',transition:'color 0.3s ease'}}>
                                {label}
                              </label>
                              <input
                                type="number"
                                value={(form as any)[key]}
                                onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                                onFocus={() => setFocusedField(key)}
                                onBlur={() => setFocusedField(null)}
                                placeholder="0"
                                style={inputStyle(key)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preview */}
                      {form.revenueAmount && Number(form.revenueAmount) > 0 && (
                        <div style={{
                          padding:'16px',marginBottom:'16px',
                          background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',
                          borderRadius:'16px',
                        }}>
                          <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#52525b',fontWeight:700,margin:'0 0 12px 0'}}>Distribution Preview</p>
                          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <span style={{fontSize:'13px',color:'#71717a',fontWeight:500}}>🎤 Artist ({artistShare}%)</span>
                              <span style={{fontSize:'14px',fontWeight:700,color:'#60a5fa'}}>{formatINR(Math.round(Number(form.revenueAmount)*(artistShare/100)))}</span>
                            </div>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <span style={{fontSize:'13px',color:'#71717a',fontWeight:500}}>👥 All fans ({fanShare}%)</span>
                              <span style={{fontSize:'14px',fontWeight:700,color:'#34d399'}}>{formatINR(Math.round(Number(form.revenueAmount)*(fanShare/100)))}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Error/Success */}
                      {error && (
                        <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'14px 16px',background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:'14px',marginBottom:'14px'}}>
                          <span style={{fontSize:'14px'}}>⚠️</span>
                          <p style={{fontSize:'13px',color:'#f87171',margin:0,fontWeight:500}}>{error}</p>
                        </div>
                      )}
                      {success && (
                        <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'14px 16px',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.12)',borderRadius:'14px',marginBottom:'14px'}}>
                          <CheckCircle size={16} color="#34d399"/>
                          <p style={{fontSize:'13px',color:'#34d399',margin:0,fontWeight:500}}>{success}</p>
                        </div>
                      )}

                      {/* Distribute button */}
                      <button
                        onClick={distribute}
                        disabled={distributing || !form.revenueAmount}
                        onMouseEnter={() => setHoveredBtn('distribute')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                          position:'relative',width:'100%',padding:'15px',
                          display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
                          background:(distributing||!form.revenueAmount) ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#ef4444,#f43f5e)',
                          border:'none',borderRadius:'14px',
                          color:(distributing||!form.revenueAmount) ? '#3f3f46' : '#fff',
                          fontSize:'14px',fontWeight:700,
                          cursor:(distributing||!form.revenueAmount) ? 'not-allowed' : 'pointer',
                          fontFamily:'inherit',
                          transition:'all 0.3s ease',
                          transform: hoveredBtn==='distribute' && !distributing && form.revenueAmount ? 'translateY(-1px)' : 'translateY(0)',
                          boxShadow: hoveredBtn==='distribute' && !distributing && form.revenueAmount ? '0 6px 28px rgba(239,68,68,0.3)' : 'none',
                          opacity:(distributing||!form.revenueAmount) ? 0.4 : 1,
                          overflow:'hidden',
                        }}
                      >
                        {hoveredBtn==='distribute' && !distributing && form.revenueAmount && (
                          <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',backgroundSize:'200% 100%',animation:'asdShimmer 1.5s linear infinite',pointerEvents:'none'}}/>
                        )}
                        {distributing ? (
                          <><Loader2 size={15} style={{animation:'asdSpin 1s linear infinite'}}/><span style={{position:'relative'}}>Distributing...</span></>
                        ) : (
                          <><Send size={15} style={{position:'relative'}}/><span style={{position:'relative'}}>Distribute Royalties</span></>
                        )}
                      </button>
                    </Card>
                  </Section>
                )}

                {/* Distribution History */}
                {song.royaltyDistributions?.length > 0 && (
                  <Section label="Distribution History" index={7}>
                    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                      {song.royaltyDistributions.map((d: any) => (
                        <div key={d.id} style={{
                          display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',
                          padding:'16px 20px',
                          background:'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
                          border:'1px solid rgba(255,255,255,0.06)',borderRadius:'16px',
                        }}>
                          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                            <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'rgba(52,211,153,0.08)',border:'1px solid rgba(52,211,153,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>💸</div>
                            <div>
                              <p style={{fontSize:'14px',fontWeight:700,color:'#34d399',margin:'0 0 2px 0'}}>{formatINR(d.revenueAmount)}</p>
                              <p style={{fontSize:'11px',color:'#52525b',margin:0,fontWeight:600}}>
                                {d.payouts.length} payout{d.payouts.length !== 1 ? 's' : ''} · {new Date(d.distributedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'2-digit'})}
                              </p>
                            </div>
                          </div>
                          <TrendingUp size={16} color="#3f3f46"/>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </>
            )
          })()}
        </div>
      </div>
    </AdminLayout>
  )
}