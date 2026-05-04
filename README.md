# IronBound

Build and distribute AI agent apps that run on the user's existing Claude, Gemini, or OpenAI account. No API keys to set up. No extra costs to the developer or the user.

Define your agent's identity, permissions, constraints, memory, and welcome flow in a handful of `.md` files. Ship it as a ZIP or a platform installer. Users open it in any supported agent CLI on a desktop OS. The agent introduces itself, creates a desktop shortcut, and just works.

**See it in action:** [ToneAI](https://github.com/steve-krisjanovs/toneai-nux-qr-ironbound) · [Chef Remy](https://github.com/cordfuse/ironbound-chefremy)

**Fork this repo to build your own.**

---

## For Users

### CLI agent on desktop (Mac, Windows, Linux)

1. Download the ZIP from the app's GitHub Releases page
2. Extract and open the folder in any supported agent
3. Say hello — the agent introduces itself and creates a desktop shortcut

**Supported agents:**

| Agent | Surface | Notes |
|---|---|---|
| Claude Code | `claude` (terminal) | Anthropic's CLI — runs in any terminal |
| Claude Desktop | Native Mac/Windows app | Open the extracted folder in the app; same agent engine as Claude Code, GUI surface instead of terminal |
| Gemini CLI | `gemini` (terminal) | Google's official CLI |
| Codex CLI | `codex` (terminal) | OpenAI's CLI |
| OpenCode | `opencode` (terminal) | Open-source alternative |

### Not supported

Web/mobile chat clients (Claude.ai chat, Claude Projects, ChatGPT, Gemini web) are **not viable distribution targets** for IronBound apps. Tested across all four 2026-05-04:

- **Claude.ai web/mobile chat:** chat attachment works for one-off use, but each new chat requires re-attaching the ZIP and re-prompting — too high-friction for a recurring tool, and there's no Project-level persistence (Projects don't accept ZIPs and GitHub-as-knowledge connection doesn't run as the persona)
- **ChatGPT web:** safety layer rejects the persona-takeover pattern
- **Gemini web:** emits a JSON output file instead of running as the agent
- **Claude Projects:** ZIP uploads not accepted; GitHub-connection-as-knowledge doesn't preserve the agent persona

If you're shipping an IronBound app, target CLI agents only. Direct users who can't install a CLI to a hosted alternative (Claude.ai web equivalent) — IronBound isn't the right shape for them.

---

## For Developers

### Fork and Customize

1. Fork this repo
2. Edit files in `./ironbound/` to define your agent
3. Say `guide` on first dev session — the agent walks you through setup step by step
4. Say `demo` to test user mode — builds and launches the locked persona in a new terminal
5. Tag a release (`v$(cat version.txt)`) — CI builds and publishes a ZIP

Dev mode is implicit — if you're in the repo with `IRONBOUND-DEV.md`, you're in dev mode. No setup needed.

### How It Works

- **During development**, agent files point to `IRONBOUND-DEV.md` — no persona constraints while coding
- **At build time**, `src/build.js` strips dev mode, generates agent files and checksums
- **In production**, the user's agent reads `IRONBOUND.md` → `ironbound/*.md` — locked persona, scoped permissions
- **Memory** persists to `~/.ironbound/{app-name}/` — not the agent's native memory system

### Project Structure

```
IRONBOUND-USER.md      # Engine — loads ./ironbound/, stripped in release builds
IRONBOUND-DEV.md       # Dev workflow — build, test, spawn agent CLI
DEV-GUIDE.md           # Guided first-time setup walkthrough
CLAUDE.md              # One-liner → IRONBOUND-DEV.md (dev) or IRONBOUND.md (release)
GEMINI.md              # Same
AGENTS.md              # Same
.windsurfrules         # Same
.clinerules            # Same
ironbound/
  IDENTITY.md          # Agent name, personality, tone
  PERMISSIONS.md       # Whitelist of permitted operations
  CONSTRAINTS.md       # Exhaustive blacklist
  WELCOME.md           # Welcome flow — installer detection, shortcut, greeting
  REDIRECT.md          # Canned response for denied requests
  SESSION.md           # Session mode, CWD mode, bash policy, update config
  MEMORY.md            # Memory scopes and write rules
  icon.svg             # App icon (desktop shortcut)
  agents/              # Per-agent permission configs
src/
  build.js             # Builds production output
.github/workflows/
  release.yml          # CI: build, ZIP, publish to GitHub Releases
examples/              # Example apps (recipe-box, os-manager, code-assistant)
version.txt            # Single source of truth for version
```

> **Template placeholders:** `[Your App Name]` and `[Your Company]` in the ironbound/ files are meant to be replaced when you fork. They are intentional — this is a template.

### User-mode tooling

User-mode scripts can be **Node.js/TypeScript** or **Python**. If Node.js is missing, IronBound installs a portable copy to `~/.ironbound/node/` (no sudo/UAC). The build script handles `npm install` automatically.

---

## Showcase

Apps built on IronBound:

| App | Description |
|---|---|
| [ToneAI](https://github.com/steve-krisjanovs/toneai-nux-qr-ironbound) | AI guitar tone assistant — NUX MightyAmp QR presets for any song, album, or artist |
| [Chef Remy](https://github.com/cordfuse/ironbound-chefremy) | AI recipe assistant — weather-aware, taste memory, cookbook PDFs |

*Built something with IronBound? Open a PR to add it here.*

---

<sub>[IronBound](https://github.com/cordfuse/ironbound) is maintained by [Cordfuse](https://github.com/cordfuse).</sub>
