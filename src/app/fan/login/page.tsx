'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Loader2, Eye, EyeOff } from 'lucide-react'

export default function FanLogin() {
  const router = useRouter()
  const [email, setEmail]   = useState('')
  const [password, setPass] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await signIn('credentials', { email, password, role: 'fan', redirect: false })
    setLoading(false)
    if (res?.error) {
      setError(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error)
    } else {
      router.push('/fan/discover')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="font-semibold text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">FannyBags</Link>
        <span className="text-xs text-zinc-600">Fan Login</span>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-4">
              <Users size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-semibold mb-1">Fan Login</h1>
            <p className="text-zinc-500 text-sm">Welcome back</p>
          </div>
          <form onSubmit={submit} className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-500/60 transition-all placeholder:text-zinc-600" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPass(e.target.value)} placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-pink-500/60 transition-all placeholder:text-zinc-600" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-zinc-600 text-sm mt-4">
            No account? <Link href="/fan/signup" className="text-pink-400">Sign up as Fan</Link>
          </p>
        </div>
      </div>
    </div>
  )
}