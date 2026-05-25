'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import FanLayout from '@/components/fan/FanLayout'
import { Loader2, Music } from 'lucide-react'

export default function FanInvestmentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/fan/login')
      return
    }

    fetch('/api/fan/investments')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setInvestments(j.data)
        }
      })
      .finally(() => setLoading(false))
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <FanLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-pink-400" />
        </div>
      </FanLayout>
    )
  }

  return (
    <FanLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-xl font-semibold">My Investments</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Your song ownership portfolio
          </p>
        </div>

        <div className="px-8 py-6">
          {investments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Music size={36} className="text-zinc-700 mb-3" />
              <p className="text-zinc-400">No investments yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              {investments.map((inv) => {
                const song = inv.campaign.song
                const analytics = inv.analytics

                return (
                  <div
                    key={inv.id}
                    className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden"
                  >
                    <div className="grid md:grid-cols-[220px_1fr]">
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

                      <div className="p-6">
                        <div className="mb-5">
                          <h2 className="text-xl font-semibold">
                            {song.title}
                          </h2>

                          <p className="text-zinc-500 mt-1">
                            {song.artist.name}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs text-zinc-500">
                              Invested
                            </p>
                            <p className="text-lg font-semibold">
                              ₹{inv.amount.toLocaleString('en-IN')}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs text-zinc-500">
                              Ownership
                            </p>
                            <p className="text-lg font-semibold text-pink-300">
                              {inv.ownershipPct.toFixed(2)}%
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs text-zinc-500">
                              Revenue Share Pool
                            </p>
                            <p className="text-lg font-semibold">
                              {inv.campaign.fanRevenueShare}%
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs text-zinc-500">
                              Streams
                            </p>
                            <p className="text-lg font-semibold">
                              {analytics.totalStreams.toLocaleString()}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs text-zinc-500">
                              Song Revenue
                            </p>
                            <p className="text-lg font-semibold">
                              ₹{analytics.totalRevenue.toLocaleString('en-IN')}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs text-zinc-500">
                              Estimated Payout
                            </p>
                            <p className="text-lg font-semibold text-emerald-300">
                              ₹{analytics.estimatedPayout.toLocaleString('en-IN')}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs text-zinc-500">
                              ROI
                            </p>
                            <p className="text-lg font-semibold text-emerald-300">
                              {analytics.roi.toFixed(1)}%
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs text-zinc-500">
                              Total Investors
                            </p>
                            <p className="text-lg font-semibold">
                              {analytics.totalInvestors}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs text-zinc-500">
                              Status
                            </p>
                            <p className="text-lg font-semibold capitalize">
                              {inv.status}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-600 mt-5">
                          Invested on{' '}
                          {new Date(inv.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </FanLayout>
  )
}