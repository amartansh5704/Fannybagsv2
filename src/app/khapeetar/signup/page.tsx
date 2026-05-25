'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Check, ChevronRight, ChevronLeft, Loader2, Zap, Eye, EyeOff } from 'lucide-react'

const ALL_SKILLS = [
  'Music Producer', 'Mixing Engineer', 'Mastering Engineer', 'Recording Engineer',
  'Beatmaker', 'Songwriter', 'Vocalist', 'Session Musician',
  'Videographer', 'Video Editor', 'Graphic Designer',
  'Marketing Specialist', 'Social Media Manager', 'A&R', 'PR Manager',
]

const PRIMARY_ROLES = [
  'Music Producer', 'Mix Engineer', 'Mastering Engineer',
  'Beatmaker', 'Songwriter', 'Videographer', 'Video Editor',
  'Graphic Designer', 'Marketer', 'A&R', 'Session Musician',
]

const WORK_MODES   = ['Remote', 'Onsite', 'Hybrid']
const AVAILABILITY = ['Available Now', 'Part-Time', 'Busy']

interface FormData {
  name:              string
  email:             string
  password:          string
  phone:             string
  skills:            string[]
  primaryRole:       string
  city:              string
  state:             string
  country:           string
  workMode:          string
  availability:      string
  startingBudget:    string
  experienceYears:   string
  projectsCompleted: string
  bio:               string
  instagram:         string
  youtube:           string
  spotifyCredits:    string
}

const defaultForm: FormData = {
  name:              '',
  email:             '',
  password:          '',
  phone:             '',
  skills:            [],
  primaryRole:       '',
  city:              '',
  state:             '',
  country:           'India',
  workMode:          'Remote',
  availability:      'Available Now',
  startingBudget:    '',
  experienceYears:   '',
  projectsCompleted: '',
  bio:               '',
  instagram:         '',
  youtube:           '',
  spotifyCredits:    '',
}

const STEPS = ['Basic Info', 'Skills & Role', 'Location', 'Pricing & Bio']

export default function KhapeetarSignup() {
  const router = useRouter()
  const [step, setStep]         = useState(1)
  const [form, setForm]         = useState<FormData>(defaultForm)
  const [submitting, setSubmit] = useState(false)
  const [error, setError]       = useState('')
  const [showPw, setShowPw]     = useState(false)

  const update = (k: keyof FormData, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }))

  const toggleSkill = (skill: string) =>
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : [...f.skills, skill],
    }))

  const canProceed = (): boolean => {
    if (step === 1)
      return !!(
        form.name.trim() &&
        form.email.trim() &&
        form.password.length >= 8
      )
    if (step === 2) return !!(form.skills.length > 0 && form.primaryRole)
    if (step === 3) return true
    if (step === 4) return !!form.bio.trim()
    return true
  }

  const submit = async () => {
    setSubmit(true)
    setError('')
    try {
      // 1 — Create account via unified signup API
      const res = await fetch('/api/auth/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role:              'khapeetar',
          name:              form.name.trim(),
          email:             form.email.trim(),
          password:          form.password,
          phone:             form.phone             || undefined,
          skills:            form.skills,
          primaryRole:       form.primaryRole,
          city:              form.city              || undefined,
          state:             form.state             || undefined,
          country:           form.country,
          workMode:          form.workMode,
          availability:      form.availability,
          startingBudget:    parseFloat(form.startingBudget)    || 0,
          experienceYears:   parseInt(form.experienceYears)     || 0,
          projectsCompleted: parseInt(form.projectsCompleted)   || 0,
          bio:               form.bio               || undefined,
          instagram:         form.instagram         || undefined,
          youtube:           form.youtube           || undefined,
          spotifyCredits:    form.spotifyCredits    || undefined,
        }),
      })

      const json = await res.json()
      if (!json.success) throw new Error(json.error?.message || 'Signup failed')

      // 2 — Auto-login with NextAuth
      const loginRes = await signIn('credentials', {
        email:    form.email.trim(),
        password: form.password,
        role:     'khapeetar',
        redirect: false,
      })

      if (loginRes?.error) throw new Error('Account created but login failed. Please sign in manually.')

      // 3 — Redirect to dashboard
      router.push('/khapeetar/dashboard')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmit(false)
    }
  }

  // ── Reusable field wrapper ─────────────────────────────────────────
  const Field = ({
    label,
    children,
  }: {
    label: string
    children: React.ReactNode
  }) => (
    <div className="space-y-1.5">
      <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
        {label}
      </label>
      {children}
    </div>
  )

  // ── Reusable text input ────────────────────────────────────────────
  const Input = ({
    field,
    ...props
  }: { field: keyof FormData } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      value={form[field] as string}
      onChange={e => update(field, e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/8 transition-all placeholder:text-zinc-600"
      {...props}
    />
  )

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            FannyBags
          </span>
        </Link>
        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <span>Already have an account?</span>
          <Link href="/khapeetar/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">

          {/* Step progress */}
          <div className="flex items-center gap-0 mb-10">
            {STEPS.map((label, idx) => {
              const n      = idx + 1
              const done   = n < step
              const active = n === step
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all',
                      done   && 'bg-green-500/20 border-green-500/50 text-green-400',
                      active && 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300',
                      !done && !active && 'bg-white/5 border-white/10 text-zinc-600',
                    )}>
                      {done ? <Check size={14} /> : n}
                    </div>
                    <span className={cn(
                      'text-xs whitespace-nowrap',
                      active ? 'text-white' : 'text-zinc-600',
                    )}>
                      {label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={cn(
                      'flex-1 h-px mx-3 mb-4',
                      done ? 'bg-green-500/40' : 'bg-white/8',
                    )} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Form card */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-4">

            {/* ── STEP 1 — Basic Info ─────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Basic Information</h2>
                  <p className="text-zinc-500 text-sm">Let artists know who you are</p>
                </div>

                <Field label="Full Name *">
                  <Input field="name" placeholder="Aman Verma" />
                </Field>

                <Field label="Email *">
                  <Input field="email" type="email" placeholder="aman@example.com" />
                </Field>

                {/* Password — NEW */}
                <Field label="Password * (min 8 characters)">
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/8 transition-all placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form.password.length > 0 && form.password.length < 8 && (
                    <p className="text-xs text-amber-400 mt-1">
                      {8 - form.password.length} more characters needed
                    </p>
                  )}
                </Field>

                <Field label="Phone">
                  <Input field="phone" type="tel" placeholder="+91 98765 43210" />
                </Field>
              </div>
            )}

            {/* ── STEP 2 — Skills & Role ──────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Skills & Role</h2>
                  <p className="text-zinc-500 text-sm">Select everything you can do</p>
                </div>

                <Field label="Skills * (select all that apply)">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ALL_SKILLS.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs border transition-all',
                          form.skills.includes(skill)
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20',
                        )}
                      >
                        {form.skills.includes(skill) && '✓ '}{skill}
                      </button>
                    ))}
                  </div>
                  {form.skills.length > 0 && (
                    <p className="text-xs text-zinc-600 mt-2">
                      {form.skills.length} skill{form.skills.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </Field>

                <Field label="Primary Role *">
                  <select
                    value={form.primaryRole}
                    onChange={e => update('primaryRole', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/60 transition-all text-white"
                  >
                    <option value="" className="bg-zinc-900">Select your main role</option>
                    {PRIMARY_ROLES.map(r => (
                      <option key={r} value={r} className="bg-zinc-900">{r}</option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            {/* ── STEP 3 — Location & Availability ───────────────── */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Location & Availability</h2>
                  <p className="text-zinc-500 text-sm">Where are you based?</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="City">
                    <Input field="city" placeholder="Mumbai" />
                  </Field>
                  <Field label="State">
                    <Input field="state" placeholder="Maharashtra" />
                  </Field>
                </div>

                <Field label="Work Mode">
                  <div className="grid grid-cols-3 gap-2">
                    {WORK_MODES.map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => update('workMode', mode)}
                        className={cn(
                          'py-2.5 rounded-xl border text-sm transition-all',
                          form.workMode === mode
                            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20',
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Availability">
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABILITY.map(a => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => update('availability', a)}
                        className={cn(
                          'py-2.5 rounded-xl border text-xs transition-all',
                          form.availability === a
                            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20',
                        )}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* ── STEP 4 — Pricing & Bio ──────────────────────────── */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Pricing & Bio</h2>
                  <p className="text-zinc-500 text-sm">Tell artists what you offer</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="Starting Budget (₹)">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">₹</span>
                      <input
                        type="number"
                        value={form.startingBudget}
                        onChange={e => update('startingBudget', e.target.value)}
                        placeholder="1500"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3 py-3 text-sm outline-none focus:border-emerald-500/60 transition-all placeholder:text-zinc-600"
                      />
                    </div>
                  </Field>
                  <Field label="Years of Exp">
                    <Input field="experienceYears" type="number" placeholder="3" />
                  </Field>
                  <Field label="Projects Done">
                    <Input field="projectsCompleted" type="number" placeholder="25" />
                  </Field>
                </div>

                <Field label="Bio / Portfolio Description *">
                  <textarea
                    value={form.bio}
                    onChange={e => update('bio', e.target.value)}
                    rows={4}
                    placeholder="Tell artists about yourself, your style, notable work, equipment..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/60 transition-all placeholder:text-zinc-600 resize-none"
                  />
                  <p className="text-xs text-zinc-600 text-right mt-1">{form.bio.length} chars</p>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Instagram">
                    <Input field="instagram" placeholder="@yourhandle" />
                  </Field>
                  <Field label="YouTube">
                    <Input field="youtube" placeholder="youtube.com/yourchannel" />
                  </Field>
                </div>

                <Field label="Spotify Credits">
                  <Input field="spotifyCredits" placeholder="Songs you've worked on..." />
                </Field>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-zinc-400 rounded-xl text-sm hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> Back
            </button>

            <span className="text-xs text-zinc-600">Step {step} of {STEPS.length}</span>

            {step < STEPS.length ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canProceed() || submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting
                  ? <><Loader2 size={14} className="animate-spin" /> Creating Account...</>
                  : '✓ Create Account'
                }
              </button>
            )}
          </div>

          {/* Sign in link */}
          <p className="text-center text-zinc-600 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/khapeetar/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}