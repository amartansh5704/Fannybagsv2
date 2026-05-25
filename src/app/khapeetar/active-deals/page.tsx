'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import {
  Loader2, Zap, MessageSquare,
  Clock, ShieldCheck,
} from 'lucide-react'
import { formatINR } from '@/lib/utils'

export default function ActiveDeals() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [deals, setDeals]           = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)

  const fetchDeals = () => {
    fetch('/api/deals')
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          // Show active AND completed so they can see their history
          setDeals(j.data.filter((d: any) => d.status === 'active' || d.status === 'completed'))
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/khapeetar/login'); return }
    fetchDeals()
  }, [session, status])

  const markComplete = async (id: string) => {
    setCompleting(id)
    try {
      const res  = await fetch(`/api/deals/${id}/complete`, { method: 'POST' })
      const json = await res.json()
      if (!json.success) alert(json.error || 'Could not mark complete')
      else fetchDeals()
    } finally {
      setCompleting(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <KhapeetarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-emerald-400" />
        </div>
      </KhapeetarLayout>
    )
  }

  return (
    <KhapeetarLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-lg font-semibold">Active Deals</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Your ongoing and completed work</p>
        </div>

        <div className="px-8 py-6">
          {deals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Zap size={36} className="text-zinc-700 mb-3" />
              <p className="text-zinc-400">No active deals yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deals.map(deal => (
                <div
                  key={deal.id}
                  className={`border rounded-2xl p-5 ${
                    deal.status === 'completed'
                      ? 'bg-purple-500/5 border-purple-500/15'
                      : 'bg-emerald-500/5 border-emerald-500/20'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{deal.projectTitle}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${
                      deal.status === 'completed'
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {deal.status}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400 mt-1 mb-4">{deal.description}</p>

                  {/* Budget */}
                  <div className="flex gap-3 mb-4 flex-wrap">
                    <div className="bg-white/5 rounded-xl px-3 py-2">
                      <p className="text-xs text-zinc-600">
                        {deal.status === 'completed' ? 'Paid Out' : 'Escrowed'}
                      </p>
                      <p className={`text-sm font-medium ${
                        deal.status === 'completed' ? 'text-purple-300' : 'text-emerald-300'
                      }`}>
                        {/* Show khapeetar's 90% cut */}
                        {formatINR(Math.round((deal.acceptedBudget || deal.budget) * 0.90))}
                        <span className="text-xs text-zinc-600 ml-1">your cut</span>
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl px-3 py-2">
                      <p className="text-xs text-zinc-600">Deal Value</p>
                      <p className="text-sm text-zinc-300">
                        {formatINR(deal.acceptedBudget || deal.budget)}
                      </p>
                    </div>
                  </div>

                  {/* ── ACTIVE: chat + complete deal ── */}
                  {deal.status === 'active' && (
                    <div className="flex gap-2 flex-wrap items-center">
                      <button
                        onClick={() => router.push(`/deals/chat/${deal.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm hover:bg-emerald-500/25 transition-all"
                      >
                        <MessageSquare size={14} /> Open Chat
                      </button>

                      {deal.khapeetarCompleted ? (
                        // Khapeetar already clicked — waiting on artist
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-zinc-500 rounded-xl text-sm">
                          <Clock size={14} />
                          Waiting for Artist
                        </div>
                      ) : (
                        <button
                          onClick={() => markComplete(deal.id)}
                          disabled={completing === deal.id}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium rounded-xl text-sm transition-all disabled:opacity-50"
                        >
                          {completing === deal.id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <ShieldCheck size={14} />
                          }
                          Complete Deal
                        </button>
                      )}
                    </div>
                  )}

                  {/* ── COMPLETED ── */}
                  {deal.status === 'completed' && (
                    <div className="flex items-center gap-2 text-sm text-purple-400">
                      <ShieldCheck size={14} />
                      Completed · {formatINR(Math.round((deal.acceptedBudget || deal.budget) * 0.90))} paid to your wallet
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </KhapeetarLayout>
  )
}