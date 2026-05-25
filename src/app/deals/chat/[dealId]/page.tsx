'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, Send } from 'lucide-react'

export default function DealChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()

  const dealId = params.dealId as string

  const [chat, setChat] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const fetchChat = () => {
    fetch(`/api/chat/${dealId}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setChat(j.data)
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/')
      return
    }

    fetchChat()

    const interval = setInterval(fetchChat, 3000)

    return () => clearInterval(interval)
  }, [session, status])

  const sendMessage = async () => {
    if (!message.trim()) return

    await fetch(`/api/chat/${dealId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
      }),
    })

    setMessage('')
    fetchChat()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-semibold">Deal Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {chat?.messages?.map((msg: any) => {
          const mine = msg.sender.id === session?.user?.id

          return (
            <div
              key={msg.id}
              className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md rounded-2xl px-4 py-3 ${
                  mine
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-zinc-200'
                }`}
              >
                <p className="text-xs opacity-70 mb-1">
                  {msg.sender.name || msg.sender.role}
                </p>

                <p>{msg.content}</p>

                <p className="text-[10px] opacity-50 mt-2">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-white/10 p-4 flex gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
        />

        <button
          onClick={sendMessage}
          className="px-5 rounded-xl bg-purple-500 flex items-center justify-center"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}