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
  const [focused, setFocused] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [hoveredPortfolio, setHoveredPortfolio] = useState<string | null>(null)

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

  // Style helpers
  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    background: focused === fieldName ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === fieldName ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '14px',
    padding: '14px 16px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    boxShadow: focused === fieldName
      ? '0 0 0 3px rgba(16,185,129,0.08), 0 4px 16px rgba(16,185,129,0.06)'
      : 'none',
  })

  const labelStyle = (fieldName?: string): React.CSSProperties => ({
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: fieldName && focused === fieldName ? '#34d399' : '#52525b',
    marginBottom: '8px',
    transition: 'color 0.3s ease',
  })

  if (status === 'loading' || loading) {
    return (
      <KhapeetarLayout>
        <style jsx global>{`
          @keyframes floatOrb { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', background: '#06060a', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            borderRadius: '50%', animation: 'floatOrb 4s ease-in-out infinite',
          }} />
          <Loader2 style={{ animation: 'spin 1s linear infinite', color: '#34d399', width: '36px', height: '36px', position: 'relative', zIndex: 1 }} />
          <p style={{ marginTop: '16px', color: '#52525b', fontSize: '14px', letterSpacing: '0.05em', position: 'relative', zIndex: 1 }}>
            Loading profile...
          </p>
        </div>
      </KhapeetarLayout>
    )
  }

  return (
    <KhapeetarLayout>
      <style jsx global>{`
        @keyframes floatOrb { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
        @keyframes floatOrb2 { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-15px) scale(1.03); } }
        @keyframes floatOrb3 { 0%, 100% { transform: translate(0,0) scale(1); } 40% { transform: translate(20px,25px) scale(1.03); } 80% { transform: translate(-15px,-10px) scale(0.97); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInStagger { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } }
        @keyframes savedPop { 0% { transform: scale(0.9); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes imageReveal { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: scale(1); } }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px #0a0a0f inset !important;
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        textarea { font-family: inherit; }
        .profile-scroll::-webkit-scrollbar { width: 5px; }
        .profile-scroll::-webkit-scrollbar-track { background: transparent; }
        .profile-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#06060a', color: '#ffffff',
        position: 'relative', overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Ambient */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-30px', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', borderRadius: '50%', animation: 'floatOrb 10s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '50%', left: '-80px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 70%)', borderRadius: '50%', animation: 'floatOrb2 13s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-40px', right: '30%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(52,211,153,0.03) 0%, transparent 70%)', borderRadius: '50%', animation: 'floatOrb3 16s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        </div>

        {/* Header */}
        <div style={{
          position: 'relative', zIndex: 1,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
          backdropFilter: 'blur(20px)',
          animation: 'fadeInDown 0.5s ease-out',
        }}>
          <div style={{
            padding: '24px 32px', maxWidth: '1100px', margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.08))',
                border: '1px solid rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(16,185,129,0.08)',
                fontSize: '20px',
              }}>👤</div>
              <div>
                <h1 style={{
                  fontSize: '22px', fontWeight: 800, margin: 0,
                  background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Profile</h1>
                <p style={{ fontSize: '13px', color: '#52525b', margin: '2px 0 0 0', fontWeight: 500 }}>
                  Manage your public profile
                </p>
              </div>
            </div>

            {profile && (
              <button
                onClick={save}
                disabled={saving}
                onMouseEnter={() => setHovered('save')}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '11px 22px',
                  background: saved
                    ? 'rgba(16,185,129,0.15)'
                    : saving
                      ? 'rgba(255,255,255,0.04)'
                      : hovered === 'save'
                        ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(20,184,166,0.15))'
                        : 'rgba(16,185,129,0.08)',
                  border: `1px solid ${saved ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.2)'}`,
                  borderRadius: '14px',
                  color: saved ? '#34d399' : '#34d399',
                  fontSize: '13px', fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  fontFamily: 'inherit',
                  transform: hovered === 'save' && !saving ? 'translateY(-1px)' : 'translateY(0)',
                  boxShadow: hovered === 'save' && !saving ? '0 4px 20px rgba(16,185,129,0.15)' : 'none',
                  opacity: saving ? 0.5 : 1,
                  animation: saved ? 'savedPop 0.3s ease-out' : 'none',
                }}
              >
                {saving ? (
                  <div style={{
                    width: '14px', height: '14px',
                    border: '2px solid rgba(52,211,153,0.3)',
                    borderTopColor: '#34d399',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                ) : (
                  <Save size={14} />
                )}
                {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="profile-scroll" style={{
          position: 'relative', zIndex: 1,
          padding: '28px 32px 48px',
          maxWidth: '1100px', margin: '0 auto',
        }}>
          {!profile ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '100px 0',
              animation: 'fadeInUp 0.6s ease-out',
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px', fontSize: '32px',
              }}>👤</div>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#52525b' }}>No profile found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* BASIC INFO */}
              <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '22px', padding: '28px',
                backdropFilter: 'blur(20px)',
                animation: 'fadeInStagger 0.5s ease-out 0.1s both',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: 'linear-gradient(90deg, transparent, #10b981, #14b8a6, transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 4s ease-in-out infinite',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '10px',
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px',
                  }}>📋</div>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: 0 }}>
                    Basic Information
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
                    { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
                    { key: 'primaryRole', label: 'Primary Role', placeholder: 'Music Producer' },
                    { key: 'startingBudget', label: 'Starting Budget (₹)', placeholder: '1500', type: 'number' },
                    { key: 'city', label: 'City', placeholder: 'Mumbai' },
                    { key: 'state', label: 'State', placeholder: 'Maharashtra' },
                    { key: 'experienceYears', label: 'Experience Years', placeholder: '3', type: 'number' },
                    { key: 'projectsCompleted', label: 'Projects Completed', placeholder: '25', type: 'number' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={labelStyle(field.key)}>{field.label}</label>
                      <input
                        type={field.type || 'text'}
                        value={profile[field.key] || ''}
                        onChange={(e) => update(field.key, e.target.value)}
                        onFocus={() => setFocused(field.key)}
                        onBlur={() => setFocused(null)}
                        placeholder={field.placeholder}
                        style={inputStyle(field.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* BIO */}
              <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '22px', padding: '28px',
                backdropFilter: 'blur(20px)',
                animation: 'fadeInStagger 0.5s ease-out 0.2s both',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '10px',
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px',
                  }}>✍️</div>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: 0 }}>Bio</h2>
                </div>

                <textarea
                  rows={5}
                  value={profile.bio || ''}
                  onChange={(e) => update('bio', e.target.value)}
                  onFocus={() => setFocused('bio')}
                  onBlur={() => setFocused(null)}
                  placeholder="Tell artists about yourself, your style, notable work, equipment..."
                  style={{
                    ...inputStyle('bio'),
                    resize: 'none' as const,
                    minHeight: '130px',
                    lineHeight: '1.6',
                  }}
                />

                {/* Char count bar */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: '8px',
                }}>
                  <div style={{
                    height: '2px', flex: 1, marginRight: '12px',
                    borderRadius: '1px', background: 'rgba(255,255,255,0.04)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, ((profile.bio?.length || 0) / 300) * 100)}%`,
                      background: 'linear-gradient(90deg, #10b981, #14b8a6)',
                      borderRadius: '1px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#3f3f46', fontWeight: 500, flexShrink: 0 }}>
                    {profile.bio?.length || 0} chars
                  </span>
                </div>
              </div>

              {/* SOCIAL LINKS */}
              <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '22px', padding: '28px',
                backdropFilter: 'blur(20px)',
                animation: 'fadeInStagger 0.5s ease-out 0.3s both',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '10px',
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px',
                  }}>🔗</div>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: 0 }}>Social Links</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {[
                    { key: 'instagram', label: 'Instagram', placeholder: '@yourhandle', emoji: '📸' },
                    { key: 'youtube', label: 'YouTube', placeholder: 'youtube.com/yourchannel', emoji: '🎬' },
                    { key: 'spotifyCredits', label: 'Spotify Credits', placeholder: "Songs you've worked on...", emoji: '🎵' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={labelStyle(field.key)}>
                        {field.emoji} {field.label}
                      </label>
                      <input
                        value={profile[field.key] || ''}
                        onChange={(e) => update(field.key, e.target.value)}
                        onFocus={() => setFocused(field.key)}
                        onBlur={() => setFocused(null)}
                        placeholder={field.placeholder}
                        style={inputStyle(field.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* PORTFOLIO */}
              <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '22px', padding: '28px',
                backdropFilter: 'blur(20px)',
                animation: 'fadeInStagger 0.5s ease-out 0.4s both',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '10px',
                      background: 'rgba(245,158,11,0.08)',
                      border: '1px solid rgba(245,158,11,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px',
                    }}>🎨</div>
                    <div>
                      <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: 0 }}>Portfolio</h2>
                      <p style={{ fontSize: '11px', color: '#3f3f46', margin: '2px 0 0 0', fontWeight: 500 }}>
                        {(profile.portfolioLinks || []).length} item{(profile.portfolioLinks || []).length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <label
                    onMouseEnter={() => setHovered('upload')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      position: 'relative',
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '11px 22px',
                      background: uploading
                        ? 'rgba(255,255,255,0.04)'
                        : hovered === 'upload'
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'linear-gradient(135deg, #10b981, #14b8a6)',
                      border: 'none',
                      borderRadius: '14px',
                      color: uploading ? '#52525b' : '#000',
                      fontSize: '13px', fontWeight: 700,
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      fontFamily: 'inherit',
                      transform: hovered === 'upload' && !uploading ? 'translateY(-1px)' : 'translateY(0)',
                      boxShadow: hovered === 'upload' && !uploading
                        ? '0 6px 28px rgba(16,185,129,0.3)'
                        : '0 2px 12px rgba(16,185,129,0.15)',
                      opacity: uploading ? 0.5 : 1,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Shimmer */}
                    {hovered === 'upload' && !uploading && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s linear infinite',
                        pointerEvents: 'none',
                      }} />
                    )}
                    {uploading ? (
                      <div style={{
                        width: '16px', height: '16px',
                        border: '2px solid rgba(255,255,255,0.2)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        position: 'relative',
                      }} />
                    ) : (
                      <Upload size={16} style={{ position: 'relative' }} />
                    )}
                    <span style={{ position: 'relative' }}>
                      {uploading ? 'Uploading...' : 'Upload Media'}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      hidden
                      onChange={uploadPortfolio}
                    />
                  </label>
                </div>

                {/* Portfolio Grid */}
                {(profile.portfolioLinks && profile.portfolioLinks.length > 0) ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '14px',
                  }}>
                    {profile.portfolioLinks.map((url: string, i: number) => {
                      const isVideo = url.includes('.mp4') || url.includes('/video/')
                      const isHov = hoveredPortfolio === url

                      return (
                        <div
                          key={url}
                          onMouseEnter={() => setHoveredPortfolio(url)}
                          onMouseLeave={() => setHoveredPortfolio(null)}
                          style={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '16px',
                            border: `1px solid ${isHov ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                            background: '#0d0d12',
                            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                            transform: isHov ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
                            boxShadow: isHov
                              ? '0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(16,185,129,0.05)'
                              : '0 2px 8px rgba(0,0,0,0.15)',
                            animation: `fadeInStagger 0.4s ease-out ${i * 0.06}s both`,
                          }}
                        >
                          {isVideo ? (
                            <video
                              src={url}
                              controls
                              style={{
                                width: '100%', height: '180px', objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                          ) : (
                            <img
                              src={url}
                              alt=""
                              style={{
                                width: '100%', height: '180px', objectFit: 'cover',
                                display: 'block',
                                transition: 'transform 0.4s ease',
                                transform: isHov ? 'scale(1.05)' : 'scale(1)',
                                animation: 'imageReveal 0.5s ease-out',
                              }}
                            />
                          )}

                          {/* Overlay gradient */}
                          <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: isHov
                              ? 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)'
                              : 'transparent',
                            transition: 'background 0.3s ease',
                            pointerEvents: 'none',
                          }} />

                          {/* Type badge */}
                          <div style={{
                            position: 'absolute', bottom: '10px', left: '10px',
                            padding: '4px 10px',
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '8px',
                            fontSize: '10px', fontWeight: 600,
                            color: '#a1a1aa',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            opacity: isHov ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                          }}>
                            {isVideo ? <Video size={10} /> : <ImageIcon size={10} />}
                            {isVideo ? 'Video' : 'Image'}
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              removePortfolioItem(url)
                            }}
                            onMouseEnter={() => setHovered(`remove-${url}`)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                              position: 'absolute', top: '8px', right: '8px',
                              width: '28px', height: '28px',
                              borderRadius: '8px',
                              background: hovered === `remove-${url}`
                                ? 'rgba(239,68,68,0.9)'
                                : 'rgba(239,68,68,0.7)',
                              border: 'none',
                              color: '#fff',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.2s ease',
                              opacity: isHov ? 1 : 0,
                              transform: isHov ? 'scale(1)' : 'scale(0.8)',
                              boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
                            }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: '48px 0',
                    borderRadius: '16px',
                    border: '2px dashed rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.01)',
                  }}>
                    <div style={{
                      display: 'flex', gap: '16px', marginBottom: '14px',
                    }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <ImageIcon size={18} color="#27272a" />
                      </div>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Video size={18} color="#27272a" />
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#3f3f46', margin: '0 0 4px 0' }}>
                      No portfolio uploaded yet
                    </p>
                    <p style={{ fontSize: '12px', color: '#27272a', margin: 0 }}>
                      Upload images and videos to showcase your work
                    </p>
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