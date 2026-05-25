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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/artist/dashboard' },
  { icon: PlusCircle, label: 'Raise Funds', href: '/artist/raise-funds' },
  { icon: Music, label: 'My Songs', href: '/artist/my-songs' },
  { icon: Users, label: 'Find Khapeetar', href: '/artist/find-khapeetar' },
  { icon: Briefcase, label: 'Work & Deals', href: '/artist/deals' },
  { icon: Wallet, label: 'Wallet', href: '/artist/wallet' },
  { icon: Settings, label: 'Settings', href: '/artist/settings' },
]

interface Props {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export default function ArtistSidebar({
  collapsed,
  setCollapsed,
}: Props) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'h-screen border-r border-white/10 bg-[#0a0a0a] flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div
        className={cn(
          'flex items-center h-16 px-4 border-b border-white/10',
          collapsed ? 'justify-center' : 'gap-2'
        )}
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Music size={14} className="text-white" />
        </div>

        {!collapsed && (
          <span className="font-semibold text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            FannyBags
          </span>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/5">
          <p className="text-xs text-zinc-600 uppercase tracking-widest">
            Artist Portal
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
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                active
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon size={17} />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 border-t border-white/10 text-zinc-500 hover:text-white flex items-center justify-center"
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

      <button
        onClick={() => signOut({ callbackUrl: '/artist/login' })}
        className="h-12 border-t border-white/10 text-zinc-500 hover:text-red-400 flex items-center justify-center gap-2 text-xs"
      >
        <LogOut size={14} />
        {!collapsed && 'Logout'}
      </button>
    </aside>
  )
}