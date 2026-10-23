import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  GraduationCap
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
  const [rememberMe, setRememberMe] = useState(true);

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
      const parts = name.trim().split(/\s+/);
      const avatarInitials = (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1] || '')).toUpperCase();

      const res = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        university: university.trim() || 'Independent Scholar',
        degreeProgram: degreeProgram.trim() || 'Computer Science & AI',
        avatar: avatarInitials,
        password
      });

      if (res.success) {
        soundFX.playCorrect();
        setSuccessMessage('Account created successfully! Loading your study path...');
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
        width: '100%',
        position: 'relative',
        backgroundColor: 'var(--quest-bg, #F3F5EF)',
        color: 'var(--quest-text-primary, #13211C)',
        fontFamily: 'var(--quest-font-body, "Inter", sans-serif)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        transition: 'background-color 0.25s ease, color 0.25s ease'
      }}
    >
      {/* Subtle App Watermark Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDark
            ? 'radial-gradient(rgba(201, 242, 107, 0.04) 1px, transparent 1px)'
            : 'radial-gradient(rgba(19, 33, 28, 0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Top Bar with Brand Badge & Theme Toggle */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px clamp(24px, 5vw, 60px)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="./mantiq-logo.png"
            alt="Mantiq Logo"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              objectFit: 'cover',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--quest-font-heading, "Newsreader", serif)',
                fontSize: '19px',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--quest-text-primary, #13211C)'
              }}
            >
              Mantiq
            </div>
            <div style={{ fontSize: '11px', color: 'var(--quest-text-muted, #7E9084)', fontWeight: 600 }}>
              Let's have some Mantiq about AI
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            toggleTheme();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '12px',
            background: 'var(--quest-card-bg, #FFFFFF)',
            border: '1px solid var(--quest-border, #E2E6DD)',
            color: isDark ? 'var(--quest-accent, #C9F26B)' : 'var(--quest-text-primary, #13211C)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease'
          }}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
        </button>
      </header>

      {/* Main 2-Column Hero Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px clamp(24px, 5vw, 64px) 56px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div
          style={{
            maxWidth: '1060px',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'clamp(36px, 5vw, 72px)',
            flexWrap: 'wrap'
          }}
        >
          {/* Left Column: Hand-drawn Book Illustration & Brand Hero */}
          <div
            style={{
              flex: '1 1 420px',
              maxWidth: '520px'
            }}
          >
            {/* Textbook Open Illustration with Citron Lime Highlighter & Emerald Checkmark */}
            <div style={{ marginBottom: '20px' }}>
              <svg width="140" height="104" viewBox="0 0 140 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Book Base / Pages */}
                <path
                  d="M15 26C15 26 37 21 70 26C103 21 125 26 125 26V82C125 82 103 77 70 82C37 77 15 82 15 82V26Z"
                  fill={isDark ? '#18231D' : '#FFFFFF'}
                  stroke={isDark ? '#E2E6DD' : '#13211C'}
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                {/* Center Spine */}
                <path
                  d="M70 26V82"
                  stroke={isDark ? '#E2E6DD' : '#13211C'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Left Page Text Lines with Citron Lime Highlighter */}
                <rect x="25" y="38" width="34" height="9" rx="2" fill={isDark ? '#C9F26B' : '#C9F26B'} opacity={isDark ? 0.85 : 0.9} />
                <line x1="27" y1="42.5" x2="57" y2="42.5" stroke="#13211C" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="27" y1="56" x2="57" y2="56" stroke={isDark ? '#9AA89F' : '#4D5F55'} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="27" y1="67" x2="49" y2="67" stroke={isDark ? '#9AA89F' : '#4D5F55'} strokeWidth="2.5" strokeLinecap="round" />

                {/* Right Page Text Lines */}
                <line x1="81" y1="42.5" x2="113" y2="42.5" stroke={isDark ? '#9AA89F' : '#4D5F55'} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="81" y1="56" x2="113" y2="56" stroke={isDark ? '#9AA89F' : '#4D5F55'} strokeWidth="2.5" strokeLinecap="round" />

                {/* Accent Checkmark */}
                <path
                  d="M84 66L94 75L115 49"
                  stroke={isDark ? '#C9F26B' : '#13211C'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Curriculum Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '100px',
                background: isDark ? 'rgba(201, 242, 107, 0.12)' : 'rgba(19, 33, 28, 0.06)',
                color: isDark ? '#C9F26B' : '#13211C',
                fontSize: '12px',
                fontWeight: 800,
                marginBottom: '12px'
              }}
            >
              <GraduationCap size={14} />
              <span>Russell & Norvig AIMA 4th Edition</span>
            </div>

            {/* Brand Title */}
            <h1
              style={{
                fontFamily: 'var(--quest-font-heading, "Newsreader", Georgia, serif)',
                fontSize: 'clamp(46px, 5.5vw, 62px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                margin: '0 0 8px 0',
                color: 'var(--quest-text-primary, #13211C)'
              }}
            >
              Mantiq
            </h1>

            {/* User Slogan - Kept verbatim and styled with authentic elegance */}
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 'clamp(24px, 3vw, 30px)',
                fontWeight: 700,
                color: isDark ? '#C9F26B' : '#13211C',
                marginBottom: '28px',
                letterSpacing: '-0.01em',
                lineHeight: 1.25
              }}
            >
              Let's have some Mantiq about AI
            </div>

            {/* Feature Bullets with Arrows */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontSize: '15px',
                lineHeight: 1.5,
                color: 'var(--quest-text-secondary, #4D5F55)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--quest-text-primary, #13211C)', fontWeight: 800, fontSize: '16px' }}>→</span>
                <span>courses in Russell & Norvig AIMA 4th edition, written to be understood</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--quest-text-primary, #13211C)', fontWeight: 800, fontSize: '16px' }}>→</span>
                <span>interactive visual simulations, quizzes, and algorithmic feedback that help you improve</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--quest-text-primary, #13211C)', fontWeight: 800, fontSize: '16px' }}>→</span>
                <span>an interactive AI study path and university exam preparation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Auth Card Cohesive with App Design */}
          <div
            style={{
              flex: '1 1 380px',
              maxWidth: '460px',
              width: '100%',
              background: 'var(--quest-card-bg, #FFFFFF)',
              border: '1px solid var(--quest-border, #E2E6DD)',
              borderRadius: 'var(--quest-radius-card, 24px)',
              padding: 'clamp(28px, 4vw, 40px)',
              boxShadow: isDark
                ? '0 24px 60px rgba(0,0,0,0.5)'
                : '0 20px 50px rgba(19, 33, 28, 0.08)',
              boxSizing: 'border-box'
            }}
          >
            {/* Card Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontFamily: 'var(--quest-font-heading, "Newsreader", Georgia, serif)',
                  fontSize: '28px',
                  fontWeight: 900,
                  margin: '0 0 6px 0',
                  color: 'var(--quest-text-primary, #13211C)',
                  letterSpacing: '-0.02em'
                }}
              >
                {mode === 'signin' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'var(--quest-text-muted, #7E9084)'
                }}
              >
                {mode === 'signin' ? 'pick up where you left off' : 'join the rational agent curriculum'}
              </p>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div
                style={{
                  padding: '11px 14px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div
                style={{
                  padding: '11px 14px',
                  borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#22C55E',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}
              >
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Sign In Form */}
            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--quest-text-secondary, #4D5F55)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. scholar@university.edu"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border, #E2E6DD)',
                      background: 'var(--quest-bg, #F3F5EF)',
                      color: 'var(--quest-text-primary, #13211C)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--quest-text-secondary, #4D5F55)' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--quest-border, #E2E6DD)',
                        background: 'var(--quest-bg, #F3F5EF)',
                        color: 'var(--quest-text-primary, #13211C)',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--quest-text-muted, #7E9084)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '13px',
                    margin: '2px 0 6px'
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--quest-text-secondary, #4D5F55)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ cursor: 'pointer', accentColor: '#13211C' }}
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                {/* Primary Submit Button matching App Accent */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '13px',
                    borderRadius: '14px',
                    background: 'var(--quest-accent, #C9F26B)',
                    color: '#13211C',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 900,
                    fontFamily: 'var(--quest-font-heading, "Newsreader", serif)',
                    cursor: isLoading ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(201, 242, 107, 0.4)',
                    transition: 'transform 0.1s ease, opacity 0.15s ease'
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: 'var(--quest-text-secondary, #4D5F55)' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Noor Tariq"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border, #E2E6DD)',
                      background: 'var(--quest-bg, #F3F5EF)',
                      color: 'var(--quest-text-primary, #13211C)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: 'var(--quest-text-secondary, #4D5F55)' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. noor@university.edu"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border, #E2E6DD)',
                      background: 'var(--quest-bg, #F3F5EF)',
                      color: 'var(--quest-text-primary, #13211C)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: 'var(--quest-text-secondary, #4D5F55)' }}>
                    University / Institution
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. FAST NUCES / Self-Taught"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border, #E2E6DD)',
                      background: 'var(--quest-bg, #F3F5EF)',
                      color: 'var(--quest-text-primary, #13211C)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: 'var(--quest-text-secondary, #4D5F55)' }}>
                    Field of Study / Major
                  </label>
                  <input
                    type="text"
                    value={degreeProgram}
                    onChange={(e) => setDegreeProgram(e.target.value)}
                    placeholder="e.g. BS Computer Science / AI"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1px solid var(--quest-border, #E2E6DD)',
                      background: 'var(--quest-bg, #F3F5EF)',
                      color: 'var(--quest-text-primary, #13211C)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: 'var(--quest-text-secondary, #4D5F55)' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create Password (min 4 chars)"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 42px 11px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--quest-border, #E2E6DD)',
                        background: 'var(--quest-bg, #F3F5EF)',
                        color: 'var(--quest-text-primary, #13211C)',
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
                        right: '12px',
                        top: '11px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--quest-text-muted, #7E9084)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    marginTop: '4px',
                    padding: '13px',
                    borderRadius: '14px',
                    background: 'var(--quest-accent, #C9F26B)',
                    color: '#13211C',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 900,
                    fontFamily: 'var(--quest-font-heading, "Newsreader", serif)',
                    cursor: isLoading ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(201, 242, 107, 0.4)',
                    transition: 'opacity 0.15s ease'
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Toggle Sign In / Create Account Link */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setMode(mode === 'signin' ? 'register' : 'signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDark ? 'var(--quest-accent, #C9F26B)' : '#13211C',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign In'}
              </button>
            </div>

            {/* Guest Scholar Option */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--quest-border, #E2E6DD)',
                textAlign: 'center'
              }}
            >
              <button
                type="button"
                onClick={handleGuestClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--quest-text-secondary, #4D5F55)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Continue as Guest Scholar</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
