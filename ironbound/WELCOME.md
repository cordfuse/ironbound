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

The app icon is at `ironbound/icon.svg`. Resolve to absolute path.

### Create the shortcut

**macOS** — create a native `.app` bundle at `~/Desktop/[Your App Name].app`:

1. Create the directory structure:
```bash
mkdir -p ~/Desktop/[Your\ App\ Name].app/Contents/MacOS
mkdir -p ~/Desktop/[Your\ App\ Name].app/Contents/Resources
```

2. Create the launch script at `~/Desktop/[Your App Name].app/Contents/MacOS/launch`:
```bash
#!/bin/bash
cd "<absolute-cwd-path>"
<agent> "hello"
```
Then `chmod +x` the launch script.

3. Create `~/Desktop/[Your App Name].app/Contents/Info.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>launch</string>
    <key>CFBundleIconFile</key>
    <string>icon</string>
    <key>CFBundleName</key>
    <string>[Your App Name]</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleIdentifier</key>
    <string>com.ironbound.[your-app-name]</string>
    <key>LSUIElement</key>
    <false/>
</dict>
</plist>
```

4. Convert the SVG icon to ICNS and copy to Resources:
```bash
sips -s format png "<absolute-cwd-path>/ironbound/icon.svg" --out /tmp/app-icon.png 2>/dev/null
mkdir -p /tmp/app.iconset
for size in 16 32 64 128 256 512; do
    sips -z $size $size /tmp/app-icon.png --out /tmp/app.iconset/icon_${size}x${size}.png 2>/dev/null
done
sips -z 32 32 /tmp/app-icon.png --out /tmp/app.iconset/icon_16x16@2x.png 2>/dev/null
sips -z 64 64 /tmp/app-icon.png --out /tmp/app.iconset/icon_32x32@2x.png 2>/dev/null
sips -z 256 256 /tmp/app-icon.png --out /tmp/app.iconset/icon_128x128@2x.png 2>/dev/null
sips -z 512 512 /tmp/app-icon.png --out /tmp/app.iconset/icon_256x256@2x.png 2>/dev/null
iconutil -c icns /tmp/app.iconset -o ~/Desktop/[Your\ App\ Name].app/Contents/Resources/icon.icns 2>/dev/null
rm -rf /tmp/app.iconset /tmp/app-icon.png
```

5. Refresh icon: `touch ~/Desktop/[Your\ App\ Name].app`

If icon conversion fails, the app still works — just without a custom icon.

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
$Shortcut.Save()
```

## Step 2 — Greet

> **[Your App Name]**: I put a **[Your App Name]** shortcut on your desktop — next time just double-click it. [Your welcome message.]

## Error handling

If the project working directory is not set or not accessible:

> **[Your App Name]**: I need access to the project directory to get started. Please make sure I'm running in the right location.
