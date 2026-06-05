'use client'

import ArtistLayout from '@/components/artist/ArtistLayout'
import RaiseFundsWizard from '@/components/raise-funds/RaiseFundsWizard'

export default function RaiseFundsPage() {
  return (
    <ArtistLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .rf-root { min-height: 100vh; background: #09090f; color: #f0f0f8; font-family: 'DM Sans', sans-serif; }

        /* HEADER */
        .rf-header {
          padding: 30px 40px 26px;
          border-bottom: 0.5px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }
        .rf-header::before {
          content: '';
          position: absolute;
          top: -80px; right: -60px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(219,39,119,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .rf-header::after {
          content: '';
          position: absolute;
          top: -40px; left: 20%;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .rf-eyebrow {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #222;
          margin-bottom: 8px;
          position: relative; z-index: 1;
        }
        .rf-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.6px;
          margin-bottom: 5px;
          position: relative; z-index: 1;
        }
        .rf-title span {
          background: linear-gradient(120deg, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .rf-sub {
          font-size: 12.5px;
          color: #333;
          font-weight: 300;
          position: relative; z-index: 1;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .rf-sub-divider { color: #1a1a2a; }
        .rf-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(124,58,237,0.08);
          border: 0.5px solid rgba(124,58,237,0.18);
          border-radius: 999px;
          padding: 3px 10px;
          font-size: 10px;
          color: #7c5cbf;
          letter-spacing: 0.3px;
        }
        .rf-badge-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #a855f7;
          display: inline-block;
          animation: rf-blink 2s infinite;
        }
        @keyframes rf-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        /* WIZARD WRAPPER */
        .rf-wizard-wrap {
          padding: 32px 40px 60px;
        }

        @media (max-width: 720px) {
          .rf-header, .rf-wizard-wrap { padding-left: 20px; padding-right: 20px; }
          .rf-title { font-size: 20px; }
        }
      `}</style>

      <div className="rf-root">

        {/* HEADER */}
        <div className="rf-header">
          <div className="rf-eyebrow">Artist Portal</div>
          <div className="rf-title">
            Raise <span>Funds</span>
          </div>
          <div className="rf-sub">
            <span>Create a campaign to fund your next song</span>
            <span className="rf-sub-divider">·</span>
            <span className="rf-badge">
              <span className="rf-badge-dot" />
              Campaign Builder
            </span>
          </div>
        </div>

        {/* WIZARD — untouched, just wrapped */}
        <div className="rf-wizard-wrap">
          <RaiseFundsWizard />
        </div>

      </div>
    </ArtistLayout>
  )
}