import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Sparkles, Compass } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

interface GridNode {
  r: number;
  c: number;
  isWall: boolean;
  isStart: boolean;
  isGoal: boolean;
  g: number;
  h: number;
  f: number;
  parent: GridNode | null;
}

const ROWS = 9;
const COLS = 13;

export const SearchVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<'astar' | 'bfs' | 'dfs' | 'greedy'>('astar');
  const [heuristicType, setHeuristicType] = useState<'manhattan' | 'euclidean'>('manhattan');
  const [grid, setGrid] = useState<GridNode[][]>([]);
  const [startPos, setStartPos] = useState<[number, number]>([4, 1]);
  const [goalPos, setGoalPos] = useState<[number, number]>([4, 11]);
  const [frontier, setFrontier] = useState<[number, number][]>([]);
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const [path, setPath] = useState<[number, number][]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Ready to search. Select algorithm and press Run or Step.');

  const timerRef = useRef<number | null>(null);

  // Initialize grid
  const initGrid = () => {
    const newGrid: GridNode[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: GridNode[] = [];
      for (let c = 0; c < COLS; c++) {
        // Preset walls
        const isWall = (c === 6 && r >= 2 && r <= 6) || (c === 4 && r <= 3);
        const isStart = r === startPos[0] && c === startPos[1];
        const isGoal = r === goalPos[0] && c === goalPos[1];
        row.push({
          r,
          c,
          isWall: isWall && !isStart && !isGoal,
          isStart,
          isGoal,
          g: Infinity,
          h: 0,
          f: Infinity,
          parent: null
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setFrontier([[startPos[0], startPos[1]]]);
    setExplored(new Set());
    setPath([]);
    setStepCount(0);
    setIsRunning(false);
    setStatusText('Grid reset. Click cells to toggle walls.');
  };

  useEffect(() => {
    initGrid();
  }, []);

  const getHeuristic = (r: number, c: number, gr: number, gc: number): number => {
    if (heuristicType === 'manhattan') {
      return Math.abs(r - gr) + Math.abs(c - gc);
    }
    return Math.sqrt(Math.pow(r - gr, 2) + Math.pow(c - gc, 2));
  };

  const stepSearch = (): boolean => {
    if (frontier.length === 0) {
      setIsRunning(false);
      setStatusText('Search complete: No path exists to the goal!');
      soundFX.playIncorrect();
      return false;
    }

    let nextIndex = 0;

    if (algorithm === 'bfs') {
      nextIndex = 0; // FIFO
    } else if (algorithm === 'dfs') {
      nextIndex = frontier.length - 1; // LIFO
    } else if (algorithm === 'greedy') {
      // Pick node with lowest h
      let bestH = Infinity;
      frontier.forEach((pos, idx) => {
        const node = grid[pos[0]][pos[1]];
        if (node.h < bestH) {
          bestH = node.h;
          nextIndex = idx;
        }
      });
    } else if (algorithm === 'astar') {
      // Pick node with lowest f = g + h
      let bestF = Infinity;
      frontier.forEach((pos, idx) => {
        const node = grid[pos[0]][pos[1]];
        if (node.f < bestF) {
          bestF = node.f;
          nextIndex = idx;
        }
      });
    }

    const currentPos = frontier[nextIndex];
    const newFrontier = frontier.filter((_, i) => i !== nextIndex);
    const [cr, cc] = currentPos;
    const currentNode = grid[cr][cc];

    const key = `${cr},${cc}`;
    const newExplored = new Set(explored).add(key);
    setExplored(newExplored);

    soundFX.playStep();
    setStepCount((prev) => prev + 1);

    // Goal Check
    if (cr === goalPos[0] && cc === goalPos[1]) {
      setIsRunning(false);
      // Reconstruct path
      const finalPath: [number, number][] = [];
      let curr: GridNode | null = currentNode;
      while (curr) {
        finalPath.unshift([curr.r, curr.c]);
        curr = curr.parent;
      }
      setPath(finalPath);
      setStatusText(`Goal reached in ${stepCount + 1} expansions! Path cost: ${finalPath.length - 1}`);
      soundFX.playCorrect();
      return false;
    }

    // Neighbors (Up, Right, Down, Left)
    const deltas = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const updatedGrid = [...grid.map((row) => [...row])];

    deltas.forEach(([dr, dc]) => {
      const nr = cr + dr;
      const nc = cc + dc;

      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        const neighbor = updatedGrid[nr][nc];
        const nKey = `${nr},${nc}`;

        if (!neighbor.isWall && !newExplored.has(nKey)) {
          const tentativeG = currentNode.g === Infinity ? 1 : currentNode.g + 1;
          const hVal = getHeuristic(nr, nc, goalPos[0], goalPos[1]);
          const inFrontier = newFrontier.some(([fr, fc]) => fr === nr && fc === nc);

          if (!inFrontier || tentativeG < neighbor.g) {
            neighbor.parent = currentNode;
            neighbor.g = tentativeG;
            neighbor.h = hVal;
            neighbor.f = tentativeG + hVal;

            if (!inFrontier) {
              newFrontier.push([nr, nc]);
            }
          }
        }
      }
    });

    setGrid(updatedGrid);
    setFrontier(newFrontier);
    setStatusText(`Exploring (${cr}, ${cc}) | Frontier size: ${newFrontier.length} | Explored: ${newExplored.size}`);
    return true;
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setTimeout(() => {
        const hasNext = stepSearch();
        if (!hasNext) {
          setIsRunning(false);
        }
      }, 100);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, frontier, explored, grid]);

  const toggleWall = (r: number, c: number) => {
    if ((r === startPos[0] && c === startPos[1]) || (r === goalPos[0] && c === goalPos[1])) return;
    const newGrid = grid.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? { ...cell, isWall: !cell.isWall } : cell))
    );
    setGrid(newGrid);
    soundFX.playClick();
  };

  return (
    <div className="sim-card">
      <div className="sim-header">
        <div className="sim-title-group">
          <span className="sim-badge">AIMA Chapter 3 Lab</span>
          <h3>Heuristic & Graph Search Visualizer</h3>
        </div>
        <div className="sim-algo-picker">
          <button
            className={`btn-pill ${algorithm === 'astar' ? 'active' : ''}`}
            onClick={() => { setAlgorithm('astar'); initGrid(); }}
          >
            A* Search (f = g + h)
          </button>
          <button
            className={`btn-pill ${algorithm === 'bfs' ? 'active' : ''}`}
            onClick={() => { setAlgorithm('bfs'); initGrid(); }}
          >
            BFS (FIFO)
          </button>
          <button
            className={`btn-pill ${algorithm === 'dfs' ? 'active' : ''}`}
            onClick={() => { setAlgorithm('dfs'); initGrid(); }}
          >
            DFS (LIFO)
          </button>
          <button
            className={`btn-pill ${algorithm === 'greedy' ? 'active' : ''}`}
            onClick={() => { setAlgorithm('greedy'); initGrid(); }}
          >
            Greedy Best-First (h only)
          </button>
        </div>
      </div>

      <div className="sim-controls-bar">
        <button
          className="btn-action primary"
          onClick={() => {
            soundFX.playClick();
            setIsRunning(!isRunning);
          }}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Pause' : 'Run Search'}
        </button>

        <button
          className="btn-action secondary"
          onClick={() => {
            soundFX.playClick();
            stepSearch();
          }}
          disabled={isRunning}
        >
          <SkipForward size={16} />
          Step Forward
        </button>

        <button
          className="btn-action secondary"
          onClick={() => {
            soundFX.playClick();
            initGrid();
          }}
        >
          <RotateCcw size={16} />
          Reset
        </button>

        {algorithm === 'astar' && (
          <div className="sim-select-group">
            <label>Heuristic:</label>
            <select
              value={heuristicType}
              onChange={(e) => {
                setHeuristicType(e.target.value as 'manhattan' | 'euclidean');
                initGrid();
              }}
              className="select-input"
            >
              <option value="manhattan">Manhattan (|dx| + |dy|)</option>
              <option value="euclidean">Euclidean (sqrt(dx² + dy²))</option>
            </select>
          </div>
        )}

        <div className="sim-stats-pill">
          <span>Expansions: <strong>{stepCount}</strong></span>
          <span>Frontier: <strong>{frontier.length}</strong></span>
        </div>
      </div>

      <div className="sim-grid-container">
        <div className="search-grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isStart = r === startPos[0] && c === startPos[1];
              const isGoal = r === goalPos[0] && c === goalPos[1];
              const isPath = path.some(([pr, pc]) => pr === r && pc === c);
              const inFrontier = frontier.some(([fr, fc]) => fr === r && fc === c);
              const inExplored = explored.has(`${r},${c}`);

              let cellClass = 'grid-cell';
              if (isStart) cellClass += ' cell-start';
              else if (isGoal) cellClass += ' cell-goal';
              else if (isPath) cellClass += ' cell-path';
              else if (cell.isWall) cellClass += ' cell-wall';
              else if (inFrontier) cellClass += ' cell-frontier';
              else if (inExplored) cellClass += ' cell-explored';

              return (
                <div
                  key={`${r}-${c}`}
                  className={cellClass}
                  onClick={() => toggleWall(r, c)}
                  title={`(${r},${c}) ${cell.f !== Infinity ? `g=${cell.g}, h=${cell.h}, f=${cell.f}` : ''}`}
                >
                  {isStart && <span>S</span>}
                  {isGoal && <span>G</span>}
                  {algorithm === 'astar' && !cell.isWall && !isStart && !isGoal && cell.f !== Infinity && (
                    <span className="cell-cost">{Math.round(cell.f)}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="sim-footer">
        <div className="sim-status-message">
          <Compass size={16} className="text-accent" />
          <span>{statusText}</span>
        </div>
        <div className="sim-legend">
          <span className="legend-item"><span className="legend-box start"></span> Start</span>
          <span className="legend-item"><span className="legend-box goal"></span> Goal</span>
          <span className="legend-item"><span className="legend-box frontier"></span> Frontier (Queue)</span>
          <span className="legend-item"><span className="legend-box explored"></span> Explored Set</span>
          <span className="legend-item"><span className="legend-box path"></span> Optimal Path</span>
          <span className="legend-item"><span className="legend-box wall"></span> Obstacle</span>
        </div>
      </div>
    </div>
  );
};
