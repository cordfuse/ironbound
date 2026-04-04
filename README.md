# Your App Name — powered by IronBound

**IronBound** is an open-source security framework for AI coding agents. It defines an engine file (`IRONBOUND-USER.md`) and an app definition directory (`./ironbound/`) that lock down your agent's identity, permissions, and behavior.

One engine. One config directory. Every agent. No leaks.

---

## For Users

### Option A: Use with AgentBox (GUI)

> *AgentBox is a planned companion app. This section will be updated when it launches.*

1. Download AgentBox from [cordfuseinc/agentbox](https://github.com/cordfuseinc/agentbox)
2. Open your project folder
3. AgentBox detects `IRONBOUND-USER.md` and `./ironbound/` and configures your agent automatically

### Option B: Use with CLI / Cowork

Download the ZIP from the GitHub Release page, extract it, and open the folder in any supported agent (Claude Desktop, Cowork, Gemini CLI, etc.). The agent files inside the ZIP are pre-configured.

---

## For Developers

### Fork and Customize

1. **Fork this repo** as a private repository (your `IRONBOUND-USER.md` contains dev mode architecture notes)
2. Edit files in `./ironbound/` to configure your agent — do NOT edit `IRONBOUND-USER.md` directly
3. Set up your dev hash so the agent knows you're the developer:

```bash
mkdir -p ~/.ironbound
echo -n "your-secret-passphrase" | shasum -a 256 | awk '{print $1}' > ~/.ironbound/dev.hash
```

4. To test user mode: run `node scripts/build.js` → open `dist/` in an agent CLI
5. Tag a release (e.g., `v$(cat version.txt)`) — the release workflow builds `dist/`, ZIPs it, and publishes to GitHub Releases

### How It Works

- **Agent files point to `IRONBOUND-DEV.md`** — during development, your IDE agent reads dev workflow instructions (build, test, deploy). No persona constraints while coding.
- **`scripts/build.js`** generates everything into `dist/` — `IRONBOUND-USER.md` becomes `IRONBOUND.md` (stripped of dev mode), agent files are synced from it, checksum generated. This is what ships in the ZIP.
- **Dev mode** sections in `IRONBOUND-USER.md` (between `<!-- DEV_MODE_START -->` and `<!-- DEV_MODE_END -->`) are stripped from `dist/` builds automatically.

### Project Structure

```
IRONBOUND-USER.md      # The engine — loads ./ironbound/, handles dev mode, integrity
IRONBOUND-DEV.md       # Dev workflow — build, test user mode, spawn agent CLI
CLAUDE.md              # One-liner pointing to IRONBOUND-DEV.md (dev mode)
ironbound/
  IDENTITY.md          # Agent name, personality, tone
  PERMISSIONS.md       # Whitelist of permitted operations
  CONSTRAINTS.md       # Exhaustive blacklist of forbidden operations
  WELCOME.md           # Welcome flow and greeting
  REDIRECT.md          # Canned response for denied requests
  SESSION.md           # Session mode and CWD mode
  MEMORY.md            # Memory scopes and write rules
scripts/
  build.js             # Builds dist/ — strips dev mode, generates agent files + checksum
.github/workflows/
  release.yml          # CI: runs build.js, ZIPs dist/, publishes GitHub Release
examples/              # Example agent configurations
version.txt            # Single source of truth for version
```

See [DEVELOPER.md](DEVELOPER.md) for full fork documentation.
See [SECURITY.md](SECURITY.md) for the security model.

---

<sub>Built on [IronBound](https://github.com/cordfuseinc/ironbound) — open-source AI agent security</sub>
