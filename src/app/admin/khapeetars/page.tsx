'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminKhapeetarsPage() {
  const [khapeetars, setKhapeetars] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/khapeetars')
      .then(r => r.json())
      .then(j => {
        if (j.success) setKhapeetars(j.data)
      })
  }, [])

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">All Khapeetars</h1>

        <div className="space-y-4">
          {khapeetars.map((k) => (
            <div
              key={k.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <h2 className="text-lg font-semibold">{k.name}</h2>
              <p className="text-zinc-500">{k.city}</p>
              <p className="text-zinc-400 mt-3">{k.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}