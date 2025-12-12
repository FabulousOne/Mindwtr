# Mindwtr Roadmap

This document captures the phased product roadmap and how work splits between `@mindwtr/core` and the desktop/mobile apps.

## Phase 1 — GTD Completeness (Core-first)

### 1) Recurring Tasks Engine
**Goal:** A recurring task automatically produces its next instance when completed/archived.

- **Core**
  - Add recurrence helpers (daily/weekly/monthly/yearly).
  - On status transition into `done`/`archived`, roll a recurring task:
    - Create a new task instance with next `dueDate`/`startTime`.
    - Keep history by leaving the completed item intact.
  - Tests for recurrence edge cases and sync compatibility.
- **Desktop**
  - Recurrence selector in Task edit.
  - Display recurrence badge and next due date.
- **Mobile**
  - Add recurrence selector to Task edit modal.
  - Ensure swipe/status flows trigger recurrence via core.

### 2) Tickler / Review Dates
**Goal:** Add `reviewAt` to tasks and projects to control when items are due for re‑consideration.

- **Core**
  - Add `reviewAt` fields to Task and Project types.
  - Provide `isDueForReview` / `filterDueForReview` helpers.
  - Persist and merge via existing LWW rules.
- **Desktop**
  - Allow setting `reviewAt` on tasks/projects.
  - Weekly Review and Agenda surface items due for review first.
- **Mobile**
  - Allow setting `reviewAt` on tasks/projects.
  - Weekly Review and Agenda surface items due for review first.

### 3) Project Lifecycle + Next Action Discipline
**Goal:** Make projects trustworthy by ensuring each active project has a next action and can be completed/archived cleanly.

- **Core**
  - Project status transitions (`active` → `completed`/`archived`).
  - Helper to detect “no next action” projects.
- **Desktop**
  - Highlight projects without next actions.
  - Actions to complete/archive projects.
- **Mobile**
  - Highlight projects without next actions.
  - Actions to complete/archive projects.

## Phase 2 — Daily Capture & Engagement

### 1) Shared Quick‑Add Parser (Natural Language)
- **Core:** `parseQuickAdd(input)` that returns `{ title, props }` (status, due, note, contexts, tags, projectId).
- **Desktop/Mobile:** Wire all add inputs to the parser and show parsing help.

### 2) Frictionless Capture Entry Points
- **Desktop:** Global hotkey + tray quick‑add to Inbox.
- **Mobile:** Share‑sheet capture + optional home widget.

### 3) Notifications / Reminders
- **Core:** Schedule computation helpers from `dueDate/startTime/recurrence`.
- **Desktop:** Tauri notifications with snooze.
- **Mobile:** Expo notifications with snooze.

## Phase 2.5 — Search & Quick Actions

### 1) Advanced Search + Saved Searches
**Goal:** Make the system feel fast and discoverable by letting users filter anything and save those filters.

- **Core**
  - Add a small search query language with operators:
    - `status:`, `context:`, `tag:`, `project:`, `due:`, `start:`, `review:`, `created:`
    - Support negation (`-status:done`), AND/OR groups, and date ranges (`due:<=7d`, `created:>=30d`).
  - Store `savedSearches[]` in settings (name + query + optional sort/grouping).
- **Desktop**
  - Upgrade Global Search to support operators.
  - “Save this search” UI and a Saved Searches section in sidebar.
- **Mobile**
  - Same operators in search and a Saved Searches list in drawer.

### 2) Subtask Progress Indicators
**Goal:** Make checklists actionable and visible at a glance.

- **Core**
  - Keep checklist model as-is, add derived helpers: `getChecklistProgress(task)`.
- **Desktop/Mobile**
  - Show `3/5` + small progress bar on task cards when checklist exists.
  - Inline expand/collapse checklist in list views.

### 3) Collapsible Sidebar (Desktop)
**Goal:** Improve focus and screen real estate for heavy users.

- **Desktop**
  - Collapse to icons‑only, toggle button + shortcut.
  - Remember preference in settings.

## Phase 3 — Trust, Sync, and Organization

### 1) Auto‑Sync + Status
- **Core:** Stronger merge stats/conflict summaries.
- **Desktop/Mobile:** Background/on‑resume sync with last‑sync UI.

### 2) Bulk Actions & List Customization
- **Core:** Batch store actions to reduce repeated saves.
- **Desktop/Mobile:** Multi‑select, batch move/tag/delete, user sorting/grouping.

### 3) Task Dependencies / Blocking
**Goal:** Keep Next Actions truly actionable by hiding blocked work.

- **Core**
  - Add `blockedByTaskIds?: string[]` and helpers to compute blocked/unblocked sets.
- **Desktop/Mobile**
  - “Blocked by” picker in task editor.
  - Hide blocked tasks from Next and show “unblocks X tasks” on parents.

### 4) Hierarchical Contexts/Tags
**Goal:** Allow deeper organization without clutter.

- **Core**
  - Support slash notation (`@work/meetings`, `#health/diet`) and parent‑includes‑children filtering.
- **Desktop/Mobile**
  - Context/tag filters treat `@work` as matching `@work/*`.

### 5) Areas (Project Groups)
**Goal:** Optional higher‑level grouping for projects.

- **Core**
  - Add optional `areaId`/`areaTitle` on projects.
- **Desktop/Mobile**
  - Group projects by area in Projects view and sidebar.

### 6) Accent Color / Theme Customization
**Goal:** Lightweight personalization beyond light/dark.

- **Core**
  - Store `accentColor` (and maybe `fontScale`) in settings.
- **Desktop/Mobile**
  - Accent color picker; apply consistently to buttons/highlights.

## Phase 4 — Power‑User & Reference

### 1) Markdown Notes + Attachments
- **Core:** `attachments[]` on tasks/projects + merge rules.
- **Desktop/Mobile:** Pick/render attachments and markdown safely.

### 2) Desktop Keyboard/A11y Pass
- **Desktop only:** Full shortcut set for capture/clarify/organize and accessibility polish.

### 3) Daily Digest Notifications
**Goal:** Support a lightweight daily review habit.

- **Core**
  - Helper to compute “today summary” (due, overdue, focus, review‑due).
- **Desktop/Mobile**
  - Optional morning briefing + evening review prompt; configurable time.

### 4) Integrations & Automation
**Goal:** Enable power users to automate capture and review.

- **Desktop/Core**
  - Optional local API server and/or CLI for add/list/complete/search.

### 5) Additional Sync Backends
**Goal:** Support more self‑hosted sync options.

- **Core/Desktop/Mobile**
  - Add WebDAV (or similar) as an alternative sync adapter.

### 6) Custom Themes (Advanced)
**Goal:** Let advanced users fully theme the app.

- **Desktop**
  - Optional CSS/theme override file.
