import { useEffect, useRef, useState, type FormEvent } from 'react'
import ChatWindow from './components/ChatWindow.tsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createEliza, type Eliza } from './eliza/eliza.ts'

export type ChatMessage = { id: number; from: 'eliza' | 'user'; text: string; typewriter: boolean }
type Session = { eliza: Eliza; messages: ChatMessage[] }

let nextId = 0
const msg = (from: ChatMessage['from'], text: string, typewriter = false): ChatMessage => ({
  id: nextId++,
  from,
  text,
  typewriter,
})
const thinkDelay = () => 600 + Math.random() * 600

function freshSession(): Session {
  const eliza = createEliza()
  return { eliza, messages: [msg('eliza', eliza.initial(), true)] }
}

export default function App() {
  const [session, setSession] = useState(freshSession)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [typing, setTyping] = useState(true)
  const [ended, setEnded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const busy = thinking || typing

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (!busy && !ended) inputRef.current?.focus()
  }, [busy, ended])

  function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy || ended) return
    setInput('')
    const reply = session.eliza.reply(text)
    const quit = session.eliza.isQuit()
    setSession((s) => ({ ...s, messages: [...s.messages, msg('user', text)] }))
    setThinking(true)
    timer.current = setTimeout(() => {
      setThinking(false)
      setTyping(true)
      setSession((s) => ({ ...s, messages: [...s.messages, msg('eliza', reply, true)] }))
      if (quit) setEnded(true)
    }, thinkDelay())
  }

  function restart() {
    clearTimeout(timer.current)
    setSession(freshSession())
    setThinking(false)
    setTyping(true)
    setEnded(false)
    setInput('')
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="border-b border-border px-4 py-4 text-center">
        <h1 className="text-2xl font-bold tracking-widest sm:text-3xl">ELIZA · 1966 · MIT</h1>
        <p className="mt-1 text-lg text-muted-foreground">The first chatbot. Tell it your problem.</p>
      </header>

      <ChatWindow messages={session.messages} thinking={thinking} onTyped={() => setTyping(false)} />

      <footer className="border-t border-border px-4 py-3">
        {ended && !typing ? (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={restart}
              autoFocus
              className="h-auto border-2 border-primary bg-transparent px-6 py-2 text-xl hover:bg-primary hover:text-primary-foreground"
            >
              Start again
            </Button>
          </div>
        ) : (
          <form onSubmit={send} className="mx-auto flex max-w-3xl items-center gap-2">
            <span className="text-amber select-none">&gt;</span>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={ended}
              readOnly={busy}
              maxLength={300}
              autoComplete="off"
              autoCapitalize="sentences"
              aria-label="Type your message to ELIZA"
              placeholder={busy ? '' : 'Type here and press Enter'}
              className="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-2 text-xl text-amber caret-amber shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0 md:text-xl"
            />
            <Button
              type="submit"
              variant="outline"
              disabled={busy || ended || !input.trim()}
              className="h-auto border-primary bg-transparent px-4 py-2 text-base hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
            >
              Send
            </Button>
          </form>
        )}
      </footer>
    </div>
  )
}
