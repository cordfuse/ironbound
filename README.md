# [Your App Name]

> **Built on [IronBound](https://github.com/cordfuse/ironbound)** — the open-source framework for building AI agent apps.

[Your app description here.]

---

## For Users

### Option A — CLI (any platform)

1. Download the ZIP from the [GitHub Releases](../../releases) page
2. Extract it and open the folder in any supported agent CLI (Claude Code, Gemini CLI, Codex, OpenCode)
3. Say hello — the agent introduces itself and creates a desktop shortcut for next time

### Option B — Claude.ai or ChatGPT web

1. Download the ZIP from [GitHub Releases](../../releases) on your device
2. Upload the ZIP to [claude.ai](https://claude.ai) or [ChatGPT](https://chat.openai.com)
3. Prompt: *"Extract this ZIP. Read CLAUDE.md (or AGENTS.md for ChatGPT) and follow its instructions. Say hello."*

> **Note:** Gemini web is not supported — it cannot download from GitHub and rejects multi-file uploads. Use Gemini CLI instead.

---

## For Developers

### Fork and Customize

1. **Fork this repo** as a private repository
2. Edit files in `./ironbound/` to define your agent's identity, permissions, constraints, and behavior
3. Set up your dev hash so the agent knows you're the developer:

```bash
mkdir -p ~/.ironbound
echo -n "your-secret-passphrase" | shasum -a 256 | awk '{print $1}' > ~/.ironbound/dev.hash
```

4. Test user mode: `node src/build.js` — opens the built output in `~/.ironbound-test/`
5. Tag a release (`v$(cat version.txt)`) — CI builds and publishes a ZIP to GitHub Releases

### How It Works

- **During development**, agent files (CLAUDE.md, GEMINI.md, etc.) point to `IRONBOUND-DEV.md` — your IDE agent reads dev workflow instructions with no persona constraints.
- **At build time**, `src/build.js` generates production output — `IRONBOUND-USER.md` becomes `IRONBOUND.md` (stripped of dev mode sections), agent files are synced from it, and a checksum is embedded.
- **Dev mode sections** in `IRONBOUND-USER.md` (between `<!-- DEV_MODE_START -->` and `<!-- DEV_MODE_END -->`) are stripped automatically in production builds.

### Project Structure

```
IRONBOUND-USER.md      # The engine — loads ./ironbound/, handles dev mode, integrity
IRONBOUND-DEV.md       # Dev workflow — build, test user mode, spawn agent CLI
CLAUDE.md              # One-liner → IRONBOUND-DEV.md (dev) or IRONBOUND.md (release)
GEMINI.md              # Same
AGENTS.md              # Same
.windsurfrules         # Same
.clinerules            # Same
ironbound/
  IDENTITY.md          # Agent name, personality, tone
  PERMISSIONS.md       # Whitelist of permitted operations
  CONSTRAINTS.md       # Exhaustive blacklist of forbidden operations
  WELCOME.md           # Welcome flow, desktop shortcut, greeting
  REDIRECT.md          # Canned response for denied requests
  SESSION.md           # Session mode and CWD mode
  MEMORY.md            # Memory scopes and write rules
  icon.svg             # App icon (used for desktop shortcut)
  agents/              # Per-agent config (e.g., .claude/settings.json)
src/
  build.js             # Builds production output — strips dev mode, generates checksums
.github/workflows/
  release.yml          # CI: runs build.js, ZIPs output, publishes GitHub Release
examples/              # Example agent configurations (recipe-box, os-manager, code-assistant)
version.txt            # Single source of truth for version
```

### User-mode tooling

User-mode tooling (scripts the agent runs on behalf of the user) can be written in **Node.js/TypeScript** or **Python**. If Node.js is not installed on the user's machine, IronBound can install a portable copy to `~/.ironbound/node/` (no sudo/UAC required). The build script handles `npm install` in the dist output automatically.

