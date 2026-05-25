'use client'

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className={collapsed ? 'w-16 flex-shrink-0' : 'w-64 flex-shrink-0'}>
        <AdminSidebar
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