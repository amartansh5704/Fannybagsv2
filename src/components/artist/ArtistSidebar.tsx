'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Music,
  LayoutDashboard,
  PlusCircle,
  Wallet,
  Users,
  Settings,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',      href: '/artist/dashboard' },
  { icon: PlusCircle,      label: 'Raise Funds',    href: '/artist/raise-funds' },
  { icon: Music,           label: 'My Songs',        href: '/artist/my-songs' },
  { icon: Users,           label: 'Find Khapeetar', href: '/artist/find-khapeetar' },
  { icon: Briefcase,       label: 'Work & Deals',   href: '/artist/deals' },
  { icon: Wallet,          label: 'Wallet',          href: '/artist/wallet' },
  { icon: Briefcase, label: 'Jobs', href: '/artist/jobs' },
  { icon: Info, label: 'How It Works', href: '/how-it-works/artists' },
]

interface Props {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export default function ArtistSidebar({ collapsed, setCollapsed }: Props) {
  const pathname = usePathname()

  return (
    <>
      <style>{`
        .sb-root {
          height: 100vh;
          background: #08080f;
          border-right: 0.5px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.23,1,0.32,1);
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .sb-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 260px;
          background: radial-gradient(ellipse at 30% 0%, rgba(124,58,237,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* LOGO */
        .sb-logo {
          display: flex;
          align-items: center;
          height: 64px;
          padding: 0 18px;
          border-bottom: 0.5px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          gap: 10px;
        }
        .sb-logo-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #7c3aed, #db2777);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(124,58,237,0.35);
        }
        .sb-logo-text {
          font-family: 'Syne', system-ui, sans-serif;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          background: linear-gradient(120deg, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
        }

        /* PORTAL LABEL */
        .sb-section-label {
          padding: 12px 18px 8px;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #252535;
          border-bottom: 0.5px solid rgba(255,255,255,0.04);
          white-space: nowrap;
          position: relative;
          z-index: 1;
        }

        /* NAV */
        .sb-nav {
          flex: 1;
          padding: 10px 10px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          z-index: 1;
        }
        .sb-nav::-webkit-scrollbar { width: 0; }

        .sb-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 12px;
          border-radius: 11px;
          font-size: 13px;
          font-weight: 400;
          text-decoration: none;
          transition: all 0.18s ease;
          white-space: nowrap;
          border: 0.5px solid transparent;
          color: #3a3a55;
          position: relative;
          overflow: hidden;
        }
        .sb-link:hover {
          background: rgba(255,255,255,0.04);
          color: #aaa;
          border-color: rgba(255,255,255,0.05);
        }
        .sb-link.active {
          background: linear-gradient(135deg, rgba(124,58,237,0.18), rgba(219,39,119,0.10));
          color: #c084fc;
          border-color: rgba(124,58,237,0.22);
          box-shadow: inset 0 0 20px rgba(124,58,237,0.04);
        }
        .sb-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 2.5px;
          border-radius: 0 2px 2px 0;
          background: linear-gradient(180deg, #7c3aed, #db2777);
        }
        .sb-link.active svg { color: #c084fc; }
        .sb-link-label { transition: opacity 0.2s; }

        /* COLLAPSED CENTER ICONS */
        .sb-link.collapsed-mode {
          justify-content: center;
          padding: 10px;
        }

        /* BOTTOM ACTIONS */
        .sb-bottom {
          border-top: 0.5px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .sb-collapse-btn {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 11px;
          color: #2a2a3a;
          background: none;
          border: none;
          border-bottom: 0.5px solid rgba(255,255,255,0.04);
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
          white-space: nowrap;
        }
        .sb-collapse-btn:hover { color: #666; background: rgba(255,255,255,0.02); }

        .sb-logout-btn {
          width: 100%;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: #2a2a3a;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
          white-space: nowrap;
        }
        .sb-logout-btn:hover {
          color: #f87171;
          background: rgba(239,68,68,0.05);
        }
      `}</style>

      <aside
        className="sb-root"
        style={{ width: collapsed ? '64px' : '240px' }}
      >
        {/* LOGO */}
        <div className="sb-logo" style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '0' : '0 18px' }}>
          <div className="sb-logo-icon">
            <Music size={14} color="#fff" />
          </div>
          {!collapsed && <span className="sb-logo-text">FannyBags</span>}
        </div>

        {/* SECTION LABEL */}
        {!collapsed && (
          <div className="sb-section-label">Artist Portal</div>
        )}

        {/* NAV ITEMS */}
        <nav className="sb-nav">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn('sb-link', active && 'active', collapsed && 'collapsed-mode')}
              >
                <Icon size={16} strokeWidth={active ? 2 : 1.5} />
                {!collapsed && <span className="sb-link-label">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* BOTTOM */}
        <div className="sb-bottom">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sb-collapse-btn"
          >
            {collapsed
              ? <ChevronRight size={15} />
              : <><ChevronLeft size={15} />Collapse</>
            }
          </button>

          <button
            onClick={() => signOut({ callbackUrl: '/artist/login' })}
            className="sb-logout-btn"
          >
            <LogOut size={14} />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  )
}