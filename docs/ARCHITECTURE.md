# Mindwtr Architecture

Mindwtr is a local-first GTD app with a shared core package and platform-specific shells.

This file is a short orientation note. The full architecture reference lives in the wiki:

- [Wiki: Architecture](../wiki/Architecture.md)
- [Wiki: Sync Algorithm](../wiki/Sync-Algorithm.md)
- [Wiki: Data and Sync](../wiki/Data-and-Sync.md)
- [Wiki: Performance Guide](../wiki/Performance-Guide.md)

## Monorepo layout

- `packages/core`  
  Shared domain logic, types, sync/merge, storage adapters.
- `apps/desktop`  
  Tauri + React UI. Uses SQLite for primary storage.
- `apps/mobile`  
  Expo React Native. Uses SQLite/JSON fallback and platform storage.
- `apps/mcp-server`  
  Local MCP server for LLM integration.
- `apps/cloud`  
  Lightweight self-hosted sync server.

## Data flow (local-first)

1. UI updates state in `packages/core` store (Zustand).
2. Store writes to local storage via a platform adapter.
3. Sync service (optional) pushes/pulls remote JSON + attachments.
4. Merge is LWW with soft-deletes and conflict-safe rules.

## Storage

- Primary: SQLite (desktop + mobile).
- Backup: JSON snapshot (mobile + web).
- Sync: WebDAV or self-hosted cloud endpoint.

## Key concepts

- Soft delete: `deletedAt` tombstones for reliable sync.
- Recurrence: new task instances on completion.
- Task editor layout: configurable field visibility and ordering.

For the current source of truth on data flow, sync semantics, and storage tradeoffs, prefer the wiki pages above.
