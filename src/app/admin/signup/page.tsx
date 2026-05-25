'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Loader2 } from 'lucide-react'

export default function AdminSignupPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/admin-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    const data = await res.json()

    setLoading(false)

    if (!data.success) {
      setError(data.error)
      return
    }

    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-4">
            <Shield className="text-white" />
          </div>

          <h1 className="text-2xl font-semibold">Admin Signup</h1>

          <p className="text-zinc-500 mt-2">
            Create admin account
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
          />

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 rounded-xl py-3 font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </span>
            ) : (
              'Create Admin Account'
            )}
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-5 text-sm">
          Already admin?{' '}
          <Link href="/admin/login" className="text-red-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}