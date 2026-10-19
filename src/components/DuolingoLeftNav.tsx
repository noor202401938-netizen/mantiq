import React from 'react';
import {
  Home,
  FlaskConical,
  Layers,
  Trophy,
  Target,
  Settings,
  Flame,
  Zap,
  Heart,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import { useTheme } from '../context/ThemeContext';

interface DuolingoLeftNavProps {
  currentTab: 'learn' | 'labs' | 'flashcards' | 'leaderboard' | 'quests';
  onSelectTab: (tab: 'learn' | 'labs' | 'flashcards' | 'leaderboard' | 'quests') => void;
  onOpenSettings: () => void;
  onOpenSync: () => void;
}

export const DuolingoLeftNav: React.FC<DuolingoLeftNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onOpenSync
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [isMuted, setIsMuted] = React.useState(soundFX.getMuted());

  const handleToggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playClick();
  };

  const navItems = [
    { id: 'learn', label: 'LEARN', icon: Home, color: '#58CC02' },
    { id: 'labs', label: 'AI LABS', icon: FlaskConical, color: '#1CB0F6' },
    { id: 'flashcards', label: 'PRACTICE', icon: Layers, color: '#FF9600' },
    { id: 'leaderboard', label: 'LEADERBOARDS', icon: Trophy, color: '#FFC800' },
    { id: 'quests', label: 'QUESTS', icon: Target, color: '#CE82FF' }
  ] as const;

  return (
    <nav className="duo-left-nav">
      {/* Brand Header */}
      <div className="duo-nav-logo" onClick={() => onSelectTab('learn')}>
        <div className="duo-logo-icon" style={{ background: '#C9F26B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={18} color="#13211C" />
        </div>
        <span className="duo-logo-text">MANTIQ</span>
        <span className="duo-edition-tag">AI CORE</span>
      </div>

      {/* Main Nav Items */}
      <div className="duo-nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              className={`duo-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                onSelectTab(item.id);
              }}
            >
              <div className="nav-icon-wrapper" style={{ color: isActive ? item.color : undefined }}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Utility Controls */}
      <div className="duo-nav-footer">
        <button className="duo-footer-icon-btn" onClick={handleToggleSound} title="Toggle Audio">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <button className="duo-footer-icon-btn" onClick={toggleTheme} title="Toggle Theme">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="duo-footer-icon-btn" onClick={onOpenSettings} title="Settings & Profile">
          <Settings size={20} />
        </button>
      </div>
    </nav>
  );
};
