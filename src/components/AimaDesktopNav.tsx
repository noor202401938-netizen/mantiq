import React from 'react';
import { Home, BookOpen, GraduationCap, Trophy, User, Flame, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export type QuestTab = 'home' | 'learn' | 'lesson' | 'ranks' | 'you';

interface AimaDesktopNavProps {
  currentTab: QuestTab;
  onSelectTab: (tab: QuestTab) => void;
  onOpenSync: () => void;
}

export const AimaDesktopNav: React.FC<AimaDesktopNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSync
}) => {
  const { stats } = useProgress();
  const { user, isGuest, openSignIn, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const streakDays = stats.streakDays ?? 0;

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

        {/* User Scholar Profile Card in Sidebar */}
        <div style={{ marginTop: 'auto', padding: '0 12px 12px' }}>
          <div
            onClick={() => {
              soundFX.playClick();
              onSelectTab('you');
            }}
            style={{
              padding: '12px',
              borderRadius: '16px',
              background: currentTab === 'you' ? 'rgba(74, 222, 128, 0.1)' : 'var(--quest-bg)',
              border: currentTab === 'you' ? '1px solid var(--quest-accent)' : '1px solid var(--quest-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
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

            {isGuest ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFX.playClick();
                    openSignIn();
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: 'var(--quest-accent)',
                    color: '#13211C',
                    fontSize: '11px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Sign in or register"
                >
                  <LogIn size={12} /> Sign In
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFX.playClick();
                    logout();
                  }}
                  style={{
                    padding: '4px 6px',
                    borderRadius: '6px',
                    background: 'transparent',
                    color: 'var(--quest-text-muted)',
                    fontSize: '11px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Return to Welcome Screen"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFX.playClick();
                  logout();
                }}
                style={{
                  padding: '4px 6px',
                  borderRadius: '6px',
                  background: 'transparent',
                  color: 'var(--quest-text-muted)',
                  fontSize: '11px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="Sign out"
              >
                <LogOut size={14} />
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
            <div className="quest-streak-sync-sub">Synced 2 min ago</div>
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
      </nav>
    </>
  );
};
