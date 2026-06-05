'use client'

import { useRef } from 'react'
import { Upload, X, Music, Image as ImageIcon } from 'lucide-react'

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

export default function SongDetail({ data, onChange }: Props) {
  const demoInputRef    = useRef<HTMLInputElement>(null)
  const coverInputRef   = useRef<HTMLInputElement>(null)

  const update = (key: keyof SongDetailData, val: unknown) =>
    onChange({ ...data, [key]: val })

  // ── DEMO UPLOAD ──────────────────────────────────────────────
  const handleDemoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 100 * 1024 * 1024) {
      alert('Demo must be under 100MB')
      return
    }
    onChange({ ...data, demoFile: file, demoUrl: file.name })
    // reset so same file can be re-selected if removed
    e.target.value = ''
  }

  const removeDemo = () => {
    onChange({ ...data, demoFile: null, demoUrl: '' })
  }

  // ── COVER UPLOAD ─────────────────────────────────────────────
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange({ ...data, coverArtFile: file, coverArtUrl: url })
    e.target.value = ''
  }

  const removeCover = () => {
    if (data.coverArtUrl) URL.revokeObjectURL(data.coverArtUrl)
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

        /* GRID */
        .sd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 0; }
        .sd-full { grid-column: span 2; }

        /* FIELD */
        .sd-field { margin-bottom: 20px; }
        .sd-label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #2a2a3a; font-weight: 500; margin-bottom: 8px; }
        .sd-req { color: #7c3aed; margin-left: 2px; }

        /* INPUTS */
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

        /* DATE input color fix */
        .sd-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.3); cursor: pointer; }

        /* UPLOAD ZONES */
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

        /* UPLOADED STATES */
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
        .sd-cover-status { font-size: 11px; color: #555; margin-bottom: 8px; }
        .sd-cover-remove { background: none; border: none; color: #7f1d1d; font-size: 11.5px; color: #f87171; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.15s; }
        .sd-cover-remove:hover { color: #fca5a5; }

        @media (max-width: 640px) {
          .sd-grid { grid-template-columns: 1fr; }
          .sd-full { grid-column: span 1; }
          .sd-cover-card { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* Hidden file inputs — NOT inside labels, triggered via ref */}
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

          {/* TITLE */}
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

          {/* LANGUAGE */}
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

          {/* DATE */}
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

        {/* DEMO UPLOAD */}
        <div className="sd-field">
          <label className="sd-label">1-Min Demo Track <span className="sd-req">*</span></label>
          {data.demoFile ? (
            <div className="sd-demo-card">
              <div className="sd-demo-left">
                <div className="sd-demo-icon-wrap">
                  <Music size={18} />
                </div>
                <div>
                  <div className="sd-demo-name">{data.demoFile.name}</div>
                  <div className="sd-demo-status">✓ Demo uploaded successfully</div>
                </div>
              </div>
              <button type="button" className="sd-remove-btn" onClick={removeDemo}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              className="sd-upload-zone"
              onClick={() => demoInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && demoInputRef.current?.click()}
            >
              <Upload size={22} className="sd-upload-icon" />
              <div className="sd-upload-main">Upload demo track</div>
              <div className="sd-upload-sub">MP3, WAV, FLAC — max 100MB</div>
              <span className="sd-upload-btn-hint">Click to browse files</span>
            </div>
          )}
        </div>

        {/* COVER ART UPLOAD */}
        <div className="sd-field">
          <label className="sd-label">Cover Art <span className="sd-req">*</span></label>
          {data.coverArtUrl ? (
            <div className="sd-cover-card">
              <img src={data.coverArtUrl} alt="cover" className="sd-cover-img" />
              <div className="sd-cover-info">
                <div className="sd-cover-name">{data.coverArtFile?.name}</div>
                <div className="sd-cover-status">Cover art uploaded successfully</div>
                <button type="button" className="sd-cover-remove" onClick={removeCover}>
                  Remove cover
                </button>
              </div>
            </div>
          ) : (
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
        </div>

      </div>
    </>
  )
}