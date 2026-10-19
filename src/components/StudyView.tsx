import React, { useState } from 'react';
import { FLASHCARDS_DATA as AIMA_FLASHCARDS } from '../data/flashcardsData';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';
import { Sparkles, FlaskConical, BookOpen, RotateCw, CheckCircle2, Code2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Import simulations for embedded interactive lab mode
import { SearchVisualizer } from './simulations/SearchVisualizer';
import { VacuumAgentSimulator } from './simulations/VacuumAgentSimulator';
import { MinimaxAlphaBetaSim } from './simulations/MinimaxAlphaBetaSim';
import { MdpValueIterationSim } from './simulations/MdpValueIterationSim';
import { QLearningSim } from './simulations/QLearningSim';
import { BayesNetSim } from './simulations/BayesNetSim';

export const StudyView: React.FC = () => {
  const { stats, markChapterRead } = useProgress();
  const [mode, setMode] = useState<'flashcards' | 'labs'>('flashcards');

  // Flashcards state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedLabChapter, setSelectedLabChapter] = useState(3);

  const cards = AIMA_FLASHCARDS;
  const currentCard = cards[currentIndex % cards.length];
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / Math.min(10, cards.length)) * 100));

  const handleReveal = () => {
    soundFX.playClick();
    setIsRevealed(!isRevealed);
  };

  const handleGrade = (rating: 'again' | 'good' | 'easy') => {
    soundFX.playCorrect();
    if (rating === 'easy') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="study-screen-container">
      {/* Mode Switcher */}
      <div className="study-mode-switcher">
        <button
          className={`study-mode-tab ${mode === 'flashcards' ? 'active' : ''}`}
          onClick={() => {
            soundFX.playClick();
            setMode('flashcards');
          }}
        >
          Spaced Recall Cards
        </button>
        <button
          className={`study-mode-tab ${mode === 'labs' ? 'active' : ''}`}
          onClick={() => {
            soundFX.playClick();
            setMode('labs');
          }}
        >
          Interactive AI Labs
        </button>
      </div>

      {mode === 'flashcards' ? (
        <>
          {/* Top Progress Tracker */}
          <div className="study-top-progress">
            <span className="study-step-counter">
              {(currentIndex % 10) + 1} / 10
            </span>
            <div className="study-track">
              <div className="study-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Question / Recall Card */}
          <div className="study-question-card" onClick={handleReveal}>
            <div>
              <div className="study-card-kicker">
                {currentCard.category} · Ch {currentCard.chapterId}
              </div>
              <h2 className="study-card-question">{currentCard.front}</h2>
            </div>

            {isRevealed ? (
              <div className="study-answer-box">
                <p>{currentCard.back}</p>
                {currentCard.formula && (
                  <div style={{ marginTop: '8px', padding: '8px 12px', background: '#EAF6C9', borderRadius: '10px', fontFamily: 'var(--font-code)', fontSize: '13px', color: '#13211C', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Code2 size={14} color="#166534" />
                    <span>{currentCard.formula}</span>
                  </div>
                )}
                <span className="study-citation-tag">Russell & Norvig — AIMA (4th Edition)</span>
              </div>
            ) : (
              <div className="study-tap-reveal-prompt">
                Tap to reveal the answer
              </div>
            )}
          </div>

          {/* Action Grading Buttons */}
          <div className="study-buttons-row">
            <button
              className="study-btn-action"
              onClick={() => handleGrade('again')}
            >
              Again
            </button>
            <button
              className="study-btn-action"
              onClick={() => handleGrade('good')}
            >
              Good
            </button>
            <button
              className="study-btn-action active-easy"
              onClick={() => handleGrade('easy')}
            >
              Easy
            </button>
          </div>
        </>
      ) : (
        /* Interactive Lab Selector Mode */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 3, name: 'Ch 3: A* Search' },
              { id: 2, name: 'Ch 2: Vacuum PEAS' },
              { id: 5, name: 'Ch 5: Minimax Pruning' },
              { id: 17, name: 'Ch 17: MDP Gridworld' },
              { id: 21, name: 'Ch 21: Q-Learning' },
              { id: 14, name: 'Ch 14: Bayes Net' }
            ].map((lab) => (
              <button
                key={lab.id}
                style={{
                  padding: '8px 14px',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                  background: selectedLabChapter === lab.id ? '#13211C' : 'var(--color-card)',
                  color: selectedLabChapter === lab.id ? 'var(--color-lime)' : 'var(--color-dark)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedLabChapter(lab.id);
                }}
              >
                {lab.name}
              </button>
            ))}
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '28px', border: '2px solid #13211C', padding: '20px', overflow: 'hidden' }}>
            {selectedLabChapter === 3 && <SearchVisualizer />}
            {selectedLabChapter === 2 && <VacuumAgentSimulator />}
            {selectedLabChapter === 5 && <MinimaxAlphaBetaSim />}
            {selectedLabChapter === 17 && <MdpValueIterationSim />}
            {selectedLabChapter === 21 && <QLearningSim />}
            {selectedLabChapter === 14 && <BayesNetSim />}
          </div>
        </div>
      )}
    </div>
  );
};
