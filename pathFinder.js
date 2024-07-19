const grid = [
    '>---A-@-+',
    '        |',
    '+-U-+   C',
    '|   |   |',
    's   C---+'
  ];
  
  const startChar = '>';
  const endChar = 's';
  
  const directions = {
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 }
  };
  
  const reverseDirections = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };
  
  function findStart(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === startChar) {
          return { row, col };
        }
      }
    }
    throw new Error('Start character not found');
  }
  
  function isLetter(char) {
    return char >= 'A' && char <= 'Z';
  }
  
  function isValidPosition(grid, pos) {
    return pos.row >= 0 && pos.row < grid.length && pos.col >= 0 && pos.col < grid[pos.row].length;
  }
  
  function findPath(grid) {
    const start = findStart(grid);
    let current = start;
    let direction = 'right'; // Initial direction based on the start character
    let path = '';
    let letters = '';
    let visited = new Set();
  
    while (true) {
      const posKey = `${current.row},${current.col}`;
      if (visited.has(posKey)) {
        throw new Error('Infinite loop detected');
      }
      visited.add(posKey);
  
      const char = grid[current.row][current.col];
      path += char;
  
      if (isLetter(char)) {
        letters += char;
      } else if (char === endChar) {
        break;
      }
  
      let next = findNextPosition(grid, current, direction);
  
      if (!next && char === '+') {
        // Handle junctions (turning point)
        for (const newDirection of getPossibleDirections(direction)) {
          next = findNextPosition(grid, current, newDirection);
          if (next) {
            direction = newDirection;
            break;
          }
        }
      }
  
      if (!next) {
        // If no next position, try to backtrack in the other directions
        for (const newDirection in directions) {
          if (newDirection !== reverseDirections[direction]) {
            next = findNextPosition(grid, current, newDirection);
            if (next) {
              direction = newDirection;
              break;
            }
          }
        }
      }
  
      if (!next) {
        throw new Error('Path not found');
      }
  
      current = next;
    }
  
    return { path, letters };
  }
  
  function findNextPosition(grid, current, direction) {
    const newPos = {
      row: current.row + directions[direction].row,
      col: current.col + directions[direction].col
    };
    
    if (isValidPosition(grid, newPos) && grid[newPos.row][newPos.col] !== ' ') {
      return newPos;
    }
    
    return null;
  }
  
  function getPossibleDirections(currentDirection) {
    switch (currentDirection) {
      case 'up':
      case 'down':
        return ['left', 'right'];
      case 'left':
      case 'right':
        return ['up', 'down'];
      default:
        return [];
    }
  }
  
  try {
    const result = findPath(grid);
    console.log('Path:', result.path);
    console.log('Letters:', result.letters);
  } catch (error) {
    console.error(error.message);
  }