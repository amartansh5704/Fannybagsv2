'use client'
import { useState, useEffect } from 'react'
import KhapeetarSidebar from './KhapeetarSidebar'
import { Menu, X } from 'lucide-react'

export default function KhapeetarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile]     = useState(false)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setCollapsed(true)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: '#fff', position: 'relative' }}>

      {/* ── DESKTOP SIDEBAR ──────────────────────────────────────── */}
      {!isMobile && (
        <div style={{ width: collapsed ? '64px' : '240px', flexShrink: 0, transition: 'width 0.3s ease' }}>
          <KhapeetarSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
      )}

      {/* ── MOBILE OVERLAY BACKDROP ──────────────────────────────── */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* ── MOBILE SIDEBAR DRAWER ────────────────────────────────── */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
          width: '240px',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <KhapeetarSidebar collapsed={false} setCollapsed={() => setMobileOpen(false)} />
        </div>
      )}

      {/* ── MOBILE HAMBURGER BUTTON ───────────────────────────────── */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{
            position: 'fixed', top: 14, left: 14, zIndex: 60,
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'inherit',
          }}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main style={{
        flex: 1, minWidth: 0, overflowY: 'auto',
        paddingTop: isMobile ? '64px' : '0',
      }}>
        {children}
      </main>
    </div>
  )
}