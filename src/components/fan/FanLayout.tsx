'use client'

import { useState } from 'react'
import FanSidebar from './FanSidebar'

export default function FanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className={collapsed ? 'w-16 flex-shrink-0' : 'w-60 flex-shrink-0'}>
        <FanSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}