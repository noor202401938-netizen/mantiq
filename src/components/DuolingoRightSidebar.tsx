import React from 'react';
import { Flame, Heart, Zap, Trophy, ShieldCheck, Sparkles, ArrowRight, Target, RefreshCw, Check } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';

interface DuolingoRightSidebarProps {
  onOpenFlashcards: () => void;
  onOpenLeaderboard: () => void;
  onOpenQuests?: () => void;
}

export const DuolingoRightSidebar: React.FC<DuolingoRightSidebarProps> = ({
  onOpenFlashcards,
  onOpenLeaderboard
}) => {
  const { stats, refillHearts, examReadinessScore } = useProgress();

  const handlePracticeHearts = () => {
    soundFX.playClick();
    refillHearts();
    onOpenFlashcards();
  };

  const hearts = stats.hearts ?? 5;
  const maxHearts = stats.maxHearts ?? 5;

  return (
    <aside className="duo-right-sidebar">
      {/* Hearts & Practice Card */}
      <div className="duo-sidebar-card hearts-card">
        <div className="card-header-row">
          <div className="card-title-group">
            <Heart size={20} className="text-red fill-red" />
            <span className="card-title">Hearts</span>
          </div>
          <span className="hearts-fraction">
            {hearts} / {maxHearts}
          </span>
        </div>

        <div className="hearts-display-row">
          {Array.from({ length: maxHearts }).map((_, i) => (
            <div key={i} className={`heart-pip ${i < hearts ? 'filled' : 'empty'}`}>
              <Heart size={22} className={i < hearts ? 'text-red fill-red' : 'text-muted'} />
            </div>
          ))}
        </div>

        {hearts < maxHearts ? (
          <button className="duo-practice-btn" onClick={handlePracticeHearts}>
            <RefreshCw size={16} /> PRACTICE TO REFILL HEARTS
          </button>
        ) : (
          <p className="hearts-full-tip">Your hearts are full! Mistakes won't stop you.</p>
        )}
      </div>

      {/* Daily Quests Card */}
      <div className="duo-sidebar-card quests-card">
        <div className="card-header-row">
          <div className="card-title-group">
            <Target size={20} className="text-gold" />
            <span className="card-title">Daily Quests</span>
          </div>
          <span className="badge-tag">RESETS 12H</span>
        </div>

        <div className="quest-items-list">
          {/* Quest 1 */}
          <div className="quest-item">
            <div className="quest-icon-box xp-icon">
              <Zap size={18} />
            </div>
            <div className="quest-details">
              <span className="quest-name">Earn 50 XP today</span>
              <div className="quest-progress-track">
                <div
                  className="quest-progress-fill xp"
                  style={{ width: `${Math.min(100, (stats.xp % 100) * 2)}%` }}
                />
              </div>
            </div>
            <span className="quest-counter">{Math.min(50, stats.xp % 100)}/50</span>
          </div>

          {/* Quest 2 */}
          <div className="quest-item">
            <div className="quest-icon-box flame-icon">
              <Flame size={18} />
            </div>
            <div className="quest-details">
              <span className="quest-name">Maintain 3-day streak</span>
              <div className="quest-progress-track">
                <div className="quest-progress-fill streak" style={{ width: '100%' }} />
              </div>
            </div>
            <span className="quest-counter check"><Check size={12} strokeWidth={2.5} /></span>
          </div>

          {/* Quest 3 */}
          <div className="quest-item">
            <div className="quest-icon-box exam-icon">
              <ShieldCheck size={18} />
            </div>
            <div className="quest-details">
              <span className="quest-name">Complete 1 AI Lab Simulation</span>
              <div className="quest-progress-track">
                <div
                  className="quest-progress-fill lab"
                  style={{ width: stats.completedChapterIds.length > 0 ? '100%' : '0%' }}
                />
              </div>
            </div>
            <span className="quest-counter">
              {stats.completedChapterIds.length > 0 ? '1/1' : '0/1'}
            </span>
          </div>
        </div>
      </div>

      {/* League Placement Widget */}
      <div className="duo-sidebar-card league-card">
        <div className="card-header-row">
          <div className="card-title-group">
            <Trophy size={20} className="text-diamond" />
            <span className="card-title">Diamond League</span>
          </div>
          <span className="badge-tag blue">WEEK 4</span>
        </div>

        <div className="league-preview-row">
          <div className="league-rank-avatar" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="rank-num">#3</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#13211C', color: '#C9F26B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>AM</div>
          </div>
          <div className="league-info">
            <strong className="league-user-name">Alex Mercer (You)</strong>
            <span className="league-xp-sub">{stats.xp} XP • Promotion Zone</span>
          </div>
        </div>

        <button className="duo-view-league-btn" onClick={onOpenLeaderboard}>
          VIEW LEADERBOARD <ArrowRight size={16} />
        </button>
      </div>

      {/* Exam Readiness Score Card */}
      <div className="duo-sidebar-card readiness-compact-card">
        <div className="card-header-row">
          <span className="card-title">AIMA Exam Readiness</span>
          <span className="readiness-pct">{examReadinessScore}%</span>
        </div>
        <div className="readiness-mini-bar">
          <div className="readiness-mini-fill" style={{ width: `${examReadinessScore}%` }} />
        </div>
        <p className="readiness-sub">Predicted performance on Stanford CS221 / Russell & Norvig final exam.</p>
      </div>
    </aside>
  );
};
