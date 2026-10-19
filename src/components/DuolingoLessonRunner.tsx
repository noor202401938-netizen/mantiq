import React, { useState } from 'react';
import { X, Heart, Flame, CheckCircle2, AlertCircle, ArrowRight, Sparkles, RefreshCw, Trophy, Target, Gem, Lightbulb } from 'lucide-react';
import { AIMA_PARTS } from '../data/aimaBookData';
import { QUIZZES_DATA as CHAPTER_QUIZZES } from '../data/quizzesData';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { AimaMascot } from './AimaMascot';

// Import simulations to embed in interactive step
import { SearchVisualizer } from './simulations/SearchVisualizer';
import { VacuumAgentSimulator } from './simulations/VacuumAgentSimulator';
import { MinimaxAlphaBetaSim } from './simulations/MinimaxAlphaBetaSim';
import { MdpValueIterationSim } from './simulations/MdpValueIterationSim';
import { QLearningSim } from './simulations/QLearningSim';
import { BayesNetSim } from './simulations/BayesNetSim';

interface DuolingoLessonRunnerProps {
  chapterId: number;
  onClose: () => void;
  onComplete: () => void;
  onOpenFlashcards?: () => void;
}

export const DuolingoLessonRunner: React.FC<DuolingoLessonRunnerProps> = ({
  chapterId,
  onClose,
  onComplete
}) => {
  const { stats, recordQuizResult, markChapterRead, markSimulationInteracted, loseHeart, addGems } = useProgress();

  // Find Chapter
  let currentChapter = AIMA_PARTS[0].chapters[0];
  let currentPart = AIMA_PARTS[0];
  for (const part of AIMA_PARTS) {
    const found = part.chapters.find((ch) => ch.id === chapterId);
    if (found) {
      currentChapter = found;
      currentPart = part;
      break;
    }
  }

  // Quiz questions for this chapter
  const quizList = CHAPTER_QUIZZES[chapterId] || [
    {
      id: `gen_${chapterId}_1`,
      question: `What is the foundational paradigm of Chapter ${chapterId}: ${currentChapter.title}?`,
      options: [
        'Acting rationally to maximize expected performance measure',
        'Imitating human cognitive fallacies without formal proofs',
        'Brute-force exhaustive search without memory constraints',
        'Relying solely on supervised offline label annotation'
      ],
      correctIndex: 0,
      explanation: currentChapter.summary,
      bookReference: `AIMA 3rd Edition, ${currentChapter.pageRange}`,
      difficulty: 'medium' as const
    }
  ];

  // We construct a 4-step Duolingo micro-lesson:
  // Step 0: Concept Overview card (Bite-sized punchy intro)
  // Step 1: Question 1 (Multiple choice)
  // Step 2: Interactive Lab / Term Pairing
  // Step 3: Question 2 (Pitfall Check)
  // Step 4: Victory Celebration Screen
  const [currentStep, setCurrentStep] = useState<number>(0);
  const totalSteps = 4;

  // Selected option & check state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checkStatus, setCheckStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [heartShake, setHeartShake] = useState<boolean>(false);
  const [outOfHearts, setOutOfHearts] = useState<boolean>(false);

  // Term matching state for step 2 if no sim
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Progress percentage (0 - 100)
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  const handleSelectOption = (idx: number) => {
    if (checkStatus !== 'idle') return;
    soundFX.playClick();
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (currentStep === 0) {
      // Intro step, simply advance
      soundFX.playClick();
      setCurrentStep(1);
      setSelectedOption(null);
      setCheckStatus('idle');
      return;
    }

    if (currentStep === 1) {
      // Check question 1
      const q = quizList[0];
      if (selectedOption === q.correctIndex) {
        soundFX.playCorrect();
        setCheckStatus('correct');
        setCorrectCount((prev) => prev + 1);
      } else {
        soundFX.playError();
        setCheckStatus('incorrect');
        setHeartShake(true);
        setTimeout(() => setHeartShake(false), 500);
        const hasHearts = loseHeart();
        if (!hasHearts) {
          setOutOfHearts(true);
        }
      }
      return;
    }

    if (currentStep === 2) {
      // Interactive Lab / Simulation step
      soundFX.playCorrect();
      markSimulationInteracted(chapterId);
      setCheckStatus('correct');
      return;
    }

    if (currentStep === 3) {
      // Check question 2
      const q = quizList.length > 1 ? quizList[1] : quizList[0];
      const correctIdx = quizList.length > 1 ? q.correctIndex : 0;
      if (selectedOption === correctIdx) {
        soundFX.playCorrect();
        setCheckStatus('correct');
        setCorrectCount((prev) => prev + 1);
      } else {
        soundFX.playError();
        setCheckStatus('incorrect');
        setHeartShake(true);
        setTimeout(() => setHeartShake(false), 500);
        const hasHearts = loseHeart();
        if (!hasHearts) {
          setOutOfHearts(true);
        }
      }
      return;
    }
  };

  const handleContinue = () => {
    soundFX.playClick();
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setCheckStatus('idle');
    } else {
      // Finish Lesson!
      soundFX.playLevelUp();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
      markChapterRead(chapterId);
      recordQuizResult(chapterId, correctCount + 1, totalSteps);
      addGems(15);
      setCurrentStep(totalSteps); // Victory screen
    }
  };

  const renderSimulationWidget = () => {
    switch (currentChapter.simulationType) {
      case 'search':
        return <SearchVisualizer />;
      case 'vacuum':
        return <VacuumAgentSimulator />;
      case 'minimax':
        return <MinimaxAlphaBetaSim />;
      case 'mdp':
        return <MdpValueIterationSim />;
      case 'qlearn':
        return <QLearningSim />;
      case 'bayes':
        return <BayesNetSim />;
      default:
        return (
          <div className="duo-sim-fallback">
            <div className="duo-term-match-grid">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="#059669" /> Algorithmic Concept Association
              </h4>
              <p>Match the key AI terms from Chapter {chapterId}:</p>
              <div className="match-cards-container">
                <div
                  className={`match-card ${selectedLeft === 'A' ? 'selected' : ''} ${
                    matchedPairs.includes('A') ? 'matched' : ''
                  }`}
                  onClick={() => setSelectedLeft('A')}
                >
                  Rationality
                </div>
                <div
                  className={`match-card ${matchedPairs.includes('A') ? 'matched' : ''}`}
                  onClick={() => {
                    if (selectedLeft === 'A') {
                      soundFX.playCorrect();
                      setMatchedPairs([...matchedPairs, 'A']);
                      setSelectedLeft(null);
                    }
                  }}
                >
                  Maximizes expected performance measure
                </div>
                <div
                  className={`match-card ${selectedLeft === 'B' ? 'selected' : ''} ${
                    matchedPairs.includes('B') ? 'matched' : ''
                  }`}
                  onClick={() => setSelectedLeft('B')}
                >
                  PEAS Specification
                </div>
                <div
                  className={`match-card ${matchedPairs.includes('B') ? 'matched' : ''}`}
                  onClick={() => {
                    if (selectedLeft === 'B') {
                      soundFX.playCorrect();
                      setMatchedPairs([...matchedPairs, 'B']);
                      setSelectedLeft(null);
                    }
                  }}
                >
                  Performance, Environment, Actuators, Sensors
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // VICTORY SCREEN
  if (currentStep === totalSteps) {
    return (
      <div className="duo-lesson-modal-overlay">
        <div className="duo-victory-card">
          <div className="victory-mascot-row">
            <AimaMascot mood="happy" speech="Lesson Mastered! Outstanding work!" size="lg" />
          </div>

          <h2 className="victory-title">Lesson Complete!</h2>
          <p className="victory-subtitle">
            You just mastered the core fundamentals of Chapter {chapterId}: {currentChapter.title}
          </p>

          <div className="victory-stats-grid">
            <div className="victory-stat-item xp-box">
              <span className="stat-label">TOTAL XP</span>
              <span className="stat-val">+35 XP</span>
            </div>
            <div className="victory-stat-item gems-box">
              <span className="stat-label">GEMS EARNED</span>
              <span className="stat-val" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>+15 <Gem size={14} color="#06B6D4" /></span>
            </div>
            <div className="victory-stat-item streak-box">
              <span className="stat-label">STREAK</span>
              <span className="stat-val" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{stats.streakDays} Days <Flame size={14} color="#EA580C" /></span>
            </div>
            <div className="victory-stat-item acc-box">
              <span className="stat-label">ACCURACY</span>
              <span className="stat-val">{Math.round((correctCount / 2) * 100)}%</span>
            </div>
          </div>

          <button
            className="duo-button-primary-large"
            onClick={() => {
              onComplete();
              onClose();
            }}
          >
            CONTINUE LEARNING
          </button>
        </div>
      </div>
    );
  }

  const q1 = quizList[0];
  const q2 = quizList.length > 1 ? quizList[1] : quizList[0];
  const activeQuestion = currentStep === 1 ? q1 : q2;

  return (
    <div className="duo-lesson-modal-overlay">
      <div className="duo-lesson-container">
        {/* Top Header Bar */}
        <div className="duo-lesson-topbar">
          <button className="duo-close-btn" onClick={onClose} title="Exit Lesson">
            <X size={24} />
          </button>

          {/* Duolingo Rounded Progress Bar */}
          <div className="duo-progress-track">
            <div className="duo-progress-fill" style={{ width: `${progressPercent}%` }}>
              <div className="duo-progress-shine" />
            </div>
          </div>

          {/* Hearts Indicator */}
          <div className={`duo-hearts-pill ${heartShake ? 'hearts-shake' : ''}`}>
            <Heart size={20} className="heart-icon fill-red" />
            <span className="hearts-count">{stats.hearts ?? 5}</span>
          </div>
        </div>

        {/* Lesson Body */}
        <div className="duo-lesson-body">
          {/* STEP 0: CONCEPT BITE INTRO */}
          {currentStep === 0 && (
            <div className="duo-step-fade duo-intro-step">
              <div className="duo-intro-header">
                <span className="duo-unit-tag">{currentPart.title}</span>
                <h1 className="duo-lesson-heading">
                  Chapter {chapterId}: {currentChapter.title}
                </h1>
                <p className="duo-lesson-sub">{currentChapter.subtitle}</p>
              </div>

              <div className="duo-mascot-bubble-row">
                <AimaMascot
                  mood="idle"
                  speech={`Welcome! Here is what Russell & Norvig want you to understand in this lesson:`}
                  size="md"
                />
              </div>

              <div className="duo-concept-highlight-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lightbulb size={18} color="#D97706" /> Core Big Idea
                </h3>
                <p>{currentChapter.summary}</p>

                {currentChapter.keyConcepts?.[0] && (
                  <div className="duo-concept-subbox">
                    <strong>{currentChapter.keyConcepts[0].title}</strong>
                    <p>{currentChapter.keyConcepts[0].summary}</p>
                  </div>
                )}

                {currentChapter.sections && (
                  <div className="duo-topics-pill-row">
                    {currentChapter.sections.slice(0, 3).map((sec, i) => (
                      <span key={i} className="duo-topic-chip">
                        {sec.split(' (')[0]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 1 & 3: MULTIPLE CHOICE CHECKS */}
          {(currentStep === 1 || currentStep === 3) && (
            <div className="duo-step-fade duo-question-step">
              <div className="duo-question-prompt">
                <span className="duo-step-pill">
                  {currentStep === 1 ? 'Concept Check 1 of 2' : 'Final Exam Pitfall Check'}
                </span>
                <h2 className="duo-prompt-text">{activeQuestion.question}</h2>
              </div>

              <div className="duo-options-list">
                {activeQuestion.options.map((opt: string, idx: number) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === activeQuestion.correctIndex;
                  const showResult = checkStatus !== 'idle';

                  let optionClass = 'duo-option-card';
                  if (isSelected) optionClass += ' selected';
                  if (showResult) {
                    if (isCorrect) optionClass += ' correct-glow';
                    else if (isSelected && !isCorrect) optionClass += ' wrong-glow';
                  }

                  return (
                    <button
                      key={idx}
                      className={optionClass}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showResult}
                    >
                      <span className="duo-opt-badge">{['A', 'B', 'C', 'D'][idx]}</span>
                      <span className="duo-opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: INTERACTIVE LAB / SIMULATION */}
          {currentStep === 2 && (
            <div className="duo-step-fade duo-lab-step">
              <div className="duo-question-prompt">
                <span className="duo-step-pill lab-pill">Interactive Lab Challenge</span>
                <h2 className="duo-prompt-text">
                  {currentChapter.hasSimulation
                    ? `Explore the ${currentChapter.title} visual algorithm simulation:`
                    : `Match the key terms and axioms:`}
                </h2>
              </div>

              <div className="duo-lab-container">{renderSimulationWidget()}</div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION DRAWER (Duolingo Style) */}
        <div
          className={`duo-bottom-drawer ${
            checkStatus === 'correct'
              ? 'drawer-correct'
              : checkStatus === 'incorrect'
              ? 'drawer-incorrect'
              : 'drawer-neutral'
          }`}
        >
          <div className="duo-drawer-content">
            {checkStatus === 'correct' && (
              <div className="duo-feedback-box">
                <div className="feedback-icon-circle green">
                  <CheckCircle2 size={32} />
                </div>
                <div className="feedback-texts">
                  <h3 className="feedback-heading green">Nicely done!</h3>
                  <p className="feedback-sub">
                    {activeQuestion?.bookReference || `Russell & Norvig, ${currentChapter.pageRange}`}
                  </p>
                </div>
              </div>
            )}

            {checkStatus === 'incorrect' && (
              <div className="duo-feedback-box">
                <div className="feedback-icon-circle red">
                  <AlertCircle size={32} />
                </div>
                <div className="feedback-texts">
                  <h3 className="feedback-heading red">Not quite.</h3>
                  <p className="feedback-sub">
                    Correct solution: <strong>{activeQuestion?.options[activeQuestion.correctIndex]}</strong>
                  </p>
                  <p className="feedback-exp">{activeQuestion?.explanation}</p>
                </div>
              </div>
            )}

            {checkStatus === 'idle' && (
              <div className="duo-feedback-placeholder">
                <span className="shortcut-tip">Tip: Press 1-4 on keyboard to choose</span>
              </div>
            )}

            <div className="duo-action-btns">
              {checkStatus === 'idle' ? (
                <button
                  className="duo-check-btn"
                  disabled={
                    (currentStep === 1 || currentStep === 3) && selectedOption === null
                  }
                  onClick={handleCheck}
                >
                  {currentStep === 0 ? 'START LESSON' : currentStep === 2 ? 'I UNDERSTAND' : 'CHECK'}
                </button>
              ) : (
                <button className="duo-continue-btn" onClick={handleContinue}>
                  CONTINUE <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
