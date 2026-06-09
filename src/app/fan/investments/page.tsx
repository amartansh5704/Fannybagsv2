'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import FanLayout from '@/components/fan/FanLayout'
import { Loader2, Music, Download } from 'lucide-react'

export default function FanInvestmentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/fan/login'); return }
    fetch('/api/fan/investments')
      .then(r => r.json())
      .then(j => { if (j.success) setInvestments(j.data) })
      .finally(() => setLoading(false))
  }, [session, status])

  // ── Contract generator ─────────────────────────────────────────────────────
  const downloadContract = (inv: any) => {
    const song     = inv.campaign.song
    const artist   = song.artist
    const campaign = inv.campaign

    const revenuePerStream = 0.05
    const fanPayPerStream  = revenuePerStream * (campaign.fanRevenueShare / 100)
    const breakevenStreams = fanPayPerStream > 0 ? Math.round(campaign.totalFundingAsk / fanPayPerStream) : 0

    const fmt = (n: number) => {
      if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
      if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
      if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`
      return n.toLocaleString('en-IN')
    }

    const dateStr    = new Date(inv.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
    const endDateStr = new Date(campaign.campaignEndDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
    const fanName    = session?.user?.name  || 'Fan Investor'
    const fanEmail   = session?.user?.email || ''

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Royalty Share Agreement — ${song.title}</title>
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
    <div class="meta-item"><span class="meta-label">Contract ID</span><span class="meta-value">${inv.id.slice(0,8).toUpperCase()}</span></div>
    <div class="meta-item"><span class="meta-label">Date</span><span class="meta-value">${dateStr}</span></div>
    <div class="meta-item"><span class="meta-label">Song</span><span class="meta-value">${song.title}</span></div>
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
        <div class="party-name">${fanName}</div>
        <div class="party-email">${fanEmail}</div>
      </div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Key Financial Terms</div>
    <div class="key-terms">
      <table>
        <tr><td>Song Title</td><td>${song.title}</td></tr>
        <tr><td>Language / Genre</td><td>${song.language || '—'}${song.genre ? ' / ' + song.genre : ''}</td></tr>
        <tr><td>Total Campaign Target</td><td>₹${campaign.totalFundingAsk.toLocaleString('en-IN')}</td></tr>
        <tr><td>Total Fan Revenue Pool</td><td>${campaign.fanRevenueShare}% of all streaming revenue</td></tr>
        <tr><td>Investment Amount</td><td>₹${inv.amount.toLocaleString('en-IN')}</td></tr>
        <tr><td>Fan's Ownership Percentage</td><td>${inv.ownershipPct.toFixed(4)}% of total revenue</td></tr>
        <tr><td>Revenue Per Stream (platform rate)</td><td>₹${revenuePerStream.toFixed(2)}</td></tr>
        <tr><td>Breakeven Streams Required</td><td>${fmt(breakevenStreams)} streams</td></tr>
        <tr><td>Minimum Investment</td><td>₹${campaign.minInvestment.toLocaleString('en-IN')}</td></tr>
      </table>
    </div>
  </div>
  <div class="highlight-box">
    <div class="highlight-label">Your Revenue Ownership</div>
    <div class="highlight-value">${inv.ownershipPct.toFixed(4)}%</div>
    <div style="font-size:12px;color:#555;margin-top:6px;">of every rupee earned by "${song.title}" — as long as the song generates revenue</div>
  </div>
  <div class="section">
    <div class="section-title">Recitals</div>
    <p>WHEREAS, the Artist wishes to raise funds to produce, distribute, and promote the musical work titled <strong>"${song.title}"</strong> (the "Song");</p>
    <p>WHEREAS, the Fan Investor wishes to participate financially in the Song's campaign and receive a proportional share of future streaming revenue;</p>
    <p>NOW, THEREFORE, in consideration of the mutual covenants set forth herein, the parties agree as follows:</p>
  </div>
  <div class="section clauses">
    <div class="section-title">Terms and Conditions</div>
    <ol>
      <li><strong>Grant of Revenue Participation.</strong> In exchange for ₹${inv.amount.toLocaleString('en-IN')}, the Artist grants the Investor a revenue participation interest of <strong>${inv.ownershipPct.toFixed(4)}%</strong> of the Song's net streaming revenue, calculated after applicable platform and distribution fees.</li>
      <li><strong>Revenue Pool.</strong> The total fan revenue pool is <strong>${campaign.fanRevenueShare}%</strong> of all net streaming revenue. The Investor's share is proportional to their contribution relative to the total campaign target of ₹${campaign.totalFundingAsk.toLocaleString('en-IN')}.</li>
      <li><strong>Breakeven.</strong> Based on ₹${revenuePerStream.toFixed(2)} per stream, approximately <strong>${fmt(breakevenStreams)} streams</strong> are required for the collective fan pool to recover the total investment. Individual breakeven may vary.</li>
      <li><strong>Payment Terms.</strong> Revenue distributions will be processed periodically by FannyBags per its royalty distribution schedule, subject to the Song generating verifiable streaming revenue.</li>
      <li><strong>Non-Transferability.</strong> This revenue participation interest is personal to the Investor and may not be transferred without the express written consent of FannyBags and the Artist.</li>
      <li><strong>Artist's Retained Rights.</strong> The Artist retains full creative control, copyright, master rights, and all rights not expressly granted herein. This agreement does not confer equity or intellectual property rights upon the Investor.</li>
      <li><strong>No Guaranteed Returns.</strong> Returns are contingent on commercial performance. The Investor acknowledges the risk that the Song may not generate sufficient streams to recover the investment.</li>
      <li><strong>Platform Role.</strong> FannyBags acts solely as a platform facilitating this agreement. All disputes shall first be raised with FannyBags support.</li>
      <li><strong>Duration.</strong> This agreement remains in effect as long as the Song generates streaming revenue, unless terminated by mutual written consent.</li>
      <li><strong>Governing Law.</strong> This agreement is governed by the laws of India. Disputes are subject to the jurisdiction of Indian courts.</li>
      <li><strong>Entire Agreement.</strong> This document constitutes the entire agreement between the parties and supersedes all prior negotiations regarding the subject matter.</li>
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
      <div class="sig-name">${fanName}</div>
      <div class="sig-role">Investor · ${dateStr}</div>
    </div>
  </div>
  <div class="footer">
    <p>Generated by FannyBags · Contract ID: ${inv.id} · ${dateStr}</p>
    <p style="margin-top:4px;">This document is for record-keeping purposes only and does not constitute legal advice.</p>
  </div>
</div>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `FannyBags-Contract-${song.title.replace(/\s+/g, '-')}-${inv.id.slice(0, 8)}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (status === 'loading' || loading) {
    return (
      <FanLayout>
        <style jsx global>{`
          @keyframes fiFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
          @keyframes fiSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        `}</style>
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#06060a',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(236,72,153,0.12) 0%,transparent 70%)',borderRadius:'50%',animation:'fiFloatOrb 4s ease-in-out infinite' }}/>
          <Loader2 style={{ animation:'fiSpin 1s linear infinite',color:'#f472b6',width:'36px',height:'36px',position:'relative',zIndex:1 }}/>
          <p style={{ marginTop:'16px',color:'#52525b',fontSize:'14px',letterSpacing:'0.05em',position:'relative',zIndex:1 }}>Loading investments...</p>
        </div>
      </FanLayout>
    )
  }

  const totalInvested = investments.reduce((s, inv) => s + inv.amount, 0)
  const avgROI        = investments.length > 0
    ? investments.reduce((s, inv) => s + inv.analytics.roi, 0) / investments.length
    : 0

  return (
    <FanLayout>
      <style jsx global>{`
        @keyframes fiFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes fiFloatOrb2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.03)}}
        @keyframes fiFloatOrb3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(20px,25px) scale(1.03)}80%{transform:translate(-15px,-10px) scale(0.97)}}
        @keyframes fiFadeInDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fiFadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fiFadeInStagger{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fiGradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fiShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes fiPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        @keyframes fiImageReveal{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
      `}</style>

      <div style={{ minHeight:'100vh',background:'#06060a',color:'#fff',position:'relative',overflow:'hidden',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient */}
        <div style={{ position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0 }}>
          <div style={{ position:'absolute',top:'-80px',right:'-40px',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(236,72,153,0.06) 0%,transparent 70%)',borderRadius:'50%',animation:'fiFloatOrb 10s ease-in-out infinite' }}/>
          <div style={{ position:'absolute',top:'45%',left:'-100px',width:'420px',height:'420px',background:'radial-gradient(circle,rgba(168,85,247,0.04) 0%,transparent 70%)',borderRadius:'50%',animation:'fiFloatOrb2 13s ease-in-out infinite' }}/>
          <div style={{ position:'absolute',bottom:'-60px',right:'30%',width:'320px',height:'320px',background:'radial-gradient(circle,rgba(59,130,246,0.03) 0%,transparent 70%)',borderRadius:'50%',animation:'fiFloatOrb3 16s ease-in-out infinite' }}/>
          <div style={{ position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,backgroundSize:'60px 60px' }}/>
        </div>

        {/* Header */}
        <div style={{ position:'relative',zIndex:1,borderBottom:'1px solid rgba(255,255,255,0.05)',background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)',backdropFilter:'blur(20px)',animation:'fiFadeInDown 0.5s ease-out' }}>
          <div style={{ padding:'28px 32px',maxWidth:'1300px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px' }}>
            <div style={{ display:'flex',alignItems:'center',gap:'14px' }}>
              <div style={{ width:'44px',height:'44px',borderRadius:'14px',background:'linear-gradient(135deg,rgba(236,72,153,0.14),rgba(168,85,247,0.10))',border:'1px solid rgba(236,72,153,0.16)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(236,72,153,0.08)',fontSize:'20px' }}>📊</div>
              <div>
                <h1 style={{ fontSize:'22px',fontWeight:800,margin:0,background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>My Investments</h1>
                <p style={{ fontSize:'13px',color:'#52525b',margin:'2px 0 0 0',fontWeight:500 }}>Your song ownership portfolio</p>
              </div>
            </div>
            {investments.length > 0 && (
              <div style={{ display:'flex',gap:'10px',flexWrap:'wrap' }}>
                <div style={{ display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px',background:'rgba(236,72,153,0.06)',border:'1px solid rgba(236,72,153,0.12)',borderRadius:'10px' }}>
                  <div style={{ width:'6px',height:'6px',borderRadius:'50%',background:'#f472b6',boxShadow:'0 0 6px rgba(244,114,182,0.5)',animation:'fiPulseDot 2s ease-in-out infinite' }}/>
                  <span style={{ fontSize:'12px',fontWeight:700,color:'#f472b6' }}>{investments.length} holding{investments.length !== 1 ? 's' : ''}</span>
                </div>
                <div style={{ display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.12)',borderRadius:'10px' }}>
                  <span style={{ fontSize:'12px',fontWeight:700,color:'#34d399' }}>₹{totalInvested.toLocaleString('en-IN')} invested</span>
                </div>
                <div style={{ display:'flex',alignItems:'center',gap:'6px',padding:'6px 14px',background:'rgba(168,85,247,0.06)',border:'1px solid rgba(168,85,247,0.12)',borderRadius:'10px' }}>
                  <span style={{ fontSize:'12px',fontWeight:700,color:'#c084fc' }}>{avgROI.toFixed(1)}% avg ROI</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ position:'relative',zIndex:1,padding:'28px 32px 48px',maxWidth:'1300px',margin:'0 auto' }}>
          {investments.length === 0 ? (
            <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'100px 0',animation:'fiFadeInUp 0.6s ease-out' }}>
              <div style={{ width:'80px',height:'80px',borderRadius:'24px',background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px' }}>
                <Music size={32} color="#27272a"/>
              </div>
              <p style={{ fontSize:'16px',fontWeight:600,color:'#52525b',margin:'0 0 4px 0' }}>No investments yet</p>
              <p style={{ fontSize:'13px',color:'#3f3f46',margin:0 }}>Your song holdings will appear here after investing</p>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:'20px' }}>
              {investments.map((inv, index) => {
                const song      = inv.campaign.song
                const analytics = inv.analytics
                const isHovered = hoveredCard === inv.id
                const roiPos    = analytics.roi >= 0

                const metricCards = [
                  { key:'invested',  label:'💰 Invested',       value:`₹${inv.amount.toLocaleString('en-IN')}`,                color:'#d4d4d8' },
                  { key:'ownership', label:'🎯 Ownership',      value:`${inv.ownershipPct.toFixed(2)}%`,                      color:'#f472b6' },
                  { key:'pool',      label:'📊 Revenue Pool',   value:`${inv.campaign.fanRevenueShare}%`,                     color:'#c084fc' },
                  { key:'streams',   label:'🎧 Streams',        value:analytics.totalStreams.toLocaleString(),                 color:'#60a5fa' },
                  { key:'revenue',   label:'💵 Song Revenue',   value:`₹${analytics.totalRevenue.toLocaleString('en-IN')}`,   color:'#a1a1aa' },
                  { key:'payout',    label:'✨ Est. Payout',     value:`₹${analytics.estimatedPayout.toLocaleString('en-IN')}`, color:'#34d399' },
                  { key:'roi',       label:'📈 ROI',            value:`${analytics.roi.toFixed(1)}%`,                          color: roiPos ? '#34d399' : '#f87171' },
                  { key:'investors', label:'👥 Total Investors', value:analytics.totalInvestors.toString(),                    color:'#a1a1aa' },
                  { key:'status',    label:'📋 Status',         value:inv.status,                                              color: inv.status === 'active' ? '#34d399' : '#fbbf24' },
                ]

                return (
                  <div key={inv.id}
                    onMouseEnter={() => setHoveredCard(inv.id)} onMouseLeave={() => setHoveredCard(null)}
                    style={{ position:'relative',overflow:'hidden',background: isHovered ? 'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0.025) 100%)' : 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',border:`1px solid ${isHovered ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.06)'}`,borderRadius:'24px',backdropFilter:'blur(20px)',transition:'all 0.4s cubic-bezier(0.4,0,0.2,1)',transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',boxShadow: isHovered ? '0 16px 50px rgba(0,0,0,0.35),0 0 50px rgba(236,72,153,0.06)' : '0 2px 12px rgba(0,0,0,0.15)',animation:`fiFadeInStagger 0.5s ease-out ${index * 0.08}s both` }}>

                    <div style={{ position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#ec4899,#a855f7,transparent)',backgroundSize:'200% 100%',animation: isHovered ? 'fiGradientShift 2s ease-in-out infinite' : 'none',opacity: isHovered ? 1 : 0,transition:'opacity 0.3s ease' }}/>
                    <div style={{ position:'absolute',top:'-30px',right:'-30px',width:'140px',height:'140px',background:'radial-gradient(circle,rgba(236,72,153,0.06) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none',opacity: isHovered ? 1 : 0.3,transition:'opacity 0.3s ease' }}/>

                    <div style={{ display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'220px' }}>
                      {/* Cover */}
                      <div style={{ position:'relative',overflow:'hidden',background:'#0d0d12',borderRadius:'24px 0 0 24px' }}>
                        {song.coverArtUrl ? (
                          <img src={song.coverArtUrl} alt={song.title} style={{ width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform 0.5s cubic-bezier(0.4,0,0.2,1)',transform: isHovered ? 'scale(1.06)' : 'scale(1)',animation:'fiImageReveal 0.5s ease-out' }}/>
                        ) : (
                          <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0d0d12,#141420)' }}>
                            <div style={{ width:'60px',height:'60px',borderRadius:'18px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                              <Music size={26} color="#27272a"/>
                            </div>
                          </div>
                        )}
                        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'50%',background:'linear-gradient(to top,rgba(6,6,10,0.6) 0%,transparent 100%)',opacity: isHovered ? 1 : 0,transition:'opacity 0.3s ease' }}/>
                        <div style={{ position:'absolute',top:'12px',left:'12px',padding:'4px 10px',background: inv.status === 'active' ? 'rgba(16,185,129,0.85)' : 'rgba(245,158,11,0.85)',backdropFilter:'blur(8px)',borderRadius:'8px',fontSize:'10px',fontWeight:700,color:'#000',textTransform:'uppercase',letterSpacing:'0.06em' }}>
                          {inv.status}
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding:'24px',display:'flex',flexDirection:'column',gap:'16px',position:'relative' }}>
                        <div>
                          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',flexWrap:'wrap' }}>
                            <h2 style={{ fontSize:'20px',fontWeight:800,color:'#fff',margin:0,lineHeight:1.3 }}>{song.title}</h2>
                            <div style={{ padding:'5px 12px',background: roiPos ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',border:`1px solid ${roiPos ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,borderRadius:'10px',fontSize:'13px',fontWeight:800,color: roiPos ? '#34d399' : '#f87171' }}>
                              {roiPos ? '↑' : '↓'} {analytics.roi.toFixed(1)}% ROI
                            </div>
                          </div>
                          <p style={{ fontSize:'14px',color:'#71717a',margin:'4px 0 0 0',fontWeight:500 }}>
                            by <span style={{ color:'#a1a1aa' }}>{song.artist.name}</span>
                          </p>
                        </div>

                        {/* Metrics */}
                        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px' }}>
                          {metricCards.map(m => {
                            const mH = hoveredStat === `${inv.id}-${m.key}`
                            return (
                              <div key={m.key}
                                onMouseEnter={() => setHoveredStat(`${inv.id}-${m.key}`)} onMouseLeave={() => setHoveredStat(null)}
                                style={{ background: mH ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)',border:`1px solid ${mH ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`,borderRadius:'14px',padding:'14px',transition:'all 0.25s ease',transform: mH ? 'translateY(-2px)' : 'translateY(0)',cursor:'default' }}>
                                <p style={{ fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 6px 0' }}>{m.label}</p>
                                <p style={{ fontSize:'16px',fontWeight:700,color:m.color,margin:0,textTransform: m.key === 'status' ? 'capitalize' as const : 'none' as const,textShadow: mH ? `0 0 12px ${m.color}30` : 'none',transition:'text-shadow 0.3s ease' }}>{m.value}</p>
                              </div>
                            )
                          })}
                        </div>

                        {/* Footer */}
                        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'12px',borderTop:'1px solid rgba(255,255,255,0.04)',flexWrap:'wrap',gap:'10px' }}>
                          <span style={{ fontSize:'12px',color:'#3f3f46',fontWeight:500 }}>
                            Invested on {new Date(inv.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                          </span>

                          <div style={{ display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap' }}>
                            <div style={{ display:'flex',alignItems:'center',gap:'6px' }}>
                              <div style={{ width:'6px',height:'6px',borderRadius:'50%',background: roiPos ? '#34d399' : '#f87171',boxShadow:`0 0 6px ${roiPos ? 'rgba(52,211,153,0.5)' : 'rgba(248,113,113,0.5)'}`,animation:'fiPulseDot 2s ease-in-out infinite' }}/>
                              <span style={{ fontSize:'11px',color:'#52525b',fontWeight:600 }}>
                                Est. return: <span style={{ color:'#34d399',fontWeight:700 }}>₹{analytics.estimatedPayout.toLocaleString('en-IN')}</span>
                              </span>
                            </div>

                            {/* Download contract button */}
                            <button onClick={() => downloadContract(inv)}
                              onMouseEnter={e => { e.currentTarget.style.background='rgba(236,72,153,0.12)'; e.currentTarget.style.borderColor='rgba(236,72,153,0.3)'; e.currentTarget.style.color='#f472b6'; e.currentTarget.style.transform='translateY(-1px)' }}
                              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#71717a'; e.currentTarget.style.transform='translateY(0)' }}
                              style={{ display:'flex',alignItems:'center',gap:6,padding:'7px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#71717a',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',transition:'all .2s ease' }}>
                              <Download size={13} /> Download Contract
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </FanLayout>
  )
}