import { UserProfile, UserStats, ChapterProgress, StudyNote } from '../types';

export interface SyncPayload {
  version: string;
  timestamp: string;
  profile: UserProfile;
  stats: UserStats;
  progress: Record<number, ChapterProgress>;
  notes?: StudyNote[];
  checksum: string;
}

export class SyncManager {
  // Simple deterministic checksum for verification
  private static computeChecksum(dataStr: string): string {
    let hash = 0;
    for (let i = 0; i < dataStr.length; i++) {
      const char = dataStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36).toUpperCase();
  }

  // Create an exportable sync payload
  public static createExportPayload(
    profile: UserProfile,
    stats: UserStats,
    progress: Record<number, ChapterProgress>,
    notes: StudyNote[] = []
  ): SyncPayload {
    const updatedProfile: UserProfile = {
      ...profile,
      lastSyncedAt: new Date().toISOString()
    };
    const rawData = JSON.stringify({ profile: updatedProfile, stats, progress, notes });
    const checksum = this.computeChecksum(rawData);

    return {
      version: '1.1.0',
      timestamp: new Date().toISOString(),
      profile: updatedProfile,
      stats,
      progress,
      notes,
      checksum
    };
  }

  // Download state as a JSON file
  public static exportToFile(payload: SyncPayload, filename = 'aima-study-backup.json') {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Validate and parse an imported sync payload
  public static parseImport(jsonString: string): SyncPayload {
    try {
      const data = JSON.parse(jsonString) as SyncPayload;
      if (!data.profile || !data.stats || !data.progress) {
        throw new Error('Invalid AIMA backup structure: missing core sections.');
      }

      // Verify payload integrity checksum if provided
      if (data.checksum) {
        const rawData = JSON.stringify({
          profile: data.profile,
          stats: data.stats,
          progress: data.progress,
          notes: data.notes || []
        });
        const expectedChecksum = this.computeChecksum(rawData);
        if (data.checksum !== expectedChecksum) {
          throw new Error('Backup integrity check failed: checksum mismatch (data may be corrupted or modified).');
        }
      }

      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown parsing error';
      throw new Error(`Failed to parse backup: ${msg}`);
    }
  }

  // Generate a temporary 6-digit sync key
  public static generateSyncCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Request Push Notification permission
  public static async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Send a study notification
  public static sendStudyNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title,
            body
          });
        } else {
          new Notification(title, {
            body,
            icon: '/icon-192.png'
          });
        }
      } catch (e) {
        console.warn('Notification failed:', e);
      }
    }
  }
}
