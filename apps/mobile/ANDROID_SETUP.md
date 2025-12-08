# Android Development Setup (Linux)

## Install Android Studio

1. **Download Android Studio:**
   ```bash
   # Visit: https://developer.android.com/studio
   # Or use snap:
   sudo snap install android-studio --classic
   ```

2. **Install Android SDK:**
   - Open Android Studio
   - Go to: Tools → SDK Manager
   - Install:
     - Android SDK Platform (latest)
     - Android SDK Build-Tools
     - Android Emulator
     - Intel x86 Emulator Accelerator (if using Intel CPU)

3. **Set Environment Variables:**

   Add to `~/.bashrc` or `~/.zshrc`:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```

   Then reload:
   ```bash
   source ~/.bashrc  # or ~/.zshrc
   ```

4. **Create Virtual Device:**
   - Open Android Studio
   - Tools → Device Manager
   - Create Device → Pick a phone (e.g., Pixel 6)
   - Select system image (e.g., Android 13/Tiramisu)
   - Finish

5. **Test:**
   ```bash
   # Verify adb is accessible
   adb devices

   # Start emulator
   emulator -list-avds
   emulator @<avd-name>

   # Then run app
   bun mobile:android
   ```

## Quick Alternative: Use Physical Device

Much simpler - just install Expo Go app and scan QR code!
