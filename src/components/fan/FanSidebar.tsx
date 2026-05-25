'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Compass,
  LayoutDashboard,
  PieChart,
  Wallet,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Compass, label: 'Discover', href: '/fan/discover' },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/fan/dashboard' },
  { icon: PieChart, label: 'My Investments', href: '/fan/investments' },
  { icon: Wallet, label: 'Wallet', href: '/fan/wallet' },
  { icon: User, label: 'Profile', href: '/fan/profile' },
]

interface Props {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export default function FanSidebar({ collapsed, setCollapsed }: Props) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen border-r border-white/8 bg-black flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div
        className={cn(
          'flex items-center h-16 px-4 border-b border-white/8',
          collapsed ? 'justify-center' : 'gap-2'
        )}
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
          <Compass size={14} className="text-white" />
        </div>

        {!collapsed && (
          <span className="font-semibold text-sm bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            FannyBags
          </span>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/5">
          <p className="text-xs text-zinc-600 uppercase tracking-widest">
            Fan Portal
          </p>
        </div>
      )}

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                active
                  ? 'bg-pink-500/15 text-pink-300 border border-pink-500/20'
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
        className="h-12 border-t border-white/8 flex items-center justify-center text-zinc-500"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <button
        onClick={() => signOut({ callbackUrl: '/fan/login' })}
        className="h-12 border-t border-white/8 flex items-center justify-center gap-2 text-zinc-500 hover:text-red-400"
      >
        <LogOut size={14} />
        {!collapsed && 'Logout'}
      </button>
    </aside>
  )
}