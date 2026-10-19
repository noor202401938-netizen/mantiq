import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Flame,
  Zap,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Cloud,
  CloudOff,
  Bell,
  RefreshCw,
  User,
  Menu,
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { soundFX } from '../utils/soundEffects';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenSync: () => void;
  onOpenNotifications: () => void;
  toggleSidebar: () => void;
  currentView: string;
  setCurrentView: (view: 'dashboard' | 'reader' | 'quiz' | 'cram' | 'leaderboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProfile,
  onOpenSync,
  onOpenNotifications,
  toggleSidebar,
  currentView,
  setCurrentView
}) => {
  const { user } = useAuth();
  const { stats, examReadinessScore } = useProgress();
  const { isDark, toggleTheme } = useTheme();
  const [isMuted, setIsMuted] = useState<boolean>(soundFX.getMuted());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleMuteToggle = () => {
    const newMute = soundFX.toggleMute();
    setIsMuted(newMute);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle Navigation Drawer"
        >
          <Menu size={20} />
        </button>

        <div
          className="brand-logo"
          onClick={() => {
            soundFX.playClick();
            setCurrentView('dashboard');
          }}
        >
          <div className="brand-icon-wrapper">
            <BookOpen size={20} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Mantiq</span>
            <span className="brand-badge">Let's have some Mantiq about AI</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="header-nav-tabs">
          <button
            className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => { soundFX.playClick(); setCurrentView('dashboard'); }}
          >
            Dashboard
          </button>
          <button
            className={`nav-tab ${currentView === 'reader' ? 'active' : ''}`}
            onClick={() => { soundFX.playClick(); setCurrentView('reader'); }}
          >
            Chapters & Labs
          </button>
          <button
            className={`nav-tab ${currentView === 'cram' ? 'active' : ''}`}
            onClick={() => { soundFX.playClick(); setCurrentView('cram'); }}
          >
            Exam Flashcards
          </button>
          <button
            className={`nav-tab ${currentView === 'leaderboard' ? 'active' : ''}`}
            onClick={() => { soundFX.playClick(); setCurrentView('leaderboard'); }}
          >
            Leaderboard
          </button>
        </nav>
      </div>

      <div className="header-right">
        {/* Offline / Online Status Badge */}
        <div
          className={`status-chip ${isOnline ? 'online' : 'offline'}`}
          title={isOnline ? 'Online - Cloud Sync Active' : 'Offline Mode - Session saved locally in PWA cache'}
        >
          {isOnline ? <Cloud size={14} /> : <CloudOff size={14} />}
          <span className="status-text">{isOnline ? 'Synced' : 'Offline'}</span>
        </div>

        {/* Study Streak Pill */}
        <div className="stat-pill streak-pill" title={`${stats.streakDays} Day Study Streak!`}>
          <Flame size={16} className="streak-icon pulse-flame" />
          <span className="stat-value">{stats.streakDays}d</span>
        </div>

        {/* XP and Level Pill */}
        <div className="stat-pill xp-pill" title={`Level ${stats.level} Scholar (${stats.xp} XP)`}>
          <Zap size={16} className="xp-icon" />
          <span className="stat-value">{stats.xp} XP</span>
          <span className="level-badge">Lv {stats.level}</span>
        </div>

        {/* Cross-Device Sync Button */}
        <button
          className="btn-icon"
          onClick={() => { soundFX.playClick(); onOpenSync(); }}
          title="Cross-Device Sync & Backups"
        >
          <RefreshCw size={18} />
        </button>

        {/* Notifications Center */}
        <button
          className="btn-icon"
          onClick={() => { soundFX.playClick(); onOpenNotifications(); }}
          title="Daily Study Reminders"
        >
          <Bell size={18} />
          {!stats.dailyChallengeCompleted && <span className="notification-dot" />}
        </button>

        {/* Sound FX Toggle */}
        <button
          className="btn-icon"
          onClick={handleMuteToggle}
          title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          className="btn-icon"
          onClick={() => { soundFX.playClick(); toggleTheme(); }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Profile Avatar */}
        <button
          className="user-profile-btn"
          onClick={() => { soundFX.playClick(); onOpenProfile(); }}
          title="User Profile & Exam Goal"
        >
          <span className="user-avatar-emoji">{user.avatar}</span>
          <span className="user-name-label">{user.name.split(' ')[0]}</span>
        </button>
      </div>
    </header>
  );
};
