# DeskDangle Marketing Website 🪀

This folder contains the standalone, zero-dependency marketing landing page for **DeskDangle**.

## ✨ Features
- **Interactive In-Browser Physics**: Live Verlet pendulum simulation where visitors can drag and swing charms with their mouse.
- **Dark Glassmorphic Aesthetic**: Deep space obsidian theme with Linear/macOS-inspired glass cards and vibrant mesh gradients.
- **10 Built-in Charms Showcase**: High-res gallery previewing all default charms.
- **Live Physics Playground**: Interactive sliders for gravity, rope segments, ambient breeze, and rope aesthetics (Classic, Braided, Neon, Chain).
- **SEO & Social Ready**: Meta tags, OpenGraph previews, and mobile-responsive layout.
- **Zero Dependencies**: Pure HTML5, Vanilla CSS3, and JavaScript — no build steps or bundlers required.

---

## 🚀 How to Preview Locally

### Option 1: Double-Click
Simply double-click `index.html` in your file explorer to open it in any web browser!

### Option 2: Local HTTP Server (Python / Node / VSCode Live Server)
```bash
# Using Python
cd website
python -m http.server 3000

# Using Node npx
npx serve website
```
Then visit `http://localhost:3000`.

---

## 🌐 How to Deploy for Free

### Option A: GitHub Pages
1. Go to your repository settings on GitHub: **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions** or point to `/docs` (you can copy or symlink `website/` to `docs/`).

### Option B: Vercel / Netlify / Cloudflare Pages
1. Connect your GitHub repository.
2. Set the **Root Directory** to `website`.
3. Leave Build Command and Output Directory blank.
4. Click **Deploy** — your site goes live globally in seconds with free SSL!
