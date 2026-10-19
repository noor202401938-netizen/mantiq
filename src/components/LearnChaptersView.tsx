import React, { useState } from 'react';
import { Search, Check, Lock, Play, FlaskConical, ArrowRight } from 'lucide-react';
import { AIMA_PARTS } from '../data/aimaBookData';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';

interface LearnChaptersViewProps {
  onStartLesson: (chapterId: number) => void;
  onOpenLab: (chapterId: number) => void;
}

export const LearnChaptersView: React.FC<LearnChaptersViewProps> = ({
  onStartLesson,
  onOpenLab
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
        <div className="quest-header-level-badge" style={{ background: '#EAF6C9', color: '#13211C', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Check size={13} strokeWidth={2.5} color="#166534" /> Saved offline
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
                const isUnlocked = ch.id === 1 || stats.completedChapterIds?.includes(ch.id - 1);
                const isLocked = !isUnlocked && !isCompleted;

                return (
                  <div
                    key={ch.id}
                    className={`quest-chapter-card ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedChapterId(ch.id);
                    }}
                  >
                    <div className={`quest-ch-num ${isCompleted ? 'done' : ''}`}>
                      {isCompleted ? <Check size={16} strokeWidth={2.5} /> : isLocked ? <Lock size={16} /> : ch.id}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div className="quest-ch-title">{ch.title}</div>
                      <div className="quest-ch-sub">
                        {isCompleted
                          ? 'Completed · Exam Ready'
                          : isUnlocked
                          ? 'Available to study · ~12 min'
                          : `Locked · Complete Ch ${ch.id - 1} first`}
                      </div>
                    </div>

                    <ArrowRight size={18} color={isSelected ? '#C9F26B' : 'var(--quest-text-muted)'} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right Chapter Detail Pane (Page 25 specification) */}
        <div className="quest-detail-pane">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="quest-detail-kicker">CHAPTER {selectedChapter.id}</div>
              <h2 className="quest-detail-title">{selectedChapter.title}</h2>
              <div style={{ fontSize: '14px', color: 'var(--quest-text-muted)', marginTop: '4px' }}>
                {selectedChapter.sections ? selectedChapter.sections.length : 4} topics · {selectedChapter.pageRange}
              </div>
            </div>

            {selectedChapter.hasSimulation && (
              <button
                className="quest-btn-outline"
                style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => {
                  soundFX.playClick();
                  onOpenLab(selectedChapter.id);
                }}
              >
                <FlaskConical size={16} /> Interactive Lab
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {(selectedChapter.sections || ['Core Formalism & Intuition', 'Algorithmic Methods', 'Theoretical Bounds & Proofs', 'Empirical Benchmarks']).map((sectionTitle, idx) => {
              const topicNum = `${selectedChapter.id}.${idx + 1}`;
              const isChapterDone = stats.completedChapterIds?.includes(selectedChapter.id);
              const isTopicDone = isChapterDone;
              const isTopicActive = !isChapterDone && idx === 0;

              return (
                <div
                  key={idx}
                  className={`quest-topic-item ${isTopicActive ? 'active' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    onStartLesson(selectedChapter.id);
                  }}
                >
                  <div className="quest-topic-badge" style={isTopicDone ? { background: 'var(--quest-accent)' } : { background: '#CBD5CD' }}>
                    {isTopicDone ? <Check size={16} strokeWidth={3} /> : topicNum}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="quest-topic-title">{sectionTitle}</div>
                    <div className="quest-topic-sub">
                      {isTopicDone ? 'Topic completed' : 'AIMA curriculum coverage · ~10 min'}
                    </div>
                  </div>

                  <ArrowRight size={16} color={isTopicActive ? '#C9F26B' : 'var(--quest-text-muted)'} />
                </div>
              );
            })}

            {/* Chapter Quiz Trigger */}
            <div
              className="quest-topic-item"
              style={{ background: 'var(--quest-card-bg)', borderStyle: 'dashed' }}
              onClick={() => {
                soundFX.playClick();
                onStartLesson(selectedChapter.id);
              }}
            >
              <div className="quest-topic-badge" style={{ background: '#13211C', color: '#C9F26B' }}>
                Q
              </div>
              <div style={{ flex: 1 }}>
                <div className="quest-topic-title">Chapter assessment</div>
                <div className="quest-topic-sub">Midterm exam questions · +35 XP</div>
              </div>
              <Play size={16} fill="var(--quest-text-primary)" />
            </div>
          </div>

          <button
            className="quest-btn-lime"
            style={{ width: '100%', minHeight: '52px', marginTop: '16px', fontSize: '16px' }}
            onClick={() => {
              soundFX.playClick();
              onStartLesson(selectedChapter.id);
            }}
          >
            {stats.completedChapterIds?.includes(selectedChapter.id)
              ? `Review Chapter ${selectedChapter.id}`
              : `Study Chapter ${selectedChapter.id}`}
          </button>
        </div>
      </div>
    </div>
  );
};
