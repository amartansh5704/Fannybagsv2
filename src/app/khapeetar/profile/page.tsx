'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import KhapeetarLayout from '@/components/khapeetar/KhapeetarLayout'
import {
  Loader2,
  Save,
  Upload,
  X,
  Image as ImageIcon,
  Video,
} from 'lucide-react'

export default function KhapeetarProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [profile, setProfile] = useState<any>(null)
  const [profileId, setProfileId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/khapeetar/login')
      return
    }

    fetch('/api/khapeetar/me')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setProfile(j.data)
          setProfileId(j.data.id)
        }
      })
      .finally(() => setLoading(false))
  }, [session, status])

  const update = (key: string, value: any) => {
    setProfile((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }

  const save = async () => {
    if (!profileId || !profile) return

    setSaving(true)

    const res = await fetch(`/api/khapeetar/${profileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    })

    const json = await res.json()

    setSaving(false)

    if (json.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      alert(json.error || 'Save failed')
    }
  }

  const uploadPortfolio = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files

    if (!files || files.length === 0) return

    setUploading(true)

    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (json.success) {
        uploadedUrls.push(json.url)
      }
    }

    update('portfolioLinks', [
      ...(profile.portfolioLinks || []),
      ...uploadedUrls,
    ])

    setUploading(false)
  }

  const removePortfolioItem = (url: string) => {
    update(
      'portfolioLinks',
      profile.portfolioLinks.filter((item: string) => item !== url)
    )
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/60 transition-all placeholder:text-zinc-600'

  const Label = ({ text }: { text: string }) => (
    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
      {text}
    </label>
  )

  if (status === 'loading' || loading) {
    return (
      <KhapeetarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-emerald-400" size={28} />
        </div>
      </KhapeetarLayout>
    )
  }

  return (
    <KhapeetarLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Profile</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Manage your public profile
            </p>
          </div>

          {profile && (
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm hover:bg-emerald-500/25 transition-all"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}

              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          )}
        </div>

        <div className="px-8 py-6 max-w-5xl">
          {!profile ? (
            <p className="text-zinc-500 text-center py-20">
              No profile found.
            </p>
          ) : (
            <div className="space-y-8">
              {/* BASIC */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-5">
                  Basic Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label text="Full Name" />
                    <input
                      className={inputClass}
                      value={profile.name || ''}
                      onChange={(e) =>
                        update('name', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label text="Phone" />
                    <input
                      className={inputClass}
                      value={profile.phone || ''}
                      onChange={(e) =>
                        update('phone', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label text="Primary Role" />
                    <input
                      className={inputClass}
                      value={profile.primaryRole || ''}
                      onChange={(e) =>
                        update('primaryRole', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label text="Starting Budget (₹)" />
                    <input
                      className={inputClass}
                      type="number"
                      value={profile.startingBudget || ''}
                      onChange={(e) =>
                        update('startingBudget', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label text="City" />
                    <input
                      className={inputClass}
                      value={profile.city || ''}
                      onChange={(e) =>
                        update('city', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label text="State" />
                    <input
                      className={inputClass}
                      value={profile.state || ''}
                      onChange={(e) =>
                        update('state', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label text="Experience Years" />
                    <input
                      className={inputClass}
                      type="number"
                      value={profile.experienceYears || ''}
                      onChange={(e) =>
                        update('experienceYears', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label text="Projects Completed" />
                    <input
                      className={inputClass}
                      type="number"
                      value={profile.projectsCompleted || ''}
                      onChange={(e) =>
                        update('projectsCompleted', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* BIO */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-5">Bio</h2>

                <textarea
                  rows={5}
                  className={`${inputClass} resize-none`}
                  value={profile.bio || ''}
                  onChange={(e) =>
                    update('bio', e.target.value)
                  }
                />
              </div>

              {/* SOCIAL */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-5">Social Links</h2>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    className={inputClass}
                    placeholder="Instagram"
                    value={profile.instagram || ''}
                    onChange={(e) =>
                      update('instagram', e.target.value)
                    }
                  />

                  <input
                    className={inputClass}
                    placeholder="YouTube"
                    value={profile.youtube || ''}
                    onChange={(e) =>
                      update('youtube', e.target.value)
                    }
                  />

                  <input
                    className={inputClass}
                    placeholder="Spotify Credits"
                    value={profile.spotifyCredits || ''}
                    onChange={(e) =>
                      update('spotifyCredits', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* PORTFOLIO */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold">Portfolio</h2>

                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-emerald-500 text-white flex items-center gap-2">
                    {uploading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Upload size={16} />
                    )}

                    Upload Media

                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      hidden
                      onChange={uploadPortfolio}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {(profile.portfolioLinks || []).map(
                    (url: string) => {
                      const isVideo =
                        url.includes('.mp4') ||
                        url.includes('/video/')

                      return (
                        <div
                          key={url}
                          className="relative bg-white/5 rounded-xl overflow-hidden border border-white/10"
                        >
                          {isVideo ? (
                            <video
                              src={url}
                              controls
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <img
                              src={url}
                              alt=""
                              className="w-full h-48 object-cover"
                            />
                          )}

                          <button
                            onClick={() =>
                              removePortfolioItem(url)
                            }
                            className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )
                    }
                  )}
                </div>

                {(!profile.portfolioLinks ||
                  profile.portfolioLinks.length === 0) && (
                  <div className="text-zinc-500 text-center py-10">
                    <div className="flex justify-center gap-4 mb-3">
                      <ImageIcon />
                      <Video />
                    </div>
                    No portfolio uploaded yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </KhapeetarLayout>
  )
}