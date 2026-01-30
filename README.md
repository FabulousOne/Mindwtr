<div align="center">

<img src="apps/mobile/assets/images/icon.png" width="120" alt="Mindwtr Logo">

# Mindwtr

English | [中文](./README_zh.md)

A complete Getting Things Done (GTD) productivity system for desktop and mobile. *Mind Like Water.*

*New to GTD? Read [GTD in 15 minutes](https://hamberg.no/gtd) for a quick introduction.*

[![CI](https://github.com/dongdongbh/Mindwtr/actions/workflows/ci.yml/badge.svg)](https://github.com/dongdongbh/Mindwtr/actions/workflows/ci.yml)
[![GitHub stars](https://img.shields.io/github/stars/dongdongbh/Mindwtr?style=social)](https://github.com/dongdongbh/Mindwtr/stargazers)
[![GitHub license](https://img.shields.io/github/license/dongdongbh/Mindwtr)](LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/dongdongbh/Mindwtr)](https://github.com/dongdongbh/Mindwtr/commits/main)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dongdongbh/Mindwtr/pulls)
[![Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/dongdongbh)
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D1D01T20WK)


</div>

<div align="center">
  <video src="https://github.com/user-attachments/assets/8b067635-196e-4c9c-ad26-92ca92fef327" width="60%" autoplay loop muted playsinline></video>
  
  <video src="https://github.com/user-attachments/assets/08e4f821-0b1c-44f9-af58-0b727bc2bd91" width="25%" autoplay loop muted playsinline></video>

  <p>
    <i>Local-First GTD on Arch Linux & Android</i>
  </p>
</div>

## Philosophy

Mindwtr is built to be **simple by default and powerful when you need it**. We focus on reducing cognitive load, cutting the fat, and keeping you in flow. That means:

- **Progressive disclosure**: advanced options stay hidden until they matter.
- **Less by default**: fewer fields, fewer knobs, fewer distractions.
- **Avoid feature creep**: we prioritize clarity over clutter.

*Don't show me a cockpit when I just want to ride a bike.*

## Features

Most-loved highlights:
- 🎙️ **Voice input** (capture + transcription)
- 🔄 **Sync** across platforms (File, WebDAV, Cloud, Local API)
- 📎 **Attachments** (files + links)
- 🧭 **Copilot Suggestions** (optional, BYOK AI)
- 🗓️ **External Calendars (ICS)**
- ✅ **Full GTD workflow** with inbox processing + reviews

Full feature list:
- 📚 https://github.com/dongdongbh/Mindwtr/wiki

## Installation

### Desktop (Linux)

**Arch Linux (AUR):**
<a href="https://aur.archlinux.org/packages/mindwtr-bin">
  <img src="https://img.shields.io/aur/version/mindwtr-bin?logo=arch-linux&logoColor=white&color=1793d1&label=AUR" alt="AUR Version">
</a>

```bash
# Using yay
yay -S mindwtr-bin

# Using paru
paru -S mindwtr-bin
```

**Debian / Ubuntu (APT repo, recommended):**
```bash
curl -fsSL https://dongdongbh.github.io/Mindwtr/mindwtr.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/mindwtr-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/mindwtr-archive-keyring.gpg] https://dongdongbh.github.io/Mindwtr/deb ./" | sudo tee /etc/apt/sources.list.d/mindwtr.list
sudo apt update
sudo apt install mindwtr
```

**Fedora / RHEL / openSUSE (DNF/YUM repo, recommended):**
```bash
cat <<'EOF' | sudo tee /etc/yum.repos.d/mindwtr.repo
[mindwtr]
name=Mindwtr Repository
baseurl=https://dongdongbh.github.io/Mindwtr/rpm
enabled=1
gpgcheck=0
EOF

sudo dnf install mindwtr
```

**Snapcraft:**
<a href="https://snapcraft.io/mindwtr">
  <img src="https://img.shields.io/badge/Snapcraft-Install-82BEA0?logo=snapcraft&logoColor=white" alt="Snapcraft">
</a>
```bash
sudo snap install mindwtr
```

**Other methods:** AppImage or `.deb`/`.rpm` from [GitHub Releases](https://github.com/dongdongbh/Mindwtr/releases).

### Desktop (Windows)

**Microsoft Store (recommended):**
<a href="https://apps.microsoft.com/detail/9n0v5b0b6frx?ocid=webpdpshare">
  <img src="https://img.shields.io/badge/Microsoft_Store-Install-0078D6?logo=microsoft&logoColor=white" alt="Microsoft Store">
</a>

**Winget:**
<a href="https://winstall.app/apps/dongdongbh.Mindwtr">
  <img src="https://img.shields.io/winget/v/dongdongbh.Mindwtr?label=Winget&logo=windows&logoColor=white&color=00D2FF" alt="Winget Version">
</a>
```powershell
winget install dongdongbh.Mindwtr
```

**Scoop:**
<a href="https://github.com/dongdongbh/homebrew-mindwtr">
  <img src="https://img.shields.io/scoop/v/mindwtr?bucket=https://github.com/dongdongbh/homebrew-mindwtr&label=Scoop&logo=scoop&logoColor=white&color=E6E6E6" alt="Scoop Version">
</a>
```powershell
scoop bucket add mindwtr https://github.com/dongdongbh/homebrew-mindwtr
scoop install mindwtr
```

**Other methods:** `.msi` / `.exe` from [GitHub Releases](https://github.com/dongdongbh/Mindwtr/releases).

### Desktop (macOS)

**Homebrew (recommended):**
<a href="https://github.com/dongdongbh/homebrew-mindwtr">
  <img src="https://img.shields.io/badge/Homebrew-Install-orange?logo=homebrew&logoColor=white" alt="Homebrew">
</a>
```bash
brew tap dongdongbh/mindwtr
brew install --cask mindwtr
```

**Other methods:** `.dmg` from [GitHub Releases](https://github.com/dongdongbh/Mindwtr/releases).

> **Note:** If macOS says the app is "damaged" or from an "unidentified developer", run:
> ```bash
> xattr -cr /Applications/Mindwtr.app
> ```
> Then open the app normally. This is required because the app is not notarized with Apple.

### Mobile

**Android:**
<a href="https://play.google.com/store/apps/details?id=tech.dongdongbh.mindwtr">
  <img src="https://img.shields.io/badge/Google_Play-Install-414141?logo=googleplay&logoColor=white" alt="Get it on Google Play">
</a>

Other methods: APK from [GitHub Releases](https://github.com/dongdongbh/Mindwtr/releases).

**iOS:** iOS builds require an Apple Developer account ($99/year). Currently available as simulator builds only.

### Docker (PWA + Cloud Sync)

Run the web app (PWA) and the self-hosted sync server with Docker:
- Guide: [`docker/README.md`](docker/README.md)

Install guides:
- 🚀 [Getting Started](https://github.com/dongdongbh/Mindwtr/wiki/Getting-Started)
- 📚 [All platforms & package managers](https://github.com/dongdongbh/Mindwtr/wiki)

## Documentation

- 📚 [Wiki](https://github.com/dongdongbh/Mindwtr/wiki) - Complete user guide
- 🚀 [Getting Started](https://github.com/dongdongbh/Mindwtr/wiki/Getting-Started)
- ❓ [FAQ](https://github.com/dongdongbh/Mindwtr/wiki/FAQ)
- 🔄 [Data & Sync](https://github.com/dongdongbh/Mindwtr/wiki/Data-and-Sync)
