'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/users?role=artist')
      .then(r => r.json())
      .then(j => {
        if (j.success) setArtists(j.data)
      })
  }, [])

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Artists</h1>

        <div className="space-y-4">
          {artists.map(artist => (
            <div
              key={artist.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <p className="font-semibold">{artist.name}</p>
              <p className="text-zinc-500">{artist.email}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}