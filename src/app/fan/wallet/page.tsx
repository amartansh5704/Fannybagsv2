'use client'

import { useEffect, useState } from 'react'
import FanLayout from '@/components/fan/FanLayout'
import { Loader2 } from 'lucide-react'

export default function FanWalletPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [focused, setFocused] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [hoveredTx, setHoveredTx] = useState<string | null>(null)

  // Deposit state
  const [depositOpen, setDepositOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

  // Withdraw state
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)

  const loadWallet = async () => {
    const res = await fetch('/api/wallet')
    const data = await res.json()
    if (data.success) {
      setWallet(data.data)
    }
  }

  useEffect(() => {
    loadWallet().finally(() => setLoading(false))
  }, [])

  const deposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      alert('Enter valid amount')
      return
    }
    setDepositing(true)
    await fetch('/api/wallet/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(depositAmount) }),
    })
    setDepositAmount('')
    setDepositOpen(false)
    setDepositing(false)
    await loadWallet()
  }

  const withdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      alert('Enter valid amount')
      return
    }
    if (Number(withdrawAmount) > (wallet?.wallet?.balance || 0)) {
      alert('Insufficient balance')
      return
    }
    setWithdrawing(true)
    await fetch('/api/wallet/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(withdrawAmount) }),
    })
    setWithdrawAmount('')
    setWithdrawOpen(false)
    setWithdrawing(false)
    await loadWallet()
  }

  const balance = wallet?.wallet?.balance || 0
  const transactions = wallet?.transactions || []

  const totalDeposited = transactions
    .filter((tx: any) => tx.type === 'deposit' || tx.type === 'DEPOSIT')
    .reduce((s: number, tx: any) => s + (tx.amount || 0), 0)

  const totalWithdrawn = transactions
    .filter((tx: any) => tx.type === 'withdraw' || tx.type === 'WITHDRAW' || tx.type === 'withdrawal' || tx.type === 'WITHDRAWAL')
    .reduce((s: number, tx: any) => s + (tx.amount || 0), 0)

  const txTypeConfig: Record<string, { color: string; bg: string; border: string; label: string; emoji: string }> = {
    deposit:    { color: '#34d399', bg: 'rgba(16,185,129,0.06)',  border: 'rgba(16,185,129,0.12)', label: 'Deposit',    emoji: '💰' },
    DEPOSIT:    { color: '#34d399', bg: 'rgba(16,185,129,0.06)',  border: 'rgba(16,185,129,0.12)', label: 'Deposit',    emoji: '💰' },
    withdraw:   { color: '#f87171', bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.12)',  label: 'Withdrawal', emoji: '💸' },
    WITHDRAW:   { color: '#f87171', bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.12)',  label: 'Withdrawal', emoji: '💸' },
    withdrawal: { color: '#f87171', bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.12)',  label: 'Withdrawal', emoji: '💸' },
    WITHDRAWAL: { color: '#f87171', bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.12)',  label: 'Withdrawal', emoji: '💸' },
    investment: { color: '#c084fc', bg: 'rgba(168,85,247,0.06)',  border: 'rgba(168,85,247,0.12)', label: 'Investment', emoji: '💎' },
    INVESTMENT: { color: '#c084fc', bg: 'rgba(168,85,247,0.06)',  border: 'rgba(168,85,247,0.12)', label: 'Investment', emoji: '💎' },
    escrow:     { color: '#60a5fa', bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.12)', label: 'Escrow',     emoji: '🔒' },
    ESCROW:     { color: '#60a5fa', bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.12)', label: 'Escrow',     emoji: '🔒' },
    payout:     { color: '#fbbf24', bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.12)', label: 'Payout',     emoji: '🎉' },
    PAYOUT:     { color: '#fbbf24', bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.12)', label: 'Payout',     emoji: '🎉' },
  }
  const defaultTxConfig = { color: '#a1a1aa', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', label: 'Transaction', emoji: '📋' }

  if (loading) {
    return (
      <FanLayout>
        <style jsx global>{`
          @keyframes fwFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
          @keyframes fwSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        `}</style>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#06060a',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(236,72,153,0.12) 0%,transparent 70%)',borderRadius:'50%',animation:'fwFloatOrb 4s ease-in-out infinite'}}/>
          <Loader2 style={{animation:'fwSpin 1s linear infinite',color:'#f472b6',width:'36px',height:'36px',position:'relative',zIndex:1}}/>
          <p style={{marginTop:'16px',color:'#52525b',fontSize:'14px',position:'relative',zIndex:1}}>Loading wallet...</p>
        </div>
      </FanLayout>
    )
  }

  return (
    <FanLayout>
      <style jsx global>{`
        @keyframes fwFloatOrb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}}
        @keyframes fwFloatOrb2{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-15px) scale(1.03)}}
        @keyframes fwFloatOrb3{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(20px,25px) scale(1.03)}80%{transform:translate(-15px,-10px) scale(0.97)}}
        @keyframes fwFadeInDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fwFadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fwFadeInStagger{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fwGradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fwShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes fwPulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        @keyframes fwModalIn{from{opacity:0;transform:scale(0.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes fwBackdropIn{from{opacity:0}to{opacity:1}}
        @keyframes fwSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fwBalancePulse{0%,100%{text-shadow:0 0 20px rgba(244,114,182,0.15)}50%{text-shadow:0 0 40px rgba(244,114,182,0.3)}}
        input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type="number"]{-moz-appearance:textfield}
      `}</style>

      <div style={{
        minHeight:'100vh',background:'#06060a',color:'#ffffff',
        position:'relative',overflow:'hidden',
        fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{position:'fixed',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:0}}>
          <div style={{position:'absolute',top:'-80px',right:'-40px',width:'500px',height:'500px',background:'radial-gradient(circle,rgba(236,72,153,0.06) 0%,transparent 70%)',borderRadius:'50%',animation:'fwFloatOrb 10s ease-in-out infinite'}}/>
          <div style={{position:'absolute',top:'45%',left:'-100px',width:'420px',height:'420px',background:'radial-gradient(circle,rgba(168,85,247,0.04) 0%,transparent 70%)',borderRadius:'50%',animation:'fwFloatOrb2 13s ease-in-out infinite'}}/>
          <div style={{position:'absolute',bottom:'-60px',right:'30%',width:'320px',height:'320px',background:'radial-gradient(circle,rgba(16,185,129,0.03) 0%,transparent 70%)',borderRadius:'50%',animation:'fwFloatOrb3 16s ease-in-out infinite'}}/>
          <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,backgroundSize:'60px 60px'}}/>
        </div>

        {/* Header */}
        <div style={{
          position:'relative',zIndex:1,borderBottom:'1px solid rgba(255,255,255,0.05)',
          background:'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)',
          backdropFilter:'blur(20px)',animation:'fwFadeInDown 0.5s ease-out',
        }}>
          <div style={{padding:'28px 32px',maxWidth:'1100px',margin:'0 auto',display:'flex',alignItems:'center',gap:'14px'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'14px',background:'linear-gradient(135deg,rgba(236,72,153,0.14),rgba(168,85,247,0.10))',border:'1px solid rgba(236,72,153,0.16)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(236,72,153,0.08)',fontSize:'20px'}}>
              👛
            </div>
            <div>
              <h1 style={{fontSize:'22px',fontWeight:800,margin:0,background:'linear-gradient(135deg,#ffffff 0%,#a1a1aa 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                Fan Wallet
              </h1>
              <p style={{fontSize:'13px',color:'#52525b',margin:'2px 0 0 0',fontWeight:500}}>Manage your funds</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{position:'relative',zIndex:1,padding:'28px 32px 48px',maxWidth:'1100px',margin:'0 auto'}}>

          {/* Balance card */}
          <div style={{
            position:'relative',overflow:'hidden',
            background:'linear-gradient(135deg,rgba(236,72,153,0.08) 0%,rgba(168,85,247,0.04) 100%)',
            border:'1px solid rgba(236,72,153,0.15)',
            borderRadius:'24px',padding:'32px',marginBottom:'24px',
            animation:'fwFadeInUp 0.5s ease-out 0.1s both',
          }}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#ec4899,#a855f7,transparent)',backgroundSize:'200% 100%',animation:'fwGradientShift 4s ease-in-out infinite'}}/>
            <div style={{position:'absolute',top:'-30px',right:'-30px',width:'160px',height:'160px',background:'radial-gradient(circle,rgba(236,72,153,0.1) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none'}}/>

            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'20px'}}>
              <div>
                <p style={{fontSize:'12px',textTransform:'uppercase',letterSpacing:'0.1em',color:'#71717a',fontWeight:700,margin:'0 0 8px 0'}}>Available Balance</p>
                <p style={{
                  fontSize:'44px',fontWeight:800,color:'#f472b6',margin:0,lineHeight:1,
                  animation:'fwBalancePulse 4s ease-in-out infinite',
                  position:'relative',
                }}>
                  ₹{balance.toLocaleString('en-IN')}
                </p>
              </div>

              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                <button
                  onClick={() => setDepositOpen(true)}
                  onMouseEnter={() => setHovered('dep-btn')}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display:'inline-flex',alignItems:'center',gap:'8px',
                    padding:'12px 24px',
                    background: hovered === 'dep-btn' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#10b981,#14b8a6)',
                    border:'none',borderRadius:'14px',
                    color:'#000',fontSize:'14px',fontWeight:700,
                    cursor:'pointer',fontFamily:'inherit',
                    transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    transform: hovered === 'dep-btn' ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: hovered === 'dep-btn' ? '0 6px 28px rgba(16,185,129,0.3)' : '0 2px 12px rgba(16,185,129,0.15)',
                    overflow:'hidden',position:'relative',
                  }}
                >
                  {hovered === 'dep-btn' && <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',backgroundSize:'200% 100%',animation:'fwShimmer 1.5s linear infinite',pointerEvents:'none'}}/>}
                  <span style={{position:'relative'}}>💰 Deposit</span>
                </button>

                <button
                  onClick={() => setWithdrawOpen(true)}
                  onMouseEnter={() => setHovered('wd-btn')}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display:'inline-flex',alignItems:'center',gap:'8px',
                    padding:'12px 24px',
                    background: hovered === 'wd-btn' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                    border:`1px solid ${hovered === 'wd-btn' ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius:'14px',
                    color: hovered === 'wd-btn' ? '#f87171' : '#a1a1aa',
                    fontSize:'14px',fontWeight:600,
                    cursor:'pointer',fontFamily:'inherit',
                    transition:'all 0.3s ease',
                    transform: hovered === 'wd-btn' ? 'translateY(-1px)' : 'translateY(0)',
                  }}
                >
                  <span>💸 Withdraw</span>
                </button>
              </div>
            </div>

            {/* Mini stats */}
            <div style={{display:'flex',gap:'20px',marginTop:'24px',paddingTop:'20px',borderTop:'1px solid rgba(255,255,255,0.06)',flexWrap:'wrap'}}>
              <div>
                <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 4px 0'}}>Total Deposited</p>
                <p style={{fontSize:'16px',fontWeight:700,color:'#34d399',margin:0}}>₹{totalDeposited.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 4px 0'}}>Total Withdrawn</p>
                <p style={{fontSize:'16px',fontWeight:700,color:'#f87171',margin:0}}>₹{totalWithdrawn.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#52525b',fontWeight:700,margin:'0 0 4px 0'}}>Transactions</p>
                <p style={{fontSize:'16px',fontWeight:700,color:'#a1a1aa',margin:0}}>{transactions.length}</p>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div style={{
            background:'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
            border:'1px solid rgba(255,255,255,0.06)',
            borderRadius:'24px',padding:'24px',
            animation:'fwFadeInUp 0.5s ease-out 0.2s both',
          }}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'34px',height:'34px',borderRadius:'10px',background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>📋</div>
                <h3 style={{fontSize:'16px',fontWeight:700,color:'#fff',margin:0}}>Transaction History</h3>
              </div>
              <span style={{fontSize:'12px',color:'#3f3f46',fontWeight:600,padding:'4px 10px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.04)',borderRadius:'8px'}}>
                {transactions.length} record{transactions.length !== 1 ? 's' : ''}
              </span>
            </div>

            {transactions.length === 0 ? (
              <div style={{textAlign:'center',padding:'48px 0'}}>
                <p style={{fontSize:'28px',marginBottom:'8px'}}>📭</p>
                <p style={{fontSize:'14px',color:'#3f3f46',fontWeight:500,margin:0}}>No transactions yet</p>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {transactions.map((tx: any, i: number) => {
                  const config = txTypeConfig[tx.type] || defaultTxConfig
                  const isH = hoveredTx === tx.id
                  const isCredit = tx.type?.toLowerCase() === 'deposit' || tx.type?.toLowerCase() === 'payout'

                  return (
                    <div
                      key={tx.id || i}
                      onMouseEnter={() => setHoveredTx(tx.id)}
                      onMouseLeave={() => setHoveredTx(null)}
                      style={{
                        display:'flex',alignItems:'center',justifyContent:'space-between',
                        padding:'16px 18px',borderRadius:'16px',
                        background: isH ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                        border:`1px solid ${isH ? config.border : 'rgba(255,255,255,0.03)'}`,
                        transition:'all 0.25s ease',
                        transform: isH ? 'translateX(4px)' : 'translateX(0)',
                        animation:`fwFadeInStagger 0.4s ease-out ${0.3 + i * 0.04}s both`,
                      }}
                    >
                      <div style={{display:'flex',alignItems:'center',gap:'14px',flex:1,minWidth:0}}>
                        <div style={{
                          width:'40px',height:'40px',borderRadius:'12px',
                          background:config.bg,border:`1px solid ${config.border}`,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:'16px',flexShrink:0,
                        }}>{config.emoji}</div>
                        <div style={{minWidth:0}}>
                          <p style={{fontSize:'14px',fontWeight:600,color:'#fff',margin:'0 0 2px 0'}}>{config.label}</p>
                          {tx.createdAt && (
                            <p style={{fontSize:'11px',color:'#3f3f46',margin:0,fontWeight:500}}>
                              {new Date(tx.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
                            </p>
                          )}
                        </div>
                      </div>

                      <span style={{
                        fontSize:'15px',fontWeight:700,flexShrink:0,marginLeft:'12px',
                        color: isCredit ? '#34d399' : config.color,
                      }}>
                        {isCredit ? '+' : '-'}₹{(tx.amount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* DEPOSIT MODAL */}
        {depositOpen && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setDepositOpen(false) }}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(12px)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',animation:'fwBackdropIn 0.2s ease-out'}}
          >
            <div style={{width:'100%',maxWidth:'440px',background:'#0f0f14',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'24px',overflow:'hidden',boxShadow:'0 25px 80px rgba(0,0,0,0.6),0 0 60px rgba(16,185,129,0.05)',animation:'fwModalIn 0.3s ease-out'}}>
              <div style={{padding:'24px 28px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>💰</div>
                  <div>
                    <h2 style={{fontSize:'18px',fontWeight:700,color:'#fff',margin:0}}>Add Funds</h2>
                    <p style={{fontSize:'12px',color:'#52525b',margin:'2px 0 0 0'}}>Deposit to your wallet</p>
                  </div>
                </div>
                <button onClick={() => setDepositOpen(false)} onMouseEnter={() => setHovered('dep-close')} onMouseLeave={() => setHovered(null)} style={{width:'36px',height:'36px',borderRadius:'10px',background:hovered==='dep-close'?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:hovered==='dep-close'?'#fff':'#71717a',fontSize:'18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s ease',fontFamily:'inherit'}}>✕</button>
              </div>
              <div style={{padding:'28px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'14px',padding:'14px 18px',marginBottom:'24px'}}>
                  <span style={{fontSize:'13px',color:'#52525b',fontWeight:500}}>Current Balance</span>
                  <span style={{fontSize:'15px',fontWeight:800,color:'#34d399'}}>₹{balance.toLocaleString('en-IN')}</span>
                </div>
                <label style={{display:'block',fontSize:'11px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:focused==='dep-amt'?'#34d399':'#52525b',marginBottom:'8px',transition:'color 0.3s ease'}}>Amount (₹)</label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:'16px',top:'50%',transform:'translateY(-50%)',color:'#52525b',fontSize:'16px',fontWeight:600}}>₹</span>
                  <input type="number" placeholder="0" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} onFocus={() => setFocused('dep-amt')} onBlur={() => setFocused(null)} style={{width:'100%',background:focused==='dep-amt'?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.03)',border:`1px solid ${focused==='dep-amt'?'rgba(16,185,129,0.5)':'rgba(255,255,255,0.07)'}`,borderRadius:'14px',padding:'16px 18px 16px 38px',color:'#fff',fontSize:'20px',fontWeight:800,outline:'none',transition:'all 0.3s ease',fontFamily:'inherit',boxSizing:'border-box' as const,boxShadow:focused==='dep-amt'?'0 0 0 3px rgba(16,185,129,0.08)':'none',marginBottom:'16px'}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'24px'}}>
                  {[500,1000,2000,5000].map(amt => (
                    <button key={amt} onClick={() => setDepositAmount(String(amt))} onMouseEnter={() => setHovered(`dqa-${amt}`)} onMouseLeave={() => setHovered(null)} style={{padding:'10px',borderRadius:'10px',background:hovered===`dqa-${amt}`?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.03)',border:`1px solid ${hovered===`dqa-${amt}`?'rgba(255,255,255,0.14)':'rgba(255,255,255,0.06)'}`,color:hovered===`dqa-${amt}`?'#fff':'#71717a',fontSize:'12px',fontWeight:600,cursor:'pointer',transition:'all 0.2s ease',fontFamily:'inherit'}}>₹{amt.toLocaleString('en-IN')}</button>
                  ))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                  <button onClick={() => setDepositOpen(false)} onMouseEnter={() => setHovered('dep-cancel')} onMouseLeave={() => setHovered(null)} style={{padding:'16px',borderRadius:'14px',background:hovered==='dep-cancel'?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.04)',border:`1px solid ${hovered==='dep-cancel'?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.08)'}`,color:hovered==='dep-cancel'?'#fff':'#a1a1aa',fontSize:'14px',fontWeight:600,cursor:'pointer',transition:'all 0.2s ease',fontFamily:'inherit'}}>Cancel</button>
                  <button onClick={deposit} disabled={depositing} onMouseEnter={() => setHovered('dep-confirm')} onMouseLeave={() => setHovered(null)} style={{position:'relative',padding:'16px',borderRadius:'14px',background:depositing?'rgba(255,255,255,0.03)':'linear-gradient(135deg,#10b981,#14b8a6)',border:'none',color:depositing?'#52525b':'#000',fontSize:'14px',fontWeight:700,cursor:depositing?'not-allowed':'pointer',transition:'all 0.3s ease',fontFamily:'inherit',transform:hovered==='dep-confirm'&&!depositing?'translateY(-1px)':'translateY(0)',boxShadow:hovered==='dep-confirm'&&!depositing?'0 6px 28px rgba(16,185,129,0.35)':'none',opacity:depositing?0.4:1,overflow:'hidden'}}>
                    {hovered==='dep-confirm'&&!depositing&&<div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',backgroundSize:'200% 100%',animation:'fwShimmer 1.5s linear infinite',pointerEvents:'none'}}/>}
                    {depositing?<span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',position:'relative'}}><div style={{width:'15px',height:'15px',border:'2px solid rgba(0,0,0,0.2)',borderTopColor:'#000',borderRadius:'50%',animation:'fwSpin 0.8s linear infinite'}}/>Processing...</span>:<span style={{position:'relative'}}>💰 Deposit</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WITHDRAW MODAL */}
        {withdrawOpen && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setWithdrawOpen(false) }}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(12px)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',animation:'fwBackdropIn 0.2s ease-out'}}
          >
            <div style={{width:'100%',maxWidth:'440px',background:'#0f0f14',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'24px',overflow:'hidden',boxShadow:'0 25px 80px rgba(0,0,0,0.6),0 0 60px rgba(239,68,68,0.05)',animation:'fwModalIn 0.3s ease-out'}}>
              <div style={{padding:'24px 28px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                  <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>💸</div>
                  <div>
                    <h2 style={{fontSize:'18px',fontWeight:700,color:'#fff',margin:0}}>Withdraw Funds</h2>
                    <p style={{fontSize:'12px',color:'#52525b',margin:'2px 0 0 0'}}>Transfer to your bank account</p>
                  </div>
                </div>
                <button onClick={() => setWithdrawOpen(false)} onMouseEnter={() => setHovered('wd-close')} onMouseLeave={() => setHovered(null)} style={{width:'36px',height:'36px',borderRadius:'10px',background:hovered==='wd-close'?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:hovered==='wd-close'?'#fff':'#71717a',fontSize:'18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s ease',fontFamily:'inherit'}}>✕</button>
              </div>
              <div style={{padding:'28px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.12)',borderRadius:'14px',padding:'14px 18px',marginBottom:'24px'}}>
                  <span style={{fontSize:'13px',color:'#34d399',fontWeight:600}}>Available Balance</span>
                  <span style={{fontSize:'15px',fontWeight:800,color:'#34d399'}}>₹{balance.toLocaleString('en-IN')}</span>
                </div>
                <label style={{display:'block',fontSize:'11px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:focused==='wd-amt'?'#f87171':'#52525b',marginBottom:'8px',transition:'color 0.3s ease'}}>Withdraw Amount (₹)</label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:'16px',top:'50%',transform:'translateY(-50%)',color:'#52525b',fontSize:'16px',fontWeight:600}}>₹</span>
                  <input type="number" placeholder="0" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} onFocus={() => setFocused('wd-amt')} onBlur={() => setFocused(null)} style={{width:'100%',background:focused==='wd-amt'?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.03)',border:`1px solid ${focused==='wd-amt'?'rgba(239,68,68,0.5)':'rgba(255,255,255,0.07)'}`,borderRadius:'14px',padding:'16px 18px 16px 38px',color:'#fff',fontSize:'20px',fontWeight:800,outline:'none',transition:'all 0.3s ease',fontFamily:'inherit',boxSizing:'border-box' as const,boxShadow:focused==='wd-amt'?'0 0 0 3px rgba(239,68,68,0.08)':'none',marginBottom:'12px'}}/>
                </div>

                {/* Max button */}
                <button
                  onClick={() => setWithdrawAmount(String(balance))}
                  onMouseEnter={() => setHovered('wd-max')}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display:'inline-flex',alignItems:'center',gap:'4px',
                    padding:'6px 12px',marginBottom:'20px',
                    background:hovered==='wd-max'?'rgba(239,68,68,0.08)':'rgba(255,255,255,0.03)',
                    border:`1px solid ${hovered==='wd-max'?'rgba(239,68,68,0.2)':'rgba(255,255,255,0.06)'}`,
                    borderRadius:'8px',color:hovered==='wd-max'?'#f87171':'#52525b',
                    fontSize:'11px',fontWeight:700,cursor:'pointer',
                    transition:'all 0.2s ease',fontFamily:'inherit',
                    textTransform:'uppercase',letterSpacing:'0.08em',
                  }}
                >Withdraw Max</button>

                {/* Insufficient warning */}
                {Number(withdrawAmount) > balance && Number(withdrawAmount) > 0 && (
                  <div style={{display:'flex',alignItems:'center',gap:'10px',background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:'14px',padding:'14px 16px',marginBottom:'16px'}}>
                    <span style={{fontSize:'14px'}}>⚠️</span>
                    <p style={{fontSize:'13px',color:'#f87171',margin:0,fontWeight:500}}>Amount exceeds available balance</p>
                  </div>
                )}

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                  <button onClick={() => setWithdrawOpen(false)} onMouseEnter={() => setHovered('wd-cancel')} onMouseLeave={() => setHovered(null)} style={{padding:'16px',borderRadius:'14px',background:hovered==='wd-cancel'?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.04)',border:`1px solid ${hovered==='wd-cancel'?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.08)'}`,color:hovered==='wd-cancel'?'#fff':'#a1a1aa',fontSize:'14px',fontWeight:600,cursor:'pointer',transition:'all 0.2s ease',fontFamily:'inherit'}}>Cancel</button>
                  <button
                    onClick={withdraw}
                    disabled={withdrawing || Number(withdrawAmount) > balance || Number(withdrawAmount) <= 0}
                    onMouseEnter={() => setHovered('wd-confirm')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      position:'relative',padding:'16px',borderRadius:'14px',
                      background:(withdrawing || Number(withdrawAmount) > balance || Number(withdrawAmount) <= 0)?'rgba(255,255,255,0.03)':'linear-gradient(135deg,#ef4444,#dc2626)',
                      border:'none',
                      color:(withdrawing || Number(withdrawAmount) > balance || Number(withdrawAmount) <= 0)?'#3f3f46':'#fff',
                      fontSize:'14px',fontWeight:700,
                      cursor:(withdrawing || Number(withdrawAmount) > balance || Number(withdrawAmount) <= 0)?'not-allowed':'pointer',
                      transition:'all 0.3s ease',fontFamily:'inherit',
                      transform:hovered==='wd-confirm'&&!(withdrawing || Number(withdrawAmount) > balance || Number(withdrawAmount) <= 0)?'translateY(-1px)':'translateY(0)',
                      boxShadow:hovered==='wd-confirm'&&!(withdrawing || Number(withdrawAmount) > balance || Number(withdrawAmount) <= 0)?'0 6px 28px rgba(239,68,68,0.35)':'none',
                      opacity:(withdrawing || Number(withdrawAmount) > balance || Number(withdrawAmount) <= 0)?0.4:1,
                      overflow:'hidden',
                    }}
                  >
                    {hovered==='wd-confirm'&&!(withdrawing || Number(withdrawAmount) > balance || Number(withdrawAmount) <= 0)&&<div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)',backgroundSize:'200% 100%',animation:'fwShimmer 1.5s linear infinite',pointerEvents:'none'}}/>}
                    {withdrawing?<span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',position:'relative'}}><div style={{width:'15px',height:'15px',border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'#fff',borderRadius:'50%',animation:'fwSpin 0.8s linear infinite'}}/>Processing...</span>:<span style={{position:'relative'}}>💸 Withdraw</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FanLayout>
  )
}