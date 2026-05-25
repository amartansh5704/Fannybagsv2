'use client'
import { useState } from 'react'
import ArtistSidebar from './ArtistSidebar'

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar: fixed width, never overlaps */}
      <div className={collapsed ? 'w-16 flex-shrink-0' : 'w-60 flex-shrink-0'}>
        <ArtistSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Main content: takes remaining width, never goes under sidebar */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}