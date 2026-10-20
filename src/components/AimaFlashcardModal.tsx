import React, { useState, useMemo, useEffect } from 'react';
import { X, RotateCw, Award, AlertTriangle, BookOpen, ChevronRight, Check } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { useProgress } from '../context/ProgressContext';
import confetti from 'canvas-confetti';
import { renderKaTeX, renderInlineMathAndStyles } from '../utils/mathRenderer';
import { COMPREHENSIVE_EXAM_FLASHCARDS, ExamFlashcard } from '../data/aimaExamFlashcardsData';
import { AIMA_PARTS } from '../data/aimaBookData';

interface AimaFlashcardModalProps {
  onClose: () => void;
  initialCategory?: string;
  initialChapterId?: number;
}

export const AimaFlashcardModal: React.FC<AimaFlashcardModalProps> = ({
  onClose,
  initialCategory,
  initialChapterId
}) => {
  const { addXP } = useProgress();

  // Filters state: Chapter filter & Topic/Trap category filter
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    initialChapterId ? String(initialChapterId) : 'all'
  );
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'all');
  const [onlyTraps, setOnlyTraps] = useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  // Sync initialChapterId if changed
  useEffect(() => {
    if (initialChapterId) {
      setSelectedChapterId(String(initialChapterId));
      setCurrentIndex(0);
      setIsRevealed(false);
      setSessionCompleted(false);
    }
  }, [initialChapterId]);

  // Count cards per chapter for select dropdown
  const cardsPerChapter = useMemo(() => {
    const counts: Record<number, number> = {};
    COMPREHENSIVE_EXAM_FLASHCARDS.forEach((c) => {
      counts[c.chapterId] = (counts[c.chapterId] || 0) + 1;
    });
    return counts;
  }, []);

  const totalTrapsCount = useMemo(() => {
    return COMPREHENSIVE_EXAM_FLASHCARDS.filter((c) => c.isExamTrap).length;
  }, []);

  // Filtered card list based on chapter and category
  const filteredCards = useMemo(() => {
    return COMPREHENSIVE_EXAM_FLASHCARDS.filter((card) => {
      // 1. Chapter filter
      if (selectedChapterId !== 'all' && card.chapterId !== Number(selectedChapterId)) {
        return false;
      }
      // 2. Traps filter
      if (onlyTraps && !card.isExamTrap) {
        return false;
      }
      // 3. Category topic filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'traps' && !card.isExamTrap) return false;
        if (activeCategory !== 'traps' && card.category !== activeCategory) return false;
      }
      return true;
    });
  }, [selectedChapterId, activeCategory, onlyTraps]);

  const currentCard: ExamFlashcard | undefined = filteredCards[currentIndex];
  const progressPercent = filteredCards.length > 0
    ? Math.min(100, Math.round(((currentIndex + 1) / filteredCards.length) * 100))
    : 100;

  const handleNextCard = (rating: 'again' | 'good' | 'easy') => {
    soundFX.playClick();

    if (currentCard && rating === 'easy' && !masteredIds.includes(currentCard.id)) {
      setMasteredIds((prev) => [...prev, currentCard.id]);
    }

    if (currentIndex + 1 < filteredCards.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
    } else {
      // Completed the deck!
      setSessionCompleted(true);
      addXP(35);
      soundFX.playFanfare();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestartDeck = () => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setSessionCompleted(false);
  };

  const handleNextChapterDeck = () => {
    if (selectedChapterId !== 'all') {
      const nextId = Number(selectedChapterId) + 1;
      if (nextId <= 27) {
        setSelectedChapterId(String(nextId));
        setCurrentIndex(0);
        setIsRevealed(false);
        setSessionCompleted(false);
        return;
      }
    }
    // Fallback to all
    setSelectedChapterId('all');
    setCurrentIndex(0);
    setIsRevealed(false);
    setSessionCompleted(false);
  };

  return (
    <div
      className="quest-modal-overlay"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="quest-quiz-container"
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '94vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'var(--quest-card-bg)',
          borderRadius: '24px',
          border: '1px solid var(--quest-border)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          padding: '20px 24px',
          margin: 'auto',
          boxSizing: 'border-box'
        }}
      >
        {/* Header: Title, Counter & Close */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: '#13211C',
                  color: '#C9F26B',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}
              >
                EXAM FLASHCARDS
              </span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                {sessionCompleted || filteredCards.length === 0
                  ? 'Deck Completed'
                  : `${currentIndex + 1} of ${filteredCards.length}`}
              </span>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--quest-bg)',
                border: '1px solid var(--quest-border)',
                cursor: 'pointer',
                color: 'var(--quest-text-primary)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title="Close Flashcards"
            >
              <X size={18} />
            </button>
          </div>

          {/* Grouping Filters: Chapter Select Dropdown + Traps Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
            {/* Chapter Grouping Select */}
            <select
              value={selectedChapterId}
              onChange={(e) => {
                soundFX.playClick();
                setSelectedChapterId(e.target.value);
                setCurrentIndex(0);
                setIsRevealed(false);
                setSessionCompleted(false);
              }}
              style={{
                flex: 1,
                padding: '7px 12px',
                borderRadius: '10px',
                background: 'var(--quest-bg)',
                border: '1px solid var(--quest-border)',
                color: 'var(--quest-text-primary)',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none'
              }}
              title="Group and filter cards by textbook chapter"
            >
              <option value="all">
                📚 All Chapters ({COMPREHENSIVE_EXAM_FLASHCARDS.length} Total Cards)
              </option>

              {AIMA_PARTS.map((part) => (
                <optgroup key={part.id} label={part.title}>
                  {part.chapters.map((ch) => {
                    const cardCount = cardsPerChapter[ch.id] || 0;
                    return (
                      <option key={ch.id} value={String(ch.id)}>
                        Chapter {ch.id}: {ch.title} {cardCount > 0 ? `(${cardCount} cards)` : '(0 cards)'}
                      </option>
                    );
                  })}
                </optgroup>
              ))}
            </select>

            {/* Traps Toggle Button */}
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setOnlyTraps(!onlyTraps);
                setCurrentIndex(0);
                setIsRevealed(false);
                setSessionCompleted(false);
              }}
              style={{
                padding: '7px 12px',
                borderRadius: '10px',
                border: onlyTraps ? '1.5px solid #EF4444' : '1px solid var(--quest-border)',
                background: onlyTraps ? 'rgba(239, 68, 68, 0.12)' : 'var(--quest-bg)',
                color: onlyTraps ? '#DC2626' : 'var(--quest-text-secondary)',
                fontSize: '12px',
                fontWeight: onlyTraps ? 800 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}
              title="Show only high-stakes exam trap cards"
            >
              <AlertTriangle size={13} color={onlyTraps ? '#DC2626' : 'currentColor'} />
              <span>Traps Only ({totalTrapsCount})</span>
            </button>
          </div>

          {/* Quick Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '10px' }}>
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'search', label: 'Search & Heuristics' },
              { id: 'games', label: 'Minimax & Games' },
              { id: 'logic', label: 'Logic & FOL' },
              { id: 'planning', label: 'Planning & HTN' },
              { id: 'probability', label: 'Probability & HMM' },
              { id: 'mdp_rl', label: 'MDP & RL' },
              { id: 'learning', label: 'Machine Learning' },
              { id: 'nlp_vision', label: 'NLP & Vision' },
              { id: 'ethics', label: 'Safety & Ethics' }
            ].map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveCategory(cat.id);
                    setCurrentIndex(0);
                    setIsRevealed(false);
                    setSessionCompleted(false);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #13211C' : '1px solid var(--quest-border)',
                    background: isSelected ? '#13211C' : 'var(--quest-bg)',
                    color: isSelected ? '#C9F26B' : 'var(--quest-text-secondary)',
                    fontSize: '11px',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '4px', background: 'var(--quest-border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '14px' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#C9F26B', transition: 'width 0.2s ease' }} />
          </div>

          {/* Card Body or Completion View */}
          {filteredCards.length === 0 ? (
            /* Empty State for Filter */
            <div
              style={{
                minHeight: '220px',
                background: 'var(--quest-bg)',
                borderRadius: '18px',
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                border: '1px solid var(--quest-border)'
              }}
            >
              <BookOpen size={36} color="var(--quest-text-muted)" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                No Cards Found For This Filter
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--quest-text-muted)' }}>
                Try switching the chapter dropdown to "All Chapters" or turning off the Traps filter.
              </p>
              <button
                onClick={() => {
                  setSelectedChapterId('all');
                  setActiveCategory('all');
                  setOnlyTraps(false);
                  setCurrentIndex(0);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: '#13211C',
                  color: '#C9F26B',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : !sessionCompleted && currentCard ? (
            <div
              onClick={() => {
                soundFX.playClick();
                setIsRevealed(!isRevealed);
              }}
              style={{
                minHeight: '230px',
                background: isRevealed
                  ? (currentCard.isExamTrap ? 'rgba(239, 68, 68, 0.04)' : '#F9FBF8')
                  : 'var(--quest-card-bg)',
                border: isRevealed
                  ? (currentCard.isExamTrap ? '2px solid #EF4444' : '2px solid #13211C')
                  : '1.5px solid var(--quest-border)',
                borderRadius: '18px',
                padding: '20px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      color: currentCard.isExamTrap ? '#DC2626' : 'var(--quest-text-muted)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {currentCard.partTitle} · CH {currentCard.chapterId}: {currentCard.chapterTitle}
                  </span>

                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: currentCard.isExamTrap
                        ? (isRevealed ? '#DC2626' : '#FEE2E2')
                        : (isRevealed ? '#13211C' : '#EAF6C9'),
                      color: currentCard.isExamTrap
                        ? (isRevealed ? '#FFFFFF' : '#B91C1C')
                        : (isRevealed ? '#C9F26B' : '#13211C')
                    }}
                  >
                    {currentCard.isExamTrap
                      ? (isRevealed ? 'TRAP DEFENSE' : '⚠️ EXAM TRAP')
                      : (isRevealed ? 'SOLUTION' : 'PROMPT')}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--quest-font-heading)',
                    fontSize: isRevealed ? '15.5px' : '18.5px',
                    fontWeight: 700,
                    lineHeight: 1.45,
                    color: 'var(--quest-text-primary)',
                    marginTop: '8px'
                  }}
                >
                  {renderInlineMathAndStyles(isRevealed ? currentCard.a : currentCard.q)}
                </div>

                {isRevealed && currentCard.formula && (
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: '#13211C',
                      color: '#C9F26B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflowX: 'auto',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ color: '#C9F26B', fontSize: '15px' }}>
                      {renderKaTeX(currentCard.formula, true)}
                    </div>
                  </div>
                )}

                {isRevealed && currentCard.examTakeaway && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: currentCard.isExamTrap ? 'rgba(239, 68, 68, 0.08)' : 'rgba(201, 242, 107, 0.25)',
                      border: currentCard.isExamTrap ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(19, 33, 28, 0.1)',
                      fontSize: '12px',
                      color: currentCard.isExamTrap ? '#991B1B' : '#13211C',
                      fontWeight: 600,
                      lineHeight: 1.45
                    }}
                  >
                    <strong>🎯 Exam Takeaway: </strong> {renderInlineMathAndStyles(currentCard.examTakeaway)}
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: '16px',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  background: 'var(--quest-bg)',
                  color: 'var(--quest-text-muted)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RotateCw size={12} />
                {isRevealed ? 'Tap to view prompt' : 'Tap anywhere to reveal solution'}
              </div>
            </div>
          ) : (
            /* Session Completed Screen */
            <div
              style={{
                minHeight: '260px',
                background: 'var(--quest-card-bg)',
                borderRadius: '20px',
                padding: '28px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                border: '1.5px solid var(--quest-border)'
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: '#C9F26B',
                  color: '#13211C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}
              >
                <Award size={28} />
              </div>

              <h3 style={{ fontFamily: 'var(--quest-font-heading)', fontSize: '22px', fontWeight: 900, margin: '0 0 6px 0', color: 'var(--quest-text-primary)' }}>
                {selectedChapterId !== 'all' ? `Chapter ${selectedChapterId} Deck Complete!` : 'Full Deck Session Complete!'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--quest-text-muted)', maxWidth: '360px', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                You reviewed <strong>{filteredCards.length} high-yield exam cards</strong>. Active recall cements neural pathways for university midterms and finals.
              </p>

              <div style={{ background: '#EAF6C9', color: '#13211C', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 800, marginBottom: '20px' }}>
                +35 XP Earned
              </div>

              <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '340px' }}>
                <button
                  onClick={handleRestartDeck}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    background: '#13211C',
                    color: '#C9F26B',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Restart Deck
                </button>
                {selectedChapterId !== 'all' && Number(selectedChapterId) < 27 && (
                  <button
                    onClick={handleNextChapterDeck}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(201, 242, 107, 0.25)',
                      color: '#13211C',
                      border: '1px solid #C9F26B',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    Next Chapter <ChevronRight size={14} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'var(--quest-bg)',
                    color: 'var(--quest-text-primary)',
                    border: '1px solid var(--quest-border)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rating Buttons on Active Card */}
        {!sessionCompleted && filteredCards.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexShrink: 0 }}>
            <button
              onClick={() => handleNextCard('again')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: '10px',
                background: 'var(--quest-bg)',
                border: '1px solid var(--quest-border)',
                color: '#EF4444',
                fontWeight: 800,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
              title="Need to review this card again"
            >
              Needs Review
            </button>

            <button
              onClick={() => handleNextCard('good')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: '10px',
                background: 'var(--quest-bg)',
                border: '1px solid var(--quest-border)',
                color: 'var(--quest-text-primary)',
                fontWeight: 800,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
              title="Good recall"
            >
              Good
            </button>

            <button
              onClick={() => handleNextCard('easy')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: '10px',
                background: '#13211C',
                border: '1px solid #13211C',
                color: '#C9F26B',
                fontWeight: 800,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
              title="Mastered this concept"
            >
              Mastered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
