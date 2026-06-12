'use client'

import { useRef, useState } from 'react'
import { Upload, X, Music, Image as ImageIcon, Loader2 } from 'lucide-react'
import { uploadFile } from '@/lib/upload'

interface SongDetailData {
  title: string
  language: string
  campaignEndDate: string
  demoUrl: string
  coverArtUrl: string
  demoFile: File | null
  coverArtFile: File | null
}

interface Props {
  data: SongDetailData
  onChange: (data: SongDetailData) => void
}

const LANGUAGES = [
  'Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu',
  'Bengali', 'Marathi', 'Kannada', 'Bhojpuri', 'Mixed / Hinglish',
]

const STOCK_COVERS = [
  { src: '/stock/stock1.jpg', label: 'Sher' },
  { src: '/stock/stock2.jpg', label: 'Khapeetar' },
  { src: '/stock/stock3.jpg', label: 'Mustafa' },
  { src: '/stock/stock4.jpg', label: 'Velli' },
  { src: '/stock/stock5.jpg', label: 'Shura' },
  { src: '/stock/stock6.jpg', label: 'Casty' },
]

export default function SongDetail({ data, onChange }: Props) {
  const demoInputRef  = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [demoUploading, setDemoUploading]   = useState(false)
  const [demoError,     setDemoError]       = useState('')
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverError,     setCoverError]     = useState('')

  const update = (key: keyof SongDetailData, val: unknown) =>
    onChange({ ...data, [key]: val })

  const handleDemoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setDemoUploading(true)
    setDemoError('')

    try {
      const url = await uploadFile(file)
      onChange({ ...data, demoFile: file, demoUrl: url })
    } catch (err: unknown) {
      setDemoError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setDemoUploading(false)
    }
  }

  const removeDemo = () => {
    setDemoError('')
    onChange({ ...data, demoFile: null, demoUrl: '' })
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setCoverUploading(true)
    setCoverError('')

    try {
      const url = await uploadFile(file)
      onChange({ ...data, coverArtFile: file, coverArtUrl: url })
    } catch (err: unknown) {
      setCoverError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setCoverUploading(false)
    }
  }

  const removeCover = () => {
    setCoverError('')
    onChange({ ...data, coverArtFile: null, coverArtUrl: '' })
  }

  const today   = new Date().toISOString().split('T')[0]
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .sd-wrap { color: #f0f0f8; font-family: 'DM Sans', sans-serif; }

        .sd-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.5px; margin-bottom: 4px; }
        .sd-sub { font-size: 13px; color: #333; font-weight: 300; margin-bottom: 32px; }

        .sd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 0; }
        .sd-full { grid-column: span 2; }

        .sd-field { margin-bottom: 20px; }
        .sd-label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #2a2a3a; font-weight: 500; margin-bottom: 8px; }
        .sd-req { color: #7c3aed; margin-left: 2px; }

        .sd-input, .sd-select {
          width: 100%; height: 48px;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 11px;
          color: #e0e0f0;
          padding: 0 14px;
          font-size: 13.5px;
          font-family: inherit;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .sd-input::placeholder { color: #1e1e2e; }
        .sd-input:focus, .sd-select:focus {
          border-color: rgba(124,58,237,0.5);
          background: rgba(124,58,237,0.04);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.07);
        }
        .sd-select { appearance: none; cursor: pointer; }
        .sd-select option { background: #111120; color: #e0e0f0; }
        .sd-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.3); cursor: pointer; }

        .sd-upload-zone {
          border: 1px dashed rgba(124,58,237,0.3);
          background: rgba(124,58,237,0.03);
          border-radius: 14px;
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          user-select: none;
        }
        .sd-upload-zone:hover {
          background: rgba(124,58,237,0.07);
          border-color: rgba(124,58,237,0.5);
          transform: translateY(-2px);
        }
        .sd-upload-zone:active { transform: translateY(0); }
        .sd-upload-icon { color: #7c3aed; margin-bottom: 4px; }
        .sd-upload-main { font-size: 13.5px; color: #ddd; font-weight: 500; }
        .sd-upload-sub { font-size: 11.5px; color: #2a2a3a; }
        .sd-upload-btn-hint {
          margin-top: 4px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(124,58,237,0.1);
          border: 0.5px solid rgba(124,58,237,0.2);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px;
          color: #9f7aea;
        }

        .sd-uploading-zone {
          border: 1px dashed rgba(124,58,237,0.3);
          background: rgba(124,58,237,0.03);
          border-radius: 14px;
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
        }
        .sd-uploading-text { font-size: 13px; color: #9f7aea; }

        .sd-error-box {
          margin-top: 8px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.08);
          border: 0.5px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          font-size: 12px;
          color: #f87171;
        }

        @keyframes sd-spin {
          to { transform: rotate(360deg); }
        }
        .sd-spin { animation: sd-spin 1s linear infinite; color: #7c3aed; }

        .sd-demo-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(16,185,129,0.07);
          border: 0.5px solid rgba(16,185,129,0.2);
          border-radius: 14px;
          padding: 14px 16px;
        }
        .sd-demo-left { display: flex; align-items: center; gap: 12px; }
        .sd-demo-icon-wrap {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(16,185,129,0.12);
          display: flex; align-items: center; justify-content: center;
          color: #34d399;
          flex-shrink: 0;
        }
        .sd-demo-name { font-size: 13px; font-weight: 500; color: #fff; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; }
        .sd-demo-status { font-size: 11px; color: #34d399; }
        .sd-remove-btn {
          background: none; border: none; color: #333; cursor: pointer;
          padding: 6px; border-radius: 8px; transition: all 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .sd-remove-btn:hover { color: #f87171; background: rgba(239,68,68,0.08); }

        .sd-cover-card {
          display: flex;
          gap: 16px;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 16px;
        }
        .sd-cover-img { width: 72px; height: 72px; object-fit: cover; border-radius: 10px; flex-shrink: 0; border: 0.5px solid rgba(255,255,255,0.07); }
        .sd-cover-info { flex: 1; min-width: 0; }
        .sd-cover-name { font-size: 13px; font-weight: 500; color: #fff; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sd-cover-status { font-size: 11px; color: #34d399; margin-bottom: 8px; }
        .sd-cover-remove { background: none; border: none; font-size: 11.5px; color: #f87171; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.15s; }
        .sd-cover-remove:hover { color: #fca5a5; }

        @media (max-width: 640px) {
          .sd-grid { grid-template-columns: 1fr; }
          .sd-full { grid-column: span 1; }
          .sd-cover-card { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <input
        ref={demoInputRef}
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={handleDemoUpload}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleCoverUpload}
      />

      <div className="sd-wrap">
        <div className="sd-title">Song Details</div>
        <div className="sd-sub">Basic information about your song</div>

        <div className="sd-grid">
          <div className="sd-field sd-full">
            <label className="sd-label">Song Title <span className="sd-req">*</span></label>
            <input
              type="text"
              className="sd-input"
              value={data.title}
              onChange={e => update('title', e.target.value)}
              placeholder="e.g. Raat Baaki"
            />
          </div>

          <div className="sd-field">
            <label className="sd-label">Language <span className="sd-req">*</span></label>
            <select
              className="sd-select"
              value={data.language}
              onChange={e => update('language', e.target.value)}
            >
              <option value="">Select language</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="sd-field">
            <label className="sd-label">Campaign End Date <span className="sd-req">*</span></label>
            <input
              type="date"
              className="sd-input"
              value={data.campaignEndDate}
              min={today}
              max={maxDate}
              onChange={e => update('campaignEndDate', e.target.value)}
            />
          </div>
        </div>

        {/* DEMO */}
        <div className="sd-field">
          <label className="sd-label">1-Min Demo Track <span className="sd-req">*</span></label>

          {demoUploading && (
            <div className="sd-uploading-zone">
              <Loader2 size={24} className="sd-spin" />
              <div className="sd-uploading-text">Uploading demo...</div>
            </div>
          )}

          {!demoUploading && data.demoFile && data.demoUrl && (
            <div className="sd-demo-card">
              <div className="sd-demo-left">
                <div className="sd-demo-icon-wrap">
                  <Music size={18} />
                </div>
                <div>
                  <div className="sd-demo-name">{data.demoFile.name}</div>
                  <div className="sd-demo-status">✓ Uploaded to cloud</div>
                </div>
              </div>
              <button type="button" className="sd-remove-btn" onClick={removeDemo}>
                <X size={16} />
              </button>
            </div>
          )}

          {!demoUploading && !data.demoUrl && (
            <div
              className="sd-upload-zone"
              onClick={() => demoInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && demoInputRef.current?.click()}
            >
              <Upload size={22} className="sd-upload-icon" />
              <div className="sd-upload-main">Upload demo track</div>
              <div className="sd-upload-sub">MP3, WAV, FLAC — max 20MB</div>
              <span className="sd-upload-btn-hint">Click to browse files</span>
            </div>
          )}

          <p style={{ fontSize:11, color:'#52525b', marginTop:8, lineHeight:1.6 }}>
            File too large?{' '}
            <a
              href="https://www.freeconvert.com/wav-compressor"
              target="_blank"
              rel="noreferrer"
              style={{ color:'#c084fc', textDecoration:'none', fontWeight:700 }}
            >
              Compress audio free here ↗
            </a>
          </p>

          {demoError && (
            <div className="sd-error-box">⚠ {demoError} — please try again</div>
          )}
        </div>

        {/* COVER ART */}
        <div className="sd-field">
          <label className="sd-label">Cover Art <span className="sd-req">*</span></label>

          {coverUploading && (
            <div className="sd-uploading-zone">
              <Loader2 size={24} className="sd-spin" />
              <div className="sd-uploading-text">Uploading cover art...</div>
            </div>
          )}

          {/* ── Cover preview — works for both uploaded and stock ──────────── */}
          {!coverUploading && data.coverArtUrl && (
            <div className="sd-cover-card">
              <img src={data.coverArtUrl} alt="cover" className="sd-cover-img" />
              <div className="sd-cover-info">
                <div className="sd-cover-name">
                  {data.coverArtFile?.name || 'Stock Cover Art'}
                </div>
                <div className="sd-cover-status">
                  {data.coverArtFile ? '✓ Uploaded to cloud' : '✓ Stock image selected'}
                </div>
                <button type="button" className="sd-cover-remove" onClick={removeCover}>
                  Remove cover
                </button>
              </div>
            </div>
          )}

          {/* ── Upload zone — only when no cover selected ─────────────────── */}
          {!coverUploading && !data.coverArtUrl && (
            <div
              className="sd-upload-zone"
              onClick={() => coverInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && coverInputRef.current?.click()}
            >
              <ImageIcon size={22} className="sd-upload-icon" />
              <div className="sd-upload-main">Upload cover art</div>
              <div className="sd-upload-sub">JPG, PNG, WEBP — min 500×500px recommended</div>
              <span className="sd-upload-btn-hint">Click to browse files</span>
            </div>
          )}

          <p style={{ fontSize:11, color:'#52525b', marginTop:8, lineHeight:1.6 }}>
            File too large?{' '}
            <a
              href="https://www.freeconvert.com/image-compressor"
              target="_blank"
              rel="noreferrer"
              style={{ color:'#c084fc', textDecoration:'none', fontWeight:700 }}
            >
              Compress image free here ↗
            </a>
          </p>

          {/* ── STOCK IMAGE SELECTOR ──────────────────────────────────────── */}
          {!coverUploading && !data.coverArtUrl && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ flex:1, height:'0.5px', background:'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', color:'#2a2a3a', whiteSpace:'nowrap' }}>
                  Or pick a stock cover
                </span>
                <div style={{ flex:1, height:'0.5px', background:'rgba(255,255,255,0.06)' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
                {STOCK_COVERS.map((stock) => (
                  <div
                    key={stock.src}
                    onClick={() => onChange({ ...data, coverArtUrl: stock.src, coverArtFile: null })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && onChange({ ...data, coverArtUrl: stock.src, coverArtFile: null })}
                    style={{
                      position:'relative', overflow:'hidden',
                      borderRadius:12, cursor:'pointer',
                      border:'1px solid rgba(255,255,255,0.08)',
                      transition:'all 0.25s ease',
                      aspectRatio:'1/1',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'
                      e.currentTarget.style.transform   = 'translateY(-3px) scale(1.03)'
                      e.currentTarget.style.boxShadow   = '0 8px 24px rgba(124,58,237,0.2)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.transform   = 'translateY(0) scale(1)'
                      e.currentTarget.style.boxShadow   = 'none'
                    }}
                  >
                    <img
                      src={stock.src}
                      alt={stock.label}
                      style={{
                        width:'100%', height:'100%',
                        objectFit:'cover', display:'block',
                      }}
                    />
                    <div style={{
                      position:'absolute', inset:0,
                      background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                      display:'flex', alignItems:'flex-end', justifyContent:'center',
                      padding:'10px',
                      opacity:0,
                      transition:'opacity 0.25s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0' }}
                    >
                      <span style={{
                        fontSize:11, fontWeight:700, color:'#fff',
                        background:'rgba(124,58,237,0.6)',
                        backdropFilter:'blur(8px)',
                        padding:'4px 12px', borderRadius:999,
                        letterSpacing:'0.02em',
                      }}>
                        Use {stock.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {coverError && (
            <div className="sd-error-box">⚠ {coverError} — please try again</div>
          )}
        </div>
      </div>
    </>
  )
}