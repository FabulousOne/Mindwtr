# Mindwtr MCP Server

Local MCP server for Mindwtr. Connect MCP clients (Claude Desktop, etc.) to your local Mindwtr SQLite database.

## Quick start

```bash
# From the repo root
bun run --filter mindwtr-mcp-server dev -- --db /path/to/mindwtr.db
```

Environment overrides:
- `MINDWTR_DB_PATH` or `MINDWTR_DB` to override the database path.

## Tools

- `mindwtr.list_tasks`
- `mindwtr.add_task`
- `mindwtr.complete_task`

## Notes

- The server uses SQLite WAL mode and respects existing locks.
- Writes are blocked when started with `--readonly`.
