# Contributing to DeskDangle

Thank you for your interest in contributing to **DeskDangle**! We welcome bug reports, feature suggestions, documentation improvements, and code contributions.

---

## 🧭 Code of Conduct

This project is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## 🛠️ Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20 LTS or higher recommended)
- [npm](https://www.npmjs.com/) (version 10 or higher)
- macOS 12+ or Windows 10/11

### Getting Started

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/heyriyaz/DeskDangle.git
   cd DeskDangle
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   This compiles the Electron main/preload processes and starts the Vite hot-reloading renderer.

4. **Run the automated test suite:**
   ```bash
   npm test
   ```

---

## 🏗️ Project Architecture

DeskDangle is organized into clean, modular layers:

- **`electron/`**: Electron main process, multi-display management, click-through window shape calculation, and tray menu integration.
- **`src/physics/`**: Rigid-body physics powered by Matter.js:
  - `PhysicsWorld.ts`: Simulation loop, mouse interaction, anchor sliding, settlement sleep detection.
  - `RopePhysics.ts`: Verlet constraint rope cord simulation.
  - `CharmPhysics.ts`: Inertia, bounce, rotational angular velocity, and drag mechanics.
- **`src/charms/`**: Built-in charm registry, vector charms, and custom user charm processing.
- **`src/components/`**: React UI components, settings window, quick drawer, and HTML5 Canvas overlay.
- **`src/audio/`**: Procedural sound synthesis using the Web Audio API.
- **`tests/`**: Unit tests verifying physics constraints, settlement states, and hitboxes.

---

## 🧪 Testing Guidelines

Before submitting a pull request, ensure all tests pass and there are no TypeScript compile errors:

```bash
# Run Vitest test suite
npm test

# Type-check TypeScript codebase
npx tsc --noEmit
```

When adding new physics features or charm types, please add corresponding unit tests in [`tests/`](tests/).

---

## 🔀 Submitting Pull Requests

1. **Create a topic branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Keep commits focused and semantic:**
   - `feat:` new feature or capability
   - `fix:` bug fix
   - `docs:` documentation improvements
   - `perf:` performance improvements
   - `refactor:` code refactoring with no behavior change
3. **Push to your fork and submit a PR:**
   - Provide a clear summary of your changes and why they are needed.
   - Reference any related issues (`Fixes #123`).

---

## 💬 Getting Help

If you have questions or ideas, feel free to open a [GitHub Discussion](https://github.com/heyriyaz/DeskDangle/discussions) or submit an issue!
