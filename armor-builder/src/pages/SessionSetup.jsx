import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: '',
    targetRounds: '',
    notes: '',
    useSingleWeight: true,
    workoutMode: 'live', // 'live' or 'manual'
    completedRounds: '',
    duration: '',
    workoutDate: new Date().toISOString().split('T')[0] // Today's date
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validation
    if (!formData.weight) {
      newErrors.weight = 'Please select a kettlebell weight';
    }
    
    // Live mode validation
    if (formData.workoutMode === 'live') {
      if (formData.targetRounds && formData.targetRounds <= 0) {
        newErrors.targetRounds = 'Target rounds must be greater than 0';
      }
    }
    
    // Manual mode validation
    if (formData.workoutMode === 'manual') {
      if (!formData.completedRounds) {
        newErrors.completedRounds = 'Please enter the number of rounds completed';
      } else if (formData.completedRounds <= 0) {
        newErrors.completedRounds = 'Completed rounds must be greater than 0';
      }
      
      if (!formData.duration) {
        newErrors.duration = 'Please enter the workout duration';
      } else if (formData.duration <= 0) {
        newErrors.duration = 'Duration must be greater than 0';
      }
      
      if (!formData.workoutDate) {
        newErrors.workoutDate = 'Please select the workout date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartWorkout = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (formData.workoutMode === 'live') {
        // Live workout mode - store session data for live tracking
        const sessionData = {
          weight: parseFloat(formData.weight),
          targetRounds: formData.targetRounds ? parseInt(formData.targetRounds) : null,
          notes: formData.notes.trim(),
          useSingleWeight: formData.useSingleWeight,
          startTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentSession', JSON.stringify(sessionData));
        navigate('/session/workout');
      } else {
        // Manual entry mode - create completed workout and go to summary
        const workoutDate = new Date(formData.workoutDate);
        const durationInSeconds = Math.round(parseFloat(formData.duration) * 60); // Convert minutes to seconds
        const completedRounds = parseInt(formData.completedRounds);
        const weight = parseFloat(formData.weight);
        
        const workoutSummary = {
          weight: weight,
          completedRounds: completedRounds,
          duration: durationInSeconds,
          startTime: workoutDate.toISOString(),
          endTime: new Date(workoutDate.getTime() + (durationInSeconds * 1000)).toISOString(),
          totalVolume: completedRounds * 6 * weight, // 6 reps per round
          notes: formData.notes.trim(),
          targetRounds: null,
          useSingleWeight: formData.useSingleWeight,
          isManualEntry: true
        };
        
        localStorage.setItem('workoutSummary', JSON.stringify(workoutSummary));
        navigate('/session/summary');
      }
    }
  };

  return (
    <div className="session-setup-page">
      <div className="page-header">
        <h1>New Workout Session</h1>
        <p>Set up your Armor Building Complex workout</p>
      </div>

      <div className="setup-container">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Workout Configuration</h3>
            <p className="card-subtitle">Configure your session parameters</p>
          </div>

          <form onSubmit={handleStartWorkout} className="setup-form">
            {/* Workout Mode Selection */}
            <div className="form-section">
              <h4 className="section-title">Workout Mode</h4>
              <div className="mode-selector">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="workoutMode"
                    value="live"
                    checked={formData.workoutMode === 'live'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">
                    <span className="radio-icon">🔴</span>
                    <span className="radio-text">
                      <strong>Live Workout</strong>
                      <small>Track rounds and time in real-time</small>
                    </span>
                  </span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="workoutMode"
                    value="manual"
                    checked={formData.workoutMode === 'manual'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">
                    <span className="radio-icon">📝</span>
                    <span className="radio-text">
                      <strong>Log Workout</strong>
                      <small>Enter completed workout data</small>
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Weight Configuration */}
            <div className="form-section">
              <h4 className="section-title">Kettlebell Weight</h4>
              
              <div className="weight-type-selector">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="useSingleWeight"
                    checked={formData.useSingleWeight}
                    onChange={() => setFormData(prev => ({ ...prev, useSingleWeight: true }))}
                  />
                  <span className="radio-label">Single Weight (both bells same)</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="useSingleWeight"
                    checked={!formData.useSingleWeight}
                    onChange={() => setFormData(prev => ({ ...prev, useSingleWeight: false }))}
                  />
                  <span className="radio-label">Different Weights</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {formData.useSingleWeight ? 'Weight per kettlebell (kg)' : 'Primary weight (kg)'}
                </label>
                <select
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={`form-input ${errors.weight ? 'error' : ''}`}
                >
                  <option value="">Select kettlebell weight</option>
                  <option value="12">12kg</option>
                  <option value="16">16kg</option>
                  <option value="20">20kg</option>
                  <option value="24">24kg</option>
                  <option value="28">28kg</option>
                  <option value="32">32kg</option>
                  <option value="40">40kg</option>
                </select>
                {errors.weight && <span className="error-text">{errors.weight}</span>}
              </div>
            </div>

            {/* Target Rounds - Live Mode Only */}
            {formData.workoutMode === 'live' && (
              <div className="form-section">
                <h4 className="section-title">Target Rounds (Optional)</h4>
                <div className="form-group">
                  <label className="form-label">How many rounds do you want to complete?</label>
                  <input
                    type="number"
                    name="targetRounds"
                    value={formData.targetRounds}
                    onChange={handleInputChange}
                    className={`form-input ${errors.targetRounds ? 'error' : ''}`}
                    placeholder="Leave empty for open-ended session"
                    min="1"
                  />
                  {errors.targetRounds && <span className="error-text">{errors.targetRounds}</span>}
                </div>
              </div>
            )}

            {/* Manual Entry Fields */}
            {formData.workoutMode === 'manual' && (
              <>
                <div className="form-section">
                  <h4 className="section-title">Workout Results</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Rounds Completed *</label>
                      <input
                        type="number"
                        name="completedRounds"
                        value={formData.completedRounds}
                        onChange={handleInputChange}
                        className={`form-input ${errors.completedRounds ? 'error' : ''}`}
                        placeholder="Enter rounds completed"
                        min="1"
                      />
                      {errors.completedRounds && <span className="error-text">{errors.completedRounds}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Duration (minutes) *</label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className={`form-input ${errors.duration ? 'error' : ''}`}
                        placeholder="Enter duration in minutes"
                        min="1"
                        step="0.5"
                      />
                      {errors.duration && <span className="error-text">{errors.duration}</span>}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4 className="section-title">Workout Date</h4>
                  <div className="form-group">
                    <label className="form-label">When did you complete this workout?</label>
                    <input
                      type="date"
                      name="workoutDate"
                      value={formData.workoutDate}
                      onChange={handleInputChange}
                      className={`form-input ${errors.workoutDate ? 'error' : ''}`}
                    />
                    {errors.workoutDate && <span className="error-text">{errors.workoutDate}</span>}
                  </div>
                </div>
              </>
            )}

            {/* Session Notes */}
            <div className="form-section">
              <h4 className="section-title">Session Notes (Optional)</h4>
              <div className="form-group">
                <label className="form-label">Add any notes about today's session</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-input form-textarea"
                  placeholder="How are you feeling? Any goals for today?"
                  rows="3"
                />
              </div>
            </div>

            {/* Workout Structure Reminder */}
            <div className="workout-structure">
              <h4 className="section-title">Workout Structure</h4>
              <div className="structure-grid">
                <div className="exercise-item">
                  <span className="exercise-count">2</span>
                  <span className="exercise-name">Kettlebell Cleans</span>
                </div>
                <div className="exercise-item">
                  <span className="exercise-count">1</span>
                  <span className="exercise-name">Military Press</span>
                </div>
                <div className="exercise-item">
                  <span className="exercise-count">3</span>
                  <span className="exercise-name">Front Squats</span>
                </div>
              </div>
              <p className="structure-note">
                Complete all exercises in sequence to finish one round.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-large"
              >
                {formData.workoutMode === 'live' ? 'Start Workout 🏋️' : 'Save Workout 💾'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .session-setup-page {
          max-width: 700px;
          margin: 0 auto;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .setup-container {
          margin-top: var(--space-8);
        }

        .setup-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-10);
        }

        .form-section {
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-xl);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .form-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .form-section:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-2xl);
          background: rgba(255, 255, 255, 0.4);
        }

        .section-title {
          font-size: var(--font-xl);
          font-weight: 700;
          margin-bottom: var(--space-6);
          color: var(--gray-800);
          letter-spacing: -0.025em;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .weight-type-selector {
          display: flex;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }

        .radio-option {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: var(--space-4) var(--space-5);
          border: 2px solid var(--glass-border);
          border-radius: var(--radius-xl);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
          min-width: 220px;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .radio-option::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
          transition: left 0.5s;
        }

        .radio-option:hover::before {
          left: 100%;
        }

        .radio-option:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .radio-option input[type="radio"] {
          margin-right: var(--space-3);
          accent-color: #667eea;
          transform: scale(1.2);
        }

        .radio-option input[type="radio"]:checked + .radio-label {
          color: #667eea;
          font-weight: 700;
        }

        .radio-option:has(input:checked) {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          box-shadow: var(--shadow-lg);
        }

        .radio-label {
          font-size: var(--font-sm);
          color: var(--gray-700);
          font-weight: 600;
          letter-spacing: 0.025em;
        }

        .form-input.error {
          border-color: #dc3545;
        }

        .error-text {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }

        /* Mode Selector Styles */
        .mode-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .mode-selector .radio-option {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-6);
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 2px solid var(--glass-border);
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .mode-selector .radio-option:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: var(--glass-bg-light);
        }

        .mode-selector .radio-option:has(input:checked) {
          border-color: var(--primary-500);
          background: var(--glass-bg-strong);
          box-shadow: var(--shadow-xl), var(--shadow-glow);
        }

        .mode-selector .radio-label {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          flex: 1;
        }

        .radio-icon {
          font-size: var(--font-2xl);
          flex-shrink: 0;
        }

        .radio-text {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .radio-text strong {
          font-size: var(--font-base);
          font-weight: 700;
          color: #000000;
        }

        .radio-text small {
          font-size: var(--font-xs);
          color: #0f172a;
          line-height: 1.3;
        }

        /* Form Grid for Manual Entry */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        @media (max-width: 768px) {
          .mode-selector {
            grid-template-columns: 1fr;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .workout-structure {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .workout-structure::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .structure-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: var(--space-5);
          margin-bottom: var(--space-6);
        }

        .exercise-item {
          display: flex;
          flex-direction: column;
          align-items: center;
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

        .exercise-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .exercise-item:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: var(--shadow-2xl);
          background: rgba(255, 255, 255, 0.5);
        }

        .exercise-count {
          font-size: var(--font-4xl);
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-2);
          text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
        }

        .exercise-name {
          font-size: var(--font-sm);
          font-weight: 700;
          text-align: center;
          color: #000000;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        .structure-note {
          text-align: center;
          font-size: var(--font-sm);
          color: var(--gray-900);
          font-weight: 500;
          font-style: italic;
          padding: var(--space-4);
          background: rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-actions {
          display: flex;
          gap: var(--space-6);
          margin-top: var(--space-10);
          padding: var(--space-6);
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-lg);
        }

        .form-actions .btn {
          flex: 1;
          font-weight: 700;
          letter-spacing: 0.025em;
          position: relative;
          overflow: hidden;
        }

        .form-actions .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .form-actions .btn:hover::before {
          left: 100%;
        }

        @media (max-width: 768px) {
          .session-setup-page {
            margin: 0 var(--space-2);
          }

          .weight-type-selector {
            flex-direction: column;
          }

          .radio-option {
            min-width: auto;
          }

          .structure-grid {
            grid-template-columns: 1fr;
            gap: var(--space-4);
          }

          .exercise-item {
            padding: var(--space-5);
          }

          .exercise-count {
            font-size: var(--font-3xl);
          }

          .form-actions {
            flex-direction: column-reverse;
            gap: var(--space-4);
            padding: var(--space-5);
          }

          .form-actions .btn {
            flex: none;
          }

          .form-section {
            padding: var(--space-6);
          }

          .section-title {
            font-size: var(--font-lg);
          }
        }
      `}</style>
    </div>
  );
};

export default SessionSetup;