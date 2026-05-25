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
        if (j.success) {
          setSongs(j.data)
        } else {
          setError('Failed to load songs')
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [])

  const totalRaised = songs.reduce(
    (a: number, s: any) => a + (s.campaign?.amountRaised ?? 0),
    0
  )

  const totalReleased = songs
    .filter((s: any) => s.campaign?.fundsReleased)
    .reduce(
      (a: number, s: any) =>
        a + ((s.campaign?.amountRaised ?? 0) * 0.95),
      0
    )

  return (
    <ArtistLayout>
      <div className="min-h-screen bg-black">
        <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">My Songs</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Your song portfolio and campaigns
            </p>
          </div>

          <Link
            href="/artist/raise-funds"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all"
          >
            <PlusCircle size={15} />
            New Campaign
          </Link>
        </div>

        <div className="px-8 py-6">
          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2
                className="animate-spin text-purple-400"
                size={32}
              />
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center py-24">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && songs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
                <Music size={24} className="text-zinc-600" />
              </div>

              <h3 className="text-base font-medium text-zinc-300 mb-2">
                No songs yet
              </h3>

              <p className="text-sm text-zinc-600 mb-6 max-w-xs">
                Create your first campaign to start raising funds
                from fans.
              </p>

              <Link
                href="/artist/raise-funds"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium"
              >
                <PlusCircle size={15} />
                Create First Campaign
              </Link>
            </div>
          )}

          {!loading && songs.length > 0 && (
            <>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  {
                    label: 'Total Songs',
                    val: songs.length,
                  },
                  {
                    label: 'Live',
                    val: songs.filter(
                      (s: any) => s.campaign?.status === 'live'
                    ).length,
                  },
                  {
                    label: 'Total Raised',
                    val: `₹${totalRaised.toLocaleString('en-IN')}`,
                  },
                  {
                    label: 'Released Funds',
                    val: `₹${totalReleased.toLocaleString('en-IN')}`,
                  },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    className="bg-white/3 border border-white/8 rounded-xl px-4 py-3"
                  >
                    <p className="text-xs text-zinc-500 mb-1">
                      {label}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {val}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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