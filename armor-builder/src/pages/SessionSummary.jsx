import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionSummary = () => {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState(null);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load workout summary from localStorage
    const savedSummary = localStorage.getItem('workoutSummary');
    if (!savedSummary) {
      navigate('/dashboard');
      return;
    }

    const parsed = JSON.parse(savedSummary);
    setSummaryData(parsed);
    
    // Check if this is a personal best (simplified - in real app would check against saved data)
    checkPersonalBest(parsed);
  }, [navigate]);

  const checkPersonalBest = (data) => {
    // For demo purposes, mark as PB if completed more than 5 rounds
    // In real implementation, this would check against user's workout history
    if (data.completedRounds >= 5) {
      setIsPersonalBest(true);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleSaveSession = async () => {
    setIsSaving(true);
    
    // In a real app, this would save to Firestore
    // For now, we'll simulate saving and then redirect
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Clear the summary data
      localStorage.removeItem('workoutSummary');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving session:', error);
      setIsSaving(false);
    }
  };

  const handleDeleteSession = () => {
    if (confirm('Are you sure you want to delete this workout session?')) {
      localStorage.removeItem('workoutSummary');
      navigate('/dashboard');
    }
  };

  const handleStartNewSession = () => {
    localStorage.removeItem('workoutSummary');
    navigate('/session/setup');
  };

  if (!summaryData) {
    return <div>Loading...</div>;
  }

  const averageRoundTime = summaryData.duration / summaryData.completedRounds;

  return (
    <div className="session-summary-page">
      <div className="page-header">
        <h1>🏁 Workout Complete!</h1>
        <p>{formatDate(summaryData.endTime)}</p>
      </div>

      {/* Personal Best Banner */}
      {isPersonalBest && (
        <div className="personal-best-banner">
          <div className="pb-content">
            <span className="pb-icon">🏆</span>
            <div className="pb-text">
              <h3>Personal Best!</h3>
              <p>You've set a new record!</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Statistics */}
      <div className="summary-stats">
        <div className="card">
          <div className="main-stat">
            <span className="stat-number">{summaryData.completedRounds}</span>
            <span className="stat-label">Rounds Completed</span>
          </div>
          
          <div className="secondary-stats">
            <div className="secondary-stat">
              <span className="stat-value">{formatTime(summaryData.duration)}</span>
              <span className="stat-label">Total Duration</span>
            </div>
            <div className="secondary-stat">
              <span className="stat-value">{summaryData.weight} kg</span>
              <span className="stat-label">Weight Used</span>
            </div>
            <div className="secondary-stat">
              <span className="stat-value">{summaryData.totalVolume} kg</span>
              <span className="stat-label">Total Volume</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="workout-breakdown">
        <div className="card">
          <h3 className="card-title">Workout Breakdown</h3>
          
          <div className="breakdown-grid">
            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="exercise-icon">🏋️</span>
                <span className="exercise-name">Kettlebell Cleans</span>
              </div>
              <div className="breakdown-stats">
                <span className="breakdown-value">{summaryData.completedRounds * 2}</span>
                <span className="breakdown-label">Total Reps</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="exercise-icon">💪</span>
                <span className="exercise-name">Military Press</span>
              </div>
              <div className="breakdown-stats">
                <span className="breakdown-value">{summaryData.completedRounds * 1}</span>
                <span className="breakdown-label">Total Reps</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="exercise-icon">🦵</span>
                <span className="exercise-name">Front Squats</span>
              </div>
              <div className="breakdown-stats">
                <span className="breakdown-value">{summaryData.completedRounds * 3}</span>
                <span className="breakdown-label">Total Reps</span>
              </div>
            </div>
          </div>

          <div className="performance-metrics">
            <div className="metric-item">
              <span className="metric-label">Average Round Time</span>
              <span className="metric-value">{formatTime(Math.round(averageRoundTime))}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Total Reps</span>
              <span className="metric-value">{summaryData.completedRounds * 6}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Reps per Minute</span>
              <span className="metric-value">{Math.round((summaryData.completedRounds * 6) / (summaryData.duration / 60))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Notes */}
      {summaryData.notes && (
        <div className="session-notes">
          <div className="card">
            <h3 className="card-title">Session Notes</h3>
            <p className="notes-content">{summaryData.notes}</p>
          </div>
        </div>
      )}

      {/* Target Achievement */}
      {summaryData.targetRounds && (
        <div className="target-achievement">
          <div className="card">
            <h3 className="card-title">Target Achievement</h3>
            <div className="achievement-content">
              <div className="achievement-visual">
                <div className="achievement-circle">
                  <span className="achievement-percentage">
                    {Math.round((summaryData.completedRounds / summaryData.targetRounds) * 100)}%
                  </span>
                </div>
              </div>
              <div className="achievement-text">
                <p>
                  {summaryData.completedRounds >= summaryData.targetRounds 
                    ? '🎯 Target achieved!' 
                    : `${summaryData.completedRounds} of ${summaryData.targetRounds} rounds completed`
                  }
                </p>
                {summaryData.completedRounds > summaryData.targetRounds && (
                  <p className="bonus-text">✨ Exceeded target by {summaryData.completedRounds - summaryData.targetRounds} rounds!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="summary-actions">
        <button
          onClick={handleDeleteSession}
          className="btn btn-danger"
          disabled={isSaving}
        >
          🗑️ Delete Session
        </button>
        <button
          onClick={handleStartNewSession}
          className="btn btn-secondary"
          disabled={isSaving}
        >
          🔄 Start New Session
        </button>
        <button
          onClick={handleSaveSession}
          className="btn btn-success btn-large"
          disabled={isSaving}
        >
          {isSaving ? '💾 Saving...' : '💾 Save & Continue'}
        </button>
      </div>

      <style jsx>{`
        .session-summary-page {
          max-width: 700px;
          margin: 0 auto;
          padding-bottom: 140px;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .personal-best-banner {
          margin-bottom: var(--space-8);
          animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3) translateY(-100px); }
          50% { opacity: 1; transform: scale(1.05) translateY(-20px); }
          70% { transform: scale(0.9) translateY(0px); }
          100% { opacity: 1; transform: scale(1) translateY(0px); }
        }

        .pb-content {
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          padding: var(--space-8);
          border-radius: var(--radius-2xl);
          display: flex;
          align-items: center;
          gap: var(--space-5);
          box-shadow: var(--shadow-2xl);
          border: 2px solid rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .pb-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .pb-icon {
          font-size: var(--font-4xl);
          filter: drop-shadow(0 2px 4px rgba(184, 134, 11, 0.3));
        }

        .pb-text h3 {
          margin: 0;
          font-size: var(--font-2xl);
          font-weight: 800;
          color: #b8860b;
          text-shadow: 0 2px 4px rgba(184, 134, 11, 0.3);
          letter-spacing: -0.025em;
        }

        .pb-text p {
          margin: 0;
          color: #8b7300;
          font-size: var(--font-sm);
          font-weight: 600;
        }

        .summary-stats {
          margin-bottom: var(--space-8);
        }

        .main-stat {
          text-align: center;
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-2xl);
          padding: var(--space-10);
          box-shadow: var(--shadow-xl);
          position: relative;
          overflow: hidden;
        }

        .main-stat::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .stat-number {
          display: block;
          font-size: 4.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: var(--space-3);
          text-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
          letter-spacing: -0.05em;
        }

        .stat-label {
          font-size: var(--font-xl);
          color: var(--gray-600);
          font-weight: 700;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        .secondary-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }

        .secondary-stat {
          text-align: center;
          padding: var(--space-6);
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .secondary-stat::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .secondary-stat:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-2xl);
          background: rgba(255, 255, 255, 0.4);
        }

        .stat-value {
          display: block;
          font-size: var(--font-2xl);
          font-weight: 800;
          color: var(--gray-800);
          margin-bottom: var(--space-1);
          letter-spacing: -0.025em;
        }

        .secondary-stat .stat-label {
          font-size: var(--font-xs);
          color: var(--gray-600);
          font-weight: 600;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        .workout-breakdown {
          margin-bottom: 20px;
        }

        .breakdown-grid {
          margin-bottom: 24px;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .breakdown-item:last-child {
          border-bottom: none;
        }

        .breakdown-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .exercise-icon {
          font-size: 20px;
        }

        .exercise-name {
          font-weight: 600;
          color: #333;
        }

        .breakdown-stats {
          text-align: right;
        }

        .breakdown-value {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #007bff;
        }

        .breakdown-label {
          font-size: 12px;
          color: #666;
        }

        .performance-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .metric-item {
          text-align: center;
        }

        .metric-label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .metric-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .session-notes {
          margin-bottom: 20px;
        }

        .notes-content {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          font-style: italic;
          color: #555;
          line-height: 1.5;
          margin: 0;
        }

        .target-achievement {
          margin-bottom: 20px;
        }

        .achievement-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .achievement-visual {
          flex-shrink: 0;
        }

        .achievement-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: conic-gradient(#28a745 0% var(--percentage, 0%), #e9ecef var(--percentage, 0%) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .achievement-circle::before {
          content: '';
          width: 60px;
          height: 60px;
          background: var(--glass-bg-strong);
          border-radius: 50%;
          position: absolute;
        }

        .achievement-percentage {
          font-size: 14px;
          font-weight: 700;
          color: #333;
          z-index: 1;
        }

        .achievement-text p {
          margin: 0 0 8px 0;
          font-weight: 600;
          color: #333;
        }

        .bonus-text {
          color: #28a745 !important;
          font-size: 14px;
          font-weight: 500 !important;
        }

        .summary-actions {
          display: flex;
          gap: var(--space-4);
          position: fixed;
          bottom: 90px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - var(--space-8));
          max-width: 660px;
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          padding: var(--space-6);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-2xl);
          z-index: 50;
        }

        .summary-actions .btn {
          flex: 1;
          font-weight: 700;
          letter-spacing: 0.025em;
          position: relative;
          overflow: hidden;
        }

        .summary-actions .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .summary-actions .btn:hover::before {
          left: 100%;
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .stat-number {
            font-size: 48px;
          }

          .secondary-stats {
            grid-template-columns: 1fr;
          }

          .performance-metrics {
            grid-template-columns: 1fr;
          }

          .achievement-content {
            flex-direction: column;
            text-align: center;
          }

          .summary-actions {
            flex-direction: column;
            bottom: 100px;
          }

          .summary-actions .btn {
            flex: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SessionSummary;