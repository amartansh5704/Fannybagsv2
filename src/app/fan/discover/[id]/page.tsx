'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import FanLayout from '@/components/fan/FanLayout'
import { Loader2, Music } from 'lucide-react'

export default function SongDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [song, setSong] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [investing, setInvesting] = useState(false)

  const loadWallet = async () => {
    const res = await fetch('/api/wallet')
    const data = await res.json()

    if (data.success) {
      setWallet(data.data.wallet)
    }
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/fan/login')
      return
    }

    Promise.all([
      fetch(`/api/songs/${params.id}`).then((r) => r.json()),
      fetch('/api/wallet').then((r) => r.json()),
    ])
      .then(([songRes, walletRes]) => {
        if (songRes.success) {
          setSong(songRes.data)
        }

        if (walletRes.success) {
          setWallet(walletRes.data.wallet)
        }
      })
      .finally(() => setLoading(false))
  }, [session, status])

  const deposit = async () => {
    const depositAmount = prompt('Enter deposit amount')

    if (!depositAmount) return

    await fetch('/api/wallet/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Number(depositAmount),
      }),
    })

    await loadWallet()
  }

  const invest = async () => {
    setInvesting(true)

    const res = await fetch('/api/investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: song.campaign.id,
        amount: Number(amount),
      }),
    })

    const json = await res.json()

    if (json.success) {
      alert('Investment successful')
      setAmount('')
      dialogRef.current?.close()
      await loadWallet()
    } else {
      alert(json.error)
    }

    setInvesting(false)
  }

  if (status === 'loading' || loading) {
    return (
      <FanLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-pink-400" />
        </div>
      </FanLayout>
    )
  }

  const progress =
    (song.campaign.amountRaised / song.campaign.totalFundingAsk) * 100

  const investAmount = Number(amount || 0)
  const insufficient = investAmount > (wallet?.balance || 0)

  const ownership =
    investAmount > 0
      ? (
          (investAmount / song.campaign.totalFundingAsk) *
          song.campaign.fanRevenueShare
        ).toFixed(2)
      : 0

  return (
    <FanLayout>
      <div className="min-h-screen bg-black text-white px-8 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-white/5 rounded-xl"
        >
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-900">
              {song.coverArtUrl ? (
                <img
                  src={song.coverArtUrl}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={48} className="text-zinc-700" />
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold">{song.title}</h1>
            <p className="text-zinc-500 mt-2">{song.artist.name}</p>

            {song.demoUrl && (
              <audio controls className="w-full mt-6">
                <source src={song.demoUrl} />
              </audio>
            )}

            <p className="mt-6 text-zinc-300">
              {song.campaign.campaignStory || song.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-zinc-500 text-sm">Target</p>
                <p className="text-xl font-semibold">
                  ₹{song.campaign.totalFundingAsk.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-zinc-500 text-sm">Raised</p>
                <p className="text-xl font-semibold">
                  ₹{song.campaign.amountRaised.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-zinc-500 text-sm">Revenue Share</p>
                <p className="text-xl font-semibold text-pink-300">
                  {song.campaign.fanRevenueShare}%
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-zinc-500 text-sm">Wallet Balance</p>
                <p className="text-xl font-semibold text-green-400">
                  ₹{wallet?.balance || 0}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => dialogRef.current?.showModal()}
              className="w-full mt-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-medium"
            >
              Buy Revenue Share
            </button>
          </div>
        </div>

        <dialog
          ref={dialogRef}
          className="rounded-2xl p-6 w-[500px] max-w-full"
        >
          <h2 className="text-2xl font-bold mb-4">Invest in Song</h2>

          <div className="mb-4 p-4 rounded-xl bg-zinc-100">
            <p>Wallet Balance: ₹{wallet?.balance || 0}</p>
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border p-3 rounded-xl mb-4"
          />

          {investAmount > 0 && (
            <div className="mb-4 space-y-2">
              <p>You will own: {ownership}%</p>

              {insufficient && (
                <div className="bg-red-100 text-red-600 p-3 rounded-xl">
                  Insufficient funds
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={deposit}
              className="flex-1 py-3 bg-blue-500 text-white rounded-xl"
            >
              Deposit Money
            </button>

            <button
              onClick={invest}
              disabled={insufficient || investing}
              className="flex-1 py-3 bg-pink-500 text-white rounded-xl disabled:opacity-50"
            >
              {investing ? 'Investing...' : 'Confirm Investment'}
            </button>
          </div>
        </dialog>
      </div>
    </FanLayout>
  )
}