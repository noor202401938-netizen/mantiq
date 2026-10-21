import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Zap,
  Sparkles,
  GraduationCap,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import {
  fetchGlobalLeaderboard,
  syncScholarToSupabase,
  isSupabaseConfigured,
  LeaderboardEntry
} from '../utils/supabaseClient';

export const RanksView: React.FC = () => {
  const { stats } = useProgress();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'All time' | 'Weekly'>('All time');

  // Supabase Cloud State
  const [isCloudReady, setIsCloudReady] = useState<boolean>(isSupabaseConfigured());
  const [cloudRankings, setCloudRankings] = useState<LeaderboardEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Authoritative user XP (guarantees zero mismatch between profile, home, and leaderboard)
  const userActualXP = stats.xp;

  // Load from Supabase on mount
  const refreshCloudLeaderboard = async () => {
    if (!isSupabaseConfigured()) return;
    setIsLoading(true);
    try {
      // First push current scholar stats
      await syncScholarToSupabase(user, stats);
      // Then fetch the top scholars
      const results = await fetchGlobalLeaderboard(user.id, 50);
      if (results && results.length > 0) {
        setCloudRankings(results);
        setIsCloudReady(true);
      }
    } catch (e) {
      console.warn('Leaderboard load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCloudLeaderboard();
  }, [user.id, stats.xp, isCloudReady]);

  // Real scholars only (no mock / demo cohort peers)
  let allRankings: Array<{ name: string; xp: number; role?: string; isUser: boolean; rank?: number; avatar?: string }> = [];

  if (cloudRankings && cloudRankings.length > 0) {
    const cloudMapped = cloudRankings.map((c) => {
      const isUser = Boolean(
        c.isUser ||
        (user.id && c.id === user.id) ||
        (user.name && c.name.toLowerCase() === user.name.toLowerCase())
      );

      return {
        name: isUser ? (user.name || c.name) : c.name,
        // The active user always shows their exact actual XP
        xp: isUser ? userActualXP : (filter === 'Weekly' ? Math.round(c.xp * 0.4) + (c.streak * 50) : c.xp),
        role: c.university,
        isUser,
        avatar: c.avatar
      };
    });

    // If current scholar isn't listed yet, include them with their actual XP
    const userFound = cloudMapped.some((item) => item.isUser);
    if (!userFound && user.name) {
      cloudMapped.push({
        name: user.name,
        xp: userActualXP,
        role: user.university || 'Independent Scholar',
        isUser: true,
        avatar: user.avatar
      });
    }

    allRankings = cloudMapped
      .sort((a, b) => b.xp - a.xp)
      .map((u, idx) => ({ ...u, rank: idx + 1 }));
  } else {
    // Current scholar only when cloud hasn't populated
    allRankings = [
      {
        name: user.name || 'You',
        xp: userActualXP,
        role: user.university || 'Independent Scholar',
        isUser: true,
        rank: 1
      }
    ];
  }

  const rank1 = allRankings[0] || { name: user.name || 'You', xp: userActualXP, isUser: true, rank: 1 };
  const rank2 = allRankings[1];
  const rank3 = allRankings[2];

  return (
    <div className="quest-ranks-flow">
      {/* View Header */}
      <div className="quest-view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="quest-view-title" style={{ margin: 0 }}>Leaderboard</h1>
            {isCloudReady && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 9px',
                  borderRadius: '100px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#166534',
                  fontSize: '11px',
                  fontWeight: 800
                }}
                title="Connected to Supabase live database"
              >
                <Cloud size={13} /> Live Cloud
              </span>
            )}
          </div>

          <div style={{ fontSize: '13px', color: 'var(--quest-text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GraduationCap size={15} color="var(--quest-accent-dark, #13211C)" />
            <span>Global AI Scholars · {filter === 'Weekly' ? 'Current 7-Day Sprint' : 'All-Time Mastery'}</span>
          </div>
        </div>

        {/* Filter Tabs & Refresh Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={refreshCloudLeaderboard}
            disabled={isLoading}
            className="quest-filter-pill"
            style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Refresh Leaderboard"
          >
            <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
          </button>

          <div className="quest-ranks-filter-pills">
            {(['All time', 'Weekly'] as const).map((tab) => (
              <button
                key={tab}
                className={`quest-filter-pill ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="quest-ranks-layout">
        {/* Left: 1-2-3 Podium with Real Scholars */}
        <div className="quest-stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div className="quest-podium-container">
            {/* Rank 2 */}
            <div className="quest-podium-slot">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginBottom: '4px' }}>
                <Medal size={18} color="#6B7280" />
                <div
                  className="quest-podium-name"
                  title={rank2 ? rank2.name : undefined}
                  style={rank2?.isUser ? { color: 'var(--quest-accent-text)', fontWeight: 800 } : {}}
                >
                  {rank2 ? rank2.name : '—'}
                </div>
                {rank2?.isUser && (
                  <span style={{ fontSize: '9px', background: 'var(--quest-accent, #C9F26B)', color: '#13211C', padding: '1px 5px', borderRadius: '4px', fontWeight: 800, lineHeight: 1.2 }}>
                    YOU
                  </span>
                )}
                <span style={{ fontSize: '11px', color: 'var(--quest-text-muted)' }}>
                  {rank2 ? `${rank2.xp.toLocaleString()} XP` : 'Awaiting Scholar'}
                </span>
              </div>
              <div className="quest-podium-pillar rank-2">2</div>
            </div>

            {/* Rank 1 */}
            <div className="quest-podium-slot">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginBottom: '4px' }}>
                <Trophy size={22} color="#D97706" />
                <div
                  className="quest-podium-name"
                  title={rank1.name}
                  style={{
                    fontSize: '14.5px',
                    fontWeight: 800,
                    ...(rank1.isUser ? { color: 'var(--quest-accent-text)' } : {})
                  }}
                >
                  {rank1.name}
                </div>
                {rank1.isUser && (
                  <span style={{ fontSize: '9px', background: 'var(--quest-accent, #C9F26B)', color: '#13211C', padding: '1px 5px', borderRadius: '4px', fontWeight: 800, lineHeight: 1.2 }}>
                    YOU
                  </span>
                )}
                <span style={{ fontSize: '11.5px', color: '#D97706', fontWeight: 700 }}>{rank1.xp.toLocaleString()} XP</span>
              </div>
              <div className="quest-podium-pillar rank-1">1</div>
            </div>

            {/* Rank 3 */}
            <div className="quest-podium-slot">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginBottom: '4px' }}>
                <Medal size={18} color="#B45309" />
                <div
                  className="quest-podium-name"
                  title={rank3 ? rank3.name : undefined}
                  style={rank3?.isUser ? { color: 'var(--quest-accent-text)', fontWeight: 800 } : {}}
                >
                  {rank3 ? rank3.name : '—'}
                </div>
                {rank3?.isUser && (
                  <span style={{ fontSize: '9px', background: 'var(--quest-accent, #C9F26B)', color: '#13211C', padding: '1px 5px', borderRadius: '4px', fontWeight: 800, lineHeight: 1.2 }}>
                    YOU
                  </span>
                )}
                <span style={{ fontSize: '11px', color: 'var(--quest-text-muted)' }}>
                  {rank3 ? `${rank3.xp.toLocaleString()} XP` : 'Awaiting Scholar'}
                </span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="quest-section-title" style={{ margin: 0 }}>
              Global Scholars
            </h2>
          </div>

          <div className="quest-ranks-list">
            {allRankings.map((u, index) => {
              const pos = u.rank || (index + 1);
              const initials = u.name === 'You'
                ? 'ME'
                : u.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

              return (
                <div
                  key={`${u.name}-${pos}`}
                  className={`quest-rank-row ${u.isUser ? 'user-highlight' : ''}`}
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
                        color: pos === 1 ? '#D97706' : pos === 2 ? '#6B7280' : pos === 3 ? '#B45309' : 'var(--quest-text-muted)'
                      }}
                    >
                      {pos === 1 ? <Trophy size={14} color="#D97706" /> : pos === 2 ? <Medal size={14} color="#6B7280" /> : pos === 3 ? <Medal size={14} color="#B45309" /> : pos}
                    </span>

                    {/* Monogram Badge */}
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: u.isUser ? 'var(--quest-accent, #C9F26B)' : 'var(--quest-bg)',
                        color: u.isUser ? '#13211C' : 'var(--quest-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 900,
                        border: '1px solid var(--quest-border)',
                        flexShrink: 0
                      }}
                    >
                      {initials}
                    </div>

                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: u.isUser ? 800 : 600, color: 'var(--quest-text-primary)' }}>
                        {u.name} {u.isUser && <span style={{ fontSize: '10.5px', background: 'var(--quest-accent, #C9F26B)', color: '#13211C', padding: '1px 6px', borderRadius: '4px', fontWeight: 800, marginLeft: '4px' }}>YOU</span>}
                      </div>
                      {u.role && (
                        <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)', marginTop: '1px' }}>
                          {u.role}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 800, color: 'var(--quest-text-primary)' }}>
                    <Zap size={13} color="#EAB308" />
                    <span>{u.xp.toLocaleString()} XP</span>
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
