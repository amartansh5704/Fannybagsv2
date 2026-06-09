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

  const [song, setSong]       = useState<any>(null)
  const [wallet, setWallet]   = useState<any>(null)
  const [amount, setAmount]   = useState('')
  const [loading, setLoading] = useState(true)
  const [investing, setInvesting] = useState(false)
  const [focused, setFocused]     = useState<string | null>(null)
  const [hovered, setHovered]     = useState<string | null>(null)
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  const loadWallet = async () => {
    const res  = await fetch('/api/wallet')
    const data = await res.json()
    if (data.success) setWallet(data.data.wallet)
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/fan/login'); return }
    Promise.all([
      fetch(`/api/songs/${params.id}`).then(r => r.json()),
      fetch('/api/wallet').then(r => r.json()),
    ]).then(([songRes, walletRes]) => {
      if (songRes.success)   setSong(songRes.data)
      if (walletRes.success) setWallet(walletRes.data.wallet)
    }).finally(() => setLoading(false))
  }, [session, status])

  // ── Contract generator ────────────────────────────────────────────────────
  const generateAndDownloadContract = (contract: any) => {
    const { investmentId, contractDate, fan, artist, song: s, campaign, investment, economics } = contract

    const dateStr    = new Date(contractDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
    const endDateStr = new Date(campaign.campaignEndDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Royalty Share Agreement — ${s.title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Georgia',serif;background:#fff;color:#111;font-size:13px;line-height:1.7}
.page{max-width:780px;margin:0 auto;padding:56px 64px}
.header{text-align:center;border-bottom:2px solid #111;padding-bottom:28px;margin-bottom:32px}
.brand{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#666;margin-bottom:10px}
.doc-title{font-size:24px;font-weight:bold;letter-spacing:-0.5px;margin-bottom:6px}
.doc-sub{font-size:13px;color:#555}
.meta-row{display:flex;justify-content:space-between;margin-bottom:32px;padding:16px 20px;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px}
.meta-item{text-align:center}
.meta-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#888;display:block;margin-bottom:4px}
.meta-value{font-size:13px;font-weight:bold;color:#111}
.section{margin-bottom:28px}
.section-title{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888;border-bottom:1px solid #e8e8e8;padding-bottom:6px;margin-bottom:14px}
p{margin-bottom:10px;text-align:justify}
strong{font-weight:bold}
.parties-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
.party-box{border:1px solid #e0e0e0;border-radius:6px;padding:16px 18px}
.party-role{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:8px}
.party-name{font-size:15px;font-weight:bold;margin-bottom:4px}
.party-email{font-size:12px;color:#555}
.key-terms{background:#f5f5f5;border-left:3px solid #111;padding:18px 20px;border-radius:0 6px 6px 0;margin-bottom:28px}
.key-terms table{width:100%;border-collapse:collapse}
.key-terms td{padding:6px 0;vertical-align:top}
.key-terms td:first-child{color:#555;width:55%;font-size:12px}
.key-terms td:last-child{font-weight:bold;text-align:right}
.highlight-box{border:2px solid #111;border-radius:6px;padding:18px 22px;text-align:center;margin-bottom:28px}
.highlight-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:6px}
.highlight-value{font-size:28px;font-weight:bold}
.clauses ol{padding-left:20px}
.clauses ol li{margin-bottom:10px}
.signature-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px}
.sig-box{border-top:1px solid #111;padding-top:12px}
.sig-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:4px}
.sig-name{font-weight:bold;margin-bottom:2px}
.sig-role{font-size:12px;color:#555}
.footer{margin-top:48px;padding-top:16px;border-top:1px solid #e0e0e0;text-align:center;font-size:10px;color:#aaa;letter-spacing:0.5px}
@media print{body{background:white}.page{padding:40px}}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="brand">FannyBags Platform</div>
    <div class="doc-title">Royalty Share Agreement</div>
    <div class="doc-sub">Music Revenue Participation Contract</div>
  </div>
  <div class="meta-row">
    <div class="meta-item"><span class="meta-label">Contract ID</span><span class="meta-value">${investmentId.slice(0,8).toUpperCase()}</span></div>
    <div class="meta-item"><span class="meta-label">Date</span><span class="meta-value">${dateStr}</span></div>
    <div class="meta-item"><span class="meta-label">Song</span><span class="meta-value">${s.title}</span></div>
    <div class="meta-item"><span class="meta-label">Campaign Ends</span><span class="meta-value">${endDateStr}</span></div>
  </div>
  <div class="section">
    <div class="section-title">Parties to this Agreement</div>
    <div class="parties-grid">
      <div class="party-box">
        <div class="party-role">🎤 Artist (Licensor)</div>
        <div class="party-name">${artist.name}</div>
        <div class="party-email">${artist.email}</div>
      </div>
      <div class="party-box">
        <div class="party-role">💎 Fan Investor (Licensee)</div>
        <div class="party-name">${fan.name}</div>
        <div class="party-email">${fan.email}</div>
      </div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Key Financial Terms</div>
    <div class="key-terms">
      <table>
        <tr><td>Song Title</td><td>${s.title}</td></tr>
        <tr><td>Language / Genre</td><td>${s.language || '—'}${s.genre ? ' / ' + s.genre : ''}</td></tr>
        <tr><td>Total Campaign Target</td><td>₹${campaign.totalFundingAsk.toLocaleString('en-IN')}</td></tr>
        <tr><td>Total Fan Revenue Pool</td><td>${campaign.fanRevenueShare}% of all streaming revenue</td></tr>
        <tr><td>Investment Amount</td><td>₹${investment.amount.toLocaleString('en-IN')}</td></tr>
        <tr><td>Fan's Ownership Percentage</td><td>${investment.ownershipPct.toFixed(4)}% of total revenue</td></tr>
        <tr><td>Revenue Per Stream (platform rate)</td><td>₹${economics.revenuePerStream.toFixed(2)}</td></tr>
        <tr><td>Breakeven Streams Required</td><td>${economics.breakevenStreamsFormatted} streams</td></tr>
        <tr><td>Minimum Investment</td><td>₹${campaign.minInvestment.toLocaleString('en-IN')}</td></tr>
      </table>
    </div>
  </div>
  <div class="highlight-box">
    <div class="highlight-label">Your Revenue Ownership</div>
    <div class="highlight-value">${investment.ownershipPct.toFixed(4)}%</div>
    <div style="font-size:12px;color:#555;margin-top:6px;">of every rupee earned by "${s.title}" — forever, while the song generates revenue</div>
  </div>
  <div class="section">
    <div class="section-title">Recitals</div>
    <p>WHEREAS, the Artist wishes to raise funds to produce, distribute, and promote the musical work titled <strong>"${s.title}"</strong> (the "Song");</p>
    <p>WHEREAS, the Fan Investor ("Investor") wishes to participate financially in the Song's campaign and receive a proportional share of future streaming revenue generated by the Song;</p>
    <p>NOW, THEREFORE, in consideration of the mutual covenants set forth herein and for other good and valuable consideration, the parties agree as follows:</p>
  </div>
  <div class="section clauses">
    <div class="section-title">Terms and Conditions</div>
    <ol>
      <li><strong>Grant of Revenue Participation.</strong> In exchange for the Investment Amount of ₹${investment.amount.toLocaleString('en-IN')}, the Artist grants the Investor a revenue participation interest of <strong>${investment.ownershipPct.toFixed(4)}%</strong> of the Song's net streaming revenue, calculated after applicable platform and distribution fees.</li>
      <li><strong>Revenue Pool.</strong> The total fan revenue pool for this Song is <strong>${campaign.fanRevenueShare}%</strong> of all net streaming revenue. The Investor's share is proportional to their contribution relative to the total campaign target of ₹${campaign.totalFundingAsk.toLocaleString('en-IN')}.</li>
      <li><strong>Breakeven.</strong> Based on a platform streaming rate of ₹${economics.revenuePerStream.toFixed(2)} per stream, the Song must reach approximately <strong>${economics.breakevenStreamsFormatted} streams</strong> for the collective fan pool to recover the total investment. Individual breakeven may vary.</li>
      <li><strong>Payment Terms.</strong> Revenue distributions will be processed periodically by FannyBags in accordance with its royalty distribution schedule. All payments are subject to the Song generating verifiable streaming revenue.</li>
      <li><strong>Non-Transferability.</strong> This revenue participation interest is personal to the Investor and may not be transferred, assigned, or sold without the express written consent of FannyBags and the Artist.</li>
      <li><strong>Artist's Retained Rights.</strong> The Artist retains full creative control, copyright ownership, master rights, and all rights not expressly granted herein. This agreement does not confer any equity, intellectual property, or decision-making rights upon the Investor.</li>
      <li><strong>No Guaranteed Returns.</strong> This is a revenue participation agreement, not a financial instrument or security. Returns are contingent on the Song's commercial performance. The Investor acknowledges the risk that the Song may not generate sufficient streams to recover the investment.</li>
      <li><strong>Platform Role.</strong> FannyBags acts solely as a platform facilitating this agreement. It is not a party to any royalty obligation between the Artist and the Investor. All disputes shall first be raised with FannyBags support.</li>
      <li><strong>Duration.</strong> This agreement remains in effect for as long as the Song generates streaming revenue on any major digital platform, unless terminated by mutual written consent.</li>
      <li><strong>Governing Law.</strong> This agreement shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the jurisdiction of courts in India.</li>
      <li><strong>Entire Agreement.</strong> This document constitutes the entire agreement between the parties regarding the subject matter hereof and supersedes all prior negotiations, representations, or agreements.</li>
    </ol>
  </div>
  <div class="signature-grid">
    <div class="sig-box">
      <div class="sig-label">Artist (Licensor)</div>
      <div class="sig-name">${artist.name}</div>
      <div class="sig-role">Artist · ${dateStr}</div>
    </div>
    <div class="sig-box">
      <div class="sig-label">Fan Investor (Licensee)</div>
      <div class="sig-name">${fan.name}</div>
      <div class="sig-role">Investor · ${dateStr}</div>
    </div>
  </div>
  <div class="footer">
    <p>This agreement was generated by FannyBags · Contract ID: ${investmentId} · ${dateStr}</p>
    <p style="margin-top:4px;">FannyBags is a music funding platform. This document is for record-keeping purposes only and does not constitute legal advice.</p>
  </div>
</div>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `FannyBags-Contract-${s.title.replace(/\s+/g, '-')}-${investmentId.slice(0, 8)}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Invest ────────────────────────────────────────────────────────────────
  const invest = async () => {
    setInvesting(true)
    const res  = await fetch('/api/investments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: song.campaign.id, amount: Number(amount) }),
    })
    const json = await res.json()
    if (json.success) {
      if (json.contract) generateAndDownloadContract(json.contract)
      alert('Investment successful! Your royalty contract has been downloaded.')
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
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#06060a',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(236,72,153,0.12) 0%,transparent 70%)',borderRadius:'50%',animation:'sdFloatOrb 4s ease-in-out infinite' }}/>
          <Loader2 style={{ animation:'sdSpin 1s linear infinite',color:'#f472b6',width:'36px',height:'36px',position:'relative',zIndex:1 }}/>
          <p style={{ marginTop:'16px',color:'#52525b',fontSize:'14px',letterSpacing:'0.05em',position:'relative',zIndex:1 }}>Loading song...</p>
        </div>
      </FanLayout>
    )
  }

  if (!song) {
    return (
      <FanLayout>
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#06060a' }}>
          <div style={{ width:'80px',height:'80px',borderRadius:'24px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px' }}>
            <Music size={32} color="#27272a"/>
          </div>
          <p style={{ fontSize:'16px',fontWeight:600,color:'#52525b' }}>Song not found</p>
        </div>
      </FanLayout>
    )
  }

  const progress      = Math.min(100,(song.campaign.amountRaised / song.campaign.totalFundingAsk) * 100)
  const investAmount  = Number(amount || 0)
  const insufficient  = investAmount > (wallet?.balance || 0)
  const ownership     = investAmount > 0
    ? ((investAmount / song.campaign.totalFundingAsk) * song.campaign.fanRevenueShare).toFixed(2)
    : '0'

  const fanRevenueShare    = song.campaign.fanRevenueShare || 0
  const totalFundingAsk    = song.campaign.totalFundingAsk || 0
  const revenuePerStream   = 0.05
  const fanPayoutPerStream = revenuePerStream * (fanRevenueShare / 100)
  const breakevenStreams   = fanRevenueShare > 0 ? Math.round(totalFundingAsk / fanPayoutPerStream) : 0

  const fmtStreams = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
    if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`
    return n.toLocaleString('en-IN')
  }

  const statCards = [
    { key:'target', label:'🎯 Target',        value:`₹${totalFundingAsk.toLocaleString('en-IN')}`,             color:'#d4d4d8', bg:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.06)' },
    { key:'raised', label:'💰 Raised',        value:`₹${song.campaign.amountRaised.toLocaleString('en-IN')}`, color:'#f472b6', bg:'rgba(236,72,153,0.06)',   border:'rgba(236,72,153,0.12)' },
    { key:'share',  label:'📊 Revenue Share', value:`${fanRevenueShare}%`,                                     color:'#c084fc', bg:'rgba(168,85,247,0.06)',   border:'rgba(168,85,247,0.12)' },
    { key:'wallet', label:'👛 Wallet',        value:`₹${(wallet?.balance || 0).toLocaleString('en-IN')}`,     color:'#34d399', bg:'rgba(16,185,129,0.06)',   border:'rgba(16,185,129,0.12)' },
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
        @keyframes sdImageReveal{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
        @keyframes sdSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes sdModalIn{from{opacity:0;transform:scale(0.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        dialog::backdrop{background:rgba(0,0,0,0.75);backdrop-filter:blur(12px)}
        dialog{border:none;padding:0;background:transparent}
        dialog[open]{animation:sdModalIn 0.3s ease-out}
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type="number"]{-moz-appearance:textfield}
      `}</style>

      <div style={{ minHeight:'100vh',background:'#06060a',color:'#fff',position:'relative',overflow:'hidden',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient */}
        <div style={{ position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0 }}>
          <div style={{ position:'absolute',top:'-80px',right:'-40px',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(236,72,153,0.06) 0%,transparent 70%)',borderRadius:'50%',animation:'sdFloatOrb 10s ease-in-out infinite' }}/>
          <div style={{ position:'absolute',bottom:'10%',left:'-80px',width:'400px',height:'400px',background:'radial-gradient(circle,rgba(168,85,247,0.04) 0%,transparent 70%)',borderRadius:'50%',animation:'sdFloatOrb2 13s ease-in-out infinite' }}/>
          <div style={{ position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,backgroundSize:'60px 60px' }}/>
        </div>

        {/* Back */}
        <div style={{ position:'relative',zIndex:1,padding:'24px 32px 0',maxWidth:'1200px',margin:'0 auto',animation:'sdFadeInUp 0.4s ease-out' }}>
          <button onClick={() => router.back()}
            onMouseEnter={() => setHovered('back')} onMouseLeave={() => setHovered(null)}
            style={{ display:'inline-flex',alignItems:'center',gap:'8px',padding:'10px 20px',background:hovered==='back'?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.03)',border:`1px solid ${hovered==='back'?'rgba(255,255,255,0.14)':'rgba(255,255,255,0.07)'}`,borderRadius:'12px',color:hovered==='back'?'#fff':'#71717a',fontSize:'13px',fontWeight:600,cursor:'pointer',transition:'all 0.3s ease',fontFamily:'inherit',transform:hovered==='back'?'translateX(-2px)':'translateX(0)' }}>
            ← Back
          </button>
        </div>

        {/* Content */}
        <div style={{ position:'relative',zIndex:1,padding:'28px 32px 48px',maxWidth:'1200px',margin:'0 auto' }}>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,420px),1fr))',gap:'32px',alignItems:'start' }}>

            {/* Left */}
            <div style={{ animation:'sdFadeInLeft 0.6s ease-out' }}>
              <div style={{ position:'relative',borderRadius:'20px',overflow:'hidden',aspectRatio:'1 / 1',background:'#0d0d12',boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ position:'absolute',inset:'-20px',background:'radial-gradient(circle at center,rgba(236,72,153,0.08) 0%,transparent 70%)',filter:'blur(20px)',pointerEvents:'none',zIndex:0 }}/>
                {song.coverArtUrl ? (
                  <img src={song.coverArtUrl} alt={song.title} style={{ width:'100%',height:'100%',objectFit:'cover',position:'relative',zIndex:1,animation:'sdImageReveal 0.6s ease-out' }}/>
                ) : (
                  <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0d0d12,#141420)',position:'relative',zIndex:1 }}>
                    <div style={{ width:'80px',height:'80px',borderRadius:'24px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                      <Music size={36} color="#27272a"/>
                    </div>
                  </div>
                )}
                <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'40%',background:'linear-gradient(to top,rgba(6,6,10,0.7) 0%,transparent 100%)',zIndex:2 }}/>
              </div>

              <div style={{ marginTop:'24px' }}>
                <h1 style={{ fontSize:'28px',fontWeight:800,margin:'0 0 6px 0',lineHeight:1.2,background:'linear-gradient(135deg,#fff 0%,#d4d4d8 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>
                  {song.title}
                </h1>
                <p style={{ fontSize:'15px',color:'#71717a',margin:'0 0 20px 0',fontWeight:500 }}>
                  by <span style={{ color:'#a1a1aa' }}>{song.artist.name}</span>
                </p>

                {song.demoUrl && (
                  <div style={{ background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'16px',padding:'16px',marginBottom:'20px' }}>
                    <p style={{ fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#52525b',fontWeight:700,margin:'0 0 10px 0' }}>🎧 Preview</p>
                    <audio controls style={{ width:'100%',height:'36px',borderRadius:'8px',filter:'invert(0.85) hue-rotate(180deg)' }}>
                      <source src={song.demoUrl}/>
                    </audio>
                  </div>
                )}

                {(song.campaign.campaignStory || song.description) && (
                  <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'16px',padding:'18px',borderLeft:'3px solid rgba(236,72,153,0.25)' }}>
                    <p style={{ fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#52525b',fontWeight:700,margin:'0 0 8px 0' }}>📖 About</p>
                    <p style={{ fontSize:'14px',color:'#a1a1aa',lineHeight:1.7,margin:0 }}>
                      {song.campaign.campaignStory || song.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right */}
            <div style={{ animation:'sdFadeInRight 0.6s ease-out',display:'flex',flexDirection:'column',gap:'20px' }}>

              {/* Stats */}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
                {statCards.map((s,i) => {
                  const isH = hoveredStat === s.key
                  return (
                    <div key={s.key}
                      onMouseEnter={() => setHoveredStat(s.key)} onMouseLeave={() => setHoveredStat(null)}
                      style={{ position:'relative',overflow:'hidden',background:isH?`linear-gradient(135deg,${s.bg},rgba(255,255,255,0.03))`:s.bg,border:`1px solid ${isH?s.border:'rgba(255,255,255,0.05)'}`,borderRadius:'18px',padding:'20px',transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)',transform:isH?'translateY(-3px)':'translateY(0)',boxShadow:isH?`0 10px 30px rgba(0,0,0,0.2),0 0 30px ${s.bg}`:'0 2px 8px rgba(0,0,0,0.1)',animation:`sdFadeInStagger 0.4s ease-out ${0.1+i*0.06}s both` }}>
                      <p style={{ fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 8px 0' }}>{s.label}</p>
                      <p style={{ fontSize:'22px',fontWeight:800,color:s.color,margin:0,textShadow:isH?`0 0 14px ${s.bg}`:'none',transition:'text-shadow 0.3s ease' }}>{s.value}</p>
                    </div>
                  )
                })}
              </div>

              {/* Progress */}
              <div style={{ background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'18px',padding:'20px',animation:'sdFadeInStagger 0.5s ease-out 0.4s both' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px' }}>
                  <span style={{ fontSize:'12px',fontWeight:700,color:'#52525b',textTransform:'uppercase',letterSpacing:'0.08em' }}>Campaign Progress</span>
                  <span style={{ fontSize:'13px',fontWeight:700,color:progress>=100?'#f472b6':'#71717a' }}>{progress>=100?'🎉 Fully Funded':`${Math.round(progress)}%`}</span>
                </div>
                <div style={{ position:'relative',width:'100%',height:'8px',background:'rgba(255,255,255,0.05)',borderRadius:'4px',overflow:'hidden' }}>
                  <div style={{ height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#ec4899,#f43f5e)',backgroundSize:'200% 100%',animation:'sdGradientShift 3s ease-in-out infinite',borderRadius:'4px',boxShadow:'0 0 12px rgba(236,72,153,0.3)',transition:'width 0.5s ease' }}/>
                  <div style={{ position:'absolute',top:0,left:0,width:`${progress}%`,height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)',backgroundSize:'200% 100%',animation:'sdShimmer 2s linear infinite' }}/>
                </div>
              </div>

              {/* Breakeven */}
              {fanRevenueShare > 0 && (
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',background:'linear-gradient(135deg,rgba(168,85,247,0.08),rgba(236,72,153,0.04))',border:'1px solid rgba(168,85,247,0.15)',borderRadius:'16px',padding:'16px 20px',animation:'sdFadeInStagger 0.5s ease-out 0.5s both' }}>
                  <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
                    <div style={{ width:'32px',height:'32px',borderRadius:'10px',background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0 }}>📐</div>
                    <span style={{ fontSize:'13px',color:'#71717a',fontWeight:600 }}>Breakeven Streams</span>
                  </div>
                  <span style={{ fontSize:'20px',fontWeight:800,color:'#d8b4fe',letterSpacing:'-0.02em',textShadow:'0 0 16px rgba(216,180,254,0.2)' }}>
                    {fmtStreams(breakevenStreams)}
                  </span>
                </div>
              )}

              {/* Contract info banner */}
              <div style={{ display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'rgba(236,72,153,0.04)',border:'1px solid rgba(236,72,153,0.1)',borderRadius:14 }}>
                <span style={{ fontSize:16 }}>📄</span>
                <p style={{ fontSize:12,color:'#71717a',margin:0,lineHeight:1.5 }}>
                  A <strong style={{ color:'#f472b6' }}>Royalty Share Agreement</strong> will be auto-downloaded as a legal contract after your investment is confirmed.
                </p>
              </div>

              {/* Invest button */}
              <button onClick={() => dialogRef.current?.showModal()}
                onMouseEnter={() => setHovered('invest')} onMouseLeave={() => setHovered(null)}
                style={{ position:'relative',width:'100%',padding:'18px',background:'linear-gradient(135deg,#ec4899,#f43f5e)',border:'none',borderRadius:'16px',color:'#fff',fontSize:'15px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',letterSpacing:'0.01em',transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)',transform:hovered==='invest'?'translateY(-2px)':'translateY(0)',boxShadow:hovered==='invest'?'0 8px 40px rgba(236,72,153,0.35),0 0 60px rgba(236,72,153,0.1)':'0 4px 20px rgba(236,72,153,0.2)',overflow:'hidden',animation:'sdFadeInStagger 0.5s ease-out 0.6s both' }}>
                {hovered==='invest' && <div style={{ position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',backgroundSize:'200% 100%',animation:'sdShimmer 1.5s linear infinite',pointerEvents:'none' }}/>}
                <span style={{ position:'relative' }}>💎 Buy Revenue Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* INVEST DIALOG */}
        <dialog ref={dialogRef} style={{ width:'520px',maxWidth:'95vw',maxHeight:'90vh',borderRadius:'24px',overflow:'hidden',boxShadow:'0 25px 80px rgba(0,0,0,0.6),0 0 60px rgba(236,72,153,0.08)' }}>
          <div style={{ background:'#0f0f14',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'24px',overflow:'hidden',display:'flex',flexDirection:'column',maxHeight:'90vh' }}>

            <div style={{ padding:'24px 28px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%)',flexShrink:0 }}>
              <div style={{ display:'flex',alignItems:'center',gap:'14px' }}>
                <div style={{ width:'40px',height:'40px',borderRadius:'12px',background:'linear-gradient(135deg,rgba(236,72,153,0.15),rgba(244,63,94,0.1))',border:'1px solid rgba(236,72,153,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px' }}>💎</div>
                <div>
                  <h2 style={{ fontSize:'18px',fontWeight:700,color:'#fff',margin:0 }}>Invest in Song</h2>
                  <p style={{ fontSize:'12px',color:'#52525b',margin:'2px 0 0 0' }}>{song.title} · {song.artist.name}</p>
                </div>
              </div>
              <button onClick={() => dialogRef.current?.close()}
                onMouseEnter={() => setHovered('modal-close')} onMouseLeave={() => setHovered(null)}
                style={{ width:'36px',height:'36px',borderRadius:'10px',background:hovered==='modal-close'?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:hovered==='modal-close'?'#fff':'#71717a',fontSize:'18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s ease',fontFamily:'inherit' }}>✕</button>
            </div>

            <div style={{ padding:'24px 28px',overflowY:'auto',flex:1,WebkitOverflowScrolling:'touch' as any }}>

              {/* Wallet */}
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.12)',borderRadius:'14px',padding:'14px 18px',marginBottom:'20px' }}>
                <span style={{ fontSize:'13px',color:'#34d399',fontWeight:600 }}>👛 Wallet Balance</span>
                <span style={{ fontSize:'15px',fontWeight:800,color:'#34d399' }}>₹{(wallet?.balance || 0).toLocaleString('en-IN')}</span>
              </div>

              {/* Amount */}
              <div style={{ marginBottom:'16px' }}>
                <label style={{ display:'block',fontSize:'11px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:focused==='invest-amount'?'#f472b6':'#52525b',marginBottom:'8px',transition:'color 0.3s ease' }}>
                  Investment Amount (₹)
                </label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute',left:'16px',top:'50%',transform:'translateY(-50%)',color:'#52525b',fontSize:'16px',fontWeight:600,pointerEvents:'none' }}>₹</span>
                  <input type="number" value={amount}
                    onChange={e => setAmount(e.target.value)}
                    onFocus={() => setFocused('invest-amount')} onBlur={() => setFocused(null)}
                    placeholder="0"
                    style={{ width:'100%',background:focused==='invest-amount'?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.03)',border:`1px solid ${focused==='invest-amount'?'rgba(236,72,153,0.5)':'rgba(255,255,255,0.07)'}`,borderRadius:'14px',padding:'16px 18px 16px 38px',color:'#fff',fontSize:'18px',fontWeight:700,outline:'none',transition:'all 0.3s ease',fontFamily:'inherit',boxSizing:'border-box' as const,boxShadow:focused==='invest-amount'?'0 0 0 3px rgba(236,72,153,0.08)':'none' }}
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'20px' }}>
                {[500,1000,2500,5000].map(amt => (
                  <button key={amt} onClick={() => setAmount(String(amt))}
                    onMouseEnter={() => setHovered(`qa-${amt}`)} onMouseLeave={() => setHovered(null)}
                    style={{ padding:'10px',borderRadius:'10px',background:hovered===`qa-${amt}`?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.03)',border:`1px solid ${hovered===`qa-${amt}`?'rgba(255,255,255,0.14)':'rgba(255,255,255,0.06)'}`,color:hovered===`qa-${amt}`?'#fff':'#71717a',fontSize:'12px',fontWeight:600,cursor:'pointer',transition:'all 0.2s ease',fontFamily:'inherit' }}>
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Ownership preview */}
              {investAmount > 0 && (
                <div style={{ background:'linear-gradient(135deg,rgba(236,72,153,0.06),rgba(168,85,247,0.04))',border:'1px solid rgba(236,72,153,0.12)',borderRadius:'14px',padding:'16px 18px',marginBottom:'16px' }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <span style={{ fontSize:'13px',color:'#71717a',fontWeight:600 }}>You will own</span>
                    <span style={{ fontSize:'18px',fontWeight:800,color:'#f472b6' }}>{ownership}%</span>
                  </div>
                </div>
              )}

              {/* Contract note */}
              <div style={{ display:'flex',alignItems:'center',gap:8,padding:'11px 14px',background:'rgba(236,72,153,0.04)',border:'1px solid rgba(236,72,153,0.1)',borderRadius:12,marginBottom:'16px' }}>
                <span style={{ fontSize:14 }}>📄</span>
                <p style={{ fontSize:11,color:'#71717a',margin:0 }}>
                  A <strong style={{ color:'#f472b6' }}>Royalty Contract</strong> will auto-download after confirmation.
                </p>
              </div>

              {/* Insufficient */}
              {insufficient && (
                <div style={{ display:'flex',alignItems:'center',gap:'10px',background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:'14px',padding:'14px 16px',marginBottom:'16px' }}>
                  <span style={{ fontSize:'14px' }}>⚠️</span>
                  <p style={{ fontSize:'13px',color:'#f87171',margin:0,fontWeight:500 }}>Insufficient wallet balance</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
                <button onClick={() => dialogRef.current?.close()}
                  onMouseEnter={() => setHovered('modal-cancel')} onMouseLeave={() => setHovered(null)}
                  style={{ padding:'16px',borderRadius:'14px',background:hovered==='modal-cancel'?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.04)',border:`1px solid ${hovered==='modal-cancel'?'rgba(255,255,255,0.14)':'rgba(255,255,255,0.08)'}`,color:hovered==='modal-cancel'?'#fff':'#a1a1aa',fontSize:'14px',fontWeight:600,cursor:'pointer',transition:'all 0.3s ease',fontFamily:'inherit' }}>
                  Cancel
                </button>
                <button onClick={invest} disabled={insufficient || investing}
                  onMouseEnter={() => setHovered('modal-invest')} onMouseLeave={() => setHovered(null)}
                  style={{ position:'relative',padding:'16px',borderRadius:'14px',background:(insufficient||investing)?'rgba(255,255,255,0.03)':'linear-gradient(135deg,#ec4899,#f43f5e)',border:'none',color:(insufficient||investing)?'#3f3f46':'#fff',fontSize:'14px',fontWeight:700,cursor:(insufficient||investing)?'not-allowed':'pointer',transition:'all 0.3s ease',fontFamily:'inherit',transform:hovered==='modal-invest'&&!insufficient&&!investing?'translateY(-1px)':'translateY(0)',boxShadow:hovered==='modal-invest'&&!insufficient&&!investing?'0 6px 28px rgba(236,72,153,0.35)':'none',opacity:(insufficient||investing)?0.4:1,overflow:'hidden' }}>
                  {hovered==='modal-invest'&&!insufficient&&!investing && <div style={{ position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',backgroundSize:'200% 100%',animation:'sdShimmer 1.5s linear infinite',pointerEvents:'none' }}/>}
                  {investing ? (
                    <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',position:'relative' }}>
                      <div style={{ width:'15px',height:'15px',border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'#fff',borderRadius:'50%',animation:'sdSpin 0.8s linear infinite' }}/>
                      Investing...
                    </span>
                  ) : (
                    <span style={{ position:'relative' }}>💎 Confirm & Download Contract</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </FanLayout>
  )
}