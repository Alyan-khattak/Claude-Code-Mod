// No dot frame: the dot belongs to the idle row, a running job must never look like it
export const SPIN = ['✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳']

// quiet: thin lines. Block glyphs fill the whole cell and merge across stacked rows.
const COMET = ['━', '━', '━', '━']

// Scanner for jobs without a percentage: [before, comet, after]
export function scanner(frame: number, width: number): [string, string, string] {
  return sweep(frame, width, COMET, '─')
}

export function meter(pct: number, width: number): [string, string] {
  const n = fill(pct, width)
  return ['━'.repeat(n), '─'.repeat(width - n)]
}

// loud: braille halftone. Its dots leave a gap at the cell edge, so stacked rows stay apart.
export const DOT = '·'
const FULL = '⣿'
// Sparse to dense, the comet's tail fades in behind a solid head
const RAMP = ['⠡', '⠫', '⡻', '⣻']
const HEAD = [...RAMP, FULL, FULL]

export function loudScanner(frame: number, width: number): [string, string, string] {
  return sweep(frame, width, HEAD, DOT)
}

// Solid body that dissolves at its edge, then dotted track
export function loudMeter(pct: number, width: number): [string, string] {
  const n = fill(pct, width)
  // A full bar is finished: no fading edge
  const fade = n === width ? [] : [...RAMP].reverse().slice(0, Math.min(2, n))
  return [FULL.repeat(n - fade.length) + fade.join(''), DOT.repeat(width - n)]
}

// A failed job keeps a short stub where it stopped
export function loudStub(width: number): [string, string] {
  const stub = [FULL, RAMP[2], RAMP[0]].slice(0, width).join('')
  return [stub, DOT.repeat(width - [...stub].length)]
}

const fill = (pct: number, width: number) => Math.max(0, Math.min(width, Math.round((pct / 100) * width)))

function sweep(frame: number, width: number, comet: string[], track: string): [string, string, string] {
  const head = (frame % (width + comet.length)) - comet.length + 1
  let pre = '', mid = '', post = ''
  for (let i = 0; i < width; i++) {
    const k = i - head
    if (k >= 0 && k < comet.length) mid += comet[k]
    else if (mid) post += track
    else pre += track
  }
  return [pre, mid, post]
}
