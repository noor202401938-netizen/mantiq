import { describe, it, expect } from 'vitest';
import { ChapterProgress, UserStats } from '../src/types';

/**
 * Progression and Chapter Unlock Rules
 */
export function isChapterUnlocked(chapterId: number, completedChapterIds: number[]): boolean {
  if (chapterId <= 1) return true;
  return completedChapterIds.includes(chapterId) || completedChapterIds.includes(chapterId - 1);
}

export function isTopicCompleted(
  chapterId: number,
  topicIndex: number,
  completedChapterIds: number[],
  chapterProgress?: ChapterProgress
): boolean {
  const isChapterDone = completedChapterIds.includes(chapterId);
  return isChapterDone || Boolean(chapterProgress?.completedStepIndices?.includes(topicIndex));
}

export function applyStepCompleted(
  existingProgress: Record<number, ChapterProgress>,
  chapterId: number,
  stepIndex: number
): Record<number, ChapterProgress> {
  const current = existingProgress[chapterId] || {
    chapterId,
    read: false,
    completedStepIndices: [],
    simulationInteracted: false,
    lastStudiedAt: new Date().toISOString()
  };
  const existingSteps = current.completedStepIndices || [];
  if (existingSteps.includes(stepIndex)) {
    return existingProgress;
  }
  return {
    ...existingProgress,
    [chapterId]: {
      ...current,
      completedStepIndices: [...existingSteps, stepIndex],
      lastStudiedAt: new Date().toISOString()
    }
  };
}

export function applyChapterRead(
  existingProgress: Record<number, ChapterProgress>,
  stats: UserStats,
  chapterId: number
): { progress: Record<number, ChapterProgress>; stats: UserStats } {
  const wasAlreadyRead = Boolean(existingProgress[chapterId]?.read);
  const updatedProgress = {
    ...existingProgress,
    [chapterId]: {
      ...(existingProgress[chapterId] || {
        chapterId,
        simulationInteracted: false,
        completedStepIndices: [],
        lastStudiedAt: new Date().toISOString()
      }),
      read: true,
      lastStudiedAt: new Date().toISOString()
    }
  };

  const updatedStats: UserStats = wasAlreadyRead
    ? stats
    : {
        ...stats,
        xp: stats.xp + 50
        // Notice: completedChapterIds is NOT updated by reading
      };

  return { progress: updatedProgress, stats: updatedStats };
}

export function applyQuizResult(
  existingProgress: Record<number, ChapterProgress>,
  stats: UserStats,
  chapterId: number,
  score: number,
  total: number
): { progress: Record<number, ChapterProgress>; stats: UserStats; passed: boolean } {
  const passed = score / total >= 0.65;
  const updatedProgress = {
    ...existingProgress,
    [chapterId]: {
      ...(existingProgress[chapterId] || {
        chapterId,
        read: true,
        simulationInteracted: false,
        lastStudiedAt: new Date().toISOString()
      }),
      quizScore: Math.max(score, existingProgress[chapterId]?.quizScore || 0),
      quizTotal: total,
      quizPassed: passed,
      lastStudiedAt: new Date().toISOString()
    }
  };

  const earnedXP = score * 30 + (passed ? 100 : 20);
  const newCompleted = passed && !stats.completedChapterIds.includes(chapterId)
    ? [...stats.completedChapterIds, chapterId]
    : stats.completedChapterIds;

  const updatedStats: UserStats = {
    ...stats,
    xp: stats.xp + earnedXP,
    totalQuizzesTaken: stats.totalQuizzesTaken + 1,
    totalCorrectAnswers: stats.totalCorrectAnswers + score,
    completedChapterIds: newCompleted
  };

  return { progress: updatedProgress, stats: updatedStats, passed };
}

describe('Chapter Progression & Unlock Logic', () => {
  const initialStats: UserStats = {
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: '2026-10-22',
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

  it('reading a chapter or lesson does NOT mark chapter as completed in completedChapterIds', () => {
    let progress: Record<number, ChapterProgress> = {};
    let stats = { ...initialStats };

    const result = applyChapterRead(progress, stats, 1);
    progress = result.progress;
    stats = result.stats;

    expect(progress[1].read).toBe(true);
    expect(stats.xp).toBe(50);
    // Crucial: completedChapterIds must remain empty
    expect(stats.completedChapterIds).not.toContain(1);
    expect(stats.completedChapterIds.length).toBe(0);
  });

  it('keeps next chapter locked until previous chapter quiz is actually passed', () => {
    let progress: Record<number, ChapterProgress> = {};
    let stats = { ...initialStats };

    // Initially Chapter 1 is unlocked, Chapter 2 is locked
    expect(isChapterUnlocked(1, stats.completedChapterIds)).toBe(true);
    expect(isChapterUnlocked(2, stats.completedChapterIds)).toBe(false);

    // User reads Chapter 1
    const readResult = applyChapterRead(progress, stats, 1);
    progress = readResult.progress;
    stats = readResult.stats;

    // After reading, Chapter 2 must STILL be locked!
    expect(isChapterUnlocked(2, stats.completedChapterIds)).toBe(false);

    // User fails Chapter 1 quiz (e.g. 1/5 = 20% < 65%)
    const failedQuizResult = applyQuizResult(progress, stats, 1, 1, 5);
    progress = failedQuizResult.progress;
    stats = failedQuizResult.stats;
    expect(failedQuizResult.passed).toBe(false);
    expect(isChapterUnlocked(2, stats.completedChapterIds)).toBe(false);

    // User retries and passes Chapter 1 quiz (e.g. 4/5 = 80% >= 65%)
    const passedQuizResult = applyQuizResult(progress, stats, 1, 4, 5);
    progress = passedQuizResult.progress;
    stats = passedQuizResult.stats;
    expect(passedQuizResult.passed).toBe(true);
    expect(stats.completedChapterIds).toContain(1);

    // Now Chapter 2 is officially unlocked!
    expect(isChapterUnlocked(2, stats.completedChapterIds)).toBe(true);
    // And Chapter 3 is still locked until Chapter 2 is completed
    expect(isChapterUnlocked(3, stats.completedChapterIds)).toBe(false);
  });

  it('tracks step completion individually without marking the entire chapter done', () => {
    let progress: Record<number, ChapterProgress> = {};
    const completedChapterIds: number[] = [];

    // Step 0 is completed
    progress = applyStepCompleted(progress, 1, 0);
    expect(progress[1].completedStepIndices).toEqual([0]);

    // Topic 0 is done, but Topic 1, 2, 3 are not done
    expect(isTopicCompleted(1, 0, completedChapterIds, progress[1])).toBe(true);
    expect(isTopicCompleted(1, 1, completedChapterIds, progress[1])).toBe(false);
    expect(isTopicCompleted(1, 2, completedChapterIds, progress[1])).toBe(false);
    expect(isTopicCompleted(1, 3, completedChapterIds, progress[1])).toBe(false);

    // Idempotent: re-completing step 0 does not duplicate
    progress = applyStepCompleted(progress, 1, 0);
    expect(progress[1].completedStepIndices).toEqual([0]);

    // Step 1 completed
    progress = applyStepCompleted(progress, 1, 1);
    expect(progress[1].completedStepIndices).toEqual([0, 1]);
    expect(isTopicCompleted(1, 1, completedChapterIds, progress[1])).toBe(true);
    expect(isTopicCompleted(1, 2, completedChapterIds, progress[1])).toBe(false);
  });
});

export function evaluateStreakOnLoad(stats: UserStats, today: string, yesterday: string): UserStats {
  const lastActive = stats.lastActiveDate;
  if (!lastActive || lastActive === today || lastActive === yesterday) {
    if (lastActive !== today && stats.dailyChallengeCompleted) {
      return { ...stats, dailyChallengeCompleted: false };
    }
    return stats;
  }

  if (stats.streakProtected && stats.streakDays > 0) {
    return {
      ...stats,
      streakProtected: false,
      dailyChallengeCompleted: false
    };
  }

  return {
    ...stats,
    streakDays: 0,
    dailyChallengeCompleted: false
  };
}

export function applyStudyActivity(stats: UserStats, today: string, yesterday: string): UserStats {
  if (stats.lastActiveDate === today) {
    return {
      ...stats,
      streakDays: Math.max(1, stats.streakDays),
      lastActiveDate: today
    };
  }

  if (stats.lastActiveDate === yesterday) {
    return {
      ...stats,
      streakDays: stats.streakDays + 1,
      lastActiveDate: today
    };
  }

  return {
    ...stats,
    streakDays: 1,
    lastActiveDate: today
  };
}

describe('Streak Recording & Reset Logic', () => {
  const baseStats: UserStats = {
    xp: 200,
    level: 1,
    streakDays: 5,
    lastActiveDate: '2026-10-20',
    streakProtected: false,
    totalQuizzesTaken: 1,
    totalCorrectAnswers: 4,
    completedChapterIds: [1],
    unlockedBadgeIds: [],
    dailyChallengeCompleted: true,
    dailyChallengeDate: '2026-10-20',
    gems: 50,
    hearts: 5,
    maxHearts: 5,
    claimedChests: []
  };

  const today = '2026-10-23';
  const yesterday = '2026-10-22';
  const twoDaysAgo = '2026-10-21';

  it('resets streak to 0 if absent for 2 or more days and not streak-protected', () => {
    const stats: UserStats = {
      ...baseStats,
      lastActiveDate: twoDaysAgo, // last logged in 2 days ago
      streakDays: 4,
      streakProtected: false
    };

    const evaluated = evaluateStreakOnLoad(stats, today, yesterday);
    expect(evaluated.streakDays).toBe(0);
    // Crucially: lastActiveDate must NOT be marked as today
    expect(evaluated.lastActiveDate).toBe(twoDaysAgo);
    expect(evaluated.dailyChallengeCompleted).toBe(false);
  });

  it('preserves streak if streakProtected when absent for 2+ days and consumes freeze', () => {
    const stats: UserStats = {
      ...baseStats,
      lastActiveDate: twoDaysAgo,
      streakDays: 6,
      streakProtected: true
    };

    const evaluated = evaluateStreakOnLoad(stats, today, yesterday);
    expect(evaluated.streakDays).toBe(6);
    expect(evaluated.streakProtected).toBe(false);
  });

  it('opening the app without studying never advances streak or marks today active', () => {
    const stats: UserStats = {
      ...baseStats,
      lastActiveDate: yesterday, // studied yesterday
      streakDays: 3
    };

    const evaluated = evaluateStreakOnLoad(stats, today, yesterday);
    expect(evaluated.streakDays).toBe(3); // stays 3, does NOT become 4
    expect(evaluated.lastActiveDate).toBe(yesterday); // remains yesterday, today not active yet
  });

  it('advances streak only when active study occurs (e.g. lesson, quiz, challenge)', () => {
    const stats: UserStats = {
      ...baseStats,
      lastActiveDate: yesterday,
      streakDays: 3
    };

    const afterStudy = applyStudyActivity(stats, today, yesterday);
    expect(afterStudy.streakDays).toBe(4);
    expect(afterStudy.lastActiveDate).toBe(today);

    // Doing additional study on the same day does not repeatedly increment streak
    const afterSecondStudy = applyStudyActivity(afterStudy, today, yesterday);
    expect(afterSecondStudy.streakDays).toBe(4);
    expect(afterSecondStudy.lastActiveDate).toBe(today);
  });

  it('starts a 1-day streak when studying after a broken streak', () => {
    const stats: UserStats = {
      ...baseStats,
      lastActiveDate: twoDaysAgo,
      streakDays: 0
    };

    const afterStudy = applyStudyActivity(stats, today, yesterday);
    expect(afterStudy.streakDays).toBe(1);
    expect(afterStudy.lastActiveDate).toBe(today);
  });
});
