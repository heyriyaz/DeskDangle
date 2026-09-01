# DeskDangle 🪀

**Tiny charms. A little life on your Windows desktop.**

DeskDangle is a lightweight, interactive physics companion for Windows 10 and Windows 11. Cute, photorealistic charms hang from the top edge of your screen, swinging, bouncing, and reacting naturally with smooth Matter.js physics.

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
└── DeskDangle-Setup-1.0.0.exe
```

---

## 📄 License & Credits
Built with ❤️ by **Riyaz** ([@heyriyaz](https://github.com/heyriyaz)).
Copyright © 2026 DeskDangle. All rights reserved.
