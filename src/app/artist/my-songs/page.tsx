'use client'

import { useEffect, useState } from 'react'
import ArtistLayout from '@/components/artist/ArtistLayout'
import SongCard from '@/components/artist/SongCard'
import { PlusCircle, Music, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function MySongsPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/songs')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setSongs(j.data)
        else setError('Failed to load songs')
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [])

  const totalRaised = songs.reduce(
    (a: number, s: any) => a + (s.campaign?.amountRaised ?? 0), 0
  )
  const totalReleased = songs
    .filter((s: any) => s.campaign?.fundsReleased)
    .reduce((a: number, s: any) => a + ((s.campaign?.amountRaised ?? 0) * 0.95), 0)

  return (
    <ArtistLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .ms-root { min-height: 100vh; background: #09090f; color: #f0f0f8; font-family: 'DM Sans', sans-serif; }

        /* HEADER */
        .ms-header { padding: 30px 40px 26px; border-bottom: 0.5px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; }
        .ms-header::before { content:''; position:absolute; top:-80px; left:-40px; width:280px; height:280px; border-radius:50%; background:radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%); pointer-events:none; }
        .ms-header-left {}
        .ms-header-eyebrow { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #222; margin-bottom: 8px; }
        .ms-header-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.6px; margin-bottom: 4px; }
        .ms-header-sub { font-size: 12.5px; color: #333; font-weight: 300; }
        .ms-new-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; background: linear-gradient(135deg, #7c3aed, #db2777); border: none; border-radius: 11px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; text-decoration: none; transition: all 0.2s; letter-spacing: 0.2px; flex-shrink: 0; }
        .ms-new-btn:hover { opacity: 0.85; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.3); }

        /* CONTENT */
        .ms-content { padding: 32px 40px; }

        /* SECTION LABEL */
        .ms-section-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #222; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
        .ms-section-label::after { content:''; flex:1; height:0.5px; background:rgba(255,255,255,0.04); }

        /* STAT STRIP */
        .ms-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 36px; }
        .ms-stat { background: #0d0d18; border: 0.5px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 18px 20px; position: relative; overflow: hidden; }
        .ms-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #2a2a3a; margin-bottom: 8px; }
        .ms-stat-value { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.8px; line-height: 1; }
        .ms-stat.live .ms-stat-value { color: #4ade80; }
        .ms-stat.raised .ms-stat-value { color: #c084fc; }
        .ms-stat.released .ms-stat-value { color: #38bdf8; }
        .ms-stat-glow { position: absolute; bottom: -16px; right: -16px; width: 60px; height: 60px; border-radius: 50%; filter: blur(24px); opacity: 0.5; }

        /* SONGS GRID */
        .ms-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 14px; }
        @media (min-width: 640px)  { .ms-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .ms-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1280px) { .ms-grid { grid-template-columns: repeat(4, 1fr); } }

        /* LOADING */
        .ms-loader { display: flex; align-items: center; justify-content: center; min-height: 320px; }

        /* ERROR */
        .ms-error { display: flex; align-items: center; justify-content: center; min-height: 320px; }
        .ms-error-text { font-size: 13px; color: #f87171; background: rgba(239,68,68,0.07); border: 0.5px solid rgba(239,68,68,0.18); border-radius: 12px; padding: 14px 20px; }

        /* EMPTY STATE */
        .ms-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 340px; text-align: center; }
        .ms-empty-icon-wrap { width: 72px; height: 72px; border-radius: 20px; background: #0d0d18; border: 0.5px solid rgba(255,255,255,0.07); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .ms-empty-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 8px; letter-spacing: -0.3px; }
        .ms-empty-sub { font-size: 13px; color: #2a2a3a; font-weight: 300; max-width: 280px; line-height: 1.65; margin-bottom: 24px; }
        .ms-empty-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg,#7c3aed,#db2777); border: none; border-radius: 11px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; text-decoration: none; transition: all 0.2s; }
        .ms-empty-btn:hover { opacity: 0.85; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.3); }

        @media (max-width: 720px) {
          .ms-header, .ms-content { padding-left: 20px; padding-right: 20px; }
          .ms-stats { grid-template-columns: repeat(2, 1fr); }
          .ms-header { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
      `}</style>

      <div className="ms-root">

        {/* HEADER */}
        <div className="ms-header">
          <div className="ms-header-left">
            <div className="ms-header-eyebrow">Artist Portal</div>
            <div className="ms-header-title">My Songs</div>
            <div className="ms-header-sub">Your song portfolio and campaigns</div>
          </div>
          <Link href="/artist/raise-funds" className="ms-new-btn">
            <PlusCircle size={15} />
            New Campaign
          </Link>
        </div>

        <div className="ms-content">

          {/* LOADING */}
          {loading && (
            <div className="ms-loader">
              <Loader2 size={28} style={{ color: '#a855f7', animation: 'spin 1s linear infinite' }} />
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="ms-error">
              <span className="ms-error-text">{error}</span>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && songs.length === 0 && (
            <div className="ms-empty">
              <div className="ms-empty-icon-wrap">
                <Music size={28} style={{ color: '#2a2a3a' }} />
              </div>
              <div className="ms-empty-title">No songs yet</div>
              <p className="ms-empty-sub">
                Create your first campaign to start raising funds from fans.
              </p>
              <Link href="/artist/raise-funds" className="ms-empty-btn">
                <PlusCircle size={15} />
                Create First Campaign
              </Link>
            </div>
          )}

          {/* SONGS */}
          {!loading && !error && songs.length > 0 && (
            <>
              {/* STAT STRIP */}
              <div className="ms-section-label">Overview</div>
              <div className="ms-stats">
                <div className="ms-stat">
                  <div className="ms-stat-glow" style={{ background: 'rgba(168,85,247,0.4)' }} />
                  <div className="ms-stat-label">Total Songs</div>
                  <div className="ms-stat-value">{songs.length}</div>
                </div>
                <div className="ms-stat live">
                  <div className="ms-stat-glow" style={{ background: 'rgba(74,222,128,0.4)' }} />
                  <div className="ms-stat-label">Live Now</div>
                  <div className="ms-stat-value">
                    {songs.filter((s: any) => s.campaign?.status === 'live').length}
                  </div>
                </div>
                <div className="ms-stat raised">
                  <div className="ms-stat-glow" style={{ background: 'rgba(192,132,252,0.4)' }} />
                  <div className="ms-stat-label">Total Raised</div>
                  <div className="ms-stat-value">₹{totalRaised.toLocaleString('en-IN')}</div>
                </div>
                <div className="ms-stat released">
                  <div className="ms-stat-glow" style={{ background: 'rgba(56,189,248,0.4)' }} />
                  <div className="ms-stat-label">Released Funds</div>
                  <div className="ms-stat-value">₹{totalReleased.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* GRID */}
              <div className="ms-section-label">Catalogue</div>
              <div className="ms-grid">
                {songs.map((song: any) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </ArtistLayout>
  )
}