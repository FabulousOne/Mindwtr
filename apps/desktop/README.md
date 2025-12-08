# Focus GTD Desktop

Electron desktop app for the Focus GTD productivity system.

## Features

### GTD Workflow
- **Inbox Processing** - Guided clarify workflow with 2-minute rule
- **Context Filtering** - Filter tasks by @home, @work, @errands, etc.
- **Weekly Review** - Step-by-step GTD review wizard
- **Board View** - Kanban-style drag-and-drop
- **Calendar View** - Time-based task planning

### Views
| View | Description |
|------|-------------|
| Inbox | Capture and process incoming items |
| Next Actions | Context-filtered actionable tasks |
| Projects | Multi-step outcomes with tasks |
| Contexts | Filter by location/tool |
| Waiting For | Delegated items |
| Someday/Maybe | Deferred ideas |
| Calendar | Time-based view |
| Review | Weekly review wizard |
| Settings | Theme and preferences |

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Zustand (shared with mobile)
- Electron
- @dnd-kit (drag and drop)

## Getting Started

```bash
# From monorepo root
bun install

# Run desktop app
bun desktop:dev

# Build for distribution
bun desktop:build
```

## Data Storage

Tasks are saved to:
- **macOS**: `~/Library/Application Support/focus-gtd/data.json`
- **Linux**: `~/.config/focus-gtd/data.json`

## Testing

```bash
bun run test
```

Includes unit tests, component tests, and accessibility tests.
