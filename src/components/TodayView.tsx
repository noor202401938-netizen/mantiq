import React from 'react';
import { Play, Check, Flame, ArrowRight, BookOpen, FlaskConical, Sparkles, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { AIMA_PARTS } from '../data/aimaBookData';
import { soundFX } from '../utils/soundEffects';

interface TodayViewProps {
  onStartLesson: (chapterId: number) => void;
  onOpenStudy: () => void;
  onOpenReader: (chapterId: number) => void;
  onOpenLab: (chapterId: number) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  onStartLesson,
  onOpenStudy,
  onOpenReader,
  onOpenLab
}) => {
  const { stats, progress, completeDailyChallenge } = useProgress();
  const { user } = useAuth();

  // Active chapter is Chapter 3 by default or the next incomplete chapter
  const activeChapterId = stats.completedChapterIds?.includes(3) ? 4 : 3;
  let activeChapter = AIMA_PARTS[0].chapters[0];
  for (const part of AIMA_PARTS) {
    const found = part.chapters.find((c) => c.id === activeChapterId);
    if (found) {
      activeChapter = found;
      break;
    }
  }

  const streakDays = stats.streakDays ?? 0;

  const handlePlanClick = (action: string) => {
    soundFX.playClick();
    if (action === 'flashcards') onOpenStudy();
    else if (action === 'lab') onOpenLab(3);
    else if (action === 'quiz') onStartLesson(activeChapterId);
    else if (action === 'reader') onOpenReader(activeChapterId);
  };

  return (
    <div className="today-view-flow">
      {/* Greeting & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="design-greeting-sub">Good morning, {user.name.split(' ')[0]}</div>
          <h1 className="design-view-title">Today’s focus</h1>
        </div>

        <button className="design-streak-pill" onClick={completeDailyChallenge} title="Keep daily streak active!">
          <Flame size={16} /> {streakDays}-day streak
        </button>
      </div>

      {/* Hero Continue Card */}
      <div className="design-hero-card">
        <div className="design-hero-kicker">Continue</div>
        <div className="design-hero-title">
          Ch {activeChapter.id}: {activeChapter.title}
        </div>
        <div className="design-hero-meta">
          {activeChapter.subtitle} · 12 min left
        </div>

        <div className="design-progress-bar-track">
          <div className="design-progress-bar-fill" style={{ width: '45%' }} />
        </div>

        <button
          className="design-btn-resume"
          onClick={() => {
            soundFX.playClick();
            onStartLesson(activeChapter.id);
          }}
        >
          <Play size={18} fill="#13211C" /> Resume lesson
        </button>
      </div>

      {/* Today's plan section */}
      <h2 className="design-section-title">Today’s plan</h2>

      <div className="design-plan-card" onClick={() => handlePlanClick('flashcards')}>
        <span className="design-plan-check checked">
          <Check size={14} strokeWidth={3} />
        </span>
        <span className="design-plan-text">Review 10 flashcards</span>
        <span className="design-plan-badge">Done</span>
      </div>

      <div className="design-plan-card" onClick={() => handlePlanClick('lab')}>
        <span className="design-plan-check"></span>
        <span className="design-plan-text">Explore A* Search interactive lab</span>
        <span className="design-plan-badge" style={{ background: '#EAF6C9' }}>Lab</span>
      </div>

      <div className="design-plan-card" onClick={() => handlePlanClick('quiz')}>
        <span className="design-plan-check"></span>
        <span className="design-plan-text">Take a 5-question quiz</span>
        <span className="design-plan-badge" style={{ background: '#EAF6C9' }}>Quiz</span>
      </div>

      <div className="design-plan-card" onClick={() => handlePlanClick('reader')}>
        <span className="design-plan-check"></span>
        <span className="design-plan-text">Read textbook Chapter {activeChapter.id} notes</span>
        <span className="design-plan-badge" style={{ background: '#EAF6C9' }}>Notes</span>
      </div>

      {/* Curriculum Units & Chapters */}
      <div className="design-path-section">
        <h2 className="design-section-title">AIMA 3rd Edition Curriculum</h2>

        {AIMA_PARTS.slice(0, 3).map((part) => (
          <div key={part.id} className="design-unit-card">
            <div className="design-unit-header">
              <div>
                <span className="unit-kicker">UNIT {part.id}</span>
                <h3 className="unit-heading">{part.title.replace('Part ' + part.id + ': ', '')}</h3>
              </div>
              <button
                className="unit-guide-btn"
                onClick={() => onOpenReader(part.chapters[0].id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <BookOpen size={14} /> Guidebook
              </button>
            </div>

            <div className="unit-chapters-row">
              {part.chapters.map((ch) => {
                const isMastered = stats.completedChapterIds?.includes(ch.id);

                return (
                  <div
                    key={ch.id}
                    className="design-ch-item"
                    onClick={() => {
                      soundFX.playClick();
                      onStartLesson(ch.id);
                    }}
                  >
                    <div className="ch-item-left">
                      <div className="ch-item-num" style={isMastered ? { background: '#C9F26B', color: '#13211C' } : {}}>
                        {isMastered ? <Check size={14} strokeWidth={2.5} /> : ch.id}
                      </div>
                      <div>
                        <div className="ch-item-title">{ch.title}</div>
                        <div className="ch-item-sub">{ch.pageRange} {ch.hasSimulation ? '· Lab available' : ''}</div>
                      </div>
                    </div>

                    <ArrowRight size={18} color="#4D5F55" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
