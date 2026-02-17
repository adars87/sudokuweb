/* ========================================================
   Sudoku Solver — Logic Module  |  logic.js
   Ported & enhanced from adars87/Sudoku (Java)
   Features:
     - Validation (row, col, box)
     - Backtracking solver with randomized candidate order
     - Random puzzle generator
     - Solve statistics (backtrack count, elapsed time)
     - Fully-solved detection
   ======================================================== */

/**
 * Check if placing `num` at board[row][col] is valid.
 * Mirrors Java's verify(i, j).
 */
function isValidPlacement(board, row, col, num) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) return false;
  }
  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) return false;
  }
  // Check 3x3 box — matches Java's (i/3)*3 approach
  const boxR = Math.floor(row / 3) * 3;
  const boxC = Math.floor(col / 3) * 3;
  for (let r = boxR; r < boxR + 3; r++) {
    for (let c = boxC; c < boxC + 3; c++) {
      if (r !== row || c !== col) {
        if (board[r][c] === num) return false;
      }
    }
  }
  return true;
}

/**
 * Validate the entire board for conflicts.
 * Mirrors Java's evalid() — also checks range [1-9].
 * Returns an array of {row, col} positions that have conflicts.
 */
function validateBoard(board) {
  const conflicts = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === 0) continue;
      // Range check (mirrors Java's evalid: val < 0 || val > 9)
      if (val < 1 || val > 9) {
        conflicts.push({ row: r, col: c });
        continue;
      }
      if (!isValidPlacement(board, r, c, val)) {
        conflicts.push({ row: r, col: c });
      }
    }
  }
  return conflicts;
}

/**
 * Check if the board is fully solved — no empty cells.
 * Mirrors Java's etest(9).
 */
function isBoardComplete(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  return true;
}

/**
 * Check if a completed board is a valid Sudoku solution.
 * Combines isBoardComplete + validateBoard.
 */
function isBoardSolved(board) {
  return isBoardComplete(board) && validateBoard(board).length === 0;
}

/**
 * Shuffle an array in-place using Fisher-Yates.
 * Mirrors Java's shuffle() which randomizes the candidate list.
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build the candidate cube — a 9x9x9 3D array where
 * ncube[r][c] = shuffled list of [1..9].
 * Mirrors Java's ncube[9][9][9] with shuffle().
 */
function buildCandidateCube() {
  const cube = [];
  for (let r = 0; r < 9; r++) {
    cube[r] = [];
    for (let c = 0; c < 9; c++) {
      cube[r][c] = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  }
  return cube;
}

/**
 * Solve the board in-place using backtracking with randomized candidates.
 * Mirrors Java's process() + check() logic.
 *
 * Uses the ncube (3D candidate array) so each cell tries numbers in a
 * random order, matching the Java repo's approach where "the values in
 * this 3D array are generated randomly" so "the time taken to arrive at
 * a solution cannot be predicted."
 *
 * Returns { solved: boolean, backtracks: number, elapsedMs: number }
 */
function solveBoardWithStats(board, cube) {
  const stats = { solved: false, backtracks: 0, elapsedMs: 0 };
  const startTime = performance.now();

  // If no cube provided, build one (randomized candidates)
  if (!cube) {
    cube = buildCandidateCube();
  }

  function backtrack() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          // Try candidates in the shuffled order from the cube
          const candidates = cube[r][c];
          for (let k = 0; k < 9; k++) {
            const num = candidates[k];
            if (isValidPlacement(board, r, c, num)) {
              board[r][c] = num;
              if (backtrack()) return true;
              board[r][c] = 0;
              stats.backtracks++;
            }
          }
          return false; // trigger backtrack
        }
      }
    }
    return true; // solved — no empty cell found
  }

  stats.solved = backtrack();
  stats.elapsedMs = performance.now() - startTime;
  return stats;
}

/**
 * Simple solve (backward compatible).
 */
function solveBoard(board) {
  const result = solveBoardWithStats(board);
  return result.solved;
}

/**
 * Generate a full random Sudoku solution from an empty board.
 * Mirrors Java's option 1: "generate a random solution" —
 * calls process() on an empty board with shuffled ncube.
 *
 * Returns { board: int[][], stats: { backtracks, elapsedMs } }
 */
function generateFullSolution() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  const cube = buildCandidateCube();
  const stats = solveBoardWithStats(board, cube);
  return { board, stats };
}

/**
 * Generate a playable puzzle by removing cells from a full solution.
 * `clues` is the number of filled cells to keep (17-50 recommended).
 * Difficulty levels:
 *   Easy   = ~40-45 clues
 *   Medium = ~30-35 clues
 *   Hard   = ~22-27 clues
 *
 * Returns { puzzle: int[][], solution: int[][], stats }
 */
function generatePuzzle(clues = 32) {
  const { board: solution, stats } = generateFullSolution();
  const puzzle = cloneBoard(solution);

  // Create a list of all 81 positions, shuffle, then remove (81 - clues)
  const positions = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  shuffleArray(positions);

  const toRemove = 81 - clues;
  for (let i = 0; i < toRemove && i < positions.length; i++) {
    const [r, c] = positions[i];
    puzzle[r][c] = 0;
  }

  return { puzzle, solution, stats };
}

/**
 * Deep clone a 9x9 board.
 */
function cloneBoard(board) {
  return board.map(row => [...row]);
}
