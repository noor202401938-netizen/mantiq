import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Circle,
  FlaskConical,
  ChevronDown,
  ChevronRight,
  X,
  BookOpen,
  Sparkles,
  Zap
} from 'lucide-react';
import { AIMA_PARTS } from '../data/aimaBookData';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChapterId: number;
  onSelectChapter: (id: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedChapterId,
  onSelectChapter
}) => {
  const { progress } = useProgress();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'labs' | 'essential'>('all');
  const [expandedParts, setExpandedParts] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true
  });

  const togglePart = (partId: number) => {
    soundFX.playClick();
    setExpandedParts((prev) => ({ ...prev, [partId]: !prev[partId] }));
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-row">
            <div className="sidebar-brand-label">
              <span className="sidebar-brand-dot"></span>
              <span>Course Syllabus</span>
            </div>
            <span className="sidebar-total-badge">27 Chapters</span>
            <button className="btn-icon mobile-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Search Box */}
          <div className="search-bar-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search concepts, algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery ? (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            ) : (
              <span className="search-kbd-badge">⌘K</span>
            )}
          </div>

          {/* Clean Segmented Filter Chips */}
          <div className="sidebar-filter-tabs">
            <button
              className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-chip ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              Done
            </button>
            <button
              className={`filter-chip ${activeFilter === 'labs' ? 'active' : ''}`}
              onClick={() => setActiveFilter('labs')}
            >
              <FlaskConical size={11} /> Labs
            </button>
            <button
              className={`filter-chip ${activeFilter === 'essential' ? 'active' : ''}`}
              onClick={() => setActiveFilter('essential')}
            >
              <Zap size={11} /> Exam High
            </button>
          </div>
        </div>

        {/* Tree List */}
        <div className="sidebar-content">
          {AIMA_PARTS.map((part) => {
            const filteredChapters = part.chapters.filter((ch) => {
              const matchesSearch =
                ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ch.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ch.sections.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

              if (!matchesSearch) return false;

              if (activeFilter === 'completed') return progress[ch.id]?.read;
              if (activeFilter === 'labs') return ch.hasSimulation;
              if (activeFilter === 'essential') return ch.examWeight === 'Essential';
              return true;
            });

            if (filteredChapters.length === 0) return null;
            const isExpanded = expandedParts[part.id] ?? true;
            const completedCount = filteredChapters.filter((ch) => progress[ch.id]?.read).length;

            return (
              <div key={part.id} className="part-accordion-item">
                <div className="part-accordion-header" onClick={() => togglePart(part.id)}>
                  <div className="part-header-info">
                    <span className="part-chevron">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                    <span className="part-indicator-dot" style={{ backgroundColor: part.color }}></span>
                    <span className="part-title-text">{part.title.split(': ')[1] || part.title}</span>
                  </div>
                  <span className="part-progress-badge">
                    {completedCount}/{filteredChapters.length}
                  </span>
                </div>

                {isExpanded && (
                  <div className="part-chapters-list">
                    {filteredChapters.map((ch) => {
                      const isSelected = ch.id === selectedChapterId;
                      const chProgress = progress[ch.id];
                      const isRead = chProgress?.read;
                      const isQuizPassed = chProgress?.quizPassed;

                      return (
                        <div
                          key={ch.id}
                          className={`chapter-list-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            soundFX.playClick();
                            onSelectChapter(ch.id);
                            if (window.innerWidth < 1024) onClose();
                          }}
                        >
                          <div className="chapter-card-top">
                            <span className="chapter-num">
                              {String(ch.id).padStart(2, '0')}
                            </span>
                            <div className="chapter-tags">
                              {ch.hasSimulation && (
                                <span className="tag-lab" title="Interactive Simulation Lab">
                                  <FlaskConical size={10} /> Lab
                                </span>
                              )}
                              <span className={`tag-weight ${ch.examWeight.toLowerCase()}`}>
                                {ch.examWeight}
                              </span>
                            </div>
                          </div>

                          <div className="chapter-card-title">{ch.title}</div>
                          <div className="chapter-card-subtitle">{ch.subtitle}</div>

                          <div className="chapter-card-footer">
                            <span className="chapter-pages">{ch.pageRange}</span>
                            <div className="chapter-status-icons">
                              {isRead ? (
                                <CheckCircle2 size={13} className="icon-completed" />
                              ) : (
                                <Circle size={13} className="icon-pending" />
                              )}
                              {chProgress?.quizScore !== undefined && (
                                <span className={`quiz-mini-pill ${isQuizPassed ? 'passed' : 'attempted'}`}>
                                  Q: {chProgress.quizScore}/{chProgress.quizTotal}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
