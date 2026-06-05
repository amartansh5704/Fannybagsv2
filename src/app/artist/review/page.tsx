'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ArtistLayout from '@/components/artist/ArtistLayout'
import {
  Music2,
  ArrowLeft,
  Send,
  Edit3,
  TrendingUp,
  Wallet,
  Coins,
  Loader2,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Disc3,
} from 'lucide-react'

const SESSION_KEY = 'fb_wizard_draft'
const REVENUE_PER_STREAM = 0.05 // 5 paisa

export default function ReviewPage() {
  const router = useRouter()

  const [draft, setDraft] =
    useState<any>(null)

  const [publishing, setPublishing] =
    useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
    const raw =
      sessionStorage.getItem(
        SESSION_KEY
      )

    if (!raw) {
      router.replace(
        '/artist/raise-funds'
      )
      return
    }

    setDraft(JSON.parse(raw))
  }, [router])

  if (!draft) {
    return (
      <ArtistLayout>
        <div className="loaderPage">
          <Loader2
            className="spin"
            size={34}
          />
        </div>

        <style jsx>{`
          .loaderPage {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #a855f7;
          }

          .spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </ArtistLayout>
    )
  }

  const {
    songDetail,
    distribution,
    funding,
  } = draft

  const fanShare =
    funding.fanRevenueShare

  const artistRetains =
    100 - fanShare

  const platformFee = Math.round(
    funding.totalFundingAsk * 0.05
  )

  const artistReceives =
    funding.totalFundingAsk -
    platformFee

  const fanPayPerStream =
    REVENUE_PER_STREAM *
    (fanShare / 100)

  const breakeven =
    fanPayPerStream > 0
      ? Math.round(
          funding.totalFundingAsk /
            fanPayPerStream
        )
      : 0

  const totalBudget =
    Object.values(
      funding.budget as Record<
        string,
        number
      >
    ).reduce((a, b) => a + b, 0)

  const formatINR = (
    n: number
  ) =>
    `₹${n.toLocaleString('en-IN')}`

  const formatStreams = (
    n: number
  ) => {
    if (n >= 1_000_000_000)
      return `${(
        n / 1_000_000_000
      ).toFixed(1)}B`

    if (n >= 1_000_000)
      return `${(
        n / 1_000_000
      ).toFixed(1)}M`

    if (n >= 1_000)
      return `${(
        n / 1_000
      ).toFixed(1)}K`

    return n.toLocaleString('en-IN')
  }

  const publish = async () => {
    setPublishing(true)
    setError('')

    try {
      const res = await fetch(
        '/api/songs',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            songDetail,
            distribution,
            funding,
          }),
        }
      )

      const json = await res.json()

      if (!json.success) {
        throw new Error(
          json.error?.message ||
            'Unknown error'
        )
      }

      sessionStorage.removeItem(
        SESSION_KEY
      )

      router.push('/artist/my-songs')
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : 'Something went wrong'
      )
    } finally {
      setPublishing(false)
    }
  }

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
            background: transparent;
            border: none;
            color: #71717a;
            cursor: pointer;
            font-size: 14px;
          }

          .status {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            color: #fbbf24;
          }

          .pulse {
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: #fbbf24;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% {
              opacity: 0.4;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.4;
            }
          }

          .actions {
            display: flex;
            gap: 12px;
          }

          .ghostBtn {
            height: 42px;
            padding: 0 18px;
            border-radius: 14px;
            border: 1px solid
              rgba(255, 255, 255, 0.08);
            background: rgba(
              255,
              255,
              255,
              0.04
            );
            color: #d4d4d8;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }

          .publishBtn {
            height: 42px;
            padding: 0 22px;
            border-radius: 14px;
            border: none;
            background: linear-gradient(
              135deg,
              #a855f7,
              #ec4899
            );
            color: white;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            cursor: pointer;
          }

          .publishBtn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 38px 24px 80px;
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
              rgba(236, 72, 153, 0.05),
              rgba(255, 255, 255, 0.02)
            );
            padding: 34px;
            margin-bottom: 28px;
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
              0.14
            );
            filter: blur(90px);
          }

          .heroContent {
            position: relative;
            display: flex;
            gap: 28px;
            z-index: 2;
          }

          .cover {
            width: 130px;
            height: 130px;
            border-radius: 28px;
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
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 16px;
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
              0.15
            );
            color: #d8b4fe;
            border-color: rgba(
              168,
              85,
              247,
              0.25
            );
          }

          .dark {
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
              0.25
            );
          }

          .songTitle {
            font-size: 40px;
            font-weight: 800;
            letter-spacing: -0.04em;
            margin-bottom: 8px;
          }

          .artistLine {
            color: #71717a;
            font-size: 15px;
            margin-bottom: 18px;
          }

          .artistName {
            color: white;
            font-weight: 600;
          }

          .story {
            margin-top: 26px;
            padding-top: 22px;
            border-top: 1px solid
              rgba(255, 255, 255, 0.06);
            color: #a1a1aa;
            line-height: 1.8;
            font-size: 14px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(
              4,
              1fr
            );
            gap: 16px;
            margin-bottom: 24px;
          }

          .card {
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

          .cardTop {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
          }

          .cardLabel {
            color: #71717a;
            font-size: 12px;
            margin-bottom: 8px;
          }

          .cardValue {
            font-size: 22px;
            font-weight: 700;
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
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 24px;
          }

          .economics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .econCard {
            background: rgba(
              255,
              255,
              255,
              0.03
            );
            border: 1px solid
              rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 24px;
          }

          .econRow {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid
              rgba(255, 255, 255, 0.05);
            font-size: 14px;
          }

          .econRow:last-child {
            border-bottom: 0;
          }

          .muted {
            color: #71717a;
          }

          .strong {
            font-weight: 600;
          }

          .bigNumber {
            font-size: 54px;
            font-weight: 800;
            letter-spacing: -0.04em;
            margin-top: 16px;
            color: #d8b4fe;
          }

          .smallText {
            color: #71717a;
            font-size: 13px;
            line-height: 1.7;
            margin-top: 10px;
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
            margin-top: 22px;
          }

          .progressFill {
            height: 100%;
            background: linear-gradient(
              90deg,
              #a855f7,
              #ec4899
            );
          }

          .budgetList {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .budgetRow {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .budgetLabel {
            width: 160px;
            color: #a1a1aa;
            font-size: 14px;
          }

          .budgetBar {
            flex: 1;
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

          .budgetFill {
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(168, 85, 247, 0.7),
              rgba(236, 72, 153, 0.7)
            );
          }

          .budgetValue {
            width: 120px;
            text-align: right;
            font-size: 14px;
            font-weight: 600;
          }

          .footer {
            margin-top: 40px;
            padding-top: 28px;
            border-top: 1px solid
              rgba(255, 255, 255, 0.06);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }

          .footerText {
            max-width: 500px;
            text-align: center;
            color: #71717a;
            font-size: 12px;
            line-height: 1.8;
          }

          .footerBtns {
            display: flex;
            gap: 14px;
          }

          .error {
            margin-bottom: 22px;
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(
              239,
              68,
              68,
              0.08
            );
            border: 1px solid
              rgba(239, 68, 68, 0.18);
            color: #f87171;
            padding: 16px;
            border-radius: 20px;
            font-size: 14px;
          }

          .spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 1000px) {
            .grid {
              grid-template-columns: 1fr 1fr;
            }

            .economics {
              grid-template-columns: 1fr;
            }

            .heroContent {
              flex-direction: column;
            }
          }

          @media (max-width: 700px) {
            .topbar {
              padding: 18px;
              flex-direction: column;
              gap: 16px;
            }

            .grid {
              grid-template-columns: 1fr;
            }

            .songTitle {
              font-size: 30px;
            }

            .container {
              padding: 20px;
            }

            .footerBtns {
              width: 100%;
              flex-direction: column;
            }

            .ghostBtn,
            .publishBtn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>

        <div className="page">
          <div className="topbar">
            <button
              onClick={() =>
                router.back()
              }
              className="backBtn"
            >
              <ArrowLeft size={15} />
              Back to wizard
            </button>

            <div className="status">
              <span className="pulse" />
              Draft — Not published
            </div>

            <div className="actions">
              <button
                onClick={() =>
                  router.back()
                }
                className="ghostBtn"
              >
                <Edit3 size={15} />
                Edit
              </button>

              <button
                onClick={publish}
                disabled={publishing}
                className="publishBtn"
              >
                {publishing ? (
                  <>
                    <Loader2
                      size={15}
                      className="spin"
                    />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Publish Song
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="container">
            {error && (
              <div className="error">
                <AlertTriangle
                  size={16}
                />
                {error}
              </div>
            )}

            {/* HERO */}
            <div className="hero">
              <div className="heroGlow" />

              <div className="heroContent">
                <div className="cover">
                  {songDetail.coverArtUrl ? (
                    <img
                      src={
                        songDetail.coverArtUrl
                      }
                      alt="cover"
                    />
                  ) : (
                    <Music2
                      size={38}
                      color="#71717a"
                    />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div className="badges">
                    <span className="badge purple">
                      {
                        distribution.primaryGenre
                      }
                    </span>

                    <span className="badge dark">
                      {
                        songDetail.language
                      }
                    </span>

                    {distribution.explicitLyrics && (
                      <span className="badge red">
                        Explicit
                      </span>
                    )}
                  </div>

                  <div className="songTitle">
                    {songDetail.title ||
                      'Untitled Song'}
                  </div>

                  <div className="artistLine">
                    by{' '}
                    <span className="artistName">
                      {
                        distribution.primaryArtist
                      }
                    </span>

                    {distribution
                      .additionalArtists
                      ?.length > 0 &&
                      ` ft. ${distribution.additionalArtists.join(
                        ', '
                      )}`}
                  </div>

                  {funding.campaignStory && (
                    <div className="story">
                      {
                        funding.campaignStory
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="grid">
              <div className="card">
                <div className="cardTop">
                  <Wallet size={18} />
                </div>

                <div className="cardLabel">
                  Funding Ask
                </div>

                <div className="cardValue">
                  {formatINR(
                    funding.totalFundingAsk
                  )}
                </div>
              </div>

              <div className="card">
                <div className="cardTop">
                  <Coins size={18} />
                </div>

                <div className="cardLabel">
                  You Receive
                </div>

                <div className="cardValue">
                  {formatINR(
                    artistReceives
                  )}
                </div>
              </div>

              <div className="card">
                <div className="cardTop">
                  <TrendingUp
                    size={18}
                  />
                </div>

                <div className="cardLabel">
                  Fan Share
                </div>

                <div className="cardValue">
                  {fanShare}%
                </div>
              </div>

              <div className="card">
                <div className="cardTop">
                  <Sparkles size={18} />
                </div>

                <div className="cardLabel">
                  You Retain
                </div>

                <div className="cardValue">
                  {artistRetains}%
                </div>
              </div>
            </div>

            {/* ECONOMICS */}
            <div className="section">
              <div className="sectionTitle">
                <BarChart3 size={16} />
                Economics
              </div>

              <div className="economics">
                <div className="econCard">
                  <div className="econRow">
                    <span className="muted">
                      Revenue / Stream
                    </span>

                    <span className="strong">
                      ₹0.05
                    </span>
                  </div>

                  <div className="econRow">
                    <span className="muted">
                      Fan Payout /
                      Stream
                    </span>

                    <span className="strong">
                      ₹
                      {fanPayPerStream.toFixed(
                        4
                      )}
                    </span>
                  </div>

                  <div className="econRow">
                    <span className="muted">
                      Platform Fee
                    </span>

                    <span className="strong">
                      {formatINR(
                        platformFee
                      )}
                    </span>
                  </div>

                  <div className="bigNumber">
                    {formatStreams(
                      breakeven
                    )}
                  </div>

                  <div className="smallText">
                    Streams needed for
                    fans to collectively
                    recover{' '}
                    {formatINR(
                      funding.totalFundingAsk
                    )}
                  </div>
                </div>

                <div className="econCard">
                  <div className="econRow">
                    <span className="muted">
                      Total Revenue /
                      1M Streams
                    </span>

                    <span className="strong">
                      ₹50,000
                    </span>
                  </div>

                  <div className="econRow">
                    <span className="muted">
                      Fan Pool
                    </span>

                    <span className="strong">
                      {formatINR(
                        50000 *
                          (fanShare /
                            100)
                      )}
                    </span>
                  </div>

                  <div className="econRow">
                    <span className="muted">
                      Artist Pool
                    </span>

                    <span className="strong">
                      {formatINR(
                        50000 *
                          (artistRetains /
                            100)
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

                  <div className="smallText">
                    Fans receive{' '}
                    {fanShare}% of
                    streaming revenue.
                  </div>
                </div>
              </div>
            </div>

            {/* BUDGET */}
            {totalBudget > 0 && (
              <div className="section">
                <div className="sectionTitle">
                  <Disc3 size={16} />
                  Budget Allocation
                </div>

                <div className="budgetList">
                  {[
                    [
                      '🎹 Production',
                      funding.budget
                        .production,
                    ],
                    [
                      '🎚️ Mix & Master',
                      funding.budget
                        .mixMaster,
                    ],
                    [
                      '🎬 Video / Promo',
                      funding.budget
                        .videoPromo,
                    ],
                    [
                      '📣 Marketing',
                      funding.budget
                        .marketing,
                    ],
                    [
                      '📦 Other',
                      funding.budget
                        .other,
                    ],
                  ]
                    .filter(
                      ([, v]) =>
                        (v as number) >
                        0
                    )
                    .map(
                      ([label, val]) => (
                        <div
                          key={
                            label as string
                          }
                          className="budgetRow"
                        >
                          <div className="budgetLabel">
                            {
                              label as string
                            }
                          </div>

                          <div className="budgetBar">
                            <div
                              className="budgetFill"
                              style={{
                                width: `${Math.round(
                                  ((val as number) /
                                    totalBudget) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>

                          <div className="budgetValue">
                            {formatINR(
                              val as number
                            )}
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className="footer">
              <div className="footerText">
                By publishing this
                campaign you confirm
                you own the rights to
                this release and agree
                to the FannyBags
                artist agreement.
              </div>

              <div className="footerBtns">
                <button
                  onClick={() =>
                    router.back()
                  }
                  className="ghostBtn"
                >
                  Cancel
                </button>

                <button
                  onClick={publish}
                  disabled={publishing}
                  className="publishBtn"
                >
                  {publishing ? (
                    <>
                      <Loader2
                        size={15}
                        className="spin"
                      />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Publish Song
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </ArtistLayout>
  )
}