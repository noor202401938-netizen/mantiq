import React, { useState } from 'react';
import { Search, Check, Lock, Play, ArrowRight } from 'lucide-react';
import { AIMA_PARTS } from '../data/aimaBookData';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';

interface LearnChaptersViewProps {
  onStartLesson: (chapterId: number) => void;
  onOpenFlashcards?: (chapterId?: number) => void;
}

export const LearnChaptersView: React.FC<LearnChaptersViewProps> = ({
  onStartLesson,
  onOpenFlashcards
}) => {
  const { stats } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically default to the next incomplete chapter (or Chapter 1)
  const allChapters = AIMA_PARTS.flatMap((p) => p.chapters);
  const defaultChapterId = allChapters.find((ch) => !stats.completedChapterIds?.includes(ch.id))?.id || 1;
  const [selectedChapterId, setSelectedChapterId] = useState<number>(defaultChapterId);

  // Find selected chapter
  let selectedChapter = allChapters.find((c) => c.id === selectedChapterId) || allChapters[0];

  // Filter parts/chapters based on search query
  const filteredParts = AIMA_PARTS.map((part) => {
    const matchingChapters = part.chapters.filter(
      (ch) =>
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ch.sections && ch.sections.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())))
    );
    return { ...part, chapters: matchingChapters };
  }).filter((part) => part.chapters.length > 0);

  return (
    <div className="quest-learn-flow">
      {/* View Header */}
      <div className="quest-view-header">
        <div>
          <h1 className="quest-view-title">Chapters</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onOpenFlashcards && (
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onOpenFlashcards(selectedChapterId);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '12px',
                background: '#13211C',
                color: '#C9F26B',
                border: '1px solid rgba(201, 242, 107, 0.4)',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Practice with 43+ university exam flashcards across all 27 chapters"
            >
              <span>🃏 Exam Flashcards (43+)</span>
            </button>
          )}
          <div className="quest-header-level-badge" style={{ background: '#EAF6C9', color: '#13211C', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Check size={13} strokeWidth={2.5} color="#166534" /> Saved offline
          </div>
        </div>
      </div>

      {/* Concept Search Bar */}
      <input
        type="text"
        className="quest-search-bar"
        placeholder="Search concepts: A*, Bayesian network, minimax, MDP..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="quest-learn-layout">
        {/* Left Chapters List Column */}
        <div className="quest-chapters-column">
          {filteredParts.map((part) => (
            <div key={part.id} style={{ marginBottom: '20px' }}>
              <div className="quest-part-header">
                {part.title}
              </div>

              {part.chapters.map((ch) => {
                const isSelected = selectedChapterId === ch.id;
                const isCompleted = stats.completedChapterIds?.includes(ch.id);
                const isUnlocked = ch.id === 1 || stats.completedChapterIds?.includes(ch.id - 1) || isCompleted;
                const isLocked = !isUnlocked;

                return (
                  <div
                    key={ch.id}
                    className={`quest-chapter-card ${isSelected ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                    style={{
                      opacity: isLocked ? 0.6 : 1,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedChapterId(ch.id);
                    }}
                  >
                    <div className={`quest-ch-num ${isCompleted ? 'done' : ''}`} style={isLocked ? { background: '#E2E8E4', color: '#6B7280' } : {}}>
                      {isCompleted ? <Check size={16} strokeWidth={2.5} /> : isLocked ? <Lock size={15} /> : ch.id}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="quest-ch-title">{ch.title}</div>
                      <div className="quest-ch-sub">
                        {isCompleted
                          ? 'Completed · Exam Ready'
                          : isUnlocked
                          ? 'Available to study · ~12 min'
                          : `Locked · Complete Ch ${ch.id - 1} first`}
                      </div>
                    </div>

                    {isLocked ? (
                      <Lock size={16} color="var(--quest-text-muted)" />
                    ) : (
                      <ArrowRight size={18} color={isSelected ? '#C9F26B' : 'var(--quest-text-muted)'} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right Chapter Detail Pane (Page 25 specification) */}
        <div className="quest-detail-pane">
          {(() => {
            const isSelectedCompleted = stats.completedChapterIds?.includes(selectedChapter.id);
            const isSelectedUnlocked = selectedChapter.id === 1 || stats.completedChapterIds?.includes(selectedChapter.id - 1) || isSelectedCompleted;
            const isSelectedLocked = !isSelectedUnlocked;

            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="quest-detail-kicker">CHAPTER {selectedChapter.id}</div>
                    <h2 className="quest-detail-title">{selectedChapter.title}</h2>
                    <div style={{ fontSize: '14px', color: 'var(--quest-text-muted)', marginTop: '4px' }}>
                      {selectedChapter.sections ? selectedChapter.sections.length : 4} topics · {selectedChapter.pageRange}
                    </div>
                  </div>
                </div>

                {/* Prominent Prerequisite Banner for Locked Chapters */}
                {isSelectedLocked && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#B91C1C',
                      fontSize: '13px',
                      fontWeight: 700,
                      marginTop: '16px'
                    }}
                  >
                    <Lock size={16} style={{ flexShrink: 0 }} />
                    <span>
                      Chapter {selectedChapter.id} is locked. Complete Chapter {selectedChapter.id - 1} to unlock this curriculum and its exam quizzes.
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  {(selectedChapter.sections || ['Core Formalism & Intuition', 'Algorithmic Methods', 'Theoretical Bounds & Proofs', 'Empirical Benchmarks']).map((sectionTitle, idx) => {
                    const topicNum = `${selectedChapter.id}.${idx + 1}`;
                    const isChapterDone = stats.completedChapterIds?.includes(selectedChapter.id);
                    const isTopicDone = isChapterDone;
                    const isTopicActive = !isChapterDone && idx === 0 && !isSelectedLocked;

                    return (
                      <div
                        key={idx}
                        className={`quest-topic-item ${isTopicActive ? 'active' : ''}`}
                        style={isSelectedLocked ? { opacity: 0.55, cursor: 'not-allowed' } : {}}
                        onClick={() => {
                          if (isSelectedLocked) {
                            soundFX.playWrong();
                            return;
                          }
                          soundFX.playClick();
                          onStartLesson(selectedChapter.id);
                        }}
                      >
                        <div
                          className="quest-topic-badge"
                          style={
                            isTopicDone
                              ? { background: 'var(--quest-accent)' }
                              : isSelectedLocked
                              ? { background: '#E2E8E4', color: '#6B7280' }
                              : { background: '#CBD5CD' }
                          }
                        >
                          {isTopicDone ? <Check size={16} strokeWidth={3} /> : isSelectedLocked ? <Lock size={13} /> : topicNum}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div className="quest-topic-title">{sectionTitle}</div>
                          <div className="quest-topic-sub">
                            {isTopicDone
                              ? 'Topic completed'
                              : isSelectedLocked
                              ? `Locked · Complete Chapter ${selectedChapter.id - 1} first`
                              : 'AIMA curriculum coverage · ~10 min'}
                          </div>
                        </div>

                        {isSelectedLocked ? (
                          <Lock size={14} color="var(--quest-text-muted)" />
                        ) : (
                          <ArrowRight size={16} color={isTopicActive ? '#C9F26B' : 'var(--quest-text-muted)'} />
                        )}
                      </div>
                    );
                  })}

                  {/* Chapter Quiz Trigger */}
                  <div
                    className="quest-topic-item"
                    style={{
                      background: 'var(--quest-card-bg)',
                      borderStyle: 'dashed',
                      opacity: isSelectedLocked ? 0.5 : 1,
                      cursor: isSelectedLocked ? 'not-allowed' : 'pointer'
                    }}
                    onClick={() => {
                      if (isSelectedLocked) {
                        soundFX.playWrong();
                        return;
                      }
                      soundFX.playClick();
                      onStartLesson(selectedChapter.id);
                    }}
                  >
                    <div className="quest-topic-badge" style={{ background: isSelectedLocked ? '#E2E8E4' : '#13211C', color: isSelectedLocked ? '#6B7280' : '#C9F26B' }}>
                      {isSelectedLocked ? <Lock size={13} /> : 'Q'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="quest-topic-title">Chapter assessment</div>
                      <div className="quest-topic-sub">
                        {isSelectedLocked
                          ? `Locked · Complete Chapter ${selectedChapter.id - 1} first`
                          : 'Midterm exam questions · +35 XP'}
                      </div>
                    </div>
                    {isSelectedLocked ? (
                      <Lock size={14} color="var(--quest-text-muted)" />
                    ) : (
                      <Play size={16} fill="var(--quest-text-primary)" />
                    )}
                  </div>
                </div>

                {/* Primary Action Button */}
                {isSelectedLocked ? (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      minHeight: '52px',
                      marginTop: '16px',
                      fontSize: '15px',
                      fontWeight: 800,
                      borderRadius: '16px',
                      border: '1px solid var(--quest-border)',
                      background: 'var(--quest-card-bg)',
                      color: 'var(--quest-text-muted)',
                      cursor: 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Lock size={17} /> Locked · Complete Chapter {selectedChapter.id - 1} to Unlock
                  </button>
                ) : (
                  <button
                    className="quest-btn-lime"
                    style={{ width: '100%', minHeight: '52px', marginTop: '16px', fontSize: '16px' }}
                    onClick={() => {
                      soundFX.playClick();
                      onStartLesson(selectedChapter.id);
                    }}
                  >
                    {isSelectedCompleted
                      ? `Review Chapter ${selectedChapter.id}`
                      : `Study Chapter ${selectedChapter.id}`}
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
