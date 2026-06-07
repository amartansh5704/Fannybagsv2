'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, Send, Paperclip, X, Image as ImageIcon, FileText, Music, Video, Download, ArrowLeft } from 'lucide-react'

// ── Parse file metadata embedded in message content ──────────────────────────
function parseMessage(content: string): {
  text: string
  file: { url: string; type: string; name: string } | null
} {
  const marker = '__FILE__'
  const idx    = content.indexOf(marker)
  if (idx === -1) return { text: content, file: null }

  const text = content.slice(0, idx).trim()
  try {
    const file = JSON.parse(content.slice(idx + marker.length))
    return { text, file }
  } catch {
    return { text: content, file: null }
  }
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image'))  return <ImageIcon size={14} />
  if (type.startsWith('audio'))  return <Music size={14} />
  if (type.startsWith('video'))  return <Video size={14} />
  return <FileText size={14} />
}

export default function DealChatPage() {
  const { data: session, status } = useSession()
  const router  = useRouter()
  const params  = useParams()
  const dealId  = params.dealId as string

  const bottomRef    = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [chat, setChat]           = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [message, setMessage]     = useState('')
  const [sending, setSending]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pendingFile, setPendingFile] = useState<{ url: string; type: string; name: string } | null>(null)
  const [lightbox, setLightbox]   = useState<string | null>(null)

  const fetchChat = async () => {
    const res  = await fetch(`/api/chat/${dealId}`)
    const json = await res.json()
    if (json.success) setChat(json.data)
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/'); return }

    fetchChat().finally(() => setLoading(false))
    const interval = setInterval(fetchChat, 3000)
    return () => clearInterval(interval)
  }, [session, status])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages?.length])

  // ── File upload ────────────────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (file.size > 100 * 1024 * 1024) {
      alert('File must be under 100MB')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res  = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()

      if (!json.success) throw new Error(json.error || 'Upload failed')

      setPendingFile({ url: json.url, type: file.type, name: file.name })
    } catch (err: any) {
      alert(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!message.trim() && !pendingFile) return
    setSending(true)

    try {
      await fetch(`/api/chat/${dealId}/message`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content:  message.trim() || '',
          fileUrl:  pendingFile?.url  || null,
          fileType: pendingFile?.type || null,
          fileName: pendingFile?.name || null,
        }),
      })

      setMessage('')
      setPendingFile(null)
      await fetchChat()
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#06060a' }}>
        <style>{`@keyframes chatSpin{to{transform:rotate(360deg)}}`}</style>
        <Loader2 style={{ animation:'chatSpin 1s linear infinite', color:'#a78bfa', width:32, height:32 }} />
        <p style={{ marginTop:14, color:'#52525b', fontSize:13 }}>Loading chat...</p>
      </div>
    )
  }

  const myId = session?.user?.id

  return (
    <>
      <style>{`
        @keyframes chatSpin      { to { transform: rotate(360deg); } }
        @keyframes chatFadeIn    { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes chatGradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes chatPulseDot  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes chatLightbox  { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }

        .chat-input::placeholder { color:#3f3f46; }
        .chat-input:focus        { outline:none; border-color:rgba(139,92,246,0.4); box-shadow:0 0 0 3px rgba(139,92,246,0.08); }

        .chat-msg-scroll::-webkit-scrollbar       { width:5px; }
        .chat-msg-scroll::-webkit-scrollbar-track { background:transparent; }
        .chat-msg-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.06); border-radius:3px; }

        .chat-file-hover:hover { opacity:.85; }
      `}</style>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.92)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'zoom-out', animation:'chatLightbox .2s ease-out' }}
        >
          <img src={lightbox} alt="" style={{ maxWidth:'90vw', maxHeight:'90vh', objectFit:'contain', borderRadius:14 }} />
          <button onClick={() => setLightbox(null)}
            style={{ position:'fixed', top:20, right:20, width:40, height:40, borderRadius:10, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit' }}>✕</button>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#06060a', color:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', position:'relative', overflow:'hidden' }}>

        {/* Ambient bg */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-60px', right:'-40px', width:'400px', height:'400px', background:'radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:'350px', height:'350px', background:'radial-gradient(circle,rgba(236,72,153,0.04) 0%,transparent 70%)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ position:'relative', zIndex:2, borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', padding:'16px 20px', display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
          <button
            onClick={() => router.back()}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#71717a' }}
            style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#71717a', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', fontFamily:'inherit', flexShrink:0 }}
          >
            <ArrowLeft size={16} />
          </button>

          {/* Avatar */}
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#7c3aed,#db2777)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:800 }}>
              {chat?.deal?.khapeetar?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div style={{ position:'absolute', bottom:-1, right:-1, width:11, height:11, background:'#10b981', borderRadius:'50%', border:'2px solid #06060a' }} />
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {chat?.deal?.khapeetar?.name ?? 'Deal Chat'}
            </p>
            <p style={{ fontSize:11, color:'#52525b', margin:'2px 0 0 0', fontWeight:500 }}>
              {chat?.deal?.projectTitle ?? 'Project discussion'}
            </p>
          </div>

          {/* Live indicator */}
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.12)', borderRadius:999, flexShrink:0 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#34d399', animation:'chatPulseDot 2s ease-in-out infinite' }} />
            <span style={{ fontSize:11, fontWeight:600, color:'#34d399' }}>Live</span>
          </div>
        </div>

        {/* ── Messages ────────────────────────────────────────────────────── */}
        <div
          className="chat-msg-scroll"
          style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:12, position:'relative', zIndex:1 }}
        >
          {(!chat?.messages || chat.messages.length === 0) && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, padding:'60px 0', gap:12 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>💬</div>
              <p style={{ color:'#52525b', fontSize:15, fontWeight:600, margin:0 }}>No messages yet</p>
              <p style={{ color:'#3f3f46', fontSize:13, margin:0 }}>Start the conversation below</p>
            </div>
          )}

          {chat?.messages?.map((msg: any, idx: number) => {
            const mine     = msg.sender?.id === myId
            const { text, file } = parseMessage(msg.content)
            const isImg    = file?.type?.startsWith('image')
            const isAudio  = file?.type?.startsWith('audio')
            const isVideo  = file?.type?.startsWith('video')
            const prevMsg  = chat.messages[idx - 1]
            const showName = !prevMsg || prevMsg.sender?.id !== msg.sender?.id

            return (
              <div
                key={msg.id}
                style={{ display:'flex', flexDirection:'column', alignItems: mine ? 'flex-end' : 'flex-start', animation:'chatFadeIn .25s ease-out' }}
              >
                {/* Sender name */}
                {showName && (
                  <p style={{ fontSize:10, fontWeight:700, color:'#52525b', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 4px 6px' }}>
                    {mine ? 'You' : (msg.sender?.name ?? msg.sender?.role ?? 'User')}
                  </p>
                )}

                <div style={{
                  maxWidth: '75%',
                  background: mine
                    ? 'linear-gradient(135deg,rgba(124,58,237,0.9),rgba(219,39,119,0.8))'
                    : 'rgba(255,255,255,0.06)',
                  border: mine
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '12px 16px',
                  boxShadow: mine ? '0 4px 20px rgba(124,58,237,0.25)' : 'none',
                }}>

                  {/* File attachment */}
                  {file && (
                    <div style={{ marginBottom: text ? 10 : 0 }}>
                      {isImg ? (
                        <img
                          src={file.url} alt={file.name}
                          onClick={() => setLightbox(file.url)}
                          className="chat-file-hover"
                          style={{ maxWidth:'100%', maxHeight:260, objectFit:'cover', borderRadius:10, display:'block', cursor:'zoom-in' }}
                        />
                      ) : isAudio ? (
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8, fontSize:11, color: mine ? 'rgba(255,255,255,0.7)' : '#71717a' }}>
                            <Music size={12} />{file.name}
                          </div>
                          <audio controls src={file.url} style={{ width:'100%', borderRadius:8 }} />
                        </div>
                      ) : isVideo ? (
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8, fontSize:11, color: mine ? 'rgba(255,255,255,0.7)' : '#71717a' }}>
                            <Video size={12} />{file.name}
                          </div>
                          <video controls src={file.url} style={{ width:'100%', borderRadius:8, maxHeight:200 }} />
                        </div>
                      ) : (
                        <a
                          href={file.url} target="_blank" rel="noreferrer"
                          style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background: mine ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, textDecoration:'none', color:'#fff', fontSize:13 }}
                        >
                          <FileText size={16} style={{ flexShrink:0, color: mine ? '#e9d5ff' : '#a1a1aa' }} />
                          <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:500 }}>{file.name}</span>
                          <Download size={13} style={{ flexShrink:0, color: mine ? 'rgba(255,255,255,0.5)' : '#52525b' }} />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Text */}
                  {text && (
                    <p style={{ margin:0, fontSize:14, lineHeight:1.6, color: mine ? '#fff' : '#e4e4e7', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                      {text}
                    </p>
                  )}

                  {/* Timestamp */}
                  <p style={{ margin:'6px 0 0 0', fontSize:10, color: mine ? 'rgba(255,255,255,0.4)' : '#3f3f46', textAlign: mine ? 'right' : 'left' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                  </p>
                </div>
              </div>
            )
          })}

          <div ref={bottomRef} />
        </div>

        {/* ── Pending file preview ─────────────────────────────────────────── */}
        {pendingFile && (
          <div style={{ position:'relative', zIndex:2, margin:'0 20px', padding:'10px 14px', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:14, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#c084fc', flexShrink:0 }}>
              <FileIcon type={pendingFile.type} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'#e9d5ff', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{pendingFile.name}</p>
              <p style={{ fontSize:11, color:'#7c3aed', margin:'2px 0 0 0' }}>Ready to send</p>
            </div>
            <button
              onClick={() => setPendingFile(null)}
              style={{ width:28, height:28, borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:'inherit' }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* ── Input area ──────────────────────────────────────────────────── */}
        <div style={{ position:'relative', zIndex:2, borderTop:'1px solid rgba(255,255,255,0.05)', background:'rgba(6,6,10,0.8)', backdropFilter:'blur(20px)', padding:'16px 20px', flexShrink:0 }}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.zip"
            style={{ display:'none' }}
            onChange={handleFileSelect}
          />

          <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
            {/* Attach button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(139,92,246,0.12)'; e.currentTarget.style.borderColor='rgba(139,92,246,0.3)'; e.currentTarget.style.color='#c084fc' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#52525b' }}
              style={{ width:44, height:44, borderRadius:13, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#52525b', cursor:uploading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s ease', flexShrink:0, fontFamily:'inherit', opacity:uploading ? 0.5 : 1 }}
            >
              {uploading
                ? <Loader2 size={16} style={{ animation:'chatSpin 1s linear infinite' }} />
                : <Paperclip size={16} />
              }
            </button>

            {/* Text input */}
            <textarea
              className="chat-input"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
              rows={1}
              style={{
                flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                borderRadius:13, padding:'12px 16px', color:'#fff', fontSize:14, resize:'none',
                fontFamily:'inherit', lineHeight:1.5, transition:'all .2s ease',
                maxHeight:120, overflowY:'auto', boxSizing:'border-box',
              }}
              onInput={e => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = Math.min(el.scrollHeight, 120) + 'px'
              }}
            />

            {/* Send button */}
            <button
              onClick={sendMessage}
              disabled={sending || (!message.trim() && !pendingFile)}
              onMouseEnter={e => { if (!sending) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(124,58,237,0.4)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(124,58,237,0.2)' }}
              style={{
                width:44, height:44, borderRadius:13, border:'none',
                background:(sending || (!message.trim() && !pendingFile))
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg,#7c3aed,#db2777)',
                color:(sending || (!message.trim() && !pendingFile)) ? '#3f3f46' : '#fff',
                cursor:(sending || (!message.trim() && !pendingFile)) ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .2s ease', flexShrink:0, fontFamily:'inherit',
                boxShadow:'0 2px 12px rgba(124,58,237,0.2)',
              }}
            >
              {sending
                ? <Loader2 size={16} style={{ animation:'chatSpin 1s linear infinite' }} />
                : <Send size={16} />
              }
            </button>
          </div>

          <p style={{ fontSize:10, color:'#27272a', margin:'8px 0 0 0', textAlign:'center', fontWeight:500 }}>
            Supports images, audio, video, PDF, ZIP — max 100MB
          </p>
        </div>
      </div>
    </>
  )
}