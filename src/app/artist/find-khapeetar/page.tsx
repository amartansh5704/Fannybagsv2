'use client'
import { useEffect, useState } from 'react'
import ArtistLayout from '@/components/artist/ArtistLayout'
import { Search, Loader2, Users, MapPin, Zap, Star } from 'lucide-react'
import Link from 'next/link'
import { formatINR } from '@/lib/utils'

const AVAILABILITY_COLOR: Record<string, string> = {
  'Available Now': 'text-green-400 bg-green-500/10 border-green-500/20',
  'Part-Time':     'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Busy':          'text-red-400   bg-red-500/10   border-red-500/20',
}

const ROLES = ['All', 'Music Producer', 'Mix Engineer', 'Mastering Engineer', 'Beatmaker', 'Songwriter', 'Videographer', 'Marketer', 'A&R']
const WORK_MODES = ['All', 'Remote', 'Onsite', 'Hybrid']
const AVAIL = ['All', 'Available Now', 'Part-Time', 'Busy']

export default function FindKhapeetar() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [role, setRole]         = useState('All')
  const [workMode, setWorkMode] = useState('All')
  const [avail, setAvail]       = useState('All')

  const fetchProfiles = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)                params.set('search', search)
    if (role !== 'All')        params.set('role', role)
    if (workMode !== 'All')    params.set('workMode', workMode)
    if (avail !== 'All')       params.set('availability', avail)

    fetch(`/api/khapeetar?${params}`)
      .then(r => r.json())
      .then(j => { if (j.success) setProfiles(j.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProfiles() }, [role, workMode, avail])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); fetchProfiles()
  }

  const FilterPill = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex gap-2 flex-wrap">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            value === opt
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
              : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )

  return (
    <ArtistLayout>
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-lg font-semibold">Find Khapeetar</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Hire music professionals for your project</p>
        </div>

        <div className="px-8 py-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative mb-5">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, skill, role..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-purple-500/60 transition-all placeholder:text-zinc-600"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-xs">
              Search
            </button>
          </form>

          {/* Filters */}
          <div className="space-y-3 mb-6 bg-white/2 border border-white/6 rounded-2xl p-4">
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Role</p>
              <FilterPill options={ROLES} value={role} onChange={setRole} />
            </div>
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Work Mode</p>
              <FilterPill options={WORK_MODES} value={workMode} onChange={setWorkMode} />
            </div>
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Availability</p>
              <FilterPill options={AVAIL} value={avail} onChange={setAvail} />
            </div>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-xs text-zinc-600 mb-4">{profiles.length} Khapeetar{profiles.length !== 1 ? 's' : ''} found</p>
          )}

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-purple-400" size={28} />
            </div>
          )}

          {!loading && profiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Users size={36} className="text-zinc-700 mb-3" />
              <p className="text-zinc-400 font-medium mb-1">No Khapeetars found</p>
              <p className="text-zinc-600 text-sm">Try adjusting your filters</p>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {profiles.map(p => (
              <Link key={p.id} href={`/artist/find-khapeetar/${p.id}`}>
                <div className="group bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-purple-500/30 hover:bg-white/5 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/20 flex items-center justify-center mb-4 text-lg font-semibold text-white flex-shrink-0">
                    {p.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-white text-sm">{p.name}</h3>
                      {p.isVerified && <Star size={12} className="text-yellow-400 flex-shrink-0 mt-0.5" />}
                    </div>
                    <p className="text-xs text-purple-300 mb-2">{p.primaryRole}</p>

                    {/* Location */}
                    {(p.city || p.state) && (
                      <div className="flex items-center gap-1 text-xs text-zinc-500 mb-2">
                        <MapPin size={10} />
                        <span>{[p.city, p.state].filter(Boolean).join(', ')}</span>
                        <span className="text-zinc-700">·</span>
                        <span>{p.workMode}</span>
                      </div>
                    )}

                    {/* Availability */}
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mb-3 ${AVAILABILITY_COLOR[p.availability] ?? 'text-zinc-400 bg-white/5 border-white/10'}`}>
                      <span className="w-1 h-1 rounded-full bg-current" />
                      {p.availability}
                    </span>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.skills.slice(0, 3).map((s: string) => (
                        <span key={s} className="text-xs bg-white/5 border border-white/8 text-zinc-400 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                      {p.skills.length > 3 && (
                        <span className="text-xs text-zinc-600">+{p.skills.length - 3}</span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/6 mt-auto">
                    <div>
                      <p className="text-xs text-zinc-600">Starting at</p>
                      <p className="text-sm font-semibold text-emerald-300">
                        {p.startingBudget > 0 ? formatINR(p.startingBudget) : 'Negotiable'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-600">{p.experienceYears}y exp</p>
                      <p className="text-xs text-zinc-500">{p.projectsCompleted} projects</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ArtistLayout>
  )
}