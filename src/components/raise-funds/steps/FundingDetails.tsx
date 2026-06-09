'use client'

import { useMemo } from 'react'
import {
  Wallet,
  Sparkles,
  TrendingUp,
  Coins,
  BadgeDollarSign,
} from 'lucide-react'

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

export default function FundingDetails({
  data,
  onChange,
}: Props) {
  const update = (
    key: keyof FundingData,
    val: unknown
  ) =>
    onChange({
      ...data,
      [key]: val,
    })

  const updateBudget = (
    key: keyof BudgetAllocation,
    val: number
  ) =>
    onChange({
      ...data,
      budget: {
        ...data.budget,
        [key]: val,
      },
    })

  const totalBudget = useMemo(
    () =>
      Object.values(data.budget).reduce(
        (a, b) => a + b,
        0
      ),
    [data.budget]
  )

  const platformFee = Math.round(
    data.totalFundingAsk * 0.05
  )

  const artistReceives =
    data.totalFundingAsk - platformFee

  const artistRetains =
    100 - data.fanRevenueShare

  const breakevenStreams =
    data.fanRevenueShare > 0
      ? Math.round(
          data.totalFundingAsk /
            (0.05 *
              (data.fanRevenueShare /
                100))
        )
      : 0

  const budgetItems = [
    {
      key: 'production' as const,
      label: 'Production',
      emoji: '🎹',
    },
    {
      key: 'mixMaster' as const,
      label: 'Mix & Master',
      emoji: '🎚️',
    },
    {
      key: 'videoPromo' as const,
      label: 'Video / Promo',
      emoji: '🎬',
    },
    {
      key: 'marketing' as const,
      label: 'Marketing',
      emoji: '📣',
    },
    {
      key: 'other' as const,
      label: 'Other',
      emoji: '📦',
    },
  ]

  const formatINR = (n: number) =>
    `₹${n.toLocaleString('en-IN')}`

  const fmtStreams = (n: number) => {
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

  return (
    <>
      <style jsx>{`
        .page {
          color: white;
          font-family: Inter, sans-serif;
        }

        .hero {
          margin-bottom: 38px;
        }

        .title {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.04em;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #71717a;
          font-size: 15px;
          line-height: 1.7;
        }

        .section {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 32px;
          padding: 28px;
          margin-bottom: 24px;
          backdrop-filter: blur(18px);
        }

        .label {
          display: block;
          margin-bottom: 12px;
          color: #71717a;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .inputWrap {
          position: relative;
        }

        .currency {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
          font-size: 14px;
        }

        .input {
          width: 100%;
          height: 64px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          padding: 0 20px 0 42px;
          color: white;
          outline: none;
          font-size: 15px;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        .input:focus {
          border-color: rgba(168,85,247,0.45);
          box-shadow: 0 0 0 4px rgba(168,85,247,0.12);
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 16px;
          margin-top: 18px;
        }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 20px;
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
        }

        .cardValue {
          font-size: 20px;
          font-weight: 700;
        }

        .white {
          color: white;
        }

        .pink {
          color: #f472b6;
        }

        .green {
          color: #4ade80;
        }

        .toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 22px;
        }

        .toggleTitle {
          font-size: 15px;
          font-weight: 600;
        }

        .toggleSub {
          margin-top: 6px;
          color: #71717a;
          font-size: 13px;
        }

        .switch {
          width: 58px;
          height: 32px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .switchOn {
          background: linear-gradient(
            135deg,
            #a855f7,
            #ec4899
          );
        }

        .switchOff {
          background: rgba(255,255,255,0.08);
        }

        .knob {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: white;
          top: 4px;
          transition: all 0.3s ease;
        }

        .knobOn {
          left: 30px;
        }

        .knobOff {
          left: 4px;
        }

        .sliderTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .shareValue {
          font-size: 44px;
          font-weight: 800;
          color: #d8b4fe;
        }

        .retain {
          color: #71717a;
          font-size: 13px;
          text-align: right;
        }

        .slider {
          width: 100%;
          accent-color: #a855f7;
          height: 8px;
        }

        .sliderLabels {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          color: #71717a;
          font-size: 12px;
        }

        .warning {
          margin-top: 16px;
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.18);
          padding: 14px;
          border-radius: 18px;
          color: #fbbf24;
          font-size: 13px;
          line-height: 1.7;
        }

        .calc {
          background: linear-gradient(
            135deg,
            rgba(168,85,247,0.1),
            rgba(236,72,153,0.06)
          );
          border: 1px solid rgba(168,85,247,0.18);
          border-radius: 30px;
          padding: 28px;
        }

        .calcTitle {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #71717a;
          font-weight: 700;
          margin-bottom: 22px;
        }

        .calcGrid {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .calcLabel {
          color: #71717a;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .calcValue {
          font-size: 15px;
          font-weight: 600;
        }

        .formula {
          background: rgba(0,0,0,0.35);
          border-radius: 18px;
          padding: 16px;
          font-family: monospace;
          color: #71717a;
          font-size: 12px;
          line-height: 1.8;
          margin-bottom: 24px;
        }

        .breakEven {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
        }

        .breakLabel {
          color: #71717a;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .breakValue {
          font-size: 52px;
          font-weight: 800;
          color: #d8b4fe;
          line-height: 1;
        }

        .breakText {
          color: #71717a;
          font-size: 13px;
          line-height: 1.7;
          max-width: 240px;
          text-align: right;
        }

        .budgetList {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .budgetRow {
          display: grid;
          grid-template-columns: 30px 130px 1fr;
          align-items: center;
          gap: 14px;
        }

        .budgetName {
          color: #a1a1aa;
          font-size: 14px;
        }

        .budgetWrap {
          position: relative;
        }

        .budgetCurrency {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
          font-size: 12px;
        }

        .budgetInput {
          width: 100%;
          height: 54px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          padding: 0 16px 0 30px;
          color: white;
          outline: none;
          font-size: 14px;
          box-sizing: border-box;
        }

        .budgetInput:focus {
          border-color: rgba(168,85,247,0.4);
        }

        .budgetFooter {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .budgetFooterLabel {
          color: #71717a;
          font-size: 13px;
        }

        .budgetFooterValue {
          font-size: 16px;
          font-weight: 700;
        }

        .textarea {
          width: 100%;
          min-height: 200px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          padding: 20px;
          color: white;
          outline: none;
          resize: none;
          font-size: 15px;
          line-height: 1.8;
          box-sizing: border-box;
        }

        .textarea:focus {
          border-color: rgba(168,85,247,0.45);
          box-shadow: 0 0 0 4px rgba(168,85,247,0.12);
        }

        .charCount {
          margin-top: 10px;
          text-align: right;
          color: #71717a;
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .cards {
            grid-template-columns: 1fr;
          }

          .calcGrid {
            grid-template-columns: 1fr;
          }

          .breakEven {
            flex-direction: column;
            align-items: flex-start;
          }

          .breakText {
            max-width: 100%;
            text-align: left;
          }

          .budgetRow {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page">
        <div className="hero">
          <div className="title">
            Funding Details
          </div>

          <div className="subtitle">
            Configure campaign economics,
            fan royalty sharing and funding
            allocation for your release.
          </div>
        </div>

        {/* FUNDING ASK */}
        <div className="section">
          <label className="label">
            Total Funding Ask
          </label>

          <div className="inputWrap">
            <span className="currency">
              ₹
            </span>

            <input
              type="number"
              value={
                data.totalFundingAsk || ''
              }
              onChange={(e) =>
                update(
                  'totalFundingAsk',
                  parseFloat(
                    e.target.value
                  ) || 0
                )
              }
              placeholder="2000"
              min={101}
              className="input"
            />
          </div>

          {data.totalFundingAsk > 0 && (
            <div className="cards">
              <div className="card">
                <div className="cardTop">
                  <Wallet size={18} />
                </div>

                <div className="cardLabel">
                  You Raise
                </div>

                <div className="cardValue white">
                  {formatINR(
                    data.totalFundingAsk
                  )}
                </div>
              </div>

              <div className="card">
                <div className="cardTop">
                  <BadgeDollarSign
                    size={18}
                  />
                </div>

                <div className="cardLabel">
                  Platform Fee
                </div>

                <div className="cardValue pink">
                  -
                  {formatINR(
                    platformFee
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

                <div className="cardValue green">
                  {formatINR(
                    artistReceives
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ROYALTY */}
        <div className="section">
          <div className="toggle">
            <div>
              <div className="toggleTitle">
                Royalty Sharing
              </div>

              <div className="toggleSub">
                Enable fan earnings from
                your streaming revenue.
              </div>
            </div>

            <button
              onClick={() =>
                update(
                  'royaltySharingOn',
                  !data.royaltySharingOn
                )
              }
              className={`switch ${
                data.royaltySharingOn
                  ? 'switchOn'
                  : 'switchOff'
              }`}
            >
              <span
                className={`knob ${
                  data.royaltySharingOn
                    ? 'knobOn'
                    : 'knobOff'
                }`}
              />
            </button>
          </div>

          {data.royaltySharingOn && (
            <div
              style={{ marginTop: 24 }}
            >
              <div className="sliderTop">
                <label className="label">
                  Fan Revenue Share
                </label>

                <div>
                  <div className="shareValue">
                    {
                      data.fanRevenueShare
                    }
                    %
                  </div>

                  <div className="retain">
                    {artistRetains}% you
                    retain
                  </div>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={
                  data.fanRevenueShare
                }
                onChange={(e) =>
                  update(
                    'fanRevenueShare',
                    parseInt(
                      e.target.value
                    )
                  )
                }
                className="slider"
              />

              <div className="sliderLabels">
                <span>1%</span>
                <span>100%</span>
              </div>

              {data.fanRevenueShare ===
                100 && (
                <div className="warning">
                  ⚠️ You are offering
                  100% revenue share to
                  fans.
                </div>
              )}
            </div>
          )}
        </div>

        {/* BREAKEVEN */}
        {data.totalFundingAsk > 0 &&
          data.royaltySharingOn && (
            <div className="calc">
              <div className="calcTitle">
                Campaign Breakeven
                Calculator
              </div>

              <div className="calcGrid">
                <div>
                  <div className="calcLabel">
                    Revenue / Stream
                  </div>

                  <div className="calcValue">
                    ₹0.05
                  </div>
                </div>

                <div>
                  <div className="calcLabel">
                    Fan Payout /
                    Stream
                  </div>

                  <div className="calcValue">
                    ₹
                    {(
                      0.05 *
                      (data.fanRevenueShare /
                        100)
                    ).toFixed(7)}
                  </div>
                </div>

                <div>
                  <div className="calcLabel">
                    Funding Ask
                  </div>

                  <div className="calcValue">
                    {formatINR(
                      data.totalFundingAsk
                    )}
                  </div>
                </div>

                <div>
                  <div className="calcLabel">
                    Fan Share
                  </div>

                  <div className="calcValue">
                    {
                      data.fanRevenueShare
                    }
                    %
                  </div>
                </div>
              </div>

              <div className="formula">
                <div>
                  fanPayoutPerStream =
                  0.05 × (
                  {
                    data.fanRevenueShare
                  }{' '}
                  / 100)
                </div>

                <div>
                  breakEvenStreams ={' '}
                  {formatINR(
                    data.totalFundingAsk
                  )}{' '}
                  ÷ fanPayoutPerStream
                </div>
              </div>

              <div className="breakEven">
                <div>
                  <div className="breakLabel">
                    Breakeven Streams
                  </div>

                  <div className="breakValue">
                    {fmtStreams(
                      breakevenStreams
                    )}
                  </div>
                </div>

                <div className="breakText">
                  Fans collectively need{' '}
                  <strong>
                    {fmtStreams(
                      breakevenStreams
                    )}{' '}
                    streams
                  </strong>{' '}
                  to recover{' '}
                  {formatINR(
                    data.totalFundingAsk
                  )}
                </div>
              </div>
            </div>
          )}

        {/* BUDGET */}
        <div className="section">
          <label className="label">
            Budget Allocation
          </label>

          <div className="budgetList">
            {budgetItems.map(
              ({
                key,
                label,
                emoji,
              }) => (
                <div
                  key={key}
                  className="budgetRow"
                >
                  <div>{emoji}</div>

                  <div className="budgetName">
                    {label}
                  </div>

                  <div className="budgetWrap">
                    <span className="budgetCurrency">
                      ₹
                    </span>

                    <input
                      type="number"
                      value={
                        data.budget[
                          key
                        ] || ''
                      }
                      onChange={(e) =>
                        updateBudget(
                          key,
                          parseFloat(
                            e.target.value
                          ) || 0
                        )
                      }
                      placeholder="0"
                      className="budgetInput"
                    />
                  </div>
                </div>
              )
            )}
          </div>

          {totalBudget > 0 && (
            <div className="budgetFooter">
              <div className="budgetFooterLabel">
                Total Budgeted
              </div>

              <div
                className="budgetFooterValue"
                style={{
                  color:
                    totalBudget >
                    data.totalFundingAsk
                      ? '#f87171'
                      : '#4ade80',
                }}
              >
                {formatINR(
                  totalBudget
                )}
              </div>
            </div>
          )}
        </div>

        {/* STORY */}
        <div className="section">
          <label className="label">
            Campaign Story
          </label>

          <textarea
            value={data.campaignStory}
            onChange={(e) =>
              update(
                'campaignStory',
                e.target.value
              )
            }
            placeholder="Tell fans why this song matters, your vision, rollout strategy and why they should support your campaign."
            className="textarea"
          />

          <div className="charCount">
            {
              data.campaignStory
                .length
            }{' '}
            chars
          </div>
        </div>
      </div>
    </>
  )
}