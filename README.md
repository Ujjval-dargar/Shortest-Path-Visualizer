# Shortest Path Visualization

This project is a web-based visualization tool for graph traversal algorithms. It allows you to visualize different shortest-path algorithms, including Dijkstra, BFS, DFS, and Bellman-Ford. You can interact with the grid, add walls, and watch the algorithms in action.

## Features

- **Grid-based Visualization**: A grid where you can add walls (obstacles) to block paths.
- **Shortest Path Algorithms**:
  - **Dijkstra's Algorithm**
  - **Breadth-First Search (BFS)**
  - **Depth-First Search (DFS)**
  - **Bellman-Ford Algorithm**
- **Interactive**:
  - Click on the grid to add/remove walls.
  - Choose an algorithm to visualize its process on the grid.

## How It Works

### Grid and Pathfinding Algorithms

The grid represents a 2D matrix where each cell corresponds to a point in a graph. 
The goal of the visualization is to show how the selected algorithm finds the shortest path between a **start point** and an **end point** on the grid. 

The algorithms implemented in this project are:

- **Dijkstra’s Algorithm**
- **Breadth-First Search (BFS)**
- **Depth-First Search (DFS)**
- **Bellman-Ford Algorithm**

### Adding and Handling Walls

The grid allows you to **add walls** that will block the algorithm’s path, making the problem of finding the shortest path more complex. Here's how it works:

- **Walls as Obstacles**: Clicking on a grid cell toggles whether it is a wall. These walls act as obstacles for the algorithms, preventing them from traversing through these cells. The algorithms will attempt to find the shortest path around walls.


When an algorithm is selected, it will find the shortest path (if possible) from the start point to the end point while considering the walls as obstacles.


## How to Use - [Shortest Path Visualizer](https://ujjval-dargar.github.io/Shortest-Path-Visualizer/)
