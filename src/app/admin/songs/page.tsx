'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/songs')
      .then(r => r.json())
      .then(j => {
        if (j.success) setSongs(j.data)
      })
  }, [])

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">All Songs</h1>

        <div className="space-y-5">
          {songs.map(song => (
            <Link
              key={song.id}
              href={`/admin/songs/${song.id}`}
              className="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-500/40 transition"
            >
              <h2 className="text-xl font-semibold">{song.title}</h2>
              <p className="text-zinc-500">{song.artist?.name}</p>

              <div className="grid md:grid-cols-4 gap-4 mt-5">
                <div>
                  <p className="text-xs text-zinc-500">Language</p>
                  <p>{song.language}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Funding Ask</p>
                  <p>₹{song.campaign?.totalFundingAsk || 0}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Revenue Share</p>
                  <p>{song.campaign?.fanRevenueShare || 0}%</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Status</p>
                  <p>{song.campaign?.status}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}