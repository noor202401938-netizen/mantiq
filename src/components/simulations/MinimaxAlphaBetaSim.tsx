import React, { useState } from 'react';
import { Play, RotateCcw, Check, Scissors, AlertCircle } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

interface TreeNode {
  id: string;
  type: 'max' | 'min' | 'leaf';
  val: number | null;
  alpha: number;
  beta: number;
  isPruned?: boolean;
  isCurrent?: boolean;
  children?: TreeNode[];
  desc?: string;
}

const INITIAL_TREE: TreeNode = {
  id: 'root',
  type: 'max',
  val: null,
  alpha: -Infinity,
  beta: Infinity,
  desc: 'MAX (Root)',
  children: [
    {
      id: 'n1',
      type: 'min',
      val: null,
      alpha: -Infinity,
      beta: Infinity,
      desc: 'MIN (Left)',
      children: [
        { id: 'l1', type: 'leaf', val: 3, alpha: -Infinity, beta: Infinity, desc: 'Leaf 3' },
        { id: 'l2', type: 'leaf', val: 12, alpha: -Infinity, beta: Infinity, desc: 'Leaf 12' },
        { id: 'l3', type: 'leaf', val: 8, alpha: -Infinity, beta: Infinity, desc: 'Leaf 8' }
      ]
    },
    {
      id: 'n2',
      type: 'min',
      val: null,
      alpha: -Infinity,
      beta: Infinity,
      desc: 'MIN (Mid)',
      children: [
        { id: 'l4', type: 'leaf', val: 2, alpha: -Infinity, beta: Infinity, desc: 'Leaf 2' },
        { id: 'l5', type: 'leaf', val: 4, alpha: -Infinity, beta: Infinity, desc: 'Leaf 4 (Pruned!)' },
        { id: 'l6', type: 'leaf', val: 6, alpha: -Infinity, beta: Infinity, desc: 'Leaf 6 (Pruned!)' }
      ]
    },
    {
      id: 'n3',
      type: 'min',
      val: null,
      alpha: -Infinity,
      beta: Infinity,
      desc: 'MIN (Right)',
      children: [
        { id: 'l7', type: 'leaf', val: 14, alpha: -Infinity, beta: Infinity, desc: 'Leaf 14' },
        { id: 'l8', type: 'leaf', val: 5, alpha: -Infinity, beta: Infinity, desc: 'Leaf 5' },
        { id: 'l9', type: 'leaf', val: 2, alpha: -Infinity, beta: Infinity, desc: 'Leaf 2' }
      ]
    }
  ]
};

export const MinimaxAlphaBetaSim: React.FC = () => {
  const [pruningEnabled, setPruningEnabled] = useState<boolean>(true);
  const [step, setStep] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>('Click "Step Algorithm" to trace minimax recursion and alpha-beta pruning.');

  // Pre-calculated steps for clear educational visualization
  const stepsData: Array<{ desc: string; activeId: string; values: Record<string, number | null>; pruned: string[] }> = [
    {
      desc: 'Start at MAX Root. alpha = -inf, beta = +inf. Descend to MIN Left.',
      activeId: 'n1',
      values: { root: null, n1: null, n2: null, n3: null },
      pruned: []
    },
    {
      desc: 'Evaluate Leaf 3 under MIN Left. MIN updates value to 3. beta becomes 3.',
      activeId: 'l1',
      values: { root: null, n1: 3, n2: null, n3: null },
      pruned: []
    },
    {
      desc: 'Evaluate Leaf 12 under MIN Left. min(3, 12) = 3. Value remains 3.',
      activeId: 'l2',
      values: { root: null, n1: 3, n2: null, n3: null },
      pruned: []
    },
    {
      desc: 'Evaluate Leaf 8 under MIN Left. min(3, 8) = 3. MIN Left returns 3 to MAX Root. Root alpha becomes max(-inf, 3) = 3.',
      activeId: 'root',
      values: { root: 3, n1: 3, n2: null, n3: null },
      pruned: []
    },
    {
      desc: 'Descend to MIN Mid with alpha = 3, beta = +inf. Evaluate Leaf 2. MIN Mid value becomes 2. beta becomes 2.',
      activeId: 'l4',
      values: { root: 3, n1: 3, n2: 2, n3: null },
      pruned: []
    },
    {
      desc: pruningEnabled
        ? 'ALPHA CUTOFF! At MIN Mid, beta (2) <= alpha (3). MAX already has a guaranteed outcome of 3 from Left. MAX will never pick Mid, so Leaf 4 and Leaf 6 are PRUNED!'
        : 'Without pruning: Evaluate Leaf 4 (min=2), then Leaf 6 (min=2). MIN Mid returns 2.',
      activeId: 'n2',
      values: { root: 3, n1: 3, n2: 2, n3: null },
      pruned: pruningEnabled ? ['l5', 'l6'] : []
    },
    {
      desc: 'Descend to MIN Right with alpha = 3, beta = +inf. Evaluate Leaf 14. MIN Right value = 14, beta = 14.',
      activeId: 'l7',
      values: { root: 3, n1: 3, n2: 2, n3: 14 },
      pruned: pruningEnabled ? ['l5', 'l6'] : []
    },
    {
      desc: 'Evaluate Leaf 5 under MIN Right. min(14, 5) = 5. Value becomes 5, beta becomes 5.',
      activeId: 'l8',
      values: { root: 3, n1: 3, n2: 2, n3: 5 },
      pruned: pruningEnabled ? ['l5', 'l6'] : []
    },
    {
      desc: 'Evaluate Leaf 2 under MIN Right. min(5, 2) = 2. Value becomes 2. MIN Right returns 2 to Root.',
      activeId: 'l9',
      values: { root: 3, n1: 3, n2: 2, n3: 2 },
      pruned: pruningEnabled ? ['l5', 'l6'] : []
    },
    {
      desc: 'Search Complete! MAX Root chooses max(3, 2, 2) = 3. Optimal action: Move to Left branch! Alpha-beta pruning avoided evaluating 2 leaf nodes.',
      activeId: 'root',
      values: { root: 3, n1: 3, n2: 2, n3: 2 },
      pruned: pruningEnabled ? ['l5', 'l6'] : []
    }
  ];

  const currentStep = stepsData[step] || stepsData[0];

  const advanceStep = () => {
    soundFX.playStep();
    if (step < stepsData.length - 1) {
      setStep((prev) => prev + 1);
      setExplanation(stepsData[step + 1].desc);
      if (step + 1 === stepsData.length - 1) {
        soundFX.playCorrect();
      }
    }
  };

  const reset = () => {
    soundFX.playClick();
    setStep(0);
    setExplanation(stepsData[0].desc);
  };

  return (
    <div className="sim-card">
      <div className="sim-header">
        <div className="sim-title-group">
          <span className="sim-badge">AIMA Chapter 5 Lab</span>
          <h3>Minimax & Alpha-Beta Pruning Tree</h3>
        </div>
        <div className="sim-algo-picker">
          <button
            className={`btn-pill ${pruningEnabled ? 'active' : ''}`}
            onClick={() => { setPruningEnabled(true); reset(); }}
          >
            Alpha-Beta Pruning ON
          </button>
          <button
            className={`btn-pill ${!pruningEnabled ? 'active' : ''}`}
            onClick={() => { setPruningEnabled(false); reset(); }}
          >
            Pure Minimax (No Pruning)
          </button>
        </div>
      </div>

      <div className="sim-controls-bar">
        <button
          className="btn-action primary"
          onClick={advanceStep}
          disabled={step >= stepsData.length - 1}
        >
          <Play size={16} />
          {step >= stepsData.length - 1 ? 'Search Finished' : `Step (${step + 1}/${stepsData.length})`}
        </button>

        <button className="btn-action secondary" onClick={reset}>
          <RotateCcw size={16} />
          Reset Tree
        </button>

        <div className="sim-stats-pill">
          <span>Pruned Nodes: <strong>{currentStep.pruned.length}</strong></span>
          <span>Root Minimax Val: <strong>{currentStep.values.root !== null ? currentStep.values.root : '?'}</strong></span>
        </div>
      </div>

      <div className="game-tree-wrapper">
        {/* Level 0: MAX Root */}
        <div className="tree-level">
          <div className="level-tag max-tag">▲ MAX (Root)</div>
          <div className={`tree-node max-node ${currentStep.activeId === 'root' ? 'node-active' : ''}`}>
            <span className="node-id">Root</span>
            <span className="node-value">{currentStep.values.root !== null ? currentStep.values.root : '?'}</span>
          </div>
        </div>

        {/* Level 1: MIN Nodes */}
        <div className="tree-level">
          <div className="level-tag min-tag">▼ MIN Layer</div>
          <div className="tree-row">
            <div className={`tree-node min-node ${currentStep.activeId === 'n1' ? 'node-active' : ''}`}>
              <span className="node-id">Left</span>
              <span className="node-value">{currentStep.values.n1 !== null ? currentStep.values.n1 : '?'}</span>
            </div>
            <div className={`tree-node min-node ${currentStep.activeId === 'n2' ? 'node-active' : ''}`}>
              <span className="node-id">Mid</span>
              <span className="node-value">{currentStep.values.n2 !== null ? currentStep.values.n2 : '?'}</span>
            </div>
            <div className={`tree-node min-node ${currentStep.activeId === 'n3' ? 'node-active' : ''}`}>
              <span className="node-id">Right</span>
              <span className="node-value">{currentStep.values.n3 !== null ? currentStep.values.n3 : '?'}</span>
            </div>
          </div>
        </div>

        {/* Level 2: Leaves */}
        <div className="tree-level">
          <div className="level-tag leaf-tag">Leaf Utilities</div>
          <div className="tree-row leaves-row">
            {/* Left Children */}
            <div className="leaf-cluster">
              <div className={`tree-leaf ${currentStep.activeId === 'l1' ? 'node-active' : ''}`}>3</div>
              <div className={`tree-leaf ${currentStep.activeId === 'l2' ? 'node-active' : ''}`}>12</div>
              <div className={`tree-leaf ${currentStep.activeId === 'l3' ? 'node-active' : ''}`}>8</div>
            </div>

            {/* Mid Children */}
            <div className="leaf-cluster">
              <div className={`tree-leaf ${currentStep.activeId === 'l4' ? 'node-active' : ''}`}>2</div>
              <div className={`tree-leaf ${currentStep.pruned.includes('l5') ? 'node-pruned' : ''}`}>
                4 {currentStep.pruned.includes('l5') && <Scissors size={12} className="cut-icon" />}
              </div>
              <div className={`tree-leaf ${currentStep.pruned.includes('l6') ? 'node-pruned' : ''}`}>
                6 {currentStep.pruned.includes('l6') && <Scissors size={12} className="cut-icon" />}
              </div>
            </div>

            {/* Right Children */}
            <div className="leaf-cluster">
              <div className={`tree-leaf ${currentStep.activeId === 'l7' ? 'node-active' : ''}`}>14</div>
              <div className={`tree-leaf ${currentStep.activeId === 'l8' ? 'node-active' : ''}`}>5</div>
              <div className={`tree-leaf ${currentStep.activeId === 'l9' ? 'node-active' : ''}`}>2</div>
            </div>
          </div>
        </div>
      </div>

      <div className="sim-footer">
        <div className="sim-status-message">
          <AlertCircle size={16} className="text-accent" />
          <span>{explanation}</span>
        </div>
      </div>
    </div>
  );
};
