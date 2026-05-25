'use client'
import { Upload, X, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const LANGUAGES = ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Kannada', 'Bhojpuri', 'Mixed / Hinglish']

export default function SongDetail({ data, onChange }: Props) {
  const update = (key: keyof SongDetailData, val: unknown) => onChange({ ...data, [key]: val })

  const handleDemoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 100 * 1024 * 1024) { alert('Demo must be under 100MB'); return }
    update('demoFile', file)
    update('demoUrl', file.name)
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    update('coverArtFile', file)
    update('coverArtUrl', url)
  }

  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Song Details</h2>
        <p className="text-zinc-500 text-sm">Basic information about your song</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Song Title */}
        <div className="col-span-2 space-y-1.5">
          <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Song Title *</label>
          <input
            type="text"
            value={data.title}
            onChange={e => update('title', e.target.value)}
            placeholder="e.g. Raat Baaki"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 transition-all placeholder:text-zinc-600"
          />
        </div>

        {/* Language */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Language *</label>
          <select
            value={data.language}
            onChange={e => update('language', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/60 transition-all text-white"
          >
            <option value="" className="bg-zinc-900">Select language</option>
            {LANGUAGES.map(l => <option key={l} value={l} className="bg-zinc-900">{l}</option>)}
          </select>
        </div>

        {/* Campaign End Date */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Campaign End Date *</label>
          <input
            type="date"
            value={data.campaignEndDate}
            min={today}
            max={maxDate}
            onChange={e => update('campaignEndDate', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/60 transition-all [color-scheme:dark]"
          />
          <p className="text-xs text-zinc-600">Max 90 days from today</p>
        </div>
      </div>

      {/* Demo Upload */}
      <div className="space-y-1.5">
        <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">1-Min Demo Track *</label>
        {data.demoFile ? (
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
            <Music size={16} className="text-green-400" />
            <span className="text-sm text-green-300 flex-1 truncate">{data.demoFile.name}</span>
            <button onClick={() => { update('demoFile', null); update('demoUrl', '') }} className="text-zinc-500 hover:text-red-400">
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-purple-500/30 rounded-xl py-8 cursor-pointer hover:bg-purple-500/5 transition-all bg-purple-500/3 group">
            <Upload size={22} className="text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-zinc-400">Click to upload demo</span>
            <span className="text-xs text-zinc-600">MP3, WAV, FLAC — max 100MB</span>
            <input type="file" accept="audio/*" className="hidden" onChange={handleDemoUpload} />
          </label>
        )}
      </div>

      {/* Cover Art */}
      <div className="space-y-1.5">
        <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Cover Art *</label>
        {data.coverArtUrl ? (
          <div className="flex items-center gap-4">
            <img src={data.coverArtUrl} alt="cover" className="w-20 h-20 rounded-xl object-cover border border-white/10" />
            <div className="flex-1">
              <p className="text-sm text-zinc-300 font-medium">{data.coverArtFile?.name}</p>
              <p className="text-xs text-zinc-500 mt-1">Cover art selected</p>
              <button onClick={() => { update('coverArtFile', null); update('coverArtUrl', '') }} className="text-xs text-red-400 hover:text-red-300 mt-2">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-pink-500/30 rounded-xl py-8 cursor-pointer hover:bg-pink-500/5 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-pink-400 text-xl">🖼</div>
            <span className="text-sm text-zinc-400">Upload cover art</span>
            <span className="text-xs text-zinc-600">JPG, PNG — min 1000×1000px recommended</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>
        )}
      </div>
    </div>
  )
}