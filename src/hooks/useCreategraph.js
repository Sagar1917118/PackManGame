export const useCreategraph = (grid) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const graph = [];
  
    const isValidCell = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows && grid[y][x] !== 1;
  
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x] !== 1) {
          const currentNode = y * cols + x;
          const neighbors = [];
  
          // Right movement
          if (isValidCell(x + 1, y)) {
            neighbors.push([(y * cols + (x + 1)), +1]);
          }
          // Left movement
          if (isValidCell(x - 1, y)) {
            neighbors.push([(y * cols + (x - 1)), -1]);
          }
          // Down movement
          if (isValidCell(x, y + 1)) {
            neighbors.push([((y + 1) * cols + x), +2]);
          }
          // Up movement
          if (isValidCell(x, y - 1)) {
            neighbors.push([((y - 1) * cols + x), -2]);
          }
  
          graph[currentNode] = neighbors;
        }
      }
    }
  
    return graph;
  };