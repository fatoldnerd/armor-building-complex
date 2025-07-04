import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalRounds: 0,
    totalVolume: 0,
    currentStreak: 0,
    longestStreak: 0,
    personalBests: {
      mostRounds: 0,
      heaviestWeight: 0,
      longestSession: 0
    }
  });
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState('weekly'); // weekly, monthly

  useEffect(() => {
    loadWorkoutData();
  }, []);

  const loadWorkoutData = () => {
    // Load workout data from localStorage (in production, this would be Firestore)
    const savedWorkouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    
    setWorkoutHistory(savedWorkouts);
    
    // Calculate statistics only if there are workouts
    if (savedWorkouts.length > 0) {
      calculateStats(savedWorkouts);
      generateChartData(savedWorkouts);
    }
  };


  const calculateStats = (workouts) => {
    if (workouts.length === 0) {
      setStats({
        totalSessions: 0,
        totalRounds: 0,
        totalVolume: 0,
        currentStreak: 0,
        longestStreak: 0,
        personalBests: {
          mostRounds: 0,
          heaviestWeight: 0,
          longestSession: 0
        }
      });
      return;
    }

    const totalSessions = workouts.length;
    const totalRounds = workouts.reduce((sum, w) => sum + w.completedRounds, 0);
    const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolume || w.completedRounds * 6 * w.weight), 0);
    
    // Personal bests
    const mostRounds = Math.max(...workouts.map(w => w.completedRounds));
    const heaviestWeight = Math.max(...workouts.map(w => w.weight));
    const longestSession = Math.max(...workouts.map(w => w.duration || 0));
    
    // Calculate streaks
    const sortedWorkouts = workouts
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].date);
      workoutDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (i === 0 && (daysDiff === 0 || daysDiff === 1)) {
        currentStreak = 1;
        tempStreak = 1;
      } else if (i > 0) {
        const prevWorkoutDate = new Date(sortedWorkouts[i - 1].date);
        prevWorkoutDate.setHours(0, 0, 0, 0);
        const daysBetween = Math.floor((prevWorkoutDate - workoutDate) / (1000 * 60 * 60 * 24));
        
        if (daysBetween <= 1) {
          tempStreak++;
          if (i === 0 || (i === 1 && currentStreak > 0)) {
            currentStreak = tempStreak;
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (currentStreak === 0) {
            currentStreak = 0;
          }
        }
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    setStats({
      totalSessions,
      totalRounds,
      totalVolume,
      currentStreak,
      longestStreak,
      personalBests: {
        mostRounds,
        heaviestWeight,
        longestSession
      }
    });
  };

  const generateChartData = (workouts) => {
    const sortedWorkouts = workouts.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (viewMode === 'weekly') {
      // Group by week
      const weeklyData = {};
      sortedWorkouts.forEach(workout => {
        const date = new Date(workout.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            date: weekKey,
            rounds: 0,
            sessions: 0,
            volume: 0
          };
        }
        
        weeklyData[weekKey].rounds += workout.completedRounds;
        weeklyData[weekKey].sessions += 1;
        weeklyData[weekKey].volume += workout.totalVolume || workout.completedRounds * 6 * workout.weight;
      });
      
      setChartData(Object.values(weeklyData).slice(-8)); // Last 8 weeks
    } else {
      // Group by month
      const monthlyData = {};
      sortedWorkouts.forEach(workout => {
        const date = new Date(workout.date);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            date: monthKey,
            rounds: 0,
            sessions: 0,
            volume: 0
          };
        }
        
        monthlyData[monthKey].rounds += workout.completedRounds;
        monthlyData[monthKey].sessions += 1;
        monthlyData[monthKey].volume += workout.totalVolume || workout.completedRounds * 6 * workout.weight;
      });
      
      setChartData(Object.values(monthlyData).slice(-6)); // Last 6 months
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (viewMode === 'weekly') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecentWorkouts = () => {
    return workoutHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  useEffect(() => {
    if (workoutHistory.length > 0) {
      generateChartData(workoutHistory);
    }
  }, [viewMode, workoutHistory]);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your armor building progress</p>
      </div>

      {/* Welcome Message for New Users */}
      {workoutHistory.length === 0 && (
        <div className="welcome-section">
          <div className="card welcome-card">
            <div className="welcome-content">
              <h2>🛡️ Welcome to Your Armor Building Journey!</h2>
              <p>
                Ready to build real strength and forge your armor? Start your first 
                Armor Building Complex session to begin tracking your progress.
              </p>
              <div className="welcome-sequence">
                <p><strong>The Sequence:</strong> 2 Kettlebell Cleans + 1 Military Press + 3 Front Squats</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/session/setup" className="btn btn-primary btn-large action-btn">
          🏋️ Start New Session
        </Link>
        <Link to="/history" className="btn btn-secondary action-btn">
          📋 View History
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="stats-overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalRounds}</div>
            <div className="stat-label">Total Rounds</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Math.round(stats.totalVolume / 1000)}k</div>
            <div className="stat-label">Total Volume (kg)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="progress-section">
        <div className="card">
          <div className="chart-header">
            <h3>Progress Over Time</h3>
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('weekly')}
                className={`btn ${viewMode === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`btn ${viewMode === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Monthly
              </button>
            </div>
          </div>
          
          {chartData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(label) => formatDate(label)}
                    formatter={(value, name) => [value, name === 'rounds' ? 'Rounds' : 'Sessions']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rounds" 
                    stroke="#007bff" 
                    strokeWidth={3}
                    dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="no-data">
              <p>No workout data yet. Start your first session to see progress!</p>
            </div>
          )}
        </div>
      </div>

      {/* Personal Bests */}
      <div className="personal-bests">
        <div className="card">
          <h3 className="card-title">🏆 Personal Bests</h3>
          <div className="pb-grid">
            <div className="pb-item">
              <div className="pb-value">{stats.personalBests.mostRounds}</div>
              <div className="pb-label">Most Rounds</div>
            </div>
            <div className="pb-item">
              <div className="pb-value">{stats.personalBests.heaviestWeight}</div>
              <div className="pb-label">Heaviest Weight (kg)</div>
            </div>
            <div className="pb-item">
              <div className="pb-value">{formatTime(stats.personalBests.longestSession)}</div>
              <div className="pb-label">Longest Session</div>
            </div>
            <div className="pb-item">
              <div className="pb-value">{stats.longestStreak}</div>
              <div className="pb-label">Longest Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="recent-sessions">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Sessions</h3>
            <Link to="/history" className="view-all-link">View All</Link>
          </div>
          
          {getRecentWorkouts().length > 0 ? (
            <div className="sessions-list">
              {getRecentWorkouts().map((workout, index) => (
                <div key={workout.id || index} className="session-item">
                  <div className="session-info">
                    <div className="session-date">
                      {new Date(workout.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </div>
                    <div className="session-details">
                      <span className="session-rounds">{workout.completedRounds} rounds</span>
                      <span className="session-weight">{workout.weight} kg</span>
                    </div>
                  </div>
                  <div className="session-stats">
                    <div className="session-duration">
                      {workout.duration ? formatTime(workout.duration) : '--:--'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-sessions">
              <p>No recent sessions found. Start your first workout!</p>
              <Link to="/session/setup" className="btn btn-primary">
                Start Now
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          max-width: 1000px;
          margin: 0 auto;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .welcome-section {
          margin-bottom: var(--space-10);
        }

        .welcome-card {
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-2xl);
          padding: var(--space-10);
          box-shadow: var(--shadow-xl);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .welcome-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .welcome-content h2 {
          font-size: var(--font-3xl);
          font-weight: 700;
          margin-bottom: var(--space-4);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-content p {
          font-size: var(--font-lg);
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin-bottom: var(--space-6);
        }

        .welcome-sequence {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .welcome-sequence p {
          margin: 0;
          font-size: var(--font-base);
          color: rgba(255, 255, 255, 0.95);
        }

        .quick-actions {
          display: flex;
          gap: var(--space-6);
          margin-bottom: var(--space-10);
        }

        .action-btn {
          flex: 1;
          text-align: center;
          padding: var(--space-6);
          font-size: var(--font-lg);
          font-weight: 700;
          border-radius: var(--radius-2xl);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .action-btn:hover::before {
          left: 100%;
        }

        .stats-overview {
          margin-bottom: var(--space-12);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: var(--space-6);
        }

        .stat-card {
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          padding: var(--space-8) var(--space-6);
          border-radius: var(--radius-2xl);
          text-align: center;
          box-shadow: var(--shadow-xl);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary-gradient);
        }

        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: var(--shadow-2xl), var(--shadow-glow);
          background: var(--glass-bg-light);
        }

        .stat-value {
          font-size: var(--font-4xl);
          font-weight: 800;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-2);
          letter-spacing: -0.05em;
          text-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
        }

        .stat-label {
          font-size: var(--font-sm);
          color: var(--text-secondary);
          font-weight: 600;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        .progress-section {
          margin-bottom: var(--space-12);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--glass-border);
        }

        .chart-header h3 {
          margin: 0;
          font-size: var(--font-2xl);
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.025em;
        }

        .view-toggle {
          display: flex;
          gap: var(--space-2);
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border-radius: var(--radius-lg);
          padding: var(--space-1);
          border: 1px solid var(--glass-border);
        }

        .view-toggle .btn {
          padding: var(--space-2) var(--space-4);
          font-size: var(--font-sm);
          border-radius: var(--radius-md);
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--text-muted);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .view-toggle .btn-primary {
          background: var(--glass-bg-strong);
          color: var(--primary-500);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--glass-border);
        }

        .chart-container {
          margin-top: var(--space-6);
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          border: 1px solid var(--glass-border);
        }

        .no-data {
          text-align: center;
          padding: var(--space-12) var(--space-6);
          color: var(--text-muted);
          font-weight: 500;
        }

        .personal-bests {
          margin-bottom: var(--space-12);
        }

        .pb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: var(--space-4);
        }

        .pb-item {
          text-align: center;
          padding: var(--space-6) var(--space-4);
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .pb-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--warning-gradient);
        }

        .pb-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          background: var(--glass-bg-light);
        }

        .pb-value {
          font-size: var(--font-2xl);
          font-weight: 800;
          background: var(--warning-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-2);
          text-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
        }

        .pb-label {
          font-size: var(--font-xs);
          color: var(--text-secondary);
          font-weight: 600;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        .recent-sessions {
          margin-bottom: var(--space-12);
        }

        .view-all-link {
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          font-size: var(--font-sm);
          font-weight: 700;
          letter-spacing: 0.025em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .view-all-link:hover {
          text-decoration: underline;
          transform: translateX(2px);
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .session-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-5);
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .session-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary-gradient), transparent);
          opacity: 0.5;
        }

        .session-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: var(--glass-bg-light);
        }

        .session-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .session-date {
          font-weight: 700;
          color: var(--text-primary);
          font-size: var(--font-sm);
          letter-spacing: -0.025em;
        }

        .session-details {
          display: flex;
          gap: var(--space-3);
          font-size: var(--font-xs);
          color: var(--text-secondary);
          font-weight: 500;
        }

        .session-stats {
          text-align: right;
        }

        .session-duration {
          font-weight: 700;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Courier New', monospace;
          font-size: var(--font-sm);
        }

        .no-sessions {
          text-align: center;
          padding: var(--space-12) var(--space-6);
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
        }

        .no-sessions p {
          color: var(--gray-600);
          margin-bottom: var(--space-4);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .quick-actions {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chart-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .pb-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .session-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .session-stats {
            text-align: left;
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;