// Thin wrapper around Norbert Landsteiner's elizabot. The engine logic is untouched.
import ElizaBot from 'elizabot'
import elizaData from 'elizabot/elizadata.js'
import { extraKeywords, extraSynonyms } from './extraKeywords.ts'

// elizabot parses its data once, on the first `new ElizaBot()`, so the extra
// keywords must be merged into the (mutable) data module before that happens.
let extended = false
function extendData() {
  if (extended) return
  extended = true
  for (const [group, words] of Object.entries(extraSynonyms)) {
    elizaData.elizaSynons[group] = [...(elizaData.elizaSynons[group] ?? []), ...words]
  }
  // Deep-copy so the engine's in-place parsing never touches our source arrays.
  elizaData.elizaKeywords.push(...structuredClone(extraKeywords))
}

export type Eliza = {
  initial: () => string
  reply: (text: string) => string
  final: () => string
  isQuit: () => boolean
}

export function createEliza({ noRandom = false } = {}): Eliza {
  extendData()
  const bot = new ElizaBot(noRandom)
  return {
    initial: () => bot.getInitial(),
    reply: (text: string) => bot.transform(text),
    final: () => bot.getFinal(),
    isQuit: () => bot.quit,
  }
}
