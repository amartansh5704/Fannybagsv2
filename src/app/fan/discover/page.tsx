'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FanLayout from '@/components/fan/FanLayout'
import { Loader2, Music } from 'lucide-react'

export default function FanDiscoverPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/fan/login')
      return
    }

    fetch('/api/fan/discover')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setSongs(j.data)
        }
      })
      .finally(() => setLoading(false))
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <FanLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-pink-400" size={30} />
        </div>
      </FanLayout>
    )
  }

  return (
    <FanLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-xl font-semibold">Discover Songs</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Invest in live artist campaigns
          </p>
        </div>

        <div className="px-8 py-6">
          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Music size={36} className="text-zinc-700 mb-3" />
              <p className="text-zinc-400">No live campaigns</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {songs.map((song) => {
                const progress =
                  (song.campaign.amountRaised / song.campaign.totalFundingAsk) *
                  100

                return (
                  <Link
                    key={song.id}
                    href={`/fan/discover/${song.id}`}
                    className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-pink-500/20 transition-all"
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
                            ₹{song.campaign.amountRaised.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">
                            Target ₹
                            {song.campaign.totalFundingAsk.toLocaleString(
                              'en-IN'
                            )}
                          </span>

                          <span className="text-pink-300">
                            {song.campaign.fanRevenueShare}% share
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
    </FanLayout>
  )
}