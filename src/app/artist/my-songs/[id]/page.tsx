'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import {
  ArrowLeft,
  Music2,
  TrendingUp,
  Users,
  Activity,
  Loader2,
  DollarSign,
  Sparkles,
  BarChart3,
  Disc3,
  Wallet,
  Coins,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import {
  formatINR,
  formatStreams,
  progressPct,
  calculateBreakeven,
} from '@/lib/utils'

const REVENUE_PER_STREAM = 0.05 // 5 paisa

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

export default function SongDetailPage() {
  const { id } =
    useParams<{ id: string }>()

  const [song, setSong] =
    useState<any>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    fetch(`/api/songs/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success)
          setSong(j.data)
        else
          setError(
            'Song not found'
          )
      })
      .catch(() =>
        setError('Network error')
      )
      .finally(() =>
        setLoading(false)
      )
  }, [id])

  if (loading)
    return (
      <ArtistLayout>
        <>
          <style jsx>{`
            .loaderPage {
              min-height: 100vh;
              background: #050505;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .spin {
              animation: spin 1s linear infinite;
              color: #a855f7;
            }

            @keyframes spin {
              to {
                transform: rotate(
                  360deg
                );
              }
            }
          `}</style>

          <div className="loaderPage">
            <Loader2
              size={36}
              className="spin"
            />
          </div>
        </>
      </ArtistLayout>
    )

  if (error || !song)
    return (
      <ArtistLayout>
        <>
          <style jsx>{`
            .errorPage {
              min-height: 100vh;
              background: #050505;
              color: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 18px;
              font-family: Inter,
                sans-serif;
            }

            .back {
              color: #a855f7;
              text-decoration: none;
            }
          `}</style>

          <div className="errorPage">
            <AlertTriangle
              size={36}
              color="#f87171"
            />

            <div>
              {error ||
                'Song not found'}
            </div>

            <Link
              href="/artist/my-songs"
              className="back"
            >
              Back to My Songs
            </Link>
          </div>
        </>
      </ArtistLayout>
    )

  const c = song.campaign
  const m = song.metrics
  const dist =
    song.distribution

  const fanShare =
    c?.fanRevenueShare ?? 0

  const artistPct =
    100 - fanShare

  const pct = c
    ? progressPct(
        c.amountRaised,
        c.totalFundingAsk
      )
    : 0

  const breakeven = c
    ? calculateBreakeven(
        c.totalFundingAsk,
        fanShare
      )
    : 0

  const fanPayPS =
    REVENUE_PER_STREAM *
    (fanShare / 100)

  const status =
    c?.status ??
    song.status ??
    'draft'

  const perM =
    REVENUE_PER_STREAM *
    1_000_000

  const fanPoolPerM =
    perM * (fanShare / 100)

  const artistPerM =
    perM * (artistPct / 100)

  return (
    <ArtistLayout>
      <>
        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #050505;
            color: white;
            font-family: Inter,
              sans-serif;
          }

          .topbar {
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(20px);
            background: rgba(
              0,
              0,
              0,
              0.75
            );
            border-bottom: 1px solid
              rgba(255, 255, 255, 0.06);
            padding: 18px 34px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .backBtn {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #71717a;
            text-decoration: none;
            font-size: 14px;
            transition: 0.3s;
          }

          .backBtn:hover {
            color: white;
          }

          .status {
            padding: 8px 16px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid;
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

          .container {
            max-width: 1250px;
            margin: 0 auto;
            padding: 34px 24px 80px;
          }

          .hero {
            position: relative;
            overflow: hidden;
            border-radius: 36px;
            border: 1px solid
              rgba(255, 255, 255, 0.08);
            background: linear-gradient(
              135deg,
              rgba(168, 85, 247, 0.12),
              rgba(236, 72, 153, 0.06),
              rgba(255, 255, 255, 0.02)
            );
            padding: 34px;
            margin-bottom: 24px;
          }

          .heroGlow {
            position: absolute;
            right: -120px;
            top: -120px;
            width: 320px;
            height: 320px;
            border-radius: 999px;
            background: rgba(
              168,
              85,
              247,
              0.16
            );
            filter: blur(100px);
          }

          .heroContent {
            position: relative;
            z-index: 2;
            display: flex;
            gap: 28px;
          }

          .cover {
            width: 150px;
            height: 150px;
            border-radius: 30px;
            overflow: hidden;
            border: 1px solid
              rgba(255, 255, 255, 0.08);
            background: rgba(
              255,
              255,
              255,
              0.04
            );
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .cover img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .badges {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 18px;
          }

          .badge {
            padding: 8px 14px;
            border-radius: 999px;
            font-size: 12px;
            border: 1px solid
              rgba(255, 255, 255, 0.08);
          }

          .purple {
            background: rgba(
              168,
              85,
              247,
              0.14
            );
            color: #d8b4fe;
            border-color: rgba(
              168,
              85,
              247,
              0.24
            );
          }

          .gray {
            background: rgba(
              255,
              255,
              255,
              0.05
            );
            color: #a1a1aa;
          }

          .red {
            background: rgba(
              239,
              68,
              68,
              0.12
            );
            color: #f87171;
            border-color: rgba(
              239,
              68,
              68,
              0.24
            );
          }

          .title {
            font-size: 44px;
            font-weight: 900;
            line-height: 1;
            letter-spacing: -0.05em;
            margin-bottom: 12px;
          }

          .artist {
            color: #71717a;
            font-size: 15px;
            margin-bottom: 18px;
          }

          .artist strong {
            color: white;
          }

          .description {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid
              rgba(255, 255, 255, 0.06);
            color: #a1a1aa;
            line-height: 1.8;
            font-size: 14px;
          }

          .stats {
            display: grid;
            grid-template-columns: repeat(
              4,
              1fr
            );
            gap: 16px;
            margin-bottom: 24px;
          }

          .statCard {
            background: rgba(
              255,
              255,
              255,
              0.03
            );
            border: 1px solid
              rgba(255, 255, 255, 0.08);
            border-radius: 28px;
            padding: 22px;
          }

          .statTop {
            display: flex;
            justify-content: space-between;
            margin-bottom: 14px;
          }

          .statLabel {
            color: #71717a;
            font-size: 12px;
            margin-bottom: 8px;
          }

          .statValue {
            font-size: 24px;
            font-weight: 800;
          }

          .section {
            background: rgba(
              255,
              255,
              255,
              0.03
            );
            border: 1px solid
              rgba(255, 255, 255, 0.08);
            border-radius: 30px;
            padding: 28px;
            margin-bottom: 24px;
          }

          .sectionTitle {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 24px;
            font-size: 15px;
            font-weight: 600;
          }

          .progress {
            width: 100%;
            height: 10px;
            border-radius: 999px;
            overflow: hidden;
            background: rgba(
              255,
              255,
              255,
              0.06
            );
            margin-top: 18px;
          }

          .progressFill {
            height: 100%;
            background: linear-gradient(
              90deg,
              #a855f7,
              #ec4899
            );
          }

          .grid2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }

          .metricRow {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid
              rgba(255, 255, 255, 0.05);
            font-size: 14px;
          }

          .metricRow:last-child {
            border-bottom: none;
          }

          .muted {
            color: #71717a;
          }

          .strong {
            font-weight: 600;
          }

          .big {
            font-size: 52px;
            font-weight: 900;
            color: #d8b4fe;
            margin-top: 18px;
            line-height: 1;
          }

          .small {
            color: #71717a;
            font-size: 13px;
            line-height: 1.7;
            margin-top: 12px;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
          }

          .table th {
            text-align: left;
            font-size: 11px;
            color: #71717a;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            padding-bottom: 16px;
          }

          .table td {
            padding: 16px 0;
            border-top: 1px solid
              rgba(255, 255, 255, 0.06);
            font-size: 14px;
          }

          .liveBadge {
            background: rgba(
              59,
              130,
              246,
              0.12
            );
            border: 1px solid
              rgba(59, 130, 246, 0.22);
            color: #60a5fa;
            font-size: 11px;
            padding: 4px 8px;
            border-radius: 999px;
          }

          @media (max-width: 1000px) {
            .stats {
              grid-template-columns: 1fr
                1fr;
            }

            .grid2 {
              grid-template-columns: 1fr;
            }

            .heroContent {
              flex-direction: column;
            }
          }

          @media (max-width: 700px) {
            .topbar {
              padding: 18px;
            }

            .container {
              padding: 20px;
            }

            .stats {
              grid-template-columns: 1fr;
            }

            .title {
              font-size: 34px;
            }
          }
        `}</style>

        <div className="page">
          {/* TOPBAR */}
          <div className="topbar">
            <Link
              href="/artist/my-songs"
              className="backBtn"
            >
              <ArrowLeft size={15} />
              My Songs
            </Link>

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

          <div className="container">
            {/* HERO */}
            <div className="hero">
              <div className="heroGlow" />

              <div className="heroContent">
                <div className="cover">
                  {song.coverArtUrl ? (
                    <img
                      src={
                        song.coverArtUrl
                      }
                      alt={
                        song.title
                      }
                    />
                  ) : (
                    <Music2
                      size={42}
                      color="#71717a"
                    />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div className="badges">
                    {song.genre && (
                      <span className="badge purple">
                        {
                          song.genre
                        }
                      </span>
                    )}

                    <span className="badge gray">
                      {
                        song.language
                      }
                    </span>

                    {dist?.explicitLyrics && (
                      <span className="badge red">
                        Explicit
                      </span>
                    )}
                  </div>

                  <div className="title">
                    {song.title}
                  </div>

                  <div className="artist">
                    by{' '}
                    <strong>
                      {dist?.primaryArtist ||
                        song
                          .artist
                          ?.name}
                    </strong>

                    {dist?.additionalArtists
                      ?.length >
                      0 &&
                      ` ft. ${dist.additionalArtists.join(
                        ', '
                      )}`}
                  </div>

                  {song.description && (
                    <div className="description">
                      {
                        song.description
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="stats">
              {[
                {
                  label:
                    'Funding Ask',
                  value:
                    formatINR(
                      c?.totalFundingAsk ||
                        0
                    ),
                  icon:
                    Wallet,
                },
                {
                  label:
                    'Amount Raised',
                  value:
                    formatINR(
                      c?.amountRaised ||
                        0
                    ),
                  icon:
                    Coins,
                },
                {
                  label:
                    'Fan Share',
                  value: `${fanShare}%`,
                  icon:
                    TrendingUp,
                },
                {
                  label:
                    'Investors',
                  value: String(
                    m?.totalInvestors ||
                      0
                  ),
                  icon:
                    Users,
                },
              ].map(
                ({
                  label,
                  value,
                  icon:
                    Icon,
                }) => (
                  <div
                    key={label}
                    className="statCard"
                  >
                    <div className="statTop">
                      <Icon
                        size={
                          18
                        }
                      />
                    </div>

                    <div className="statLabel">
                      {label}
                    </div>

                    <div className="statValue">
                      {value}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* FUNDING */}
            {c && (
              <div className="section">
                <div className="sectionTitle">
                  <DollarSign
                    size={16}
                  />
                  Funding Progress
                </div>

                <div className="metricRow">
                  <span className="muted">
                    Raised
                  </span>

                  <span className="strong">
                    {formatINR(
                      c.amountRaised
                    )}
                  </span>
                </div>

                <div className="metricRow">
                  <span className="muted">
                    Target
                  </span>

                  <span className="strong">
                    {formatINR(
                      c.totalFundingAsk
                    )}
                  </span>
                </div>

                <div className="metricRow">
                  <span className="muted">
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
              </div>
            )}

            {/* ECONOMICS */}
            <div className="grid2">
              <div className="section">
                <div className="sectionTitle">
                  <BarChart3
                    size={16}
                  />
                  Economics
                </div>

                <div className="metricRow">
                  <span className="muted">
                    Revenue /
                    Stream
                  </span>

                  <span className="strong">
                    ₹0.05
                  </span>
                </div>

                <div className="metricRow">
                  <span className="muted">
                    Fan Payout /
                    Stream
                  </span>

                  <span className="strong">
                    ₹
                    {fanPayPS.toFixed(
                      4
                    )}
                  </span>
                </div>

                <div className="metricRow">
                  <span className="muted">
                    Artist Share
                  </span>

                  <span className="strong">
                    {
                      artistPct
                    }
                    %
                  </span>
                </div>

                <div className="big">
                  {formatStreams(
                    breakeven
                  )}
                </div>

                <div className="small">
                  Streams needed
                  for fans to
                  recover funding.
                </div>
              </div>

              <div className="section">
                <div className="sectionTitle">
                  <Sparkles
                    size={16}
                  />
                  Per 1M Streams
                </div>

                <div className="metricRow">
                  <span className="muted">
                    Total Revenue
                  </span>

                  <span className="strong">
                    {formatINR(
                      perM
                    )}
                  </span>
                </div>

                <div className="metricRow">
                  <span className="muted">
                    Fan Pool
                  </span>

                  <span className="strong">
                    {formatINR(
                      fanPoolPerM
                    )}
                  </span>
                </div>

                <div className="metricRow">
                  <span className="muted">
                    Artist Pool
                  </span>

                  <span className="strong">
                    {formatINR(
                      artistPerM
                    )}
                  </span>
                </div>

                <div className="progress">
                  <div
                    className="progressFill"
                    style={{
                      width: `${fanShare}%`,
                    }}
                  />
                </div>

                <div className="small">
                  Fans receive{' '}
                  {fanShare}% of
                  streaming
                  revenue.
                </div>
              </div>
            </div>

            {/* LIVE METRICS */}
            <div className="section">
              <div className="sectionTitle">
                <Activity
                  size={16}
                />
                Live Metrics
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>
                      Metric
                    </th>
                    <th>
                      Value
                    </th>
                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    [
                      'Total Streams',
                      formatStreams(
                        m?.totalStreams ||
                          0
                      ),
                    ],
                    [
                      'Monthly Streams',
                      formatStreams(
                        m?.monthlyStreams ||
                          0
                      ),
                    ],
                    [
                      'Total Revenue',
                      formatINR(
                        m?.totalRevenue ||
                          0
                      ),
                    ],
                    [
                      'Monthly Revenue',
                      formatINR(
                        m?.monthlyRevenue ||
                          0
                      ),
                    ],
                    [
                      'Fan Payouts',
                      formatINR(
                        m?.fanPayoutsTotal ||
                          0
                      ),
                    ],
                    [
                      'Artist Earnings',
                      formatINR(
                        m?.artistEarnings ||
                          0
                      ),
                    ],
                  ].map(
                    (
                      [
                        label,
                        value,
                      ],
                      i
                    ) => (
                      <tr
                        key={
                          i
                        }
                      >
                        <td>
                          {
                            label
                          }
                        </td>

                        <td>
                          <strong>
                            {
                              value
                            }
                          </strong>
                        </td>

                        <td>
                          <span className="liveBadge">
                            Live
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* DISTRIBUTION */}
            {dist && (
              <div className="section">
                <div className="sectionTitle">
                  <Disc3
                    size={16}
                  />
                  Distribution
                  Details
                </div>

                <div className="grid2">
                  <div>
                    <div className="metricRow">
                      <span className="muted">
                        Release
                        Status
                      </span>

                      <span className="strong">
                        {dist.releaseStatus ===
                        'released'
                          ? 'Released'
                          : 'Unreleased'}
                      </span>
                    </div>

                    <div className="metricRow">
                      <span className="muted">
                        Genre
                      </span>

                      <span className="strong">
                        {
                          dist.primaryGenre
                        }
                      </span>
                    </div>

                    <div className="metricRow">
                      <span className="muted">
                        Explicit
                      </span>

                      <span className="strong">
                        {dist.explicitLyrics
                          ? 'Yes'
                          : 'No'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="metricRow">
                      <span className="muted">
                        Free Beat
                      </span>

                      <span className="strong">
                        {dist.hasFreeBeat
                          ? 'Yes'
                          : 'No'}
                      </span>
                    </div>

                    <div className="metricRow">
                      <span className="muted">
                        Release
                        Date
                      </span>

                      <span className="strong">
                        {dist.releaseDate
                          ? new Date(
                              dist.releaseDate
                            ).toLocaleDateString(
                              'en-IN'
                            )
                          : '—'}
                      </span>
                    </div>

                    <div className="metricRow">
                      <span className="muted">
                        Artist
                      </span>

                      <span className="strong">
                        {
                          dist.primaryArtist
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INVESTMENTS */}
            {c?.investments
              ?.length > 0 && (
              <div className="section">
                <div className="sectionTitle">
                  <Users
                    size={16}
                  />
                  Fan
                  Investments
                </div>

                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        Fan ID
                      </th>
                      <th>
                        Amount
                      </th>
                      <th>
                        Ownership
                      </th>
                      <th>
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {c.investments.map(
                      (
                        inv: any
                      ) => (
                        <tr
                          key={
                            inv.id
                          }
                        >
                          <td>
                            {
                              inv.fanId
                            .slice(
                              0,
                              8
                            )
                            }
                            …
                          </td>

                          <td>
                            <strong>
                              {formatINR(
                                inv.amount
                              )}
                            </strong>
                          </td>

                          <td>
                            {
                              inv.ownershipPct
                            .toFixed(
                              2
                            )
                            }
                            %
                          </td>

                          <td>
                            <span className="liveBadge">
                              {
                                inv.status
                              }
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </>
    </ArtistLayout>
  )
}