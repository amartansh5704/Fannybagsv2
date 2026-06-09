'use client'

import { useEffect, useRef, useState } from 'react'
import FanLayout from '@/components/fan/FanLayout'
import {
  Wallet, ArrowDownLeft, ArrowUpRight,
  Loader2, RefreshCw, Upload, Copy, Check,
} from 'lucide-react'

const YOUR_UPI_ID = '8448621626@ptsbi'
const YOUR_UPI_QR = '/upi-qr.png'

const TX_COLORS: Record<string, { color: string; bg: string; border: string; sign: string }> = {
  deposit:    { color: '#34d399', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.15)',  sign: '+' },
  credit:     { color: '#34d399', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.15)',  sign: '+' },
  received:   { color: '#60a5fa', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.15)',  sign: '+' },
  royalty:    { color: '#c084fc', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.15)',  sign: '+' },
  payout:     { color: '#fbbf24', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.15)',  sign: '+' },
  withdrawal: { color: '#f87171', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.15)',   sign: '−' },
  debit:      { color: '#f87171', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.15)',   sign: '−' },
  escrow:     { color: '#fbbf24', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.15)',  sign: '−' },
  investment: { color: '#c084fc', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.15)',  sign: '−' },
  refund:     { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.15)',  sign: '+' },
}

const txStyle = (type: string) =>
  TX_COLORS[type?.toLowerCase()] ?? { color: '#a1a1aa', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', sign: '' }

const DEP_STATUS = {
  pending:  { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  icon: '⏳', label: 'Pending' },
  approved: { color: '#34d399', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  icon: '✅', label: 'Approved' },
  rejected: { color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   icon: '❌', label: 'Rejected' },
}

const WD_STATUS = {
  pending:  { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  icon: '⏳', label: 'Pending' },
  paid:     { color: '#34d399', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  icon: '✅', label: 'Paid' },
  rejected: { color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   icon: '❌', label: 'Rejected' },
}

export default function FanWalletPage() {
  const depositDialogRef = useRef<HTMLDialogElement>(null)
  const payoutDialogRef  = useRef<HTMLDialogElement>(null)
  const ssInputRef       = useRef<HTMLInputElement>(null)

  const [wallet, setWallet]           = useState<any>(null)
  const [transactions, setTx]         = useState<any[]>([])
  const [depositReqs, setDepReqs]     = useState<any[]>([])
  const [withdrawReqs, setWdReqs]     = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [refreshing, setRefreshing]   = useState(false)
  const [activeTab, setActiveTab]     = useState<'all' | 'credit' | 'debit'>('all')
  const [hoveredTx, setHoveredTx]     = useState<string | null>(null)

  // Deposit
  const [step, setStep]               = useState<1 | 2 | 3>(1)
  const [depositAmt, setDepositAmt]   = useState('')
  const [utrNumber, setUtrNumber]     = useState('')
  const [ssUrl, setSsUrl]             = useState('')
  const [ssUploading, setSsUpload]    = useState(false)
  const [submitting, setSubmit]       = useState(false)
  const [submitDone, setSubmitDone]   = useState(false)
  const [copied, setCopied]           = useState(false)

  // Withdrawal
  const [payoutAmt, setPayoutAmt]         = useState('')
  const [payoutMethod, setPayoutMethod]   = useState<'upi' | 'bank_transfer'>('upi')
  const [payoutDetail, setPayoutDetail]   = useState('')
  const [payingOut, setPayingOut]         = useState(false)
  const [payoutError, setPayoutError]     = useState('')
  const [payoutDone, setPayoutDone]       = useState(false)

  const loadAll = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)

    const [wRes, drRes, wrRes] = await Promise.all([
      fetch('/api/wallet').then(r => r.json()),
      fetch('/api/wallet/deposit-request').then(r => r.json()),
      fetch('/api/wallet/withdraw').then(r => r.json()),
    ])

    if (wRes.success)  { setWallet(wRes.data.wallet); setTx(wRes.data.transactions ?? []) }
    if (drRes.success) setDepReqs(drRes.data)
    if (wrRes.success) setWdReqs(wrRes.data)

    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { loadAll() }, [])

  const handleSsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setSsUpload(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.success) setSsUrl(json.url)
      else alert('Upload failed')
    } finally { setSsUpload(false) }
  }

  const submitDepositRequest = async () => {
    if (!utrNumber.trim() && !ssUrl) { alert('Enter UTR or upload screenshot'); return }
    setSubmit(true)
    const res  = await fetch('/api/wallet/deposit-request', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(depositAmt), utrNumber, screenshotUrl: ssUrl }),
    })
    const json = await res.json()
    setSubmit(false)
    if (json.success) {
      setSubmitDone(true)
      await loadAll(true)
      setTimeout(() => {
        setSubmitDone(false); setStep(1)
        setDepositAmt(''); setUtrNumber(''); setSsUrl('')
        depositDialogRef.current?.close()
      }, 2500)
    } else { alert(json.error || 'Submission failed') }
  }

  const submitWithdrawal = async () => {
    setPayoutError('')
    const amt = Number(payoutAmt)
    if (!amt || amt <= 0)             { setPayoutError('Enter a valid amount'); return }
    if (amt < 100)                    { setPayoutError('Minimum withdrawal is ₹100'); return }
    if (!payoutDetail.trim())         { setPayoutError(payoutMethod === 'upi' ? 'Enter your UPI ID' : 'Enter bank details'); return }
    if (amt > (wallet?.balance ?? 0)) { setPayoutError('Insufficient balance'); return }

    setPayingOut(true)
    const res  = await fetch('/api/wallet/withdraw', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amt, method: payoutMethod, detail: payoutDetail }),
    })
    const json = await res.json()
    setPayingOut(false)
    if (json.success) {
      setPayoutDone(true)
      setPayoutAmt(''); setPayoutDetail('')
      await loadAll(true)
      setTimeout(() => { setPayoutDone(false); payoutDialogRef.current?.close() }, 2500)
    } else { setPayoutError(json.error || 'Withdrawal failed') }
  }

  const copyUpi = () => {
    navigator.clipboard.writeText(YOUR_UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const balance    = wallet?.balance ?? 0
  const filteredTx = transactions.filter(tx => {
    const t = tx.type?.toLowerCase()
    if (activeTab === 'credit') return ['deposit','credit','received','royalty','refund','payout'].includes(t)
    if (activeTab === 'debit')  return ['withdrawal','debit','escrow','investment'].includes(t)
    return true
  })

  if (loading) {
    return (
      <FanLayout>
        <style>{`@keyframes fSpin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <Loader2 style={{ animation:'fSpin 1s linear infinite', color:'#f472b6', width:32, height:32 }} />
          <p style={{ marginTop:14, color:'#52525b', fontSize:13 }}>Loading wallet...</p>
        </div>
      </FanLayout>
    )
  }

  return (
    <FanLayout>
      <style jsx global>{`
        @keyframes fSpin       { to { transform: rotate(360deg); } }
        @keyframes fFadeInUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fFadeInDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fGradShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes fPulseDot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }
        @keyframes fPop        { 0%{transform:scale(.9);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

        dialog::backdrop { background:rgba(0,0,0,0.85); backdrop-filter:blur(14px); }
        dialog { border:none; padding:0; background:transparent; }
        dialog[open] { animation:fFadeInUp 0.3s ease-out; }

        .f-input::placeholder { color:#3f3f46; }
        .f-input:focus { outline:none; border-color:rgba(236,72,153,0.4); box-shadow:0 0 0 3px rgba(236,72,153,0.08); }
        .f-tx-scroll::-webkit-scrollbar { width:4px; }
        .f-tx-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.06); border-radius:2px; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type="number"] { -moz-appearance:textfield; }
      `}</style>

      <input ref={ssInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleSsUpload} />

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', position:'relative', overflow:'hidden', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Ambient */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-80px', right:'-40px', width:'500px', height:'500px', background:'radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'400px', height:'400px', background:'radial-gradient(circle,rgba(168,85,247,0.05) 0%,transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        {/* Header */}
        <div style={{ position:'relative', zIndex:1, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', animation:'fFadeInDown 0.4s ease-out' }}>
          <div style={{ padding:'20px 16px', maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,rgba(236,72,153,0.14),rgba(168,85,247,0.08))', border:'1px solid rgba(236,72,153,0.16)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Wallet size={20} color="#f472b6" />
              </div>
              <div>
                <h1 style={{ fontSize:22, fontWeight:800, margin:0, background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Fan Wallet</h1>
                <p style={{ fontSize:13, color:'#52525b', margin:'2px 0 0 0', fontWeight:500 }}>Manage your funds & investments</p>
              </div>
            </div>
            <button onClick={() => loadAll(true)} disabled={refreshing}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.color='#52525b' }}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, color:'#52525b', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>
              <RefreshCw size={13} style={{ animation: refreshing ? 'fSpin 1s linear infinite' : 'none' }} /> Refresh
            </button>
          </div>
        </div>

        <div style={{ position:'relative', zIndex:1, padding:'20px 16px 60px', maxWidth:1100, margin:'0 auto' }}>

          {/* Balance hero */}
          <div style={{ position:'relative', overflow:'hidden', background:'linear-gradient(135deg,rgba(236,72,153,0.12),rgba(168,85,247,0.07),rgba(255,255,255,0.02))', border:'1px solid rgba(236,72,153,0.18)', borderRadius:24, padding:'36px', marginBottom:24, animation:'fFadeInUp 0.4s ease-out' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#ec4899,#a855f7,transparent)', backgroundSize:'200% 100%', animation:'fGradShift 4s ease-in-out infinite' }} />
            <div style={{ position:'absolute', top:'-30px', right:'-30px', width:200, height:200, background:'radial-gradient(circle,rgba(236,72,153,0.15) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20, position:'relative' }}>
              <div>
                <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'#db2777', margin:'0 0 8px 0' }}>Available Balance</p>
                <p style={{ fontSize:'clamp(28px, 6vw, 48px)', fontWeight:800, color:'#fff', margin:0, lineHeight:1.1, letterSpacing:'-0.02em' }}>₹{balance.toLocaleString('en-IN')}</p>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10 }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:'#f472b6', animation:'fPulseDot 2s ease-in-out infinite' }} />
                  <span style={{ fontSize:12, color:'#52525b', fontWeight:600 }}>Live balance</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <button onClick={() => { setStep(1); setSubmitDone(false); depositDialogRef.current?.showModal() }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(16,185,129,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(16,185,129,0.15)' }}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 22px', background:'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(20,184,166,0.1))', border:'1px solid rgba(16,185,129,0.3)', borderRadius:14, color:'#34d399', fontSize:14, fontWeight:700, cursor:'pointer', transition:'all .3s ease', fontFamily:'inherit', boxShadow:'0 2px 12px rgba(16,185,129,0.15)' }}>
                  <ArrowDownLeft size={16} /> Add Money
                </button>
                <button onClick={() => { setPayoutError(''); setPayoutDone(false); payoutDialogRef.current?.showModal() }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(239,68,68,0.25)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(239,68,68,0.1)' }}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 22px', background:'linear-gradient(135deg,rgba(239,68,68,0.1),rgba(239,68,68,0.06))', border:'1px solid rgba(239,68,68,0.2)', borderRadius:14, color:'#f87171', fontSize:14, fontWeight:700, cursor:'pointer', transition:'all .3s ease', fontFamily:'inherit', boxShadow:'0 2px 12px rgba(239,68,68,0.1)' }}>
                  <ArrowUpRight size={16} /> Withdraw
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:28, animation:'fFadeInUp 0.4s ease-out 0.1s both' }}>
            {[
              { label:'Total Deposited',    value:`₹${(wallet?.totalDeposited ?? 0).toLocaleString('en-IN')}`, color:'#34d399', icon:'💰' },
              { label:'Total Spent',        value:`₹${(wallet?.totalSpent ?? 0).toLocaleString('en-IN')}`,     color:'#f87171', icon:'📤' },
              { label:'Pending Deposits',   value: depositReqs.filter(r => r.status === 'pending').length,     color:'#fbbf24', icon:'⏳' },
              { label:'Pending Withdrawals',value: withdrawReqs.filter(r => r.status === 'pending').length,    color:'#f87171', icon:'🏦' },
            ].map((s, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:'20px 22px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:18 }}>{s.icon}</span>
                  <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#3f3f46', margin:0 }}>{s.label}</p>
                </div>
                <p style={{ fontSize:22, fontWeight:800, color:s.color, margin:0 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Deposit requests */}
          {depositReqs.length > 0 && (
            <div style={{ marginBottom:28, animation:'fFadeInUp 0.4s ease-out 0.15s both' }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:'#fff', margin:'0 0 14px 0' }}>Deposit Requests</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {depositReqs.map((req, idx) => {
                  const s = DEP_STATUS[req.status as keyof typeof DEP_STATUS] ?? DEP_STATUS.pending
                  return (
                    <div key={req.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, animation:`fFadeInUp .3s ease-out ${idx * 0.04}s both` }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{s.icon}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>₹{req.amount.toLocaleString('en-IN')}</p>
                        <p style={{ fontSize:11, color:'#52525b', margin:'2px 0 0 0' }}>UTR: {req.utrNumber || 'N/A'} · {new Date(req.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</p>
                        {req.note && req.status === 'rejected' && <p style={{ fontSize:11, color:'#f87171', margin:'2px 0 0 0' }}>Reason: {req.note}</p>}
                      </div>
                      {req.screenshotUrl && <a href={req.screenshotUrl} target="_blank" rel="noreferrer" style={{ fontSize:11, color:'#f472b6', textDecoration:'none', fontWeight:600 }}>View SS ↗</a>}
                      <div style={{ padding:'4px 12px', borderRadius:999, background:s.bg, border:`1px solid ${s.border}`, fontSize:11, fontWeight:700, color:s.color, flexShrink:0 }}>{s.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Withdrawal requests */}
          {withdrawReqs.length > 0 && (
            <div style={{ marginBottom:28, animation:'fFadeInUp 0.4s ease-out 0.18s both' }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:'#fff', margin:'0 0 14px 0' }}>Withdrawal Requests</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {withdrawReqs.map((req, idx) => {
                  const s = WD_STATUS[req.status as keyof typeof WD_STATUS] ?? WD_STATUS.pending
                  return (
                    <div key={req.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, animation:`fFadeInUp .3s ease-out ${idx * 0.04}s both` }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{s.icon}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>₹{req.amount.toLocaleString('en-IN')}</p>
                        <p style={{ fontSize:11, color:'#52525b', margin:'2px 0 0 0' }}>
                          {req.method === 'upi' ? '📱' : '🏦'} {req.detail} · {new Date(req.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                        </p>
                        {req.note && req.status === 'rejected' && <p style={{ fontSize:11, color:'#f87171', margin:'2px 0 0 0' }}>Reason: {req.note}</p>}
                      </div>
                      <div style={{ padding:'4px 12px', borderRadius:999, background:s.bg, border:`1px solid ${s.border}`, fontSize:11, fontWeight:700, color:s.color, flexShrink:0 }}>{s.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Transaction history */}
          <div style={{ animation:'fFadeInUp 0.4s ease-out 0.2s both' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:'#fff', margin:0 }}>Transaction History</h2>
              <div style={{ display:'flex', gap:6 }}>
                {(['all','credit','debit'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:700, cursor:'pointer', border:'1px solid', transition:'all .2s ease', fontFamily:'inherit',
                      ...(activeTab === tab
                        ? { background:'rgba(236,72,153,0.12)', borderColor:'rgba(236,72,153,0.3)', color:'#f472b6' }
                        : { background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)', color:'#52525b' }
                      ) }}>
                    {tab === 'all' ? 'All' : tab === 'credit' ? '↑ In' : '↓ Out'}
                  </button>
                ))}
              </div>
            </div>

            {filteredTx.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 0', gap:10, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:20 }}>
                <span style={{ fontSize:32 }}>📭</span>
                <p style={{ color:'#52525b', fontSize:15, fontWeight:600, margin:0 }}>No transactions yet</p>
              </div>
            ) : (
              <div className="f-tx-scroll" style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {filteredTx.map((tx, idx) => {
                  const s   = txStyle(tx.type)
                  const isH = hoveredTx === tx.id
                  return (
                    <div key={tx.id}
                      onMouseEnter={() => setHoveredTx(tx.id)}
                      onMouseLeave={() => setHoveredTx(null)}
                      style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', background: isH ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)', border:`1px solid ${isH ? s.border : 'rgba(255,255,255,0.05)'}`, borderRadius:16, transition:'all .25s ease', animation:`fFadeInUp .3s ease-out ${idx * 0.03}s both`, transform: isH ? 'translateX(3px)' : 'translateX(0)' }}>
                      <div style={{ width:42, height:42, borderRadius:12, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                        {tx.type === 'deposit' ? '💰' : tx.type === 'withdrawal' ? '🏦' : tx.type === 'escrow' ? '🔒' : tx.type === 'investment' ? '💎' : tx.type === 'payout' ? '🎉' : tx.type === 'royalty' ? '🎵' : tx.type === 'refund' ? '↩️' : '💸'}
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

      {/* ── DEPOSIT MODAL ─────────────────────────────────────────────────────── */}
      <dialog ref={depositDialogRef} style={{ width:480, maxWidth:'95vw', borderRadius:24, overflow:'hidden', boxShadow:'0 25px 80px rgba(0,0,0,0.7)' }}>
        <div style={{ background:'#0f0f14', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>💰</div>
              <div>
                <h2 style={{ fontSize:16, fontWeight:700, color:'#fff', margin:0 }}>Add Money</h2>
                <p style={{ fontSize:11, color:'#52525b', margin:'1px 0 0 0' }}>Step {step} of 3 — {step === 1 ? 'Enter Amount' : step === 2 ? 'Pay via UPI' : 'Confirm Payment'}</p>
              </div>
            </div>
            <button onClick={() => depositDialogRef.current?.close()}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#71717a' }}
              style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#71717a', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', fontFamily:'inherit' }}>✕</button>
          </div>
          <div style={{ height:3, background:'rgba(255,255,255,0.04)' }}>
            <div style={{ height:'100%', width:`${(step / 3) * 100}%`, background:'linear-gradient(90deg,#10b981,#059669)', transition:'width .4s ease' }} />
          </div>
          <div style={{ padding:24, maxHeight:'65vh', overflowY:'auto' }} className="f-tx-scroll">
            {submitDone ? (
              <div style={{ textAlign:'center', padding:'40px 0', animation:'fPop .4s ease-out' }}>
                <div style={{ fontSize:52, marginBottom:16 }}>✅</div>
                <h3 style={{ fontSize:18, fontWeight:700, color:'#34d399', margin:'0 0 8px 0' }}>Request Submitted!</h3>
                <p style={{ fontSize:13, color:'#52525b', margin:0, lineHeight:1.6 }}>We'll verify your payment and credit your wallet within a few hours.</p>
              </div>
            ) : step === 1 ? (
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#52525b', marginBottom:8 }}>Amount to Deposit (₹)</label>
                <input type="number" placeholder="e.g. 1000" value={depositAmt} onChange={e => setDepositAmt(e.target.value)} className="f-input"
                  style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:13, padding:'15px 18px', color:'#fff', fontSize:26, fontWeight:800, fontFamily:'inherit', boxSizing:'border-box', marginBottom:16, transition:'all .2s ease' }} />
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:22 }}>
                  {[500,1000,2000,5000].map(amt => (
                    <button key={amt} onClick={() => setDepositAmt(String(amt))}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(16,185,129,0.1)'; e.currentTarget.style.borderColor='rgba(16,185,129,0.25)'; e.currentTarget.style.color='#34d399' }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#71717a' }}
                      style={{ padding:'9px 0', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', color:'#71717a', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <button onClick={() => { if (Number(depositAmt) > 0) setStep(2) }} disabled={!depositAmt || Number(depositAmt) <= 0}
                  style={{ width:'100%', padding:14, borderRadius:13, background:(!depositAmt || Number(depositAmt) <= 0) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#10b981,#059669)', border:'none', color:(!depositAmt || Number(depositAmt) <= 0) ? '#52525b' : '#fff', fontSize:14, fontWeight:700, cursor:(!depositAmt || Number(depositAmt) <= 0) ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit' }}>
                  Continue →
                </button>
              </div>
            ) : step === 2 ? (
              <div>
                <div style={{ textAlign:'center', marginBottom:20 }}>
                  <p style={{ fontSize:13, color:'#71717a', margin:'0 0 4px 0' }}>Pay exactly</p>
                  <p style={{ fontSize:32, fontWeight:800, color:'#34d399', margin:0 }}>₹{Number(depositAmt).toLocaleString('en-IN')}</p>
                </div>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
                  <div style={{ background:'#fff', padding:16, borderRadius:16, display:'inline-block' }}>
                    <img src={YOUR_UPI_QR} alt="UPI QR" style={{ width:180, height:180, display:'block' }} onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                    <p style={{ textAlign:'center', color:'#111', fontSize:12, margin:'8px 0 0 0', fontWeight:600 }}>Scan to pay</p>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)', borderRadius:12, marginBottom:20 }}>
                  <span style={{ flex:1, fontSize:15, fontWeight:700, color:'#34d399' }}>{YOUR_UPI_ID}</span>
                  <button onClick={copyUpi} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:8, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#34d399', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                    {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.15)', borderRadius:12, padding:'12px 16px', marginBottom:20 }}>
                  <p style={{ fontSize:12, color:'#fbbf24', margin:0, lineHeight:1.6 }}>⚠️ Pay exactly <strong>₹{Number(depositAmt).toLocaleString('en-IN')}</strong>. Screenshot the success screen — you'll need it next.</p>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <button onClick={() => setStep(1)} style={{ padding:14, borderRadius:13, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#a1a1aa', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
                  <button onClick={() => setStep(3)} style={{ padding:14, borderRadius:13, background:'linear-gradient(135deg,#10b981,#059669)', border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>I've Paid →</button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize:13, color:'#71717a', margin:'0 0 18px 0', lineHeight:1.6 }}>Enter your UTR/transaction number and/or upload a screenshot of your payment.</p>
                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#52525b', marginBottom:8 }}>UTR / Transaction Number</label>
                <input placeholder="e.g. 425612345678" value={utrNumber} onChange={e => setUtrNumber(e.target.value)} className="f-input"
                  style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:13, padding:'13px 16px', color:'#fff', fontSize:14, fontFamily:'inherit', boxSizing:'border-box', marginBottom:16, transition:'all .2s ease' }} />
                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#52525b', marginBottom:8 }}>Payment Screenshot</label>
                {ssUrl ? (
                  <div style={{ position:'relative', marginBottom:16 }}>
                    <img src={ssUrl} alt="screenshot" style={{ width:'100%', borderRadius:12, maxHeight:200, objectFit:'cover', display:'block' }} />
                    <button onClick={() => setSsUrl('')} style={{ position:'absolute', top:8, right:8, width:28, height:28, borderRadius:8, background:'rgba(239,68,68,0.8)', border:'none', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontFamily:'inherit' }}>✕</button>
                  </div>
                ) : (
                  <div onClick={() => ssInputRef.current?.click()}
                    style={{ border:'1px dashed rgba(255,255,255,0.12)', borderRadius:13, padding:'24px', display:'flex', flexDirection:'column', alignItems:'center', gap:8, cursor: ssUploading ? 'not-allowed' : 'pointer', marginBottom:16, background:'rgba(255,255,255,0.02)', transition:'all .2s ease' }}
                    onMouseEnter={e => { if (!ssUploading) e.currentTarget.style.borderColor='rgba(236,72,153,0.3)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.12)' }}>
                    {ssUploading ? <Loader2 size={22} style={{ animation:'fSpin 1s linear infinite', color:'#f472b6' }} /> : <Upload size={22} color="#52525b" />}
                    <p style={{ fontSize:13, color:'#52525b', margin:0, fontWeight:500 }}>{ssUploading ? 'Uploading...' : 'Click to upload screenshot'}</p>
                  </div>
                )}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <button onClick={() => setStep(2)} style={{ padding:14, borderRadius:13, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#a1a1aa', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
                  <button onClick={submitDepositRequest} disabled={submitting || ssUploading}
                    onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(16,185,129,0.3)' } }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                    style={{ padding:14, borderRadius:13, background:(submitting||ssUploading) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#10b981,#059669)', border:'none', color:(submitting||ssUploading) ? '#52525b' : '#fff', fontSize:14, fontWeight:700, cursor:(submitting||ssUploading) ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                    {submitting ? <><Loader2 size={14} style={{ animation:'fSpin 1s linear infinite' }} /> Submitting...</> : '✓ Submit Request'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </dialog>

      {/* ── WITHDRAWAL MODAL ──────────────────────────────────────────────────── */}
      <dialog ref={payoutDialogRef} style={{ width:480, maxWidth:'95vw', borderRadius:24, overflow:'hidden', boxShadow:'0 25px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ background:'#0f0f14', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, overflow:'hidden' }}>
          <div style={{ padding:'22px 26px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🏦</div>
              <div>
                <h2 style={{ fontSize:17, fontWeight:700, color:'#fff', margin:0 }}>Withdraw Funds</h2>
                <p style={{ fontSize:11, color:'#52525b', margin:'1px 0 0 0' }}>Request a payout to your account</p>
              </div>
            </div>
            <button onClick={() => payoutDialogRef.current?.close()}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#71717a' }}
              style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#71717a', fontSize:17, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', fontFamily:'inherit' }}>✕</button>
          </div>
          <div style={{ padding:26, maxHeight:'70vh', overflowY:'auto' }} className="f-tx-scroll">
            {payoutDone ? (
              <div style={{ textAlign:'center', padding:'40px 0', animation:'fPop .4s ease-out' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
                <h3 style={{ fontSize:18, fontWeight:700, color:'#34d399', margin:'0 0 8px 0' }}>Withdrawal Requested!</h3>
                <p style={{ fontSize:13, color:'#52525b', margin:0, lineHeight:1.6 }}>We'll send the money and mark it as paid. Your wallet will be debited once confirmed.</p>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'12px 16px', marginBottom:18 }}>
                  <span style={{ fontSize:13, color:'#52525b', fontWeight:500 }}>Available to withdraw</span>
                  <span style={{ fontSize:15, fontWeight:800, color:'#34d399' }}>₹{balance.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ background:'rgba(59,130,246,0.05)', border:'1px solid rgba(59,130,246,0.12)', borderRadius:12, padding:'12px 16px', marginBottom:18 }}>
                  <p style={{ fontSize:12, color:'#60a5fa', margin:0, lineHeight:1.7 }}>
                    ℹ️ <strong>How it works:</strong> Submit request → Admin sends money manually → Admin marks as paid → Your wallet is debited.
                  </p>
                </div>

                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#52525b', marginBottom:8 }}>Payout Method</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                  {[{val:'upi' as const, label:'📱 UPI', sub:'Instant transfer'}, {val:'bank_transfer' as const, label:'🏦 Bank Transfer', sub:'1–3 business days'}].map(opt => (
                    <button key={opt.val} onClick={() => { setPayoutMethod(opt.val); setPayoutDetail('') }}
                      style={{ padding:'12px 16px', borderRadius:13, cursor:'pointer', transition:'all .2s ease', fontFamily:'inherit', textAlign:'left',
                        ...(payoutMethod === opt.val
                          ? { background:'rgba(239,68,68,0.1)', border:'1.5px solid rgba(239,68,68,0.3)', color:'#f87171' }
                          : { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', color:'#71717a' }
                        ) }}>
                      <p style={{ fontSize:13, fontWeight:700, margin:0 }}>{opt.label}</p>
                      <p style={{ fontSize:10, margin:'2px 0 0 0', opacity:.7 }}>{opt.sub}</p>
                    </button>
                  ))}
                </div>

                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#52525b', marginBottom:8 }}>Amount (₹)</label>
                <input type="number" placeholder="Min ₹100" value={payoutAmt} onChange={e => setPayoutAmt(e.target.value)} className="f-input"
                  style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:13, padding:'14px 16px', color:'#fff', fontSize:20, fontWeight:800, fontFamily:'inherit', boxSizing:'border-box', marginBottom:12, transition:'all .2s ease' }} />

                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:16 }}>
                  {[500,1000,2000,5000].filter(a => a <= balance).map(amt => (
                    <button key={amt} onClick={() => setPayoutAmt(String(amt))}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.08)'; e.currentTarget.style.color='#f87171' }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.color='#71717a' }}
                      style={{ padding:'8px 0', borderRadius:9, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', color:'#71717a', fontSize:11, fontWeight:700, cursor:'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#52525b', marginBottom:8 }}>
                  {payoutMethod === 'upi' ? 'Your UPI ID' : 'Bank Account Details'}
                </label>
                <input placeholder={payoutMethod === 'upi' ? 'yourname@upi' : 'Account No · IFSC · Bank Name'}
                  value={payoutDetail} onChange={e => setPayoutDetail(e.target.value)} className="f-input"
                  style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:13, padding:'13px 16px', color:'#fff', fontSize:14, fontFamily:'inherit', boxSizing:'border-box', marginBottom: payoutError ? 10 : 18, transition:'all .2s ease' }} />

                {payoutError && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:12, padding:'11px 14px', marginBottom:14, fontSize:13, color:'#f87171' }}>
                    ⚠️ {payoutError}
                  </div>
                )}

                <p style={{ fontSize:11, color:'#3f3f46', margin:'0 0 16px 0', lineHeight:1.6 }}>
                  💡 Your wallet will only be debited after admin confirms the payment. Minimum ₹100.
                </p>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <button onClick={() => payoutDialogRef.current?.close()}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#a1a1aa' }}
                    style={{ padding:14, borderRadius:13, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#a1a1aa', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>Cancel</button>
                  <button onClick={submitWithdrawal} disabled={payingOut}
                    onMouseEnter={e => { if (!payingOut) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(239,68,68,0.3)' } }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                    style={{ padding:14, borderRadius:13, background:payingOut ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#dc2626,#b91c1c)', border:'none', color:payingOut ? '#52525b' : '#fff', fontSize:14, fontWeight:700, cursor:payingOut ? 'not-allowed' : 'pointer', transition:'all .3s ease', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                    {payingOut ? <><Loader2 size={14} style={{ animation:'fSpin 1s linear infinite' }} /> Submitting...</> : '🏦 Request Withdrawal'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </dialog>
    </FanLayout>
  )
}