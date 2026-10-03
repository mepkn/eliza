// elizabot ships without types; these cover the parts the wrapper uses.
declare module 'elizabot' {
  export default class ElizaBot {
    constructor(noRandom?: boolean)
    quit: boolean
    getInitial(): string
    getFinal(): string
    transform(text: string): string
  }
}

declare module 'elizabot/elizadata.js' {
  /** [decomposition pattern, reassembly replies] */
  export type Decomp = [pattern: string, replies: string[]]
  /** [keyword, rank, decompositions] */
  export type Keyword = [key: string, rank: number, decomps: Decomp[]]

  const data: {
    elizaSynons: Record<string, string[]>
    elizaKeywords: Keyword[]
  }
  export default data
}
