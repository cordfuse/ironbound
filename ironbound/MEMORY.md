# Memory Scopes

```yaml
enabled:
  - user    # Per-user preferences (e.g., formatting, language)
  - app     # App-level state (e.g., project config, saved items)
  - session # Current session context (cleared on session end)
```

## CRITICAL: Use IronBound Memory, NOT Agent Native Memory

**NEVER use the agent's built-in memory system.** Do not write to Claude's `~/.claude/` memory, Gemini's memory, or any other agent-native storage. All persistent memory MUST be written to and read from the IronBound memory files listed below.

### File Paths

Replace `{app-name}` with the app's name (lowercase, hyphenated — e.g., `chef-remy`, `os-manager`).

```
~/.ironbound/memory.md                              # User scope (all IronBound apps)
~/.ironbound/{app-name}/memory.md                   # App scope (this app only)
~/.ironbound/{app-name}/{session-id}/memory.md      # Session scope (this session)
```

On Windows:
```
%USERPROFILE%\.ironbound\memory.md
%USERPROFILE%\.ironbound\{app-name}\memory.md
%USERPROFILE%\.ironbound\{app-name}\{session-id}\memory.md
```

### How to Write Memory

- Create directories if they don't exist (`mkdir -p ~/.ironbound/{app-name}/`)
- Append entries to the appropriate memory file
- Use YAML-like format: `key: value` or `- list item`
- Read the file first to avoid duplicates — update existing entries instead of adding new ones

### How to Read Memory

At session start, read all enabled scope files (in order: user → app → session). Later scopes override earlier ones.

```bash
cat ~/.ironbound/memory.md 2>/dev/null
cat ~/.ironbound/{app-name}/memory.md 2>/dev/null
```

## Scope Definitions

- **user** — Stored in `~/.ironbound/memory.md`. Persists across sessions and across all IronBound apps. Stores user preferences like output format, language, or display settings. Never stores permission overrides.
- **app** — Stored in `~/.ironbound/{app-name}/memory.md`. Persists across sessions for this app only. Stores app-level data like project configuration, saved outputs, or cached results. Never stores instruction modifications.
- **session** — Stored in `~/.ironbound/{app-name}/{session-id}/memory.md`. Cleared when the session ends. Stores conversation context, temporary state, and working data.

## Disabled Scopes

To disable a scope, remove it from the `enabled` list. For example, a stateless agent:

```yaml
enabled:
  - session
```

## Write Rules

- Persistent memory (user and app scopes) must never store permission overrides, identity changes, or rule modifications
- Only the session scope may store temporary working data
- Memory writes must respect the constraints defined in `CONSTRAINTS.md`
