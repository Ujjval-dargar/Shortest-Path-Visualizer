const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const size = 30;
const rows = canvas.height / size;
const cols = canvas.width / size;

let walls = [];
let mousePressed = false;
let algorithmRunning = false;

const begin = { x: 2, y: 2 };
const end = { x: cols - 3, y: rows - 3 };

const dirs = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

function drawGrid() {
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= canvas.width; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawWalls() {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const isWall = walls.some((w) => w.x === x && w.y === y);
      ctx.fillStyle = isWall ? "grey" : "white";
      ctx.fillRect(x * size, y * size, size, size);
    }
  }

  ctx.fillStyle = "green";
  ctx.fillRect(begin.x * size, begin.y * size, size, size);

  ctx.fillStyle = "red";
  ctx.fillRect(end.x * size, end.y * size, size, size);
}

function drawGraph() {
  drawWalls();
  drawGrid();
}

canvas.addEventListener("mousedown", (e) => {
  if (!algorithmRunning) {
    mousePressed = true;
    toggleWall(e);
  }
});

canvas.addEventListener("mouseup", () => {
  if (!algorithmRunning) mousePressed = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (mousePressed && !algorithmRunning) toggleWall(e);
});

function toggleWall(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / size);
  const y = Math.floor((e.clientY - rect.top) / size);

  if ((x === begin.x && y === begin.y) || (x === end.x && y === end.y)) return;

  const wall_ind = walls.findIndex((w) => w.x === x && w.y === y);

  if (wall_ind !== -1) walls.splice(wall_ind, 1);
  else walls.push({ x, y });

  drawGraph();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Dijkstra Algorithm
async function runDijkstra() {
  drawGraph();
  algorithmRunning = true;

  const dist = Array.from({ length: cols }, () => Array(rows).fill(Infinity));
  const parent = Array.from({ length: cols }, () => Array(rows).fill(null));
  const visited = Array.from({ length: cols }, () => Array(rows).fill(false));

  const pq = [];
  dist[begin.x][begin.y] = 0;
  pq.push({ x: begin.x, y: begin.y, dist: 0 });

  const visitedNodes = [];
  let found = false;

  while (pq.length > 0 && !found) {
    pq.sort((a, b) => a.dist - b.dist);
    const { x, y } = pq.shift();

    if (visited[x][y]) continue;
    visited[x][y] = true;
    visitedNodes.push({ x, y });

    visitedNodes.forEach((node) => {
      ctx.fillStyle = "#ffb3d9";
      ctx.fillRect(
        node.x * size + (canvas.width - cols * size) / 2,
        node.y * size + (canvas.height - rows * size) / 2,
        size,
        size
      );
    });
    ctx.fillStyle = "#ff66b2";
    ctx.fillRect(
      x * size + (canvas.width - cols * size) / 2,
      y * size + (canvas.height - rows * size) / 2,
      size,
      size
    );

    ctx.fillStyle = "green";
    ctx.fillRect(begin.x * size, begin.y * size, size, size);

    ctx.fillStyle = "red";
    ctx.fillRect(end.x * size, end.y * size, size, size);
    await sleep(100);

    if (x === end.x && y === end.y) {
      found = true;
      break;
    }

    for (const dir of dirs) {
      const nx = x + dir.x;
      const ny = y + dir.y;

      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < cols &&
        ny < rows &&
        !visited[nx][ny] &&
        !walls.some((w) => w.x === nx && w.y === ny)
      ) {
        const newDist = dist[x][y] + 1;
        if (newDist < dist[nx][ny]) {
          dist[nx][ny] = newDist;
          parent[nx][ny] = { x, y };
          pq.push({ x: nx, y: ny, dist: newDist });
        }
      }
    }
  }

  let curr = { x: end.x, y: end.y };
  while (curr) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(
      curr.x * size + (canvas.width - cols * size) / 2,
      curr.y * size + (canvas.height - rows * size) / 2,
      size,
      size
    );
    curr = parent[curr.x][curr.y];
  }
  ctx.fillStyle = "green";
  ctx.fillRect(begin.x * size, begin.y * size, size, size);

  ctx.fillStyle = "red";
  ctx.fillRect(end.x * size, end.y * size, size, size);

  algorithmRunning = false;
}

// BFS Algorithm
async function runBFS() {
  drawGraph();
  algorithmRunning = true;
  const visited = Array.from({ length: cols }, () => Array(rows).fill(false));
  const parent = Array.from({ length: cols }, () => Array(rows).fill(null));
  const queue = [{ x: begin.x, y: begin.y }];
  visited[begin.x][begin.y] = true;

  const visitedNodes = [];
  let found = false;

  while (queue.length > 0 && !found) {
    const { x, y } = queue.shift();

    if (x === end.x && y === end.y) {
      found = true;
      break;
    }

    for (const dir of dirs) {
      const nx = x + dir.x;
      const ny = y + dir.y;

      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < cols &&
        ny < rows &&
        !visited[nx][ny] &&
        !walls.some((w) => w.x === nx && w.y === ny)
      ) {
        visited[nx][ny] = true;
        parent[nx][ny] = { x, y };
        queue.push({ x: nx, y: ny });
      }
    }

    visitedNodes.push({ x, y });

    visitedNodes.forEach((node) => {
      ctx.fillStyle = "#ffb3d9"; 
      ctx.fillRect(node.x * size, node.y * size, size, size);
    });

    ctx.fillStyle = "#ff66b2";
    ctx.fillRect(x * size, y * size, size, size);

    ctx.fillStyle = "green";
    ctx.fillRect(begin.x * size, begin.y * size, size, size);

    ctx.fillStyle = "red";
    ctx.fillRect(end.x * size, end.y * size, size, size);
    await sleep(100);
  }

  if (found) {
    let curr = { x: end.x, y: end.y };
    while (curr) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(curr.x * size, curr.y * size, size, size);
      curr = parent[curr.x][curr.y];
    }
  }

  ctx.fillStyle = "green";
  ctx.fillRect(begin.x * size, begin.y * size, size, size);

  ctx.fillStyle = "red";
  ctx.fillRect(end.x * size, end.y * size, size, size);

  algorithmRunning = false;
}

// DFS Algorithm
async function runDFS() {
  drawGraph();
  algorithmRunning = true;
  const visited = Array.from({ length: cols }, () => Array(rows).fill(false));
  const parent = Array.from({ length: cols }, () => Array(rows).fill(null));
  let found = false;

  const stk = [{ x: begin.x, y: begin.y }];
  visited[begin.x][begin.y] = true;

  const visitedNodes = [];

  while (stk.length > 0 && !found) {
    const { x, y } = stk.pop();

    // Visualize current node
    visitedNodes.push({ x, y });
    visitedNodes.forEach((node) => {
      ctx.fillStyle = "#ffb3d9"; 
      ctx.fillRect(node.x * size, node.y * size, size, size);
    });

    ctx.fillStyle = "#ff66b2";
    ctx.fillRect(x * size, y * size, size, size);

    ctx.fillStyle = "green";
    ctx.fillRect(begin.x * size, begin.y * size, size, size);

    ctx.fillStyle = "red";
    ctx.fillRect(end.x * size, end.y * size, size, size);
    await sleep(100);

    if (x === end.x && y === end.y) {
      found = true;
      break;
    }

    for (const dir of dirs) {
      const nx = x + dir.x;
      const ny = y + dir.y;

      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < cols &&
        ny < rows &&
        !visited[nx][ny] &&
        !walls.some((w) => w.x === nx && w.y === ny)
      ) {
        visited[nx][ny] = true;
        parent[nx][ny] = { x, y };
        stk.push({ x: nx, y: ny });
      }
    }
  }

  if (found) {
    let curr = { x: end.x, y: end.y };
    while (curr) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(curr.x * size, curr.y * size, size, size);
      curr = parent[curr.x][curr.y];
    }
  }
  ctx.fillStyle = "green";
  ctx.fillRect(begin.x * size, begin.y * size, size, size);

  ctx.fillStyle = "red";
  ctx.fillRect(end.x * size, end.y * size, size, size);

  algorithmRunning = false;
}

// Bellman-Ford Algorithm
async function runBellmanFord() {
  drawGraph();
  algorithmRunning = true;

  const dist = Array.from({ length: cols }, () => Array(rows).fill(Infinity));
  const parent = Array.from({ length: cols }, () => Array(rows).fill(null));

  dist[begin.x][begin.y] = 0;

  const edges = [];
  const visitedNodes = [];


  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (walls.some((w) => w.x === x && w.y === y)) continue;
      for (const dir of dirs) {
        const nx = x + dir.x;
        const ny = y + dir.y;
        if (
          nx >= 0 &&
          ny >= 0 &&
          nx < cols &&
          ny < rows &&
          !walls.some((w) => w.x === nx && w.y === ny)
        ) {
          edges.push({ from: { x, y }, to: { x: nx, y: ny }, weight: 1 });
        }
      }
    }
  }

  for (let i = 0; i < cols * rows - 1; i++) {
    let anyUpdate = false;

    for (const edge of edges) {
      const { from, to, weight } = edge;

      if (dist[from.x][from.y] + weight < dist[to.x][to.y]) {
        dist[to.x][to.y] = dist[from.x][from.y] + weight;
        parent[to.x][to.y] = { x: from.x, y: from.y };
        anyUpdate = true;

        visitedNodes.push({ x: to.x, y: to.y });

        visitedNodes.forEach((node) => {
          ctx.fillStyle = "#ffb3d9"; 
          ctx.fillRect(node.x * size, node.y * size, size, size);
        });

        ctx.fillStyle = "#ff66b2";
        ctx.fillRect(to.x * size, to.y * size, size, size);

        ctx.fillStyle = "green";
        ctx.fillRect(begin.x * size, begin.y * size, size, size);

        ctx.fillStyle = "red";
        ctx.fillRect(end.x * size, end.y * size, size, size);

        await sleep(50);

        if (to.x === end.x && to.y === end.y) {
          i = cols * rows;
          break;
        }
      }
    }

    if (!anyUpdate) break;
  }

  if (dist[end.x][end.y] === Infinity) {
    alert("No path exists!");
    algorithmRunning = false;
    return;
  }

  let curr = { x: end.x, y: end.y };
  while (curr) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(curr.x * size, curr.y * size, size, size);
    curr = parent[curr.x][curr.y];
  }
  ctx.fillStyle = "green";
  ctx.fillRect(begin.x * size, begin.y * size, size, size);

  ctx.fillStyle = "red";
  ctx.fillRect(end.x * size, end.y * size, size, size);

  algorithmRunning = false;
}

document.getElementById("dijkstraBtn").addEventListener("click", runDijkstra);
document.getElementById("bfsBtn").addEventListener("click", runBFS);
document.getElementById("dfsBtn").addEventListener("click", runDFS);
document.getElementById("bellmanBtn").addEventListener("click", runBellmanFord);

drawGraph();
