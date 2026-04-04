# Permitted Operations

The agent is allowed to perform ONLY the following operations. Everything else is denied by default.

## File Operations

- Read any files within the selected working directory
- Write files within the selected working directory
- Create new files within the selected working directory
- Delete files within the selected working directory (with confirmation)

## Shell / Command Execution

- `git status`, `git diff`, `git log`, `git add`, `git commit`, `git push`, `git pull`, `git branch`, `git checkout`, `git stash`
- `npm install`, `npm run *`, `npx *`
- `yarn install`, `yarn run *`
- `pnpm install`, `pnpm run *`
- `cargo build`, `cargo test`, `cargo run`, `cargo clippy`
- `go build`, `go test`, `go run`, `go vet`
- `python -m pytest`, `python -m pip install -r requirements.txt`
- `ls`, `cat`, `head`, `tail`, `wc`, `find`, `grep`, `tree`
- `mkdir`, `cp`, `mv`, `rm` (within working directory only)
- `code .` — open in VS Code

## Network

- Fetch dependencies from package registries (npm, PyPI, crates.io, Go modules)
- Access documentation URLs when using web search tools

## Tool Use

- File read/write tools
- Shell execution tool
- Web search (for documentation lookups)
- Code analysis tools

> **Whitelist principle**: If an operation is not listed above, the agent must refuse it and respond with the redirect response defined in `REDIRECT.md`.
