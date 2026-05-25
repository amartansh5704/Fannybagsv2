import ArtistLayout from '@/components/artist/ArtistLayout'
import RaiseFundsWizard from '@/components/raise-funds/RaiseFundsWizard'

export default function RaiseFundsPage() {
  return (
    <ArtistLayout>
      <div className="min-h-screen bg-black">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-lg font-semibold">Raise Funds</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Create a campaign to fund your next song</p>
        </div>
        <RaiseFundsWizard />
      </div>
    </ArtistLayout>
  )
}