/* ========================================================
   Sudoku Solver — Logic Module  |  logic.js
   Sudoku validation & backtracking solver
   ======================================================== */

/**
 * Check if placing `num` at board[row][col] is valid.
 * Ignores the cell itself.
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
  // Check 3x3 box
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
 * Returns an array of {row, col} positions that have conflicts.
 */
function validateBoard(board) {
  const conflicts = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === 0) continue;
      if (!isValidPlacement(board, r, c, val)) {
        conflicts.push({ row: r, col: c });
      }
    }
  }
  return conflicts;
}

/**
 * Solve the board in-place using backtracking.
 * Returns true if solved, false if unsolvable.
 */
function solveBoard(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(board, r, c, num)) {
            board[r][c] = num;
            if (solveBoard(board)) return true;
            board[r][c] = 0;
          }
        }
        return false; // trigger backtrack
      }
    }
  }
  return true; // solved — no empty cell found
}

/**
 * Deep clone a 9x9 board.
 */
function cloneBoard(board) {
  return board.map(row => [...row]);
}
