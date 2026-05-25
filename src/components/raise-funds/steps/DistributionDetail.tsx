'use client'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  releaseStatus:     'released' | 'unreleased' | ''
  migrationApproved: boolean
  releaseName:       string
  primaryGenre:      string
  releaseDate:       string
  explicitLyrics:    boolean
  coverArtDist:      string
  primaryArtist:     string
  additionalArtists: string[]
  songFileUrl:       string
  hasFreeBeat:       boolean
  // ── new fields ──
  spotifyLink:       string
  appleMusicLink:    string
  releaseType:       'single' | 'album'
  contributors:      Contributor[]
}

interface Props {
  data:     DistributionData
  onChange: (data: DistributionData) => void
}

export default function DistributionDetail({ data, onChange }: Props) {
  const [newArtist, setNewArtist]             = useState('')
  const [newContribName, setNewContribName]   = useState('')
  const [newContribRole, setNewContribRole]   = useState(CONTRIBUTOR_ROLES[0])

  const update = (key: keyof DistributionData, val: unknown) =>
    onChange({ ...data, [key]: val })

  // ── additional artists ──
  const addArtist = () => {
    if (!newArtist.trim()) return
    update('additionalArtists', [...data.additionalArtists, newArtist.trim()])
    setNewArtist('')
  }
  const removeArtist = (idx: number) =>
    update('additionalArtists', data.additionalArtists.filter((_, i) => i !== idx))

  // ── contributors ──
  const addContributor = () => {
    if (!newContribName.trim()) return
    const entry: Contributor = { name: newContribName.trim(), role: newContribRole }
    update('contributors', [...(data.contributors ?? []), entry])
    setNewContribName('')
    setNewContribRole(CONTRIBUTOR_ROLES[0])
  }
  const removeContributor = (idx: number) =>
    update('contributors', (data.contributors ?? []).filter((_, i) => i !== idx))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Distribution Details</h2>
        <p className="text-zinc-500 text-sm">Tell us about your song's release status</p>
      </div>

      {/* ── Release Status ── */}
      <div className="space-y-2">
        <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
          Release Status *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['released', 'unreleased'] as const).map(status => (
            <button
              key={status}
              onClick={() => update('releaseStatus', status)}
              className={cn(
                'py-3 rounded-xl border text-sm font-medium capitalize transition-all',
                data.releaseStatus === status
                  ? status === 'released'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-purple-500/15 border-purple-500/50 text-purple-300'
                  : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
              )}
            >
              {status === 'released' ? '🎵 Already Released' : '🚀 Unreleased'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Release Type (Single / Album) — shown once status is picked ── */}
      {data.releaseStatus && (
        <div className="space-y-2">
          <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            Release Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['single', 'album'] as const).map(type => (
              <button
                key={type}
                onClick={() => update('releaseType', type)}
                className={cn(
                  'py-3 rounded-xl border text-sm font-medium capitalize transition-all',
                  data.releaseType === type
                    ? 'bg-pink-500/15 border-pink-500/50 text-pink-300'
                    : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                )}
              >
                {type === 'single' ? '🎤 Single Track' : '💿 Album / EP'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Released branch ── */}
      {data.releaseStatus === 'released' && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3">
          <p className="text-sm text-amber-300 font-medium">⚠️ Migration Approval Required</p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            If your song is already distributed elsewhere, FannyBags needs approval to migrate revenue
            reporting. Check this box to confirm you authorize FannyBags to manage revenue for this song.
          </p>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.migrationApproved}
              onChange={e => update('migrationApproved', e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-sm text-zinc-300">
              I authorize FannyBags to migrate revenue management for this song
            </span>
          </label>
        </div>
      )}

      {/* ── Unreleased branch ── */}
      {data.releaseStatus === 'unreleased' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              Release Name *
            </label>
            <input
              type="text"
              value={data.releaseName}
              onChange={e => update('releaseName', e.target.value)}
              placeholder="Album or single name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/60 transition-all placeholder:text-zinc-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              Primary Genre *
            </label>
            <select
              value={data.primaryGenre}
              onChange={e => update('primaryGenre', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/60 transition-all text-white"
            >
              <option value="" className="bg-zinc-900">Select genre</option>
              {GENRES.map(g => (
                <option key={g} value={g} className="bg-zinc-900">{g}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              Release Date *
            </label>
            <input
              type="date"
              value={data.releaseDate}
              onChange={e => update('releaseDate', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/60 transition-all [color-scheme:dark]"
            />
          </div>
          <div className="space-y-1.5 flex flex-col justify-end">
            <label className="flex items-center gap-3 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.explicitLyrics}
                onChange={e => update('explicitLyrics', e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
              <span className="text-sm text-zinc-300">Explicit Lyrics</span>
              <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                E
              </span>
            </label>
          </div>
        </div>
      )}

      {/* ── Common fields — shown once a status is picked ── */}
      {data.releaseStatus && (
        <>
          {/* Primary Artist + Additional Artists */}
          <div className="space-y-3">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              Primary Artist Name *
            </label>
            <input
              type="text"
              value={data.primaryArtist}
              onChange={e => update('primaryArtist', e.target.value)}
              placeholder="Your artist name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/60 transition-all placeholder:text-zinc-600"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newArtist}
                onChange={e => setNewArtist(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addArtist()}
                placeholder="Add featured artist..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500/60 transition-all placeholder:text-zinc-600"
              />
              <button
                onClick={addArtist}
                className="flex items-center gap-1 px-4 py-2.5 bg-purple-500/15 border border-purple-500/30 text-purple-300 rounded-xl text-sm hover:bg-purple-500/25 transition-all"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            {data.additionalArtists.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.additionalArtists.map((a, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-sm text-zinc-300 px-3 py-1 rounded-full"
                  >
                    {a}
                    <button
                      onClick={() => removeArtist(i)}
                      className="text-zinc-600 hover:text-red-400"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Song File + Free Beat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                Song File (WAV/FLAC)
              </label>
              <label className="flex items-center gap-2 border border-dashed border-white/15 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/3 transition-all">
                <span className="text-zinc-500 text-sm truncate">
                  {data.songFileUrl || 'Upload final song file'}
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={e => update('songFileUrl', e.target.files?.[0]?.name || '')}
                />
              </label>
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-3 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.hasFreeBeat}
                  onChange={e => update('hasFreeBeat', e.target.checked)}
                  className="w-4 h-4 accent-purple-500"
                />
                <div>
                  <span className="text-sm text-zinc-300">Free Beat / Sample</span>
                  <p className="text-xs text-zinc-600">Check if beat is royalty-free</p>
                </div>
              </label>
            </div>
          </div>

          {/* ── Streaming Profile Links ── */}
          <div className="space-y-3">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              Streaming Profile Links
            </label>
            <div className="grid grid-cols-1 gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-emerald-500 font-semibold pointer-events-none">
                  SP
                </span>
                <input
                  type="url"
                  value={data.spotifyLink}
                  onChange={e => update('spotifyLink', e.target.value)}
                  placeholder="https://open.spotify.com/artist/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-500/60 transition-all placeholder:text-zinc-600"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-pink-500 font-semibold pointer-events-none">
                  AM
                </span>
                <input
                  type="url"
                  value={data.appleMusicLink}
                  onChange={e => update('appleMusicLink', e.target.value)}
                  placeholder="https://music.apple.com/artist/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-pink-500/60 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* ── Contributors ── */}
          <div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-4">
            <div>
              <p className="text-sm text-zinc-400 font-medium">Add Contributors</p>
              <p className="text-xs text-zinc-600 mt-0.5">
                Producers, lyricists, composers who need revenue credit
              </p>
            </div>

            {/* Input row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newContribName}
                onChange={e => setNewContribName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addContributor()}
                placeholder="Contributor name"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500/60 transition-all placeholder:text-zinc-600"
              />
              <select
                value={newContribRole}
                onChange={e => setNewContribRole(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-purple-500/60 transition-all text-zinc-300"
              >
                {CONTRIBUTOR_ROLES.map(r => (
                  <option key={r} value={r} className="bg-zinc-900">{r}</option>
                ))}
              </select>
              <button
                onClick={addContributor}
                className="flex items-center gap-1 px-4 py-2.5 bg-purple-500/15 border border-purple-500/30 text-purple-300 rounded-xl text-sm hover:bg-purple-500/25 transition-all whitespace-nowrap"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Contributors list */}
            {(data.contributors ?? []).length > 0 && (
              <div className="space-y-2">
                {(data.contributors ?? []).map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-4 py-2.5"
                  >
                    <div>
                      <p className="text-sm text-zinc-200 font-medium">{c.name}</p>
                      <p className="text-xs text-zinc-500">{c.role}</p>
                    </div>
                    <button
                      onClick={() => removeContributor(i)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}