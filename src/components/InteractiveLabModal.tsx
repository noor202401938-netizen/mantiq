import React from 'react';
import { X, FlaskConical } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { SearchVisualizer } from './simulations/SearchVisualizer';
import { VacuumAgentSimulator } from './simulations/VacuumAgentSimulator';
import { MinimaxAlphaBetaSim } from './simulations/MinimaxAlphaBetaSim';
import { MdpValueIterationSim } from './simulations/MdpValueIterationSim';
import { QLearningSim } from './simulations/QLearningSim';
import { BayesNetSim } from './simulations/BayesNetSim';

interface InteractiveLabModalProps {
  chapterId: number;
  onClose: () => void;
}

export const InteractiveLabModal: React.FC<InteractiveLabModalProps> = ({
  chapterId,
  onClose
}) => {
  const getLabTitle = () => {
    switch (chapterId) {
      case 2:
        return 'Ch 2: Reflex vs Model-Based Vacuum World';
      case 3:
        return 'Ch 3: A* & Heuristic Graph Search Visualizer';
      case 5:
        return 'Ch 5: Minimax Game Tree & Alpha-Beta Pruning';
      case 14:
        return 'Ch 14: Bayesian Network Probabilistic Inference';
      case 17:
        return 'Ch 17: Markov Decision Process (MDP) Value Iteration';
      case 21:
        return 'Ch 21: Reinforcement Learning (Q-Learning Grid)';
      default:
        return 'Ch 3: A* Search Visualizer';
    }
  };

  const renderSim = () => {
    switch (chapterId) {
      case 2:
        return <VacuumAgentSimulator />;
      case 3:
        return <SearchVisualizer />;
      case 5:
        return <MinimaxAlphaBetaSim />;
      case 14:
        return <BayesNetSim />;
      case 17:
        return <MdpValueIterationSim />;
      case 21:
        return <QLearningSim />;
      default:
        return <SearchVisualizer />;
    }
  };

  return (
    <div className="design-lab-overlay" onClick={onClose}>
      <div className="design-lab-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="lab-dialog-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FlaskConical size={22} color="#C9F26B" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px' }}>
              {getLabTitle()}
            </span>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            style={{
              background: 'transparent',
              border: 0,
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="lab-dialog-body">
          {renderSim()}
        </div>
      </div>
    </div>
  );
};
