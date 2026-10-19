import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

export interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isGuest: boolean;
  hasStartedSession: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openSignIn: () => void;
  openSignUp: () => void;
  closeAuthModal: () => void;
  continueAsGuest: () => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Partial<UserProfile> & { password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  demoProfiles: UserProfile[];
}

export const DEFAULT_SCHOLAR_PROFILE: UserProfile = {
  id: 'usr_guest',
  name: 'Auditing Scholar',
  email: '',
  avatar: 'AS',
  university: 'Independent Scholar',
  degreeProgram: 'Artificial Intelligence',
  academicRole: 'undergraduate',
  bio: 'Auditing Russell & Norvig 4th Edition (AIMA).',
  currentTitle: 'Apprentice Agent',
  targetExamDate: '2026-12-15',
  targetScore: 90,
  dailyGoalMinutes: 30,
  joinedDate: new Date().toISOString().slice(0, 10),
  offlineReady: true,
  lastSyncedAt: new Date().toISOString(),
  isGuest: true
};

export const GUEST_PROFILE = DEFAULT_SCHOLAR_PROFILE;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session tracking: preserve session across page refreshes until explicit logout
  const [hasStartedSession, setHasStartedSession] = useState<boolean>(() => {
    const sessionActive = localStorage.getItem('mantiq_session_active');
    if (sessionActive === 'true') {
      return true;
    }
    const saved = localStorage.getItem('aima_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  });

  // Active User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aima_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.id === 'usr_stanford_01' ||
          parsed.email === 'alex.mercer@stanford.edu' ||
          parsed.id === 'usr_mit_02' ||
          parsed.id === 'usr_berkeley_03'
        ) {
          localStorage.removeItem('aima_user_profile');
          localStorage.removeItem('mantiq_session_active');
          return DEFAULT_SCHOLAR_PROFILE;
        }
        return parsed;
      } catch {
        return DEFAULT_SCHOLAR_PROFILE;
      }
    }
    return DEFAULT_SCHOLAR_PROFILE;
  });

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Persistence: persist active session and profile
  useEffect(() => {
    if (hasStartedSession && user && user.id) {
      localStorage.setItem('aima_user_profile', JSON.stringify(user));
      localStorage.setItem('mantiq_session_active', 'true');
    }
  }, [user, hasStartedSession]);

  const isAuthenticated = !user.isGuest && Boolean(user.email);
  const isGuest = !!user.isGuest;

  const openSignIn = () => {
    setAuthModalMode('signin');
    setIsAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const continueAsGuest = () => {
    const guestUser: UserProfile = {
      ...DEFAULT_SCHOLAR_PROFILE,
      id: `usr_guest_${Date.now()}`
    };
    setUser(guestUser);
    setHasStartedSession(true);
    localStorage.setItem('aima_user_profile', JSON.stringify(guestUser));
    localStorage.setItem('mantiq_session_active', 'true');
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Check saved accounts
    try {
      const savedAccountsRaw = localStorage.getItem('aima_registered_users');
      const accounts: Array<{ profile: UserProfile; passwordHash?: string }> = savedAccountsRaw
        ? JSON.parse(savedAccountsRaw)
        : [];

      const account = accounts.find((a) => a.profile.email.toLowerCase() === cleanEmail);
      if (account) {
        if (password && account.passwordHash && account.passwordHash !== password) {
          return { success: false, error: 'Incorrect password for this registered email.' };
        }
        const updatedProfile = {
          ...account.profile,
          lastSyncedAt: new Date().toISOString(),
          isGuest: false
        };
        setUser(updatedProfile);
        setHasStartedSession(true);
        localStorage.setItem('aima_user_profile', JSON.stringify(updatedProfile));
        localStorage.setItem('mantiq_session_active', 'true');
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch {
      // Fallback
    }

    // If new institutional/personal email, automatically provision a profile
    if (cleanEmail.includes('@') && cleanEmail.includes('.')) {
      const parts = cleanEmail.split('@');
      const namePart = parts[0]
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
      const domain = parts[1];
      const guessedUni = domain.includes('edu') ? domain.replace('.edu', '').toUpperCase() + ' University' : 'Academic Scholar';

      const initials = namePart ? namePart.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() : 'AS';

      const newProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        name: namePart || 'AI Scholar',
        email: cleanEmail,
        avatar: initials,
        university: guessedUni,
        degreeProgram: 'Computer Science & Artificial Intelligence',
        academicRole: 'graduate',
        bio: 'Studying Russell & Norvig 4th Edition.',
        currentTitle: 'Rational Agent Scholar',
        targetExamDate: '2026-12-15',
        targetScore: 90,
        dailyGoalMinutes: 30,
        joinedDate: new Date().toISOString().slice(0, 10),
        offlineReady: true,
        lastSyncedAt: new Date().toISOString(),
        isGuest: false
      };

      try {
        const savedAccountsRaw = localStorage.getItem('aima_registered_users');
        const accounts = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : [];
        accounts.push({ profile: newProfile, passwordHash: password });
        localStorage.setItem('aima_registered_users', JSON.stringify(accounts));
      } catch {
        // ignore
      }

      setUser(newProfile);
      setHasStartedSession(true);
      localStorage.setItem('aima_user_profile', JSON.stringify(newProfile));
      localStorage.setItem('mantiq_session_active', 'true');
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return { success: false, error: 'Please enter a valid academic institutional or personal email address.' };
  };

  const register = async (data: Partial<UserProfile> & { password?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!data.email || !data.email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }

    const initials = data.name
      ? data.name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
      : 'NS';

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: data.name?.trim() || 'New Scholar',
      email: data.email.trim().toLowerCase(),
      avatar: data.avatar || initials,
      university: data.university?.trim() || 'Independent Scholar',
      degreeProgram: data.degreeProgram?.trim() || 'Computer Science & AI',
      academicRole: data.academicRole || 'undergraduate',
      bio: data.bio?.trim() || 'Engaged in comprehensive study of Russell & Norvig (AIMA).',
      currentTitle: 'Apprentice Agent',
      targetExamDate: data.targetExamDate || '2026-12-20',
      targetScore: data.targetScore || 90,
      dailyGoalMinutes: data.dailyGoalMinutes || 30,
      joinedDate: new Date().toISOString().slice(0, 10),
      offlineReady: true,
      lastSyncedAt: new Date().toISOString(),
      isGuest: false
    };

    try {
      const savedAccountsRaw = localStorage.getItem('aima_registered_users');
      const accounts = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : [];
      // Replace if account exists, otherwise push
      const existingIdx = accounts.findIndex((a: any) => a.profile.email.toLowerCase() === newProfile.email);
      if (existingIdx >= 0) {
        accounts[existingIdx] = { profile: newProfile, passwordHash: data.password };
      } else {
        accounts.push({ profile: newProfile, passwordHash: data.password });
      }
      localStorage.setItem('aima_registered_users', JSON.stringify(accounts));
    } catch {
      // ignore
    }

    setUser(newProfile);
    setHasStartedSession(true);
    localStorage.setItem('aima_user_profile', JSON.stringify(newProfile));
    localStorage.setItem('mantiq_session_active', 'true');
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('aima_user_profile');
    localStorage.removeItem('mantiq_session_active');
    localStorage.removeItem('mantiq_active_tab');
    localStorage.removeItem('mantiq_active_lesson_chapter');
    localStorage.removeItem('mantiq_learn_subview');
    setUser(DEFAULT_SCHOLAR_PROFILE);
    setHasStartedSession(false);
  };

  const switchProfile = (profile: UserProfile) => {
    setUser(profile);
    setHasStartedSession(true);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
      lastSyncedAt: new Date().toISOString()
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isGuest,
        hasStartedSession,
        isAuthModalOpen,
        authModalMode,
        openSignIn,
        openSignUp,
        closeAuthModal,
        continueAsGuest,
        login,
        register,
        logout,
        switchProfile,
        updateProfile,
        demoProfiles: []
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
