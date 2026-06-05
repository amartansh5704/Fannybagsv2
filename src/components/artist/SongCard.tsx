'use client'

import Link from 'next/link'
import {
  Music2,
  TrendingUp,
  Users,
  Wallet,
  ArrowUpRight,
  Disc3,
  Activity,
} from 'lucide-react'

import {
  formatINR,
  formatStreams,
  progressPct,
} from '@/lib/utils'

const STATUS_STYLES: Record<
  string,
  string
> = {
  pending_approval:
    'statusAmber',
  live: 'statusGreen',
  funded: 'statusBlue',
  failed: 'statusRed',
  draft: 'statusGray',
}

const STATUS_LABELS: Record<
  string,
  string
> = {
  pending_approval:
    'Pending Review',
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
    ? progressPct(
        c.amountRaised,
        c.totalFundingAsk
      )
    : 0

  const status =
    c?.status ?? 'draft'

  // FIXED: 5 paisa = ₹0.05
  const breakeven =
    c && c.fanRevenueShare > 0
      ? Math.ceil(
          c.totalFundingAsk /
            (0.05 *
              (c.fanRevenueShare /
                100))
        )
      : 0

  return (
    <>
      <style jsx>{`
        .card {
          position: relative;
          overflow: hidden;
          border-radius: 32px;
          background: rgba(
            255,
            255,
            255,
            0.03
          );
          border: 1px solid
            rgba(255, 255, 255, 0.08);
          transition: all 0.35s ease;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: white;
          min-height: 100%;
          backdrop-filter: blur(18px);
          -webkit-tap-highlight-color: transparent;
        }

        .card:hover {
          transform: translateY(-6px);
          border-color: rgba(
            168,
            85,
            247,
            0.32
          );
          box-shadow: 0 24px 60px
            rgba(
              168,
              85,
              247,
              0.18
            );
        }

        .glow {
          position: absolute;
          top: -60px;
          right: -60px;
          width: 180px;
          height: 180px;
          border-radius: 999px;
          background: rgba(
            168,
            85,
            247,
            0.12
          );
          filter: blur(60px);
          opacity: 0;
          transition: 0.4s;
        }

        .card:hover .glow {
          opacity: 1;
        }

        .coverWrap {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            rgba(168, 85, 247, 0.2),
            rgba(236, 72, 153, 0.12)
          );
        }

        .cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .card:hover .cover {
          transform: scale(1.06);
        }

        .emptyCover {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #71717a;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.9),
            transparent 55%
          );
        }

        .topRow {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 3;
        }

        .genre {
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(
            255,
            255,
            255,
            0.08
          );
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          font-size: 11px;
          font-weight: 600;
          color: #f4f4f5;
        }

        .status {
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid;
          backdrop-filter: blur(12px);
        }

        .statusAmber {
          background: rgba(
            245,
            158,
            11,
            0.12
          );
          border-color: rgba(
            245,
            158,
            11,
            0.24
          );
          color: #fbbf24;
        }

        .statusGreen {
          background: rgba(
            34,
            197,
            94,
            0.12
          );
          border-color: rgba(
            34,
            197,
            94,
            0.24
          );
          color: #4ade80;
        }

        .statusBlue {
          background: rgba(
            59,
            130,
            246,
            0.12
          );
          border-color: rgba(
            59,
            130,
            246,
            0.24
          );
          color: #60a5fa;
        }

        .statusRed {
          background: rgba(
            239,
            68,
            68,
            0.12
          );
          border-color: rgba(
            239,
            68,
            68,
            0.24
          );
          color: #f87171;
        }

        .statusGray {
          background: rgba(
            255,
            255,
            255,
            0.05
          );
          border-color: rgba(
            255,
            255,
            255,
            0.08
          );
          color: #a1a1aa;
        }

        .bottomMeta {
          position: absolute;
          left: 20px;
          right: 20px;
          bottom: 20px;
          z-index: 3;
        }

        .songTitle {
          font-size: 24px;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 10px;
        }

        .created {
          color: #a1a1aa;
          font-size: 12px;
        }

        .body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .section {
          margin-bottom: 20px;
        }

        .labelRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 12px;
        }

        .muted {
          color: #71717a;
        }

        .strong {
          color: white;
          font-weight: 600;
        }

        .progress {
          height: 10px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(
            255,
            255,
            255,
            0.06
          );
        }

        .progressFill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            #a855f7,
            #ec4899
          );
        }

        .goal {
          margin-top: 10px;
          color: #71717a;
          font-size: 12px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat {
          border-radius: 20px;
          padding: 14px;
          background: rgba(
            255,
            255,
            255,
            0.03
          );
          border: 1px solid
            rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        .statIcon {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
          color: #a855f7;
        }

        .statValue {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .statLabel {
          color: #71717a;
          font-size: 11px;
        }

        .escrow {
          border-radius: 22px;
          padding: 18px;
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.08),
            rgba(251, 191, 36, 0.04)
          );
          border: 1px solid
            rgba(245, 158, 11, 0.12);
          margin-bottom: 20px;
        }

        .escrowTop {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .escrowLabel {
          color: #fbbf24;
          font-size: 12px;
          font-weight: 600;
        }

        .escrowAmount {
          font-size: 22px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.03em;
        }

        .escrowStatus {
          font-size: 12px;
          color: #fde68a;
        }

        .released {
          color: #4ade80;
        }

        .footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 18px;
          border-top: 1px solid
            rgba(255, 255, 255, 0.06);
        }

        .footerLeft {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #71717a;
          font-size: 12px;
        }

        .open {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #d8b4fe;
          font-size: 13px;
          font-weight: 600;
          transition: 0.3s;
        }

        .card:hover .open {
          transform: translateX(4px);
        }
      `}</style>

      <Link
        href={`/artist/my-songs/${song.id}`}
        className="card"
      >
        <div className="glow" />

        <div className="coverWrap">
          {song.coverArtUrl ? (
            <img
              src={song.coverArtUrl}
              alt={song.title}
              className="cover"
            />
          ) : (
            <div className="emptyCover">
              <Music2 size={44} />
            </div>
          )}

          <div className="overlay" />

          <div className="topRow">
            {song.genre ? (
              <div className="genre">
                {song.genre}
              </div>
            ) : (
              <div />
            )}

            <div
              className={`status ${
                STATUS_STYLES[
                  status
                ]
              }`}
            >
              {
                STATUS_LABELS[
                  status
                ]
              }
            </div>
          </div>

          <div className="bottomMeta">
            <div className="songTitle">
              {song.title}
            </div>

            <div className="created">
              Created{' '}
              {new Date(
                song.createdAt
              ).toLocaleDateString(
                'en-IN',
                {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }
              )}
            </div>
          </div>
        </div>

        <div className="body">
          {c ? (
            <div className="section">
              <div className="labelRow">
                <span className="muted">
                  Funding
                  Progress
                </span>

                <span className="strong">
                  {pct}%
                </span>
              </div>

              <div className="progress">
                <div
                  className="progressFill"
                  style={{
                    width: `${pct}%`,
                  }}
                />
              </div>

              <div className="goal">
                {formatINR(
                  c.amountRaised
                )}{' '}
                raised of{' '}
                {formatINR(
                  c.totalFundingAsk
                )}
              </div>
            </div>
          ) : (
            <div className="section">
              <div className="goal">
                No campaign
                attached
              </div>
            </div>
          )}

          <div className="stats">
            <div className="stat">
              <div className="statIcon">
                <TrendingUp
                  size={15}
                />
              </div>

              <div className="statValue">
                {c?.fanRevenueShare ??
                  0}
                %
              </div>

              <div className="statLabel">
                Fan Share
              </div>
            </div>

            <div className="stat">
              <div className="statIcon">
                <Activity
                  size={15}
                />
              </div>

              <div className="statValue">
                {breakeven > 0
                  ? formatStreams(
                      breakeven
                    )
                  : '—'}
              </div>

              <div className="statLabel">
                Breakeven
              </div>
            </div>

            <div className="stat">
              <div className="statIcon">
                <Users
                  size={15}
                />
              </div>

              <div className="statValue">
                {m?.totalInvestors ??
                  0}
              </div>

              <div className="statLabel">
                Investors
              </div>
            </div>
          </div>

          {c && (
            <div className="escrow">
              <div className="escrowTop">
                <div>
                  <div className="escrowLabel">
                    Escrow Held
                  </div>

                  <div className="escrowAmount">
                    ₹
                    {(
                      c.escrowHeldAmount ||
                      0
                    ).toLocaleString(
                      'en-IN'
                    )}
                  </div>
                </div>

                <Wallet
                  size={18}
                  color="#fbbf24"
                />
              </div>

              <div
                className={`escrowStatus ${
                  c.fundsReleased
                    ? 'released'
                    : ''
                }`}
              >
                {c.fundsReleased
                  ? 'Funds Released'
                  : 'Held in Escrow'}
              </div>

              {c.releasedAt && (
                <div
                  className="created"
                  style={{
                    marginTop: 8,
                  }}
                >
                  Released on{' '}
                  {new Date(
                    c.releasedAt
                  ).toLocaleDateString(
                    'en-IN'
                  )}
                </div>
              )}
            </div>
          )}

          <div className="footer">
            <div className="footerLeft">
              <Disc3 size={14} />
              {m?.totalStreams
                ? formatStreams(
                    m.totalStreams
                  )
                : '0'}{' '}
              streams
            </div>

            <div className="open">
              Open
              <ArrowUpRight
                size={14}
              />
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}