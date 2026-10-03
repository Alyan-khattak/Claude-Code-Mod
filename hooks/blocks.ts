export type Block = { hook: string; reason: string }

const firstLine = (t: string) => t.trim().split('\n')[0].trim()

// A command hook that exits 2 comes back as "PreToolUse:Bash hook error: [<command>]: <stderr>"
export function hookBlock(text: string, denied: boolean): Block | null {
  const m = text.match(/hook error: \[([^\]]*)\]:\s*([\s\S]*)/)
  if (m) {
    const script = m[1].trim().split(/\s+/).pop() ?? ''
    const name = script.split('/').pop()?.replace(/\.[a-z]+$/i, '') || 'hook'
    return { hook: name, reason: firstLine(m[2]) }
  }
  return denied && text.trim() ? { hook: 'hook', reason: firstLine(text) } : null
}
