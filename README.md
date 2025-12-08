# Focus GTD

A complete Getting Things Done (GTD) productivity system for desktop and mobile.

![Focus GTD](apps/mobile/assets/images/icon.png)

## Features

### GTD Workflow
- **Capture** - Quick add tasks to Inbox from anywhere
- **Clarify** - Guided inbox processing with 2-minute rule
- **Organize** - Projects, contexts, and status lists
- **Reflect** - Weekly review wizard
- **Engage** - Context-filtered next actions

### Views
- 📥 **Inbox** - Capture zone with processing wizard
- ▶️ **Next Actions** - Context-filtered actionable tasks
- 📁 **Projects** - Multi-step outcomes
- 🏷️ **Contexts** - @home, @work, @errands, etc.
- ⏳ **Waiting For** - Delegated items
- 💭 **Someday/Maybe** - Deferred ideas
- 📅 **Calendar** - Time-based planning
- 📋 **Weekly Review** - Guided GTD review

### Cross-Platform
- 🖥️ **Desktop** - Electron app (macOS, Linux)
- 📱 **Mobile** - React Native/Expo (iOS, Android)
- 🔄 **Shared Core** - Same data model and business logic

## Quick Start

```bash
# Install dependencies
bun install

# Run desktop app
bun desktop:dev

# Run mobile app
bun mobile:start
```

## Project Structure

```
Focus-GTD/
├── apps/
│   ├── desktop/     # Electron + React + Vite
│   └── mobile/      # Expo + React Native
├── packages/
│   └── core/        # Shared business logic (Zustand store)
└── package.json     # Monorepo root
```

## Tech Stack

| Layer | Desktop | Mobile |
|-------|---------|--------|
| Framework | React + Vite | React Native + Expo |
| Styling | Tailwind CSS | StyleSheet |
| State | Zustand (shared) | Zustand (shared) |
| Platform | Electron | iOS/Android |

## Data

Tasks and projects are stored locally:
- **Desktop**: `~/.config/focus-gtd/data.json`
- **Mobile**: AsyncStorage

## Apps

- [Desktop README](apps/desktop/README.md)
- [Mobile Setup Guide](apps/mobile/MOBILE_SETUP.md)

## License

MIT
