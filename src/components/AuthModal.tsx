import React, { useState } from 'react';
import { X, Lock, Mail, Check, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    login,
    register
  } = useAuth();

  // Tab: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(authModalMode);

  // Simple Email & Password fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync active tab with context when modal opens
  React.useEffect(() => {
    setActiveTab(authModalMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (activeTab === 'signin') {
        const res = await login(email, password);
        if (res.success) {
          soundFX.playCorrect();
          setSuccessMessage('Welcome back to Mantiq!');
          setTimeout(() => {
            closeAuthModal();
          }, 400);
        } else {
          setErrorMessage(res.error || 'Invalid email or password.');
        }
      } else {
        // Sign up with just email & password
        const res = await register({
          email,
          password
        });

        if (res.success) {
          soundFX.playCorrect();
          setSuccessMessage('Account created successfully!');
          setTimeout(() => {
            closeAuthModal();
          }, 400);
        } else {
          setErrorMessage(res.error || 'Failed to create account.');
        }
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal} style={{ zIndex: 1200 }}>
      <div
        className="modal-card auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          width: '92%',
          background: 'var(--quest-card-bg)',
          borderRadius: '24px',
          border: '1px solid var(--quest-border)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '24px 24px 16px',
            borderBottom: '1px solid var(--quest-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--quest-accent)',
                color: '#13211C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '18px'
              }}
            >
              M
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--quest-font-heading)',
                  fontSize: '20px',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--quest-text-primary)'
                }}
              >
                Mantiq
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--quest-text-secondary)' }}>
                Let's have some Mantiq about AI
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              closeAuthModal();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--quest-text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher (Sign In vs Sign Up) */}
        <div
          style={{
            display: 'flex',
            padding: '10px 24px 0',
            borderBottom: '1px solid var(--quest-border)',
            gap: '12px'
          }}
        >
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('signin');
              setErrorMessage(null);
            }}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'signin' ? '3px solid var(--quest-accent)' : '3px solid transparent',
              fontFamily: 'var(--quest-font-heading)',
              fontSize: '15px',
              fontWeight: 700,
              color: activeTab === 'signin' ? 'var(--quest-text-primary)' : 'var(--quest-text-secondary)',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('signup');
              setErrorMessage(null);
            }}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'signup' ? '3px solid var(--quest-accent)' : '3px solid transparent',
              fontFamily: 'var(--quest-font-heading)',
              fontSize: '15px',
              fontWeight: 700,
              color: activeTab === 'signup' ? 'var(--quest-text-primary)' : 'var(--quest-text-secondary)',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Error Alert */}
          {errorMessage && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#22C55E',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              <Check size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Minimal 2-field form: Email & Password */}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'var(--quest-bg)',
                  border: '1px solid var(--quest-border)',
                  color: 'var(--quest-text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                  <Lock size={14} /> Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--quest-text-muted)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={activeTab === 'signin' ? 'Enter password' : 'Create password (min 6 characters)'}
                minLength={activeTab === 'signup' ? 6 : undefined}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'var(--quest-bg)',
                  border: '1px solid var(--quest-border)',
                  color: 'var(--quest-text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '14px',
                background: 'var(--quest-accent)',
                border: 'none',
                color: '#13211C',
                fontFamily: 'var(--quest-font-heading)',
                fontSize: '16px',
                fontWeight: 800,
                cursor: isLoading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading
                ? 'Processing...'
                : activeTab === 'signin'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--quest-text-secondary)' }}>
            {activeTab === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('signup');
                    setErrorMessage(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--quest-accent-text)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('signin');
                    setErrorMessage(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--quest-accent-text)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>



          {/* Security notice */}
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--quest-text-muted)'
            }}
          >
            <ShieldCheck size={14} color="var(--quest-accent-text)" />
            <span>Secure local session persistence</span>
          </div>
        </div>
      </div>
    </div>
  );
};
