'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import {
  LayoutDashboard,
  Inbox,
  Zap,
  Wallet,
  User,
  ChevronLeft,
  ChevronRight,
  Music,
  LogOut,
  Briefcase,
} from 'lucide-react'

const navItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/khapeetar/dashboard',
  },
  {
    icon: Music,
    label: 'Find Songs',
    href: '/khapeetar/find-songs',
  },
  {
    icon: Inbox,
    label: 'All Deals',
    href: '/khapeetar/deals',
  },
  {
    icon: Zap,
    label: 'Active Deals',
    href: '/khapeetar/active-deals',
  },
  {
    icon: Wallet,
    label: 'Wallet',
    href: '/khapeetar/wallet',
  },
  {
    icon: User,
    label: 'Profile',
    href: '/khapeetar/profile',
  },
  { icon: Briefcase, label: 'Find Jobs', href: '/khapeetar/jobs' },
]

interface Props {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export default function KhapeetarSidebar({
  collapsed,
  setCollapsed,
}: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await signOut({ redirect: false })
    router.push('/khapeetar/login')
  }

  return (
    <>
      <style jsx global>{`
        @keyframes sidebarFadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(2deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes slideLabel {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .sidebar-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.04);
          border-radius: 2px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.08);
        }
      `}</style>

      <aside style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: collapsed ? '68px' : '248px',
        background: '#08080c',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        flexShrink: 0,
        zIndex: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: collapsed ? '-20px' : '20px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          transition: 'left 0.3s ease',
        }} />

        {/* Logo area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '64px',
          padding: collapsed ? '0' : '0 20px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          flexShrink: 0,
          position: 'relative',
          transition: 'padding 0.3s ease',
        }}>
          {/* Logo glow */}
          <div style={{
            position: 'absolute',
            left: collapsed ? '50%' : '20px',
            top: '50%',
            transform: collapsed ? 'translate(-50%, -50%)' : 'translateY(-50%)',
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(8px)',
            pointerEvents: 'none',
            transition: 'left 0.3s ease',
          }} />

          <div
            onMouseEnter={() => setHovered('logo')}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #14b8a6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(16,185,129,0.25)',
              transition: 'all 0.3s ease',
              transform: hovered === 'logo' ? 'scale(1.08)' : 'scale(1)',
              cursor: 'pointer',
              animation: 'logoFloat 4s ease-in-out infinite',
            }}
          >
            <Zap size={15} color="#fff" />
          </div>

          {!collapsed && (
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #34d399, #14b8a6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.01em',
              animation: 'slideLabel 0.3s ease-out',
              whiteSpace: 'nowrap',
            }}>
              FannyBags
            </span>
          )}
        </div>

        {/* Portal label */}
        {!collapsed && (
          <div style={{
            padding: '14px 20px 10px',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            flexShrink: 0,
            animation: 'slideLabel 0.3s ease-out',
          }}>
            <p style={{
              fontSize: '10px',
              color: '#27272a',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
              margin: 0,
            }}>
              Khapeetar Portal
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-scroll" style={{
          flex: 1,
          padding: collapsed ? '12px 8px' : '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'padding 0.3s ease',
        }}>
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href
            const isHovered = hovered === href

            return (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setHovered(href)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: collapsed ? '12px 0' : '11px 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#34d399' : isHovered ? '#d4d4d8' : '#52525b',
                  background: active
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(20,184,166,0.06))'
                    : isHovered
                      ? 'rgba(255,255,255,0.03)'
                      : 'transparent',
                  border: active
                    ? '1px solid rgba(16,185,129,0.15)'
                    : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  overflow: 'hidden',
                  transform: isHovered && !active ? 'translateX(2px)' : 'translateX(0)',
                }}
              >
                {/* Active left bar */}
                {active && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '3px',
                    borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg, #10b981, #14b8a6)',
                    boxShadow: '0 0 8px rgba(16,185,129,0.4)',
                  }} />
                )}

                {/* Active glow */}
                {active && (
                  <div style={{
                    position: 'absolute',
                    left: '-10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    animation: 'pulseGlow 3s ease-in-out infinite',
                  }} />
                )}

                {/* Icon container */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: collapsed ? '36px' : '28px',
                  height: collapsed ? '36px' : '28px',
                  borderRadius: collapsed ? '10px' : '8px',
                  background: active
                    ? 'rgba(16,185,129,0.12)'
                    : collapsed && isHovered
                      ? 'rgba(255,255,255,0.05)'
                      : 'transparent',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}>
                  <Icon
                    size={collapsed ? 18 : 16}
                    color={active ? '#34d399' : isHovered ? '#a1a1aa' : '#52525b'}
                    style={{ transition: 'color 0.25s ease' }}
                  />
                </div>

                {/* Label */}
                {!collapsed && (
                  <span style={{
                    whiteSpace: 'nowrap',
                    animation: 'slideLabel 0.25s ease-out',
                    flex: 1,
                  }}>
                    {label}
                  </span>
                )}

                {/* Active dot */}
                {!collapsed && active && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#34d399',
                    boxShadow: '0 0 8px rgba(52,211,153,0.5)',
                    animation: 'dotPulse 2s ease-in-out infinite',
                    flexShrink: 0,
                  }} />
                )}

                {/* Collapsed tooltip */}
                {collapsed && isHovered && (
                  <div style={{
                    position: 'absolute',
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginLeft: '12px',
                    padding: '6px 12px',
                    background: '#18181b',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#d4d4d8',
                    whiteSpace: 'nowrap',
                    zIndex: 50,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    animation: 'slideLabel 0.15s ease-out',
                    pointerEvents: 'none',
                  }}>
                    {label}
                    {/* Arrow */}
                    <div style={{
                      position: 'absolute',
                      left: '-4px',
                      top: '50%',
                      transform: 'translateY(-50%) rotate(45deg)',
                      width: '8px',
                      height: '8px',
                      background: '#18181b',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRight: 'none',
                      borderTop: 'none',
                    }} />
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          flexShrink: 0,
        }}>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: collapsed ? '14px 0' : '14px 24px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: hovered === 'logout'
                ? 'rgba(239,68,68,0.06)'
                : 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              color: hovered === 'logout' ? '#f87171' : '#3f3f46',
              fontSize: '13px',
              fontWeight: 500,
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease',
              fontFamily: 'inherit',
              position: 'relative',
              overflow: 'hidden',
              opacity: loggingOut ? 0.5 : 1,
            }}
          >
            {/* Hover glow */}
            {hovered === 'logout' && (
              <div style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }} />
            )}

            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: collapsed ? '36px' : '28px',
              height: collapsed ? '36px' : '28px',
              borderRadius: collapsed ? '10px' : '8px',
              background: hovered === 'logout' ? 'rgba(239,68,68,0.08)' : 'transparent',
              transition: 'all 0.25s ease',
              flexShrink: 0,
            }}>
              {loggingOut ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(239,68,68,0.3)',
                  borderTopColor: '#f87171',
                  borderRadius: '50%',
                  animation: 'spinSlow 0.8s linear infinite',
                }} />
              ) : (
                <LogOut
                  size={collapsed ? 18 : 16}
                  style={{
                    transition: 'all 0.25s ease',
                    transform: hovered === 'logout' ? 'translateX(-1px)' : 'translateX(0)',
                  }}
                />
              )}
            </div>

            {!collapsed && (
              <span style={{
                animation: 'slideLabel 0.25s ease-out',
                whiteSpace: 'nowrap',
              }}>
                {loggingOut ? 'Signing out...' : 'Sign Out'}
              </span>
            )}

            {/* Collapsed tooltip */}
            {collapsed && hovered === 'logout' && (
              <div style={{
                position: 'absolute',
                left: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                marginLeft: '12px',
                padding: '6px 12px',
                background: '#18181b',
                border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#f87171',
                whiteSpace: 'nowrap',
                zIndex: 50,
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                animation: 'slideLabel 0.15s ease-out',
                pointerEvents: 'none',
              }}>
                Sign Out
                <div style={{
                  position: 'absolute',
                  left: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(45deg)',
                  width: '8px',
                  height: '8px',
                  background: '#18181b',
                  border: '1px solid rgba(239,68,68,0.15)',
                  borderRight: 'none',
                  borderTop: 'none',
                }} />
              </div>
            )}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            onMouseEnter={() => setHovered('collapse')}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '48px',
              background: hovered === 'collapse'
                ? 'rgba(255,255,255,0.03)'
                : 'transparent',
              border: 'none',
              color: hovered === 'collapse' ? '#a1a1aa' : '#27272a',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              fontFamily: 'inherit',
              letterSpacing: '0.02em',
            }}
          >
            {collapsed ? (
              <ChevronRight
                size={16}
                style={{
                  transition: 'transform 0.25s ease',
                  transform: hovered === 'collapse' ? 'translateX(2px)' : 'translateX(0)',
                }}
              />
            ) : (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                animation: 'slideLabel 0.25s ease-out',
              }}>
                <ChevronLeft
                  size={16}
                  style={{
                    transition: 'transform 0.25s ease',
                    transform: hovered === 'collapse' ? 'translateX(-2px)' : 'translateX(0)',
                  }}
                />
                Collapse
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}