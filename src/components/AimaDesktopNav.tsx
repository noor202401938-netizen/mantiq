import React, { useState, useEffect } from 'react';
import { Home, BookOpen, GraduationCap, Trophy, User, Flame, LogIn, LogOut, Sun, Moon, WifiOff, Check, Compass, Layers } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MantiqLogo, LogoVariant } from './MantiqLogo';

export type QuestTab = 'home' | 'learn' | 'lesson' | 'ranks' | 'you';

interface AimaDesktopNavProps {
  currentTab: QuestTab;
  onSelectTab: (tab: QuestTab) => void;
  onOpenSync: () => void;
  onOpenFlashcards: () => void;
  onOpenGuide: () => void;
}

export const AimaDesktopNav: React.FC<AimaDesktopNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSync,
  onOpenFlashcards,
  onOpenGuide
}) => {
  const { stats } = useProgress();
  const { user, isGuest, openSignIn, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const streakDays = stats.streakDays ?? 0;

  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

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

  const navItems = [
    { id: 'home' as QuestTab, label: 'Home', icon: Home },
    { id: 'learn' as QuestTab, label: 'Chapters', icon: BookOpen },
    { id: 'lesson' as QuestTab, label: 'Lessons', icon: GraduationCap },
    { id: 'ranks' as QuestTab, label: 'Ranks', icon: Trophy },
    { id: 'you' as QuestTab, label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Desktop Sidebar (Pages 21-36) */}
      <aside className="quest-desktop-sidebar">
        {/* Brand Lockup & Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div className="quest-brand-lockup" onClick={() => onSelectTab('home')} style={{ margin: 0, cursor: 'pointer' }}>
            <MantiqLogo size={36} />
            <div>
              <h1 className="quest-brand-title" style={{ fontSize: '20px', lineHeight: 1.1 }}>Mantiq</h1>
              <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)', fontWeight: 600, letterSpacing: '0.01em', marginTop: '2px' }}>
                Let's have some Mantiq about AI
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFX.playClick();
              toggleTheme();
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--quest-bg)',
              border: '1px solid var(--quest-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDark ? '#C9F26B' : 'var(--quest-text-secondary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Nav Items Stack */}
        <nav className="quest-nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                className={`quest-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  onSelectTab(item.id);
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* App & Study Guide Navigation Item */}
          <button
            type="button"
            className="quest-nav-item"
            onClick={() => {
              soundFX.playClick();
              onOpenGuide();
            }}
            title="Open App & Study Guide"
          >
            <Compass size={20} />
            <span>App & Study Guide</span>
          </button>

          {/* Exam Flashcards Navigation Item */}
          <button
            type="button"
            className="quest-nav-item"
            onClick={() => {
              soundFX.playClick();
              onOpenFlashcards();
            }}
            title="Open Exam Flashcards (43+ Cards across all 27 Chapters)"
          >
            <Layers size={20} />
            <span>Exam Flashcards</span>
          </button>
        </nav>

        {/* Integrated Sidebar Footer: Scholar Profile & Streak Status */}
        <div className="quest-sidebar-footer">
          <div
            onClick={() => {
              soundFX.playClick();
              onSelectTab('you');
            }}
            style={{
              padding: '8px 10px',
              borderRadius: '12px',
              background: currentTab === 'you' ? 'rgba(74, 222, 128, 0.1)' : 'var(--quest-bg)',
              border: currentTab === 'you' ? '1px solid var(--quest-accent)' : '1px solid var(--quest-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Top Row: Avatar, Name & Role, and Logout button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '9px',
                  background: '#13211C',
                  color: '#C9F26B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                  fontFamily: 'var(--quest-font-heading)',
                  flexShrink: 0
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 800,
                    color: 'var(--quest-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={user.name}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: '10.5px',
                    color: 'var(--quest-text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {isGuest ? 'Auditing Scholar' : user.university || 'Scholar'}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFX.playClick();
                  logout();
                }}
                style={{
                  padding: '4px',
                  borderRadius: '6px',
                  background: 'transparent',
                  color: 'var(--quest-text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                title={isGuest ? 'Return to Welcome Screen' : 'Sign out'}
              >
                <LogOut size={13} />
              </button>
            </div>

            {/* Bottom Row: Full-width Sign In button for guest */}
            {isGuest && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFX.playClick();
                  openSignIn();
                }}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  background: 'var(--quest-accent, #C9F26B)',
                  color: '#13211C',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
                title="Sign in or register"
              >
                <LogIn size={11} /> Sign In
              </button>
            )}
          </div>

          {/* Streak + Sync Indicator */}
          <div
            className="quest-streak-pill-bottom"
            onClick={() => {
              soundFX.playClick();
              onOpenSync();
            }}
            style={{ cursor: 'pointer' }}
            title="Click to view sync status"
          >
            <div className="quest-streak-pill-text">
              <Flame size={14} color="#FF6A00" fill="#FF6A00" />
              <span>{streakDays}-day streak</span>
            </div>
            <div
              className="quest-streak-sync-sub"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: isOnline ? 'var(--quest-text-muted)' : '#D97706'
              }}
            >
              {isOnline ? (
                <>
                  <Check size={11} color="#10B981" /> Cloud synced
                </>
              ) : (
                <>
                  <WifiOff size={11} color="#D97706" /> Offline · Saved locally
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Bottom Bar (Pages 1-20) */}
      <nav className="quest-mobile-nav-bar" aria-label="Mobile Navigation">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              className={`quest-mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                onSelectTab(item.id);
              }}
            >
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          className="quest-mobile-nav-btn"
          onClick={() => {
            soundFX.playClick();
            onOpenGuide();
          }}
          title="Open App & Study Guide"
        >
          <span>Guide</span>
        </button>

        <button
          type="button"
          className="quest-mobile-nav-btn"
          onClick={() => {
            soundFX.playClick();
            onOpenFlashcards();
          }}
          title="Open Exam Flashcards"
        >
          <span>Cards</span>
        </button>
      </nav>
    </>
  );
};
