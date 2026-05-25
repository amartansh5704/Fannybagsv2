'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import {
  Loader2,
  Inbox,
  CheckCircle,
  XCircle,
  RefreshCcw,
  X,
  MessageCircle,
  ShieldCheck,
  Clock,
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

export default function KhapeetarDealsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [completing, setCompleting] = useState<string | null>(null)

  const [counterOpen, setCounterOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [counterBudget, setCounterBudget] = useState('')
  const [counterMessage, setCounterMessage] = useState('')

  const fetchDeals = () => {
    fetch('/api/deals')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setDeals(j.data)
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/khapeetar/login')
      return
    }

    fetchDeals()
  }, [session, status])

  const action = async (
    id: string,
    act: string,
    extra = {}
  ) => {
    setActing(id)

    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: act,
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

  const markComplete = async (id: string) => {
    setCompleting(id)

    try {
      const res = await fetch(`/api/deals/${id}/complete`, {
        method: 'POST',
      })

      const json = await res.json()

      if (!json.success) {
        alert(json.error || 'Could not complete deal')
      } else {
        fetchDeals()
      }
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
          <h1 className="text-lg font-semibold">All Deals</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage collaborations and negotiations
          </p>
        </div>

        <div className="px-8 py-6">
          {deals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Inbox size={36} className="text-zinc-700 mb-3" />
              <p className="text-zinc-400">No deals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deals.map((deal) => {
                const outgoing =
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
                          {outgoing
                            ? `Sent to ${deal.artist?.name || 'Artist'}`
                            : `From ${deal.artist?.name || 'Artist'}`}
                        </p>

                        <p className="text-xs mt-1 text-emerald-400">
                          {outgoing
                            ? 'Your request'
                            : 'Incoming request'}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full border capitalize ${
                          STATUS_STYLES[deal.status] || ''
                        }`}
                      >
                        {deal.status}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-400 mb-4">
                      {deal.description}
                    </p>

                    <div className="flex gap-3 mb-4 flex-wrap">
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-xs text-zinc-600">
                          Budget
                        </p>
                        <p>{formatINR(deal.budget)}</p>
                      </div>

                      {deal.counterBudget && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                          <p className="text-xs text-zinc-600">
                            Counter
                          </p>
                          <p className="text-amber-300">
                            {formatINR(deal.counterBudget)}
                          </p>
                        </div>
                      )}

                      {deal.deadline && (
                        <div className="bg-white/5 rounded-xl px-3 py-2">
                          <p className="text-xs text-zinc-600">
                            Deadline
                          </p>
                          <p>
                            {new Date(
                              deal.deadline
                            ).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      )}
                    </div>

                    {deal.message && (
                      <div className="bg-white/5 rounded-xl p-3 mb-4">
                        <p className="text-xs text-zinc-500 mb-1">
                          Message
                        </p>
                        <p className="text-sm text-zinc-300">
                          {deal.message}
                        </p>
                      </div>
                    )}

                    {/* INCOMING ARTIST REQUEST */}
                    {!outgoing && deal.status === 'pending' && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            action(deal.id, 'accept')
                          }
                          disabled={acting === deal.id}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-sm"
                        >
                          <CheckCircle size={14} />
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            action(deal.id, 'reject')
                          }
                          disabled={acting === deal.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-sm"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDeal(deal)
                            setCounterOpen(true)
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm"
                        >
                          <RefreshCcw size={14} />
                          Counter
                        </button>
                      </div>
                    )}

                    {/* OUTGOING COUNTER RESPONSE */}
                    {outgoing &&
                      deal.status === 'countered' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              action(
                                deal.id,
                                'accept_counter'
                              )
                            }
                            disabled={acting === deal.id}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-sm"
                          >
                            <CheckCircle size={14} />
                            Accept Counter
                          </button>

                          <button
                            onClick={() =>
                              action(
                                deal.id,
                                'reject_counter'
                              )
                            }
                            disabled={acting === deal.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-sm"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      )}

                    {/* ACCEPTED */}
{deal.status === 'accepted' && (
  <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-xl text-sm">
    <Clock size={14} />
    Waiting for artist selection
  </div>
)}
                    
                    {/* ACTIVE */}
                    {deal.status === 'active' && (
                      <div className="flex gap-2 flex-wrap items-center">
                        <button
                          onClick={() =>
                            router.push(
                              `/deals/chat/${deal.id}`
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500/15 border border-purple-500/30 text-purple-300 rounded-xl text-sm"
                        >
                          <MessageCircle size={14} />
                          Open Chat
                        </button>

                        {deal.khapeetarCompleted ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-zinc-500 rounded-xl text-sm">
                            <Clock size={14} />
                            Waiting for Artist
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              markComplete(deal.id)
                            }
                            disabled={
                              completing === deal.id
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-sm"
                          >
                            {completing === deal.id ? (
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <ShieldCheck size={14} />
                            )}
                            Complete Deal
                          </button>
                        )}
                      </div>
                    )}

                    {deal.status === 'cancelled' && deal.offerGroupId && (
  <div className="flex items-center gap-2 text-sm text-zinc-400">
    <XCircle size={14} />
    Artist selected another khapeetar
  </div>
)}

                    {/* COMPLETED */}
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

        {counterOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">
                  Counter Offer
                </h2>

                <button
                  onClick={() => setCounterOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  value={counterBudget}
                  onChange={(e) =>
                    setCounterBudget(e.target.value)
                  }
                  placeholder="Counter amount"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
                />

                <textarea
                  value={counterMessage}
                  onChange={(e) =>
                    setCounterMessage(e.target.value)
                  }
                  placeholder="Message"
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
                />

                <button
                  onClick={async () => {
                    await action(selectedDeal.id, 'counter', {
                      counterBudget,
                      counterMessage,
                    })

                    setCounterOpen(false)
                    setCounterBudget('')
                    setCounterMessage('')
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-black font-semibold"
                >
                  Send Counter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </KhapeetarLayout>
  )
}