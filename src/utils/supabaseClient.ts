import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, UserStats } from '../types';

// Default project credentials provided by scholar
const DEFAULT_SUPABASE_URL = 'https://mekxzuycwqgcfrokiulo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_ThY5R1jvhaODhp7bsDpbZw_sPXv2Zlf';

// Environment variables or fallback credentials
const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;
const envAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;

// Stored manual override if configured in settings
const getStoredConfig = () => {
  if (typeof window === 'undefined') return { url: envUrl, anonKey: envAnonKey };
  try {
    const url = localStorage.getItem('mantiq_supabase_url') || envUrl;
    const anonKey = localStorage.getItem('mantiq_supabase_anon_key') || envAnonKey;
    return { url, anonKey };
  } catch {
    return { url: envUrl, anonKey: envAnonKey };
  }
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  const { url, anonKey } = getStoredConfig();
  if (url && anonKey) {
    try {
      supabaseInstance = createClient(url, anonKey);
      return supabaseInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getStoredConfig();
  return Boolean(url && anonKey);
};

export const setSupabaseCredentials = (url: string, anonKey: string): boolean => {
  try {
    localStorage.setItem('mantiq_supabase_url', url.trim());
    localStorage.setItem('mantiq_supabase_anon_key', anonKey.trim());
    supabaseInstance = null; // reset to re-initialize
    return true;
  } catch {
    return false;
  }
};

export interface LeaderboardEntry {
  id: string;
  name: string;
  university?: string;
  avatar?: string;
  xp: number;
  streak: number;
  level: number;
  updated_at?: string;
  isUser?: boolean;
  rank?: number;
}

const sanitizeText = (input: string | undefined | null, maxLen: number, fallback: string): string => {
  if (!input) return fallback;
  const clean = input
    .replace(/<[^>]*>?/gm, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
  return clean.slice(0, maxLen) || fallback;
};

const getSecureScholarId = (user: UserProfile): string => {
  if (user.id && user.id.startsWith('usr_')) {
    return user.id.slice(0, 40);
  }
  let localStoredId = typeof window !== 'undefined' ? localStorage.getItem('mantiq_scholar_uuid') : null;
  if (!localStoredId) {
    localStoredId = 'usr_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '').slice(0, 16) : Math.random().toString(36).slice(2, 14));
    if (typeof window !== 'undefined') {
      localStorage.setItem('mantiq_scholar_uuid', localStoredId);
    }
  }
  return localStoredId;
};

const PENDING_SYNC_KEY = 'mantiq_pending_sync';

export const queuePendingSync = (user: UserProfile, stats: UserStats) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify({ user, stats, queuedAt: Date.now() }));
  } catch (e) {
    console.warn('Could not queue pending sync:', e);
  }
};

export const flushPendingSyncToSupabase = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return false;

  try {
    const raw = localStorage.getItem(PENDING_SYNC_KEY);
    if (!raw) return false;
    const { user, stats } = JSON.parse(raw);
    if (user && stats) {
      const res = await syncScholarToSupabase(user, stats);
      if (res.success) {
        localStorage.removeItem(PENDING_SYNC_KEY);
        return true;
      }
    }
  } catch (e) {
    console.warn('Pending sync flush error:', e);
  }
  return false;
};

// Global automatic reconnect listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushPendingSyncToSupabase();
  });
}

/**
 * Upsert the current scholar's progress to the global Supabase leaderboard.
 * Sanitized to ensure zero private data leaks (no emails, passwords, or personal dates).
 * Automatically queues failed attempts for retry upon network recovery.
 */
export const syncScholarToSupabase = async (
  user: UserProfile,
  stats: UserStats
): Promise<{ success: boolean; error?: string }> => {
  // If browser is explicitly offline, queue immediately without throwing errors
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    queuePendingSync(user, stats);
    return { success: false, error: 'Offline mode active (queued for cloud sync)' };
  }

  const client = getSupabaseClient();
  if (!client) {
    queuePendingSync(user, stats);
    return { success: false, error: 'Supabase client unavailable' };
  }

  // Strictly sanitized public payload only
  const scholarId = getSecureScholarId(user);
  const payload = {
    id: scholarId,
    name: sanitizeText(user.name, 50, 'Scholar'),
    university: sanitizeText(user.university, 80, 'Academic Scholar'),
    avatar: sanitizeText(user.avatar || (user.name ? user.name.slice(0, 2).toUpperCase() : 'AS'), 4, 'AS'),
    xp: Math.max(0, Math.min(Math.round(Number(stats.xp) || 0), 500000)),
    streak: Math.max(0, Math.min(Math.round(Number(stats.streakDays) || 0), 1000)),
    level: Math.max(1, Math.min(Math.round(Number(stats.level) || 1), 100)),
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await client
      .from('mantiq_leaderboard')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase sync warning:', error.message);
      queuePendingSync(user, stats);
      return { success: false, error: error.message };
    }

    // Success - clean any queued sync item
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(PENDING_SYNC_KEY);
        localStorage.setItem('mantiq_last_synced_at', new Date().toISOString());
      } catch {}
    }

    return { success: true };
  } catch (err: any) {
    queuePendingSync(user, stats);
    return { success: false, error: err?.message || 'Network sync error (queued)' };
  }
};

/**
 * Fetch top scholars from the global Supabase leaderboard.
 */
export const fetchGlobalLeaderboard = async (
  currentUserId?: string,
  limit: number = 50
): Promise<LeaderboardEntry[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('mantiq_leaderboard')
      .select('id, name, university, avatar, xp, streak, level, updated_at')
      .order('xp', { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.warn('Failed to fetch Supabase leaderboard:', error?.message);
      return null;
    }

    return data.map((item, index) => ({
      id: item.id,
      name: item.name,
      university: item.university || 'Academic Scholar',
      avatar: item.avatar || item.name.slice(0, 2).toUpperCase(),
      xp: item.xp || 0,
      streak: item.streak || 0,
      level: item.level || 1,
      updated_at: item.updated_at,
      rank: index + 1,
      isUser: currentUserId ? item.id === currentUserId : false
    }));
  } catch (err) {
    console.warn('Exception during leaderboard fetch:', err);
    return null;
  }
};
