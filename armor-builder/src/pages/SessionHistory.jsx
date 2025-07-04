import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SessionHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'all', // all, week, month, 3months
    minRounds: '',
    maxRounds: '',
    weight: '',
    sortBy: 'date-desc' // date-desc, date-asc, rounds-desc, rounds-asc, duration-desc, duration-asc
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadWorkoutHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [workouts, filters]);

  const loadWorkoutHistory = () => {
    // Load workout data from localStorage (in production, this would be Firestore)
    const savedWorkouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    
    setWorkouts(savedWorkouts);
  };


  const applyFilters = () => {
    let filtered = [...workouts];

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(workout => new Date(workout.date) >= cutoffDate);
    }

    // Rounds filter
    if (filters.minRounds) {
      filtered = filtered.filter(workout => workout.completedRounds >= parseInt(filters.minRounds));
    }
    if (filters.maxRounds) {
      filtered = filtered.filter(workout => workout.completedRounds <= parseInt(filters.maxRounds));
    }

    // Weight filter
    if (filters.weight) {
      filtered = filtered.filter(workout => workout.weight === parseInt(filters.weight));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'rounds-asc':
          return a.completedRounds - b.completedRounds;
        case 'rounds-desc':
          return b.completedRounds - a.completedRounds;
        case 'duration-asc':
          return (a.duration || 0) - (b.duration || 0);
        case 'duration-desc':
          return (b.duration || 0) - (a.duration || 0);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredWorkouts(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: 'all',
      minRounds: '',
      maxRounds: '',
      weight: '',
      sortBy: 'date-desc'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUniqueWeights = () => {
    const weights = [...new Set(workouts.map(w => w.weight))].sort((a, b) => a - b);
    return weights;
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    
    if (filters.dateRange !== 'all') {
      const labels = { week: 'Last Week', month: 'Last Month', '3months': 'Last 3 Months' };
      activeFilters.push(labels[filters.dateRange]);
    }
    
    if (filters.minRounds || filters.maxRounds) {
      if (filters.minRounds && filters.maxRounds) {
        activeFilters.push(`${filters.minRounds}-${filters.maxRounds} rounds`);
      } else if (filters.minRounds) {
        activeFilters.push(`${filters.minRounds}+ rounds`);
      } else {
        activeFilters.push(`≤${filters.maxRounds} rounds`);
      }
    }
    
    if (filters.weight) {
      activeFilters.push(`${filters.weight} kg`);
    }

    return activeFilters;
  };

  return (
    <div className="session-history-page">
      <div className="page-header">
        <h1>Workout History</h1>
        <p>Review your training journey</p>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-number">{workouts.length}</span>
          <span className="stat-label">Total Sessions</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredWorkouts.length}</span>
          <span className="stat-label">Filtered Results</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{workouts.reduce((sum, w) => sum + w.completedRounds, 0)}</span>
          <span className="stat-label">Total Rounds</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary filters-toggle"
          >
            🔍 Filters {showFilters ? '▼' : '▶'}
          </button>
          
          {getFilterSummary().length > 0 && (
            <div className="active-filters">
              {getFilterSummary().map((filter, index) => (
                <span key={index} className="filter-tag">{filter}</span>
              ))}
              <button onClick={clearFilters} className="clear-filters">✕ Clear</button>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Rounds Range</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minRounds}
                    onChange={(e) => handleFilterChange('minRounds', e.target.value)}
                    className="filter-input"
                    min="1"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxRounds}
                    onChange={(e) => handleFilterChange('maxRounds', e.target.value)}
                    className="filter-input"
                    min="1"
                  />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Weight</label>
                <select
                  value={filters.weight}
                  onChange={(e) => handleFilterChange('weight', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Weights</option>
                  {getUniqueWeights().map(weight => (
                    <option key={weight} value={weight}>{weight} kg</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="filter-select"
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="rounds-desc">Rounds (Most First)</option>
                  <option value="rounds-asc">Rounds (Least First)</option>
                  <option value="duration-desc">Duration (Longest First)</option>
                  <option value="duration-asc">Duration (Shortest First)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Workout List */}
      <div className="workouts-list">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((workout, index) => (
            <div key={workout.id || index} className="workout-card">
              <div className="workout-header">
                <div className="workout-date">
                  <span className="date-main">
                    {new Date(workout.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="date-year">
                    {new Date(workout.date).getFullYear()}
                  </span>
                  <span className="day-of-week">
                    {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>

                <div className="workout-stats">
                  <div className="primary-stat">
                    <span className="stat-value">{workout.completedRounds}</span>
                    <span className="stat-label">rounds</span>
                  </div>
                  <div className="secondary-stats">
                    <span className="weight-stat">{workout.weight} kg</span>
                    <span className="duration-stat">{formatTime(workout.duration)}</span>
                  </div>
                </div>
              </div>

              <div className="workout-details">
                <div className="detail-row">
                  <span className="detail-label">Total Volume:</span>
                  <span className="detail-value">{workout.totalVolume.toLocaleString()} kg</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Reps:</span>
                  <span className="detail-value">{workout.completedRounds * 6}</span>
                </div>
                {workout.targetRounds && (
                  <div className="detail-row">
                    <span className="detail-label">Target Achievement:</span>
                    <span className={`detail-value ${workout.completedRounds >= workout.targetRounds ? 'achieved' : 'missed'}`}>
                      {workout.completedRounds}/{workout.targetRounds} rounds
                      {workout.completedRounds >= workout.targetRounds ? ' ✅' : ''}
                    </span>
                  </div>
                )}
                {workout.notes && (
                  <div className="workout-notes">
                    <span className="notes-label">Notes:</span>
                    <span className="notes-text">{workout.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No workouts found</h3>
            <p>Try adjusting your filters or start your first workout!</p>
            <Link to="/session/setup" className="btn btn-primary">
              Start New Session
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .session-history-page {
          max-width: 800px;
          margin: 0 auto;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .quick-stats {
          display: flex;
          gap: var(--space-4);
          margin-bottom: var(--space-8);
          justify-content: center;
        }

        .stat-item {
          text-align: center;
          padding: var(--space-6);
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          min-width: 120px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .stat-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-2xl);
          background: rgba(255, 255, 255, 0.4);
        }

        .stat-number {
          display: block;
          font-size: var(--font-2xl);
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-1);
          letter-spacing: -0.025em;
        }

        .stat-label {
          font-size: var(--font-xs);
          color: var(--gray-600);
          font-weight: 600;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        .filters-section {
          margin-bottom: 32px;
        }

        .filters-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .filters-toggle {
          font-size: 14px;
          padding: 8px 16px;
        }

        .active-filters {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-tag {
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          color: var(--primary-600);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
          font-size: var(--font-xs);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .clear-filters {
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          color: var(--danger-600);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
          font-size: var(--font-xs);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
        }

        .clear-filters:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
        }

        .filters-panel {
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-xl);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .filter-select,
        .filter-input {
          padding: 8px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-select:focus,
        .filter-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .range-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .range-inputs input {
          flex: 1;
        }

        .range-inputs span {
          font-size: 12px;
          color: #666;
        }

        .workouts-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .workout-card {
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .workout-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .workout-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-2xl);
          background: rgba(255, 255, 255, 0.45);
        }

        .workout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-6);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
        }

        .workout-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
        }

        .date-main {
          font-size: 18px;
          font-weight: 700;
          color: #333;
        }

        .date-year {
          font-size: 12px;
          color: #666;
          margin-bottom: 2px;
        }

        .day-of-week {
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .workout-stats {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .primary-stat {
          text-align: center;
        }

        .primary-stat .stat-value {
          display: block;
          font-size: var(--font-3xl);
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
          letter-spacing: -0.025em;
        }

        .primary-stat .stat-label {
          font-size: var(--font-xs);
          color: var(--gray-600);
          font-weight: 600;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        .secondary-stats {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: right;
        }

        .weight-stat,
        .duration-stat {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .duration-stat {
          font-family: 'Courier New', monospace;
          color: #007bff;
        }

        .workout-details {
          padding: var(--space-6);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(2px);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 14px;
          color: #666;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .detail-value.achieved {
          color: #28a745;
        }

        .detail-value.missed {
          color: #ffc107;
        }

        .workout-notes {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }

        .notes-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
          display: block;
        }

        .notes-text {
          font-size: 14px;
          color: #333;
          font-style: italic;
          line-height: 1.4;
        }

        .no-results {
          text-align: center;
          padding: var(--space-16) var(--space-6);
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-lg);
        }

        .no-results h3 {
          margin-bottom: 12px;
          color: #333;
        }

        .no-results p {
          color: #666;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .quick-stats {
            flex-direction: column;
          }

          .stat-item {
            min-width: auto;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .workout-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .workout-stats {
            justify-content: center;
          }

          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default SessionHistory;