import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { AIMA_PARTS } from '../data/aimaBookData';
import { Trophy, Award, Flame, Zap, ShieldCheck } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { stats, progress, examReadinessScore, badges } = useProgress();

  const completedCount = stats.completedChapterIds?.length || 0;
  const cardsMastered = completedCount * 4 + (stats.totalQuizzesTaken > 0 ? stats.totalCorrectAnswers : 0);
  const totalMinutes = Math.max(0, Math.round(stats.xp * 0.4));

  const todayIdx = (new Date().getDay() + 6) % 7;
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const day = String(todayDate.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  const isTodayActive = stats.lastActiveDate === todayStr;

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekBars = days.map((dayLabel, idx) => {
    const isToday = idx === todayIdx;
    const isPast = idx < todayIdx;
    const isPastStreak = isPast && stats.streakDays > 0 && (todayIdx - idx < (isTodayActive ? stats.streakDays : stats.streakDays + 1));

    let height = '10%';
    if (isToday) {
      height = isTodayActive ? '80%' : '16%';
    } else if (isPastStreak) {
      height = `${Math.min(90, 35 + idx * 8)}%`;
    } else if (isPast) {
      height = '12%';
    }

    return {
      day: dayLabel,
      height,
      isToday: isToday && isTodayActive
    };
  });

  return (
    <div className="progress-screen-container">
      <h1 className="design-view-title">Progress</h1>

      {/* Weekly Activity Chart Card */}
      <div className="weekly-activity-card">
        <div className="weekly-activity-title">Minutes this week</div>
        <div className="weekly-chart-bars">
          {weekBars.map((bar, idx) => (
            <div key={idx} className="chart-bar-column">
              <div
                className={`chart-bar-stick ${bar.isToday ? 'today' : ''}`}
                style={{ height: bar.height }}
              />
              <span className="chart-day-label">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Twin Stat Tiles */}
      <div className="progress-stat-tiles-row">
        <div className="stat-tile-lime">
          <div className="stat-tile-number">{totalMinutes}</div>
          <div className="stat-tile-label">study minutes</div>
        </div>

        <div className="stat-tile-dark">
          <div className="stat-tile-number">{cardsMastered}</div>
          <div className="stat-tile-label">cards mastered</div>
        </div>
      </div>

      {/* AIMA Exam Readiness Tile */}
      <div style={{ padding: '18px 20px', background: 'var(--color-card)', borderRadius: '22px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Exam Readiness</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--color-dark)' }}>{examReadinessScore}% Prepared</div>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Stanford CS221 / Russell & Norvig final</div>
        </div>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#C9F26B', color: '#13211C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px' }}>
          {examReadinessScore}%
        </div>
      </div>

      {/* Topics Breakdown */}
      <h2 className="design-section-title">Topics</h2>

      <div className="progress-topics-card">
        {AIMA_PARTS.map((part) => {
          // Calculate percentage for this unit
          const chIds = part.chapters.map((c) => c.id);
          const done = chIds.filter((id) => stats.completedChapterIds?.includes(id)).length;
          const pct = Math.max(15, Math.round((done / chIds.length) * 100));

          return (
            <div key={part.id} className="topic-row-item">
              <div className="topic-row-meta">
                <span>{part.title}</span>
                <span>{pct}%</span>
              </div>
              <div className="topic-track">
                <div className="topic-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges Earned */}
      <h2 className="design-section-title">Achievements</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {badges.slice(0, 4).map((b) => (
          <div
            key={b.id}
            style={{
              padding: '14px',
              background: 'var(--color-card)',
              borderRadius: '18px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div style={{ fontSize: '24px' }}>{b.icon}</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-dark)' }}>{b.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{b.requirement}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
