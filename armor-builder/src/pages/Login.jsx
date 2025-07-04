import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (error) {
      setError('Failed to sign in. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Signing you in..." />;
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">
              <span className="logo-icon">🛡️</span>
              Armor Builder
            </h1>
            <p className="login-subtitle">
              Track your Kettlebell Complex progress
            </p>
          </div>

          <div className="login-card card">
            <h2 className="text-center mb-3">Welcome Back</h2>
            <p className="text-center mb-4" style={{ color: '#666' }}>
              Sign in to continue tracking your workouts
            </p>

            {error && (
              <div className="error-message mb-3">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="btn btn-primary btn-large"
              style={{ width: '100%' }}
            >
              <span style={{ marginRight: '8px' }}>🔐</span>
              Sign in with Google
            </button>

            <div className="login-info mt-4">
              <p className="text-center" style={{ fontSize: '14px', color: '#666' }}>
                New to Armor Builder? Signing in will create your account automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-container {
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-title {
          color: white;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .login-subtitle {
          color: var(--text-secondary);
          font-size: var(--font-base);
        }

        .login-card {
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur-strong);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-2xl);
        }

        .error-message {
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          color: var(--danger-600);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          border: 1px solid var(--danger-600);
          text-align: center;
          font-size: var(--font-sm);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 24px;
          }
          
          .login-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;