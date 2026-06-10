'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WizardProgress from './WizardProgress'
import SongDetail from './steps/SongDetail'
import DistributionDetail from './steps/DistributionDetail'
import FundingDetails from './steps/FundingDetails'
import { formatINR } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Rocket, Music, Radio, Wallet, ClipboardCheck } from 'lucide-react'

const SESSION_KEY = 'fb_wizard_draft'

const defaultSongDetail = {
  title: '',
  language: '',
  campaignEndDate: '',
  demoUrl: '',
  coverArtUrl: '',
  demoFile: null as File | null,
  coverArtFile: null as File | null,
}

const defaultDistribution = {
  releaseStatus:     '' as 'released' | 'unreleased' | '',
  migrationApproved: false,
  releaseName:       '',
  primaryGenre:      '',
  releaseDate:       '',
  explicitLyrics:    false,
  coverArtDist:      '',
  primaryArtist:     '',
  additionalArtists: [] as string[],
  songFileUrl:       '',
  hasFreeBeat:       false,
  spotifyLink:       '',
  appleMusicLink:    '',
  releaseType:       'single' as 'single' | 'album',
  contributors:      [] as import('@/components/raise-funds/steps/DistributionDetail').Contributor[],
}

const defaultFunding = {
  totalFundingAsk: 0,
  royaltySharingOn: true,
  fanRevenueShare: 20,
  budget: { production: 0, mixMaster: 0, videoPromo: 0, marketing: 0, other: 0 },
  campaignStory: '',
}

const STEP_META = [
  { icon: Music,          label: 'Song Details',   emoji: '🎵' },
  { icon: Radio,          label: 'Distribution',   emoji: '📡' },
  { icon: Wallet,         label: 'Funding',        emoji: '💰' },
  { icon: ClipboardCheck, label: 'Review',         emoji: '✅' },
]

export default function RaiseFundsWizard() {
  const router = useRouter()
  const [step, setStep]                   = useState(1)
  const [songDetail, setSongDetail]       = useState(defaultSongDetail)
  const [distribution, setDistribution]   = useState(defaultDistribution)
  const [funding, setFunding]             = useState(defaultFunding)
  const [hoveredBtn, setHoveredBtn]       = useState<string | null>(null)

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return !!(songDetail.title.trim() && songDetail.language && songDetail.campaignEndDate)
      case 2: return distribution.releaseStatus !== ''
      case 3: return funding.totalFundingAsk >= 2000 && funding.campaignStory.trim().length > 0
      case 4: return true
      default: return true
    }
  }

  const validationHint = (): string => {
    if (canProceed()) return ''
    if (step === 1) return 'Fill in song title, language, and end date to continue'
    if (step === 2) return 'Select a release status to continue'
    if (step === 3 && funding.totalFundingAsk < 2000) return 'Minimum funding ask is ₹2,000'
    if (step === 3) return 'Add a campaign story to continue'
    return ''
  }

  const goToReview = () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ songDetail, distribution, funding }))
    router.push('/artist/review')
  }

  const meta = STEP_META[step - 1]

  return (
    <>
      <style>{`
        @keyframes rfFadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rfFloatOrb { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
        @keyframes rfGradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes rfPulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes rfSlideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#06060a',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
      }}>

        {/* Ambient background */}
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-100px', right:'-80px', width:500, height:500, background:'radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)', borderRadius:'50%', animation:'rfFloatOrb 8s ease-in-out infinite' }} />
          <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:400, height:400, background:'radial-gradient(circle,rgba(236,72,153,0.05) 0%,transparent 70%)', borderRadius:'50%', animation:'rfFloatOrb 12s ease-in-out infinite' }} />
          <div style={{ position:'absolute', top:'40%', left:'50%', width:350, height:350, background:'radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%)', borderRadius:'50%', transform:'translateX(-50%)' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)`, backgroundSize:'60px 60px' }} />
        </div>

        <div style={{ position:'relative', zIndex:1, maxWidth:720, margin:'0 auto', padding:'40px 24px 60px' }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:36, animation:'rfFadeInUp 0.5s ease-out' }}>
            <div style={{
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              width:56, height:56, borderRadius:18,
              background:'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.15))',
              border:'1px solid rgba(139,92,246,0.2)',
              boxShadow:'0 8px 32px rgba(139,92,246,0.15)',
              marginBottom:16, fontSize:24,
            }}>
              <Rocket size={24} color="#c084fc" />
            </div>
            <h1 style={{
              fontSize:28, fontWeight:800, margin:'0 0 6px 0',
              background:'linear-gradient(135deg,#fff 0%,#a1a1aa 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>Raise Funds</h1>
            <p style={{ fontSize:14, color:'#52525b', margin:0, fontWeight:500 }}>
              Launch your campaign in 4 simple steps
            </p>
          </div>

          {/* Progress */}
          <div style={{ marginBottom:32, animation:'rfFadeInUp 0.5s ease-out 0.1s both' }}>
            <WizardProgress current={step} />
          </div>

          {/* Step header pill */}
          <div style={{
            display:'flex', alignItems:'center', gap:12,
            marginBottom:20,
            animation:'rfFadeInUp 0.5s ease-out 0.15s both',
          }}>
            <div style={{
              width:38, height:38, borderRadius:12,
              background:'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(236,72,153,0.08))',
              border:'1px solid rgba(139,92,246,0.18)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16,
            }}>
              {meta.emoji}
            </div>
            <div>
              <p style={{ fontSize:16, fontWeight:700, color:'#fff', margin:0 }}>{meta.label}</p>
              <p style={{ fontSize:12, color:'#52525b', margin:'2px 0 0 0', fontWeight:500 }}>Step {step} of 4</p>
            </div>
          </div>

          {/* Content card */}
          <div style={{
            position:'relative', overflow:'hidden',
            background:'linear-gradient(135deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%)',
            border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:24, padding:32,
            backdropFilter:'blur(20px)',
            marginBottom:20,
            animation:'rfSlideIn 0.4s ease-out 0.2s both',
          }}>
            {/* Top gradient accent */}
            <div style={{
              position:'absolute', top:0, left:0, right:0, height:3,
              background:'linear-gradient(90deg,#8b5cf6,#ec4899,#8b5cf6)',
              backgroundSize:'200% 100%', animation:'rfGradShift 4s ease-in-out infinite',
            }} />

            {step === 1 && <SongDetail        data={songDetail}   onChange={setSongDetail} />}
            {step === 2 && <DistributionDetail data={distribution} onChange={setDistribution} />}
            {step === 3 && <FundingDetails    data={funding}      onChange={setFunding} />}
            {step === 4 && <ReviewSummary songDetail={songDetail} distribution={distribution} funding={funding} />}
          </div>

          {/* Validation hint */}
          {validationHint() && (
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              padding:'10px 18px', marginBottom:16,
              background:'rgba(245,158,11,0.06)',
              border:'1px solid rgba(245,158,11,0.12)',
              borderRadius:14,
              animation:'rfFadeInUp 0.3s ease-out',
            }}>
              <span style={{ fontSize:14 }}>⚠️</span>
              <span style={{ fontSize:12, color:'#fbbf24', fontWeight:600 }}>{validationHint()}</span>
            </div>
          )}

          {/* Navigation */}
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            animation:'rfFadeInUp 0.5s ease-out 0.25s both',
          }}>
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              onMouseEnter={() => setHoveredBtn('back')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'12px 22px',
                background: step === 1 ? 'rgba(255,255,255,0.02)' : hoveredBtn === 'back' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.08)',
                borderRadius:14,
                color: step === 1 ? '#27272a' : hoveredBtn === 'back' ? '#fff' : '#71717a',
                fontSize:14, fontWeight:600,
                cursor: step === 1 ? 'not-allowed' : 'pointer',
                transition:'all 0.3s ease',
                fontFamily:'inherit',
                opacity: step === 1 ? 0.3 : 1,
                transform: hoveredBtn === 'back' && step !== 1 ? 'translateX(-2px)' : 'translateX(0)',
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {/* Step dots */}
            <div style={{ display:'flex', gap:8 }}>
              {[1,2,3,4].map(s => (
                <div key={s} style={{
                  width: s === step ? 24 : 8, height:8,
                  borderRadius:999,
                  background: s === step
                    ? 'linear-gradient(135deg,#8b5cf6,#ec4899)'
                    : s < step
                      ? 'rgba(16,185,129,0.4)'
                      : 'rgba(255,255,255,0.08)',
                  transition:'all 0.3s ease',
                }} />
              ))}
            </div>

            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                onMouseEnter={() => setHoveredBtn('next')}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'12px 24px',
                  background: !canProceed()
                    ? 'rgba(255,255,255,0.03)'
                    : 'linear-gradient(135deg,#7c3aed,#db2777)',
                  border: !canProceed() ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  borderRadius:14,
                  color: !canProceed() ? '#3f3f46' : '#fff',
                  fontSize:14, fontWeight:700,
                  cursor: !canProceed() ? 'not-allowed' : 'pointer',
                  transition:'all 0.3s ease',
                  fontFamily:'inherit',
                  opacity: !canProceed() ? 0.4 : 1,
                  boxShadow: canProceed() && hoveredBtn === 'next' ? '0 6px 30px rgba(139,92,246,0.4)' : canProceed() ? '0 4px 20px rgba(139,92,246,0.25)' : 'none',
                  transform: canProceed() && hoveredBtn === 'next' ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={goToReview}
                onMouseEnter={() => setHoveredBtn('review')}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'12px 28px',
                  background:'linear-gradient(135deg,#7c3aed,#db2777)',
                  border:'none', borderRadius:14,
                  color:'#fff', fontSize:14, fontWeight:700,
                  cursor:'pointer', transition:'all 0.3s ease',
                  fontFamily:'inherit',
                  boxShadow: hoveredBtn === 'review' ? '0 8px 40px rgba(139,92,246,0.4)' : '0 4px 24px rgba(139,92,246,0.25)',
                  transform: hoveredBtn === 'review' ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                <Rocket size={15} /> Go to Review
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── REVIEW SUMMARY COMPONENT ───────────────────────────────────────────────── */

function ReviewSummary({
  songDetail,
  distribution,
  funding,
}: {
  songDetail: typeof defaultSongDetail
  distribution: typeof defaultDistribution
  funding: typeof defaultFunding
}) {
  const sections = [
    {
      title: 'Song Details',
      icon: '🎵',
      color: 'rgba(139,92,246,',
      items: [
        ['Title',    songDetail.title],
        ['Language', songDetail.language],
        ['End Date', songDetail.campaignEndDate],
        ['Demo',     songDetail.demoFile?.name ?? 'Not uploaded'],
      ],
    },
    {
      title: 'Distribution',
      icon: '📡',
      color: 'rgba(59,130,246,',
      items: [
        ['Status',         distribution.releaseStatus || '—'],
        ['Primary Artist', distribution.primaryArtist || '—'],
        ['Genre',          distribution.primaryGenre  || '—'],
        ['Explicit',       distribution.explicitLyrics ? 'Yes' : 'No'],
      ],
    },
    {
      title: 'Funding',
      icon: '💰',
      color: 'rgba(16,185,129,',
      items: [
        ['Ask',        formatINR(funding.totalFundingAsk)],
        ['Fan Share',  `${funding.fanRevenueShare}%`],
        ['You Retain', `${100 - funding.fanRevenueShare}%`],
      ],
    },
  ]

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#fff', margin:'0 0 6px 0' }}>Ready to Review</h2>
        <p style={{ fontSize:13, color:'#52525b', margin:0, lineHeight:1.6 }}>
          Click &ldquo;Go to Review&rdquo; to see the full campaign preview before publishing.
        </p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        {sections.map(section => (
          <div key={section.title}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ fontSize:15 }}>{section.icon}</span>
              <p style={{
                fontSize:10, fontWeight:700, textTransform:'uppercase',
                letterSpacing:'0.12em', color:'#52525b', margin:0,
              }}>
                {section.title}
              </p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {section.items.map(([k, v]) => (
                <div key={k as string} style={{
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.06)',
                  borderRadius:14, padding:'14px 16px',
                }}>
                  <p style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'#3f3f46', margin:'0 0 4px 0' }}>{k}</p>
                  <p style={{
                    fontSize:14, fontWeight:600, color:'#e4e4e7', margin:0,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  }}>{(v as string) || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}