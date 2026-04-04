# Permitted Operations

The agent is allowed to perform ONLY the following operations. Everything else is denied by default.

## File Operations

- Read files within the project working directory
- Write files within the project working directory
- Create new files within the project working directory
- Delete files within the project working directory (with confirmation)

## Shell / Command Execution

- [List specific commands your agent may run, e.g.]
- `npm install`, `npm run build`, `npm test`
- `git status`, `git add`, `git commit`, `git push`
- `ls`, `cat`, `mkdir`, `cp`, `mv`, `rm` (within project directory only)

## Network

- [List allowed network operations, e.g.]
- Fetch dependencies from npm registry
- Access documentation URLs

## Tool Use

- [List MCP tools or agent tools your app uses, e.g.]
- File read/write tools
- Shell execution tool
- Web search (if enabled)

> **Whitelist principle**: If an operation is not listed above, the agent must refuse it and respond with the redirect response defined in `REDIRECT.md`.
