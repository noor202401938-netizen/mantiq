import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2
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
        backgroundColor: isDark ? '#0D1612' : '#FAF8F2',
        backgroundImage: isDark
          ? 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)'
          : 'linear-gradient(#E8E4DA 1px, transparent 1px), linear-gradient(90deg, #E8E4DA 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        color: isDark ? '#F3F5EF' : '#13211C',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      {/* Notebook Red Margin Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 'clamp(30px, 6vw, 90px)',
          width: '2px',
          backgroundColor: isDark ? 'rgba(226, 109, 85, 0.35)' : '#E26D55',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Top Bar with working Theme Toggle */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '20px clamp(24px, 5vw, 48px)',
          position: 'relative',
          zIndex: 10
        }}
      >
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
            background: isDark ? '#18251F' : '#FFFFFF',
            border: isDark ? '1px solid #2B3D34' : '1px solid #D8D4C8',
            color: isDark ? '#C9F26B' : '#13211C',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.15s ease'
          }}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDark ? 'Light Paper' : 'Dark Grid'}</span>
        </button>
      </header>

      {/* Main 2-Column Hero Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px clamp(24px, 6vw, 72px) 60px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div
          style={{
            maxWidth: '1080px',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'clamp(36px, 6vw, 80px)',
            flexWrap: 'wrap'
          }}
        >
          {/* Left Column: Hand-drawn Book Illustration & Brand Notes */}
          <div
            style={{
              flex: '1 1 420px',
              maxWidth: '520px',
              paddingLeft: 'clamp(10px, 2vw, 30px)'
            }}
          >
            {/* Hand-drawn Open Book Icon */}
            <div style={{ marginBottom: '16px' }}>
              <svg width="138" height="104" viewBox="0 0 138 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Book Base / Pages */}
                <path
                  d="M14 26C14 26 36 21 69 26C102 21 124 26 124 26V82C124 82 102 77 69 82C36 77 14 82 14 82V26Z"
                  fill={isDark ? '#15221B' : '#FFFFFF'}
                  stroke={isDark ? '#E2E8F0' : '#1A202C'}
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                {/* Center Spine */}
                <path
                  d="M69 26V82"
                  stroke={isDark ? '#E2E8F0' : '#1A202C'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Left Page Text Lines with Yellow Highlighter */}
                <rect x="24" y="38" width="34" height="9" rx="2" fill="#FEE780" />
                <line x1="26" y1="42.5" x2="56" y2="42.5" stroke={isDark ? '#A0AEC0' : '#4A5568'} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="26" y1="56" x2="56" y2="56" stroke={isDark ? '#A0AEC0' : '#4A5568'} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="26" y1="67" x2="48" y2="67" stroke={isDark ? '#A0AEC0' : '#4A5568'} strokeWidth="2.5" strokeLinecap="round" />

                {/* Right Page Text Lines with Orange Checkmark */}
                <line x1="80" y1="42.5" x2="112" y2="42.5" stroke={isDark ? '#A0AEC0' : '#4A5568'} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="80" y1="56" x2="112" y2="56" stroke={isDark ? '#A0AEC0' : '#4A5568'} strokeWidth="2.5" strokeLinecap="round" />

                {/* Orange Checkmark */}
                <path
                  d="M83 66L93 75L114 49"
                  stroke="#D95C38"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Brand Title */}
            <h1
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 'clamp(44px, 5.5vw, 58px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.05,
                margin: '0 0 6px 0',
                color: isDark ? '#FFFFFF' : '#111827'
              }}
            >
              Mantiq
            </h1>

            {/* Handwritten Subtitle */}
            <div
              style={{
                fontFamily: "'Caveat', cursive, sans-serif",
                fontSize: 'clamp(24px, 3vw, 29px)',
                fontWeight: 700,
                color: '#D15C3D',
                marginBottom: '28px',
                letterSpacing: '0.01em',
                lineHeight: 1.2
              }}
            >
              learn anything, in your own notes
            </div>

            {/* Feature Bullets with Arrows */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontSize: '15px',
                lineHeight: 1.5,
                color: isDark ? '#A3B3AA' : '#4B5563'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: isDark ? '#E2E8F0' : '#1A202C', fontWeight: 800 }}>→</span>
                <span>courses in Russell & Norvig AIMA 4th edition, written to be understood</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: isDark ? '#E2E8F0' : '#1A202C', fontWeight: 800 }}>→</span>
                <span>quizzes, assignments and feedback that help you improve</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: isDark ? '#E2E8F0' : '#1A202C', fontWeight: 800 }}>→</span>
                <span>an AI tutor and a study group when you get stuck</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Notebook Card */}
          <div
            style={{
              flex: '1 1 380px',
              maxWidth: '460px',
              width: '100%',
              background: isDark ? '#14221C' : '#FFFFFF',
              border: isDark ? '1.5px solid #283C32' : '1.5px solid #1A202C',
              borderRadius: '18px',
              padding: 'clamp(28px, 4vw, 40px)',
              boxShadow: isDark
                ? '0 20px 50px rgba(0,0,0,0.5), 2px 4px 0px #09100C'
                : '0 20px 50px rgba(0,0,0,0.06), 2px 4px 0px #1A202C',
              boxSizing: 'border-box'
            }}
          >
            {/* Card Header */}
            <div style={{ marginBottom: '22px' }}>
              <h2
                style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontSize: '28px',
                  fontWeight: 800,
                  margin: '0 0 6px 0',
                  color: isDark ? '#F3F5EF' : '#111827',
                  letterSpacing: '-0.02em'
                }}
              >
                {mode === 'signin' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: isDark ? '#8A9B91' : '#6B7280'
                }}
              >
                {mode === 'signin' ? 'pick up where you left off' : 'join the rational agent curriculum'}
              </p>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
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
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(34, 197, 94, 0.1)',
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
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    style={{
                      width: '100%',
                      padding: '13px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1.5px solid #2B3D34' : '1.5px solid #D1D5DB',
                      background: isDark ? '#0D1612' : '#FFFFFF',
                      color: isDark ? '#F3F5EF' : '#111827',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease'
                    }}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{
                      width: '100%',
                      padding: '13px 42px 13px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1.5px solid #2B3D34' : '1.5px solid #D1D5DB',
                      background: isDark ? '#0D1612' : '#FFFFFF',
                      color: isDark ? '#F3F5EF' : '#111827',
                      fontSize: '15px',
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
                      top: '13px',
                      background: 'none',
                      border: 'none',
                      color: isDark ? '#8A9B91' : '#6B7280',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Remember me & Forgot Password */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    margin: '2px 0 6px'
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: isDark ? '#A3B3AA' : '#4B5563',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ cursor: 'pointer', accentColor: '#1B314B' }}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Enter any email address to sign in or click Continue as Guest Scholar.')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isDark ? '#C9F26B' : '#1B314B',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '13px',
                    borderRadius: '10px',
                    background: isDark ? '#C9F26B' : '#1B314B',
                    color: isDark ? '#13211C' : '#FFFFFF',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: isLoading ? 'wait' : 'pointer',
                    boxShadow: isDark ? '0 4px 12px rgba(201, 242, 107, 0.3)' : '0 4px 12px rgba(27, 49, 75, 0.25)',
                    transition: 'opacity 0.15s ease'
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: isDark ? '1.5px solid #2B3D34' : '1.5px solid #D1D5DB',
                    background: isDark ? '#0D1612' : '#FFFFFF',
                    color: isDark ? '#F3F5EF' : '#111827',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: isDark ? '1.5px solid #2B3D34' : '1.5px solid #D1D5DB',
                    background: isDark ? '#0D1612' : '#FFFFFF',
                    color: isDark ? '#F3F5EF' : '#111827',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="University / Organization"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: isDark ? '1.5px solid #2B3D34' : '1.5px solid #D1D5DB',
                    background: isDark ? '#0D1612' : '#FFFFFF',
                    color: isDark ? '#F3F5EF' : '#111827',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="text"
                  value={degreeProgram}
                  onChange={(e) => setDegreeProgram(e.target.value)}
                  placeholder="Field of Study / Major"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: isDark ? '1.5px solid #2B3D34' : '1.5px solid #D1D5DB',
                    background: isDark ? '#0D1612' : '#FFFFFF',
                    color: isDark ? '#F3F5EF' : '#111827',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password (min 4 chars)"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1.5px solid #2B3D34' : '1.5px solid #D1D5DB',
                      background: isDark ? '#0D1612' : '#FFFFFF',
                      color: isDark ? '#F3F5EF' : '#111827',
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
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      color: isDark ? '#8A9B91' : '#6B7280',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    marginTop: '4px',
                    padding: '13px',
                    borderRadius: '10px',
                    background: isDark ? '#C9F26B' : '#1B314B',
                    color: isDark ? '#13211C' : '#FFFFFF',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: isLoading ? 'wait' : 'pointer',
                    boxShadow: isDark ? '0 4px 12px rgba(201, 242, 107, 0.3)' : '0 4px 12px rgba(27, 49, 75, 0.25)',
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
                  color: isDark ? '#C9F26B' : '#1B314B',
                  fontSize: '13px',
                  fontWeight: 700,
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
                borderTop: isDark ? '1px solid #23352B' : '1px solid #E5E7EB',
                textAlign: 'center'
              }}
            >
              <button
                type="button"
                onClick={handleGuestClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDark ? '#9AA89F' : '#6B7280',
                  fontSize: '13px',
                  fontWeight: 600,
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
