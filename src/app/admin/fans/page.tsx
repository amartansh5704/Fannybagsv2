'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminFansPage() {
  const [fans, setFans] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/users?role=fan')
      .then(r => r.json())
      .then(j => {
        if (j.success) setFans(j.data)
      })
  }, [])

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Fans</h1>

        <div className="space-y-4">
          {fans.map(fan => (
            <div
              key={fan.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <p className="font-semibold">{fan.name}</p>
              <p className="text-zinc-500">{fan.email}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}