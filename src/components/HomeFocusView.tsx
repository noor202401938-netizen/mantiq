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
      <div className="quest-view-header">
        <div>
          <div className="quest-greeting-sub">Let's have some Mantiq about AI</div>
          <h1 className="quest-view-title">Today’s focus</h1>
        </div>

        <div className="quest-header-level-badge">
          Level {userLevel} · {userXP.toLocaleString()} XP
        </div>
      </div>

      {/* Top Grid: Hero Dark Card + Daily Challenge */}
      <div className="quest-home-grid">
        {/* Hero Dark Card (Dynamic Resume Chapter) */}
        <div className="quest-hero-card">
          <div className="quest-hero-kicker">CONTINUE · CHAPTER {resumeChapter.id}</div>
          <h2 className="quest-hero-title">{resumeChapter.title}</h2>
          <div className="quest-hero-subtitle">{resumeChapter.subtitle} · ~12 min</div>

          <div className="quest-hero-progress-track">
            <div className="quest-hero-progress-fill" style={{ width: `${coveragePercent}%` }} />
          </div>

          <button
            className="quest-hero-btn"
            onClick={() => {
              soundFX.playClick();
              onStartLesson(resumeChapter.id);
            }}
          >
            <Play size={18} fill="#13211C" /> Resume lesson
          </button>
        </div>

        {/* Daily Challenge Card (+50 XP) */}
        <div className="quest-daily-card">
          <div>
            <div className="quest-daily-tag">Daily challenge</div>
            <h3 className="quest-daily-title">{stats.dailyChallengeCompleted ? 'Completed' : '+50 XP'}</h3>
            <div className="quest-daily-sub">
              {stats.dailyChallengeCompleted ? '5/5 questions solved today' : 'Ends in 6h 20m · 5 mixed questions'}
            </div>
          </div>

          <button
            className="quest-daily-btn"
            style={stats.dailyChallengeCompleted ? { opacity: 0.8, cursor: 'default' } : {}}
            onClick={() => {
              soundFX.playClick();
              if (!stats.dailyChallengeCompleted) {
                onStartLesson(resumeChapter.id);
              }
            }}
          >
            {stats.dailyChallengeCompleted ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} strokeWidth={2.5} /> Done
              </span>
            ) : (
              'Start'
            )}
          </button>
        </div>
      </div>

      {/* High-Yield Exam Flashcards Banner */}
      <div
        onClick={() => {
          soundFX.playClick();
          onOpenFlashcards();
        }}
        style={{
          background: 'linear-gradient(135deg, #13211C 0%, #1A2F27 100%)',
          borderRadius: '20px',
          padding: '18px 22px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: '20px',
          border: '1.5px solid rgba(201, 242, 107, 0.35)',
          boxShadow: '0 4px 16px rgba(19, 33, 28, 0.12)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '13px',
              background: '#C9F26B',
              color: '#13211C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(201, 242, 107, 0.35)'
            }}
          >
            🃏
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(201, 242, 107, 0.2)', color: '#C9F26B', padding: '2px 8px', borderRadius: '6px' }}>
                EXAM DRILL DECK
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>43+ Cards · All 27 Chapters & Exam Traps</span>
            </div>
            <h3 style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: 800, color: '#F3F5EF' }}>
              Active Recall Exam Flashcards
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            soundFX.playClick();
            onOpenFlashcards();
          }}
          style={{
            background: '#C9F26B',
            color: '#13211C',
            border: 'none',
            borderRadius: '12px',
            padding: '9px 16px',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          Study Cards <ArrowRight size={14} />
        </button>
      </div>

      {/* Sub Grid: Minutes this week | Exam in N days | Leaderboard */}
      <div className="quest-sub-grid">
        {/* Minutes this week chart */}
        <div className="quest-stat-card">
          <div className="quest-stat-card-title">Minutes this week</div>
          <div className="quest-bar-chart">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayLabel, idx) => {
              // Map JS getDay() (Sun=0..Sat=6) to Mon=0..Sun=6
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
                  <span className="quest-chart-day" style={isToday ? { fontWeight: 800, color: 'var(--quest-accent-text)' } : {}}>
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exam Countdown Card */}
        <div className="quest-stat-card">
          <div className="quest-stat-card-title">Exam in {daysRemaining} days</div>
          <div className="quest-exam-header" style={{ fontSize: '15px', color: 'var(--quest-text-secondary)', fontWeight: 600 }}>
            {coveragePercent}% covered ({completedChaptersCount}/{totalChapters} chapters)
          </div>

          {quizScores.length === 0 ? (
            <div
              style={{
                marginTop: '14px',
                padding: '12px 14px',
                background: 'var(--quest-bg)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--quest-text-muted)',
                lineHeight: 1.4
              }}
            >
              Complete chapter quizzes to diagnose your priority focus areas.
            </div>
          ) : (
            <>
              <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--quest-text-muted)', textTransform: 'uppercase' }}>
                Focus priority concepts
              </div>

              <div className="quest-weak-item">
                <div className="quest-weak-name">
                  <span title={weakConcept1}>{weakConcept1.length > 22 ? weakConcept1.slice(0, 22) + '...' : weakConcept1}</span>
                  <span>{weakPct1}%</span>
                </div>
                <div className="quest-hero-progress-track" style={{ height: '6px' }}>
                  <div className="quest-hero-progress-fill" style={{ width: `${weakPct1}%` }} />
                </div>
              </div>

              <div className="quest-weak-item">
                <div className="quest-weak-name">
                  <span title={weakConcept2}>{weakConcept2.length > 22 ? weakConcept2.slice(0, 22) + '...' : weakConcept2}</span>
                  <span>{weakPct2}%</span>
                </div>
                <div className="quest-hero-progress-track" style={{ height: '6px' }}>
                  <div className="quest-hero-progress-fill" style={{ width: `${weakPct2}%` }} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Leaderboard Snippet */}
        <div className="quest-stat-card" style={{ cursor: 'pointer' }} onClick={onOpenRanks}>
          <div className="quest-stat-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Leaderboard</span>
            <ChevronRight size={16} color="var(--quest-text-muted)" />
          </div>

          {(() => {
            let registeredPeers: Array<{ name: string; xp: number; isUser: boolean }> = [];
            try {
              const raw = localStorage.getItem('aima_registered_users');
              if (raw) {
                const parsed = JSON.parse(raw);
                registeredPeers = parsed
                  .map((a: any) => ({
                    name: a.profile?.name || 'Scholar',
                    xp: 0,
                    isUser: a.profile?.email?.toLowerCase() === user.email?.toLowerCase()
                  }))
                  .filter((p: any) => !p.isUser);
              }
            } catch {
              // ignore
            }

            const sorted = [...registeredPeers, { name: user.name || 'You', xp: userXP, isUser: true }]
              .sort((a, b) => b.xp - a.xp)
              .map((u, i) => ({ ...u, rank: i + 1 }));

            const userEntry = sorted.find((u) => u.isUser) || { rank: 1, name: user.name || 'You', xp: userXP };
            const others = sorted.filter((u) => !u.isUser).slice(0, 2);

            return (
              <>
                {others.length === 0 ? (
                  <div style={{ marginTop: '8px' }}>
                    <div className="quest-snippet-row active">
                      <span>1 {user.name || 'You'}</span>
                      <span>{userXP.toLocaleString()} XP</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--quest-accent-text)', marginTop: '8px', fontWeight: 600 }}>
                      ★ Enrolled Scholar · Rank #1 in Local Cohort
                    </div>
                  </div>
                ) : (
                  <>
                    {others.map((p) => (
                      <div key={p.rank} className="quest-snippet-row">
                        <span>{p.rank} {p.name}</span>
                        <span>{p.xp.toLocaleString()} XP</span>
                      </div>
                    ))}
                    <div className="quest-snippet-row active">
                      <span>{userEntry.rank} {user.name || 'You'}</span>
                      <span>{userXP.toLocaleString()} XP</span>
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Today's Plan Stack */}
      <h2 className="quest-section-title">Today’s plan</h2>

      <div className="quest-plan-stack">
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
          <span className="quest-plan-text">Review 25 University Exam Flashcards (+35 XP)</span>
          <span className="quest-plan-pill" style={{ background: '#EAF6C9' }}>High-Yield</span>
        </div>



        <div
          className="quest-plan-card"
          onClick={() => {
            soundFX.playClick();
            onStartLesson(resumeChapter.id);
          }}
        >
          <div className="quest-plan-circle" />
          <span className="quest-plan-text">Read Chapter {resumeChapter.id}: {resumeChapter.title}</span>
          <span className="quest-plan-pill">Topic</span>
        </div>

        <div
          className="quest-plan-card"
          onClick={() => {
            soundFX.playClick();
            onStartLesson(resumeChapter.id);
          }}
        >
          <div className="quest-plan-circle" />
          <span className="quest-plan-text">Take {resumeChapter.title} assessment quiz</span>
          <span className="quest-plan-pill">Quiz</span>
        </div>
      </div>
    </div>
  );
};
