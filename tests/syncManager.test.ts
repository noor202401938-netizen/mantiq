import { describe, it, expect } from 'vitest';
import { SyncManager } from '../src/utils/syncManager';
import { UserProfile, UserStats, ChapterProgress, StudyNote } from '../src/types';

describe('SyncManager', () => {
  const mockProfile: UserProfile = {
    id: 'user_123',
    name: 'Scholar Noor',
    handle: '@noor',
    university: 'Stanford',
    field: 'Artificial Intelligence',
    avatar: 'scholar',
    joinedDate: '2026-01-01',
    lastSyncedAt: '2026-10-21T00:00:00Z'
  };

  const mockStats: UserStats = {
    streakDays: 7,
    lastActiveDate: '2026-10-20',
    totalXP: 1450,
    dailyGoalXP: 100,
    todayXP: 80,
    completedChapterIds: [1, 2, 3],
    perfectQuizCount: 2,
    studyMinutes: 180,
    readChaptersCount: 3,
    badges: []
  };

  const mockProgress: Record<number, ChapterProgress> = {
    1: { chapterId: 1, isRead: true, isQuizCompleted: true, quizScore: 100, lastAttemptDate: '2026-10-20' }
  };

  const mockNotes: StudyNote[] = [
    { id: 'note_1', chapterId: 1, title: 'Rationality', content: 'Expected utility maximization', createdAt: '2026-10-20', updatedAt: '2026-10-20', isPinned: true }
  ];

  it('generates a valid export payload with checksum and version', () => {
    const payload = SyncManager.createExportPayload(mockProfile, mockStats, mockProgress, mockNotes);
    expect(payload.version).toBe('1.1.0');
    expect(payload.checksum).toBeDefined();
    expect(typeof payload.checksum).toBe('string');
    expect(payload.checksum.length).toBeGreaterThan(0);
    expect(payload.stats.totalXP).toBe(1450);
  });

  it('successfully parses and validates an untampered payload', () => {
    const payload = SyncManager.createExportPayload(mockProfile, mockStats, mockProgress, mockNotes);
    const jsonString = JSON.stringify(payload);
    const imported = SyncManager.parseImport(jsonString);
    expect(imported.profile.name).toBe('Scholar Noor');
    expect(imported.stats.totalXP).toBe(1450);
    expect(imported.notes).toHaveLength(1);
  });

  it('rejects an import if payload data is tampered with (checksum mismatch)', () => {
    const payload = SyncManager.createExportPayload(mockProfile, mockStats, mockProgress, mockNotes);
    // Tamper with the total XP without updating the checksum
    payload.stats.totalXP = 999999;
    const tamperedJson = JSON.stringify(payload);

    expect(() => {
      SyncManager.parseImport(tamperedJson);
    }).toThrow(/checksum mismatch/i);
  });

  it('rejects invalid JSON syntax', () => {
    expect(() => {
      SyncManager.parseImport('{ corrupted: json, missing closing');
    }).toThrow(/Failed to parse backup/);
  });

  it('rejects payloads missing core required sections', () => {
    const invalidPayload = JSON.stringify({ version: '1.1.0', stats: mockStats });
    expect(() => {
      SyncManager.parseImport(invalidPayload);
    }).toThrow(/missing core sections/i);
  });
});
