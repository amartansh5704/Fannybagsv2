'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import { Loader2, Music } from 'lucide-react'

export default function SongDetailPage() {
  const params = useParams()
  const router = useRouter()

  const [song, setSong] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [projectTitle, setProjectTitle] = useState('')
  const [workType, setWorkType] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')

  useEffect(() => {
    fetch('/api/fan/discover')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          const found = j.data.find(
            (s: any) => s.id === params.id
          )
          setSong(found)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const sendRequest = async () => {
    const res = await fetch('/api/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        artistId: song.artist.id,
        projectTitle,
        workType,
        description,
        budget,
      }),
    })

    const json = await res.json()

    if (!json.success) {
      alert(json.error || 'Failed')
      return
    }

    router.push('/khapeetar/deals')
  }

  if (loading) {
    return (
      <KhapeetarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-emerald-400" />
        </div>
      </KhapeetarLayout>
    )
  }

  if (!song) {
    return (
      <KhapeetarLayout>
        <div className="flex items-center justify-center min-h-screen">
          Song not found
        </div>
      </KhapeetarLayout>
    )
  }

  return (
    <KhapeetarLayout>
      <div className="min-h-screen bg-black text-white px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden">
              {song.coverArtUrl ? (
                <img
                  src={song.coverArtUrl}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={50} className="text-zinc-700" />
                </div>
              )}
            </div>

            <h1 className="text-3xl font-semibold mt-6">
              {song.title}
            </h1>

            <p className="text-zinc-500 mt-2">
              {song.artist?.name}
            </p>
          </div>

          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">
              Send Work Request
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Project title"
                value={projectTitle}
                onChange={(e) =>
                  setProjectTitle(e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              />

              <input
                placeholder="Work type"
                value={workType}
                onChange={(e) =>
                  setWorkType(e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[140px]"
              />

              <input
                placeholder="Budget"
                value={budget}
                onChange={(e) =>
                  setBudget(e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              />

              <button
                onClick={sendRequest}
                className="w-full bg-emerald-500 py-3 rounded-xl font-medium"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </KhapeetarLayout>
  )
}