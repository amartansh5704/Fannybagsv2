'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2, Wallet, RefreshCw } from 'lucide-react'

const TX_COLORS: Record<string, { color: string; bg: string; border: string; sign: string; emoji: string }> = {
  royalty_deposit:          { color:'#c084fc', bg:'rgba(168,85,247,0.08)',  border:'rgba(168,85,247,0.15)',  sign:'+', emoji:'🎵' },
  royalty_distribution:     { color:'#f87171', bg:'rgba(239,68,68,0.08)',   border:'rgba(239,68,68,0.15)',   sign:'−', emoji:'📤' },
  deal_escrow_received:     { color:'#60a5fa', bg:'rgba(59,130,246,0.08)',  border:'rgba(59,130,246,0.15)',  sign:'+', emoji:'🔒' },
  deal_escrow_release:      { color:'#fbbf24', bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.15)',  sign:'−', emoji:'🔓' },
  deal_commission:          { color:'#34d399', bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.15)',  sign:'+', emoji:'💰' },
  campaign_escrow_received: { color:'#60a5fa', bg:'rgba(59,130,246,0.08)',  border:'rgba(59,130,246,0.15)',  sign:'+', emoji:'🔒' },
  campaign_funds_release:   { color:'#fbbf24', bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.15)',  sign:'−', emoji:'🔓' },
  campaign_platform_fee:    { color:'#34d399', bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.15)',  sign:'+', emoji:'🏦' },
  deposit:                  { color:'#34d399', bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.15)',  sign:'+', emoji:'💰' },
  withdrawal:               { color:'#f87171', bg:'rgba(239,68,68,0.08)',   border:'rgba(239,68,68,0.15)',   sign:'−', emoji:'💸' },
}

const txStyle = (type: string) =>
  TX_COLORS[type] ?? { color:'#a1a1aa', bg:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.08)', sign:'', emoji:'📋' }

export default function AdminWalletPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const depositDialogRef = useRef<HTMLDialogElement>(null)

  const [data, setData]               = useState<any>(null)
  const [loading, setLoading]         = useState(true)
  const [refreshing, setRefreshing]   = useState(false)
  const [hoveredTx, setHoveredTx]     = useState<string | null>(null)
  const [activeTab, setActiveTab]     = useState<'all' | 'escrow' | 'commission' | 'royalty'>('all')

  // Deposit form
  const [depositAmt, setDepositAmt]   = useState('')
  const [depositing, setDepositing]   = useState(false)
  const [depositDone, setDepositDone] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'admin') { router.push('/'); return }
    load()
  }, [session, status])

  const load = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    const res  = await fetch('/api/admin/wallet')
    const json = await res.json()
    if (json.success) setData(json.data)
    setLoading(false)
    setRefreshing(false)
  }

  const depositRoyalty = async () => {
    const amt = Number(depositAmt)
    if (!amt || amt <= 0) return
    setDepositing(true)
    const res  = await fetch('/api/admin/wallet', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amt }),
    })
    const json = await res.json()
    setDepositing(false)
    if (json.success) {
      setDepositDone(true)
      setDepositAmt('')
      await load(true)
      setTimeout(() => { setDepositDone(false); depositDialogRef.current?.close() }, 2000)
    } else { alert(json.error || 'Deposit failed') }
  }

  const transactions = data?.transactions ?? []
  const filteredTx = transactions.filter((tx: any) => {
    if (activeTab === 'escrow')     return ['deal_escrow_received','deal_escrow_release','campaign_escrow_received','campaign_funds_release'].includes(tx.type)
    if (activeTab === 'commission') return ['deal_commission','campaign_platform_fee'].includes(tx.type)
    if (activeTab === 'royalty')    return ['royalty_deposit','royalty_distribution'].includes(tx.type)
    return true
  })

  if (loading) {
    return (
      <AdminLayout>
        <style>{`@keyframes aSpin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <Loader2 style={{ animation:'aSpin 1s linear infinite', color:'#f87171', width:32, height:32 }} />
          <p style={{ marginTop:14, color:'#52525b', fontSize:13 }}>Loading admin wallet...</p>
        </div>
      </AdminLayout>
    )
  }

  const balance = data?.wallet?.balance ?? 0
  const bd      = data?.breakdown ?? {}

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes aSpin       { to{transform:rotate(360deg)} }
        @keyframes aFadeInUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes aFadeInDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes aGradShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes aPulseDot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }
        @keyframes aPop        { 0%{transform:scale(.9);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

        dialog::backdrop { background:rgba(0,0,0,0.85); backdrop-filter:blur(14px); }
        dialog { border:none; padding:0; background:transparent; }
        dialog[open] { animation:aFadeInUp 0.3s ease-out; }

        .a-input::placeholder { color:#3f3f46; }
        .a-input:focus { outline:none; border-color:rgba(239,68,68,0.4); box-shadow:0 0 0 3px rgba(239,68,68,0.08); }
        .a-scroll::-webkit-scrollbar { width:4px; }
        .a-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.06); border-radius:2px; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type="number"] { -moz-appearance:textfield; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', position:'relative', overflow:'hidden', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-80px', right:'-40px', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(239,68,68,0.06) 0%,transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'400px', height:'400px', background:'radial-gradient(circle,rgba(249,115,22,0.04) 0%,transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        {/* Header */}
        <div style={{ position:'relative', zIndex:1, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', animation:'aFadeInDown 0.4s ease-out' }}>
          <div style={{ padding:'22px 32px', maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,rgba(239,68,68,0.14),rgba(249,115,22,0.08))', border:'1px solid rgba(239,68,68,0.16)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Wallet size={20} color="#f87171" />
              </div>
              <div>
                <h1 style={{ fontSize:22, fontWeight:800, margin:0, background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Admin Wallet</h1>
                <p style={{ fontSize:13, color:'#52525b', margin:'2px 0 0 0', fontWeight:500 }}>Platform treasury & escrow</p>
              </div>
            </div>
            <button onClick={() => load(true)} disabled={refreshing}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.color='#52525b' }}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, color:'#52525b', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>
              <RefreshCw size={13} style={{ animation: refreshing ? 'aSpin 1s linear infinite' : 'none' }} /> Refresh
            </button>
          </div>
        </div>

        <div style={{ position:'relative', zIndex:1, padding:'28px 32px 60px', maxWidth:1200, margin:'0 auto' }}>

          {/* Balance hero */}
          <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,rgba(239,68,68,0.12),rgba(249,115,22,0.07),rgba(255,255,255,0.02))', border:'1px solid rgba(239,68,68,0.18)', borderRadius:24, padding:'36px', marginBottom:24, animation:'aFadeInUp 0.4s ease-out' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#ef4444,#f97316,transparent)', backgroundSize:'200% 100%', animation:'aGradShift 4s ease-in-out infinite' }} />
            <div style={{ position:'absolute', top:'-30px', right:'-30px', width:200, height:200, background:'radial-gradient(circle,rgba(239,68,68,0.15) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20, position:'relative' }}>
              <div>
                <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'#dc2626', margin:'0 0 8px 0' }}>Platform Balance</p>
                <p style={{ fontSize:48, fontWeight:800, color:'#fff', margin:0, lineHeight:1.1, letterSpacing:'-0.02em' }}>₹{balance.toLocaleString('en-IN')}</p>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10 }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:'#f87171', animation:'aPulseDot 2s ease-in-out infinite' }} />
                  <span style={{ fontSize:12, color:'#52525b', fontWeight:600 }}>Live balance</span>
                </div>
              </div>
              <button onClick={() => { setDepositDone(false); setDepositAmt(''); depositDialogRef.current?.showModal() }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(168,85,247,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(168,85,247,0.15)' }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 22px', background:'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(139,92,246,0.1))', border:'1px solid rgba(168,85,247,0.3)', borderRadius:14, color:'#c084fc', fontSize:14, fontWeight:700, cursor:'pointer', transition:'all .3s ease', fontFamily:'inherit', boxShadow:'0 2px 12px rgba(168,85,247,0.15)' }}>
                🎵 Deposit DSP Revenue
              </button>
            </div>
          </div>

          {/* Breakdown cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:28, animation:'aFadeInUp 0.4s ease-out 0.1s both' }}>
            {[
              { label:'Deal Escrow',          value:`₹${(bd.dealEscrowHolding ?? 0).toLocaleString('en-IN')}`,       color:'#60a5fa', icon:'🔒' },
              { label:'Campaign Escrow',      value:`₹${(bd.campaignEscrowHolding ?? 0).toLocaleString('en-IN')}`,   color:'#60a5fa', icon:'🔐' },
              { label:'Deal Commission',      value:`₹${(bd.dealCommissions ?? 0).toLocaleString('en-IN')}`,         color:'#34d399', icon:'💰' },
              { label:'Investment Commission', value:`₹${(bd.investmentCommissions ?? 0).toLocaleString('en-IN')}`,   color:'#34d399', icon:'🏦' },
              { label:'Royalty Pool',          value:`₹${(bd.royaltyPool ?? 0).toLocaleString('en-IN')}`,             color:'#c084fc', icon:'🎵' },
              { label:'Platform Revenue',     value:`₹${(bd.totalPlatformRevenue ?? 0).toLocaleString('en-IN')}`,    color:'#fbbf24', icon:'⭐' },
            ].map((s, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:'20px 22px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:18 }}>{s.icon}</span>
                  <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#3f3f46', margin:0 }}>{s.label}</p>
                </div>
                <p style={{ fontSize:20, fontWeight:800, color:s.color, margin:0 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Transactions */}
          <div style={{ animation:'aFadeInUp 0.4s ease-out 0.2s both' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:'#fff', margin:0 }}>Transaction History</h2>
              <div style={{ display:'flex', gap:6 }}>
                {(['all','escrow','commission','royalty'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:700, cursor:'pointer', border:'1px solid', transition:'all .2s ease', fontFamily:'inherit', textTransform:'capitalize',
                      ...(activeTab === tab
                        ? { background:'rgba(239,68,68,0.12)', borderColor:'rgba(239,68,68,0.3)', color:'#f87171' }
                        : { background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)', color:'#52525b' }
                      ) }}>
                    {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredTx.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 0', gap:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:20 }}>
                <span style={{ fontSize:32 }}>📭</span>
                <p style={{ color:'#52525b', fontSize:15, fontWeight:600, margin:0 }}>No transactions</p>
              </div>
            ) : (
              <div className="a-scroll" style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {filteredTx.map((tx: any, idx: number) => {
                  const s   = txStyle(tx.type)
                  const isH = hoveredTx === tx.id
                  return (
                    <div key={tx.id}
                      onMouseEnter={() => setHoveredTx(tx.id)}
                      onMouseLeave={() => setHoveredTx(null)}
                      style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', background: isH ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)', border:`1px solid ${isH ? s.border : 'rgba(255,255,255,0.05)'}`, borderRadius:16, transition:'all .25s ease', animation:`aFadeInUp .3s ease-out ${idx * 0.03}s both`, transform: isH ? 'translateX(3px)' : 'translateX(0)' }}>
                      <div style={{ width:42, height:42, borderRadius:12, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                        {s.emoji}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0, textTransform:'capitalize' }}>{tx.type?.replace(/_/g,' ')}</p>
                        {tx.description && <p style={{ fontSize:12, color:'#52525b', margin:'2px 0 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tx.description}</p>}
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p style={{ fontSize:13, color:'#3f3f46', margin:0, fontWeight:500 }}>{new Date(tx.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                        <p style={{ fontSize:10, color:'#27272a', margin:'2px 0 0 0' }}>{new Date(tx.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</p>
                      </div>
                      <div style={{ padding:'6px 14px', background:s.bg, border:`1px solid ${s.border}`, borderRadius:10, flexShrink:0 }}>
                        <p style={{ fontSize:15, fontWeight:800, color:s.color, margin:0, whiteSpace:'nowrap' }}>{s.sign}₹{tx.amount?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── DEPOSIT DSP REVENUE MODAL ─────────────────────────────────────────── */}
      <dialog ref={depositDialogRef} style={{ width:460, maxWidth:'95vw', borderRadius:24, overflow:'hidden', boxShadow:'0 25px 80px rgba(0,0,0,0.7)' }}>
        <div style={{ background:'#0f0f14', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, overflow:'hidden' }}>

          <div style={{ padding:'22px 26px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🎵</div>
              <div>
                <h2 style={{ fontSize:17, fontWeight:700, color:'#fff', margin:0 }}>Deposit DSP Revenue</h2>
                <p style={{ fontSize:11, color:'#52525b', margin:'1px 0 0 0' }}>Add royalty funds to platform</p>
              </div>
            </div>
            <button onClick={() => depositDialogRef.current?.close()}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#71717a' }}
              style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#71717a', fontSize:17, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', fontFamily:'inherit' }}>✕</button>
          </div>

          <div style={{ padding:26, maxHeight:'65vh', overflowY:'auto' }} className="a-scroll">
            {depositDone ? (
              <div style={{ textAlign:'center', padding:'40px 0', animation:'aPop .4s ease-out' }}>
                <div style={{ fontSize:52, marginBottom:16 }}>✅</div>
                <h3 style={{ fontSize:18, fontWeight:700, color:'#34d399', margin:'0 0 8px 0' }}>Revenue Deposited!</h3>
                <p style={{ fontSize:13, color:'#52525b', margin:0 }}>Royalty funds have been added to the platform wallet.</p>
              </div>
            ) : (
              <>
                {/* Current balance */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'12px 16px', marginBottom:20 }}>
                  <span style={{ fontSize:13, color:'#52525b', fontWeight:500 }}>Platform Balance</span>
                  <span style={{ fontSize:15, fontWeight:800, color:'#f87171' }}>₹{balance.toLocaleString('en-IN')}</span>
                </div>

                {/* Info */}
                <div style={{ background:'rgba(168,85,247,0.05)', border:'1px solid rgba(168,85,247,0.12)', borderRadius:12, padding:'12px 16px', marginBottom:20 }}>
                  <p style={{ fontSize:12, color:'#c084fc', margin:0, lineHeight:1.7 }}>
                    ℹ️ This deposits DSP/streaming royalty revenue into the platform wallet. These funds are used for royalty distributions to artists and fans.
                  </p>
                </div>

                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#52525b', marginBottom:8 }}>Amount (₹)</label>
                <input type="number" placeholder="e.g. 50000" value={depositAmt}
                  onChange={e => setDepositAmt(e.target.value)} className="a-input"
                  style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:13, padding:'15px 18px', color:'#fff', fontSize:24, fontWeight:800, fontFamily:'inherit', boxSizing:'border-box', marginBottom:16, transition:'all .2s ease' }} />

                {/* Quick amounts */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:22 }}>
                  {[10000, 25000, 50000, 100000].map(amt => (
                    <button key={amt} onClick={() => setDepositAmt(String(amt))}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(168,85,247,0.1)'; e.currentTarget.style.borderColor='rgba(168,85,247,0.25)'; e.currentTarget.style.color='#c084fc' }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#71717a' }}
                      style={{ padding:'9px 0', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', color:'#71717a', fontSize:11, fontWeight:700, cursor:'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <button onClick={() => depositDialogRef.current?.close()}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#a1a1aa' }}
                    style={{ padding:14, borderRadius:13, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#a1a1aa', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>
                    Cancel
                  </button>
                  <button onClick={depositRoyalty} disabled={depositing || !depositAmt || Number(depositAmt) <= 0}
                    onMouseEnter={e => { if (!depositing) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(168,85,247,0.3)' } }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                    style={{ padding:14, borderRadius:13, background:(depositing || !depositAmt || Number(depositAmt) <= 0) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#7c3aed,#9333ea)', border:'none', color:(depositing || !depositAmt || Number(depositAmt) <= 0) ? '#52525b' : '#fff', fontSize:14, fontWeight:700, cursor:(depositing || !depositAmt || Number(depositAmt) <= 0) ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                    {depositing ? <><Loader2 size={14} style={{ animation:'aSpin 1s linear infinite' }} /> Depositing...</> : '🎵 Deposit Revenue'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </dialog>
    </AdminLayout>
  )
}