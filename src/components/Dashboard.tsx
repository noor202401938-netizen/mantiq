import React from 'react';
import {
  Trophy,
  Target,
  Flame,
  Zap,
  BookOpen,
  FlaskConical,
  Award,
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle,
  HelpCircle,
  Play,
  ArrowUpRight,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { AIMA_PARTS } from '../data/aimaBookData';
import { soundFX } from '../utils/soundEffects';

interface DashboardProps {
  onSelectChapter: (id: number) => void;
  onStartQuiz: (chapterId: number) => void;
  onOpenFlashcards: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectChapter,
  onStartQuiz,
  onOpenFlashcards
}) => {
  const { user } = useAuth();
  const {
    stats,
    progress,
    badges,
    examReadinessScore,
    totalChaptersCount,
    completedCount,
    completeDailyChallenge
  } = useProgress();

  // Next level computation
  const currentLevelMinXP = (stats.level - 1) * 350;
  const nextLevelMinXP = stats.level * 350;
  const levelProgressPercent = Math.min(
    100,
    Math.round(((stats.xp - currentLevelMinXP) / (nextLevelMinXP - currentLevelMinXP)) * 100)
  );

  // Grade predictor
  const getPredictedGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', comment: 'Distinction Mastery' };
    if (score >= 80) return { grade: 'A', comment: 'Exam Ready' };
    if (score >= 70) return { grade: 'B+', comment: 'Solid Foundation' };
    if (score >= 60) return { grade: 'B', comment: 'Passing Ground' };
    return { grade: 'In Progress', comment: 'Foundations Needed' };
  };

  const { grade, comment } = getPredictedGrade(examReadinessScore);

  // Days left to target exam
  const calculateDaysLeft = () => {
    if (!user.targetExamDate) return null;
    const diff = new Date(user.targetExamDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };
  const daysLeft = calculateDaysLeft();

  // Next unread chapter
  const nextUnreadChapter =
    AIMA_PARTS.flatMap((p) => p.chapters).find((ch) => !progress[ch.id]?.read) ||
    AIMA_PARTS[0].chapters[0];

  // SVG Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (examReadinessScore / 100) * circumference;

  return (
    <div className="dashboard-container">
      {/* Sleek Hero Banner */}
      <section className="dashboard-hero-card">
        <div className="hero-mesh-overlay" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-user-badge">
            <div className="hero-avatar-ring">
              <span className="hero-avatar-char">{user.avatar}</span>
            </div>
            <div>
              <div className="hero-badge-tag">
                <span className="dot-pulse"></span>
                <span>Active Scholar Session</span>
              </div>
              <h2 className="hero-greeting">Welcome back, {user.name}</h2>
              <p className="hero-subtitle">
                Level {stats.level} Scholar • <span className="hero-title-highlight">{user.currentTitle}</span>
              </p>
            </div>
          </div>

          <div className="hero-quote-box">
            <p className="hero-quote">
              "A rational agent is one that acts so as to achieve the best outcome or, when there is uncertainty, the best expected outcome."
            </p>
            <span className="quote-author">Stuart Russell & Peter Norvig — AIMA (3rd Edition)</span>
          </div>

          <div className="hero-actions">
            <button
              className="btn-action primary btn-glow"
              onClick={() => {
                soundFX.playClick();
                onSelectChapter(nextUnreadChapter.id);
              }}
            >
              <Play size={16} />
              Continue: Ch {nextUnreadChapter.id} • {nextUnreadChapter.title}
            </button>

            <button
              className="btn-action secondary"
              onClick={() => {
                soundFX.playClick();
                onOpenFlashcards();
              }}
            >
              <Layers size={16} />
              Exam Cram Flashcards
            </button>
          </div>
        </div>

        {/* Circular Level XP Widget */}
        <div className="hero-level-widget">
          <div className="level-widget-header">
            <span className="level-title">Rank Tier</span>
            <span className="level-number-pill">Level {stats.level}</span>
          </div>

          <div className="level-xp-display">
            <div className="xp-metric">
              <span className="xp-big">{stats.xp}</span>
              <span className="xp-denom">/ {nextLevelMinXP} XP</span>
            </div>
            <span className="xp-needed">{nextLevelMinXP - stats.xp} XP to Level {stats.level + 1}</span>
          </div>

          <div className="xp-progress-bar-bg">
            <div className="xp-progress-bar-fill" style={{ width: `${levelProgressPercent}%` }} />
          </div>

          <div className="level-widget-footer">
            <div className="streak-tag">
              <Flame size={14} className="streak-icon-sm" />
              <span>{stats.streakDays} Day Active Streak</span>
            </div>
            <span className="streak-shield" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} color="#22C55E" /> Protected
            </span>
          </div>
        </div>
      </section>

      {/* 3 Analytics Cards */}
      <div className="dashboard-metrics-grid">
        {/* Card 1: Exam Readiness Circular Gauge */}
        <div className="metric-card readiness-card">
          <div className="metric-header">
            <div className="metric-icon-box accent">
              <Target size={18} />
            </div>
            <div>
              <h3 className="metric-title">Exam Readiness</h3>
              <p className="metric-subtitle">Predicted Exam Performance</p>
            </div>
          </div>

          <div className="readiness-gauge-layout">
            <div className="svg-gauge-container">
              <svg className="svg-gauge" width="104" height="104" viewBox="0 0 104 104">
                <circle
                  className="gauge-track"
                  cx="52"
                  cy="52"
                  r={radius}
                  strokeWidth="8"
                />
                <circle
                  className="gauge-fill"
                  cx="52"
                  cy="52"
                  r={radius}
                  strokeWidth="8"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset
                  }}
                />
              </svg>
              <div className="gauge-center-text">
                <span className="gauge-pct">{examReadinessScore}%</span>
              </div>
            </div>

            <div className="readiness-details">
              <div className="grade-badge-pill">{grade}</div>
              <span className="grade-comment-text">{comment}</span>
              <div className="exam-countdown-chip">
                <Calendar size={12} />
                <span>
                  {daysLeft !== null ? `${daysLeft} days until exam` : 'Set date in profile'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Daily AI Challenge Quest */}
        <div className="metric-card challenge-card">
          <div className="metric-header">
            <div className="metric-icon-box gold">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="metric-title">Daily AI Challenge</h3>
              <p className="metric-subtitle">+150 Bonus XP • Resets Daily</p>
            </div>
          </div>

          <div className="challenge-body">
            <p className="challenge-question">
              "Is an admissible heuristic always consistent in A* graph search, or is a consistent heuristic always admissible?"
            </p>
            <p className="challenge-hint">
              Theorem: Consistency is monotonic (triangle inequality). Admissibility only checks goal distance.
            </p>
          </div>

          <button
            className={`btn-action full-width ${stats.dailyChallengeCompleted ? 'btn-completed' : 'primary'}`}
            onClick={completeDailyChallenge}
            disabled={stats.dailyChallengeCompleted}
          >
            {stats.dailyChallengeCompleted ? (
              <>
                <CheckCircle size={16} /> Completed (+150 XP Added)
              </>
            ) : (
              <>
                <Zap size={16} /> Claim Challenge (+150 XP)
              </>
            )}
          </button>
        </div>

        {/* Card 3: Curriculum Breakdown */}
        <div className="metric-card curriculum-card">
          <div className="metric-header">
            <div className="metric-icon-box blue">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="metric-title">Curriculum Velocity</h3>
              <p className="metric-subtitle">{completedCount} of {totalChaptersCount} Chapters Mastered</p>
            </div>
          </div>

          <div className="curriculum-stat-row">
            <div className="curriculum-stat">
              <span className="stat-big">{completedCount}</span>
              <span className="stat-label">Read Chapters</span>
            </div>
            <div className="curriculum-stat">
              <span className="stat-big">{stats.totalQuizzesTaken}</span>
              <span className="stat-label">Quizzes Taken</span>
            </div>
            <div className="curriculum-stat">
              <span className="stat-big">{stats.totalCorrectAnswers}</span>
              <span className="stat-label">Questions Solved</span>
            </div>
          </div>

          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.round((completedCount / totalChaptersCount) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Part-by-Part Mastery Matrix */}
      <section className="parts-mastery-section">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">The 7 Pillars of Modern AI</h3>
            <p className="section-subtitle">Russell & Norvig comprehensive topic map</p>
          </div>
        </div>

        <div className="parts-grid">
          {AIMA_PARTS.map((part) => {
            const partChapters = part.chapters;
            const completedInPart = partChapters.filter((ch) => progress[ch.id]?.read).length;
            const percent = Math.round((completedInPart / partChapters.length) * 100);

            return (
              <div key={part.id} className="part-card">
                <div className="part-card-top-bar">
                  <span
                    className="part-card-badge"
                    style={{ backgroundColor: `${part.color}20`, color: part.color, borderColor: `${part.color}40` }}
                  >
                    Part {part.id}
                  </span>
                  <span className="part-percent">{percent}%</span>
                </div>

                <h4 className="part-card-title">{part.title.split(': ')[1] || part.title}</h4>
                <p className="part-card-desc">{part.description}</p>

                <div className="part-mini-progress">
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${percent}%`, backgroundColor: part.color }}
                    />
                  </div>
                  <span className="part-count-text">
                    {completedInPart} of {partChapters.length} chapters
                  </span>
                </div>

                <div className="part-chapters-preview">
                  {partChapters.map((ch) => (
                    <button
                      key={ch.id}
                      className={`preview-chip ${progress[ch.id]?.read ? 'done' : ''}`}
                      onClick={() => {
                        soundFX.playClick();
                        onSelectChapter(ch.id);
                      }}
                      title={`Ch ${ch.id}: ${ch.title}`}
                    >
                      <span>Ch {ch.id}</span>
                      {ch.hasSimulation && <span className="chip-lab-dot" title="Has Lab" />}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges & Achievements */}
      <section className="badges-section">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">Scholar Badges & Credentials</h3>
            <p className="section-subtitle">
              {stats.unlockedBadgeIds.length} of {badges.length} Unlocked
            </p>
          </div>
        </div>

        <div className="badges-grid">
          {badges.map((b) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(b.id);
            return (
              <div key={b.id} className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className={`badge-icon-box ${isUnlocked ? 'unlocked' : ''}`}>
                  <Award size={22} className={isUnlocked ? 'badge-award-active' : 'badge-award-muted'} />
                </div>
                <div className="badge-info">
                  <div className="badge-name">{b.name}</div>
                  <div className="badge-desc">{b.description}</div>
                  <div className="badge-req">{b.requirement}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
