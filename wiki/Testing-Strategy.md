# Testing Strategy

Mindwtr uses a layered testing strategy across `core`, platform apps, and integration surfaces.

## Goals

1. Protect data integrity (sync, storage, merge rules)
2. Catch regressions in critical user workflows
3. Keep tests fast and deterministic in CI

## Test Layers

## Core (`packages/core`)

- Primary logic coverage (sync, recurrence, parsing, storage helpers)
- Fast unit tests with deterministic fixtures
- Most data integrity invariants should be enforced here first

## Desktop (`apps/desktop`)

- Component and view behavior tests (Vitest + Testing Library)
- Focus on interaction-heavy views and sync orchestration wrappers

## Mobile (`apps/mobile`)

- Utility and orchestration tests
- Critical flow smoke tests for sync and task editing behavior
- Device-specific UI behavior still relies partly on manual verification

## Cloud (`apps/cloud`)

- API endpoint tests
- Auth/rate-limit/path validation
- CRUD and attachment endpoint behavior
- Coverage is targeted around core request handling, not exhaustive concurrent deployment scenarios

## MCP Server (`apps/mcp-server`)

- Query layer correctness (search, add/update/delete/restore)
- Input validation and transaction behavior
- Coverage is focused on tool behavior and validation, not full end-to-end editor/LLM workflows

## Current Coverage Limits

- `packages/core` has the strongest automated coverage and should remain the first line of defense for data integrity regressions.
- Desktop has good component coverage in critical views, but not every interaction path is covered end-to-end.
- Mobile coverage is intentionally lighter than desktop/core coverage; accessibility, gestures, and native integration paths still need manual checks on devices.
- Cloud and MCP server tests cover core handlers and validation paths, but do not yet simulate every production concurrency or deployment edge case.

## What to Test First

When adding or changing behavior, prioritize tests in this order:

1. Data correctness and merge semantics
2. Error paths and retry/timeout behavior
3. User-facing interaction path
4. Performance-sensitive logic (search/sync/list transforms)

## Regression Checklist

Before merge:

1. Add or update tests for changed behavior
2. Run affected package tests locally
3. Run broader workspace tests for cross-package changes
4. Verify no snapshot/state coupling between tests

## Practical Rules

1. Prefer deterministic timestamps/fixtures over live time.
2. Avoid network dependency in unit tests.
3. Keep each test focused on one behavior.
4. Use integration tests for workflow boundaries, not every branch.
5. Treat flaky tests as bugs and fix root cause quickly.
6. When a platform-specific bug is fixed without robust automation, document the required manual verification steps in the PR.

## Related docs

- [[Developer Guide]]
- [[Architecture]]
- [[Sync Algorithm]]
- [[Data and Sync]]
