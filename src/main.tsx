import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Mantiq Application Caught Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReturnHome = () => {
    try {
      localStorage.setItem('mantiq_active_tab', 'home');
      localStorage.removeItem('mantiq_active_lesson_chapter');
    } catch {}
    window.location.reload();
  };

  handleReset = () => {
    if (window.confirm('Are you sure you want to clear your local cache? This will reset your local study streak and offline notes.')) {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {}
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F3F5EF',
            color: '#13211C',
            fontFamily: "'Inter', sans-serif",
            padding: '20px'
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px 28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
              textAlign: 'center',
              border: '1px solid #E2E6DD'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '22px'
              }}
            >
              ⚠️
            </div>
            <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: '24px', margin: '0 0 8px', fontWeight: 800 }}>
              An Unexpected Glitch Occurred
            </h2>
            <p style={{ fontSize: '13.5px', color: '#4D5F55', lineHeight: 1.5, margin: '0 0 24px' }}>
              Your study notes and achievements are safely preserved on your device. Let's recover your session.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={this.handleReturnHome}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '12px',
                  background: '#C9F26B',
                  color: '#13211C',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(201, 242, 107, 0.4)'
                }}
              >
                Return to Home Dashboard
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '12px',
                  background: '#F3F5EF',
                  color: '#13211C',
                  border: '1px solid #D1D5DB',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '11.5px',
                  marginTop: '8px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear all cached data and restart
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
