import { useEffect, useRef, useState, type FormEvent } from 'react'
import ChatWindow from './components/ChatWindow.tsx'
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
      <header className="border-b border-term-dim/40 px-4 py-4 text-center">
        <h1 className="text-2xl font-bold tracking-widest sm:text-3xl">ELIZA · 1966 · MIT</h1>
        <p className="mt-1 text-lg text-term-dim">The first chatbot. Tell it your problem.</p>
      </header>

      <ChatWindow messages={session.messages} thinking={thinking} onTyped={() => setTyping(false)} />

      <footer className="border-t border-term-dim/40 px-4 py-3">
        {ended && !typing ? (
          <div className="flex justify-center">
            <button
              onClick={restart}
              autoFocus
              className="rounded border-2 border-term px-6 py-2 text-xl hover:bg-term hover:text-screen focus:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              Start again
            </button>
          </div>
        ) : (
          <form onSubmit={send} className="mx-auto flex max-w-3xl items-center gap-2">
            <span className="text-amber select-none">&gt;</span>
            <input
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
              className="min-w-0 flex-1 bg-transparent py-2 text-xl text-amber caret-amber placeholder:text-term-dim/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || ended || !input.trim()}
              className="rounded border border-term px-4 py-2 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        )}
      </footer>
    </div>
  )
}
