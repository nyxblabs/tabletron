import stringWidth from 'string-width'

export function getLongestLineWidth(text: string) {
   return Math.max(
      ...text.split('\n').map(stringWidth),
   )
}
