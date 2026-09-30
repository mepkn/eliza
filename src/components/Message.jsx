import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CHAR_MS = 28

// One chat line. ELIZA's lines type out character by character.
export default function Message({ from, text, typewriter, onTyped }) {
  const isEliza = from === 'eliza'
  const [shown, setShown] = useState(typewriter ? 0 : text.length)

  useEffect(() => {
    if (!typewriter) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(i)
      if (i >= text.length) {
        clearInterval(id)
        onTyped?.()
      }
    }, CHAR_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, typewriter])

  const typing = shown < text.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isEliza ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded border px-4 py-2 ${
          isEliza
            ? 'border-term-dim/60 text-term'
            : 'border-amber/50 text-amber text-right'
        }`}
      >
        <span className="mr-2 opacity-60 select-none">{isEliza ? 'ELIZA:' : 'YOU:'}</span>
        <span aria-hidden={typing}>{text.slice(0, shown)}</span>
        {typing && <span className="cursor">█</span>}
        {typing && <span className="sr-only">{text}</span>}
      </div>
    </motion.div>
  )
}
