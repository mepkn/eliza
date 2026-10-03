import { useEffect, useRef } from 'react'
import Message from './Message.tsx'
import type { ChatMessage } from '../App.tsx'

type Props = { messages: ChatMessage[]; thinking: boolean; onTyped: () => void }

export default function ChatWindow({ messages, thinking, onTyped }: Props) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  })

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6" aria-live="polite">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {messages.map((m) => (
          <Message key={m.id} {...m} onTyped={onTyped} />
        ))}
        {thinking && (
          <div className="text-term-dim">
            ELIZA: <span className="cursor">█</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}
