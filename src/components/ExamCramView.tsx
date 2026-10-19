import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Filter,
  Layers
} from 'lucide-react';
import { FLASHCARDS_DATA } from '../data/flashcardsData';
import { soundFX } from '../utils/soundEffects';

export const ExamCramView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const categories = ['All', ...Array.from(new Set(FLASHCARDS_DATA.map((fc) => fc.category)))];

  const filteredCards = FLASHCARDS_DATA.filter((fc) => {
    if (selectedCategory === 'All') return true;
    return fc.category === selectedCategory;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleFlip = () => {
    soundFX.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    soundFX.playClick();
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    soundFX.playClick();
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleMastered = (id: string) => {
    soundFX.playCorrect();
    setMasteredIds((prev) => new Set(prev).add(id));
    handleNext();
  };

  return (
    <div className="cram-container">
      <div className="cram-header">
        <div>
          <h2 className="cram-title">AIMA Exam Cram Flashcards</h2>
          <p className="cram-subtitle">
            High-yield active recall definitions, proofs, and formulas for your upcoming exam.
          </p>
        </div>

        <div className="cram-filters-row">
          <Filter size={16} className="text-muted" />
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="cram-stats-bar">
        <span>
          Card {currentIndex + 1} of {filteredCards.length}
        </span>
        <span>
          Mastered: <strong>{masteredIds.size} / {FLASHCARDS_DATA.length}</strong>
        </span>
      </div>

      {/* 3D Flashcard Deck */}
      <div className="flashcard-scene" onClick={handleFlip}>
        <div className={`flashcard-3d ${isFlipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="card-face card-front">
            <span className="card-tag">Ch {currentCard.chapterId} • {currentCard.category}</span>
            <div className="card-content-center">
              <h3 className="card-prompt">{currentCard.front}</h3>
              <span className="card-tap-hint">Click card to reveal answer</span>
            </div>
          </div>

          {/* Back */}
          <div className="card-face card-back">
            <span className="card-tag">Answer & Explanation</span>
            <div className="card-content-center">
              <p className="card-answer">{currentCard.back}</p>
              {currentCard.formula && (
                <div className="card-formula-pill">
                  <code>{currentCard.formula}</code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="cram-controls">
        <button className="btn-action secondary" onClick={handlePrev} disabled={currentIndex === 0}>
          <ArrowLeft size={16} /> Previous
        </button>

        <button
          className="btn-action primary"
          onClick={() => handleMastered(currentCard.id)}
        >
          <Check size={16} /> Mark as Mastered
        </button>

        <button className="btn-action secondary" onClick={handleNext}>
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
