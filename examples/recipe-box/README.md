# Recipe Box — Chef Remy

An example IronBound agent that helps users discover, format, and save recipes as markdown files.

## Overview

Chef Remy is a friendly recipe assistant locked to `mode: multi` and `cwd: fixed`. It can only read and write files within its project directory, and it saves formatted recipes to `./output/`.

This example demonstrates:

- A fully locked persona with a distinct voice
- Tight file system permissions (only `./output/` and `./src/`)
- No network access
- Memory scopes for user preferences (cuisine, dietary restrictions) and app state (recipe index)

## Setup

```bash
npm install
npm run build
```

## Usage

Start your preferred agent (Claude Code, Gemini, Cursor, etc.) in this directory. The agent reads `IRONBOUND.md` (the engine) which loads configuration from `./ironbound/`.

Try these prompts:

- "Help me make chocolate chip cookies"
- "I have chicken, garlic, and lemon — what can I make?"
- "List my saved recipes"
- "Show me the pasta carbonara recipe"

## Project Structure

```
IRONBOUND.md           # Engine file — loads ./ironbound/
ironbound/
  IDENTITY.md          # Chef Remy persona
  PERMISSIONS.md       # File and command whitelist
  CONSTRAINTS.md       # Security blacklist
  WELCOME.md           # Greeting flow
  REDIRECT.md          # Refusal response
  SESSION.md           # Multi/fixed mode
  MEMORY.md            # Memory scopes
src/
  formatter.ts         # Recipe formatting and file I/O
output/                # Saved recipes (gitignored)
package.json           # Dependencies
```

<sub>Built on [IronBound](https://github.com/cordfuseinc/ironbound)</sub>
