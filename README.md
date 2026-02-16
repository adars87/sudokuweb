# 🧩 Sudoku Solver — Heatmap Edition

An interactive, browser-based Sudoku puzzle solver with **heatmap-style cell coloring** and **customizable color palettes**.

![Screenshot](https://img.shields.io/badge/Status-Live-brightgreen)

## ✨ Features

- **Interactive 9×9 Grid** — Click and type numbers (1–9), navigate with arrow keys
- **Backtracking Solver** — Fills remaining cells automatically
- **Heatmap Visualization** — Cell background colors reflect the digit value (1–9), like a heat map
- **6 Color Palettes** — Inferno 🔥, Ocean 🌊, Forest 🌲, Sunset 🌅, Mono ⬛, Thermal 🌡️
- **Validation & Confirmation** — Detects duplicate values and warns before solving
- **Sample Puzzle** — Quickly load a classic puzzle to try it out
- **Responsive Design** — Works on desktop and mobile

## 🚀 Getting Started

No build tools required! Just open the file in a browser:

```
index.html
```

Or host it on GitHub Pages for a live URL.

## 📁 Project Structure

```
sudoku-app/
├── index.html   # Main HTML page
├── style.css    # Styling (dark theme, animations, responsive)
├── logic.js     # Sudoku validation & backtracking solver
├── main.js      # UI controller, heatmap colors, palette picker
└── README.md    # This file
```

## 🎨 Color Palettes

| Palette   | Range                       |
|-----------|-----------------------------|
| Inferno   | Purple → Orange → Yellow    |
| Ocean     | Deep Blue → Cyan → Mint     |
| Forest    | Dark Green → Light Green    |
| Sunset    | Violet → Pink → Gold        |
| Mono      | Dark Gray → Light Gray      |
| Thermal   | Blue → Green → Red          |

## 🧠 How It Works

1. Enter numbers in any cells
2. Pick a color palette to customize the heatmap
3. Click **Solve** — the solver fills in the rest
4. If conflicts are detected, a confirmation dialog appears

## 📄 License

MIT
