# Focus GTD Mobile App Setup

## Overview

This is the React Native mobile app for the Focus GTD workflow application, built with Expo SDK 54 and sharing business logic with the desktop app through the `@focus-gtd/core` package.

## Prerequisites

- **Bun** - Package manager (already configured)
- **Node.js** - Required by React Native
- **Expo Go** app (for testing on physical device) OR
- **Android Studio** (for Android emulator) OR
- **Xcode** (for iOS Simulator on macOS)

## Installation

Dependencies are managed at the monorepo level. From the project root:

```bash
bun install
```

## Running the App

### Development Server

From the project root:

```bash
# Start the Expo development server
bun mobile:start

# Or run directly in the mobile directory
cd apps/mobile
bun start
```

### Running on Devices

#### Environment Setup

For Android setup, ensure you have the environment variables set:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

ANDROID_HOME=/home/dd/Android/Sdk PATH=$PATH:/home/dd/Android/Sdk/emulator:/home/dd/Android/Sdk/platform-tools bun mobile:android
```

#### Option 1: Expo Go (Recommended for Quick Testing)

1. Install Expo Go app on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the dev server: `bun mobile:start`

3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

#### Option 2: Android Emulator

1. Verify emulator is accessible:
   ```bash
   emulator -list-avds
   ```

2. Start emulator (replace `Pixel_API_34` with your AVD name):
   ```bash
   emulator -avd Pixel_API_34 &
   ```

3. Run android build:
   ```bash
   # From project root
   bun mobile:android
   
   # Or from mobile directory
   cd apps/mobile
   bun android
   ```

#### Option 3: iOS Simulator (macOS only)

```bash
# From project root
bun mobile:ios

# Or from mobile directory
cd apps/mobile
bun ios
```

## Architecture

### Monorepo Structure

```
Focus-GTD/
├── apps/
│   ├── desktop/          # Electron desktop app
│   └── mobile/           # React Native mobile app (Expo)
└── packages/
    └── core/             # Shared business logic (Zustand store)
```

### Key Technologies

- **Expo SDK 54** - React Native framework
- **Expo Router** - File-based navigation
- **React Native 0.81.5** - Mobile framework
- **@focus-gtd/core** - Shared Zustand store for state management
- **AsyncStorage** - Local data persistence
- **TypeScript** - Type safety

### Data Storage

The mobile app uses React Native AsyncStorage through a storage adapter pattern:

- Storage adapter: `lib/storage-adapter.ts`
- Shared store: `@focus-gtd/core` package
- Data is automatically saved when tasks/projects change (debounced)
- Data is loaded on app startup

## Project Structure

```
apps/mobile/
├── app/
│   ├── (tabs)/          # Tab navigation screens
│   │   ├── inbox.tsx    # Inbox view (status: 'inbox')
│   │   ├── next.tsx     # Next Actions (status: 'next')
│   │   └── projects.tsx # Projects list
│   └── _layout.tsx      # Root layout with storage initialization
├── components/
│   ├── task-list.tsx    # Reusable task list component
│   └── ui/              # UI components
├── lib/
│   └── storage-adapter.ts # AsyncStorage integration
├── metro.config.js      # Metro bundler config for monorepo
├── shim.js              # Polyfills for React Native
└── whatwg-url-mock.js   # Mock for problematic dependency
```

## Features

### Current Features

- ✅ **Inbox** - Capture new tasks
- ✅ **Next Actions** - See tasks ready to do
- ✅ **Projects** - Organize work into projects
- ✅ **Local Storage** - Data persists across app restarts
- ✅ **Shared Logic** - Same business logic as desktop app

### Screens

1. **Inbox Tab** - View and add tasks with 'inbox' status
2. **Next Tab** - View and manage 'next' action tasks
3. **Projects Tab** - Create and manage projects with color coding

## Development Notes

### Monorepo + Bun + Expo

This project uses a monorepo setup with bun workspaces, which required some special configuration:

1. **Metro Config** (`metro.config.js`) - Configured to:
   - Watch the entire monorepo
   - Resolve packages from both app and root node_modules
   - Handle the `@focus-gtd/core` workspace package
   - Mock incompatible dependencies (whatwg-url-without-unicode)

2. **Dependencies** - Some React Native peer dependencies (like `nullthrows`, `invariant`) are installed directly in the mobile app to avoid resolution issues with bun's symlink structure.

3. **Shim** (`shim.js`) - Provides polyfills for:
   - SharedArrayBuffer
   - Buffer

### Known Workarounds

- `whatwg-url-without-unicode` is mocked because it doesn't work in React Native
- Metro's custom resolver handles the workspace package resolution
- Storage adapter is initialized at app root to ensure it's set before components mount

## Troubleshooting

### Metro Bundler Issues

If you see dependency resolution errors:

```bash
# Clear Metro cache
cd apps/mobile
bun start --clear

# Or manually clear
rm -rf .expo node_modules/.cache
```

### Storage Issues

If data isn't persisting:

1. Check that storage adapter is initialized in `app/_layout.tsx`
2. Verify AsyncStorage is working:
   ```bash
   # Clear app data and restart
   ```

### Build Errors

If you encounter build errors:

```bash
# Reinstall dependencies
cd /path/to/Focus-GTD
rm -rf node_modules apps/mobile/node_modules
bun install
```

## Testing

The app can be tested using:

1. **Expo Go** - Quick testing on physical devices
2. **Android Emulator** - Full Android environment
3. **iOS Simulator** - Full iOS environment (macOS only)

## Next Steps

Potential enhancements:

- [ ] Add Contexts view (filter by @context tags)
- [ ] Add Calendar view (show tasks by date)
- [ ] Add Waiting/Someday tabs
- [ ] Implement task detail modal
- [ ] Add drag-and-drop for task reordering
- [ ] Add pull-to-refresh
- [ ] Implement search functionality
- [ ] Add dark mode support (UI already set up)
- [ ] Add task editing capabilities
- [ ] Sync between mobile and desktop (future)

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Bun Documentation](https://bun.sh/docs)
