'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import FanLayout from '@/components/fan/FanLayout'
import { Loader2, TrendingUp } from 'lucide-react'

export default function FanDashboardPage() {
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

  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.amount,
    0
  )

  const totalPayout = investments.reduce(
    (sum, inv) => sum + inv.analytics.estimatedPayout,
    0
  )

  const totalStreams = investments.reduce(
    (sum, inv) => sum + inv.analytics.totalStreams,
    0
  )

  const avgROI =
    investments.length > 0
      ? investments.reduce((sum, inv) => sum + inv.analytics.roi, 0) /
        investments.length
      : 0

  return (
    <FanLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-xl font-semibold">Fan Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Your investment performance
          </p>
        </div>

        <div className="px-8 py-6">
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-5">
              <p className="text-zinc-500 text-sm">Total Invested</p>
              <p className="text-2xl font-bold mt-2">
                ₹{totalInvested.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <p className="text-zinc-500 text-sm">Estimated Returns</p>
              <p className="text-2xl font-bold mt-2 text-emerald-300">
                ₹{totalPayout.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <p className="text-zinc-500 text-sm">Portfolio Streams</p>
              <p className="text-2xl font-bold mt-2">
                {totalStreams.toLocaleString()}
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5">
              <p className="text-zinc-500 text-sm">Avg ROI</p>
              <p className="text-2xl font-bold mt-2 text-pink-300">
                {avgROI.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp className="text-pink-400" />
              <h2 className="text-lg font-semibold">
                Active Investments
              </h2>
            </div>

            {investments.length === 0 ? (
              <p className="text-zinc-500">
                No investments yet
              </p>
            ) : (
              <div className="space-y-4">
                {investments.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex justify-between items-center border-b border-white/5 pb-4"
                  >
                    <div>
                      <p className="font-medium">
                        {inv.campaign.song.title}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {inv.campaign.song.artist.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-pink-300 font-semibold">
                        {inv.ownershipPct.toFixed(2)}%
                      </p>
                      <p className="text-sm text-zinc-500">
                        ₹{inv.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </FanLayout>
  )
}