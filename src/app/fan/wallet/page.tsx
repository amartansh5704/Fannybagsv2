'use client'

import { useEffect, useState } from 'react'
import FanLayout from '@/components/fan/FanLayout'

export default function FanWalletPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [amount, setAmount] = useState('')

  const loadWallet = async () => {
    const res = await fetch('/api/wallet')
    const data = await res.json()

    if (data.success) {
      setWallet(data.data)
    }
  }

  useEffect(() => {
    loadWallet()
  }, [])

  const deposit = async () => {
    await fetch('/api/wallet/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Number(amount),
      }),
    })

    setAmount('')
    loadWallet()
  }

  return (
    <FanLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Fan Wallet</h1>

        <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-6 mb-8">
          <p className="text-zinc-400">Balance</p>
          <h2 className="text-4xl font-bold mt-2">
            ₹{wallet?.wallet?.balance?.toLocaleString('en-IN') || 0}
          </h2>
        </div>

        <div className="flex gap-3 mb-10">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Deposit amount"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-72"
          />

          <button
            onClick={deposit}
            className="px-6 py-3 rounded-xl bg-pink-500 font-medium"
          >
            Deposit
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-4">Transactions</h3>

        <div className="space-y-3">
          {wallet?.transactions?.map((tx: any) => (
            <div
              key={tx.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <p className="font-medium">{tx.type}</p>
              <p className="text-zinc-400">₹{tx.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </FanLayout>
  )
}