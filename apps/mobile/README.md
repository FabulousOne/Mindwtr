# Focus GTD Mobile

React Native mobile app for the Focus GTD productivity system.

## Features

### GTD Workflow
- **Inbox Processing** - Guided clarify workflow with 2-minute rule
- **Context Filtering** - Filter tasks by @home, @work, @errands, etc.
- **Dark Mode** - Full dark theme support with system preference
- **Swipe Actions** - Quick task management gestures

### Screens
| Screen | Description |
|--------|-------------|
| Inbox | Capture and process incoming items |
| Next Actions | Context-filtered actionable tasks |
| Agenda | Time-based view |
| Review | Task review and status changes |
| Projects | Multi-step outcomes (drawer) |
| Contexts | Filter by location/tool (drawer) |
| Waiting For | Delegated items (drawer) |
| Someday/Maybe | Deferred ideas (drawer) |
| Settings | Theme preferences |

## Tech Stack

- React Native + Expo SDK 54
- TypeScript
- Zustand (shared with desktop via @focus-gtd/core)
- Expo Router (file-based navigation)

## Quick Start

```bash
# From monorepo root
bun install

# Start Expo dev server
bun mobile:start

# Run on Android
bun mobile:android

# Run on iOS
bun mobile:ios
```

## Prerequisites

- Node.js
- Bun package manager
- Expo Go app (for device testing) OR
- Android Studio (for emulator) OR
- Xcode (for iOS Simulator)

## Android Environment

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Running on Device

### Expo Go (Recommended)
1. Install Expo Go on your phone
2. Run `bun mobile:start`
3. Scan QR code with camera (iOS) or Expo Go (Android)

### Android Emulator
```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_API_34 &

# Run app
bun mobile:android
```

## Data Storage

Tasks are stored in AsyncStorage and synced via the shared @focus-gtd/core package.
