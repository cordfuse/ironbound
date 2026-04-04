# Your App Name — powered by IronBound

**IronBound** is an open-source security framework for AI coding agents. It defines a single, portable instruction file (`IRONBOUND.md`) that locks down your agent's identity, permissions, and behavior — then syncs it across every agent platform automatically.

One file. Every agent. No leaks.

---

## For Users

### Option A: Use with AgentBox (GUI)

> *AgentBox is a planned companion app. This section will be updated when it launches.*

1. Download AgentBox from [cordfuseinc/agentbox](https://github.com/cordfuseinc/agentbox)
2. Open your project folder
3. AgentBox detects `IRONBOUND.md` and configures your agent automatically

### Option B: Use with CLI / Cowork

Use IronBound with any agent that reads instruction files from your project root:

| Agent | File | How it works |
|-------|------|-------------|
| Claude Code | `CLAUDE.md` | Reads automatically from project root |
| Gemini | `GEMINI.md` | Reads automatically from project root |
| Cursor / Windsurf | `.windsurfrules` | Reads automatically from project root |
| Cline | `.clinerules` | Reads automatically from project root |
| Codex / Copilot | `AGENTS.md` | Reads automatically from project root |

All agent files are identical copies of `IRONBOUND.md`. Edit `IRONBOUND.md` and the CI workflow syncs changes to all agent files on push.

#### Quick Start

```bash
# Clone the template
git clone https://github.com/cordfuseinc/ironbound.git my-agent
cd my-agent

# Edit the template
# Replace all [PLACEHOLDER] markers with your app's details
vim IRONBOUND.md

# Copy to agent files (or let CI do it)
cp IRONBOUND.md CLAUDE.md
cp IRONBOUND.md GEMINI.md
cp IRONBOUND.md AGENTS.md
cp IRONBOUND.md .windsurfrules
cp IRONBOUND.md .clinerules
```

---

## For Developers

### Fork and Customize

1. **Fork this repo** as a private repository (your `IRONBOUND.md` will contain sensitive architecture details in dev mode)
2. Replace all `[PLACEHOLDER]` markers in `IRONBOUND.md` with your app's configuration
3. Set up your dev hash so the agent knows you're the developer:

```bash
mkdir -p ~/.ironbound
echo -n "your-secret-passphrase" | shasum -a 256 | awk '{print $1}' > ~/.ironbound/dev.hash
```

4. Push to `main` — the CI sync workflow keeps all agent files in sync with `IRONBOUND.md`
5. Tag a release (e.g., `v$(cat version.txt)`) — the release workflow strips dev mode, generates a checksum, and publishes a clean ZIP. The version is read from `version.txt`.

### Dev Mode

Dev mode sections (between `<!-- DEV_MODE_START -->` and `<!-- DEV_MODE_END -->`) let you document architecture decisions, testing notes, and internal context that the agent can reference during development. These sections are automatically stripped from production releases.

### CI Workflows

- **`sync.yml`** — On push to `main`, copies `IRONBOUND.md` to all agent files
- **`release.yml`** — On tag `v*`, strips dev mode, generates SHA-256 checksum, syncs agent files, packages a release ZIP

### Project Structure

```
version.txt            # Single source of truth for version number
IRONBOUND.md           # The source of truth — edit this file
CLAUDE.md              # Auto-synced copy for Claude Code
GEMINI.md              # Auto-synced copy for Gemini
AGENTS.md              # Auto-synced copy for Codex/Copilot
.windsurfrules         # Auto-synced copy for Cursor/Windsurf
.clinerules            # Auto-synced copy for Cline
scripts/
  strip-dev-mode.js    # Strips dev sections for release
  generate-checksum.js # Generates SHA-256 checksum
.github/workflows/
  sync.yml             # CI: sync agent files
  release.yml          # CI: build release
examples/              # Example agent configurations
```

See [DEVELOPER.md](DEVELOPER.md) for full fork documentation.
See [SECURITY.md](SECURITY.md) for the security model.

---

<sub>Built on [IronBound](https://github.com/cordfuseinc/ironbound) — open-source AI agent security</sub>
