import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

export interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openSignIn: () => void;
  openSignUp: () => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Partial<UserProfile> & { password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  demoProfiles: UserProfile[];
}

export const DEFAULT_SCHOLAR_PROFILE: UserProfile = {
  id: 'usr_scholar',
  name: 'AI Scholar',
  email: '',
  avatar: 'AS',
  university: 'Academic AI Lab',
  degreeProgram: 'Computer Science & Artificial Intelligence',
  academicRole: 'undergraduate',
  bio: 'Studying Russell & Norvig 4th Edition (AIMA).',
  currentTitle: 'Apprentice Agent',
  targetExamDate: '2026-12-15',
  targetScore: 95,
  dailyGoalMinutes: 30,
  joinedDate: new Date().toISOString().slice(0, 10),
  offlineReady: true,
  lastSyncedAt: new Date().toISOString(),
  isGuest: true
};

export const GUEST_PROFILE = DEFAULT_SCHOLAR_PROFILE;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active User Profile - Initialize with saved user or clean scholar profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aima_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Wipe legacy demo profiles if found in local storage
        if (
          parsed.id === 'usr_stanford_01' ||
          parsed.email === 'alex.mercer@stanford.edu' ||
          parsed.id === 'usr_mit_02' ||
          parsed.id === 'usr_berkeley_03'
        ) {
          localStorage.removeItem('aima_user_profile');
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

  // Persistence
  useEffect(() => {
    localStorage.setItem('aima_user_profile', JSON.stringify(user));
  }, [user]);

  const isAuthenticated = !user.isGuest;
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
        setUser({
          ...account.profile,
          lastSyncedAt: new Date().toISOString(),
          isGuest: false
        });
        setIsAuthModalOpen(false);
        return { success: true };
      }
    } catch {
      // Fallback
    }

    // If new academic email, automatically provision a profile
    if (cleanEmail.includes('@') && cleanEmail.includes('.')) {
      const parts = cleanEmail.split('@');
      const namePart = parts[0]
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
      const domain = parts[1];
      const guessedUni = domain.includes('edu') ? domain.replace('.edu', '').toUpperCase() + ' University' : 'Academic Scholar';

      const newProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        name: namePart || 'AI Scholar',
        email: cleanEmail,
        avatar: 'AS',
        university: guessedUni,
        degreeProgram: 'Computer Science & Artificial Intelligence',
        academicRole: 'graduate',
        bio: 'Studying Russell & Norvig 4th Edition.',
        currentTitle: 'Rational Agent Scholar',
        targetExamDate: '2026-12-15',
        targetScore: 95,
        dailyGoalMinutes: 30,
        joinedDate: new Date().toISOString().slice(0, 10),
        offlineReady: true,
        lastSyncedAt: new Date().toISOString(),
        isGuest: false
      };

      // Save to registered accounts
      try {
        const savedAccountsRaw = localStorage.getItem('aima_registered_users');
        const accounts = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : [];
        accounts.push({ profile: newProfile });
        localStorage.setItem('aima_registered_users', JSON.stringify(accounts));
      } catch {
        // ignore
      }

      setUser(newProfile);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return { success: false, error: 'Please enter a valid academic institutional or personal email address.' };
  };

  const register = async (data: Partial<UserProfile> & { password?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!data.email || !data.email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: data.name?.trim() || 'New Scholar',
      email: data.email.trim().toLowerCase(),
      avatar: data.avatar || 'NS',
      university: data.university?.trim() || 'University AI Institute',
      degreeProgram: data.degreeProgram?.trim() || 'Computer Science / Machine Learning',
      academicRole: data.academicRole || 'undergraduate',
      bio: data.bio?.trim() || 'Engaged in comprehensive study of Russell & Norvig.',
      currentTitle: 'Rational Agent Apprentice',
      targetExamDate: data.targetExamDate || '2026-12-20',
      targetScore: data.targetScore || 95,
      dailyGoalMinutes: data.dailyGoalMinutes || 30,
      joinedDate: new Date().toISOString().slice(0, 10),
      offlineReady: true,
      lastSyncedAt: new Date().toISOString(),
      isGuest: false
    };

    try {
      const savedAccountsRaw = localStorage.getItem('aima_registered_users');
      const accounts = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : [];
      accounts.push({ profile: newProfile, passwordHash: data.password });
      localStorage.setItem('aima_registered_users', JSON.stringify(accounts));
    } catch {
      // ignore
    }

    setUser(newProfile);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser({
      ...GUEST_PROFILE,
      id: `usr_guest_${Date.now()}`
    });
  };

  const switchProfile = (profile: UserProfile) => {
    setUser(profile);
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
        isAuthModalOpen,
        authModalMode,
        openSignIn,
        openSignUp,
        closeAuthModal,
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
