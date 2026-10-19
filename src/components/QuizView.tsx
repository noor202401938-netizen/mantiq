import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Sparkles,
  BookOpen,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import { QUIZZES_DATA } from '../data/quizzesData';
import { AIMA_PARTS } from '../data/aimaBookData';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  chapterId: number;
  onBackToReader: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ chapterId, onBackToReader }) => {
  const { recordQuizResult } = useProgress();
  const questions = QUIZZES_DATA[chapterId] || QUIZZES_DATA[1];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  // Find chapter name
  let chapterTitle = `Chapter ${chapterId}`;
  for (const part of AIMA_PARTS) {
    const found = part.chapters.find((ch) => ch.id === chapterId);
    if (found) {
      chapterTitle = `Chapter ${found.id}: ${found.title}`;
      break;
    }
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    soundFX.playClick();
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctIndex;

    if (isCorrect) {
      soundFX.playCorrect();
      setScore((prev) => prev + 1);
    } else {
      soundFX.playIncorrect();
    }

    setUserAnswers((prev) => [...prev, selectedOption]);
  };

  const handleNextQuestion = () => {
    soundFX.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Finished
      setIsFinished(true);
      const finalScore = selectedOption === currentQ.correctIndex ? score + 1 : score;
      recordQuizResult(chapterId, finalScore, questions.length);

      if (finalScore / questions.length >= 0.65) {
        soundFX.playLevelUp();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRetake = () => {
    soundFX.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setIsFinished(false);
    setUserAnswers([]);
  };

  if (isFinished) {
    const percent = Math.round((score / questions.length) * 100);
    const isPassed = percent >= 65;

    return (
      <div className="quiz-container">
        <div className="quiz-result-card">
          <div className="result-icon-wrapper">
            <Trophy size={48} className={isPassed ? 'text-accent' : 'text-muted'} />
          </div>

          <h2 className="result-title">
            {isPassed ? 'Quiz Mastered!' : 'Keep Reviewing!'}
          </h2>
          <p className="result-subtitle">
            You scored {score} out of {questions.length} questions ({percent}%)
          </p>

          <div className="result-stats-pill">
            <span>XP Earned: <strong>+{score * 30 + (isPassed ? 100 : 20)} XP</strong></span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              Status:{' '}
              {isPassed ? (
                <strong style={{ color: '#166534', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} color="#22C55E" /> PASSED
                </strong>
              ) : (
                <strong style={{ color: '#DC2626', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} color="#DC2626" /> NEEDS PRACTICE
                </strong>
              )}
            </span>
          </div>

          <div className="result-actions">
            <button className="btn-action primary" onClick={handleRetake}>
              <RotateCcw size={16} /> Retake Quiz
            </button>
            <button className="btn-action secondary" onClick={onBackToReader}>
              <BookOpen size={16} /> Return to Chapter Reader
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Top Header */}
      <div className="quiz-header-bar">
        <button className="btn-back" onClick={onBackToReader}>
          <ChevronLeft size={16} /> Back to Chapter
        </button>
        <span className="quiz-chapter-tag">{chapterTitle}</span>
        <span className="quiz-progress-text">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="quiz-question-card">
        <div className="question-meta-row">
          <span className={`difficulty-tag ${currentQ.difficulty}`}>
            {currentQ.difficulty.toUpperCase()}
          </span>
          <span className="ref-tag">{currentQ.bookReference}</span>
        </div>

        <h3 className="question-text">{currentQ.question}</h3>

        {/* Options Grid */}
        <div className="options-grid">
          {currentQ.options.map((opt, idx) => {
            let optClass = 'quiz-option-btn';
            if (selectedOption === idx) optClass += ' selected';
            if (isSubmitted) {
              if (idx === currentQ.correctIndex) optClass += ' correct';
              else if (selectedOption === idx) optClass += ' incorrect';
            }

            return (
              <button
                key={idx}
                className={optClass}
                onClick={() => handleSelectOption(idx)}
                disabled={isSubmitted}
              >
                <span className="option-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                <span className="option-label">{opt}</span>
                {isSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle size={18} className="option-feedback-icon correct" />
                )}
                {isSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                  <XCircle size={18} className="option-feedback-icon incorrect" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box */}
        {isSubmitted && (
          <div className="explanation-card">
            <h4 className="explanation-title">
              <BookOpen size={16} className="text-accent" /> AIMA Source Explanation
            </h4>
            <p className="explanation-text">{currentQ.explanation}</p>
            <span className="explanation-ref">{currentQ.bookReference}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="quiz-card-footer">
          {!isSubmitted ? (
            <button
              className="btn-action primary btn-submit-quiz"
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
            >
              Confirm Answer
            </button>
          ) : (
            <button className="btn-action primary btn-submit-quiz" onClick={handleNextQuestion}>
              {currentIndex < questions.length - 1 ? (
                <>Next Question <ArrowRight size={16} /></>
              ) : (
                <>Finish & View Score <Trophy size={16} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
