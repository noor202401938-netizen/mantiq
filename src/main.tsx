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

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
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
              maxWidth: '460px',
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px 28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
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
                fontSize: '24px'
              }}
            >
              ⚠️
            </div>
            <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: '24px', margin: '0 0 8px', fontWeight: 800 }}>
              Mantiq Needs a Refresh
            </h2>
            <p style={{ fontSize: '13px', color: '#4D5F55', lineHeight: 1.5, margin: '0 0 24px' }}>
              A previous session cache needs to be cleared to display the updated Sign In and study curriculum.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '14px',
                background: '#C9F26B',
                color: '#13211C',
                border: 'none',
                fontWeight: 900,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(201, 242, 107, 0.4)'
              }}
            >
              Clear Stale Cache & Reload
            </button>
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
