'use client'
import { formatINR, calculateBreakeven } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface BudgetAllocation {
  production: number
  mixMaster: number
  videoPromo: number
  marketing: number
  other: number
}

interface FundingData {
  totalFundingAsk: number
  royaltySharingOn: boolean
  fanRevenueShare: number
  budget: BudgetAllocation
  campaignStory: string
}

interface Props {
  data: FundingData
  onChange: (data: FundingData) => void
}

export default function FundingDetails({ data, onChange }: Props) {
  const update = (key: keyof FundingData, val: unknown) =>
    onChange({ ...data, [key]: val })

  const updateBudget = (key: keyof BudgetAllocation, val: number) =>
    onChange({ ...data, budget: { ...data.budget, [key]: val } })

  const totalBudget = Object.values(data.budget).reduce((a, b) => a + b, 0)
  const platformFee   = Math.round(data.totalFundingAsk * 0.05)
  const artistReceives = data.totalFundingAsk - platformFee
  const artistRetains  = 100 - data.fanRevenueShare

  // ── Corrected breakeven ──────────────────────────────────────────────
  // fanPayoutPerStream = 0.0005 × (fanRevenueShare / 100)
  // breakEvenStreams   = totalFundingAsk / fanPayoutPerStream
  const breakevenStreams = calculateBreakeven(
    data.totalFundingAsk,
    data.fanRevenueShare
  )
  // ─────────────────────────────────────────────────────────────────────

  const budgetItems = [
    { key: 'production' as const, label: 'Production',    emoji: '🎹' },
    { key: 'mixMaster'  as const, label: 'Mix & Master',  emoji: '🎚️' },
    { key: 'videoPromo' as const, label: 'Video / Promo', emoji: '🎬' },
    { key: 'marketing'  as const, label: 'Marketing',     emoji: '📣' },
    { key: 'other'      as const, label: 'Other',         emoji: '📦' },
  ]

  const fmtStreams = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
    if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`
    return n.toLocaleString('en-IN')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Funding Details</h2>
        <p className="text-zinc-500 text-sm">Set your campaign financials and share your story</p>
      </div>

      {/* ── Total Funding Ask ─────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
          Total Funding Ask (₹) *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">₹</span>
          <input
            type="number"
            value={data.totalFundingAsk || ''}
            onChange={e => update('totalFundingAsk', parseFloat(e.target.value) || 0)}
            placeholder="e.g. 100000"
            min={10000}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:border-purple-500/60 transition-all placeholder:text-zinc-600"
          />
        </div>

        {data.totalFundingAsk > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { label: 'You Raise',        val: formatINR(data.totalFundingAsk), color: 'text-white' },
              { label: 'Platform Fee (5%)', val: `-${formatINR(platformFee)}`,   color: 'text-pink-400' },
              { label: 'You Receive',      val: formatINR(artistReceives),       color: 'text-green-400' },
            ].map(item => (
              <div key={item.label} className="bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                <p className="text-xs text-zinc-500 mb-1">{item.label}</p>
                <p className={`text-sm font-semibold ${item.color}`}>{item.val}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Royalty Sharing Toggle ────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white/3 border border-white/8 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-medium">Royalty Sharing</p>
          <p className="text-xs text-zinc-500 mt-0.5">Enable fans to earn from your song revenue</p>
        </div>
        <button
          onClick={() => update('royaltySharingOn', !data.royaltySharingOn)}
          className={cn(
            'w-12 h-6 rounded-full transition-all relative',
            data.royaltySharingOn ? 'bg-purple-500' : 'bg-white/10'
          )}
        >
          <span className={cn(
            'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all',
            data.royaltySharingOn ? 'left-6' : 'left-0.5'
          )} />
        </button>
      </div>

      {/* ── Fan Revenue Share Slider — 1% to 100% ────────────────────── */}
      {data.royaltySharingOn && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              Fan Revenue Share
            </label>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-purple-300">{data.fanRevenueShare}%</span>
              <span className="text-xs text-zinc-600">to fans</span>
            </div>
          </div>

          {/* ✅ Range is now 1–100 */}
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={data.fanRevenueShare}
            onChange={e => update('fanRevenueShare', parseInt(e.target.value))}
            className="w-full accent-purple-500 h-2"
          />

          <div className="flex justify-between text-xs text-zinc-600">
            <span>1% min</span>
            <span className="text-zinc-400">
              {artistRetains}% you retain
              {artistRetains === 0 && (
                <span className="ml-2 text-amber-400">⚠️ You keep nothing</span>
              )}
            </span>
            <span>100% max</span>
          </div>

          {data.fanRevenueShare === 100 && (
            <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              ⚠️ You are offering 100% of song revenue to fans. You retain 0%. Are you sure?
            </p>
          )}
        </div>
      )}

      {/* ── Breakeven Calculator ──────────────────────────────────────── */}
      {data.totalFundingAsk > 0 && data.royaltySharingOn && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-3">
            📊 Campaign Breakeven Calculator
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { label: 'Revenue / Stream',   val: '₹0.0005 (0.05 paise)' },
              { label: 'Fan Payout / Stream', val: `₹${(0.0005 * (data.fanRevenueShare / 100)).toFixed(7)}` },
              { label: 'Total Funding Ask',  val: formatINR(data.totalFundingAsk) },
              { label: 'Fan Revenue Share',  val: `${data.fanRevenueShare}%` },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-white">{val}</p>
              </div>
            ))}
          </div>

          {/* Formula callout */}
          <div className="bg-black/40 rounded-lg px-3 py-2 mb-4 font-mono text-xs text-zinc-500 space-y-0.5">
            <p>fanPayoutPerStream = 0.0005 × ({data.fanRevenueShare} / 100)</p>
            <p>breakEvenStreams   = {formatINR(data.totalFundingAsk).replace('₹','₹')} ÷ fanPayoutPerStream</p>
          </div>

          {/* Result */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Breakeven Streams</p>
              <p className="text-3xl font-bold text-purple-300">{fmtStreams(breakevenStreams)}</p>
            </div>
            <p className="text-xs text-zinc-600 max-w-[180px] text-right leading-relaxed">
              The song needs <strong className="text-zinc-400">{fmtStreams(breakevenStreams)} streams</strong> for fans
              to collectively earn back {formatINR(data.totalFundingAsk)}
            </p>
          </div>
        </div>
      )}

      {/* ── Budget Allocation ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Budget Allocation</label>
        <div className="space-y-2">
          {budgetItems.map(({ key, label, emoji }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-base w-6">{emoji}</span>
              <span className="text-sm text-zinc-400 w-28">{label}</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">₹</span>
                <input
                  type="number"
                  value={data.budget[key] || ''}
                  onChange={e => updateBudget(key, parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-white/5 border border-white/8 rounded-lg pl-7 pr-3 py-2 text-sm outline-none focus:border-purple-500/40 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>
          ))}
        </div>

        {totalBudget > 0 && (
          <div className="flex justify-between items-center pt-2 border-t border-white/8">
            <span className="text-xs text-zinc-500">Total budgeted</span>
            <span className={cn(
              'text-sm font-medium',
              totalBudget > data.totalFundingAsk ? 'text-red-400' : 'text-green-400'
            )}>
              {formatINR(totalBudget)}
              {totalBudget > data.totalFundingAsk && ' ⚠️ exceeds ask'}
            </span>
          </div>
        )}
      </div>

      {/* ── Campaign Story ────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
          Campaign Story *
        </label>
        <textarea
          value={data.campaignStory}
          onChange={e => update('campaignStory', e.target.value)}
          placeholder="Tell fans why this song matters. What inspired it? What's your vision? Why should they back you?"
          rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/60 transition-all placeholder:text-zinc-600 resize-none"
        />
        <p className="text-xs text-zinc-600 text-right">{data.campaignStory.length} chars</p>
      </div>
    </div>
  )
}