'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ArtistLayout from '@/components/artist/ArtistLayout'
import {
  Loader2,
  MapPin,
  Wallet,
  User,
  Briefcase,
} from 'lucide-react'

export default function KhapeetarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const requestDialogRef = useRef<HTMLDialogElement>(null)
  const depositDialogRef = useRef<HTMLDialogElement>(null)

  const id = params.id as string

  const [profile, setProfile] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [depositing, setDepositing] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')

  const [form, setForm] = useState({
    projectTitle: '',
    workType: '',
    description: '',
    budget: '',
    deadline: '',
    message: '',
    competingOffer: false,
    offerGroupId: '',
  })

  const loadWallet = async () => {
    const res = await fetch('/api/wallet')
    const json = await res.json()

    if (json.success) {
      setWallet(json.data.wallet)
    }
  }

  const loadProfile = async () => {
    const res = await fetch(`/api/khapeetar/${id}`)
    const json = await res.json()

    if (json.success) {
      setProfile(json.data)
    }
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/artist/login')
      return
    }

    Promise.all([loadProfile(), loadWallet()]).finally(() =>
      setLoading(false)
    )
  }, [status, session])

  const deposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      alert('Enter valid amount')
      return
    }

    setDepositing(true)

    const res = await fetch('/api/wallet/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Number(depositAmount),
      }),
    })

    const json = await res.json()

    if (json.success) {
      setDepositAmount('')
      depositDialogRef.current?.close()
      await loadWallet()
    } else {
      alert(json.error || 'Deposit failed')
    }

    setDepositing(false)
  }

  const sendRequest = async () => {
    if (
      !form.projectTitle ||
      !form.workType ||
      !form.description ||
      !form.budget
    ) {
      alert('Please fill all required fields')
      return
    }

    setSending(true)

    const finalOfferGroupId = form.competingOffer
      ? form.offerGroupId || crypto.randomUUID()
      : null

    const res = await fetch('/api/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        khapeetarId: id,
        projectTitle: form.projectTitle,
        workType: form.workType,
        description: form.description,
        budget: Number(form.budget),
        deadline: form.deadline || null,
        message: form.message || null,
        offerGroupId: finalOfferGroupId,
      }),
    })

    const json = await res.json()

    if (json.success) {
      alert('Work request sent')
      requestDialogRef.current?.close()

      setForm({
        projectTitle: '',
        workType: '',
        description: '',
        budget: '',
        deadline: '',
        message: '',
        competingOffer: false,
        offerGroupId: '',
      })

      await loadWallet()
    } else {
      alert(json.error || 'Failed')
    }

    setSending(false)
  }

  if (loading) {
    return (
      <ArtistLayout>
        <div className="flex items-center justify-center min-h-screen bg-black">
          <Loader2 className="animate-spin text-purple-400" />
        </div>
      </ArtistLayout>
    )
  }

  const budget = Number(form.budget || 0)
  const walletBalance = wallet?.balance || 0
  const insufficient = budget > walletBalance
  const shortfall = Math.max(0, budget - walletBalance)

  return (
    <ArtistLayout>
      <div className="min-h-screen bg-black text-white px-8 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-white/5 rounded-xl"
        >
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User size={28} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold">
                    {profile?.name || 'Khapeetar'}
                  </h1>

                  <div className="flex gap-4 mt-3 text-zinc-400 text-sm">
                    {profile?.primaryRole && (
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} />
                        {profile.primaryRole}
                      </div>
                    )}

                    {profile?.city && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        {profile.city}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-zinc-300">
                {profile?.bio || 'No bio available'}
              </p>
            </div>
          </div>

          <div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="text-green-400" />

                <div>
                  <p className="text-zinc-500 text-sm">Artist Wallet</p>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{walletBalance.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => depositDialogRef.current?.showModal()}
                className="w-full py-3 rounded-xl bg-blue-500 mb-4"
              >
                Deposit Money
              </button>

              <button
                onClick={() => requestDialogRef.current?.showModal()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Send Work Request
              </button>
            </div>
          </div>
        </div>

        {/* REQUEST MODAL */}
        <dialog
          ref={requestDialogRef}
          className="rounded-2xl p-6 w-[650px] max-w-full"
        >
          <h2 className="text-2xl font-bold mb-5 text-black">
            Send Work Request
          </h2>

          <div className="mb-5 bg-zinc-100 rounded-xl p-4 text-black">
            Wallet Balance: ₹{walletBalance}
          </div>

          <div className="space-y-4">
            <input
              placeholder="Project Title"
              value={form.projectTitle}
              onChange={(e) =>
                setForm({ ...form, projectTitle: e.target.value })
              }
              className="w-full border rounded-xl p-3"
            />

            <input
              placeholder="Work Type"
              value={form.workType}
              onChange={(e) =>
                setForm({ ...form, workType: e.target.value })
              }
              className="w-full border rounded-xl p-3"
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Budget"
              value={form.budget}
              onChange={(e) =>
                setForm({ ...form, budget: e.target.value })
              }
              className="w-full border rounded-xl p-3"
            />

            <div className="bg-zinc-100 rounded-xl p-4 text-black">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.competingOffer}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      competingOffer: e.target.checked,
                      offerGroupId:
                        e.target.checked && !form.offerGroupId
                          ? crypto.randomUUID()
                          : form.offerGroupId,
                    })
                  }
                />

                <div>
                  <p className="font-medium">Competing Offer</p>
                  <p className="text-sm text-zinc-500">
                    Enable if you're sending the same project to multiple
                    khapeetars.
                  </p>
                </div>
              </label>
            </div>

            {insufficient && (
              <div className="bg-red-100 text-red-600 rounded-xl p-4">
                Add ₹{shortfall.toLocaleString('en-IN')} more
              </div>
            )}

            <input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm({ ...form, deadline: e.target.value })
              }
              className="w-full border rounded-xl p-3"
            />

            <textarea
              placeholder="Message"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full border rounded-xl p-3"
            />

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => depositDialogRef.current?.showModal()}
                className="py-3 rounded-xl bg-blue-500 text-white"
              >
                Deposit
              </button>

              <button
                onClick={sendRequest}
                disabled={sending || insufficient}
                className="py-3 rounded-xl bg-purple-600 text-white disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </dialog>

        {/* DEPOSIT MODAL */}
        <dialog
          ref={depositDialogRef}
          className="rounded-2xl p-6 w-[450px] max-w-full"
        >
          <h2 className="text-2xl font-bold mb-5 text-black">
            Deposit Money
          </h2>

          <input
            type="number"
            placeholder="Enter amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full border rounded-xl p-3 mb-5"
          />

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => depositDialogRef.current?.close()}
              className="py-3 rounded-xl bg-zinc-300"
            >
              Cancel
            </button>

            <button
              onClick={deposit}
              disabled={depositing}
              className="py-3 rounded-xl bg-blue-500 text-white"
            >
              {depositing ? 'Depositing...' : 'Deposit'}
            </button>
          </div>
        </dialog>
      </div>
    </ArtistLayout>
  )
}