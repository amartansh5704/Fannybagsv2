'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2, RefreshCw, CheckCircle, XCircle } from 'lucide-react'

const STATUS = {
  pending:  { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  label: 'Pending' },
  paid:     { color: '#34d399', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  label: 'Paid' },
  rejected: { color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   label: 'Rejected' },
}

export default function AdminWithdrawalsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [requests, setRequests]   = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [refreshing, setRefresh]  = useState(false)
  const [filter, setFilter]       = useState<'all' | 'pending' | 'paid' | 'rejected'>('pending')
  const [processing, setProc]     = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [rejectId, setRejectId]   = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'admin') { router.push('/'); return }
    load()
  }, [session, status])

  const load = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefresh(true)
    const res  = await fetch('/api/admin/withdrawal-requests')
    const json = await res.json()
    if (json.success) setRequests(json.data)
    setLoading(false)
    setRefresh(false)
  }

  const markPaid = async (id: string) => {
    setProc(id)
    const res  = await fetch(`/api/admin/withdrawal-requests/${id}/pay`, { method: 'POST' })
    const json = await res.json()
    if (json.success) await load(true)
    else alert(json.error || 'Failed')
    setProc(null)
  }

  const reject = async (id: string) => {
    setProc(id)
    const res  = await fetch(`/api/admin/withdrawal-requests/${id}/reject`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: rejectNote || 'Rejected by admin' }),
    })
    const json = await res.json()
    if (json.success) { setRejectId(null); setRejectNote(''); await load(true) }
    else alert(json.error || 'Failed')
    setProc(null)
  }

  const filtered = requests.filter(r => filter === 'all' || r.status === filter)
  const pending  = requests.filter(r => r.status === 'pending').length

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <Loader2 style={{ animation:'spin 1s linear infinite', color:'#f87171', width:32, height:32 }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes wdSpin     { to { transform: rotate(360deg); } }
        @keyframes wdFadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wdPulseDot { 0%,100%{opacity:1} 50%{opacity:.3} }
        .wd-input::placeholder { color:#3f3f46; }
        .wd-input:focus { outline:none; border-color:rgba(239,68,68,0.4); box-shadow:0 0 0 3px rgba(239,68,68,0.08); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#06060a', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Header */}
        <div style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', padding:'22px 32px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,rgba(239,68,68,0.14),rgba(249,115,22,0.1))', border:'1px solid rgba(239,68,68,0.16)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🏦</div>
              <div>
                <h1 style={{ fontSize:22, fontWeight:800, margin:0, background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Withdrawal Requests</h1>
                <p style={{ fontSize:13, color:'#52525b', margin:'2px 0 0 0', fontWeight:500 }}>Review, pay, and manage artist withdrawals</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              {pending > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:10 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#fbbf24', animation:'wdPulseDot 1.5s ease-in-out infinite' }} />
                  <span style={{ fontSize:12, fontWeight:700, color:'#fbbf24' }}>{pending} pending</span>
                </div>
              )}
              <button onClick={() => load(true)} disabled={refreshing}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.color='#52525b' }}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, color:'#52525b', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>
                <RefreshCw size={13} style={{ animation: refreshing ? 'wdSpin 1s linear infinite' : 'none' }} /> Refresh
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 32px 60px' }}>

          {/* Filter tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:24 }}>
            {(['all','pending','paid','rejected'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding:'7px 16px', borderRadius:999, fontSize:12, fontWeight:700, cursor:'pointer', border:'1px solid', transition:'all .2s ease', fontFamily:'inherit', textTransform:'capitalize',
                  ...(filter === f
                    ? { background:'rgba(239,68,68,0.1)', borderColor:'rgba(239,68,68,0.3)', color:'#f87171' }
                    : { background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)', color:'#52525b' }
                  ) }}>
                {f === 'all' ? `All (${requests.length})` : `${f.charAt(0).toUpperCase()+f.slice(1)} (${requests.filter(r=>r.status===f).length})`}
              </button>
            ))}
          </div>

          {/* Instructions banner */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 18px', background:'rgba(59,130,246,0.05)', border:'1px solid rgba(59,130,246,0.12)', borderRadius:14, marginBottom:24 }}>
            <span style={{ fontSize:18 }}>ℹ️</span>
            <p style={{ fontSize:13, color:'#60a5fa', margin:0, lineHeight:1.7 }}>
              <strong>Workflow:</strong> Review the request → Send money manually via your bank/UPI app to the user's account → Click <strong>"Mark as Paid"</strong>. The user's wallet will be debited automatically when you mark it as paid.
            </p>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 0', gap:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:20 }}>
              <span style={{ fontSize:36 }}>📭</span>
              <p style={{ color:'#52525b', fontSize:15, fontWeight:600, margin:0 }}>No {filter} withdrawal requests</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {filtered.map((req, idx) => {
                const s        = STATUS[req.status as keyof typeof STATUS] ?? STATUS.pending
                const isProc   = processing === req.id
                const isReject = rejectId === req.id

                return (
                  <div key={req.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden', animation:`wdFadeInUp .35s ease-out ${idx * 0.04}s both` }}>

                    <div style={{ padding:'20px 24px', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>

                      {/* Status icon */}
                      <div style={{ width:46, height:46, borderRadius:13, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                        {req.status === 'pending' ? '⏳' : req.status === 'paid' ? '✅' : '❌'}
                      </div>

                      {/* User */}
                      <div style={{ flex:1, minWidth:160 }}>
                        <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>{req.user?.name}</p>
                        <p style={{ fontSize:12, color:'#52525b', margin:'2px 0 0 0' }}>{req.user?.email}</p>
                      </div>

                      {/* Amount */}
                      <div style={{ textAlign:'center', minWidth:90 }}>
                        <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 3px 0' }}>Amount</p>
                        <p style={{ fontSize:20, fontWeight:800, color:'#f87171', margin:0 }}>₹{req.amount.toLocaleString('en-IN')}</p>
                      </div>

                      {/* Send to */}
                      <div style={{ minWidth:180 }}>
                        <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 3px 0' }}>Send To</p>
                        <p style={{ fontSize:13, fontWeight:700, color:'#fff', margin:0 }}>
                          {req.method === 'upi' ? '📱' : '🏦'} {req.detail}
                        </p>
                        <p style={{ fontSize:11, color:'#52525b', margin:'2px 0 0 0', textTransform:'capitalize' }}>{req.method.replace('_',' ')}</p>
                      </div>

                      {/* Date */}
                      <div style={{ minWidth:100 }}>
                        <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 3px 0' }}>Requested</p>
                        <p style={{ fontSize:12, color:'#71717a', margin:0 }}>{new Date(req.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                        <p style={{ fontSize:10, color:'#3f3f46', margin:'1px 0 0 0' }}>{new Date(req.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</p>
                      </div>

                      {/* Status badge */}
                      <div style={{ padding:'5px 14px', borderRadius:999, background:s.bg, border:`1px solid ${s.border}`, fontSize:11, fontWeight:700, color:s.color }}>
                        {s.label}
                      </div>

                      {/* Actions */}
                      {req.status === 'pending' && (
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={() => markPaid(req.id)} disabled={isProc}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(16,185,129,0.15)'; e.currentTarget.style.transform='translateY(-1px)' }}
                            onMouseLeave={e => { e.currentTarget.style.background='rgba(16,185,129,0.08)'; e.currentTarget.style.transform='translateY(0)' }}
                            style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10, color:'#34d399', fontSize:13, fontWeight:700, cursor:isProc ? 'not-allowed' : 'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>
                            {isProc ? <Loader2 size={13} style={{ animation:'wdSpin 1s linear infinite' }} /> : <CheckCircle size={13} />}
                            Mark as Paid
                          </button>
                          <button onClick={() => setRejectId(req.id)} disabled={isProc}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.12)'; e.currentTarget.style.transform='translateY(-1px)' }}
                            onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.07)'; e.currentTarget.style.transform='translateY(0)' }}
                            style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.18)', borderRadius:10, color:'#f87171', fontSize:13, fontWeight:700, cursor:isProc ? 'not-allowed' : 'pointer', transition:'all .2s ease', fontFamily:'inherit' }}>
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      )}

                      {req.status === 'rejected' && req.note && (
                        <p style={{ fontSize:11, color:'#f87171', margin:0 }}>Note: {req.note}</p>
                      )}
                    </div>

                    {/* Inline reject form */}
                    {isReject && (
                      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'16px 24px', background:'rgba(239,68,68,0.03)', display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                        <input placeholder="Reason for rejection (optional)" value={rejectNote}
                          onChange={e => setRejectNote(e.target.value)} className="wd-input"
                          style={{ flex:1, minWidth:200, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'10px 14px', color:'#fff', fontSize:13, fontFamily:'inherit', boxSizing:'border-box', transition:'all .2s ease' }} />
                        <button onClick={() => reject(req.id)} disabled={isProc}
                          style={{ padding:'10px 18px', borderRadius:10, background:'linear-gradient(135deg,#dc2626,#b91c1c)', border:'none', color:'#fff', fontSize:13, fontWeight:700, cursor:isProc ? 'not-allowed' : 'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6 }}>
                          {isProc ? <Loader2 size={13} style={{ animation:'wdSpin 1s linear infinite' }} /> : null}
                          Confirm Reject
                        </button>
                        <button onClick={() => { setRejectId(null); setRejectNote('') }}
                          style={{ padding:'10px 16px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#a1a1aa', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}