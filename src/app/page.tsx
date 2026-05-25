'use client'
import { useRouter } from 'next/navigation'
import { Music, Users, Headphones, ArrowRight, Zap } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  const roles = [
    {
      id: 'fan',
      icon: Users,
      title: 'Fan',
      subtitle: 'Back artists. Earn royalties.',
      description: 'Invest in songs before they blow up. Get real revenue share when they do.',
      features: ['Discover emerging artists', 'Fund songs from ₹100', 'Earn revenue participation', 'Track your portfolio'],
      color: 'from-pink-500/20 to-rose-500/10',
      border: 'hover:border-pink-500/50',
      accent: 'text-pink-400',
      btn: 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border-pink-500/30',
      path: '/fan/signup'
    },
    {
      id: 'artist',
      icon: Music,
      title: 'Artist',
      subtitle: 'Fund your music. Keep control.',
      description: 'Raise capital from fans who believe in you. Hire professionals. Release on your terms.',
      features: ['Launch funding campaigns', 'Hire Khapeetars', 'Distribute music', 'Track royalties'],
      color: 'from-purple-500/20 to-violet-500/10',
      border: 'hover:border-purple-500/50',
      accent: 'text-purple-400',
      btn: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30',
      path: '/artist/signup',
      featured: true
    },
    {
      id: 'khapeetar',
      icon: Headphones,
      title: 'Khapeetar',
      subtitle: 'Sell your skills. Get paid securely.',
      description: 'Join India\'s first music professional marketplace. Get hired, deliver work, get paid via escrow.',
      features: ['Create service profile', 'Get discovered by artists', 'Secure escrow payments', 'Build your reputation'],
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'hover:border-emerald-500/50',
      accent: 'text-emerald-400',
      btn: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      path: '/khapeetar/signup'
    }
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">FannyBags</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Zap size={14} className="text-yellow-500" />
          The Financial Layer of Music Making
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center pt-20 pb-16 px-4">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          India-first music financing platform
        </div>
        <h1 className="text-5xl font-semibold tracking-tight mb-4 leading-tight">
          Music needs money.<br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Fans have it.
          </span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          FannyBags connects artists who need funding with fans who want a stake in the music they love.
        </p>
      </section>

      {/* Role Cards */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <p className="text-center text-zinc-500 text-sm mb-8 uppercase tracking-widest">Choose your role</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <div
                key={role.id}
                onClick={() => router.push(role.path)}
                className={`
                  relative group cursor-pointer rounded-2xl border border-white/8
                  bg-gradient-to-b ${role.color}
                  ${role.border} transition-all duration-300
                  p-6 flex flex-col
                  ${role.featured ? 'ring-1 ring-purple-500/30' : ''}
                `}
              >
                {role.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Start here
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${role.accent}`}>
                  <Icon size={20} />
                </div>
                <h2 className="text-xl font-semibold mb-1">{role.title}</h2>
                <p className={`text-sm font-medium mb-3 ${role.accent}`}>{role.subtitle}</p>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">{role.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className={`text-xs ${role.accent}`}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${role.btn} group-hover:gap-3`}>
                  Get Started <ArrowRight size={14} />
                </button>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}