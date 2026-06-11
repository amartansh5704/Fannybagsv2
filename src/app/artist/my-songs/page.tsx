'use client'

import { useEffect, useState } from 'react'
import ArtistLayout from '@/components/artist/ArtistLayout'
import SongCard from '@/components/artist/SongCard'
import { PlusCircle, Music, Loader2, Share2, Check } from 'lucide-react'
import Link from 'next/link'

export default function MySongsPage() {
  const [songs, setSongs]       = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/songs')
      .then(r => r.json())
      .then(j => {
        if (j.success) setSongs(j.data)
        else setError('Failed to load songs')
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [])

  const totalRaised = songs.reduce((a: number, s: any) => a + (s.campaign?.amountRaised ?? 0), 0)
  const totalReleased = songs
    .filter((s: any) => s.campaign?.fundsReleased)
    .reduce((a: number, s: any) => a + ((s.campaign?.amountRaised ?? 0) * 0.95), 0)

  const handleShare = async (song: any) => {
    const url  = `${window.location.origin}/fan/discover/${song.id}`
    const text = `🎵 Check out "${song.title}" on FannyBags!`

    if (navigator.share) {
      try {
        await navigator.share({ title: song.title, text, url })
        return
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(song.id)
      setTimeout(() => setCopiedId(null), 2500)
    } catch {
      prompt('Copy this link:', url)
    }
  }

  return (
    <ArtistLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .ms-root { min-height: 100vh; background: #09090f; color: #f0f0f8; font-family: 'DM Sans', sans-serif; }
        .ms-header { padding: 30px 40px 26px; border-bottom: 0.5px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; }
        .ms-new-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; background: linear-gradient(135deg, #7c3aed, #db2777); border: none; border-radius: 11px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.2s; }
        .ms-content { padding: 32px 40px; }
        .ms-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 36px; }
        .ms-stat { background: #0d0d18; border: 0.5px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 18px 20px; position: relative; }
        .ms-song-item { position: relative; }
        
        /* Permanent Share Button */
        .ms-share-btn {
          position: absolute; bottom: 12px; right: 12px; z-index: 10;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 10px; border: 1px solid;
          font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s;
          backdrop-filter: blur(12px);
        }
        .ms-share-btn.idle {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
          color: #a1a1aa;
        }
        .ms-share-btn.idle:hover {
          background: rgba(139,92,246,0.15);
          border-color: rgba(139,92,246,0.3);
          color: #c4b5fd;
        }
        .ms-share-btn.copied {
          background: rgba(16,185,129,0.1);
          border-color: rgba(16,185,129,0.3);
          color: #34d399;
        }

        .ms-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 14px; }
        @media (min-width: 640px)  { .ms-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .ms-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1280px) { .ms-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>

      <div className="ms-root">
        <div className="ms-header">
          <div>
            <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'#444' }}>Artist Portal</div>
            <div style={{ fontFamily:'Syne', fontSize:24, fontWeight:800 }}>My Songs</div>
          </div>
          <Link href="/artist/raise-funds" className="ms-new-btn"><PlusCircle size={15} /> New Campaign</Link>
        </div>

        <div className="ms-content">
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:40 }}><Loader2 size={28} style={{ color:'#a855f7', animation:'spin 1s linear infinite' }} /></div>
          ) : songs.length === 0 ? (
            <div style={{ textAlign:'center', padding:40 }}>No songs found</div>
          ) : (
            <div className="ms-grid">
              {songs.map((song: any) => (
                <div key={song.id} className="ms-song-item">
                  <SongCard song={song} />
                  <button 
                    className={`ms-share-btn ${copiedId === song.id ? 'copied' : 'idle'}`}
                    onClick={(e) => { e.preventDefault(); handleShare(song); }}
                  >
                    {copiedId === song.id ? <><Check size={12} /> Copied</> : <><Share2 size={12} /> Share Link</>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ArtistLayout>
  )
}