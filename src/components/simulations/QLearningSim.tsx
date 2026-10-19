import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, TrendingUp, Bot } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

type Action = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
const ACTIONS: Action[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

export const QLearningSim: React.FC = () => {
  const [alpha, setAlpha] = useState<number>(0.2); // Learning rate
  const [gamma, setGamma] = useState<number>(0.9); // Discount factor
  const [epsilon, setEpsilon] = useState<number>(0.2); // Exploration rate
  const [episode, setEpisode] = useState<number>(0);
  const [totalRewards, setTotalRewards] = useState<number>(0);
  const [agentPos, setAgentPos] = useState<[number, number]>([0, 0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // 4x4 Grid
  // (0,0) Start
  // (3,3) Goal (+100)
  // (1,1) Pit (-100), (2,2) Pit (-100)
  // Initialize Q-table: 16 states x 4 actions
  const [qTable, setQTable] = useState<Record<string, Record<Action, number>>>(() => {
    const table: Record<string, Record<Action, number>> = {};
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        table[`${r},${c}`] = { UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0 };
      }
    }
    return table;
  });

  const timerRef = useRef<number | null>(null);

  const getReward = (r: number, c: number): number => {
    if (r === 3 && c === 3) return 100; // Goal
    if ((r === 1 && c === 1) || (r === 2 && c === 2)) return -100; // Pits
    return -1; // Small step penalty
  };

  const isTerminal = (r: number, c: number): boolean => {
    return (r === 3 && c === 3) || (r === 1 && c === 1) || (r === 2 && c === 2);
  };

  const stepQLearning = () => {
    const [r, c] = agentPos;
    const stateKey = `${r},${c}`;

    // Choose action via epsilon-greedy
    let chosenAction: Action;
    if (Math.random() < epsilon) {
      chosenAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    } else {
      // Greedy action
      const qValues = qTable[stateKey];
      let bestQ = -Infinity;
      let bestAct: Action = 'RIGHT';
      ACTIONS.forEach((act) => {
        if (qValues[act] > bestQ) {
          bestQ = qValues[act];
          bestAct = act;
        }
      });
      chosenAction = bestAct;
    }

    // Next state calculation
    let nr = r;
    let nc = c;
    if (chosenAction === 'UP') nr = Math.max(0, r - 1);
    if (chosenAction === 'DOWN') nr = Math.min(3, r + 1);
    if (chosenAction === 'LEFT') nc = Math.max(0, c - 1);
    if (chosenAction === 'RIGHT') nc = Math.min(3, c + 1);

    const nextStateKey = `${nr},${nc}`;
    const reward = getReward(nr, nc);

    // Q-Learning update: Q(s, a) <- Q(s, a) + alpha * [r + gamma * max_a' Q(s', a') - Q(s, a)]
    let maxNextQ = 0;
    if (!isTerminal(nr, nc)) {
      maxNextQ = Math.max(...Object.values(qTable[nextStateKey]));
    }

    const currentQ = qTable[stateKey][chosenAction];
    const newQ = currentQ + alpha * (reward + gamma * maxNextQ - currentQ);

    setQTable((prev) => ({
      ...prev,
      [stateKey]: {
        ...prev[stateKey],
        [chosenAction]: Math.round(newQ * 10) / 10
      }
    }));

    setTotalRewards((prev) => prev + reward);

    if (isTerminal(nr, nc)) {
      if (nr === 3 && nc === 3) soundFX.playCorrect();
      else soundFX.playIncorrect();
      // Episode end: reset agent to start
      setAgentPos([0, 0]);
      setEpisode((prev) => prev + 1);
    } else {
      setAgentPos([nr, nc]);
      soundFX.playStep();
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setTimeout(() => {
        stepQLearning();
      }, 120);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, agentPos, qTable, alpha, gamma, epsilon]);

  const reset = () => {
    soundFX.playClick();
    setIsRunning(false);
    setAgentPos([0, 0]);
    setEpisode(0);
    setTotalRewards(0);
    const table: Record<string, Record<Action, number>> = {};
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        table[`${r},${c}`] = { UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0 };
      }
    }
    setQTable(table);
  };

  const getBestQ = (r: number, c: number) => {
    const qVals = qTable[`${r},${c}`];
    return Math.max(...Object.values(qVals));
  };

  return (
    <div className="sim-card">
      <div className="sim-header">
        <div className="sim-title-group">
          <span className="sim-badge">AIMA Chapter 21 Lab</span>
          <h3>Active Reinforcement Learning: Q-Learning Agent</h3>
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
          {isRunning ? 'Pause Learning' : 'Run Training'}
        </button>

        <button
          className="btn-action secondary"
          onClick={() => {
            soundFX.playClick();
            stepQLearning();
          }}
          disabled={isRunning}
        >
          Single Step
        </button>

        <button className="btn-action secondary" onClick={reset}>
          <RotateCcw size={16} />
          Reset Q-Table
        </button>

        <div className="sim-stats-pill">
          <span>Episodes: <strong>{episode}</strong></span>
          <span>Reward: <strong>{totalRewards}</strong></span>
          <span>ε-Exploration: <strong>{epsilon}</strong></span>
        </div>
      </div>

      <div className="qlearn-grid-wrapper">
        <div className="qlearn-grid">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => {
              const isAgent = agentPos[0] === r && agentPos[1] === c;
              const isGoal = r === 3 && c === 3;
              const isPit = (r === 1 && c === 1) || (r === 2 && c === 2);
              const bestVal = getBestQ(r, c);

              let cellStyle = 'q-cell';
              if (isGoal) cellStyle += ' cell-goal';
              else if (isPit) cellStyle += ' cell-pit';

              return (
                <div key={`${r}-${c}`} className={cellStyle}>
                  <div className="q-badge">
                    {isGoal ? '+100 GOAL' : isPit ? '-100 PIT' : `Q* ≈ ${bestVal}`}
                  </div>
                  {isAgent && <div className="q-agent-token" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Bot size={13} color="#13211C" /> Agent</div>}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="sim-footer">
        <div className="sim-status-message">
          <TrendingUp size={16} className="text-accent" />
          <span>
            Off-policy Q-Learning: updates toward max_a' Q(s', a') regardless of whether exploration was taken.
          </span>
        </div>
      </div>
    </div>
  );
};
