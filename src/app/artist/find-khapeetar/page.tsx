'use client'

import { useEffect, useState } from 'react'
import ArtistLayout from '@/components/artist/ArtistLayout'
import { Search, Loader2, Users, MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import { formatINR } from '@/lib/utils'

const ROLES = ['All', 'Music Producer', 'Mix Engineer', 'Mastering Engineer', 'Beatmaker', 'Songwriter', 'Videographer', 'Marketer', 'A&R']
const WORK_MODES = ['All', 'Remote', 'Onsite', 'Hybrid']
const AVAIL = ['All', 'Available Now', 'Part-Time', 'Busy']

export default function FindKhapeetar() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('All')
  const [workMode, setWorkMode] = useState('All')
  const [avail, setAvail] = useState('All')

  const fetchProfiles = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (role !== 'All') params.set('role', role)
    if (workMode !== 'All') params.set('workMode', workMode)
    if (avail !== 'All') params.set('availability', avail)

    fetch(`/api/khapeetar?${params}`)
      .then(r => r.json())
      .then(j => { if (j.success) setProfiles(j.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProfiles() }, [role, workMode, avail])

  const FilterPill = ({ options, value, onChange }: any) => (
    <div className="pillWrap">
      {options.map((opt: string) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={value === opt ? 'pill activePill' : 'pill'}
        >
          {opt}
        </button>
      ))}
    </div>
  )

  return (
    <ArtistLayout>
      <div className="page">
        <div className="header">
          <h1>Find Khapeetar</h1>
          <p>Hire music professionals for your project</p>
        </div>

        <div className="container">
          <form onSubmit={(e)=>{e.preventDefault();fetchProfiles()}} className="searchForm">
            <Search size={16} className="searchIcon" />
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search by name, skill, role..."
              className="searchInput"
            />
            <button type="submit" className="searchBtn">Search</button>
          </form>

          <div className="filtersCard">
            <div className="filterBlock">
              <label>Role</label>
              <FilterPill options={ROLES} value={role} onChange={setRole} />
            </div>

            <div className="filterBlock">
              <label>Work Mode</label>
              <FilterPill options={WORK_MODES} value={workMode} onChange={setWorkMode} />
            </div>

            <div className="filterBlock">
              <label>Availability</label>
              <FilterPill options={AVAIL} value={avail} onChange={setAvail} />
            </div>
          </div>

          {!loading && <p className="count">{profiles.length} Khapeetars found</p>}

          {loading && (
            <div className="loaderWrap">
              <Loader2 className="spin" />
            </div>
          )}

          {!loading && profiles.length === 0 && (
            <div className="emptyState">
              <Users size={40} />
              <h3>No Khapeetars found</h3>
            </div>
          )}

          <div className="grid">
            {profiles.map((p) => (
              <Link key={p.id} href={`/artist/find-khapeetar/${p.id}`}>
                <div className="profileCard">
                  <div className="avatar">
                    {p.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <h3>{p.name}</h3>

                  <div className="roleRow">
                    <span>{p.primaryRole}</span>
                    {p.isVerified && <Star size={12} />}
                  </div>

                  {(p.city || p.state) && (
                    <div className="location">
                      <MapPin size={12} />
                      {[p.city, p.state].filter(Boolean).join(', ')}
                    </div>
                  )}

                  <div className="skills">
                    {p.skills?.slice(0,3).map((s:string)=>(
                      <span key={s} className="skillTag">{s}</span>
                    ))}
                  </div>

                  <div className="footer">
                    <div>
                      <small>Starting at</small>
                      <strong>{p.startingBudget > 0 ? formatINR(p.startingBudget) : 'Negotiable'}</strong>
                    </div>

                    <div>
                      <small>{p.experienceYears}y exp</small>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <style jsx>{`
          .page{min-height:100vh;background:#050505;color:#fff}
          .header{padding:24px 32px;border-bottom:1px solid rgba(255,255,255,.06)}
          .header h1{font-size:28px;font-weight:700}
          .header p{color:#888;margin-top:6px}
          .container{padding:24px 32px}
          .searchForm{position:relative;margin-bottom:20px}
          .searchIcon{position:absolute;left:16px;top:18px;color:#777}
          .searchInput{width:100%;height:54px;padding:0 120px 0 46px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:18px;color:#fff}
          .searchBtn{position:absolute;right:8px;top:8px;height:38px;padding:0 16px;border:none;border-radius:12px;color:#fff;background:linear-gradient(135deg,#a855f7,#ec4899)}
          .filtersCard{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);padding:20px;border-radius:24px;margin-bottom:24px}
          .filterBlock{margin-bottom:18px}
          .filterBlock label{display:block;margin-bottom:10px;color:#888;font-size:12px}
          .pillWrap{display:flex;flex-wrap:wrap;gap:8px}
          .pill{padding:8px 14px;border-radius:999px;background:#111;border:1px solid #222;color:#aaa}
          .activePill{background:rgba(168,85,247,.2);border-color:rgba(168,85,247,.4);color:#e9d5ff}
          .count{color:#888;margin-bottom:16px}
          .loaderWrap,.emptyState{display:flex;justify-content:center;align-items:center;flex-direction:column;padding:60px}
          .spin{animation:spin 1s linear infinite}
          .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
          .profileCard{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);padding:20px;border-radius:24px;transition:.3s}
          .profileCard:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(168,85,247,.15)}
          .avatar{width:48px;height:48px;border-radius:16px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#a855f766,#ec489944);margin-bottom:12px}
          .roleRow{display:flex;justify-content:space-between;color:#c084fc;margin:8px 0}
          .location{display:flex;gap:6px;color:#888;font-size:12px;margin-bottom:12px}
          .skills{display:flex;flex-wrap:wrap;gap:6px}
          .skillTag{padding:4px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.08);color:#aaa;font-size:12px}
          .footer{margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between}
          @keyframes spin{to{transform:rotate(360deg)}}
        `}</style>
      </div>
    </ArtistLayout>
  )
}
