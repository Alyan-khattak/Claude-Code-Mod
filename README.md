# Leitstand

*German for control room.*

A Claude Code mod that puts a small control room above your prompt: background agents and shells with a live scanner and elapsed time, what finished, what failed, how much disk is left, and when your context is getting full.

```
✳ running    Caltrack Build 32         ·······░░▒▓▓▓·      0:24
✳ running    Review Tier-Badge         ▒▓▓▓··········      0:23
✓ done       Session-Scan              ▓▓▓▓▓▓▓▓▓▓▓▓▓▓      0:06
! needs you  Preview deploy            ▓▒░···········    failed
             disk · 74 GB free         ▓▓▓▓▓▓▓▓▓▓▓▒··      84 %
✳ 2 running  ·  ✓ 1 done  ·  ! 1 needs you     /stand
```

## Install

```sh
claude plugin marketplace add dominikmartn/leitstand
claude plugin install leitstand@leitstand
```

Start a new session. Needs Claude Code with mods (TypeScript plugin hooks); tested with Claude Code 2.1.288 on macOS.

## Two themes

**loud** (default): the list stays up while anything runs. Finished and failed jobs stay as rows until your next prompt, and the footer counts all of it.

**quiet**: only what is running, as one line with thin bars. Finished work disappears, because you read about it in the chat anyway. The disk shows up only when it runs low.

```sh
export LEITSTAND_THEME=quiet
```

`/stand` toggles the list in both themes. Folding it counts as "seen": the disk warning goes quiet until it gets worse, and ended jobs leave.

## What it watches

- **Background work**: every `Agent` call and every `Bash` call with `run_in_background`, until its task notification arrives.
- **Disk**: free space on this machine, measured every 5 minutes and shared between sessions. It warns at 35 GB free and turns red at 20 GB.
- **Context**: tokens used of the session's window. From 250k on, a `compact` row sits above the prompt.
- **Blocked tools**: when one of your hooks blocks a tool call, the hook's name and its reason stay visible until your next prompt.
- **Done sound**: after work that took more than a minute and once nothing runs any more, macOS plays its Glass sound. Elsewhere it stays silent.

## Settings

| Variable | Default | |
| --- | --- | --- |
| `LEITSTAND_THEME` | `loud` | `loud` or `quiet` |
| `LEITSTAND_DISK_HOST` | unset | an ssh host to measure instead of this machine, e.g. a build server |
| `LEITSTAND_SOUND` | on | `off` mutes the done sound |

The disk host is passed to `ssh -o BatchMode=yes`, so it needs key-based login. Only plain host names are accepted; anything else shows `invalid disk host` instead of quietly measuring the local disk. When a measurement fails, the last value stays with `stale` beside it.

## Develop

```sh
CLAUDE_CODE_PLUGIN_DIRS=$PWD claude
claude plugin test .
```

The editor types live in `.claude-plugin/types/`. Claude Code's plugin tooling generates them; they are not committed.

Made by [@dominikmartn](https://x.com/dominikmartn)
