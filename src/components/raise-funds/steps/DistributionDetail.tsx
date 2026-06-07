'use client'

import { useState, useRef } from 'react'
import { Plus, X, Upload, Music2, Loader2, Image as ImageIcon } from 'lucide-react'

const GENRES = [
  'Hip-Hop / Rap', 'Indie Pop', 'R&B / Soul', 'Electronic',
  'Folk / Acoustic', 'Bollywood Pop', 'Punjabi', 'Classical Fusion',
  'Rock', 'Jazz', 'Devotional', 'Other',
]

const CONTRIBUTOR_ROLES = [
  'Producer', 'Lyricist', 'Composer', 'Co-Writer',
  'Arranger', 'Mixing Engineer', 'Mastering Engineer', 'Other',
]

export interface Contributor {
  name: string
  role: string
}

interface DistributionData {
  releaseStatus: 'released' | 'unreleased' | ''
  migrationApproved: boolean
  releaseName: string
  primaryGenre: string
  releaseDate: string
  explicitLyrics: boolean
  coverArtDist: string
  primaryArtist: string
  additionalArtists: string[]
  songFileUrl: string
  hasFreeBeat: boolean
  spotifyLink: string
  appleMusicLink: string
  releaseType: 'single' | 'album'
  contributors: Contributor[]
}

interface Props {
  data: DistributionData
  onChange: (data: DistributionData) => void
}

export default function DistributionDetail({ data, onChange }: Props) {
  const [newArtist, setNewArtist] = useState('')
  const [newContribName, setNewContribName] = useState('')
  const [newContribRole, setNewContribRole] = useState(CONTRIBUTOR_ROLES[0])

  const [songUploading, setSongUploading] = useState(false)
  const [songUploadError, setSongUploadError] = useState('')
  const [coverDistUploading, setCoverDistUploading] = useState(false)
  const [coverDistError, setCoverDistError] = useState('')

  const songFileRef = useRef<HTMLInputElement>(null)
  const coverDistRef = useRef<HTMLInputElement>(null)

  const update = (key: keyof DistributionData, val: unknown) =>
    onChange({ ...data, [key]: val })

  const addArtist = () => {
    if (!newArtist.trim()) return
    update('additionalArtists', [...data.additionalArtists, newArtist.trim()])
    setNewArtist('')
  }

  const removeArtist = (idx: number) =>
    update('additionalArtists', data.additionalArtists.filter((_, i) => i !== idx))

  const addContributor = () => {
    if (!newContribName.trim()) return
    update('contributors', [...(data.contributors ?? []), { name: newContribName.trim(), role: newContribRole }])
    setNewContribName('')
    setNewContribRole(CONTRIBUTOR_ROLES[0])
  }

  const removeContributor = (idx: number) =>
    update('contributors', (data.contributors ?? []).filter((_, i) => i !== idx))

  // ── Song file upload to Cloudinary ────────────────────────────
  const handleSongFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (file.size > 100 * 1024 * 1024) {
      setSongUploadError('File must be under 100MB')
      return
    }

    setSongUploading(true)
    setSongUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Upload failed')
      onChange({ ...data, songFileUrl: json.url })
    } catch (err: unknown) {
      setSongUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setSongUploading(false)
    }
  }

  // ── Cover art (distribution) upload to Cloudinary ─────────────
  const handleCoverDistUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setCoverDistUploading(true)
    setCoverDistError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Upload failed')
      onChange({ ...data, coverArtDist: json.url })
    } catch (err: unknown) {
      setCoverDistError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setCoverDistUploading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        .page { color: white; font-family: Inter, sans-serif; }
        .header { margin-bottom: 36px; }
        .title { font-size: 34px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.04em; }
        .subtitle { color: #71717a; font-size: 15px; }
        .section {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px; padding: 24px; margin-bottom: 22px; backdrop-filter: blur(20px);
        }
        .label {
          display: block; margin-bottom: 12px; color: #71717a; font-size: 11px;
          letter-spacing: 0.24em; text-transform: uppercase; font-weight: 700;
        }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .field { margin-bottom: 20px; }
        .input, .select {
          width: 100%; height: 58px; border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);
          padding: 0 18px; color: white; outline: none; font-size: 14px;
          transition: all 0.3s ease; box-sizing: border-box;
        }
        .input:focus, .select:focus {
          border-color: rgba(168,85,247,0.45); box-shadow: 0 0 0 4px rgba(168,85,247,0.12);
        }
        .select option { background: #09090b; }
        .toggleGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .toggleBtn {
          height: 60px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03); color: #71717a; cursor: pointer;
          font-size: 14px; font-weight: 600; transition: all 0.3s ease;
        }
        .toggleBtn:hover { border-color: rgba(255,255,255,0.18); }
        .activeGreen { background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.35); color: #6ee7b7; }
        .activePurple { background: rgba(168,85,247,0.12); border-color: rgba(168,85,247,0.35); color: #d8b4fe; }
        .activePink { background: rgba(236,72,153,0.12); border-color: rgba(236,72,153,0.35); color: #f9a8d4; }
        .warning {
          background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.18);
          border-radius: 22px; padding: 20px;
        }
        .warningTitle { color: #fcd34d; font-weight: 600; margin-bottom: 10px; }
        .warningText { color: #71717a; line-height: 1.7; font-size: 14px; margin-bottom: 16px; }
        .checkRow { display: flex; align-items: center; gap: 12px; }
        .uploadBox {
          border: 1px dashed rgba(168,85,247,0.35); background: rgba(168,85,247,0.05);
          border-radius: 24px; padding: 38px 20px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px; text-align: center;
          cursor: pointer; transition: all 0.3s ease;
        }
        .uploadBox:hover { background: rgba(168,85,247,0.09); }
        .uploadTitle { font-size: 15px; font-weight: 600; }
        .uploadSub { color: #71717a; font-size: 12px; }
        .artistWrap { display: flex; gap: 10px; }
        .addBtn {
          height: 58px; border: none; padding: 0 18px; border-radius: 18px;
          background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white;
          font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;
        }
        .tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
        .tag {
          display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; padding: 10px 14px; font-size: 13px;
        }
        .remove { background: transparent; border: none; color: #71717a; cursor: pointer; }
        .contributors { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
        .contributor {
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 16px;
        }
        .contributorName { font-size: 14px; font-weight: 600; }
        .contributorRole { color: #71717a; font-size: 12px; margin-top: 4px; }
        .uploadedCard {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.18);
          border-radius: 22px; padding: 18px;
        }
        .uploadedLeft { display: flex; align-items: center; gap: 14px; }
        .uploadedIcon {
          width: 46px; height: 46px; border-radius: 14px; background: rgba(34,197,94,0.12);
          display: flex; align-items: center; justify-content: center; color: #4ade80;
        }
        .uploadedName { font-size: 14px; font-weight: 600; max-width: 500px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .uploadedSub { margin-top: 4px; color: #71717a; font-size: 12px; }
        .removeBtn { background: transparent; border: none; color: #71717a; cursor: pointer; }
        .uploadingZone {
          border: 1px dashed rgba(168,85,247,0.3); background: rgba(168,85,247,0.03);
          border-radius: 24px; padding: 38px 20px; display: flex; flex-direction: column;
          align-items: center; gap: 10px; text-align: center;
        }
        .uploadingText { font-size: 13px; color: #9f7aea; }
        .errorBox {
          margin-top: 8px; padding: 10px 14px; background: rgba(239,68,68,0.08);
          border: 0.5px solid rgba(239,68,68,0.2); border-radius: 10px; font-size: 12px; color: #f87171;
        }
        .coverCard {
          display: flex; gap: 16px; align-items: center; background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px 16px;
        }
        .coverImg {
          width: 72px; height: 72px; object-fit: cover; border-radius: 10px; flex-shrink: 0;
          border: 0.5px solid rgba(255,255,255,0.07);
        }
        .coverInfo { flex: 1; min-width: 0; }
        .coverStatus { font-size: 11px; color: #34d399; margin-bottom: 8px; }
        .coverRemove {
          background: none; border: none; font-size: 11.5px; color: #f87171;
          cursor: pointer; font-family: inherit; padding: 0;
        }
        @keyframes distSpin { to { transform: rotate(360deg); } }
        .distSpin { animation: distSpin 1s linear infinite; color: #7c3aed; }
        @media (max-width: 900px) {
          .grid { grid-template-columns: 1fr; }
          .toggleGrid { grid-template-columns: 1fr; }
          .artistWrap { flex-direction: column; }
          .coverCard { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* Hidden file inputs */}
      <input ref={songFileRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleSongFileUpload} />
      <input ref={coverDistRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverDistUpload} />

      <div className="page">
        <div className="header">
          <div className="title">Distribution Details</div>
          <div className="subtitle">Tell us about your release and streaming setup.</div>
        </div>

        {/* RELEASE STATUS */}
        <div className="section">
          <label className="label">Release Status *</label>
          <div className="toggleGrid">
            <button type="button" onClick={() => update('releaseStatus', 'released')}
              className={`toggleBtn ${data.releaseStatus === 'released' ? 'activeGreen' : ''}`}>
              🎵 Already Released
            </button>
            <button type="button" onClick={() => update('releaseStatus', 'unreleased')}
              className={`toggleBtn ${data.releaseStatus === 'unreleased' ? 'activePurple' : ''}`}>
              🚀 Unreleased
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            RELEASED — only migration + links
            ═══════════════════════════════════════════════════════════════ */}
        {data.releaseStatus === 'released' && (
          <div className="section">
            <div className="warning">
              <div className="warningTitle">⚠ Migration Approval Required</div>
              <div className="warningText">
                Allow FANNYBAGS to manage royalty reporting and migration for your existing release.
              </div>
              <label className="checkRow">
                <input type="checkbox" checked={data.migrationApproved}
                  onChange={e => update('migrationApproved', e.target.checked)} />
                <span>I approve migration management</span>
              </label>
            </div>

            <div className="field" style={{ marginTop: 20 }}>
              <label className="label">Spotify Link</label>
              <input type="url" value={data.spotifyLink} onChange={e => update('spotifyLink', e.target.value)}
                placeholder="https://open.spotify.com/track/..." className="input" />
            </div>

            <div className="field">
              <label className="label">Apple Music Link</label>
              <input type="url" value={data.appleMusicLink} onChange={e => update('appleMusicLink', e.target.value)}
                placeholder="https://music.apple.com/..." className="input" />
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            UNRELEASED — full details
            ═══════════════════════════════════════════════════════════════ */}
        {data.releaseStatus === 'unreleased' && (
          <>
            {/* Release Type */}
            <div className="section">
              <label className="label">Release Type *</label>
              <div className="toggleGrid">
                <button type="button" onClick={() => update('releaseType', 'single')}
                  className={`toggleBtn ${data.releaseType === 'single' ? 'activePink' : ''}`}>
                  🎤 Single Track
                </button>
                <button type="button" onClick={() => update('releaseType', 'album')}
                  className={`toggleBtn ${data.releaseType === 'album' ? 'activePink' : ''}`}>
                  💿 Album / EP
                </button>
              </div>
            </div>

            {/* Song details */}
            <div className="section">
              <div className="grid">
                <div className="field">
                  <label className="label">Release Name *</label>
                  <input type="text" value={data.releaseName} onChange={e => update('releaseName', e.target.value)}
                    placeholder="Album or single name" className="input" />
                </div>
                <div className="field">
                  <label className="label">Primary Genre *</label>
                  <select value={data.primaryGenre} onChange={e => update('primaryGenre', e.target.value)} className="select">
                    <option value="">Select genre</option>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Release Date *</label>
                  <input type="date" value={data.releaseDate} onChange={e => update('releaseDate', e.target.value)} className="input" />
                </div>
                <div className="field">
                  <label className="label">Explicit Lyrics</label>
                  <label className="checkRow">
                    <input type="checkbox" checked={data.explicitLyrics} onChange={e => update('explicitLyrics', e.target.checked)} />
                    <span>Contains explicit content</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Artists */}
            <div className="section">
              <div className="field">
                <label className="label">Primary Artist *</label>
                <input type="text" value={data.primaryArtist} onChange={e => update('primaryArtist', e.target.value)}
                  placeholder="Artist name" className="input" />
              </div>
              <div className="field">
                <label className="label">Featured Artists</label>
                <div className="artistWrap">
                  <input type="text" value={newArtist} onChange={e => setNewArtist(e.target.value)}
                    placeholder="Add featured artist..." className="input" />
                  <button type="button" onClick={addArtist} className="addBtn"><Plus size={16} /> Add</button>
                </div>
                {data.additionalArtists.length > 0 && (
                  <div className="tags">
                    {data.additionalArtists.map((a, i) => (
                      <div key={i} className="tag">{a}
                        <button type="button" className="remove" onClick={() => removeArtist(i)}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cover Art Upload */}
            <div className="section">
              <label className="label">Cover Art</label>

              {coverDistUploading && (
                <div className="uploadingZone">
                  <Loader2 size={24} className="distSpin" />
                  <div className="uploadingText">Uploading cover art...</div>
                </div>
              )}

              {!coverDistUploading && data.coverArtDist && (
                <div className="coverCard">
                  <img src={data.coverArtDist} alt="cover" className="coverImg" />
                  <div className="coverInfo">
                    <div className="coverStatus">✓ Uploaded to cloud</div>
                    <button type="button" className="coverRemove"
                      onClick={() => update('coverArtDist', '')}>Remove cover</button>
                  </div>
                </div>
              )}

              {!coverDistUploading && !data.coverArtDist && (
                <div className="uploadBox" onClick={() => coverDistRef.current?.click()}
                  role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && coverDistRef.current?.click()}>
                  <ImageIcon size={30} style={{ color: '#7c3aed' }} />
                  <div className="uploadTitle">Upload Cover Art</div>
                  <div className="uploadSub">JPG, PNG, WEBP — min 500×500px recommended</div>
                </div>
              )}

              {coverDistError && <div className="errorBox">⚠ {coverDistError} — please try again</div>}
            </div>

            {/* Song File Upload */}
            <div className="section">
              <div className="field">
                <label className="label">{data.releaseType === 'album' ? 'Album / EP Upload' : 'Song Upload'}</label>

                {songUploading && (
                  <div className="uploadingZone">
                    <Loader2 size={24} className="distSpin" />
                    <div className="uploadingText">Uploading audio file...</div>
                  </div>
                )}

                {!songUploading && data.songFileUrl && (
                  <div className="uploadedCard">
                    <div className="uploadedLeft">
                      <div className="uploadedIcon"><Music2 size={18} /></div>
                      <div>
                        <div className="uploadedName">✓ Audio uploaded</div>
                        <div className="uploadedSub">Upload completed successfully</div>
                      </div>
                    </div>
                    <button type="button" className="removeBtn" onClick={() => update('songFileUrl', '')}><X size={16} /></button>
                  </div>
                )}

                {!songUploading && !data.songFileUrl && (
                  <div className="uploadBox" onClick={() => songFileRef.current?.click()}
                    role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && songFileRef.current?.click()}>
                    <Upload size={30} style={{ color: '#7c3aed' }} />
                    <div className="uploadTitle">{data.releaseType === 'album' ? 'Upload Album / EP Files' : 'Upload Song File'}</div>
                    <div className="uploadSub">WAV, FLAC, MP3 — max 100MB</div>
                  </div>
                )}

                {songUploadError && <div className="errorBox">⚠ {songUploadError} — please try again</div>}
              </div>

              <div className="field" style={{ marginTop: 20 }}>
                <label className="label">Free Beat / Sample</label>
                <label className="checkRow">
                  <input type="checkbox" checked={data.hasFreeBeat} onChange={e => update('hasFreeBeat', e.target.checked)} />
                  <span>Beat is royalty-free</span>
                </label>
              </div>
            </div>

            {/* Contributors */}
            <div className="section">
              <label className="label">Contributors</label>
              <div className="artistWrap">
                <input type="text" value={newContribName} onChange={e => setNewContribName(e.target.value)}
                  placeholder="Contributor name" className="input" />
                <select value={newContribRole} onChange={e => setNewContribRole(e.target.value)} className="select">
                  {CONTRIBUTOR_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button type="button" onClick={addContributor} className="addBtn"><Plus size={16} /> Add</button>
              </div>
              {(data.contributors ?? []).length > 0 && (
                <div className="contributors">
                  {(data.contributors ?? []).map((c, i) => (
                    <div key={i} className="contributor">
                      <div>
                        <div className="contributorName">{c.name}</div>
                        <div className="contributorRole">{c.role}</div>
                      </div>
                      <button type="button" className="remove" onClick={() => removeContributor(i)}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}