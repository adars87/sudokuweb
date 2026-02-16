/* ========================================================
   Sudoku Solver — Main Controller  |  main.js
   UI rendering, event handling, heatmap color palettes
   ======================================================== */

// ─── Color Palettes ─────────────────────────────────────
// Each palette maps values 0–9 to a background color.
// Index 0 = empty cell, 1–9 = digit colors.
const COLOR_PALETTES = {
    inferno: {
        label: 'Inferno',
        colors: [
            '#1c1c36',   // 0 – empty
            '#1b0c3a',   // 1
            '#3d0f6e',   // 2
            '#6a1b9a',   // 3
            '#9c27b0',   // 4
            '#d84315',   // 5
            '#ef6c00',   // 6
            '#f9a825',   // 7
            '#fdd835',   // 8
            '#ffff8d',   // 9
        ],
    },
    ocean: {
        label: 'Ocean',
        colors: [
            '#1c1c36',
            '#0d1b3e',
            '#0d2b5e',
            '#0d3b7e',
            '#0d5ba0',
            '#0e7cc2',
            '#16a0d0',
            '#30c9d0',
            '#6ee7d0',
            '#a8ffd6',
        ],
    },
    forest: {
        label: 'Forest',
        colors: [
            '#1c1c36',
            '#0a1f0a',
            '#143314',
            '#1d4d1d',
            '#276727',
            '#2e8b2e',
            '#52b152',
            '#7dd87d',
            '#a8e8a8',
            '#d4ffd4',
        ],
    },
    sunset: {
        label: 'Sunset',
        colors: [
            '#1c1c36',
            '#1a0a2e',
            '#331155',
            '#5c1a6e',
            '#8b2380',
            '#b83280',
            '#e84393',
            '#fd79a8',
            '#fab1a0',
            '#ffeaa7',
        ],
    },
    monochrome: {
        label: 'Mono',
        colors: [
            '#1c1c36',
            '#1e1e2e',
            '#2d2d42',
            '#3c3c56',
            '#4d4d6a',
            '#5e5e7e',
            '#747494',
            '#8e8eaa',
            '#abaac2',
            '#d0d0e0',
        ],
    },
    heat: {
        label: 'Thermal',
        colors: [
            '#1c1c36',
            '#000044',
            '#0000aa',
            '#0044ff',
            '#00aaff',
            '#00ff88',
            '#aaff00',
            '#ffcc00',
            '#ff6600',
            '#ff0000',
        ],
    },
};

let activePalette = 'inferno';

// ─── DOM ─────────────────────────────────────────────────
const boardEl = document.getElementById('sudoku-board');
const statusBar = document.getElementById('status-bar');
const modalOverlay = document.getElementById('modal-overlay');
const modalMessage = document.getElementById('modal-message');
const modalProceed = document.getElementById('modal-proceed');
const modalCancel = document.getElementById('modal-cancel');
const btnSolve = document.getElementById('btn-solve');
const btnClear = document.getElementById('btn-clear');
const btnSample = document.getElementById('btn-sample');
const paletteContainer = document.getElementById('palette-options');
const legendContainer = document.getElementById('heatmap-legend');

// Track which cells were user-inputted vs solved
let userCells = Array.from({ length: 9 }, () => Array(9).fill(false));

// ─── Build Board ─────────────────────────────────────────
function buildBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.inputMode = 'numeric';
            input.maxLength = 1;
            input.className = 'sudoku-cell';
            input.id = `cell-${r}-${c}`;
            input.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}`);

            // Subgrid borders
            if (c === 2 || c === 5) input.classList.add('border-right-thick');
            if (r === 2 || r === 5) input.classList.add('border-bottom-thick');

            // Input handler — only allow 1-9
            input.addEventListener('input', (e) => {
                const val = e.target.value.replace(/[^1-9]/g, '');
                e.target.value = val;
                userCells[r][c] = val !== '';
                if (val !== '') {
                    e.target.classList.add('user-input');
                    e.target.classList.remove('solved');
                } else {
                    e.target.classList.remove('user-input');
                }
                applyHeatmapColors();
                clearStatus();
            });

            // Arrow-key navigation
            input.addEventListener('keydown', (e) => handleNavigation(e, r, c));

            boardEl.appendChild(input);
        }
    }
}

// ─── Navigation ──────────────────────────────────────────
function handleNavigation(e, row, col) {
    let nr = row, nc = col;
    switch (e.key) {
        case 'ArrowUp': nr = Math.max(0, row - 1); break;
        case 'ArrowDown': nr = Math.min(8, row + 1); break;
        case 'ArrowLeft': nc = Math.max(0, col - 1); break;
        case 'ArrowRight': nc = Math.min(8, col + 1); break;
        case 'Backspace':
        case 'Delete':
            e.target.value = '';
            userCells[row][col] = false;
            e.target.classList.remove('user-input', 'solved', 'error');
            applyHeatmapColors();
            clearStatus();
            return;
        default: return;
    }
    e.preventDefault();
    const target = document.getElementById(`cell-${nr}-${nc}`);
    if (target) target.focus();
}

// ─── Board → Array ───────────────────────────────────────
function readBoard() {
    const board = [];
    for (let r = 0; r < 9; r++) {
        const row = [];
        for (let c = 0; c < 9; c++) {
            const val = document.getElementById(`cell-${r}-${c}`).value;
            row.push(val ? parseInt(val, 10) : 0);
        }
        board.push(row);
    }
    return board;
}

// ─── Array → Board ───────────────────────────────────────
function writeBoard(board, animateSolved = false) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            const val = board[r][c];
            cell.value = val === 0 ? '' : val.toString();
            cell.classList.remove('error');

            if (val !== 0 && !userCells[r][c]) {
                cell.classList.remove('user-input');
                if (animateSolved) {
                    cell.classList.add('solved');
                    // Stagger animation
                    cell.style.animationDelay = `${(r * 9 + c) * 20}ms`;
                }
            }
        }
    }
    applyHeatmapColors();
}

// ─── Heatmap Colors ──────────────────────────────────────
function getColor(value) {
    const palette = COLOR_PALETTES[activePalette];
    return palette.colors[value] || palette.colors[0];
}

function getTextColor(bgHex) {
    // Simple luminance check for contrast
    const hex = bgHex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.55 ? '#111122' : '#e8e8f0';
}

function applyHeatmapColors() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            const val = cell.value ? parseInt(cell.value, 10) : 0;
            const bg = getColor(val);
            cell.style.backgroundColor = bg;
            cell.style.color = getTextColor(bg);
        }
    }
}

// ─── Legend ──────────────────────────────────────────────
function buildLegend() {
    legendContainer.innerHTML = '';
    const palette = COLOR_PALETTES[activePalette];
    for (let i = 0; i <= 9; i++) {
        const item = document.createElement('div');
        item.className = 'legend-item';

        const color = document.createElement('div');
        color.className = 'legend-color';
        color.style.backgroundColor = palette.colors[i];

        const label = document.createElement('div');
        label.className = 'legend-label';
        label.textContent = i === 0 ? '∅' : i;

        item.appendChild(color);
        item.appendChild(label);
        legendContainer.appendChild(item);
    }
}

// ─── Palette Picker ─────────────────────────────────────
function buildPalettePicker() {
    paletteContainer.innerHTML = '';
    for (const [key, palette] of Object.entries(COLOR_PALETTES)) {
        const btn = document.createElement('button');
        btn.className = 'palette-btn' + (key === activePalette ? ' active' : '');
        btn.id = `palette-${key}`;

        // Mini swatch
        const swatch = document.createElement('span');
        swatch.className = 'palette-swatch';
        const indices = [2, 4, 6, 8]; // sample colors from the palette
        for (const idx of indices) {
            const dot = document.createElement('span');
            dot.style.backgroundColor = palette.colors[idx];
            swatch.appendChild(dot);
        }

        const label = document.createElement('span');
        label.textContent = palette.label;

        btn.appendChild(swatch);
        btn.appendChild(label);

        btn.addEventListener('click', () => {
            activePalette = key;
            document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyHeatmapColors();
            buildLegend();
        });

        paletteContainer.appendChild(btn);
    }
}

// ─── Status ──────────────────────────────────────────────
function setStatus(msg, type = '') {
    statusBar.textContent = msg;
    statusBar.className = 'status-bar' + (type ? ` ${type}` : '');
}

function clearStatus() {
    statusBar.textContent = '';
    statusBar.className = 'status-bar';
}

// ─── Highlight Errors ────────────────────────────────────
function highlightErrors(conflicts) {
    // Clear previous
    document.querySelectorAll('.sudoku-cell.error').forEach(el => el.classList.remove('error'));
    for (const { row, col } of conflicts) {
        document.getElementById(`cell-${row}-${col}`).classList.add('error');
    }
}

// ─── Solve Flow ──────────────────────────────────────────
function attemptSolve(force = false) {
    const board = readBoard();
    const conflicts = validateBoard(board);

    if (conflicts.length > 0 && !force) {
        highlightErrors(conflicts);
        modalMessage.textContent =
            `Found ${conflicts.length} conflicting cell(s). The current board has duplicates in a row, column, or box. Do you still want to attempt solving?`;
        modalOverlay.classList.remove('hidden');
        setStatus(`${conflicts.length} conflict(s) detected`, 'warning');
        return;
    }

    // Clear errors
    highlightErrors([]);

    const clone = cloneBoard(board);
    const solved = solveBoard(clone);

    if (solved) {
        writeBoard(clone, true);
        setStatus('✅ Puzzle solved!', 'success');
    } else {
        setStatus('❌ No solution exists for this configuration.', 'error');
    }
}

// ─── Clear Board ─────────────────────────────────────────
function clearBoard() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.value = '';
            cell.classList.remove('user-input', 'solved', 'error');
            cell.style.animationDelay = '';
            userCells[r][c] = false;
        }
    }
    applyHeatmapColors();
    clearStatus();
}

// ─── Sample Puzzle ───────────────────────────────────────
function loadSample() {
    clearBoard();
    const sample = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (sample[r][c] !== 0) {
                const cell = document.getElementById(`cell-${r}-${c}`);
                cell.value = sample[r][c];
                cell.classList.add('user-input');
                userCells[r][c] = true;
            }
        }
    }
    applyHeatmapColors();
    setStatus('Sample puzzle loaded. Hit Solve!', '');
}

// ─── Event Listeners ─────────────────────────────────────
btnSolve.addEventListener('click', () => attemptSolve(false));

btnClear.addEventListener('click', clearBoard);

btnSample.addEventListener('click', loadSample);

modalProceed.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    attemptSolve(true);
});

modalCancel.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    setStatus('Solve cancelled. Fix the highlighted cells.', 'warning');
});

// Close modal on overlay click
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
        setStatus('Solve cancelled.', 'warning');
    }
});

// ─── Init ────────────────────────────────────────────────
buildBoard();
buildPalettePicker();
buildLegend();
applyHeatmapColors();
