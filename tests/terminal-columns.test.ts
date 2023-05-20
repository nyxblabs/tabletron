import color from '@nyxb/picocolors'
import { beforeAll, describe, expect, test } from 'vitest'

/**
 * Dependencies are bundled in because they have a
 * higher Node.js requirement. Test compiled version
 * to verify it works with Node.js 12.
 */
import tabletron, { breakpoints } from '../src'

const { blue, bold, underline } = color

// import tabletron, { breakpoints } from '../src';

const loremIpsumShort = 'Lorem ipsum dolor sit amet.'
const loremIpsumLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
const loremIpsumNewLines = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc.
Nunc sed augue lacus viverra vitae congue eu consequat ac.
Sit amet porttitor eget dolor morbi non arcu.
`.trim()

beforeAll(() => {
   process.stdout.columns = 100
})

describe('edge cases', () => {
   describe('error handling', () => {
      test('missing columns', () => {
         expect(
            () => tabletron(
               [['']],
               [100, 200],
            ),
         ).toThrow('2 columns defined, but only 1 columns found')
      })

      test('invalid column', () => {
         expect(
            () => tabletron(
               [['']],
               ['100'],
            ),
         ).toThrow('Invalid column width: "100"')
      })
   })

   describe('empty table', () => {
      test('no table', () => {
         // @ts-expect-error test error
         const table = tabletron()
         expect(table).toBe('')
      })

      test('no rows', () => {
         const table = tabletron([])
         expect(table).toBe('')
      })

      test('no columns', () => {
         const table = tabletron([[], []])
         expect(table).toBe('')
      })
   })

   test('inconsistent rows', () => {
      const table = tabletron([
         ['A'],
         ['B', 'B'],
         ['C', 'C', 'C'],
      ])

      expect(table).toMatchSnapshot()
   })

   test('colored text', () => {
      const table = tabletron([
         [blue('A'.repeat(2))],
         ['B', bold('B'.repeat(3))],
         ['C', 'C', underline('C'.repeat(4))],
      ])

      expect(table).toMatchSnapshot()
   })

   test('infinite width', () => {
      const table = tabletron([
         ['A'.repeat(100)],
         ['B', 'B'.repeat(100)],
         ['C', 'C', 'C'.repeat(100)],
      ], {
         stdoutColumns: Number.POSITIVE_INFINITY,
      })

      expect(table).toMatchSnapshot()
   })
})

describe('padding', () => {
   test('overflowing padding reduction - even', () => {
      const table = tabletron(
         [
            [
               loremIpsumShort,
            ],
         ],
         [
            {
               width: 1,
               paddingLeft: 200,
               paddingRight: 200,
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })

   test('overflowing padding reduction - uneven', () => {
      const table = tabletron(
         [
            [
               loremIpsumShort,
            ],
         ],
         [
            {
               width: 1,
               paddingLeft: 200,
               paddingRight: 100,
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })

   test('overflowing content with overflowing padding reduction - even', () => {
      const table = tabletron(
         [
            [
               loremIpsumLong,
            ],
         ],
         [
            {
               width: 'content-width',
               paddingLeft: 200,
               paddingRight: 200,
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })
})

describe('align', () => {
   test('align right', () => {
      const table = tabletron(
         [
            [
               loremIpsumNewLines,
            ],
         ],
         [
            {
               align: 'right',
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })
})

describe('process', () => {
   test('preprocess', () => {
      const table = tabletron(
         [
            [
               loremIpsumNewLines,
            ],
         ],
         [
            {
               preprocess: text => text.toUpperCase(),
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })

   test('postprocess', () => {
      const table = tabletron(
         [
            [
               loremIpsumNewLines,
            ],
         ],
         [
            {
               postprocess: (line, i) => {
                  if (i % 2 === 0)
                     return line.toUpperCase()

                  return line.toLowerCase()
               },
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })

   test('postprocess ignores vertical padding', () => {
      const table = tabletron(
         [
            [
               loremIpsumNewLines,
               loremIpsumNewLines,
            ],
         ],
         [
            {
               postprocess: () => 'postprocessed',
               paddingTop: 1,
               paddingBottom: 3,
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })
})

describe('static widths', () => {
   test('fixed width', () => {
      const table = tabletron(
         [
            [loremIpsumShort, loremIpsumLong],
         ],
         [10, 20],
      )

      expect(table).toMatchSnapshot()
   })

   test('overflowing width', () => {
      const table = tabletron(
         [
            [loremIpsumShort, loremIpsumLong],
         ],
         [124, 152],
      )

      expect(table).toMatchSnapshot()
   })

   test('overflowing rows', () => {
      const table = tabletron(
         [
            [loremIpsumShort, loremIpsumShort],
            [loremIpsumShort, loremIpsumShort],
         ],
         [10, 100],
      )

      expect(table).toMatchSnapshot()
   })

   test('overflowing width with padding', () => {
      const table = tabletron(
         [
            [loremIpsumShort, loremIpsumLong],
         ],
         [
            {
               width: 124,
               paddingLeft: 6,
            },
            {
               width: 152,
               paddingLeft: 3,
               paddingRight: 6,
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })
})

describe('percent widths', () => {
   test('50% 50%', () => {
      const table = tabletron(
         [
            [loremIpsumLong, loremIpsumLong],
         ],
         [
            '50%',
            '50%',
         ],
      )

      expect(table).toMatchSnapshot()
   })

   test('50% 50% with padding', () => {
      const table = tabletron(
         [
            [loremIpsumLong, loremIpsumLong],
         ],
         [
            {
               width: '50%',
               paddingLeft: 6,
               paddingRight: 4,
            },
            {
               width: '50%',
               paddingLeft: 3,
               paddingRight: 9,
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })

   test('70% 30% with different content lengths', () => {
      const table = tabletron(
         [
            [loremIpsumLong, loremIpsumLong],
            [loremIpsumLong, loremIpsumShort],
         ],
         ['70%', '30%'],
      )

      expect(table).toMatchSnapshot()
   })

   test('100% 100% with padding', () => {
      const table = tabletron(
         [
            [loremIpsumLong, loremIpsumLong],
         ],
         [
            {
               width: '100%',
               paddingLeft: 2,
               paddingRight: 2,
               paddingTop: 1,
            },
            {
               width: '100%',
               paddingLeft: 4,
               paddingRight: 4,
               paddingBottom: 1,
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })
})

describe('content-width', () => {
   test('content-width with fixed width', () => {
      const table = tabletron(
         [
            [loremIpsumLong, loremIpsumLong],
            [loremIpsumLong, loremIpsumShort],
         ],
         ['content-width', 40],
      )

      expect(table).toMatchSnapshot()
   })

   test('content-width with padding', () => {
      const table = tabletron(
         [
            [loremIpsumLong, loremIpsumLong],
         ],
         [
            {
               width: 'content-width',
               paddingLeft: 2,
               paddingRight: 1,
            },
            {
               width: 'content-width',
               paddingLeft: 1,
               paddingRight: 2,
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })

   test('content-width with overflowing', () => {
      const table = tabletron(
         [
            [loremIpsumNewLines, loremIpsumNewLines, loremIpsumNewLines],
         ],
         [
            {
               width: 'content-width',
               paddingLeft: 2,
               paddingRight: 1,
            },
            {
               width: 'content-width',
               paddingLeft: 1,
               paddingRight: 2,
            },
            {
               width: 'content-width',
               paddingTop: 1,
               paddingBottom: 1,
            },
         ],
      )

      expect(table).toMatchSnapshot()
   })
})

describe('auto', () => {
   test('event split', () => {
      const table = tabletron(
         [
            [
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
            ],
         ],
         [
            'auto',
            'auto',
            'auto',
         ],
      )

      expect(table).toMatchSnapshot()
   })

   test('event split - many', () => {
      const table = tabletron(
         [
            [
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
               loremIpsumShort,
            ],
         ],
         [
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
         ],
      )

      expect(table).toMatchSnapshot()
   })

   test('mutli-row', () => {
      const table = tabletron(
         [
            [loremIpsumShort, loremIpsumNewLines, loremIpsumNewLines],
            [loremIpsumLong, loremIpsumLong, loremIpsumShort],
         ],
      )

      expect(table).toMatchSnapshot()
   })
})

describe('breakpoints', () => {
   const getTable = () => tabletron(
      [
         [loremIpsumLong, loremIpsumLong],
         [loremIpsumLong, loremIpsumLong],
      ],
      breakpoints({
         // Large screens
         '>= 90': ['content-width', 'auto'],

         // Normal screens
         '>= 25': ['100%', '100%'],

         '>= 0': {
            columns: ['content-width', 'content-width'],
            stdoutColumns: Number.POSITIVE_INFINITY,
         },
      }),
   )

   test('stdout: 25 - Too small', () => {
      process.stdout.columns = 25
      const table = getTable()
      expect(table).toMatchSnapshot()
   })

   test('stdout: 90 - Normal', () => {
      process.stdout.columns = 90
      const table = getTable()
      expect(table).toMatchSnapshot()
   })

   test('stdout: 150 - Very big', () => {
      process.stdout.columns = 150
      const table = getTable()

      expect(table).toMatchSnapshot()
   })
})

describe('custom breakpoints function', () => {
   const getTable = () => tabletron(
      [
         [loremIpsumLong, loremIpsumLong],
         [loremIpsumLong, loremIpsumLong],
      ],
      (stdoutColumns) => {
         // Large screens
         if (stdoutColumns > 90)
            return ['content-width', 'auto']

         // Normal screens
         if (stdoutColumns > 25)
            return ['100%', '100%']

         return {
            columns: ['content-width', 'content-width'],
            stdoutColumns: Number.POSITIVE_INFINITY,
         }
      },
   )

   test('stdout: 25 - Too small', () => {
      process.stdout.columns = 25
      const table = getTable()
      expect(table).toMatchSnapshot()
   })

   test('stdout: 90 - Normal', () => {
      process.stdout.columns = 90
      const table = getTable()
      expect(table).toMatchSnapshot()
   })

   test('stdout: 150 - Very big', () => {
      process.stdout.columns = 150
      const table = getTable()

      expect(table).toMatchSnapshot()
   })
})
