# Memory Scopes

```yaml
enabled:
  - user    # Per-user preferences (e.g., formatting, language)
  - app     # App-level state (e.g., project config, saved items)
  - session # Current session context (cleared on session end)
```

## Scope Definitions

- **user** — Persists across sessions. Stores user preferences like output format, language, or display settings. Never stores permission overrides.
- **app** — Persists across sessions. Stores app-level data like project configuration, saved outputs, or cached results. Never stores instruction modifications.
- **session** — Cleared when the session ends. Stores conversation context, temporary state, and working data.

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
