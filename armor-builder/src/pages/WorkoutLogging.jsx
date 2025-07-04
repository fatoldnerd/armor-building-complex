import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkoutLogging = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [currentRounds, setCurrentRounds] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    // Load session data from localStorage
    const savedSession = localStorage.getItem('currentSession');
    if (!savedSession) {
      navigate('/session/setup');
      return;
    }

    const parsed = JSON.parse(savedSession);
    setSessionData(parsed);
    setStartTime(new Date(parsed.startTime));
  }, [navigate]);

  useEffect(() => {
    // Timer for elapsed time
    let interval;
    if (startTime && !isPaused) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddRound = () => {
    setCurrentRounds(prev => prev + 1);
  };

  const handleRemoveRound = () => {
    if (currentRounds > 0) {
      setCurrentRounds(prev => prev - 1);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleFinishWorkout = () => {
    if (currentRounds === 0) {
      alert('You need to complete at least one round to finish the workout.');
      return;
    }

    // Prepare workout summary data
    const workoutSummary = {
      ...sessionData,
      completedRounds: currentRounds,
      duration: elapsedTime,
      endTime: new Date().toISOString(),
      totalVolume: calculateTotalVolume()
    };

    localStorage.setItem('workoutSummary', JSON.stringify(workoutSummary));
    localStorage.removeItem('currentSession');
    navigate('/session/summary');
  };

  const handleDiscardSession = () => {
    setShowConfirmDialog(true);
  };

  const confirmDiscard = () => {
    localStorage.removeItem('currentSession');
    navigate('/dashboard');
  };

  const calculateTotalVolume = () => {
    if (!sessionData) return 0;
    // ABC structure: 2 cleans + 1 press + 3 squats = 6 reps per round
    const repsPerRound = 6;
    return currentRounds * repsPerRound * sessionData.weight;
  };

  const getTargetProgress = () => {
    if (!sessionData?.targetRounds) return null;
    return Math.min((currentRounds / sessionData.targetRounds) * 100, 100);
  };

  if (!sessionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="workout-logging-page">
      {/* Header with timer and basic info */}
      <div className="workout-header">
        <div className="timer-section">
          <div className="timer-display">
            <span className="timer-time">{formatTime(elapsedTime)}</span>
            <span className="timer-label">{isPaused ? 'PAUSED' : 'ELAPSED'}</span>
          </div>
          <button 
            onClick={handlePauseResume}
            className={`btn ${isPaused ? 'btn-success' : 'btn-secondary'}`}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
        </div>

        <div className="session-info">
          <div className="info-item">
            <span className="info-label">Weight</span>
            <span className="info-value">{sessionData.weight} kg</span>
          </div>
          {sessionData.targetRounds && (
            <div className="info-item">
              <span className="info-label">Target</span>
              <span className="info-value">{sessionData.targetRounds} rounds</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress section */}
      <div className="progress-section">
        <div className="card">
          <div className="rounds-display">
            <div className="rounds-counter">
              <span className="rounds-number">{currentRounds}</span>
              <span className="rounds-label">Rounds Completed</span>
            </div>
            
            {sessionData.targetRounds && (
              <div className="target-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getTargetProgress()}%` }}
                  />
                </div>
                <span className="progress-text">
                  {currentRounds} / {sessionData.targetRounds} rounds
                </span>
              </div>
            )}
          </div>

          {/* Round control buttons */}
          <div className="round-controls">
            <button
              onClick={handleRemoveRound}
              disabled={currentRounds === 0}
              className="btn btn-secondary round-btn"
            >
              ➖ Remove Round
            </button>
            <button
              onClick={handleAddRound}
              className="btn btn-primary round-btn btn-large"
            >
              ✅ Complete Round
            </button>
          </div>
        </div>
      </div>

      {/* Workout structure reminder */}
      <div className="workout-structure">
        <div className="card">
          <h3 className="structure-title">Armor Building Complex</h3>
          <div className="exercises-list">
            <div className="exercise-step">
              <span className="step-number">1</span>
              <div className="step-content">
                <span className="step-name">2 Kettlebell Cleans</span>
                <span className="step-description">Explosive hip drive</span>
              </div>
            </div>
            <div className="exercise-step">
              <span className="step-number">2</span>
              <div className="step-content">
                <span className="step-name">1 Military Press</span>
                <span className="step-description">Overhead strength</span>
              </div>
            </div>
            <div className="exercise-step">
              <span className="step-number">3</span>
              <div className="step-content">
                <span className="step-name">3 Front Squats</span>
                <span className="step-description">Leg and core power</span>
              </div>
            </div>
          </div>
          <p className="structure-note">
            Complete all exercises in sequence = 1 round
          </p>
        </div>
      </div>

      {/* Session stats */}
      <div className="session-stats">
        <div className="card">
          <h4>Current Session Stats</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{calculateTotalVolume()}</span>
              <span className="stat-label">Total lbs lifted</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{currentRounds * 6}</span>
              <span className="stat-label">Total reps</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{formatTime(elapsedTime)}</span>
              <span className="stat-label">Duration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="workout-actions">
        <button
          onClick={handleDiscardSession}
          className="btn btn-danger"
        >
          🗑️ Discard Session
        </button>
        <button
          onClick={handleFinishWorkout}
          className="btn btn-success btn-large"
          disabled={currentRounds === 0}
        >
          🏁 Finish Workout
        </button>
      </div>

      {/* Confirm discard dialog */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Discard Workout?</h3>
            <p>Are you sure you want to discard this workout session? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDiscard}
                className="btn btn-danger"
              >
                Yes, Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .workout-logging-page {
          max-width: 700px;
          margin: 0 auto;
          padding-bottom: 140px;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .workout-header {
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          color: var(--gray-800);
          padding: var(--space-8);
          border-radius: var(--radius-2xl);
          margin-bottom: var(--space-8);
          box-shadow: var(--shadow-2xl);
          position: relative;
          overflow: hidden;
        }

        .workout-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .timer-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
          gap: var(--space-4);
        }

        .timer-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(10px);
          padding: var(--space-6);
          border-radius: var(--radius-2xl);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: var(--shadow-lg);
          min-width: 180px;
        }

        .timer-time {
          font-size: var(--font-5xl);
          font-weight: 800;
          font-family: 'Courier New', monospace;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
          letter-spacing: -0.02em;
        }

        .timer-label {
          font-size: var(--font-xs);
          color: var(--gray-600);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: var(--space-2);
        }

        .session-info {
          display: flex;
          gap: var(--space-6);
          flex-wrap: wrap;
          justify-content: center;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          padding: var(--space-4) var(--space-5);
          border-radius: var(--radius-xl);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: var(--shadow-md);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .info-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: rgba(255, 255, 255, 0.4);
        }

        .info-label {
          font-size: var(--font-xs);
          color: var(--gray-600);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: var(--space-1);
        }

        .info-value {
          font-size: var(--font-base);
          font-weight: 700;
          color: var(--gray-800);
          letter-spacing: -0.025em;
        }

        .progress-section {
          margin-bottom: var(--space-8);
        }

        .rounds-display {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .rounds-counter {
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          padding: var(--space-8);
          border-radius: var(--radius-2xl);
          margin-bottom: var(--space-6);
          box-shadow: var(--shadow-xl);
          position: relative;
          overflow: hidden;
        }

        .rounds-counter::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .rounds-number {
          display: block;
          font-size: 4rem;
          font-weight: 900;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          text-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
          letter-spacing: -0.05em;
        }

        .rounds-label {
          font-size: var(--font-lg);
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          letter-spacing: 0.025em;
          text-transform: uppercase;
          margin-top: var(--space-2);
          transition: color 0.3s ease;
        }

        .rounds-counter:hover .rounds-label {
          color: #000000;
        }

        .target-progress {
          max-width: 400px;
          margin: 0 auto;
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--space-3);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .progress-fill {
          height: 100%;
          background: var(--success-gradient);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: var(--radius-full);
          box-shadow: 0 2px 4px rgba(79, 172, 254, 0.3);
        }

        .progress-text {
          font-size: var(--font-sm);
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          text-align: center;
          transition: color 0.3s ease;
        }

        .target-progress:hover .progress-text {
          color: #000000;
        }

        .round-controls {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .round-btn {
          min-width: 140px;
        }

        .workout-structure {
          margin-bottom: 20px;
        }

        .structure-title {
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.9);
          transition: color 0.3s ease;
        }

        .workout-structure:hover .structure-title {
          color: #000000;
        }

        .exercises-list {
          margin-bottom: 16px;
        }

        .exercise-step {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }

        .exercise-step:last-child {
          border-bottom: none;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .step-name {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          transition: color 0.3s ease;
        }

        .exercise-step:hover .step-name {
          color: #000000;
        }

        .step-description {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
        }

        .exercise-step:hover .step-description {
          color: #0f172a;
        }

        .structure-note {
          text-align: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
          transition: color 0.3s ease;
        }

        .workout-structure:hover .structure-note {
          color: #0f172a;
        }

        .session-stats {
          margin-bottom: 20px;
        }

        .session-stats h4 {
          text-align: center;
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.9);
          transition: color 0.3s ease;
        }

        .session-stats:hover h4 {
          color: #000000;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .stat-item {
          text-align: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .stat-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #007bff;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
        }

        .workout-actions {
          display: flex;
          gap: 12px;
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 568px;
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur-strong);
          border: 1px solid var(--glass-border);
          padding: 16px;
          border-radius: 12px;
          box-shadow: var(--shadow-2xl);
        }

        .workout-actions .btn {
          flex: 1;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur-strong);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          max-width: 400px;
          width: 100%;
          box-shadow: var(--shadow-2xl);
        }

        .modal-content h3 {
          margin-bottom: var(--space-3);
          color: var(--text-primary);
        }

        .modal-content p {
          margin-bottom: var(--space-5);
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .modal-actions .btn {
          flex: 1;
        }

        @media (max-width: 768px) {
          .timer-section {
            flex-direction: column;
            gap: 12px;
            align-items: center;
          }

          .session-info {
            justify-content: center;
          }

          .round-controls {
            flex-direction: column;
            align-items: center;
          }

          .round-btn {
            width: 100%;
            max-width: 250px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .workout-actions {
            flex-direction: column;
            bottom: 100px;
          }

          .workout-actions .btn {
            flex: none;
          }
        }
      `}</style>
    </div>
  );
};

export default WorkoutLogging;