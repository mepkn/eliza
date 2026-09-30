import { describe, expect, it } from 'vitest'
import { createEliza } from './eliza.js'

// Run each check several times: ELIZA picks replies at random.
const replies = (text, n = 10) =>
  Array.from({ length: n }, () => createEliza().reply(text))

describe('ELIZA wrapper', () => {
  it('has opening and closing lines', () => {
    const e = createEliza()
    expect(e.initial()).toBeTruthy()
    expect(e.final()).toMatch(/goodbye|session/i)
  })

  it('"I am sad" reflects "you are sad"', () => {
    const e = createEliza({ noRandom: true })
    expect(e.reply('I am sad')).toMatch(/you are sad/i)
  })

  it('"My mummy is angry" gets a family reply', () => {
    for (const r of replies('My mummy is angry')) {
      expect(r).toMatch(/family|mummy/i)
    }
  })

  it('"I have an exam tomorrow" gets an exam reply', () => {
    for (const r of replies('I have an exam tomorrow')) {
      expect(r).toMatch(/exam/i)
    }
  })

  it('"What is 2+2?" gets no real answer', () => {
    for (const r of replies('What is 2+2?')) {
      expect(r).not.toMatch(/\b4\b|four/i)
    }
  })

  it('quits on "bye"', () => {
    const e = createEliza()
    e.reply('bye')
    expect(e.isQuit()).toBe(true)
  })
})

describe('extra keywords', () => {
  it.each([
    ['My exams are next week', /exam/i],
    ['My friends ignore me', /friend/i],
    ['My teacher shouted', /teacher/i],
  ])('%s', (text, re) => {
    for (const r of replies(text)) expect(r).toMatch(re)
  })
})
