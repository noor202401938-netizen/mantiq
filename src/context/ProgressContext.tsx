import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserStats, ChapterProgress, Badge } from '../types';
import { SyncPayload } from '../utils/syncManager';
import { ALL_BADGES } from '../data/aimaBookData';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { syncScholarToSupabase } from '../utils/supabaseClient';

interface ProgressContextType {
  stats: UserStats;
  progress: Record<number, ChapterProgress>;
  badges: Badge[];
  addXP: (amount: number) => void;
  markChapterRead: (chapterId: number) => void;
  recordQuizResult: (chapterId: number, score: number, total: number) => void;
  markSimulationInteracted: (chapterId: number) => void;
  completeDailyChallenge: () => void;
  loadSyncData: (data: SyncPayload) => void;
  examReadinessScore: number;
  totalChaptersCount: number;
  completedCount: number;
  loseHeart: () => boolean;
  refillHearts: () => void;
  addGems: (amount: number) => void;
  claimChest: (chestId: number) => { gems: number; xp: number } | null;
  resetProgress: () => void;
}

// Helper to get local YYYY-MM-DD date string (respecting user's local timezone instead of UTC)
const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActiveDate: getLocalDateString(),
  streakProtected: false,
  totalQuizzesTaken: 0,
  totalCorrectAnswers: 0,
  completedChapterIds: [],
  unlockedBadgeIds: [],
  dailyChallengeCompleted: false,
  dailyChallengeDate: '',
  gems: 0,
  hearts: 5,
  maxHearts: 5,
  claimedChests: []
};

export const DEFAULT_PROGRESS: Record<number, ChapterProgress> = {};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('aima_user_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Wipe legacy development demo data fingerprint (350 XP with hardcoded [1, 2] chapters)
        if (
          parsed.xp === 350 &&
          parsed.completedChapterIds?.length === 2 &&
          parsed.completedChapterIds?.[0] === 1 &&
          parsed.completedChapterIds?.[1] === 2
        ) {
          localStorage.removeItem('aima_user_stats');
          return DEFAULT_STATS;
        }

        return {
          ...DEFAULT_STATS,
          ...parsed,
          gems: parsed.gems ?? 0,
          hearts: parsed.hearts ?? 5,
          maxHearts: parsed.maxHearts ?? 5,
          claimedChests: parsed.claimedChests ?? []
        };
      } catch {
        return DEFAULT_STATS;
      }
    }
    return DEFAULT_STATS;
  });

  const [progress, setProgress] = useState<Record<number, ChapterProgress>>(() => {
    const saved = localStorage.getItem('aima_chapter_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Wipe legacy development chapter 1 & 2 progress if it matches the mock fingerprint
        if (parsed[1]?.quizScore === 3 && parsed[2]?.quizScore === 2) {
          localStorage.removeItem('aima_chapter_progress');
          return DEFAULT_PROGRESS;
        }
        return parsed;
      } catch {
        return DEFAULT_PROGRESS;
      }
    }
    return DEFAULT_PROGRESS;
  });

  // Check and update study streaks on load
  useEffect(() => {
    const today = getLocalDateString();
    const lastActive = stats.lastActiveDate;

    if (lastActive !== today) {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = getLocalDateString(yesterdayDate);

      if (lastActive === yesterday) {
        // Consecutive day: advance streak
        setStats((prev) => ({
          ...prev,
          streakDays: prev.streakDays + 1,
          lastActiveDate: today,
          dailyChallengeCompleted: false
        }));
      } else {
        // Day missed: check streak freeze protection
        setStats((prev) => ({
          ...prev,
          streakDays: prev.streakProtected ? prev.streakDays : 1,
          streakProtected: false,
          lastActiveDate: today,
          dailyChallengeCompleted: false
        }));
      }
    }
  }, []);

  // Save to localStorage and sync to Supabase in background
  useEffect(() => {
    localStorage.setItem('aima_user_stats', JSON.stringify(stats));
    try {
      const savedUser = localStorage.getItem('aima_user_profile');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user && user.name) {
          syncScholarToSupabase(user, stats);
        }
      }
    } catch {}
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('aima_chapter_progress', JSON.stringify(progress));
  }, [progress]);

  // Recalculate level based on XP
  const calculateLevel = (xp: number): number => {
    return Math.max(1, Math.floor(xp / 350) + 1);
  };

  const addXP = (amount: number) => {
    const today = getLocalDateString();
    setStats((prev) => {
      const newXP = prev.xp + amount;
      const oldLevel = prev.level;
      const newLevel = calculateLevel(newXP);

      if (newLevel > oldLevel) {
        soundFX.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        lastActiveDate: today
      };
    });
  };

  const markChapterRead = (chapterId: number) => {
    setProgress((prev) => ({
      ...prev,
      [chapterId]: {
        ...(prev[chapterId] || {
          chapterId,
          read: false,
          simulationInteracted: false,
          lastStudiedAt: new Date().toISOString()
        }),
        read: true,
        lastStudiedAt: new Date().toISOString()
      }
    }));

    setStats((prev) => {
      const alreadyCompleted = prev.completedChapterIds.includes(chapterId);
      if (alreadyCompleted) return prev;

      const newXP = prev.xp + 50;
      const oldLevel = prev.level;
      const newLevel = calculateLevel(newXP);

      if (newLevel > oldLevel) {
        soundFX.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        soundFX.playCorrect();
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedChapterIds: [...prev.completedChapterIds, chapterId]
      };
    });
  };

  const recordQuizResult = (chapterId: number, score: number, total: number) => {
    const passed = score / total >= 0.65;

    setProgress((prev) => ({
      ...prev,
      [chapterId]: {
        ...(prev[chapterId] || {
          chapterId,
          read: true,
          simulationInteracted: false,
          lastStudiedAt: new Date().toISOString()
        }),
        quizScore: Math.max(score, prev[chapterId]?.quizScore || 0),
        quizTotal: total,
        quizPassed: passed,
        lastStudiedAt: new Date().toISOString()
      }
    }));

    const earnedXP = score * 30 + (passed ? 100 : 20);

    setStats((prev) => {
      const newXP = prev.xp + earnedXP;
      const oldLevel = prev.level;
      const newLevel = calculateLevel(newXP);

      if (newLevel > oldLevel) {
        soundFX.playLevelUp();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        soundFX.playCorrect();
      }

      const newQuizzesTaken = prev.totalQuizzesTaken + 1;
      const newCorrectAnswers = prev.totalCorrectAnswers + score;
      const newBadges = [...prev.unlockedBadgeIds];

      if (passed && !newBadges.includes('first_quiz')) {
        newBadges.push('first_quiz');
      }
      if (score === total && !newBadges.includes('perfect_quiz')) {
        newBadges.push('perfect_quiz');
      }

      const newCompleted = passed && !prev.completedChapterIds.includes(chapterId)
        ? [...prev.completedChapterIds, chapterId]
        : prev.completedChapterIds;

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        totalQuizzesTaken: newQuizzesTaken,
        totalCorrectAnswers: newCorrectAnswers,
        completedChapterIds: newCompleted,
        unlockedBadgeIds: newBadges
      };
    });
  };

  const markSimulationInteracted = (chapterId: number) => {
    const alreadyInteracted = progress[chapterId]?.simulationInteracted;
    if (!alreadyInteracted) {
      addXP(40);
    }
    setProgress((prev) => ({
      ...prev,
      [chapterId]: {
        ...(prev[chapterId] || {
          chapterId,
          read: true,
          lastStudiedAt: new Date().toISOString()
        }),
        simulationInteracted: true,
        lastStudiedAt: new Date().toISOString()
      }
    }));
  };

  const completeDailyChallenge = () => {
    if (!stats.dailyChallengeCompleted) {
      addXP(150);
      soundFX.playCorrect();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
      setStats((prev) => ({
        ...prev,
        dailyChallengeCompleted: true,
        dailyChallengeDate: new Date().toISOString().split('T')[0]
      }));
    }
  };

  const loadSyncData = (data: SyncPayload) => {
    setStats(data.stats);
    setProgress(data.progress);
    soundFX.playCorrect();
    confetti({
      particleCount: 100,
      spread: 90
    });
  };

  // Exam readiness calculation (0 - 100%)
  const totalChaptersCount = 27;
  const completedCount = stats.completedChapterIds.length;
  const passedQuizzesCount = Object.values(progress).filter((p) => p.quizPassed).length;

  const readingScore = (completedCount / totalChaptersCount) * 40; // 40% weight
  const quizMasteryScore = (passedQuizzesCount / totalChaptersCount) * 60; // 60% weight
  const examReadinessScore = Math.min(100, Math.round(readingScore + quizMasteryScore));

  const loseHeart = (): boolean => {
    let hasHearts = true;
    setStats((prev) => {
      const newHearts = Math.max(0, (prev.hearts ?? 5) - 1);
      hasHearts = newHearts > 0;
      return {
        ...prev,
        hearts: newHearts
      };
    });
    soundFX.playError();
    return hasHearts;
  };

  const refillHearts = () => {
    setStats((prev) => ({
      ...prev,
      hearts: prev.maxHearts ?? 5
    }));
    soundFX.playLevelUp();
  };

  const addGems = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      gems: (prev.gems ?? 480) + amount
    }));
  };

  const claimChest = (chestId: number): { gems: number; xp: number } | null => {
    if (stats.claimedChests?.includes(chestId)) return null;
    const gemsReward = 30;
    const xpReward = 50;
    addGems(gemsReward);
    addXP(xpReward);
    soundFX.playFanfare();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
    setStats((prev) => ({
      ...prev,
      claimedChests: [...(prev.claimedChests || []), chestId]
    }));
    return { gems: gemsReward, xp: xpReward };
  };

  const resetProgress = () => {
    localStorage.removeItem('aima_user_stats');
    localStorage.removeItem('aima_chapter_progress');
    setStats(DEFAULT_STATS);
    setProgress(DEFAULT_PROGRESS);
  };

  return (
    <ProgressContext.Provider
      value={{
        stats,
        progress,
        badges: ALL_BADGES,
        addXP,
        markChapterRead,
        recordQuizResult,
        markSimulationInteracted,
        completeDailyChallenge,
        loadSyncData,
        examReadinessScore,
        totalChaptersCount,
        completedCount,
        loseHeart,
        refillHearts,
        addGems,
        claimChest,
        resetProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
