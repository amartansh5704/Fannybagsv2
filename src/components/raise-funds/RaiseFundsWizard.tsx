'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WizardProgress from './WizardProgress'
import SongDetail from './steps/SongDetail'
import DistributionDetail from './steps/DistributionDetail'
import FundingDetails from './steps/FundingDetails'
import { formatINR } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

export default function RaiseFundsWizard() {
  const router = useRouter()
  const [step, setStep]                   = useState(1)
  const [songDetail, setSongDetail]       = useState(defaultSongDetail)
  const [distribution, setDistribution]   = useState(defaultDistribution)
  const [funding, setFunding]             = useState(defaultFunding)

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        // Must have title, language, and a valid end date
        return !!(
          songDetail.title.trim() &&
          songDetail.language &&
          songDetail.campaignEndDate
        )
      case 2:
        // Must have picked released or unreleased
        return distribution.releaseStatus !== ''
      case 3:
        // Must have a funding ask ≥ ₹10,000 and any campaign story (even 1 char)
        return (
          funding.totalFundingAsk >= 10000 &&
          funding.campaignStory.trim().length > 0
        )
      case 4:
        return true
      default:
        return true
    }
  }

  const goToReview = () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ songDetail, distribution, funding }))
    router.push('/artist/review')
  }

  const ReviewSummary = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Ready to Review</h2>
        <p className="text-zinc-500 text-sm">
          Click "Go to Review" to see the full campaign preview before publishing.
        </p>
      </div>

      {[
        {
          title: 'Song Details',
          items: [
            ['Title',    songDetail.title],
            ['Language', songDetail.language],
            ['End Date', songDetail.campaignEndDate],
            ['Demo',     songDetail.demoFile?.name ?? 'Not uploaded'],
          ],
        },
        {
          title: 'Distribution',
          items: [
            ['Status',         distribution.releaseStatus || '—'],
            ['Primary Artist', distribution.primaryArtist || '—'],
            ['Genre',          distribution.primaryGenre  || '—'],
            ['Explicit',       distribution.explicitLyrics ? 'Yes' : 'No'],
          ],
        },
        {
          title: 'Funding',
          items: [
            ['Ask',        formatINR(funding.totalFundingAsk)],
            ['Fan Share',  `${funding.fanRevenueShare}%`],
            ['You Retain', `${100 - funding.fanRevenueShare}%`],
          ],
        },
      ].map(section => (
        <div key={section.title}>
          <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">
            {section.title}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {section.items.map(([k, v]) => (
              <div
                key={k}
                className="bg-white/5 border border-white/8 rounded-xl px-4 py-3"
              >
                <p className="text-xs text-zinc-600 mb-1">{k}</p>
                <p className="text-sm font-medium text-zinc-200 truncate">{v || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-10">
        <WizardProgress current={step} />
      </div>

      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6">
        {step === 1 && <SongDetail        data={songDetail}    onChange={setSongDetail} />}
        {step === 2 && <DistributionDetail data={distribution}  onChange={setDistribution} />}
        {step === 3 && <FundingDetails    data={funding}       onChange={setFunding} />}
        {step === 4 && <ReviewSummary />}
      </div>

      {/* Validation hint — shows WHY the button is disabled */}
      {!canProceed() && (
        <p className="text-xs text-amber-400 text-center mb-3">
          {step === 1 && 'Fill in song title, language, and end date to continue'}
          {step === 2 && 'Select a release status to continue'}
          {step === 3 && funding.totalFundingAsk < 10000 && 'Minimum funding ask is ₹10,000'}
          {step === 3 && funding.totalFundingAsk >= 10000 && funding.campaignStory.trim().length === 0 && 'Add a campaign story to continue'}
        </p>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 1}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-zinc-400 rounded-xl text-sm hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <span className="text-xs text-zinc-600">Step {step} of 4</span>

        {step < 4 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={goToReview}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all"
          >
            Go to Review →
          </button>
        )}
      </div>
    </div>
  )
}