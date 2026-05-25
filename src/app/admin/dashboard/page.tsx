'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2 } from 'lucide-react'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'admin') {
      router.push('/')
      return
    }

    fetch('/api/admin/overview')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setStats(j.data)
        }
      })
      .finally(() => setLoading(false))
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-red-400" />
        </div>
      </AdminLayout>
    )
  }

  const cards = [
    ['Songs', stats.songs],
    ['Artists', stats.artists],
    ['Fans', stats.fans],
    ['Khapeetars', stats.khapeetars],
    ['Investments', stats.investments],
    ['Deals', stats.deals],
    ['Revenue', `₹${stats.totalRevenue.toLocaleString('en-IN')}`],
  ]

  return (
    <AdminLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Platform control center
          </p>
        </div>

        <div className="px-8 py-6 grid md:grid-cols-3 xl:grid-cols-4 gap-5">
          {cards.map(([label, value]) => (
            <div
              key={label}
              className="bg-white/5 border border-white/8 rounded-2xl p-6"
            >
              <p className="text-zinc-500 text-sm">{label}</p>
              <p className="text-2xl font-bold mt-3">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}