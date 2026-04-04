# Session Mode

```yaml
mode: multi
cwd: fixed
```

## Mode Options

- `singleton` — One session at a time. The agent refuses to start if another session is detected. Use for system-level agents that manage global state.
- `multi` — Multiple concurrent sessions allowed. Each session has independent context. Use for most application agents.

## CWD Options

- `fixed` — The working directory is locked to the project root. The agent cannot `cd` elsewhere. Use for sandboxed app agents.
- `picker` — The agent prompts the user to select or confirm a working directory at session start. Use for code assistants that work across repos.
