import type { Job } from '../types'

// Background start: Agent reports "agentId: x", Bash "with ID: x"
export function backgroundId(text: string): string | null {
  const m = text.match(/agentId:\s*([A-Za-z0-9_-]+)/) ?? text.match(/running in background with ID:\s*([A-Za-z0-9_-]+)/)
  return m ? m[1] : null
}

// Endings arrive as <task-notification> with task-id and status
export function notifications(raw: string): { id: string; status: Job['status'] }[] {
  const out: { id: string; status: Job['status'] }[] = []
  for (const block of raw.split('<task-notification>').slice(1)) {
    const id = block.match(/<task-id>([^<]+)<\/task-id>/)?.[1]
    const st = block.match(/<status>([^<]+)<\/status>/)?.[1]
    if (!id || !st) continue
    out.push({ id: id.trim(), status: st.trim() === 'completed' ? 'done' : 'failed' })
  }
  return out
}

export function elapsed(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  return s >= 3600 ? `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}h` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function summary(jobs: Job[], diskNeeds: boolean) {
  const count = (s: Job['status']) => jobs.filter(j => j.status === s).length
  const failed = count('failed')
  return { running: count('running'), done: count('done'), failed, needs: failed + (diskNeeds ? 1 : 0) }
}

// Ended jobs stay until seen: loud shows them, quiet hides them
export function applyNotifications(list: Job[], raw: string, at: number): Job[] {
  const ended = new Map(notifications(raw).map(d => [d.id, d.status]))
  if (!ended.size) return list
  return list.map(j => {
    const status = ended.get(j.id)
    return status && j.status === 'running' ? { ...j, status, endedAt: at } : j
  })
}

export const running = (list: Job[]) => list.filter(j => j.status === 'running')
