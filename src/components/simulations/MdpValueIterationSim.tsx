import React, { useState } from 'react';
import { Play, RotateCcw, FastForward, Info } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

interface CellState {
  r: number;
  c: number;
  u: number;
  policy: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;
  isWall?: boolean;
  isTerminal?: boolean;
  reward: number;
}

const R_STEP = -0.04;
const GAMMA = 0.99;

export const MdpValueIterationSim: React.FC = () => {
  const [iteration, setIteration] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(GAMMA);
  const [stepCost, setStepCost] = useState<number>(R_STEP);

  // 3 rows, 4 columns. Row 0 is top, Row 2 is bottom.
  // Goal (+1) at (0, 3). Pit (-1) at (1, 3). Wall at (1, 1).
  const initGrid = (): CellState[][] => [
    [
      { r: 0, c: 0, u: 0, policy: 'RIGHT', reward: stepCost },
      { r: 0, c: 1, u: 0, policy: 'RIGHT', reward: stepCost },
      { r: 0, c: 2, u: 0, policy: 'RIGHT', reward: stepCost },
      { r: 0, c: 3, u: 1.0, policy: null, isTerminal: true, reward: 1.0 }
    ],
    [
      { r: 1, c: 0, u: 0, policy: 'UP', reward: stepCost },
      { r: 1, c: 1, u: 0, policy: null, isWall: true, reward: 0 },
      { r: 1, c: 2, u: 0, policy: 'UP', reward: stepCost },
      { r: 1, c: 3, u: -1.0, policy: null, isTerminal: true, reward: -1.0 }
    ],
    [
      { r: 2, c: 0, u: 0, policy: 'UP', reward: stepCost },
      { r: 2, c: 1, u: 0, policy: 'LEFT', reward: stepCost },
      { r: 2, c: 2, u: 0, policy: 'LEFT', reward: stepCost },
      { r: 2, c: 3, u: 0, policy: 'LEFT', reward: stepCost }
    ]
  ];

  const [grid, setGrid] = useState<CellState[][]>(initGrid());

  const getCellUtil = (g: CellState[][], r: number, c: number): number => {
    // If out of bounds or wall, bump back to original state
    if (r < 0 || r >= 3 || c < 0 || c >= 4 || g[r][c].isWall) {
      return 0; // Handled in move calculation
    }
    return g[r][c].u;
  };

  const getTargetUtil = (g: CellState[][], r: number, c: number, dr: number, dc: number): number => {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr >= 3 || nc < 0 || nc >= 4 || g[nr][nc].isWall) {
      return g[r][c].u; // stay in place
    }
    return g[nr][nc].u;
  };

  const stepValueIteration = () => {
    soundFX.playStep();
    const newGrid: CellState[][] = grid.map((row) => row.map((cell) => ({ ...cell })));

    const actions = [
      { name: 'UP', dr: -1, dc: 0, left: [0, -1], right: [0, 1] },
      { name: 'DOWN', dr: 1, dc: 0, left: [0, 1], right: [0, -1] },
      { name: 'LEFT', dr: 0, dc: -1, left: [1, 0], right: [-1, 0] },
      { name: 'RIGHT', dr: 0, dc: 1, left: [-1, 0], right: [1, 0] }
    ] as const;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const cell = grid[r][c];
        if (cell.isWall || cell.isTerminal) continue;

        let bestU = -Infinity;
        let bestA: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'UP';

        actions.forEach((act) => {
          // 80% intended, 10% left perpendicular, 10% right perpendicular
          const uIntended = getTargetUtil(grid, r, c, act.dr, act.dc);
          const uLeft = getTargetUtil(grid, r, c, act.left[0], act.left[1]);
          const uRight = getTargetUtil(grid, r, c, act.right[0], act.right[1]);

          const expectedU = 0.8 * uIntended + 0.1 * uLeft + 0.1 * uRight;
          if (expectedU > bestU) {
            bestU = expectedU;
            bestA = act.name;
          }
        });

        // Bellman update: U_{k+1}(s) = R(s) + gamma * max_a expectedU
        newGrid[r][c].u = stepCost + discount * bestU;
        newGrid[r][c].policy = bestA;
      }
    }

    setGrid(newGrid);
    setIteration((prev) => prev + 1);
  };

  const runMultiple = (count: number) => {
    soundFX.playClick();
    for (let i = 0; i < count; i++) {
      stepValueIteration();
    }
  };

  const reset = () => {
    soundFX.playClick();
    setGrid(initGrid());
    setIteration(0);
  };

  const arrowChar = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null) => {
    switch (dir) {
      case 'UP': return '↑';
      case 'DOWN': return '↓';
      case 'LEFT': return '←';
      case 'RIGHT': return '→';
      default: return '';
    }
  };

  return (
    <div className="sim-card">
      <div className="sim-header">
        <div className="sim-title-group">
          <span className="sim-badge">AIMA Chapter 17 Lab</span>
          <h3>Markov Decision Process: 4x3 Gridworld Value Iteration</h3>
        </div>
      </div>

      <div className="sim-controls-bar">
        <button className="btn-action primary" onClick={stepValueIteration}>
          <Play size={16} />
          Step Bellman Update
        </button>

        <button className="btn-action secondary" onClick={() => runMultiple(10)}>
          <FastForward size={16} />
          Run 10 Iterations
        </button>

        <button className="btn-action secondary" onClick={reset}>
          <RotateCcw size={16} />
          Reset
        </button>

        <div className="sim-stats-pill">
          <span>Iteration: <strong>k = {iteration}</strong></span>
          <span>Discount (γ): <strong>{discount}</strong></span>
          <span>Step Cost: <strong>{stepCost}</strong></span>
        </div>
      </div>

      <div className="mdp-grid-container">
        <div className="mdp-grid">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              let cellClass = 'mdp-cell';
              if (cell.isWall) cellClass += ' cell-wall';
              else if (cell.isTerminal && cell.reward > 0) cellClass += ' cell-goal';
              else if (cell.isTerminal && cell.reward < 0) cellClass += ' cell-pit';

              return (
                <div key={`${r}-${c}`} className={cellClass}>
                  <div className="mdp-coord">({c + 1}, {3 - r})</div>
                  {cell.isWall ? (
                    <span className="text-muted">WALL</span>
                  ) : cell.isTerminal ? (
                    <div className="terminal-badge">
                      <span>{cell.reward > 0 ? '+1.0 Goal' : '-1.0 Pit'}</span>
                    </div>
                  ) : (
                    <>
                      <div className="mdp-value">{cell.u.toFixed(3)}</div>
                      <div className="mdp-arrow">{arrowChar(cell.policy)}</div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="sim-footer">
        <div className="sim-status-message">
          <Info size={16} className="text-accent" />
          <span>
            Stochastic model: 80% intended action, 10% veer left, 10% veer right. Notice how states near the pit choose safer indirect paths!
          </span>
        </div>
      </div>
    </div>
  );
};
