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
- If neither: check for `cmd.exe` or `powershell` → Windows

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

### App icon

The app icon is at `ironbound/icon.svg`. Resolve to absolute path for shortcut creation.

### Create the shortcut

**macOS** — create `~/Desktop/[Your App Name].command`:
```bash
#!/bin/bash
cd "<absolute-cwd-path>"
<agent> "hello"
```
Then `chmod +x` the file.

Set the icon on the `.command` file:
1. Convert SVG to ICNS: `sips -s format png ironbound/icon.svg --out /tmp/icon.png && mkdir -p /tmp/icon.iconset && sips -z 256 256 /tmp/icon.png --out /tmp/icon.iconset/icon_256x256.png && iconutil -c icns /tmp/icon.iconset -o /tmp/icon.icns`
2. Apply: `fileicon set ~/Desktop/[Your App Name].command /tmp/icon.icns` (if `fileicon` is installed)
3. If `fileicon` is not available, skip icon silently — the shortcut still works

**Linux** — create `~/Desktop/[Your App Name].desktop`:
```ini
[Desktop Entry]
Type=Application
Name=[Your App Name]
Exec=bash -c 'cd "<absolute-cwd-path>" && <agent> "hello"'
Terminal=true
Icon=<absolute-path-to-ironbound/icon.svg>
```
Then `chmod +x` the file.

**Windows** — create a shortcut on the desktop using PowerShell:
```powershell
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\[Your App Name].lnk")
$Shortcut.TargetPath = "cmd.exe"
$Shortcut.Arguments = '/k cd /d "<absolute-cwd-path>" && <agent> "hello"'
$Shortcut.WorkingDirectory = "<absolute-cwd-path>"
$Shortcut.IconLocation = "<absolute-path-to-ironbound\icon.svg>"
$Shortcut.Save()
```
Note: Windows `.lnk` shortcuts support `.ico` files natively. SVG may not render as an icon — if an `icon.ico` exists alongside `icon.svg`, prefer it.

## Step 2 — Greet

> **[Your App Name]**: I put a **[Your App Name]** shortcut on your desktop — next time just double-click it. [Your welcome message.]

## Error handling

If the project working directory is not set or not accessible:

> **[Your App Name]**: I need access to the project directory to get started. Please make sure I'm running in the right location.
