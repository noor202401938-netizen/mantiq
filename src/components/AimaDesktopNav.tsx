import React, { useState, useEffect } from 'react';
import { Home, BookOpen, GraduationCap, Trophy, User, Flame, LogIn, LogOut, Sun, Moon, WifiOff, Check } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export type QuestTab = 'home' | 'learn' | 'lesson' | 'ranks' | 'you';

interface AimaDesktopNavProps {
  currentTab: QuestTab;
  onSelectTab: (tab: QuestTab) => void;
  onOpenSync: () => void;
  onOpenFlashcards: () => void;
}

export const AimaDesktopNav: React.FC<AimaDesktopNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSync,
  onOpenFlashcards
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div className="quest-brand-lockup" onClick={() => onSelectTab('home')} style={{ margin: 0 }}>
            <img
              src="./mantiq-logo.png"
              alt="Mantiq Logo"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                objectFit: 'cover',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
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
        </nav>

        {/* Quick Exam Flashcards Action */}
        <div style={{ padding: '6px 12px 14px' }}>
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onOpenFlashcards();
            }}
            style={{
              width: '100%',
              padding: '11px 13px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(201, 242, 107, 0.22) 0%, rgba(201, 242, 107, 0.08) 100%)',
              border: '1.5px solid rgba(201, 242, 107, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'var(--quest-text-primary)',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
            title="Open Exam Flashcards (43+ Cards across all 27 Chapters)"
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                background: '#C9F26B',
                color: '#13211C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0
              }}
            >
              🃏
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, lineHeight: 1.2, color: 'var(--quest-text-primary)' }}>
                Exam Flashcards
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--quest-text-muted)', marginTop: '2px' }}>
                43+ Cards • All 27 Ch.
              </div>
            </div>
          </button>
        </div>

        {/* User Scholar Profile Card in Sidebar */}
        <div style={{ marginTop: 'auto', padding: '0 12px 12px' }}>
          <div
            onClick={() => {
              soundFX.playClick();
              onSelectTab('you');
            }}
            style={{
              padding: '10px 12px',
              borderRadius: '16px',
              background: currentTab === 'you' ? 'rgba(74, 222, 128, 0.1)' : 'var(--quest-bg)',
              border: currentTab === 'you' ? '1px solid var(--quest-accent)' : '1px solid var(--quest-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Top Row: Avatar, Name & Role, and Logout button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: '#13211C',
                  color: '#C9F26B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
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
                    fontSize: '13px',
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
                    fontSize: '11px',
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
                  padding: '5px',
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
                <LogOut size={14} />
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
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: 'var(--quest-accent, #C9F26B)',
                  color: '#13211C',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
                title="Sign in or register"
              >
                <LogIn size={12} /> Sign In
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Footer (Streak + Sync indicator) */}
        <div className="quest-sidebar-footer">
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
              <Flame size={16} color="#FF6A00" fill="#FF6A00" />
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
            onOpenFlashcards();
          }}
          title="Open Exam Flashcards"
        >
          <span>🃏 Cards</span>
        </button>
      </nav>
    </>
  );
};
