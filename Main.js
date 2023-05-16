const grid = document.querySelectorAll("td");
grid.forEach((cell) => {
  Object.defineProperty(cell, "contentEditable", {
    value: "true",
    writable: false, // prevent the attribute from being modified
  });
});

function isSudokuValid(sudoku) {
  // Check rows
  for (let i = 0; i < 9; i++) {
    const row = new Set(sudoku[i].filter((num) => num !== 0));
    if (row.size !== sudoku[i].filter((num) => num !== 0).length) {
      return false;
    }
  }

  // Check columns
  for (let j = 0; j < 9; j++) {
    const col = new Set(sudoku.map((row) => row[j]).filter((num) => num !== 0));
    if (
      col.size !== sudoku.map((row) => row[j]).filter((num) => num !== 0).length
    ) {
      return false;
    }
  }

  // Check boxes
  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      const box = new Set(
        sudoku
          .slice(i, i + 3)
          .flatMap((row) => row.slice(j, j + 3))
          .filter((num) => num !== 0)
      );
      if (
        box.size !==
        sudoku
          .slice(i, i + 3)
          .flatMap((row) => row.slice(j, j + 3))
          .filter((num) => num !== 0).length
      ) {
        return false;
      }
    }
  }

  // If all checks pass, return true
  return true;
}

function solveSudokuAndUpdateGrid() {
  const grid = document.querySelectorAll("td");
  const gridValues = [];

  // Loop through each cell in the grid and store its value in the gridValues array
  grid.forEach((cell) => {
    let value = "0";
    if (cell.textContent.trim() != "") {
      value = cell.textContent.trim();
      cell.className = "hasNum";
    } else {
      cell.className = "notNum";
    }
    gridValues.push(value);
  });

  // Convert the 1D gridValues array to a 2D array
  const gridSize = Math.sqrt(gridValues.length);
  const gridArray = [];
  for (let i = 0; i < gridSize; i++) {
    gridArray.push(gridValues.slice(i * gridSize, (i + 1) * gridSize));
  }

  // Solve the Sudoku
  let solvedGrid = parseInput(gridArray);

  solveSudoku(solvedGrid);

  // Update the grid with the solved values
  let count = 0;
  grid.forEach((cell) => {
    cell.textContent = solvedGrid[parseInt(count / 9)][count % 9];
    cell.style.fontSize = "25px";
    count += 1;
  });
}

function parseInput(input) {
  // Create a new 2D array for the output
  const output = [];

  // Loop through each row in the input array
  for (let i = 0; i < input.length; i++) {
    // Create a new row in the output array
    output[i] = [];

    // Loop through each column in the row and parse the string value to an integer
    for (let j = 0; j < input[i].length; j++) {
      output[i][j] = parseInt(input[i][j], 10);
    }
  }

  return output;
}

function solveSudoku(grid) {
  // Find the next empty cell
  let row = -1;
  let col = -1;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        row = i;
        col = j;
        break;
      }
    }
    if (row !== -1) {
      break;
    }
  }

  // If there are no more empty cells, the Sudoku is solved
  if (row === -1) {
    return true;
  }

  // Try all possible numbers in the empty cell
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(grid, row, col, num)) {
      grid[row][col] = num;

      // Recursively solve the remaining cells
      if (solveSudoku(grid)) {
        return true;
      }

      // If the recursive call did not solve the Sudoku, backtrack
      grid[row][col] = 0;
    }
  }

  // If no number worked, the Sudoku is unsolvable
  return false;
}

function isValidMove(grid, row, col, num) {
  // Check the row
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) {
      return false;
    }
  }

  // Check the column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) {
      return false;
    }
  }

  // Check the 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (grid[i][j] === num) {
        return false;
      }
    }
  }

  // If the move is valid, return true
  return true;
}
