# ⬡ Sudoku Solver — Heatmap Edition

An interactive, browser-based Sudoku puzzle solver with **heatmap-style cell coloring**, **random puzzle generation**, and **customizable color palettes**. Fully responsive — plays beautifully on desktop and mobile.

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Mobile](https://img.shields.io/badge/Mobile-Optimized-blue)
![No Build](https://img.shields.io/badge/Build_Tools-None-orange)

### 🌐 [Play Live → https://adars87.github.io/sudokuweb/](https://adars87.github.io/sudokuweb/)

---

## ✨ Features

### 🧩 Core
- **Interactive 9×9 Grid** — Click and type numbers (1–9), navigate with arrow keys
- **Backtracking Solver** — Fills remaining cells with randomized candidate ordering
- **Heatmap Visualization** — Cell backgrounds reflect digit values (1–9) like a heat map
- **Validation & Conflict Detection** — Detects duplicates and warns before solving

### 🎲 Puzzle Generator
- **Random Puzzle Generation** — Creates valid, solvable puzzles from scratch
- **3 Difficulty Levels** — Easy (~36 clues), Medium (~32 clues), Hard (~27 clues)
- **"Already Solved" Detection** — Recognizes when the board is already complete

### 🎨 Customization
- **4 Color Palettes** — Ocean 🌊, Forest 🌲, Sunset 🌅, Mono ⬛
- **Heatmap Legend** — Visual scale showing the color mapping for digits 1–9
- **Collapsible Settings Panel** — Toggle with the ⬡ hexagon icon

### 📊 Solve Statistics
- **Elapsed Time** — Millisecond-precision solve timing
- **Backtrack Count** — Number of backtracks the solver performed

### 📱 Mobile Optimized
- **Single-screen layout** — Everything visible without scrolling on phones
- **3 responsive breakpoints** — Adapts to tablets (≤560px), small phones (≤400px), and short screens (≤700px height)
- **Collapsible settings** — Auto-collapsed on mobile to save space
- **Touch-friendly controls** — Large tap targets for all buttons

---

## 🚀 Getting Started

No build tools required! Just open the file in a browser:

```bash
# Clone and open
git clone https://github.com/adars87/sudokuweb.git
open sudoku-app/index.html
```

Or visit the [live site](https://adars87.github.io/sudokuweb/) hosted on GitHub Pages.

---

## 📁 Project Structure

```
sudoku-app/
├── index.html       # Main HTML page
├── style.css        # Styling (dark theme, animations, responsive)
├── logic.js         # Sudoku validation, solver & puzzle generator
├── main.js          # UI controller, heatmap colors, palette picker
├── play-sudoku.js   # Playwright automation script (testing)
├── test-mobile.js   # Multi-viewport screenshot testing
└── README.md        # This file
```

---

## 🎨 Color Palettes

| Palette | Range | Preview |
|---------|-------|---------|
| Ocean   | Deep Blue → Cyan → Mint | 🌊 |
| Forest  | Dark Green → Light Green | 🌲 |
| Sunset  | Violet → Pink → Gold | 🌅 |
| Mono    | Dark Gray → Light Gray | ⬛ |

---

## 🧠 How It Works

1. **Generate** a puzzle (choose Easy/Medium/Hard) or enter numbers manually
2. Pick a **color palette** from the Settings panel to customize the heatmap
3. Click **Solve** — the backtracking solver fills in the rest
4. View **stats** — solve time and backtrack count appear below the board
5. If conflicts are detected, a confirmation dialog lets you proceed or cancel

### Algorithm
- **Solver**: Backtracking with randomized candidate ordering (shuffled 1–9 per cell)
- **Generator**: Creates a full valid solution, then removes cells based on difficulty level while ensuring a unique solution

---

## 🛠 Tech Stack

- **HTML5** — Semantic markup with SEO meta tags
- **CSS3** — Dark theme, glassmorphism, micro-animations, CSS Grid
- **Vanilla JavaScript** — No frameworks, no dependencies
- **Google Fonts** — Inter typeface
- **Playwright** — Browser automation for testing (optional dev dependency)

---

## 📱 Responsive Breakpoints

| Viewport | Cell Size | Adjustments |
|----------|-----------|-------------|
| Desktop (>560px) | 54px | Full layout with visible settings |
| Tablet (≤560px) | 38px | Compact UI, auto-collapsed settings |
| Small Phone (≤400px) | 34px | Hidden tagline, rounded buttons |
| Short Screen (≤700px height) | 32px | Ultra-compact, minimal padding |

---

## 📄 License

MIT
