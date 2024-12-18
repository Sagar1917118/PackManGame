export const useDijkstraAlgorithm=()=>{
    const dijkstraAlgorithm = (grid, start, end,ignoreX,ignoreY) => {
      class PriorityQueue {
          constructor() {
              this.queue = [];
          }
          enqueue(node, priority) {
              this.queue.push({ node, priority });
              this.queue.sort((a, b) => a.priority - b.priority);
          }
          dequeue() {
              return this.queue.shift().node;
          }
          isEmpty() {
              return this.queue.length === 0;
          }
      }

      const dijkstra = (grid, start, end) => {
          const rows = grid.length;
          const cols = grid[0].length;

          const isValidCell = (x, y) =>
              x >= 0 && y >= 0 && x < cols && y < rows && grid[x][y] !== 1;

          // Directions: [dx, dy, cost]
          const directions = [
              [1, 0, 1], // Right
              [-1, 0, 1], // Left
              [0, 1, 1], // Down
              [0, -1, 1], // Up
          ];

          const startNode = { x: start.y, y: start.x };
          const endNode = { x: end.y, y: end.x };

          const distances = Array.from({ length: rows + 1 }, () =>
              Array(cols).fill(Infinity)
          );
          const previous = Array.from({ length: rows + 1 }, () =>
              Array(cols).fill(null)
          );

          const pq = new PriorityQueue();
          pq.enqueue(startNode, 0);
          distances[startNode.y][startNode.x] = 0;

          while (!pq.isEmpty()) {
              const { x, y } = pq.dequeue();
              if (x === endNode.x && y === endNode.y) break; // Reached destination

              for (const [dx, dy, cost] of directions) {
                  const nx = x + dx;
                  const ny = y + dy;
                  if(nx==ignoreX&&ny==ignoreY)
                        continue;
                  if (isValidCell(nx, ny)) {
                      const newDist = distances[y][x] + cost;
                      if (newDist < distances[ny][nx]) {
                          distances[ny][nx] = newDist;
                          previous[ny][nx] = { x, y };
                          pq.enqueue({ x: nx, y: ny }, newDist);
                      }
                  }
              }
          }

          const path = [];
          // Reconstruct path
          let current = endNode;
          while (current && previous[current.y][current.x] !== null) {
              path.push([current.x, current.y]);
              current = previous[current.y][current.x];
          }

          path.push([start.y, start.x]);
          return path;
      };

      return dijkstra(grid, start, end);
  };
  return dijkstraAlgorithm;
}