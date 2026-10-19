import React, { useState } from 'react';
import { Trophy, Medal, Flame, Zap, Award, Users, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { LeaderboardUser } from '../types';

export const LeaderboardView: React.FC = () => {
  const { user } = useAuth();
  const { stats } = useProgress();
  const [activeTab, setActiveTab] = useState<'all' | 'weekly'>('all');

  // Simulated peer cohort
  const cohort: LeaderboardUser[] = [
    { rank: 1, id: 'u1', name: 'Elena Rostova', avatar: 'ER', xp: 4850, level: 14, streak: 28, badge: 'AGI Architect' },
    { rank: 2, id: 'u2', name: 'Marcus Chen', avatar: 'MC', xp: 3920, level: 12, streak: 19, badge: 'Bayesian Sage' },
    { rank: 3, id: 'u3', name: 'Sarah Al-Mansoor', avatar: 'SA', xp: 3410, level: 10, streak: 14, badge: 'Inference Engine' },
    { rank: 4, id: 'u4', name: user.name, avatar: user.name.slice(0, 2).toUpperCase(), xp: stats.xp, level: stats.level, streak: stats.streakDays, badge: user.currentTitle, isCurrentUser: true },
    { rank: 5, id: 'u5', name: 'Liam O’Connor', avatar: 'LO', xp: 2200, level: 7, streak: 8, badge: 'Search Specialist' },
    { rank: 6, id: 'u6', name: 'Priya Sharma', avatar: 'PS', xp: 1950, level: 6, streak: 11, badge: 'Search Trainee' },
    { rank: 7, id: 'u7', name: 'David Kim', avatar: 'DK', xp: 1420, level: 5, streak: 4, badge: 'Logic Novice' },
    { rank: 8, id: 'u8', name: 'Chloe Dubois', avatar: 'CD', xp: 980, level: 3, streak: 2, badge: 'Reflex Agent' }
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="leaderboard-title-group">
          <Trophy size={28} className="trophy-gold" />
          <div>
            <h2 className="leaderboard-title">Global AI Scholar Leaderboard</h2>
            <p className="leaderboard-subtitle">Compete with AI students worldwide preparing for university exams.</p>
          </div>
        </div>

        <div className="leaderboard-tabs">
          <button
            className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All-Time XP
          </button>
          <button
            className={`filter-btn ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly Sprint
          </button>
        </div>
      </div>

      <div className="league-banner">
        <div className="league-info">
          <Medal size={20} className="text-accent" />
          <span>Current League: <strong>Diamond Division (Top 10%)</strong></span>
        </div>
        <div className="league-timer">
          <Clock size={16} />
          <span>Sprint resets in 3d 14h</span>
        </div>
      </div>

      <div className="leaderboard-table-card">
        <div className="table-header-row">
          <span className="th-rank">Rank</span>
          <span className="th-user">Scholar</span>
          <span className="th-level">Level</span>
          <span className="th-streak">Streak</span>
          <span className="th-xp">Total XP</span>
        </div>

        <div className="table-body">
          {cohort.map((entry) => (
            <div
              key={entry.id}
              className={`table-row ${entry.isCurrentUser ? 'current-user-row' : ''}`}
            >
              <div className="td-rank">
                {entry.rank === 1 && <span className="rank-medal gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Medal size={14} color="#D97706" /> 1</span>}
                {entry.rank === 2 && <span className="rank-medal silver" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Medal size={14} color="#6B7280" /> 2</span>}
                {entry.rank === 3 && <span className="rank-medal bronze" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Medal size={14} color="#B45309" /> 3</span>}
                {entry.rank > 3 && <span className="rank-num">{entry.rank}</span>}
              </div>

              <div className="td-user">
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: entry.isCurrentUser ? '#13211C' : '#F0F3EC',
                    color: entry.isCurrentUser ? '#C9F26B' : '#13211C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    border: '1.5px solid var(--quest-border)',
                    flexShrink: 0
                  }}
                >
                  {entry.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="user-meta">
                  <span className="user-name">
                    {entry.name} {entry.isCurrentUser && <span className="you-tag">YOU</span>}
                  </span>
                  <span className="user-title-sub">{entry.badge}</span>
                </div>
              </div>

              <div className="td-level">
                <span className="level-chip">Lv {entry.level}</span>
              </div>

              <div className="td-streak">
                <Flame size={14} className="streak-icon-sm" />
                <span>{entry.streak}d</span>
              </div>

              <div className="td-xp">
                <Zap size={14} className="xp-icon-sm" />
                <strong>{entry.xp.toLocaleString()} XP</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
