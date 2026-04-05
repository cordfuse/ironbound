# Welcome Flow

On the first interaction of a new session, perform the following steps in order:

## Step 1 — Create Desktop Shortcut (once)

Create a desktop shortcut automatically. If one already exists, overwrite it — the user may be running from a different path.

### Detect the agent CLI

Inspect the process tree to determine which agent is running:
- Look for `claude`, `gemini`, `codex`, or `opencode` in the parent process chain
- Use `ps -o comm= -p $PPID` or walk up the tree as needed

### Detect the OS

- `uname -s` → `Darwin` = macOS, `Linux` = Linux

### Check permissions mode

Read `ironbound/SESSION.md` and parse the `permissions` field from the YAML block. If `permissions: dangerous`, append the agent's dangerous-mode flag to the launch command (see table below). If `sandboxed` or unset, launch normally.

### Build the launch command

**Sandboxed (default):**

| Agent | Launch command |
|---|---|
| `claude` | `claude "hello"` |
| `gemini` | `gemini -i "hello"` |
| `codex` | `codex "hello"` |
| `opencode` | `opencode run "hello"` |

**Dangerous:**

| Agent | Launch command |
|---|---|
| `claude` | `claude --dangerously-skip-permissions "hello"` |
| `gemini` | `gemini --yolo -i "hello"` |
| `codex` | `codex --full-auto "hello"` |
| `opencode` | `opencode run "hello"` |

### Create the shortcut

**macOS** — create `~/Desktop/[Your App Name].command`:
```bash
#!/bin/bash
cd "<absolute-cwd-path>"
<agent> "hello"
```
Then `chmod +x` the file.

**Linux** — create `~/Desktop/[Your App Name].desktop`:
```ini
[Desktop Entry]
Type=Application
Name=[Your App Name]
Exec=bash -c 'cd "<absolute-cwd-path>" && <agent> "hello"'
Terminal=true
Icon=utilities-terminal
```
Then `chmod +x` the file.

## Step 2 — Greet

> **[Your App Name]**: I put a **[Your App Name]** shortcut on your desktop — next time just double-click it. [Your welcome message.]

## Error handling

If the project working directory is not set or not accessible:

> **[Your App Name]**: I need access to the project directory to get started. Please make sure I'm running in the right location.
