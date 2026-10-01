# DeskDangle 🪀

[![Download for Windows](https://img.shields.io/badge/Download-Windows%20Setup%20(.exe)-0078D4?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/heyriyaz/DeskDangle/releases/download/v2.0.0/DeskDangle-Setup-2.0.0.exe)
[![Download for macOS DMG](https://img.shields.io/badge/Download-macOS%20(.dmg)-000000?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/heyriyaz/DeskDangle/releases/download/v2.0.0/DeskDangle-2.0.0-Mac.dmg)
[![Version](https://img.shields.io/badge/Release-v2.0.0-brightgreen?style=for-the-badge)](https://github.com/heyriyaz/DeskDangle/releases/tag/v2.0.0)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Tiny charms. A little life on your desktop.**

DeskDangle is a lightweight, interactive desktop companion and physical charm overlay for **macOS** and **Windows (10/11)**. Photorealistic charms hang from the top edge of your screen, reacting naturally with buttery-smooth 60 FPS Matter.js physics, mouse velocity, sound effects, and interactive delight particles.

---

## 🚀 What's New in Version 2.0.0

- 🍏 **Full macOS Platform Support**: Native support for macOS (Apple Silicon M-series & Intel) alongside Windows 10/11.
- 🦸 **11 Brand New Charms & Heroes**:
  - **Marvel Heroes**: Spider-Man, Deadpool, Wolverine, Captain America, Iron Hero, Baby Groot.
  - **DC Heroes & Villains**: Batman, The Joker.
  - **Cute Buddies**: Chill Capybara, Shiba Inu, Baby Panda.
  - **Studio Talismans**: Photorealistic studio Indian Nimbu Mirchi & Turkish Evil Eye talismans.
- 🧷 **Physical Jump Ring Fixture for Custom Uploads**: Upload any custom picture or sticker — DeskDangle automatically fixtures a physical brass eyelet and centered anchor loop to ensure stable, realistic pendular swings without wobble or ghosting.
- 🎛️ **Physics Presets**: Switch between **Classic**, **Bouncy**, **Heavy**, and **Space (Zero-G)** presets in real-time.
- 💨 **Aerodynamic Air Displacement**: Charms gently deflect and swing when your mouse cursor sweeps swiftly past them.
- ✨ **Interactive Delight Particles**: Shimmering particle bursts emit on fast swings, clicks, and edges.
- 🔊 **Procedural Audio FX**: Authentic chain clinks, wooden bumps, and chime tones synthesized with the Web Audio API.
- 💻 **MacBook Notch Snap Alignment**: Automatically senses the MacBook camera notch and centers the anchor point underneath it.
- 💤 **Ultra-Low Idle Power**: Intelligent settled-state detection drops CPU utilization to virtually 0% when charms come to rest.

---

## 📥 Quick Download & Install

### Windows 10 / 11
1. Download **[DeskDangle-Setup-2.0.0.exe](https://github.com/heyriyaz/DeskDangle/releases/download/v2.0.0/DeskDangle-Setup-2.0.0.exe)**.
2. Run the installer to launch DeskDangle.
   *(If Windows SmartScreen prompts on first run, click **More info** ➔ **Run anyway**).*
3. Right-click the charm to open the quick menu or click and drag to swing!

### macOS (Apple Silicon & Intel)
1. Download **[DeskDangle-2.0.0-Mac.dmg](https://github.com/heyriyaz/DeskDangle/releases/download/v2.0.0/DeskDangle-2.0.0-Mac.dmg)** or **[DeskDangle-2.0.0-Mac.zip](https://github.com/heyriyaz/DeskDangle/releases/download/v2.0.0/DeskDangle-2.0.0-Mac.zip)**.
2. Open the DMG and drag **DeskDangle.app** into your `/Applications` folder.
3. Launch DeskDangle and enjoy your companion hanging from your menu bar or MacBook notch!

---

## ✨ Full Feature Overview

- **🎯 21 Built-in Charms**:
  - *Cats & Pets*: Banana Cat, Chonky Cat, Orange Cat, Fluffy Kitten, Shiba Inu, Baby Panda, Capybara.
  - *Hero Pack*: Spider-Man, Batman, Deadpool, Wolverine, Captain America, Iron Hero, Joker, Baby Groot.
  - *Aesthetic & Talismans*: Nimbu Mirchi, Nazar Evil Eye, Hamsa Hand, Ruby Cherries, Glass Heart, Pink Cassette.
- **🖼️ Custom Charm Studio**: Drag and drop any transparent PNG, JPG, WebP, or SVG. Choose framing styles (Natural Cutout, Acrylic Charm, Floating Medallion).
- **🧵 Cord & Rope Physics**: Braided rope, Classic nylon cord, Thread, Gold jewelry chain, or Glowing neon with adjustable length, thickness, and stiffness.
- **⚡ 60 FPS Physics Engine**: Powered by Matter.js with throw momentum, gravity, air resistance, and multi-monitor edge boundaries.
- **🪟 Transparent Desktop Overlay**: Frameless and click-through outside the interactive charm hitbox, so it never interrupts your work.
- **🖥️ Multi-Monitor & Mixed DPI**: Automatically adapts across multi-display setups, Retina scaling, and 4K monitors.
- **🔒 100% Private & Offline**: Zero analytics, zero tracking, and zero internet connection required.

---

## ⌨️ Global Shortcuts (Configurable)

Global hotkeys can be toggled on or off in **Settings > Behavior**:

| macOS Shortcut | Windows Shortcut | Action |
| :--- | :--- | :--- |
| `Option + Shift + D` | `Alt + Shift + D` | Show / Hide DeskDangle |
| `Option + Shift + P` | `Alt + Shift + P` | Pause / Resume Physics |
| `Option + Shift + R` | `Alt + Shift + R` | Switch to Random Charm |
| `Option + Shift + S` | `Alt + Shift + S` | Open Settings Window |

---

## 🛠️ Development & Building

### Prerequisites
- Node.js 20+
- macOS 12+ or Windows 10/11

### Setup
```bash
# Clone the repository
git clone https://github.com/heyriyaz/DeskDangle.git
cd DeskDangle

# Install dependencies
npm install

# Start development overlay
npm run dev

# Run unit tests
npm test
```

### Packaging Binaries
```bash
# Package Windows Installer (.exe)
npm run package:win

# Package macOS App, DMG & Zip
npm run package:mac
```

---

## 📄 License & Credits
- **Created with ❤️ by**: **Riyaz** ([@heyriyaz](https://github.com/heyriyaz))
- **License**: [MIT License](LICENSE)

Copyright © 2026 DeskDangle. All rights reserved.
