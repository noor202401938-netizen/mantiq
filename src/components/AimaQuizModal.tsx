import React, { useState } from 'react';
import { X, Check, ArrowRight, RotateCcw, Trophy, Award, CheckCircle2, XCircle, AlertTriangle, Star } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';

import { QUIZZES_DATA } from '../data/quizzesData';
import { AIMA_DETAILED_LESSONS, QuizQuestion as LessonQuizQuestion } from '../data/aimaLessonsData';

interface AimaQuizModalProps {
  chapterId: number;
  onClose: () => void;
  onComplete: () => void;
}

export interface QuizQuestion {
  id: number;
  tier: 1 | 2 | 3;
  tierLabel: string;
  title: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  trapExplanation: string;
  invariantRule: string;
}

export const AimaQuizModal: React.FC<AimaQuizModalProps> = ({
  chapterId,
  onClose,
  onComplete
}) => {
  const { recordQuizResult, stats } = useProgress();

  const [activeTierFilter, setActiveTierFilter] = useState<0 | 1 | 2 | 3>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Dynamically resolve real chapter questions from curriculum data
  const allQuestions: QuizQuestion[] = React.useMemo(() => {
    // 1. Check QUIZZES_DATA
    const quizDataset = QUIZZES_DATA[chapterId];
    if (quizDataset && quizDataset.length > 0) {
      return quizDataset.map((q, idx: number) => ({
        id: idx + 1,
        tier: (q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1) as (1 | 2 | 3),
        tierLabel:
          q.difficulty === 'hard'
            ? 'Tier 3 · Graduate Rigor'
            : q.difficulty === 'medium'
            ? 'Tier 2 · Midterm Calculation'
            : 'Tier 1 · Foundation',
        title: q.question,
        options: q.options,
        correctAnswer: q.correctIndex,
        explanation: q.explanation,
        trapExplanation: `Refer to ${q.bookReference || 'AIMA Chapter ' + chapterId} for detailed derivations.`,
        invariantRule: `${q.bookReference || 'Russell & Norvig, AIMA'} core conceptual invariant.`
      }));
    }

    // 2. Check AIMA_DETAILED_LESSONS
    const lessonData = AIMA_DETAILED_LESSONS[chapterId];
    const lessonQuestions: LessonQuizQuestion[] | undefined = lessonData?.quiz || lessonData?.quizQuestions;
    if (lessonQuestions && lessonQuestions.length > 0) {
      return lessonQuestions.map((q: LessonQuizQuestion, idx: number) => ({
        id: idx + 1,
        tier: 2 as const,
        tierLabel: 'Tier 2 · Core Concept',
        title: q.question,
        options: q.options,
        correctAnswer: q.correctIndex,
        explanation: q.explanation,
        trapExplanation: `Refer to AIMA Chapter ${chapterId} for complete mathematical grounding.`,
        invariantRule: `Chapter ${chapterId} foundational theorem.`
      }));
    }

    // 3. Fallback foundational AIMA questions
    return [
      {
        id: 1,
        tier: 1 as const,
        tierLabel: 'Tier 1 · Foundation',
        title: `What is the primary objective of a rational agent in Chapter ${chapterId}?`,
        options: [
          'To maximize expected performance measure given the percept sequence',
          'To duplicate human cognitive behavior in every scenario',
          'To operate only under deterministic closed-world assumptions',
          'To never incur non-zero computational cost'
        ],
        correctAnswer: 0,
        explanation: 'A rational agent chooses actions that maximize the expected value of its performance measure based on percept history and built-in knowledge.',
        trapExplanation: 'Rationality is defined by expected utility maximization, not human emulation.',
        invariantRule: 'AIMA Section 2.2: Rationality depends on the performance measure, percept sequence, prior knowledge, and possible actions.'
      },
      {
        id: 2,
        tier: 2 as const,
        tierLabel: 'Tier 2 · Midterm Concept',
        title: 'Which characteristic of an environment makes search and decision-making most tractable?',
        options: [
          'Fully observable, deterministic, static, discrete',
          'Partially observable, stochastic, dynamic, continuous',
          'Unknown, multi-agent, adversarial, continuous',
          'Non-ergodic, delayed-reward, non-Markovian'
        ],
        correctAnswer: 0,
        explanation: 'Fully observable, deterministic, static, and discrete environments are the easiest for autonomous agents to plan within.',
        trapExplanation: 'Real-world environments violate these simple textbook assumptions, requiring probabilistic and learning methods.',
        invariantRule: 'AIMA Section 2.3: Environment taxonomy defines agent architectural complexity.'
      }
    ];
  }, [chapterId]);

  const questions = activeTierFilter === 0
    ? allQuestions
    : allQuestions.filter(q => q.tier === activeTierFilter);

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return;
    soundFX.playClick();
    setSelectedOption(idx);
  };

  const handleCheckOrContinue = () => {
    if (!isAnswerChecked) {
      if (selectedOption === null) return;
      setIsAnswerChecked(true);
      const isCorrect = selectedOption === currentQ.correctAnswer;
      if (isCorrect) {
        soundFX.playCorrect();
        setScore((prev) => prev + 1);
      } else {
        soundFX.playIncorrect();
      }
    } else {
      soundFX.playClick();
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        // Complete quiz
        recordQuizResult(chapterId, score, questions.length);
        soundFX.playLevelUp();
        setShowResults(true);
      }
    }
  };

  return (
    <div className="quest-modal-overlay">
      <div className="quest-quiz-container">
        {!showResults ? (
          <>
            {/* Modal Header */}
            <div>
              <div className="quest-quiz-header">
                <button
                  onClick={onClose}
                  style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--quest-text-primary)' }}
                >
                  <X size={24} />
                </button>

                <div className="quest-quiz-progress-track">
                  <div className="quest-quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>

                <div className="quest-quiz-xp-tag">+15 XP</div>
              </div>

              {/* Difficulty Tier Selector */}
              <div style={{ display: 'flex', gap: '6px', margin: '8px 0 14px 0', overflowX: 'auto', paddingBottom: '2px' }}>
                {[
                  { tier: 0, label: 'All Tiers' },
                  { tier: 1, label: 'Tier 1 · Foundation' },
                  { tier: 2, label: 'Tier 2 · Midterm Calc' },
                  { tier: 3, label: 'Tier 3 · Graduate Rigor' }
                ].map((t) => (
                  <button
                    key={t.tier}
                    onClick={() => {
                      soundFX.playClick();
                      setActiveTierFilter(t.tier as any);
                      setCurrentQuestionIndex(0);
                      setSelectedOption(null);
                      setIsAnswerChecked(false);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--quest-border)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: activeTierFilter === t.tier ? '#13211C' : '#F8FAF6',
                      color: activeTierFilter === t.tier ? '#C9F26B' : 'var(--quest-text-secondary)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--quest-text-muted)' }}>
                  QUESTION {currentQuestionIndex + 1} OF {questions.length}
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: currentQ.tier === 1 ? '#EAF6C9' : currentQ.tier === 2 ? '#FEF3C7' : '#EDE9FE',
                    color: currentQ.tier === 1 ? '#13211C' : currentQ.tier === 2 ? '#92400E' : '#5B21B6'
                  }}
                >
                  {currentQ.tierLabel}
                </span>
              </div>

              {/* Question Title */}
              <h2 className="quest-quiz-question-title">{currentQ.title}</h2>
            </div>

            {/* Options List */}
            <div className="quest-options-stack">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctAnswer;

                let optClass = 'quest-option-btn';
                if (isAnswerChecked) {
                  if (isSelected && isCorrect) optClass += ' correct';
                  else if (isSelected && !isCorrect) optClass += ' incorrect';
                  else if (isCorrect) optClass += ' correct';
                } else if (isSelected) {
                  optClass += ' selected';
                }

                return (
                  <button key={idx} className={optClass} onClick={() => handleSelectOption(idx)}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Socratic Diagnostic Answer Explanation Feedback */}
            {isAnswerChecked && (
              <div
                style={{
                  background: selectedOption === currentQ.correctAnswer ? '#F0F9E8' : '#FEF2F2',
                  border: `1.5px solid ${selectedOption === currentQ.correctAnswer ? '#A3E635' : '#F87171'}`,
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  marginTop: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: selectedOption === currentQ.correctAnswer ? '#15803D' : '#B91C1C' }}>
                  {selectedOption === currentQ.correctAnswer ? (
                    <><CheckCircle2 size={16} /> Correct Answer</>
                  ) : (
                    <><XCircle size={16} /> Diagnostic Feedback</>
                  )}
                </div>
                <div style={{ color: '#1F2937' }}>
                  {currentQ.explanation}
                </div>
                {selectedOption !== currentQ.correctAnswer && (
                  <div style={{ background: 'rgba(255,255,255,0.7)', padding: '8px 10px', borderRadius: '8px', fontSize: '12.5px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} color="#DC2626" />
                    <span><strong>Common Cognitive Trap: </strong> {currentQ.trapExplanation}</span>
                  </div>
                )}
                <div style={{ fontSize: '12px', color: '#374151', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '6px', fontStyle: 'italic' }}>
                  <strong>Formal Invariant: </strong> {currentQ.invariantRule}
                </div>
              </div>
            )}

            {/* Bottom Continue Button (Pinned & Accessible) */}
            <div style={{ position: 'sticky', bottom: '-4px', background: 'var(--quest-bg)', paddingTop: '14px', marginTop: '14px', zIndex: 10, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <button
                className="quest-btn-lime"
                style={{
                  width: '100%',
                  minHeight: '48px',
                  fontSize: '15px',
                  fontWeight: 800,
                  opacity: selectedOption === null ? 0.4 : 1
                }}
                onClick={handleCheckOrContinue}
                disabled={selectedOption === null}
              >
                {isAnswerChecked ? (currentQuestionIndex + 1 < questions.length ? 'Continue' : 'Finish Quiz') : 'Check answer'}
              </button>
            </div>
          </>
        ) : (
          /* Results Screen (Page 29 & 15) */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--quest-text-muted)', textTransform: 'uppercase' }}>
                CHAPTER {chapterId} · INFORMED SEARCH
              </div>
              <h2 className="quest-view-title" style={{ marginTop: '4px' }}>
                Nice work
              </h2>

              <div style={{ margin: '24px 0' }}>
                <div style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '64px', fontWeight: 800, lineHeight: 1 }}>
                  {score}/{questions.length}
                </div>
                <div style={{ fontSize: '15px', color: 'var(--quest-text-secondary)', marginTop: '4px' }}>
                  {Math.round((score / questions.length) * 100)}% correct · 1:12 time taken
                </div>
              </div>

              {/* Rewards Summary Grid */}
              {(() => {
                const passed = (score / questions.length) >= 0.65;
                const earnedXP = score * 30 + (passed ? 100 : 20);
                const nextLevelXP = stats.level * 350;

                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                      <div className="quest-stat-card" style={{ background: 'var(--quest-accent)', color: '#13211C' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>XP EARNED</div>
                        <div style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '32px', fontWeight: 800 }}>+{earnedXP} XP</div>
                      </div>

                      <div className="quest-stat-card" style={{ background: 'var(--quest-card-dark)', color: '#F3F5EF' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--quest-accent)' }}>LEVEL {stats.level}</div>
                        <div style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '20px', fontWeight: 800 }}>
                          {stats.xp.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
                        </div>
                      </div>
                    </div>

                    {/* Mastery Notification */}
                    {passed && (
                      <div
                        className="quest-plan-card"
                        style={{ background: 'var(--quest-card-bg)', border: '2px solid var(--quest-accent)', cursor: 'default' }}
                      >
                        <div className="quest-ch-num done" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {score === questions.length ? <Star size={16} fill="#13211C" /> : <Check size={16} strokeWidth={2.5} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--quest-text-muted)' }}>
                            {score === questions.length ? 'PERFECT ACCURACY' : 'QUIZ PASSED'}
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 800 }}>
                            {score === questions.length ? '100% Concept Mastery (+Bonus XP)' : `Chapter ${chapterId} Mastery Verified`}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                className="quest-btn-outline"
                style={{ flex: 1, minHeight: '50px' }}
                onClick={() => {
                  soundFX.playClick();
                  setCurrentQuestionIndex(0);
                  setSelectedOption(null);
                  setIsAnswerChecked(false);
                  setScore(0);
                  setShowResults(false);
                }}
              >
                Review mistakes
              </button>

              <button
                className="quest-btn-lime"
                style={{ flex: 1, minHeight: '50px' }}
                onClick={() => {
                  soundFX.playClick();
                  onComplete();
                }}
              >
                Next topic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
