import React from 'react';
import { soundFX } from '../utils/soundEffects';

interface DesignSystemNavProps {
  currentTab: 'today' | 'study' | 'progress';
  onSelectTab: (tab: 'today' | 'study' | 'progress') => void;
}

export const DesignSystemNav: React.FC<DesignSystemNavProps> = ({
  currentTab,
  onSelectTab
}) => {
  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'study', label: 'Study' },
    { id: 'progress', label: 'Progress' }
  ] as const;

  return (
    <nav className="design-floating-nav-bar" aria-label="Main Navigation">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            className={`design-nav-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => {
              soundFX.playClick();
              onSelectTab(tab.id);
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};
