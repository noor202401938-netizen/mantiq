import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Zap,
  Sparkles,
  GraduationCap,
  Users,
  Cloud,
  CloudOff,
  RefreshCw,
  ExternalLink,
  Check,
  X,
  Code
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';
import {
  fetchGlobalLeaderboard,
  syncScholarToSupabase,
  isSupabaseConfigured,
  setSupabaseCredentials,
  LeaderboardEntry
} from '../utils/supabaseClient';

export const RanksView: React.FC = () => {
  const { stats } = useProgress();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'Weekly' | 'All time'>('Weekly');

  // Supabase Cloud State
  const [isCloudReady, setIsCloudReady] = useState<boolean>(isSupabaseConfigured());
  const [cloudRankings, setCloudRankings] = useState<LeaderboardEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>(
    localStorage.getItem('mantiq_supabase_url') || import.meta.env.VITE_SUPABASE_URL || ''
  );
  const [inputKey, setInputKey] = useState<string>(
    localStorage.getItem('mantiq_supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Compute realistic user XP per filter
  const userTotalXP = stats.xp;
  const userWeeklyXP = Math.min(userTotalXP, Math.round(userTotalXP * 0.4) + (stats.streakDays * 50));
  const currentDisplayXP = filter === 'Weekly' ? userWeeklyXP : userTotalXP;

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

  // Fallback realistic cohort peers (when Supabase has no other peers yet or is offline)
  const defaultCohortPeers = [
    { name: 'Dr. Tariq Vance', xp: Math.max(1200, currentDisplayXP + 340), role: 'Oxford University · AI Fellow', isUser: false },
    { name: 'Chen Wei', xp: Math.max(980, currentDisplayXP + 110), role: 'Tsinghua University · CS Graduate', isUser: false },
    { name: 'Sarah Jenkins', xp: Math.max(820, Math.max(250, currentDisplayXP - 90)), role: 'MIT EECS · AI Safety Lab', isUser: false },
    { name: 'Omar Al-Mansoor', xp: Math.max(650, Math.max(150, currentDisplayXP - 180)), role: 'KAUST · Autonomous Agents', isUser: false },
    { name: 'Elena Rostova', xp: Math.max(490, Math.max(80, currentDisplayXP - 270)), role: 'ETH Zürich · Robotics & Planning', isUser: false },
    { name: 'Marcus Bell', xp: Math.max(340, Math.max(50, currentDisplayXP - 360)), role: 'Stanford AI · Undergrad Scholar', isUser: false }
  ];

  // Merge rankings
  let allRankings: Array<{ name: string; xp: number; role?: string; isUser: boolean; rank?: number }> = [];

  if (cloudRankings && cloudRankings.length > 0) {
    allRankings = cloudRankings.map((c, idx) => ({
      name: c.name,
      xp: filter === 'Weekly' ? Math.round(c.xp * 0.4) + (c.streak * 50) : c.xp,
      role: c.university,
      isUser: c.isUser || c.name.toLowerCase() === user.name?.toLowerCase(),
      rank: idx + 1
    }));
  } else {
    // Local / Default Cohort Benchmark
    allRankings = [
      ...defaultCohortPeers,
      {
        name: user.name || 'You',
        xp: currentDisplayXP,
        role: user.university || 'Independent Scholar',
        isUser: true
      }
    ]
      .sort((a, b) => b.xp - a.xp)
      .map((u, idx) => ({ ...u, rank: idx + 1 }));
  }

  const rank1 = allRankings[0] || { name: user.name || 'You', xp: currentDisplayXP, isUser: true, rank: 1 };
  const rank2 = allRankings[1] || { name: 'Open Slot', xp: 0, isUser: false, rank: 2 };
  const rank3 = allRankings[2] || { name: 'Open Slot', xp: 0, isUser: false, rank: 3 };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || !inputKey.trim()) {
      setSaveStatus('Please provide both Project URL and Anon Key.');
      return;
    }
    const success = setSupabaseCredentials(inputUrl, inputKey);
    if (success) {
      setIsCloudReady(true);
      setSaveStatus('Supabase connected! Refreshing live leaderboard...');
      setTimeout(() => {
        refreshCloudLeaderboard();
        setShowConfigModal(false);
        setSaveStatus(null);
      }, 1000);
    } else {
      setSaveStatus('Failed to save credentials.');
    }
  };

  return (
    <div className="quest-ranks-flow">
      {/* View Header */}
      <div className="quest-view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="quest-view-title" style={{ margin: 0 }}>Leaderboard</h1>
            {isCloudReady ? (
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
            ) : (
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: 'var(--quest-accent, #C9F26B)',
                  color: '#13211C',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Zap size={12} /> Connect Supabase
              </button>
            )}
          </div>

          <div style={{ fontSize: '13px', color: 'var(--quest-text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GraduationCap size={15} color="var(--quest-accent-dark, #13211C)" />
            <span>Academic Cohort · {filter === 'Weekly' ? 'Current 7-Day Sprint' : 'All-Time Mastery'}</span>
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
            {(['Weekly', 'All time'] as const).map((tab) => (
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="quest-section-title" style={{ margin: 0 }}>
              {isCloudReady ? 'Global Scholars' : 'Cohort Standings'}
            </h2>
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '12px',
                color: 'var(--quest-text-muted)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{isCloudReady ? 'Cloud Settings' : 'Configure Cloud'}</span>
              <span>⚙️</span>
            </button>
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
                        color: '#13211C',
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

      {/* Supabase Connection Modal */}
      {showConfigModal && (
        <div className="modal-backdrop" onClick={() => setShowConfigModal(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', width: '100%' }}
          >
            <div className="modal-header">
              <div className="modal-title-row">
                <Cloud size={20} className="text-accent" />
                <h3 style={{ margin: 0 }}>Connect Supabase Cloud Leaderboard</h3>
              </div>
              <button className="btn-icon" onClick={() => setShowConfigModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '13.5px', color: 'var(--quest-text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
                Connect a free Supabase database to let scholars from around the world compete on the same global leaderboard!
              </p>

              {saveStatus && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(34, 197, 94, 0.12)',
                    color: '#22C55E',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={15} /> {saveStatus}
                </div>
              )}

              <form onSubmit={handleSaveCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '5px' }}>
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://xyzproject.supabase.co"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--quest-bg)',
                      border: '1px solid var(--quest-border)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '5px' }}>
                    Supabase Public Anon Key
                  </label>
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--quest-bg)',
                      border: '1px solid var(--quest-border)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* SQL Table Instruction Box */}
                <div
                  style={{
                    background: 'var(--quest-bg)',
                    border: '1px solid var(--quest-border)',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--quest-text-primary)' }}>
                    <Code size={14} /> 1-Click SQL Setup (Run in Supabase SQL Editor)
                  </div>
                  <pre
                    style={{
                      background: 'var(--quest-card-bg)',
                      padding: '8px',
                      borderRadius: '8px',
                      overflowX: 'auto',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      margin: 0,
                      border: '1px solid var(--quest-border)',
                      color: 'var(--quest-text-secondary)'
                    }}
                  >
{`create table mantiq_leaderboard (
  id text primary key,
  name text not null,
  university text,
  avatar text,
  xp integer default 0,
  streak integer default 0,
  level integer default 1,
  updated_at timestamp with time zone default now()
);

alter table mantiq_leaderboard enable row level security;
create policy "Public Read" on mantiq_leaderboard for select using (true);
create policy "Public Upsert" on mantiq_leaderboard for all using (true);`}
                  </pre>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'var(--quest-accent, #C9F26B)',
                      color: '#13211C',
                      fontFamily: 'var(--quest-font-heading)',
                      fontWeight: 900,
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Save & Sync Cloud Leaderboard
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="quest-btn-outline"
                    style={{ padding: '12px 18px', borderRadius: '12px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
