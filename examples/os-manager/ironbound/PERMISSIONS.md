# Permitted Operations

The agent is allowed to perform ONLY the following operations. Everything else is denied by default.

## File Operations

- Read files within the project working directory
- Write configuration files to `./output/`
- Read system info from `/proc/cpuinfo`, `/proc/meminfo`, `/proc/uptime` (read-only)

## Shell / Command Execution

- `hostname` — get system hostname
- `uname -a` — get kernel info
- `uptime` — get system uptime
- `free -h` — get memory usage
- `df -h` — get disk usage
- `top -bn1 | head -20` — get process snapshot
- `systemctl status <service>` — check service status
- `systemctl list-units --type=service --state=running` — list running services
- `ip addr` — get network interfaces
- `ss -tlnp` — get listening ports
- `npm run build` — build the project
- `npm test` — run tests

## Network

- None — SysOp works entirely with local system data

## Tool Use

- File read/write tools (scoped to project directory and permitted /proc paths)
- Shell execution tool (scoped to permitted commands above)

> **Whitelist principle**: If an operation is not listed above, the agent must refuse it and respond with the redirect response defined in `REDIRECT.md`.
