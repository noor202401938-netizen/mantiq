import React from 'react';
import { Play, Check, Flame, Trophy, Clock, BookOpen, Sparkles, ChevronRight, Zap, ArrowRight } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';
import { AIMA_PARTS } from '../data/aimaBookData';

interface HomeFocusViewProps {
  onStartLesson: (chapterId: number) => void;
  onOpenFlashcards: () => void;
  onOpenRanks: () => void;
}

export const HomeFocusView: React.FC<HomeFocusViewProps> = ({
  onStartLesson,
  onOpenFlashcards,
  onOpenRanks
}) => {
  const { stats, progress, completeDailyChallenge } = useProgress();
  const { user } = useAuth();

  const streakDays = stats.streakDays;
  const userXP = stats.xp;
  const userLevel = stats.level;

  const allChapters = AIMA_PARTS.flatMap((p) => p.chapters);
  const totalChapters = allChapters.length;
  const completedChaptersCount = stats.completedChapterIds.length;
  const coveragePercent = Math.min(100, Math.round((completedChaptersCount / totalChapters) * 100));

  // Determine active/resume chapter dynamically
  const resumeChapter = allChapters.find((ch) => !stats.completedChapterIds.includes(ch.id)) || allChapters[0];
  const resumePart = AIMA_PARTS.find((p) => p.id === resumeChapter.partId) || AIMA_PARTS[0];

  // Dynamic exam countdown
  const daysRemaining = user?.targetExamDate
    ? Math.max(1, Math.ceil((new Date(user.targetExamDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 14;

  // Identify weak concepts from quiz history or upcoming chapters
  const quizScores = Object.values(progress).filter((p) => typeof p.quizTotal === 'number' && p.quizTotal > 0 && typeof p.quizScore === 'number');
  const lowestQuiz = quizScores.sort((a, b) => ((a.quizScore ?? 0) / (a.quizTotal ?? 1)) - ((b.quizScore ?? 0) / (b.quizTotal ?? 1)))[0];
  const weakChapter = lowestQuiz ? allChapters.find((c) => c.id === lowestQuiz.chapterId) : resumeChapter;
  const weakConcept1 = weakChapter?.keyConcepts?.[0]?.title || 'Belief states';
  const weakPct1 = lowestQuiz && lowestQuiz.quizTotal ? Math.round(((lowestQuiz.quizScore ?? 0) / lowestQuiz.quizTotal) * 100) : 45;
  const weakConcept2 = weakChapter?.keyConcepts?.[1]?.title || 'AND-OR search';
  const weakPct2 = Math.max(25, weakPct1 - 18);

  return (
    <div className="quest-home-flow">
      {/* View Header */}
      <div className="quest-view-header" style={{ marginBottom: '22px' }}>
        <div>
          <div className="quest-greeting-sub" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--quest-text-muted)' }}>
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Scholar'}
          </div>
          <h1 className="quest-view-title" style={{ fontSize: '28px', marginTop: '2px' }}>
            Today’s Focus
          </h1>
        </div>

        <div className="quest-header-level-badge" style={{ fontSize: '13px', padding: '6px 14px' }}>
          <Sparkles size={14} style={{ color: 'var(--quest-accent-text, #13211C)' }} />
          Level {userLevel} · {userXP.toLocaleString()} XP
        </div>
      </div>

      {/* Top Grid: Hero Card + Daily Challenge */}
      <div className="quest-home-grid" style={{ marginBottom: '24px' }}>
        {/* Continue Chapter Card */}
        <div className="quest-hero-card">
          <div className="quest-hero-kicker">
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--quest-accent)' }} />
            CONTINUE · CHAPTER {resumeChapter.id}
          </div>
          <h2 className="quest-hero-title">{resumeChapter.title}</h2>
          <div className="quest-hero-subtitle">{resumeChapter.subtitle} · ~12 min read & practice</div>

          <div style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#C9D3CC', marginBottom: '6px', fontWeight: 600 }}>
              <span>Course Coverage</span>
              <span>{coveragePercent}% ({completedChaptersCount}/{totalChapters} completed)</span>
            </div>
            <div className="quest-hero-progress-track">
              <div className="quest-hero-progress-fill" style={{ width: `${coveragePercent}%` }} />
            </div>
          </div>

          <button
            className="quest-hero-btn"
            onClick={() => {
              soundFX.playClick();
              onStartLesson(resumeChapter.id);
            }}
          >
            <Play size={15} fill="#13211C" /> Resume Lesson
          </button>
        </div>

        {/* Daily Challenge Card */}
        <div className="quest-daily-card">
          <div>
            <div className="quest-daily-tag">
              <span>DAILY CHALLENGE</span>
              <span className="quest-daily-chip">+50 XP</span>
            </div>
            <h3 className="quest-daily-title">
              {stats.dailyChallengeCompleted ? 'Challenge Done' : '5 Quick Questions'}
            </h3>
            <div className="quest-daily-sub">
              {stats.dailyChallengeCompleted
                ? '5/5 questions solved today · streak preserved'
                : 'Mixed chapter recall · Ends in 6h 20m'}
            </div>
          </div>

          <button
            className="quest-daily-btn"
            style={stats.dailyChallengeCompleted ? { opacity: 0.85, cursor: 'default' } : {}}
            onClick={() => {
              soundFX.playClick();
              if (!stats.dailyChallengeCompleted) {
                onStartLesson(resumeChapter.id);
              }
            }}
          >
            {stats.dailyChallengeCompleted ? (
              <>
                <Check size={14} strokeWidth={2.5} /> Completed
              </>
            ) : (
              <>
                Start Challenge <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3-Column Balanced Study Tools Grid */}
      <div className="quest-sub-grid" style={{ marginBottom: '28px' }}>
        {/* Card 1: Active Recall Flashcards */}
        <div
          className="quest-stat-card"
          onClick={() => {
            soundFX.playClick();
            onOpenFlashcards();
          }}
          style={{ cursor: 'pointer', transition: 'border-color 0.15s ease, transform 0.15s ease' }}
        >
          <div className="quest-stat-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Exam Flashcards</span>
            <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(201, 242, 107, 0.25)', color: '#13211C', padding: '2px 7px', borderRadius: '6px' }}>
              43 CARDS
            </span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--quest-text-primary)', marginBottom: '4px' }}>
                Active Recall Drill Deck
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.45 }}>
                Master key traps, algorithms, heuristics & definitions across all 27 chapters.
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--quest-text-primary)' }}>
              <span>Study Deck</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* Card 2: Exam Readiness & Diagnostics */}
        <div className="quest-stat-card">
          <div className="quest-stat-card-title">
            Exam in {daysRemaining} days
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--quest-text-secondary)', marginBottom: '10px' }}>
                {coveragePercent}% syllabus covered
              </div>

              {quizScores.length === 0 ? (
                <div
                  style={{
                    padding: '10px 12px',
                    background: 'var(--quest-bg)',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: 'var(--quest-text-muted)',
                    lineHeight: 1.4
                  }}
                >
                  Complete quizzes to highlight high-priority review topics.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--quest-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Priority Focus
                  </div>
                  <div className="quest-weak-item">
                    <div className="quest-weak-name" style={{ fontSize: '12px' }}>
                      <span title={weakConcept1}>{weakConcept1.length > 18 ? weakConcept1.slice(0, 18) + '...' : weakConcept1}</span>
                      <span>{weakPct1}%</span>
                    </div>
                    <div className="quest-hero-progress-track" style={{ height: '5px' }}>
                      <div className="quest-hero-progress-fill" style={{ width: `${weakPct1}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--quest-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} />
              <span>Target: {user?.targetExamDate || 'Next Exam Session'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Study Rhythm & Weekly Activity */}
        <div className="quest-stat-card">
          <div className="quest-stat-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Weekly Rhythm</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: streakDays > 0 ? '#13211C' : 'var(--quest-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Flame size={13} color="#f59e0b" fill="#f59e0b" /> {streakDays}d streak
            </span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="quest-bar-chart" style={{ marginTop: '6px' }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayLabel, idx) => {
                const todayIdx = (new Date().getDay() + 6) % 7;
                const isToday = idx === todayIdx;
                const isFuture = idx > todayIdx;

                const todayDate = new Date();
                const year = todayDate.getFullYear();
                const month = String(todayDate.getMonth() + 1).padStart(2, '0');
                const day = String(todayDate.getDate()).padStart(2, '0');
                const todayStr = `${year}-${month}-${day}`;

                const isTodayActive = isToday && stats.lastActiveDate === todayStr;
                const isPastStreakDay = !isFuture && !isToday && streakDays > 0 && (todayIdx - idx < (isTodayActive ? streakDays : streakDays + 1));

                let barHeight = '8%';
                let isHighlighted = false;

                if (isToday) {
                  barHeight = isTodayActive ? '80%' : '16%';
                  isHighlighted = isTodayActive;
                } else if (isPastStreakDay) {
                  barHeight = `${Math.min(95, 40 + (idx * 10))}%`;
                } else if (isFuture) {
                  barHeight = '6%';
                }

                return (
                  <div key={idx} className="quest-chart-col">
                    <div
                      className={`quest-chart-bar ${isHighlighted ? 'highlight' : ''}`}
                      style={{ height: barHeight, opacity: isFuture ? 0.35 : 1 }}
                    />
                    <span className="quest-chart-day" style={isToday ? { fontWeight: 800, color: 'var(--quest-text-primary)' } : {}}>
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                onOpenRanks();
              }}
              style={{
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid var(--quest-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--quest-text-secondary)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontWeight: 600 }}>Cohort Rank</span>
              <span style={{ fontWeight: 800, color: 'var(--quest-text-primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Trophy size={12} color="#f59e0b" /> Top #1 <ChevronRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Recommended Steps */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h2 className="quest-section-title" style={{ margin: 0, fontSize: '18px' }}>
          Recommended for today
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--quest-text-muted)', fontWeight: 600 }}>
          3 bite-sized steps
        </span>
      </div>

      <div className="quest-plan-stack">
        <div
          className="quest-plan-card"
          onClick={() => {
            soundFX.playClick();
            onStartLesson(resumeChapter.id);
          }}
        >
          <div className="quest-plan-circle" />
          <span className="quest-plan-text">Read Chapter {resumeChapter.id}: {resumeChapter.title}</span>
          <span className="quest-plan-pill">Lesson</span>
        </div>

        <div
          className="quest-plan-card"
          onClick={() => {
            soundFX.playClick();
            onStartLesson(resumeChapter.id);
          }}
        >
          <div className="quest-plan-circle" />
          <span className="quest-plan-text">Complete {resumeChapter.title} assessment quiz</span>
          <span className="quest-plan-pill">Quiz</span>
        </div>

        <div
          className="quest-plan-card"
          onClick={() => {
            soundFX.playClick();
            onOpenFlashcards();
          }}
        >
          <div className={`quest-plan-circle ${stats.xp >= 20 ? 'done' : ''}`}>
            {stats.xp >= 20 ? <Check size={14} strokeWidth={3} /> : null}
          </div>
          <span className="quest-plan-text">Review active recall flashcards (+35 XP)</span>
          <span className="quest-plan-pill" style={{ background: 'rgba(201, 242, 107, 0.3)', color: '#13211c' }}>High-Yield</span>
        </div>
      </div>
    </div>
  );
};
