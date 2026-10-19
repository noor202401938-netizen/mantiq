import React, { useState } from 'react';
import { X, RotateCw, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface AimaFlashcardModalProps {
  onClose: () => void;
}

export const AimaFlashcardModal: React.FC<AimaFlashcardModalProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(2); // 3 of 10 to match page 2 screenshot!
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const flashcards = [
    {
      q: 'What is the PEAS framework used to specify?',
      a: 'Performance measure, Environment, Actuators, and Sensors for an AI agent.'
    },
    {
      q: 'What is the difference between an informed and uninformed search?',
      a: 'Informed search uses problem-specific heuristic evaluation h(n); uninformed search only knows goal vs non-goal.'
    },
    {
      q: 'When is a heuristic admissible?',
      a: 'A heuristic is admissible if it never overestimates the true cost to reach the nearest goal. In other words, it is optimistic.'
    },
    {
      q: 'What does consistency (monotonicity) require for a heuristic?',
      a: 'For every node n and successor n’ with step cost c(n,a,n’), h(n) <= c(n,a,n’) + h(n’). Triangle inequality holds.'
    },
    {
      q: 'Why is A* tree search optimal with admissible heuristics?',
      a: 'Because any sub-optimal goal node will have f(n) = g(n) > C*, whereas the true optimal goal has f(n) <= C* on the frontier.'
    }
  ];

  const currentCard = flashcards[currentIndex % flashcards.length];
  const progressPercent = ((currentIndex + 1) / 10) * 100;

  const handleNext = () => {
    soundFX.playClick();
    if (currentIndex + 1 < 10) {
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="quest-modal-overlay">
      <div className="quest-quiz-container" style={{ maxWidth: '540px', minHeight: '560px' }}>
        {/* Header */}
        <div>
          <div className="quest-quiz-header" style={{ marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '16px', fontWeight: 800 }}>
              {currentIndex + 1} / 10
            </span>

            <div className="quest-quiz-progress-track" style={{ flex: 1, margin: '0 16px' }}>
              <div className="quest-quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--quest-text-primary)' }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Flashcard Frame (Page 2 style) */}
          <div
            onClick={() => {
              soundFX.playClick();
              setIsRevealed(!isRevealed);
            }}
            style={{
              minHeight: '360px',
              background: 'var(--quest-card-bg)',
              border: '2px solid var(--quest-text-primary)',
              borderRadius: '24px',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginTop: '16px',
              transition: 'transform 0.2s ease',
              boxShadow: '0 8px 24px rgba(19, 33, 28, 0.06)'
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--quest-text-muted)' }}>
                {isRevealed ? 'ANSWER' : 'QUESTION'}
              </div>

              <div
                style={{
                  fontFamily: 'var(--quest-font-heading)',
                  fontSize: isRevealed ? '22px' : '28px',
                  fontWeight: 800,
                  lineHeight: 1.25,
                  marginTop: '40px',
                  color: 'var(--quest-text-primary)'
                }}
              >
                {isRevealed ? currentCard.a : currentCard.q}
              </div>
            </div>

            <div
              style={{
                alignSelf: 'center',
                padding: '12px 20px',
                borderRadius: 'var(--quest-radius-pill)',
                background: isRevealed ? 'var(--quest-bg)' : '#EAF6C9',
                color: '#13211C',
                fontSize: '14px',
                fontWeight: 700,
                textAlign: 'center',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {isRevealed ? 'Tap to flip back' : 'Tap to reveal the answer'}
            </div>
          </div>
        </div>

        {/* Rating Buttons: Again, Good, Easy */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="quest-btn-outline" style={{ flex: 1 }} onClick={handleNext}>
            Again
          </button>
          <button className="quest-btn-outline" style={{ flex: 1 }} onClick={handleNext}>
            Good
          </button>
          <button
            className="quest-btn-outline"
            style={{ flex: 1, background: 'var(--quest-card-dark)', color: 'var(--quest-card-dark-text)' }}
            onClick={handleNext}
          >
            Easy
          </button>
        </div>
      </div>
    </div>
  );
};
