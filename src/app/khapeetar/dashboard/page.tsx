'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import { Inbox, Zap, CheckCircle, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function KhapeetarDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [deals, setDeals]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/khapeetar/login'); return }

    fetch('/api/deals')
      .then(r => r.json())
      .then(j => { if (j.success) setDeals(j.data) })
      .finally(() => setLoading(false))
  }, [session, status])

  const pending = deals.filter(d => d.status === 'pending').length
  const active  = deals.filter(d => d.status === 'active').length
  const done    = deals.filter(d => d.status === 'completed').length

  if (status === 'loading') {
    return (
      <KhapeetarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-emerald-400" size={28} />
        </div>
      </KhapeetarLayout>
    )
  }

  return (
    <KhapeetarLayout>
      <div className="min-h-screen bg-black">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Welcome back, <span className="text-white">{session?.user?.name}</span>
          </p>
        </div>

        <div className="px-8 py-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-400" size={28} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Clock,       label: 'Pending Requests', val: pending, color: 'text-amber-300',   bg: 'from-amber-500/10'   },
                  { icon: Zap,         label: 'Active Deals',     val: active,  color: 'text-emerald-300', bg: 'from-emerald-500/10' },
                  { icon: CheckCircle, label: 'Completed',        val: done,    color: 'text-blue-300',    bg: 'from-blue-500/10'    },
                ].map(({ icon: Icon, label, val, color, bg }) => (
                  <div key={label} className={`bg-gradient-to-br ${bg} to-transparent border border-white/8 rounded-2xl p-5`}>
                    <Icon size={18} className={`${color} mb-3`} />
                    <p className="text-2xl font-bold text-white">{val}</p>
                    <p className="text-xs text-zinc-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/khapeetar/deals"
                  className="flex items-center gap-4 bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
                  <Inbox size={20} className="text-emerald-400" />
                  <div>
                    <p className="font-medium">All Deals</p>
                    <p className="text-xs text-zinc-500 mt-0.5">View and manage incoming work requests</p>
                  </div>
                </Link>
                <Link href="/khapeetar/active-deals"
                  className="flex items-center gap-4 bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
                  <Zap size={20} className="text-yellow-400" />
                  <div>
                    <p className="font-medium">Active Deals</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Manage your ongoing work</p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </KhapeetarLayout>
  )
}