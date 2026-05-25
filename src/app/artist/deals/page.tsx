'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import {
  Loader2,
  Briefcase,
  CheckCircle,
  XCircle,
  MessageCircle,
  Clock,
  ShieldCheck,
  Crown,
} from 'lucide-react'
import { formatINR } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  accepted: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  countered: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  cancelled: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  completed: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
}

export default function ArtistDealsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [completing, setCompleting] = useState<string | null>(null)

  const fetchDeals = () => {
    fetch('/api/deals')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setDeals(j.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/artist/login')
      return
    }

    fetchDeals()
  }, [session, status])

  const act = async (
    id: string,
    action: string,
    extra?: Record<string, any>
  ) => {
    setActing(id)

    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...extra,
        }),
      })

      const json = await res.json()

      if (!json.success) {
        alert(json.error || 'Action failed')
      } else {
        fetchDeals()
      }
    } finally {
      setActing(null)
    }
  }

  const counterDeal = async (dealId: string) => {
    const amount = prompt('Enter counter amount')
    if (!amount) return

    const msg = prompt('Counter message (optional)')

    await act(dealId, 'counter', {
      counterBudget: Number(amount),
      counterMessage: msg || '',
    })
  }

  const selectCandidate = async (deal: any) => {
    const amount =
      deal.acceptedBudget ||
      deal.counterBudget ||
      deal.budget

    const ok = confirm(
      `Escrow ${formatINR(amount)} and select ${deal.khapeetar?.name}?`
    )

    if (!ok) return

    await act(deal.id, 'select_candidate')
  }

  const markComplete = async (id: string) => {
    setCompleting(id)

    try {
      const res = await fetch(`/api/deals/${id}/complete`, {
        method: 'POST',
      })

      const json = await res.json()

      if (!json.success) {
        alert(json.error || 'Could not mark complete')
      } else {
        fetchDeals()
      }
    } finally {
      setCompleting(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <ArtistLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-purple-400" />
        </div>
      </ArtistLayout>
    )
  }

  return (
    <ArtistLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-lg font-semibold">Work & Deals</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage negotiations and collaborations
          </p>
        </div>

        <div className="px-8 py-6">
          {deals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Briefcase size={36} className="text-zinc-700 mb-3" />
              <p className="text-zinc-400">No deals yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deals.map((deal) => {
                const isKhapeetarOrigin =
                  deal.negotiationStage === 'khapeetar_offer'

                return (
                  <div
                    key={deal.id}
                    className="bg-white/3 border border-white/8 rounded-2xl p-5"
                  >
                    <div className="flex justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">
                          {deal.projectTitle}
                        </h3>

                        <p className="text-sm text-zinc-500">
                          {deal.khapeetar?.name} · {deal.workType}
                        </p>

                        {isKhapeetarOrigin && (
                          <p className="text-xs text-emerald-400 mt-1">
                            Incoming request from khapeetar
                          </p>
                        )}

                        {deal.offerGroupId && (
                          <p className="text-xs text-cyan-400 mt-1">
                            Multi-offer candidate
                          </p>
                        )}
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full border capitalize ${
                          STATUS_STYLES[deal.status] ?? ''
                        }`}
                      >
                        {deal.status}
                      </span>
                    </div>

                    <p className="text-zinc-400 text-sm mb-4">
                      {deal.description}
                    </p>

                    <div className="flex gap-3 mb-4 flex-wrap">
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-xs text-zinc-600">Budget</p>
                        <p className="text-sm font-medium">
                          {formatINR(deal.budget)}
                        </p>
                      </div>

                      {deal.counterBudget && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                          <p className="text-xs text-zinc-600">
                            Counter Offer
                          </p>
                          <p className="text-sm text-amber-300">
                            {formatINR(deal.counterBudget)}
                          </p>
                        </div>
                      )}

                      {deal.escrowAmount && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                          <p className="text-xs text-zinc-600">
                            Escrow
                          </p>
                          <p className="text-sm text-emerald-300">
                            {formatINR(deal.escrowAmount)}
                          </p>
                        </div>
                      )}
                    </div>

                    {deal.counterMessage && (
                      <div className="bg-white/5 rounded-xl p-3 mb-4">
                        <p className="text-xs text-zinc-500 mb-1">
                          Message
                        </p>
                        <p className="text-sm text-zinc-300">
                          {deal.counterMessage}
                        </p>
                      </div>
                    )}

                    {/* PENDING KHAPEETAR OFFER */}
                    {deal.status === 'pending' &&
                      isKhapeetarOrigin && (
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => act(deal.id, 'accept')}
                            disabled={acting === deal.id}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm"
                          >
                            <CheckCircle size={14} />
                            Accept
                          </button>

                          <button
                            onClick={() => counterDeal(deal.id)}
                            className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-xl text-sm"
                          >
                            Counter
                          </button>

                          <button
                            onClick={() => act(deal.id, 'reject')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      )}

                    {/* COUNTER */}
                    {deal.status === 'countered' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            act(deal.id, 'accept_counter')
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm"
                        >
                          <CheckCircle size={14} />
                          Accept Counter
                        </button>

                        <button
                          onClick={() =>
                            act(deal.id, 'reject_counter')
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    )}

                    {/* ACCEPTED CANDIDATE */}
                    {deal.status === 'accepted' && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => selectCandidate(deal)}
                          disabled={acting === deal.id}
                          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 rounded-xl text-sm"
                        >
                          <Crown size={14} />
                          Select Candidate & Fund Escrow
                        </button>
                      </div>
                    )}

                    {/* ACTIVE */}
                    {deal.status === 'active' && (
                      <div className="flex gap-2 flex-wrap items-center">
                        <button
                          onClick={() =>
                            router.push(`/deals/chat/${deal.id}`)
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500/15 border border-purple-500/30 text-purple-300 rounded-xl text-sm"
                        >
                          <MessageCircle size={14} />
                          Open Chat
                        </button>

                        {deal.artistCompleted ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-zinc-500 rounded-xl text-sm">
                            <Clock size={14} />
                            Waiting for Khapeetar
                          </div>
                        ) : (
                          <button
                            onClick={() => markComplete(deal.id)}
                            disabled={completing === deal.id}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm"
                          >
                            <ShieldCheck size={14} />
                            Complete Deal
                          </button>
                        )}
                      </div>
                    )}

                    {deal.status === 'completed' && (
                      <div className="flex items-center gap-2 text-sm text-purple-400">
                        <ShieldCheck size={14} />
                        Deal completed
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ArtistLayout>
  )
}