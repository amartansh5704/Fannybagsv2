'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import { Loader2, ArrowLeft, Send, Paperclip, X, FileText, Music, Video, Image as ImageIcon, Download } from 'lucide-react'

function parseMessage(content: string) {
  const marker = '__FILE__'
  const idx    = content.indexOf(marker)
  if (idx === -1) return { text: content, file: null }
  const text = content.slice(0, idx).trim()
  try {
    const file = JSON.parse(content.slice(idx + marker.length))
    return { text, file }
  } catch { return { text: content, file: null } }
}

export default function ArtistJobChatPage() {
  const { data: session, status } = useSession()
  const router  = useRouter()
  const params  = useParams()
  const jobId   = params.id as string

  const bottomRef    = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [chat, setChat]           = useState<any>(null)
  const [job,  setJob]            = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [message, setMessage]     = useState('')
  const [sending, setSending]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pendingFile, setPendingFile] = useState<{ url: string; type: string; name: string } | null>(null)
  const [lightbox, setLightbox]   = useState<string | null>(null)

  const fetchChat = async () => {
    const [jobRes, chatRes] = await Promise.all([
      fetch(`/api/jobs/${jobId}`).then(r => r.json()),
      fetch(`/api/jobs/${jobId}/chat`).then(r => r.json()),
    ])
    if (jobRes.success)  setJob(jobRes.data)
    if (chatRes.success) setChat(chatRes.data)
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/artist/login'); return }
    fetchChat().finally(() => setLoading(false))
    const interval = setInterval(fetchChat, 3000)
    return () => clearInterval(interval)
  }, [session, status])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages?.length])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.success) setPendingFile({ url: json.url, type: file.type, name: file.name })
      else alert('Upload failed')
    } finally { setUploading(false) }
  }

  const sendMessage = async () => {
    if (!message.trim() && !pendingFile) return
    setSending(true)
    try {
      await fetch(`/api/jobs/${jobId}/chat/message`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content:  message.trim() || '',
          fileUrl:  pendingFile?.url  || null,
          fileType: pendingFile?.type || null,
          fileName: pendingFile?.name || null,
        }),
      })
      setMessage(''); setPendingFile(null)
      await fetchChat()
    } finally { setSending(false) }
  }

  if (loading) {
    return (
      <ArtistLayout>
        <style>{`@keyframes ajcSpin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
          <Loader2 style={{ animation:'ajcSpin 1s linear infinite', color:'#a855f7', width:32, height:32 }} />
        </div>
      </ArtistLayout>
    )
  }

  const myId = session?.user?.id

  return (
    <ArtistLayout>
      <style>{`
        @keyframes ajcSpin    { to{transform:rotate(360deg)} }
        @keyframes ajcFadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ajcLightbox{ from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes ajcPulse   { 0%,100%{opacity:1} 50%{opacity:.3} }
        .ajc-input::placeholder { color:#3f3f46; }
        .ajc-input:focus { outline:none; border-color:rgba(168,85,247,0.4); box-shadow:0 0 0 3px rgba(168,85,247,0.08); }
        .ajc-scroll::-webkit-scrollbar { width:4px; }
        .ajc-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.06); border-radius:2px; }
      `}</style>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.92)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'zoom-out', animation:'ajcLightbox .2s ease-out' }}>
          <img src={lightbox} alt="" style={{ maxWidth:'90vw', maxHeight:'90vh', objectFit:'contain', borderRadius:14 }} />
          <button onClick={() => setLightbox(null)} style={{ position:'fixed', top:20, right:20, width:40, height:40, borderRadius:10, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit' }}>✕</button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.zip" style={{ display:'none' }} onChange={handleFileSelect} />

      <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#06060a', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

        {/* Header */}
        <div style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', padding:'14px 20px', display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
          <button onClick={() => router.back()}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#71717a' }}
            style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#71717a', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', fontFamily:'inherit' }}>
            <ArrowLeft size={16} />
          </button>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {job?.title ?? 'Job Chat'}
            </p>
            <p style={{ fontSize:11, color:'#52525b', margin:'1px 0 0 0' }}>
              {job?.status === 'completed' ? '✅ Completed' : '🔒 Escrow active'}
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', background:'rgba(168,85,247,0.06)', border:'1px solid rgba(168,85,247,0.12)', borderRadius:999 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#c084fc', animation:'ajcPulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize:11, fontWeight:600, color:'#c084fc' }}>Live</span>
          </div>
        </div>

        {/* Messages */}
        <div className="ajc-scroll" style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:12 }}>
          {(!chat?.messages || chat.messages.length === 0) && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:12 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>💬</div>
              <p style={{ color:'#52525b', fontSize:14, fontWeight:600, margin:0 }}>No messages yet</p>
            </div>
          )}

          {chat?.messages?.map((msg: any, idx: number) => {
            const mine = msg.sender?.id === myId
            const { text, file } = parseMessage(msg.content)
            const isImg   = file?.type?.startsWith('image')
            const isAudio = file?.type?.startsWith('audio')
            const isVideo = file?.type?.startsWith('video')
            const prevMsg = chat.messages[idx - 1]
            const showName = !prevMsg || prevMsg.sender?.id !== msg.sender?.id

            return (
              <div key={msg.id} style={{ display:'flex', flexDirection:'column', alignItems: mine ? 'flex-end' : 'flex-start', animation:'ajcFadeIn .2s ease-out' }}>
                {showName && (
                  <p style={{ fontSize:10, fontWeight:700, color:'#52525b', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 4px 6px' }}>
                    {mine ? 'You' : (msg.sender?.name ?? 'User')}
                  </p>
                )}
                <div style={{ maxWidth:'75%', background: mine ? 'linear-gradient(135deg,rgba(124,58,237,0.9),rgba(219,39,119,0.8))' : 'rgba(255,255,255,0.06)', border: mine ? 'none' : '1px solid rgba(255,255,255,0.08)', borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding:'12px 16px', boxShadow: mine ? '0 4px 20px rgba(124,58,237,0.25)' : 'none' }}>
                  {file && (
                    <div style={{ marginBottom: text ? 10 : 0 }}>
                      {isImg ? (
                        <img src={file.url} alt={file.name} onClick={() => setLightbox(file.url)} style={{ maxWidth:'100%', maxHeight:220, objectFit:'cover', borderRadius:10, display:'block', cursor:'zoom-in' }} />
                      ) : isAudio ? (
                        <div>
                          <p style={{ fontSize:11, color: mine ? 'rgba(255,255,255,0.7)' : '#71717a', marginBottom:6 }}><Music size={11} style={{ marginRight:4 }} />{file.name}</p>
                          <audio controls src={file.url} style={{ width:'100%', borderRadius:8 }} />
                        </div>
                      ) : isVideo ? (
                        <div>
                          <p style={{ fontSize:11, color: mine ? 'rgba(255,255,255,0.7)' : '#71717a', marginBottom:6 }}><Video size={11} style={{ marginRight:4 }} />{file.name}</p>
                          <video controls src={file.url} style={{ width:'100%', borderRadius:8, maxHeight:180 }} />
                        </div>
                      ) : (
                        <a href={file.url} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 13px', background: mine ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, textDecoration:'none', color:'#fff', fontSize:13 }}>
                          <FileText size={15} style={{ flexShrink:0 }} />
                          <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</span>
                          <Download size={13} style={{ flexShrink:0, color:'rgba(255,255,255,0.5)' }} />
                        </a>
                      )}
                    </div>
                  )}
                  {text && <p style={{ margin:0, fontSize:14, lineHeight:1.6, color: mine ? '#fff' : '#e4e4e7', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{text}</p>}
                  <p style={{ margin:'5px 0 0 0', fontSize:10, color: mine ? 'rgba(255,255,255,0.4)' : '#3f3f46', textAlign: mine ? 'right' : 'left' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Pending file preview */}
        {pendingFile && (
          <div style={{ margin:'0 20px', padding:'10px 14px', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:14, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#c084fc', flexShrink:0 }}>
              <ImageIcon size={14} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'#e9d5ff', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{pendingFile.name}</p>
              <p style={{ fontSize:11, color:'#7c3aed', margin:'2px 0 0 0' }}>Ready to send</p>
            </div>
            <button onClick={() => setPendingFile(null)} style={{ width:28, height:28, borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit' }}>
              <X size={13} />
            </button>
          </div>
        )}

        {/* Input */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', padding:'14px 20px', flexShrink:0 }}>
          <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(139,92,246,0.12)'; e.currentTarget.style.borderColor='rgba(139,92,246,0.3)'; e.currentTarget.style.color='#c084fc' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#52525b' }}
              style={{ width:44, height:44, borderRadius:13, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#52525b', cursor:uploading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', flexShrink:0, fontFamily:'inherit' }}>
              {uploading ? <Loader2 size={16} style={{ animation:'ajcSpin 1s linear infinite' }} /> : <Paperclip size={16} />}
            </button>

            <textarea className="ajc-input" value={message} onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Type a message… (Enter to send)"
              rows={1}
              style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:13, padding:'12px 16px', color:'#fff', fontSize:14, resize:'none', fontFamily:'inherit', lineHeight:1.5, transition:'all .2s ease', maxHeight:120, overflowY:'auto', boxSizing:'border-box' }}
              onInput={e => { const el = e.currentTarget; el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,120)+'px' }} />

            <button onClick={sendMessage} disabled={sending || (!message.trim() && !pendingFile)}
              onMouseEnter={e => { if (!sending) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(124,58,237,0.4)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(124,58,237,0.2)' }}
              style={{ width:44, height:44, borderRadius:13, border:'none', background:(sending || (!message.trim() && !pendingFile)) ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#7c3aed,#db2777)', color:(sending || (!message.trim() && !pendingFile)) ? '#3f3f46' : '#fff', cursor:(sending || (!message.trim() && !pendingFile)) ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', flexShrink:0, fontFamily:'inherit', boxShadow:'0 2px 12px rgba(124,58,237,0.2)' }}>
              {sending ? <Loader2 size={16} style={{ animation:'ajcSpin 1s linear infinite' }} /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    </ArtistLayout>
  )
}