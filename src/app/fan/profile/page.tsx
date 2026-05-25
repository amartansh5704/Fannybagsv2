'use client'

import { useSession } from 'next-auth/react'
import FanLayout from '@/components/fan/FanLayout'

export default function FanProfilePage() {
  const { data: session } = useSession()

  return (
    <FanLayout>
      <div className="min-h-screen bg-black text-white px-8 py-8">
        <h1 className="text-2xl font-semibold mb-8">Profile</h1>

        <div className="bg-white/5 rounded-2xl p-8 max-w-xl">
          <div className="space-y-5">
            <div>
              <p className="text-zinc-500 text-sm">Name</p>
              <p className="text-lg">{session?.user?.name}</p>
            </div>

            <div>
              <p className="text-zinc-500 text-sm">Email</p>
              <p className="text-lg">{session?.user?.email}</p>
            </div>

            <div>
              <p className="text-zinc-500 text-sm">Role</p>
              <p className="text-lg capitalize">{session?.user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </FanLayout>
  )
}