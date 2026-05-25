'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  Zap,
  Wallet,
  User,
  ChevronLeft,
  ChevronRight,
  Music,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen border-r border-white/8 bg-[#0a0a0a] flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div
        className={cn(
          'flex items-center h-16 px-4 border-b border-white/8 flex-shrink-0',
          collapsed ? 'justify-center' : 'gap-2'
        )}
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
          <Zap size={14} className="text-white" />
        </div>

        {!collapsed && (
          <span className="font-semibold text-sm bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            FannyBags
          </span>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/5 flex-shrink-0">
          <p className="text-xs text-zinc-600 uppercase tracking-widest">
            Khapeetar Portal
          </p>
        </div>
      )}

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                active
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon
                size={17}
                className={active ? 'text-emerald-400' : ''}
              />

              {!collapsed && <span>{label}</span>}

              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-white/8 text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0"
      >
        {collapsed ? (
          <ChevronRight size={16} />
        ) : (
          <span className="flex items-center gap-2 text-xs">
            <ChevronLeft size={16} />
            Collapse
          </span>
        )}
      </button>
    </aside>
  )
}