'use client'

import Link from 'next/link'
import { Music } from 'lucide-react'
import {
  formatINR,
  formatStreams,
  progressPct,
} from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  pending_approval:
    'bg-amber-500/15 text-amber-300 border-amber-500/30',
  live:
    'bg-green-500/15 text-green-300 border-green-500/30',
  funded:
    'bg-blue-500/15 text-blue-300 border-blue-500/30',
  failed:
    'bg-red-500/15 text-red-400 border-red-500/30',
  draft:
    'bg-white/8 text-zinc-400 border-white/10',
}

const STATUS_LABELS: Record<string, string> = {
  pending_approval: 'Pending Review',
  live: 'Live',
  funded: 'Funded',
  failed: 'Failed',
  draft: 'Draft',
}

interface Campaign {
  totalFundingAsk: number
  amountRaised: number
  fanRevenueShare: number
  status: string
  fundsReleased?: boolean
  releasedAt?: string | null
  escrowHeldAmount?: number
}

interface Metrics {
  totalStreams: number
  totalInvestors: number
}

interface SongCardProps {
  song: {
    id: string
    title: string
    coverArtUrl: string | null
    genre: string | null
    createdAt: string
    campaign: Campaign | null
    metrics: Metrics | null
  }
}

export default function SongCard({
  song,
}: SongCardProps) {
  const c = song.campaign
  const m = song.metrics
  const pct = c
    ? progressPct(c.amountRaised, c.totalFundingAsk)
    : 0

  const status = c?.status ?? 'draft'

  const breakeven =
    c && c.fanRevenueShare > 0
      ? Math.ceil(
          c.totalFundingAsk /
            (0.0005 * (c.fanRevenueShare / 100))
        )
      : 0

  return (
    <Link href={`/artist/my-songs/${song.id}`}>
      <div className="group bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:bg-white/5 transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative h-40 bg-gradient-to-br from-purple-900/30 to-pink-900/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {song.coverArtUrl ? (
            <img
              src={song.coverArtUrl}
              alt={song.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Music size={36} className="text-zinc-700" />
          )}

          <span
            className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full border font-medium ${
              STATUS_STYLES[status] ??
              STATUS_STYLES.draft
            }`}
          >
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>

        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <div>
            <h3 className="font-semibold text-white text-base leading-tight truncate">
              {song.title}
            </h3>

            {song.genre && (
              <p className="text-xs text-zinc-500 mt-0.5">
                {song.genre}
              </p>
            )}
          </div>

          {c ? (
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                <span>{formatINR(c.amountRaised)} raised</span>
                <span>{pct}%</span>
              </div>

              <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className="text-xs text-zinc-600 mt-1">
                of {formatINR(c.totalFundingAsk)} goal
              </p>
            </div>
          ) : (
            <div className="h-1.5 bg-white/6 rounded-full" />
          )}

          {c && (
            <div className="space-y-2 border-t border-white/6 pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">
                  Escrow Held
                </span>

                <span className="text-amber-300 font-medium">
                  ₹
                  {(
                    c.escrowHeldAmount || 0
                  ).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">
                  Release Status
                </span>

                <span
                  className={
                    c.fundsReleased
                      ? 'text-emerald-400'
                      : 'text-amber-300'
                  }
                >
                  {c.fundsReleased
                    ? 'Released'
                    : 'Held in Escrow'}
                </span>
              </div>

              {c.releasedAt && (
                <div className="text-[11px] text-zinc-500">
                  Released on{' '}
                  {new Date(
                    c.releasedAt
                  ).toLocaleDateString('en-IN')}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/6 mt-auto">
            <div className="text-center">
              <p className="text-xs text-zinc-600">
                Fan Share
              </p>
              <p className="text-sm font-semibold text-purple-300">
                {c?.fanRevenueShare ?? 0}%
              </p>
            </div>

            <div className="text-center border-x border-white/6">
              <p className="text-xs text-zinc-600">
                Breakeven
              </p>
              <p className="text-sm font-semibold text-white">
                {breakeven > 0
                  ? formatStreams(breakeven)
                  : '—'}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-zinc-600">
                Investors
              </p>
              <p className="text-sm font-semibold text-white">
                {m?.totalInvestors ?? 0}
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-700">
            Created{' '}
            {new Date(song.createdAt).toLocaleDateString(
              'en-IN',
              {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }
            )}
          </p>
        </div>
      </div>
    </Link>
  )
}