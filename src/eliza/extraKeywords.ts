// Extra keywords for Indian school life, written in the same data format as
// elizabot's elizadata.js:
//   ["<key>", <rank>, [ ["<decomp>", ["<reasmb>", ...]], ... ]]
// Decomposition: "*" matches anything; (n) in a reply inserts the n-th "*" match.
// "@family" expands to the family synonym group. Higher rank wins when a
// sentence contains several keywords ("my" is rank 2, so these use 3).
//
// Deliberately NO Hindi/Hinglish understanding and NO factual answers.

import type { Keyword } from 'elizabot/elizadata.js'

export const extraSynonyms: Record<string, string[]> = {
  family: ['mummy', 'papa', 'maa'],
}

export const extraKeywords: Keyword[] = [
  ['exam', 3, [
    ['*', [
      'Why do exams worry you ?',
      'How do you feel before an exam ?',
      'What would it mean to you if the exam went badly ?',
      'Do exams make you think of anything else ?',
    ]],
  ]],
  ['exams', 3, [
    ['*', ['goto exam']],
  ]],
  ['marks', 3, [
    ['* my marks *', [
      'Why are your marks so important to you ?',
      'Who cares most about your marks ?',
    ]],
    ['*', [
      'What do marks mean to you ?',
      'Do you feel your marks say something about you ?',
      'Who expects good marks from you ?',
    ]],
  ]],
  ['tuition', 3, [
    ['*', [
      'Tell me more about your tuition.',
      'How do you feel when you go to tuition ?',
      'Why do you mention tuition ?',
    ]],
  ]],
  ['teacher', 3, [
    ['*', [
      'Tell me more about your teacher.',
      'How does your teacher make you feel ?',
      'Does your teacher remind you of anyone else ?',
    ]],
  ]],
  ['school', 3, [
    ['*', [
      'How do you feel about school ?',
      'What happens at school that troubles you ?',
      'Tell me more about school.',
    ]],
  ]],
  ['friend', 3, [
    ['* my friend *', [
      'Tell me more about your friend.',
      'Why do you mention your friend just now ?',
    ]],
    ['*', [
      'Do friends worry you ?',
      'How do your friends make you feel ?',
      'Are your friends important to you ?',
    ]],
  ]],
  ['friends', 3, [
    ['*', ['goto friend']],
  ]],
]
