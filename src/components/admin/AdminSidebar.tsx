'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Music,
  Users,
  Heart,
  Briefcase,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/admin/dashboard' },
  { icon: Music,           label: 'All Songs',    href: '/admin/songs' },
  { icon: Users,           label: 'Artists',       href: '/admin/artists' },
  { icon: Heart,           label: 'Fans',          href: '/admin/fans' },
  { icon: Briefcase,       label: 'Khapeetars',    href: '/admin/khapeetars' },
  { icon: TrendingUp,      label: 'Investments',   href: '/admin/investments' },
  { icon: Shield,          label: 'Deals',         href: '/admin/deals' },
]

interface Props {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export default function AdminSidebar({ collapsed, setCollapsed }: Props) {
  const pathname = usePathname()
  const [hovered, setHovered] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    await signOut({ callbackUrl: '/' })
  }

  return (
    <>
      <style jsx global>{`
        @keyframes admSidebarFadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes admLogoFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(2deg); }
        }
        @keyframes admPulseGlow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @keyframes admSlideLabel {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes admDotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes admSpinLogout {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .admin-sidebar-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .admin-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .admin-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 999px;
        }
        .admin-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>

      <aside style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: collapsed ? '68px' : '256px',
        background: '#08080c',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        flexShrink: 0,
        zIndex: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        animation: 'admSidebarFadeIn 0.35s ease-out',
      }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: collapsed ? '-20px' : '18px',
          width: '140px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          transition: 'left 0.3s ease',
        }} />

        {/* Logo */}
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
            transform: collapsed ? 'translate(-50%,-50%)' : 'translateY(-50%)',
            width: '42px',
            height: '42px',
            background: 'radial-gradient(circle, rgba(239,68,68,0.16) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(10px)',
            pointerEvents: 'none',
            transition: 'left 0.3s ease',
          }} />

          <div
            onMouseEnter={() => setHovered('logo')}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'relative',
              width: '34px',
              height: '34px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(239,68,68,0.25)',
              transition: 'all 0.3s ease',
              transform: hovered === 'logo' ? 'scale(1.08)' : 'scale(1)',
              cursor: 'pointer',
              animation: 'admLogoFloat 4s ease-in-out infinite',
            }}
          >
            <Shield size={16} color="#fff" />
          </div>

          {!collapsed && (
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f87171, #fb923c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.01em',
              animation: 'admSlideLabel 0.25s ease-out',
              whiteSpace: 'nowrap',
            }}>
              Admin Control
            </span>
          )}
        </div>

        {/* Portal label */}
        {!collapsed && (
          <div style={{
            padding: '14px 20px 10px',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            flexShrink: 0,
            animation: 'admSlideLabel 0.25s ease-out',
          }}>
            <p style={{
              fontSize: '10px',
              color: '#27272a',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
              margin: 0,
            }}>
              FannyBags Admin
            </p>
          </div>
        )}

        {/* Nav */}
        <nav
          className="admin-sidebar-scroll"
          style={{
            flex: 1,
            padding: collapsed ? '12px 8px' : '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            overflowY: 'auto',
            overflowX: 'hidden',
            transition: 'padding 0.3s ease',
          }}
        >
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
                  color: active ? '#f87171' : isHovered ? '#d4d4d8' : '#52525b',
                  background: active
                    ? 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.06))'
                    : isHovered
                      ? 'rgba(255,255,255,0.03)'
                      : 'transparent',
                  border: active
                    ? '1px solid rgba(239,68,68,0.16)'
                    : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  overflow: 'hidden',
                  transform: isHovered && !active ? 'translateX(2px)' : 'translateX(0)',
                }}
              >
                {/* Active bar */}
                {active && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '3px',
                    borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg, #ef4444, #f97316)',
                    boxShadow: '0 0 8px rgba(239,68,68,0.4)',
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
                    background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    animation: 'admPulseGlow 3s ease-in-out infinite',
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
                    ? 'rgba(239,68,68,0.12)'
                    : collapsed && isHovered
                      ? 'rgba(255,255,255,0.05)'
                      : 'transparent',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}>
                  <Icon
                    size={collapsed ? 18 : 16}
                    color={active ? '#f87171' : isHovered ? '#a1a1aa' : '#52525b'}
                    style={{ transition: 'color 0.25s ease' }}
                  />
                </div>

                {/* Label */}
                {!collapsed && (
                  <span style={{
                    whiteSpace: 'nowrap',
                    animation: 'admSlideLabel 0.25s ease-out',
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
                    background: '#f87171',
                    boxShadow: '0 0 8px rgba(248,113,113,0.5)',
                    animation: 'admDotPulse 2s ease-in-out infinite',
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
                    animation: 'admSlideLabel 0.15s ease-out',
                    pointerEvents: 'none',
                  }}>
                    {label}
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

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          flexShrink: 0,
        }}>
          {/* Collapse */}
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
              background: hovered === 'collapse' ? 'rgba(255,255,255,0.03)' : 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
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
                animation: 'admSlideLabel 0.25s ease-out',
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

          {/* Logout */}
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            disabled={loggingOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: collapsed ? '14px 0' : '14px 22px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: hovered === 'logout' ? 'rgba(239,68,68,0.06)' : 'transparent',
              border: 'none',
              color: hovered === 'logout' ? '#f87171' : '#52525b',
              fontSize: '13px',
              fontWeight: 500,
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease',
              fontFamily: 'inherit',
              position: 'relative',
              overflow: 'hidden',
              opacity: loggingOut ? 0.6 : 1,
            }}
          >
            {/* Hover glow */}
            {hovered === 'logout' && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
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
                  border: '2px solid rgba(239,68,68,0.25)',
                  borderTopColor: '#f87171',
                  borderRadius: '50%',
                  animation: 'admSpinLogout 0.8s linear infinite',
                }} />
              ) : (
                <LogOut
                  size={collapsed ? 18 : 15}
                  style={{
                    transition: 'all 0.25s ease',
                    transform: hovered === 'logout' ? 'translateX(-1px)' : 'translateX(0)',
                  }}
                />
              )}
            </div>

            {!collapsed && (
              <span style={{
                animation: 'admSlideLabel 0.25s ease-out',
                whiteSpace: 'nowrap',
              }}>
                {loggingOut ? 'Signing out...' : 'Logout'}
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
                animation: 'admSlideLabel 0.15s ease-out',
                pointerEvents: 'none',
              }}>
                Logout
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
        </div>
      </aside>
    </>
  )
}