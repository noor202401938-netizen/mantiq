import React, { useState } from 'react';
import { Trophy, Medal, Flame, Zap, Sparkles, GraduationCap } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';

export const RanksView: React.FC = () => {
  const { stats } = useProgress();
  const [filter, setFilter] = useState<'Weekly' | 'All time'>('Weekly');

  // Compute realistic user XP per filter
  const userTotalXP = stats.xp;
  const userWeeklyXP = Math.min(userTotalXP, Math.max(80, Math.round(userTotalXP * 0.35) + (stats.streakDays * 50)));

  const currentDisplayXP = filter === 'Weekly' ? userWeeklyXP : userTotalXP;

  const peersByFilter: Record<'Weekly' | 'All time', Array<{ name: string; xp: number; role?: string; isUser: boolean }>> = {
    Weekly: [
      { name: 'Ayesha Khan', xp: 820, role: 'Stanford CS221', isUser: false },
      { name: 'Hamza Tariq', xp: 740, role: 'Oxford Robotics', isUser: false },
      { name: 'Dr. Elena Rostova', xp: 690, role: 'MIT CSAIL', isUser: false },
      { name: 'Sana Malik', xp: 580, role: 'Berkeley EECS', isUser: false },
      { name: 'Bilal Ahmed', xp: 460, role: 'CMU LTI', isUser: false },
      { name: 'Zara Noor', xp: 390, role: 'Imperial College', isUser: false },
      { name: 'Chen Wei', xp: 280, role: 'Tsinghua AI', isUser: false },
      { name: 'Marcus Vance', xp: 210, role: 'Berkeley EECS', isUser: false },
      { name: 'Elena Popova', xp: 140, role: 'ETH Zürich', isUser: false }
    ],
    'All time': [
      { name: 'Dr. Elena Rostova', xp: 4850, role: 'MIT CSAIL', isUser: false },
      { name: 'Ayesha Khan', xp: 3920, role: 'Stanford CS221', isUser: false },
      { name: 'Marcus Vance', xp: 3410, role: 'Berkeley EECS', isUser: false },
      { name: 'Hamza Tariq', xp: 2950, role: 'Oxford Robotics', isUser: false },
      { name: 'Sana Malik', xp: 2480, role: 'Berkeley EECS', isUser: false },
      { name: 'Bilal Ahmed', xp: 1890, role: 'CMU LTI', isUser: false },
      { name: 'Zara Noor', xp: 1540, role: 'Imperial College', isUser: false },
      { name: 'Chen Wei', xp: 1120, role: 'Tsinghua AI', isUser: false },
      { name: 'Alex Mercer', xp: 980, role: 'Stanford TA', isUser: false }
    ]
  };

  const activePeers = peersByFilter[filter];

  const allRankings = [...activePeers, { name: 'You', xp: currentDisplayXP, role: 'Your Profile', isUser: true }]
    .sort((a, b) => b.xp - a.xp)
    .map((u, idx) => ({ ...u, rank: idx + 1 }));

  const rank1 = allRankings[0];
  const rank2 = allRankings[1] || allRankings[0];
  const rank3 = allRankings[2] || allRankings[1] || allRankings[0];

  return (
    <div className="quest-ranks-flow">
      {/* View Header */}
      <div className="quest-view-header">
        <div>
          <h1 className="quest-view-title">Leaderboard</h1>
          <div style={{ fontSize: '13px', color: 'var(--quest-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GraduationCap size={15} color="var(--quest-accent-dark, #13211C)" />
            <span>Academic Global Cohort · {filter === 'Weekly' ? 'Current 7-Day Sprint' : 'All-Time Mastery'}</span>
          </div>
        </div>

        {/* Filter Tabs (Weekly / All time) */}
        <div className="quest-ranks-filter-pills">
          {(['Weekly', 'All time'] as const).map((tab) => (
            <button
              key={tab}
              className={`quest-filter-pill ${filter === tab ? 'active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                setFilter(tab);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="quest-ranks-layout">
        {/* Left: 1-2-3 Podium with Aesthetic Badges */}
        <div className="quest-stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="quest-podium-container">
            {/* Rank 2 */}
            <div className="quest-podium-slot">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', marginBottom: '6px' }}>
                <Medal size={20} color="#6B7280" />
                <div className="quest-podium-name" style={rank2.isUser ? { color: '#166534', fontWeight: 800 } : {}}>
                  {rank2.name} {rank2.isUser && '(You)'}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--quest-text-muted)' }}>{rank2.xp.toLocaleString()} XP</span>
              </div>
              <div className="quest-podium-pillar rank-2">2</div>
            </div>

            {/* Rank 1 */}
            <div className="quest-podium-slot">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', marginBottom: '6px' }}>
                <Trophy size={24} color="#D97706" />
                <div className="quest-podium-name" style={{ fontSize: '17px', ...(rank1.isUser ? { color: '#166534', fontWeight: 800 } : {}) }}>
                  {rank1.name} {rank1.isUser && '(You)'}
                </div>
                <span style={{ fontSize: '12px', color: '#B45309', fontWeight: 700 }}>{rank1.xp.toLocaleString()} XP</span>
              </div>
              <div className="quest-podium-pillar rank-1">1</div>
            </div>

            {/* Rank 3 */}
            <div className="quest-podium-slot">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', marginBottom: '6px' }}>
                <Medal size={20} color="#B45309" />
                <div className="quest-podium-name" style={rank3.isUser ? { color: '#166534', fontWeight: 800 } : {}}>
                  {rank3.name} {rank3.isUser && '(You)'}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--quest-text-muted)' }}>{rank3.xp.toLocaleString()} XP</span>
              </div>
              <div className="quest-podium-pillar rank-3">3</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#059669" />
            <span style={{ fontSize: '12.5px', color: 'var(--quest-text-muted)' }}>
              Top 3 advance to the Diamond AI Scholar Division in 2 days.
            </span>
          </div>
        </div>

        {/* Right: Your Rank & Full List with Aesthetic Initials Badges */}
        <div>
          <h2 className="quest-section-title">Cohort Standings</h2>

          <div className="quest-ranks-list">
            {allRankings.map((user) => {
              const initials = user.name === 'You' ? 'ME' : user.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
              const isTop3 = user.rank <= 3;

              return (
                <div
                  key={user.rank}
                  className={`quest-rank-row ${user.isUser ? 'user-highlight' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px'
                  }}
                >
                  <div className="quest-rank-user-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className="quest-rank-pos"
                      style={{
                        width: '24px',
                        fontWeight: 800,
                        color: user.rank === 1 ? '#D97706' : user.rank === 2 ? '#6B7280' : user.rank === 3 ? '#B45309' : 'var(--quest-text-muted)'
                      }}
                    >
                      {user.rank === 1 ? <Trophy size={14} color="#D97706" /> : user.rank === 2 ? <Medal size={14} color="#6B7280" /> : user.rank === 3 ? <Medal size={14} color="#B45309" /> : user.rank}
                    </span>

                    {/* Monogram Badge */}
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: user.isUser ? '#13211C' : '#F0F3EC',
                        color: user.isUser ? '#C9F26B' : '#13211C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                        border: '1px solid var(--quest-border)',
                        flexShrink: 0
                      }}
                    >
                      {initials}
                    </div>

                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: user.isUser ? 800 : 600, color: 'var(--quest-text-primary)' }}>
                        {user.name} {user.isUser && <span style={{ fontSize: '10.5px', background: '#EAF6C9', color: '#13211C', padding: '1px 6px', borderRadius: '4px', fontWeight: 800, marginLeft: '4px' }}>YOU</span>}
                      </div>
                      {user.role && (
                        <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)', marginTop: '1px' }}>
                          {user.role}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                    <Zap size={13} color="#EAB308" />
                    <span>{user.xp.toLocaleString()} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
