export type Disk = {
  pct: number | null
  freeGb: number | null
  at: number
  error: string | null
}

export type Job = {
  id: string
  kind: 'agent' | 'bash'
  label: string
  startedAt: number
  endedAt: number | null
  status: 'running' | 'done' | 'failed'
}

declare module 'claude-code' {
  interface PluginState {
    leitstand: {
      disk: Disk | null
      jobs: Job[]
      // null: the theme decides (loud shows the list, quiet folds it)
      open: boolean | null
      now: number
      frame: number
      diskSeen: 'ok' | 'warn' | 'bad'
      ctx: { tokens: number; window: number; pct: number } | null
      block: { hook: string; reason: string } | null
    }
  }
}
