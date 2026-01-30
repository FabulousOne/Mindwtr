<div align="center">

<img src="apps/mobile/assets/images/icon.png" width="120" alt="Mindwtr Logo">

# Mindwtr

中文 | [English](./README.md)

完整的 GTD（Getting Things Done）生产力系统，覆盖桌面与移动端。*Mind Like Water.*

*GTD 新手？可阅读 [15 分钟入门 GTD](https://hamberg.no/gtd)。*

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
    <i>Arch Linux 与 Android 上的本地优先 GTD</i>
  </p>
</div>

## 理念

Mindwtr **默认简单，需要时也足够强大**。我们专注于降低认知负担、删繁就简，让你保持顺畅的工作流：

- **渐进式揭示**：高级选项在需要时才出现。
- **默认更少**：更少字段、更少按钮、更少干扰。
- **避免功能膨胀**：保持清爽与克制。

*我只是想骑车，不要给我驾驶舱。*

## 功能

最受欢迎的亮点：
- 🎙️ **语音输入**（收集 + 转写）
- 🔄 **跨平台同步**（文件 / WebDAV / 云 / 本地 API）
- 📎 **附件**（文件 + 链接）
- 🧭 **Copilot 建议**（可选，使用自带密钥的 AI）
- 🗓️ **外部日历（ICS）**
- ✅ **完整 GTD 工作流**（收件箱处理 + 回顾）

完整功能列表：
- 📚 https://github.com/dongdongbh/Mindwtr/wiki

## 安装

### 桌面端（Linux）

**Arch Linux（AUR）：**
<a href="https://aur.archlinux.org/packages/mindwtr-bin">
  <img src="https://img.shields.io/aur/version/mindwtr-bin?logo=arch-linux&logoColor=white&color=1793d1&label=AUR" alt="AUR Version">
</a>

```bash
# 使用 yay
yay -S mindwtr-bin

# 使用 paru
paru -S mindwtr-bin
```

**Debian / Ubuntu（APT 仓库，推荐）：**
```bash
curl -fsSL https://dongdongbh.github.io/Mindwtr/mindwtr.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/mindwtr-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/mindwtr-archive-keyring.gpg] https://dongdongbh.github.io/Mindwtr/deb ./" | sudo tee /etc/apt/sources.list.d/mindwtr.list
sudo apt update
sudo apt install mindwtr
```

**Fedora / RHEL / openSUSE（DNF/YUM 仓库，推荐）：**
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

**Snapcraft：**
<a href="https://snapcraft.io/mindwtr">
  <img src="https://img.shields.io/badge/Snapcraft-Install-82BEA0?logo=snapcraft&logoColor=white" alt="Snapcraft">
</a>
```bash
sudo snap install mindwtr
```

**其他方式：** 从 [GitHub Releases](https://github.com/dongdongbh/Mindwtr/releases) 获取 AppImage 或 `.deb` / `.rpm`。

### 桌面端（Windows）

**Microsoft Store（推荐）：**
<a href="https://apps.microsoft.com/detail/9n0v5b0b6frx?ocid=webpdpshare">
  <img src="https://img.shields.io/badge/Microsoft_Store-Install-0078D6?logo=microsoft&logoColor=white" alt="Microsoft Store">
</a>

**Winget：**
<a href="https://winstall.app/apps/dongdongbh.Mindwtr">
  <img src="https://img.shields.io/winget/v/dongdongbh.Mindwtr?label=Winget&logo=windows&logoColor=white&color=00D2FF" alt="Winget Version">
</a>
```powershell
winget install dongdongbh.Mindwtr
```

**Scoop：**
<a href="https://github.com/dongdongbh/homebrew-mindwtr">
  <img src="https://img.shields.io/scoop/v/mindwtr?bucket=https://github.com/dongdongbh/homebrew-mindwtr&label=Scoop&logo=scoop&logoColor=white&color=E6E6E6" alt="Scoop Version">
</a>
```powershell
scoop bucket add mindwtr https://github.com/dongdongbh/homebrew-mindwtr
scoop install mindwtr
```

**其他方式：** 从 [GitHub Releases](https://github.com/dongdongbh/Mindwtr/releases) 获取 `.msi` / `.exe`。

### 桌面端（macOS）

**Homebrew（推荐）：**
<a href="https://github.com/dongdongbh/homebrew-mindwtr">
  <img src="https://img.shields.io/badge/Homebrew-Install-orange?logo=homebrew&logoColor=white" alt="Homebrew">
</a>
```bash
brew tap dongdongbh/mindwtr
brew install --cask mindwtr
```

**其他方式：** 从 [GitHub Releases](https://github.com/dongdongbh/Mindwtr/releases) 获取 `.dmg`。

> **注意：** 如果 macOS 提示应用“已损坏”或“来自未知开发者”，请执行：
> ```bash
> xattr -cr /Applications/Mindwtr.app
> ```
> 然后正常打开即可。该步骤是因为应用尚未进行苹果公证。

### 移动端

**Android：**
<a href="https://play.google.com/store/apps/details?id=tech.dongdongbh.mindwtr">
  <img src="https://img.shields.io/badge/Google_Play-Install-414141?logo=googleplay&logoColor=white" alt="Get it on Google Play">
</a>

其他方式：从 [GitHub Releases](https://github.com/dongdongbh/Mindwtr/releases) 下载 APK。

**iOS：** iOS 构建需要 Apple Developer 账号（$99/年），目前仅提供模拟器构建。

### Docker（PWA + 云同步）

使用 Docker 运行 Web 应用（PWA）和自托管同步服务：
- 指南：[`docker/README.md`](docker/README.md)

安装指南：
- 🚀 [快速开始](https://github.com/dongdongbh/Mindwtr/wiki/Getting-Started)
- 📚 [全平台与包管理器](https://github.com/dongdongbh/Mindwtr/wiki)

## 文档

- 📚 [Wiki](https://github.com/dongdongbh/Mindwtr/wiki) - 完整用户指南
- 🚀 [快速开始](https://github.com/dongdongbh/Mindwtr/wiki/Getting-Started)
- ❓ [FAQ](https://github.com/dongdongbh/Mindwtr/wiki/FAQ)
- 🔄 [数据与同步](https://github.com/dongdongbh/Mindwtr/wiki/Data-and-Sync)
