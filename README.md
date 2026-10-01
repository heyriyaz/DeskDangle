<div align="center">

<img src="build/icon.png" alt="DeskDangle Logo" width="96" height="96" style="border-radius: 20px;" />

# DeskDangle

**A playful, high-performance desktop companion & interactive physics charm for macOS and Windows.**

[![CI](https://github.com/heyriyaz/DeskDangle/actions/workflows/ci.yml/badge.svg)](https://github.com/heyriyaz/DeskDangle/actions/workflows/ci.yml)
[![GitHub Release](https://img.shields.io/github/v/release/heyriyaz/DeskDangle?style=flat-square&color=ff6600)](https://github.com/heyriyaz/DeskDangle/releases/latest)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%2010%2B-555555?style=flat-square&logo=apple&logoColor=white)](https://github.com/heyriyaz/DeskDangle/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

<p align="center">
  <a href="https://github.com/heyriyaz/DeskDangle/releases/download/v2.0.0/DeskDangle-Setup-2.0.0.exe">
    <img src="https://img.shields.io/badge/Download_for_Windows-Setup_(.exe)-0078D4?style=for-the-badge&logo=windows&logoColor=white" alt="Download for Windows" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/heyriyaz/DeskDangle/releases/download/v2.0.0/DeskDangle-2.0.0-Mac.dmg">
    <img src="https://img.shields.io/badge/Download_for_macOS-DMG_(Universal)-000000?style=for-the-badge&logo=apple&logoColor=white" alt="Download for macOS" />
  </a>
</p>

</div>

---

## 💡 Overview

**DeskDangle** hangs charming, physics-driven companions right from the top edge of your screen or MacBook camera notch. Drag, flick, swing, or gently deflect them with your cursor. 

Built with **Matter.js** rigid-body dynamics and hardware-accelerated **HTML5 Canvas**, DeskDangle delivers 60 FPS simulations while keeping background clicks 100% functional.

### 🌟 Key Highlights

- **🎯 21 Photorealistic Charms**: Marvel heroes, DC legends, cute pets, and aesthetic cultural talismans.
- **🪟 Non-Intrusive Click-Through**: Full click-through underneath the cord; only the charm and anchor capture clicks. Your browser tabs, bookmarks, and windows are never blocked.
- **🧷 Custom Charm Jump Ring**: Drop in any custom PNG/sticker; DeskDangle fixtures a realistic brass eyelet and centered anchor loop for natural swinging.
- **⚡ Zero-Idle Battery Efficiency**: Adaptive physics suspension automatically drops CPU usage to <0.1% when settled.
- **💻 Cross-Platform & Notch-Aware**: Native support for Windows 10/11 and macOS (Apple Silicon M-Series & Intel), with automatic notch centering.

---

## 🎨 Built-in Charm Collection

<table>
  <tr>
    <td align="center" width="16.6%"><img src="src/assets/charms/spiderman.png" width="60"/><br /><b>Spider-Man</b></td>
    <td align="center" width="16.6%"><img src="src/assets/charms/batman.png" width="60"/><br /><b>Batman</b></td>
    <td align="center" width="16.6%"><img src="src/assets/charms/deadpool.png" width="60"/><br /><b>Deadpool</b></td>
    <td align="center" width="16.6%"><img src="src/assets/charms/wolverine.png" width="60"/><br /><b>Wolverine</b></td>
    <td align="center" width="16.6%"><img src="src/assets/charms/captain-america.png" width="60"/><br /><b>Captain America</b></td>
    <td align="center" width="16.6%"><img src="src/assets/charms/iron-hero.png" width="60"/><br /><b>Iron Hero</b></td>
  </tr>
  <tr>
    <td align="center"><img src="src/assets/charms/capybara.png" width="60"/><br /><b>Capybara</b></td>
    <td align="center"><img src="src/assets/charms/shiba-inu.png" width="60"/><br /><b>Shiba Inu</b></td>
    <td align="center"><img src="src/assets/charms/baby-panda.png" width="60"/><br /><b>Baby Panda</b></td>
    <td align="center"><img src="src/assets/charms/banana-cat.png" width="60"/><br /><b>Banana Cat</b></td>
    <td align="center"><img src="src/assets/charms/chonky-cat.png" width="60"/><br /><b>Chonky Cat</b></td>
    <td align="center"><img src="src/assets/charms/fluffy-kitten.png" width="60"/><br /><b>Fluffy Kitten</b></td>
  </tr>
  <tr>
    <td align="center"><img src="src/assets/charms/evil-eye.png" width="60"/><br /><b>Nazar Evil Eye</b></td>
    <td align="center"><img src="src/assets/charms/nimbu-mirchi.png" width="60"/><br /><b>Nimbu Mirchi</b></td>
    <td align="center"><img src="src/assets/charms/hamsa-hand.png" width="60"/><br /><b>Hamsa Hand</b></td>
    <td align="center"><img src="src/assets/charms/pink-cassette.png" width="60"/><br /><b>Pink Cassette</b></td>
    <td align="center"><img src="src/assets/charms/glass-heart.png" width="60"/><br /><b>Glass Heart</b></td>
    <td align="center"><img src="src/assets/charms/cherry.png" width="60"/><br /><b>Ruby Cherries</b></td>
  </tr>
</table>

---

## 🛠️ Architecture & Under the Hood

DeskDangle is engineered with clean separation of concerns, secure IPC boundaries, and high-performance physics:

```mermaid
graph TD
    A[Electron Main Process] -->|Display Bounds & Multi-Screen| B[Frameless Transparent Overlay Window]
    B -->|Click-Through Masking| C[OS Window Manager]
    B -->|ContextIsolation IPC Bridge| D[React UI Layer]
    D --> E[PhysicsWorld Matter.js Engine]
    E -->|Verlet Constraints| F[Rope Simulation]
    E -->|Angular Momentum & Damping| G[Rigid Body Charm]
    E -->|Interactive Zones| H[HTML5 Canvas Renderer @ 60 FPS]
    E -->|Velocity Triggers| I[Web Audio Procedural FX]
    D -->|Local Persistence| J[Offline Settings Store]
```

### Technical Highlights
- **Context Isolation & Security**: `nodeIntegration: false`, `contextIsolation: true`, with tightly-typed IPC channels in `preload.ts`.
- **Compound Hit-Testing**: Instead of a full-screen mouse capture, DeskDangle calculates dynamic bounding rects for the anchor pin (`40x16px`) and the charm body, calling `setIgnoreMouseEvents(true, { forward: true })` outside these zones.
- **Procedural Audio**: Real-time physical clinks, bumps, and chimes generated dynamically with the Web Audio API (zero audio asset bloat).
- **100% Offline & Private**: Zero external network requests, zero telemetry, zero analytics.

---

## ⌨️ Global Shortcuts

Configurable in **Settings > Behavior**:

| macOS Shortcut | Windows Shortcut | Action |
| :--- | :--- | :--- |
| `Option + Shift + D` | `Alt + Shift + D` | Toggle Visibility (Show / Hide) |
| `Option + Shift + P` | `Alt + Shift + P` | Pause / Resume Physics |
| `Option + Shift + R` | `Alt + Shift + R` | Switch to Random Charm |
| `Option + Shift + S` | `Alt + Shift + S` | Open Settings Window |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on setting up the development environment, running tests, and submitting pull requests.

We are committed to providing a welcoming community. Please see our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 🔒 Security

For vulnerability disclosure and security policies, please see [SECURITY.md](SECURITY.md).

---

## 📄 License

Distributed under the [MIT License](LICENSE). Copyright © 2026 **Riyaz**.
