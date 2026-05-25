'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Loader2 } from 'lucide-react'

export default function AdminWalletPage() {
  const [data, setData] = useState<any>(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)

  const loadWallet = async () => {
    const res = await fetch('/api/admin/wallet')
    const json = await res.json()

    if (json.success) {
      setData(json.data)
    }
  }

  useEffect(() => {
    loadWallet()
  }, [])

  const deposit = async () => {
    const amount = Number(depositAmount)

    if (!amount || amount <= 0) {
      alert('Enter valid amount')
      return
    }

    setDepositing(true)

    const res = await fetch('/api/admin/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
      }),
    })

    const json = await res.json()

    setDepositing(false)

    if (!json.success) {
      alert(json.error || 'Deposit failed')
      return
    }

    setDepositAmount('')
    loadWallet()
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="animate-spin text-red-400" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <h1 className="text-2xl font-semibold">
          Admin Wallet
        </h1>

        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-zinc-400">Total Balance</p>
          <h2 className="text-4xl font-bold mt-2">
            ₹{data.wallet.balance.toLocaleString('en-IN')}
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            Deposit DSP Revenue
          </h3>

          <div className="flex gap-3">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) =>
                setDepositAmount(e.target.value)
              }
              placeholder="Enter amount"
              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3"
            />

            <button
              onClick={deposit}
              disabled={depositing}
              className="px-6 bg-red-500 rounded-xl font-medium"
            >
              {depositing ? 'Depositing...' : 'Deposit'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Escrow Holding
            </p>
            <p className="text-2xl font-semibold mt-2">
              ₹{data.breakdown.escrowHolding.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Deal Commission
            </p>
            <p className="text-2xl font-semibold mt-2">
              ₹{data.breakdown.dealCommissions.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Investment Commission
            </p>
            <p className="text-2xl font-semibold mt-2">
              ₹{data.breakdown.investmentCommissions.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Royalty Pool
            </p>
            <p className="text-2xl font-semibold mt-2">
              ₹{data.breakdown.royaltyPool.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            Transactions
          </h3>

          <div className="space-y-3">
            {data.transactions.map((tx: any) => (
              <div
                key={tx.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <p className="font-medium">
                  {tx.type}
                </p>

                <p className="text-zinc-400">
                  ₹{tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}