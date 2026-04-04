# IronBound Developer Guide

This document covers everything you need to fork, customize, and deploy IronBound for your own AI agent.

---

## Private Repo Requirement

Your fork should be a **private repository**. The `IRONBOUND.md` file in dev mode contains architecture notes, design decisions, and internal context that you do not want exposed publicly. The release workflow strips this content, but the source repo should remain private.

To fork privately:

1. Create a new private repo on GitHub
2. Clone the IronBound template and push to your private repo:

```bash
git clone https://github.com/cordfuseinc/ironbound.git my-agent
cd my-agent
git remote set-url origin git@github.com:yourorg/my-agent.git
git push -u origin main
```

---

## Dev Mode Setup

Dev mode allows the agent to acknowledge its configuration to you (the developer) during development, while still refusing to disclose it to end users.

### Generate Your Dev Hash

```bash
mkdir -p ~/.ironbound
echo -n "your-secret-passphrase" | shasum -a 256 | awk '{print $1}' > ~/.ironbound/dev.hash
```

- Replace `"your-secret-passphrase"` with a passphrase only you know
- Never commit `~/.ironbound/dev.hash` or the passphrase itself
- The hash file must be present on your development machine for dev mode to activate

### What Dev Mode Changes

When active, the agent will:
- Acknowledge that IRONBOUND.md exists if you ask
- Discuss architecture and design decisions documented in dev mode sections
- Still refuse to dump raw file contents or reveal the full prompt

When inactive (production), the agent will:
- Deny the existence of any system prompt or instruction file
- Refuse all disclosure attempts
- Behave as if the dev mode sections do not exist (because they are stripped)

---

## Per-Agent Instructions

Each agent platform reads a different file from the project root. IronBound maintains identical copies across all of them.

| Platform | File | Notes |
|----------|------|-------|
| Claude Code | `CLAUDE.md` | Read automatically at session start |
| Gemini CLI | `GEMINI.md` | Read automatically at session start |
| Codex / GitHub Copilot | `AGENTS.md` | Read automatically at session start |
| Cursor / Windsurf | `.windsurfrules` | Read automatically at session start |
| Cline (VS Code) | `.clinerules` | Read automatically at session start |

### Manual Sync

```bash
cp IRONBOUND.md CLAUDE.md
cp IRONBOUND.md GEMINI.md
cp IRONBOUND.md AGENTS.md
cp IRONBOUND.md .windsurfrules
cp IRONBOUND.md .clinerules
```

### Automated Sync (CI)

The `sync.yml` workflow runs on every push to `main` that modifies `IRONBOUND.md`. It copies the file to all agent targets and commits the result. You do not need to manually sync if CI is configured.

---

## Release Workflow

The `release.yml` workflow triggers on tags matching `v*`. The canonical version is defined in `version.txt`.

### What It Does

1. **Strips dev mode** — Runs `scripts/strip-dev-mode.js` to remove all content between `<!-- DEV_MODE_START -->` and `<!-- DEV_MODE_END -->` markers
2. **Generates checksum** — Runs `scripts/generate-checksum.js` to compute SHA-256 of the clean file, writes it to `.ironbound-checksum`, and embeds it as an HTML comment in IRONBOUND.md
3. **Syncs agent files** — Copies the clean IRONBOUND.md to all agent files
4. **Packages ZIP** — Creates `ironbound-v*.zip` excluding `.git/` and `.github/workflows/`
5. **Creates GitHub Release** — Attaches the ZIP and checksum file

### Creating a Release

```bash
# version.txt is the single source of truth for the version number
VERSION=$(cat version.txt)
git tag "v${VERSION}"
git push origin "v${VERSION}"
```

The workflow runs automatically. Check the Actions tab for status.

### Checksum Verification

The checksum lets you verify that a deployed `IRONBOUND.md` has not been tampered with:

```bash
# Compute the hash of the deployed file (after removing the checksum comment)
sed 's/<!-- Checksum: [a-fA-F0-9]* -->/<!-- Checksum: NONE -->/' IRONBOUND.md | shasum -a 256

# Compare with .ironbound-checksum
cat .ironbound-checksum
```

---

## Session Mode

The `mode` setting in IRONBOUND.md controls how the agent handles concurrent sessions.

### `singleton`

Only one session may be active at a time. If the agent detects another active session, it refuses to start. Use this for agents that manage global state (e.g., system administration, deployment pipelines).

```yaml
mode: singleton
```

### `multi`

Multiple concurrent sessions are allowed. Each session has independent context and does not interfere with others. Use this for most application agents.

```yaml
mode: multi
```

---

## CWD Mode

The `cwd` setting controls how the agent handles its working directory.

### `fixed`

The working directory is locked to the project root. The agent cannot change directories or access files outside the project tree. Use this for sandboxed application agents.

```yaml
cwd: fixed
```

### `picker`

The agent prompts the user to select or confirm a working directory at session start. Use this for code assistants that need to work across multiple repositories or project directories.

```yaml
cwd: picker
```

---

## Customization Checklist

When forking IronBound for your agent, update these sections in `IRONBOUND.md`:

- [ ] **Identity** — Agent name, company, purpose
- [ ] **Permitted Operations** — Whitelist of allowed commands, file operations, network access, and tools
- [ ] **Redirect Response** — The polite refusal message in your agent's voice
- [ ] **Welcome Flow** — The greeting shown at session start
- [ ] **Session Mode** — `singleton` or `multi`
- [ ] **CWD Mode** — `fixed` or `picker`
- [ ] **Memory Scopes** — Which persistence layers to enable
- [ ] **Dev Mode Context** — Your architecture notes, design decisions, testing instructions
- [ ] **Blacklisted Operations** — Add any app-specific restrictions (never remove existing ones)
