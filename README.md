# DeskDangle 🪀

[![Download DeskDangle for Windows](https://img.shields.io/badge/Download-DeskDangle%20v1.0.1%20(Windows%20.zip)-0078D4?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/heyriyaz/DeskDangle/releases/download/v1.0.1/DeskDangle-v1.0.1-Windows.zip)
[![Version](https://img.shields.io/badge/Release-v1.0.1-brightgreen?style=for-the-badge)](https://github.com/heyriyaz/DeskDangle/releases/tag/v1.0.1)

**Tiny charms. A little life on your Windows desktop.**

DeskDangle is a lightweight, interactive desktop companion and physics charm for Windows 10 & 11. Photorealistic charms hang from the top edge of your screen, reacting naturally with buttery smooth Matter.js physics.

---

## 📥 Quick Download & Install (Windows 10 / 11)

1. Download **[DeskDangle-v1.0.1-Windows.zip](https://github.com/heyriyaz/DeskDangle/releases/download/v1.0.1/DeskDangle-v1.0.1-Windows.zip)** from [Releases](https://github.com/heyriyaz/DeskDangle/releases/tag/v1.0.1).
2. Extract the zip and run **DeskDangle-Setup-1.0.1.exe** to install. *(If Windows SmartScreen prompts on first run, click **More info** ➔ **Run anyway**).*
3. Enjoy your desktop charm! Right-click or drag to swing.

---

## ✨ Features

- **🎯 10 Built-in Photorealistic Charms**:
  - 🍌 Banana Cat
  - 🍞 Chonky Loaf Cat
  - 🐱 Orange Cat Face
  - 🐱 Fluffy Kitten
  - 🍒 Ruby Cherries
  - 💖 Pink Glass Heart
  - 📼 Retro Pink Cassette
  - 🧿 Nazar Evil Eye
  - 🪬 Hamsa Hand
  - 🌶️ Nimbu Mirchi
- **🖼️ Custom Charm Studio**: Drag & drop any transparent PNG, JPG, WebP, or SVG to hang your own custom charms or logos with custom framing (Cutout, Acrylic, Medallion).
- **🧵 Cord & Rope Customization**: Braided rope, Classic cord, Thread, Gold chain, or Glowing neon with adjustable length, thickness, and color.
- **⚡ 60 FPS Physics Engine**: Powered by Matter.js with velocity throw momentum, gravity, damping, air resistance, and zero idle CPU usage.
- **🪟 Seamless Desktop Overlay**: Transparent, frameless, and fully click-through so it never interferes with underlying Windows applications.
- **🖥️ Multi-Monitor & High-DPI**: Smoothly handles monitor changes, resolution scaling, and mixed DPI (100% to 200%).
- **🔔 Windows System Tray & Shortcuts**: Single-click settings access, right-click desktop quick menu, and customizable global hotkeys.
- **🔒 100% Private & Offline**: Zero analytics, zero telemetry, and zero network calls. All settings and custom charms remain strictly on your local machine.

---

## ⌨️ Global Shortcuts (Configurable)

Global hotkeys can be toggled on or off in **Settings > Behavior** to prevent shortcut conflicts with other software:

| Shortcut | Action |
| :--- | :--- |
| `Alt + Shift + D` | Show / Hide DeskDangle |
| `Alt + Shift + P` | Pause / Resume Physics |
| `Alt + Shift + R` | Switch to Random Charm |
| `Alt + Shift + S` | Open Settings Window |

---

## 🛠️ Development & Building

### Prerequisites
- Node.js 18+
- Windows 10 / 11

### Install Dependencies
```bash
npm install
```

### Run in Development
```bash
npm run dev
```

### Run Automated Tests
```bash
npm run test
```

### Build Production Bundle
```bash
npm run build
```

### Package Windows Installer (NSIS)
```bash
npm run package:win
```

Output:
```text
release/
└── DeskDangle-Setup-1.0.1.exe
```

---

## 📄 License & Credits
- **Created with ❤️ by**: **Riyaz** ([@heyriyaz](https://github.com/heyriyaz)).
- **Code Signing**: Free code signing provided by the [SignPath Foundation](https://signpath.org).
- **License**: [MIT License](LICENSE).
Copyright © 2026 DeskDangle. All rights reserved.
