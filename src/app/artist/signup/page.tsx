'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music, Loader2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const GENRES = ['Hip-Hop / Rap', 'Indie Pop', 'R&B / Soul', 'Electronic', 'Folk / Acoustic', 'Bollywood Pop', 'Punjabi', 'Classical Fusion', 'Rock', 'Other']

export default function ArtistSignup() {
  const router = useRouter()
  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [showPw, setShowPw]   = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    stageName: '', genre: '', bio: '',
    city: '', country: 'India',
    instagram: '', spotify: '', youtube: '',
  })

  const u = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const canProceed = () => {
    if (step === 1) return !!(form.name && form.email && form.password && form.password.length >= 8)
    return true
  }

  const submit = async () => {
    setLoading(true); setError('')
    try {
      // 1. Create account
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'artist' }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error?.message || 'Signup failed')

      // 2. Auto-login
      const loginRes = await signIn('credentials', {
        email:    form.email,
        password: form.password,
        role:     'artist',
        redirect: false,
      })
      if (loginRes?.error) throw new Error(loginRes.error)

      router.push('/artist/raise-funds')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/8 transition-all placeholder:text-zinc-600"

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="font-semibold text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          FannyBags
        </Link>
        <span className="text-xs text-zinc-600">Artist Signup</span>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
              <Music size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-semibold mb-1">Create Artist Account</h1>
            <p className="text-zinc-500 text-sm">Fund your music. Keep control.</p>
          </div>

          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">Full Name *</label>
                  <input className={inputClass} value={form.name} onChange={e => u('name', e.target.value)} placeholder="Rahul Sharma" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">Email *</label>
                  <input className={inputClass} type="email" value={form.email} onChange={e => u('email', e.target.value)} placeholder="rahul@example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">Password * (min 8 chars)</label>
                  <div className="relative">
                    <input
                      className={cn(inputClass, 'pr-10')}
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => u('password', e.target.value)}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">Phone</label>
                  <input className={inputClass} type="tel" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="+91 98765 43210" />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">Stage / Artist Name</label>
                  <input className={inputClass} value={form.stageName} onChange={e => u('stageName', e.target.value)} placeholder="Your artist name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">Primary Genre</label>
                  <select value={form.genre} onChange={e => u('genre', e.target.value)} className={cn(inputClass, 'text-white')}>
                    <option value="" className="bg-zinc-900">Select genre</option>
                    {GENRES.map(g => <option key={g} value={g} className="bg-zinc-900">{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">City</label>
                  <input className={inputClass} value={form.city} onChange={e => u('city', e.target.value)} placeholder="Mumbai" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">Bio</label>
                  <textarea value={form.bio} onChange={e => u('bio', e.target.value)} rows={3} placeholder="Tell fans about yourself..." className={cn(inputClass, 'resize-none')} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider">Instagram</label>
                    <input className={inputClass} value={form.instagram} onChange={e => u('instagram', e.target.value)} placeholder="@handle" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider">Spotify</label>
                    <input className={inputClass} value={form.spotify} onChange={e => u('spotify', e.target.value)} placeholder="Link" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider">YouTube</label>
                    <input className={inputClass} value={form.youtube} onChange={e => u('youtube', e.target.value)} placeholder="Link" />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              {step === 2 && (
                <button onClick={() => setStep(1)} className="flex-1 py-3 bg-white/5 border border-white/10 text-zinc-400 rounded-xl text-sm hover:text-white transition-all">
                  ← Back
                </button>
              )}
              {step === 1 ? (
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Create Account ✓'}
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-zinc-600 text-sm mt-4">
            Already have an account?{' '}
            <Link href="/artist/login" className="text-purple-400 hover:text-purple-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}