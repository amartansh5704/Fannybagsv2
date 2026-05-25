'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/investments')
      .then(r => r.json())
      .then(j => {
        if (j.success) setInvestments(j.data)
      })
  }, [])

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">All Investments</h1>

        <div className="space-y-4">
          {investments.map((inv) => (
            <div
              key={inv.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <h2 className="text-lg font-semibold">
                {inv.campaign.song.title}
              </h2>

              <p className="text-zinc-500">
                Fan: {inv.fan?.name}
              </p>

              <p className="text-zinc-500">
                Artist: {inv.campaign.song.artist?.name}
              </p>

              <div className="grid md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-xs text-zinc-500">Amount</p>
                  <p>₹{inv.amount}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Ownership</p>
                  <p>{inv.ownershipPct}%</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Streams</p>
                  <p>{inv.campaign.song.metrics?.totalStreams || 0}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Revenue</p>
                  <p>₹{inv.campaign.song.metrics?.totalRevenue || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}