'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/deals')
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setDeals(j.data)
        }
      })
  }, [])

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">
          All Deals
        </h1>

        <div className="space-y-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <h2 className="text-lg font-semibold">
                {deal.projectTitle}
              </h2>

              <p className="text-zinc-500 mt-1">
                Artist: {deal.artist?.name || 'Unknown'}
              </p>

              <p className="text-zinc-500">
                Khapeetar: {deal.khapeetar?.name || 'Unknown'}
              </p>

              <div className="grid md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-xs text-zinc-500">Budget</p>
                  <p>₹{deal.budget}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Counter</p>
                  <p>₹{deal.counterBudget || 0}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Accepted</p>
                  <p>₹{deal.acceptedBudget || 0}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Status</p>
                  <p>{deal.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}