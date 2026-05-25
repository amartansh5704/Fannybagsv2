'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import { Loader2, Music } from 'lucide-react'

export default function KhapeetarFindSongsPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/fan/discover')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setSongs(j.data)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <KhapeetarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-emerald-400" size={30} />
        </div>
      </KhapeetarLayout>
    )
  }

  return (
    <KhapeetarLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-xl font-semibold">Find Songs</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Discover artists and send collaboration requests
          </p>
        </div>

        <div className="px-8 py-6">
          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Music size={36} className="text-zinc-700 mb-3" />
              <p className="text-zinc-400">No songs available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {songs.map((song) => {
                const progress =
                  (song.campaign.amountRaised /
                    song.campaign.totalFundingAsk) *
                  100

                return (
                  <Link
                    key={song.id}
                    href={`/khapeetar/find-songs/${song.id}`}
                    className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all"
                  >
                    <div className="aspect-square bg-zinc-900">
                      {song.coverArtUrl ? (
                        <img
                          src={song.coverArtUrl}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music size={40} className="text-zinc-700" />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-lg">
                        {song.title}
                      </h3>

                      <p className="text-sm text-zinc-500 mt-1">
                        {song.artist?.name}
                      </p>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Raised</span>
                          <span>
                            ₹
                            {song.campaign.amountRaised.toLocaleString(
                              'en-IN'
                            )}
                          </span>
                        </div>

                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">
                            ₹
                            {song.campaign.totalFundingAsk.toLocaleString(
                              'en-IN'
                            )}
                          </span>

                          <span className="text-emerald-300">
                            Send Request
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </KhapeetarLayout>
  )
}