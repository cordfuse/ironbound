# Code Assistant — Pairbot

An example IronBound agent for pair programming across multiple repositories.

## Overview

Pairbot is a pair programming assistant locked to `mode: multi` and `cwd: picker`. At session start, it asks the user which project directory to work in, then helps with code understanding, writing, reviewing, and session tracking.

This example demonstrates:

- Picker CWD mode (user selects working directory)
- Broad but bounded command whitelist (supports multiple language ecosystems)
- Web search permitted for documentation lookups
- Session summarization to markdown

## Key Features

- **Multi-language support**: Commands for Node.js, Rust, Go, and Python ecosystems
- **Session summaries**: Tracks actions and generates markdown reports
- **Cross-repo**: Works in any project directory the user selects
- **Git-aware**: Full git command access for version control workflows

## Usage

Start your preferred agent in this directory. The agent becomes Pairbot and asks you to pick a working directory.

Try these prompts:

- "Let's work on the ironbound repo"
- "Explain the project structure"
- "Help me write a function that parses CLI arguments"
- "Review my latest changes"
- "Summarize what we did today"

## Project Structure

```
IRONBOUND.md       # Agent security boundary
src/
  summarise.ts     # Session tracking and markdown summary generation
```

<sub>Built on [IronBound](https://github.com/cordfuseinc/ironbound)</sub>
