import { describe, it, expect } from 'vitest';

interface LeaderboardItem {
  id?: string;
  name: string;
  xp: number;
  streak: number;
  role?: string;
  isUser: boolean;
  rank?: number;
}

/**
 * Pure mapping function for leaderboard scholars ensuring zero XP mismatch for active user.
 */
export function resolveLeaderboardRankings(
  cloudRankings: LeaderboardItem[] | null,
  currentUser: { id: string; name: string; university?: string },
  currentStats: { xp: number; streakDays: number },
  filter: 'Weekly' | 'All time'
): LeaderboardItem[] {
  const currentTotalXP = currentStats.xp;
  // Authoritative active XP for the user in this cycle
  const currentDisplayXP = currentTotalXP;

  if (cloudRankings && cloudRankings.length > 0) {
    const mapped = cloudRankings.map((c) => {
      const isUser = Boolean(
        c.isUser ||
        (currentUser.id && c.id === currentUser.id) ||
        (currentUser.name && c.name.toLowerCase() === currentUser.name.toLowerCase())
      );

      return {
        ...c,
        isUser,
        name: isUser ? (currentUser.name || c.name) : c.name,
        // Current user MUST always use authoritative local stats.xp (never stale cloud value)
        xp: isUser ? currentDisplayXP : (filter === 'Weekly' ? Math.round(c.xp * 0.4) + (c.streak * 50) : c.xp)
      };
    });

    const userFound = mapped.some((item) => item.isUser);
    if (!userFound && currentUser.name) {
      mapped.push({
        id: currentUser.id,
        name: currentUser.name,
        xp: currentDisplayXP,
        streak: currentStats.streakDays,
        role: currentUser.university || 'Independent Scholar',
        isUser: true
      });
    }

    return mapped
      .sort((a, b) => b.xp - a.xp)
      .map((u, idx) => ({ ...u, rank: idx + 1 }));
  }

  // Fallback when cloud is empty or offline
  return [
    {
      id: currentUser.id,
      name: currentUser.name || 'You',
      xp: currentDisplayXP,
      streak: currentStats.streakDays,
      role: currentUser.university || 'Independent Scholar',
      isUser: true,
      rank: 1
    }
  ];
}

describe('Leaderboard XP Alignment', () => {
  const mockUser = {
    id: 'usr_noor_fatima',
    name: 'Noor Fatima',
    university: 'GCUF'
  };

  const mockStats = {
    xp: 450,
    streakDays: 1
  };

  it('must display exact actual XP (450 XP) in All-Time view', () => {
    const rankings = resolveLeaderboardRankings(null, mockUser, mockStats, 'All time');
    expect(rankings[0].xp).toBe(450);
    expect(rankings[0].name).toBe('Noor Fatima');
    expect(rankings[0].isUser).toBe(true);
  });

  it('must NOT arbitrarily slash actual XP in Weekly view (must match 450 XP)', () => {
    const rankings = resolveLeaderboardRankings(null, mockUser, mockStats, 'Weekly');
    expect(rankings[0].xp).toBe(450);
  });

  it('must override stale cloud XP with local authoritative XP when user is present in cloud list', () => {
    const staleCloudData: LeaderboardItem[] = [
      { id: 'usr_other', name: 'Elena Rostova', xp: 500, streak: 10, isUser: false },
      { id: 'usr_noor_fatima', name: 'Noor Fatima', xp: 200, streak: 1, isUser: true }, // stale 200 on cloud
      { id: 'usr_third', name: 'Auditing Scholar', xp: 100, streak: 2, isUser: false }
    ];

    const rankings = resolveLeaderboardRankings(staleCloudData, mockUser, mockStats, 'All time');
    const userRow = rankings.find((r) => r.isUser);

    expect(userRow).toBeDefined();
    // Must reflect current 450 XP, not the stale 200 XP
    expect(userRow?.xp).toBe(450);
  });

  it('must correctly position user on the podium according to their authoritative XP', () => {
    const cloudData: LeaderboardItem[] = [
      { id: 'usr_other1', name: 'Elena Rostova', xp: 400, streak: 5, isUser: false },
      { id: 'usr_other2', name: 'Marcus Chen', xp: 300, streak: 3, isUser: false }
    ];

    const rankings = resolveLeaderboardRankings(cloudData, mockUser, mockStats, 'All time');
    // 450 > 400 > 300 => Noor Fatima should be Rank 1
    expect(rankings[0].name).toBe('Noor Fatima');
    expect(rankings[0].rank).toBe(1);
    expect(rankings[0].xp).toBe(450);
  });
});
