import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { soundFX } from '../utils/soundEffects';

interface AuthLandingPageProps {
  onContinueAsGuest?: () => void;
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({ onContinueAsGuest }) => {
  const { login, register, continueAsGuest } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        soundFX.playCorrect();
        setSuccessMessage('Welcome back to Mantiq! Loading your curriculum...');
      } else {
        soundFX.playIncorrect();
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    try {
      // Generate initials avatar
      const parts = name.trim().split(/\s+/);
      const avatarInitials = (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1] || '')).toUpperCase();

      const res = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        university: university.trim() || 'Independent Scholar',
        degreeProgram: degreeProgram.trim() || 'Computer Science & Artificial Intelligence',
        avatar: avatarInitials,
        password
      });

      if (res.success) {
        soundFX.playCorrect();
        setSuccessMessage('Account created successfully! Preparing your study path...');
      } else {
        soundFX.playIncorrect();
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestClick = () => {
    soundFX.playClick();
    if (continueAsGuest) {
      continueAsGuest();
    } else if (onContinueAsGuest) {
      onContinueAsGuest();
    }
  };

  return (
    <div
      className={`quest-auth-landing ${isDark ? 'dark' : 'light'}`}
      style={{
        minHeight: '100vh',
        background: 'var(--quest-bg)',
        color: 'var(--quest-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 28px',
          borderBottom: '1px solid var(--quest-border)',
          background: 'var(--quest-card-bg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'var(--quest-accent)',
              color: '#13211C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '20px',
              fontFamily: 'var(--quest-font-heading)'
            }}
          >
            M
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--quest-font-heading)',
                fontSize: '18px',
                fontWeight: 900,
                letterSpacing: '-0.3px',
                lineHeight: 1.1
              }}
            >
              Mantiq
            </div>
            <div style={{ fontSize: '11px', color: 'var(--quest-text-muted)', fontWeight: 600 }}>
              Let's have some Mantiq about AI
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--quest-bg)',
              border: '1px solid var(--quest-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--quest-text-secondary)',
              cursor: 'pointer'
            }}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '36px 20px 48px'
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            background: 'var(--quest-card-bg)',
            border: '1px solid var(--quest-border)',
            borderRadius: '24px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px'
          }}
        >
          {/* Header Title */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '100px',
                background: 'rgba(74, 222, 128, 0.1)',
                color: 'var(--quest-accent-text)',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '10px'
              }}
            >
              <GraduationCap size={14} />
              <span>Russell & Norvig AIMA 4th Edition</span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--quest-font-heading)',
                fontSize: '26px',
                fontWeight: 900,
                margin: '0 0 6px 0',
                letterSpacing: '-0.5px'
              }}
            >
              {mode === 'signin' ? 'Sign in to Mantiq' : 'Create Scholar Account'}
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--quest-text-muted)', lineHeight: 1.4 }}>
              {mode === 'signin'
                ? 'Enter your institutional or personal credentials to continue your study path.'
                : 'Join the rational agent curriculum with personalized progress, quizzes, and notes.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'var(--quest-bg)',
              borderRadius: '12px',
              padding: '4px',
              border: '1px solid var(--quest-border)'
            }}
          >
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'signin' ? 'var(--quest-card-bg)' : 'transparent',
                color: mode === 'signin' ? 'var(--quest-text-primary)' : 'var(--quest-text-muted)',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: mode === 'signin' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'register' ? 'var(--quest-card-bg)' : 'transparent',
                color: mode === 'register' ? 'var(--quest-text-primary)' : 'var(--quest-text-muted)',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Register Account
            </button>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#22C55E',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--quest-text-secondary)' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--quest-text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. noor@fast.edu.pk or scholar@gmail.com"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 36px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)',
                      background: 'var(--quest-bg)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--quest-text-secondary)' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--quest-text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 36px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)',
                      background: 'var(--quest-bg)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '11px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--quest-text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: '8px',
                  padding: '13px',
                  borderRadius: '14px',
                  background: 'var(--quest-accent)',
                  color: '#13211C',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 900,
                  fontFamily: 'var(--quest-font-heading)',
                  cursor: isLoading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(74, 222, 128, 0.35)',
                  transition: 'transform 0.1s ease'
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In to Mantiq'}
                <ArrowRight size={17} />
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--quest-text-secondary)' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--quest-text-muted)' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Noor Tariq"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 36px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)',
                      background: 'var(--quest-bg)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--quest-text-secondary)' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--quest-text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. noor@university.edu"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 36px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)',
                      background: 'var(--quest-bg)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--quest-text-secondary)' }}>
                  University / Institute / Organization
                </label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--quest-text-muted)' }} />
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. FAST NUCES / Stanford / Self-Taught"
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 36px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)',
                      background: 'var(--quest-bg)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--quest-text-secondary)' }}>
                  Field of Study / Major
                </label>
                <div style={{ position: 'relative' }}>
                  <BookOpen size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--quest-text-muted)' }} />
                  <input
                    type="text"
                    value={degreeProgram}
                    onChange={(e) => setDegreeProgram(e.target.value)}
                    placeholder="e.g. BS Computer Science / AI"
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 36px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)',
                      background: 'var(--quest-bg)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--quest-text-secondary)' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--quest-text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 4 characters)"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 36px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border)',
                      background: 'var(--quest-bg)',
                      color: 'var(--quest-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '11px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--quest-text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: '8px',
                  padding: '13px',
                  borderRadius: '14px',
                  background: 'var(--quest-accent)',
                  color: '#13211C',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 900,
                  fontFamily: 'var(--quest-font-heading)',
                  cursor: isLoading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(74, 222, 128, 0.35)',
                  transition: 'transform 0.1s ease'
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Scholar Account'}
                <Sparkles size={17} />
              </button>
            </form>
          )}

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--quest-border)' }} />
            <span style={{ fontSize: '11px', color: 'var(--quest-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              or
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--quest-border)' }} />
          </div>

          {/* Continue as Guest Button */}
          <button
            type="button"
            onClick={handleGuestClick}
            style={{
              padding: '11px 16px',
              borderRadius: '12px',
              border: '1px solid var(--quest-border)',
              background: 'transparent',
              color: 'var(--quest-text-secondary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.15s ease'
            }}
          >
            <span>Continue as Guest Scholar</span>
            <ArrowRight size={14} />
          </button>

          {/* Footer note */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--quest-text-muted)',
              textAlign: 'center',
              marginTop: '4px'
            }}
          >
            <ShieldCheck size={14} color="var(--quest-accent)" />
            <span>Encrypted local storage with offline study and sync backup.</span>
          </div>
        </div>
      </main>
    </div>
  );
};
