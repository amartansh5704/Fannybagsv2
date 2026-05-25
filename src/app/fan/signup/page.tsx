'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Loader2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const INTERESTS = ['Hip-Hop', 'Indie', 'Bollywood', 'Electronic', 'R&B', 'Folk', 'Rock', 'Pop', 'Classical', 'Punjabi']

export default function FanSignup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    investmentInterests: [] as string[],
    city: '', country: 'India',
  })

  const u = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const toggleInterest = (i: string) => setForm(f => ({
    ...f,
    investmentInterests: f.investmentInterests.includes(i)
      ? f.investmentInterests.filter(x => x !== i)
      : [...f.investmentInterests, i],
  }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'fan' }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error?.message || 'Signup failed')

      const loginRes = await signIn('credentials', {
        email: form.email, password: form.password, role: 'fan', redirect: false,
      })
      if (loginRes?.error) throw new Error(loginRes.error)
      router.push('/fan/discover')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-500/60 transition-all placeholder:text-zinc-600"

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="font-semibold text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">FannyBags</Link>
        <span className="text-xs text-zinc-600">Fan Signup</span>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-4">
              <Users size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-semibold mb-1">Create Fan Account</h1>
            <p className="text-zinc-500 text-sm">Back artists. Earn royalties.</p>
          </div>

          <form onSubmit={submit} className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 uppercase tracking-wider">Full Name *</label>
                <input className={inputClass} value={form.name} onChange={e => u('name', e.target.value)} placeholder="Priya Singh" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 uppercase tracking-wider">Phone</label>
                <input className={inputClass} type="tel" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="+91..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">Email *</label>
              <input className={inputClass} type="email" value={form.email} onChange={e => u('email', e.target.value)} placeholder="priya@example.com" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">Password * (min 8 chars)</label>
              <div className="relative">
                <input
                  className={cn(inputClass, 'pr-10')}
                  type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={e => u('password', e.target.value)}
                  placeholder="••••••••" required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 uppercase tracking-wider">City</label>
                <input className={inputClass} value={form.city} onChange={e => u('city', e.target.value)} placeholder="Delhi" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 uppercase tracking-wider">Country</label>
                <input className={inputClass} value={form.country} onChange={e => u('country', e.target.value)} placeholder="India" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">Music Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(i => (
                  <button key={i} type="button" onClick={() => toggleInterest(i)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs border transition-all',
                      form.investmentInterests.includes(i)
                        ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                    )}
                  >
                    {form.investmentInterests.includes(i) && '✓ '}{i}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Create Fan Account ✓'}
            </button>
          </form>

          <p className="text-center text-zinc-600 text-sm mt-4">
            Already have an account? <Link href="/fan/login" className="text-pink-400">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}