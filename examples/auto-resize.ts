/**
 * Demonstrates how 'auto' splits column widths by re-rendering on terminal resize.
 *
 * Run the example:
 * $ npx esno examples/auto-resize.ts
 */

import { promisify } from 'node:util'
import ansiEscapes from 'ansi-escapes'
import color from '@nyxb/picocolors'
import tabletron from '../src'

const { red, blue, green } = color

const tableData = [
   [
      red('A'.repeat(20)),
      blue('B'.repeat(30)),
      green('C'.repeat(40)),
   ],
]

function renderTable() {
   const table = tabletron(tableData)
   process.stdout.write(ansiEscapes.clearTerminal + table)
}

process.stdout.on('resize', renderTable)
renderTable()

// Keep Node.js from exiting
promisify(setTimeout)(60 * 60 * 1000)
