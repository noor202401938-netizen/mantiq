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
  markStepCompleted: (chapterId: number, stepIndex: number) => void;
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
export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
};

export const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActiveDate: '',
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

        const totalQuizzes = Number(parsed.totalQuizzesTaken) || 0;

        // Ensure completedChapterIds only contains chapters where the quiz was actually passed with >= 65%
        let validCompletedIds: number[] = [];
        if (totalQuizzes > 0) {
          const savedProgress = localStorage.getItem('aima_chapter_progress');
          if (savedProgress) {
            try {
              const parsedProg = JSON.parse(savedProgress);
              const candidateIds = Array.isArray(parsed.completedChapterIds) ? parsed.completedChapterIds : [];
              validCompletedIds = candidateIds.filter((id: number) => {
                const p = parsedProg[id];
                return (
                  p &&
                  p.quizPassed === true &&
                  typeof p.quizScore === 'number' &&
                  typeof p.quizTotal === 'number' &&
                  p.quizTotal > 0 &&
                  (p.quizScore / p.quizTotal) >= 0.65
                );
              });
            } catch {
              validCompletedIds = [];
            }
          }
        }

        return {
          ...DEFAULT_STATS,
          ...parsed,
          totalQuizzesTaken: totalQuizzes,
          completedChapterIds: validCompletedIds,
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

        // Strictly sanitize: ensure no chapter falsely claims quizPassed without score >= 65%
        const sanitized: Record<number, ChapterProgress> = {};
        for (const [key, val] of Object.entries(parsed)) {
          const chId = Number(key);
          const chProg = val as ChapterProgress;
          const hasScore = typeof chProg.quizScore === 'number' && typeof chProg.quizTotal === 'number' && chProg.quizTotal > 0;
          const passed = hasScore && (chProg.quizScore! / chProg.quizTotal!) >= 0.65;

          sanitized[chId] = {
            ...chProg,
            quizPassed: passed,
            quizScore: hasScore ? chProg.quizScore : undefined,
            quizTotal: hasScore ? chProg.quizTotal : undefined
          };
        }
        return sanitized;
      } catch {
        return DEFAULT_PROGRESS;
      }
    }
    return DEFAULT_PROGRESS;
  });

  // Check study streak validity on load.
  // IMPORTANT: Simply opening the app should NEVER advance or grant a streak.
  // Streak only increments when genuine learning activity occurs (addXP, quizzes, reading, challenges).
  useEffect(() => {
    const today = getLocalDateString();
    const yesterday = getYesterdayDateString();

    setStats((prev) => {
      const lastActive = prev.lastActiveDate;

      // If no activity yet, or active today/yesterday: streak remains intact
      if (!lastActive || lastActive === today || lastActive === yesterday) {
        if (lastActive !== today && prev.dailyChallengeCompleted) {
          return { ...prev, dailyChallengeCompleted: false };
        }
        return prev;
      }

      // If user was absent for 2 or more days:
      if (prev.streakProtected && prev.streakDays > 0) {
        // Streak freeze protects existing streak count once, but is consumed
        return {
          ...prev,
          streakProtected: false,
          dailyChallengeCompleted: false
        };
      }

      // Absent for 2+ days without protection: reset streak to 0
      // Do NOT set lastActiveDate to today because no study occurred today yet!
      return {
        ...prev,
        streakDays: 0,
        dailyChallengeCompleted: false
      };
    });
  }, []);

  // Save to localStorage and sync to Supabase in background
  useEffect(() => {
    try {
      localStorage.setItem('aima_user_stats', JSON.stringify(stats));
      const savedUser = localStorage.getItem('aima_user_profile');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user && user.name) {
          syncScholarToSupabase(user, stats);
        }
      }
    } catch (e) {
      console.warn('Failed to save stats to local storage:', e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('aima_chapter_progress', JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save chapter progress to local storage:', e);
    }
  }, [progress]);

  // Recalculate level based on XP
  const calculateLevel = (xp: number): number => {
    return Math.max(1, Math.floor(xp / 350) + 1);
  };

  // Helper to accurately record study activity for streaks.
  // Streaks only advance or start when genuine study activity takes place.
  const applyStudyActivity = (prev: UserStats): { streakDays: number; lastActiveDate: string } => {
    const today = getLocalDateString();
    const yesterday = getYesterdayDateString();

    if (prev.lastActiveDate === today) {
      // Activity already recorded today; maintain current streak
      return {
        streakDays: Math.max(1, prev.streakDays),
        lastActiveDate: today
      };
    }

    if (prev.lastActiveDate === yesterday) {
      // Consecutive daily learning activity! Increment streak
      return {
        streakDays: prev.streakDays + 1,
        lastActiveDate: today
      };
    }

    // First learning activity ever or streak was broken by missed days: start 1-day streak
    return {
      streakDays: 1,
      lastActiveDate: today
    };
  };

  const addXP = (amount: number) => {
    setStats((prev) => {
      const newXP = prev.xp + amount;
      const oldLevel = prev.level;
      const newLevel = calculateLevel(newXP);
      const streakUpdate = applyStudyActivity(prev);

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
        ...streakUpdate
      };
    });
  };

  const markChapterRead = (chapterId: number) => {
    let wasAlreadyRead = false;
    setProgress((prev) => {
      if (prev[chapterId]?.read) {
        wasAlreadyRead = true;
        return prev;
      }
      return {
        ...prev,
        [chapterId]: {
          ...(prev[chapterId] || {
            chapterId,
            simulationInteracted: false,
            completedStepIndices: [],
            lastStudiedAt: new Date().toISOString()
          }),
          read: true,
          lastStudiedAt: new Date().toISOString()
        }
      };
    });

    if (!wasAlreadyRead) {
      addXP(50);
    }
  };

  const markStepCompleted = (chapterId: number, stepIndex: number) => {
    let wasNewlyCompleted = false;
    setProgress((prev) => {
      const current = prev[chapterId] || {
        chapterId,
        read: false,
        completedStepIndices: [],
        simulationInteracted: false,
        lastStudiedAt: new Date().toISOString()
      };
      const existingSteps = current.completedStepIndices || [];
      if (existingSteps.includes(stepIndex)) {
        return prev;
      }
      wasNewlyCompleted = true;
      return {
        ...prev,
        [chapterId]: {
          ...current,
          completedStepIndices: [...existingSteps, stepIndex],
          lastStudiedAt: new Date().toISOString()
        }
      };
    });

    if (wasNewlyCompleted) {
      addXP(15);
    }
  };

  const recordQuizResult = (chapterId: number, score: number, total: number) => {
    const passed = total > 0 && (score / total >= 0.65);

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
      const streakUpdate = applyStudyActivity(prev);

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
        unlockedBadgeIds: newBadges,
        ...streakUpdate
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
  const readChaptersCount = Object.values(progress).filter((p) => p.read).length;
  const passedQuizzesCount = Object.values(progress).filter((p) => p.quizPassed).length;

  const readingScore = (readChaptersCount / totalChaptersCount) * 40; // 40% weight
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
        markStepCompleted,
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
