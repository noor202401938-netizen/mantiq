import React from 'react';
import { Flame, Heart, Sparkles, RefreshCw, Smartphone, ShieldCheck, Wifi, WifiOff, Gem } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';

interface DuolingoTopHeaderProps {
  onOpenProfile: () => void;
  onOpenSync: () => void;
  onOpenStreakModal?: () => void;
}

export const DuolingoTopHeader: React.FC<DuolingoTopHeaderProps> = ({
  onOpenProfile,
  onOpenSync
}) => {
  const { stats, refillHearts } = useProgress();
  const { user } = useAuth();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="duo-topbar">
      <div className="duo-topbar-left">
        <span className="current-unit-title">AI: A MODERN APPROACH (3RD ED)</span>
      </div>

      <div className="duo-topbar-right">
        {/* Offline / Online Pill */}
        <div className={`duo-stat-pill sync-pill ${isOnline ? 'online' : 'offline'}`} onClick={onOpenSync} title="Cloud Sync & Offline Support">
          {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
          <span className="pill-text">{isOnline ? 'Synced' : 'Offline Mode'}</span>
        </div>

        {/* Streak Flame */}
        <div className="duo-stat-pill streak-pill" title={`${stats.streakDays} Day Study Streak!`}>
          <Flame size={18} className="fill-flame" />
          <span className="pill-val">{stats.streakDays}</span>
        </div>

        {/* Gems */}
        <div className="duo-stat-pill gems-pill" title={`${stats.gems ?? 0} Gems in Bank`}>
          <Gem size={16} color="#06B6D4" />
          <span className="pill-val">{stats.gems ?? 0}</span>
        </div>

        {/* Hearts */}
        <div
          className="duo-stat-pill hearts-pill"
          onClick={() => {
            soundFX.playClick();
            if ((stats.hearts ?? 5) < (stats.maxHearts ?? 5)) refillHearts();
          }}
          title={`${stats.hearts ?? 5} Hearts. Click to Refill!`}
        >
          <Heart size={18} className="fill-red" />
          <span className="pill-val">{stats.hearts ?? 5}</span>
        </div>

        {/* User Profile Avatar */}
        <button className="duo-profile-btn" onClick={onOpenProfile} title="Profile & Exam Stats" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#13211C', color: '#C9F26B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, border: '1.5px solid var(--quest-border)' }}>
            {user.avatar || (user.name ? user.name.slice(0, 2).toUpperCase() : 'AS')}
          </div>
        </button>
      </div>
    </header>
  );
};
