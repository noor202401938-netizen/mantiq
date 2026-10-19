import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  Lock,
  Star,
  Sparkles,
  Trophy,
  Gift,
  Flame,
  Zap,
  HelpCircle,
  FlaskConical,
  Compass,
  ArrowRight,
  Gem
} from 'lucide-react';
import { AIMA_PARTS } from '../data/aimaBookData';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';
import { AimaMascot } from './AimaMascot';

interface DuolingoPathProps {
  onStartLesson: (chapterId: number) => void;
  onOpenReader: (chapterId: number) => void;
  onOpenFlashcards: () => void;
}

export const DuolingoPath: React.FC<DuolingoPathProps> = ({
  onStartLesson,
  onOpenReader,
  onOpenFlashcards
}) => {
  const { stats, progress, claimChest } = useProgress();
  const [activePopoverChapter, setActivePopoverChapter] = useState<number | null>(3);
  const [chestModal, setChestModal] = useState<{ gems: number; xp: number } | null>(null);

  // Winding horizontal offsets (px relative to center)
  const getOffset = (index: number) => {
    const pattern = [0, -45, -75, -45, 0, 45, 75, 45];
    return pattern[index % pattern.length];
  };

  const handleNodeClick = (chapterId: number, isLocked: boolean) => {
    soundFX.playClick();
    if (isLocked) return;
    setActivePopoverChapter((prev) => (prev === chapterId ? null : chapterId));
  };

  const handleClaimChest = (chestId: number) => {
    const reward = claimChest(chestId);
    if (reward) {
      setChestModal(reward);
    }
  };

  return (
    <div className="duo-path-page">
      {/* Chest Reward Modal */}
      {chestModal && (
        <div className="duo-lesson-modal-overlay" onClick={() => setChestModal(null)}>
          <div className="duo-chest-modal" onClick={(e) => e.stopPropagation()}>
            <div className="chest-icon-giant" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gift size={56} color="#C9F26B" />
            </div>
            <h2>Chest Unlocked!</h2>
            <p>You opened an AIMA Knowledge Stash!</p>
            <div className="chest-rewards-row">
              <div className="chest-reward-chip gems" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                +{chestModal.gems} <Gem size={14} color="#06B6D4" /> Gems
              </div>
              <div className="chest-reward-chip xp" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                +{chestModal.xp} <Zap size={14} color="#EAB308" /> XP
              </div>
            </div>
            <button className="duo-button-primary-large" onClick={() => setChestModal(null)}>
              AWESOME!
            </button>
          </div>
        </div>
      )}

      {/* Units Loop */}
      <div className="duo-units-column">
        {AIMA_PARTS.map((part, partIndex) => {
          return (
            <div key={part.id} className="duo-unit-section">
              {/* Unit Header Banner */}
              <div
                className="duo-unit-banner"
                style={{
                  backgroundColor: part.color || '#58CC02'
                }}
              >
                <div className="unit-banner-info">
                  <span className="unit-step-label">UNIT {part.id}</span>
                  <h2 className="unit-title">{part.title.replace('Part ' + part.id + ': ', '')}</h2>
                  <p className="unit-desc">{part.description}</p>
                </div>

                <button
                  className="unit-guidebook-btn"
                  onClick={() => onOpenReader(part.chapters[0].id)}
                  title="Open Textbook Guidebook for this Unit"
                >
                  <BookOpen size={18} />
                  <span>GUIDEBOOK</span>
                </button>
              </div>

              {/* Stepping Stones Winding Path */}
              <div className="duo-stepping-stones">
                {part.chapters.map((chapter, chIdx) => {
                  const offset = getOffset(chIdx);
                  const isCompleted = stats.completedChapterIds?.includes(chapter.id);
                  // Chapter 1 is unlocked initially; subsequent chapters unlock upon completing the previous chapter
                  const isUnlocked =
                    chapter.id === 1 ||
                    stats.completedChapterIds?.includes(chapter.id - 1);
                  const isCurrent = !isCompleted && isUnlocked;
                  const isLocked = !isUnlocked && !isCompleted;
                  const isPopoverOpen = activePopoverChapter === chapter.id;

                  return (
                    <div
                      key={chapter.id}
                      className="duo-path-node-wrapper"
                      style={{
                        transform: `translateX(${offset}px)`
                      }}
                    >
                      {/* Mascot beside current node */}
                      {isCurrent && (
                        <div className="duo-path-mascot-anchor">
                          <AimaMascot
                            mood="idle"
                            speech={`Let's dive into Chapter ${chapter.id}!`}
                            size="sm"
                          />
                        </div>
                      )}

                      {/* The 3D Tactile Circular Button */}
                      <div className="node-button-container">
                        <button
                          className={`duo-node-btn ${
                            isCompleted
                              ? 'completed'
                              : isCurrent
                              ? 'active'
                              : 'locked'
                          } ${chapter.hasSimulation ? 'sim-node' : ''}`}
                          onClick={() => handleNodeClick(chapter.id, isLocked)}
                          aria-label={`Chapter ${chapter.id}: ${chapter.title}`}
                        >
                          {isCurrent && <div className="active-pulse-ring" />}

                          <div className="node-icon-inner">
                            {isCompleted ? (
                              <Check size={32} strokeWidth={3.5} />
                            ) : isLocked ? (
                              <Lock size={28} strokeWidth={2.5} />
                            ) : chapter.hasSimulation ? (
                              <FlaskConical size={32} strokeWidth={2.5} />
                            ) : (
                              <Star size={32} strokeWidth={2.5} />
                            )}
                          </div>
                        </button>

                        {/* Node Label Badge */}
                        <div className="node-label-pill">
                          <span>Ch {chapter.id}</span>
                        </div>
                      </div>

                      {/* Interactive Popover Card */}
                      {isPopoverOpen && !isLocked && (
                        <div className="duo-node-popover">
                          <div className="popover-arrow" />
                          <div className="popover-header">
                            <span className="popover-badge">
                              {chapter.hasSimulation ? 'Interactive Lab' : 'Core Lesson'}
                            </span>
                            <h4>
                              Ch {chapter.id}: {chapter.title}
                            </h4>
                            <p>{chapter.subtitle}</p>
                          </div>

                          <div className="popover-rewards-row">
                            <span className="pop-chip xp">+35 XP</span>
                            <span className="pop-chip gems" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>+15 <Gem size={12} color="#06B6D4" /></span>
                            <span className="pop-chip time">~4 mins</span>
                          </div>

                          <div className="popover-actions">
                            <button
                              className="duo-button-primary"
                              onClick={() => {
                                setActivePopoverChapter(null);
                                onStartLesson(chapter.id);
                              }}
                            >
                              START LESSON
                            </button>

                            <button
                              className="duo-button-secondary"
                              onClick={() => {
                                setActivePopoverChapter(null);
                                onOpenReader(chapter.id);
                              }}
                              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <BookOpen size={14} /> Read Book Notes
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Milestone Chest Node every few chapters */}
                      {chIdx === 1 && (
                        <div
                          className="duo-milestone-chest"
                          style={{
                            transform: `translateX(${-offset * 0.7}px)`
                          }}
                        >
                          <button
                            className={`chest-button ${
                              stats.claimedChests?.includes(part.id * 10) ? 'opened' : 'unopened'
                            }`}
                            onClick={() => handleClaimChest(part.id * 10)}
                            title="Click to claim Knowledge Bonus!"
                          >
                            <Gift size={32} />
                            <span className="chest-tag">
                              {stats.claimedChests?.includes(part.id * 10) ? 'Claimed' : 'Free Stash'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Unit Completion Trophy */}
                <div className="duo-unit-trophy-node">
                  <div className="trophy-circle">
                    <Trophy size={36} />
                  </div>
                  <span className="trophy-label">Unit {part.id} Mastery</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
