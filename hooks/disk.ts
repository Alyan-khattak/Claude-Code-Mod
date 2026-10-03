// Free space counts, not percent: 68 GB free at 85 % is no emergency
export const WARN_GB = 35
export const BAD_GB = 20

export type Level = 'ok' | 'warn' | 'bad'

// macOS keeps user data on its own volume; `/` there is the sealed system volume
export const DF = 'df -kP /System/Volumes/Data 2>/dev/null || df -kP /'

// LEITSTAND_DISK_HOST is handed to ssh as one argv entry; refuse anything that could read as an option
export function validHost(h: string | undefined): string | null {
  const t = h?.trim()
  return t && /^[A-Za-z0-9][A-Za-z0-9._@-]*$/.test(t) ? t : null
}

// `df -kP`: Filesystem 1024-blocks Used Available Capacity Mounted on (macOS without -P adds inode columns)
export function parseDf(out: string): { pct: number; freeGb: number } | null {
  const line = out.trim().split('\n').reverse().find(l => /\s\d+%\s/.test(l))
  if (!line) return null
  const cols = line.trim().split(/\s+/)
  const i = cols.findIndex(c => /^\d+%$/.test(c))
  if (i < 3) return null
  const avail = Number(cols[i - 1])
  const pct = Number(cols[i].slice(0, -1))
  if (!Number.isFinite(avail) || !Number.isFinite(pct)) return null
  return { pct, freeGb: Math.round(avail / 1024 / 1024) }
}

export function level(freeGb: number | null): Level {
  if (freeGb === null) return 'ok'
  return freeGb <= BAD_GB ? 'bad' : freeGb <= WARN_GB ? 'warn' : 'ok'
}

const RANK: Record<Level, number> = { ok: 0, warn: 1, bad: 2 }

// A warning you have seen stays quiet until it gets worse
export function needsYou(lv: Level, seen: Level): boolean {
  return RANK[lv] > RANK[seen]
}
