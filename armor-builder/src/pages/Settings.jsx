import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState({
    dailyTarget: '',
    weeklyTarget: '',
    notifications: {
      enabled: true,
      reminderTime: '09:00',
      frequency: 'daily'
    },
    preferences: {
      defaultWeight: '',
      autoSave: true,
      showTips: true
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // In a real app, this would load from Firestore
    // For now, load from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  };

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSimpleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to Firestore
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSavedMessage('Settings saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSavedMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  const handleExportData = () => {
    // Export user data as JSON
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    const exportData = {
      user: {
        name: user?.displayName,
        email: user?.email
      },
      workouts: workoutHistory,
      settings: userSettings,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `armor-builder-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all workout data? This action cannot be undone.')) {
      localStorage.removeItem('workoutHistory');
      localStorage.removeItem('userSettings');
      alert('All data has been cleared.');
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your training experience</p>
      </div>

      {savedMessage && (
        <div className={`save-message ${savedMessage.includes('Error') ? 'error' : 'success'}`}>
          {savedMessage}
        </div>
      )}

      {/* Account Section */}
      <div className="settings-section">
        <div className="card">
          <h3 className="section-title">Account</h3>
          <div className="account-info">
            <div className="user-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.displayName || 'User'}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleSignOut} className="btn btn-danger">
            Sign Out
          </button>
        </div>
      </div>

      {/* Training Targets */}
      <div className="settings-section">
        <div className="card">
          <h3 className="section-title">Training Targets</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="setting-label">Daily Round Target</label>
              <input
                type="number"
                value={settings.dailyTarget}
                onChange={(e) => handleSimpleChange('dailyTarget', e.target.value)}
                className="setting-input"
                placeholder="e.g., 5"
                min="1"
              />
              <span className="setting-help">Target rounds to complete each day</span>
            </div>
            <div className="setting-item">
              <label className="setting-label">Weekly Round Target</label>
              <input
                type="number"
                value={settings.weeklyTarget}
                onChange={(e) => handleSimpleChange('weeklyTarget', e.target.value)}
                className="setting-input"
                placeholder="e.g., 25"
                min="1"
              />
              <span className="setting-help">Target rounds to complete each week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="settings-section">
        <div className="card">
          <h3 className="section-title">Preferences</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="setting-label">Default Kettlebell Weight (kg)</label>
              <input
                type="number"
                value={settings.preferences.defaultWeight}
                onChange={(e) => handleSettingChange('preferences', 'defaultWeight', e.target.value)}
                className="setting-input"
                placeholder="e.g., 24"
                min="1"
                step="0.5"
              />
              <span className="setting-help">Pre-fill this weight in new sessions</span>
            </div>
            
            <div className="setting-item">
              <label className="setting-label">Auto-save Sessions</label>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={settings.preferences.autoSave}
                  onChange={(e) => handleSettingChange('preferences', 'autoSave', e.target.checked)}
                  className="toggle-input"
                />
                <label htmlFor="autoSave" className="toggle-label">
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <span className="setting-help">Automatically save completed sessions</span>
            </div>

            <div className="setting-item">
              <label className="setting-label">Show Exercise Tips</label>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="showTips"
                  checked={settings.preferences.showTips}
                  onChange={(e) => handleSettingChange('preferences', 'showTips', e.target.checked)}
                  className="toggle-input"
                />
                <label htmlFor="showTips" className="toggle-label">
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <span className="setting-help">Display helpful tips during workouts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <div className="card">
          <h3 className="section-title">Notifications</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="setting-label">Enable Reminders</label>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={settings.notifications.enabled}
                  onChange={(e) => handleSettingChange('notifications', 'enabled', e.target.checked)}
                  className="toggle-input"
                />
                <label htmlFor="notifications" className="toggle-label">
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <span className="setting-help">Get reminded to complete your workouts</span>
            </div>

            {settings.notifications.enabled && (
              <>
                <div className="setting-item">
                  <label className="setting-label">Reminder Time</label>
                  <input
                    type="time"
                    value={settings.notifications.reminderTime}
                    onChange={(e) => handleSettingChange('notifications', 'reminderTime', e.target.value)}
                    className="setting-input"
                  />
                  <span className="setting-help">When to send daily reminders</span>
                </div>

                <div className="setting-item">
                  <label className="setting-label">Reminder Frequency</label>
                  <select
                    value={settings.notifications.frequency}
                    onChange={(e) => handleSettingChange('notifications', 'frequency', e.target.value)}
                    className="setting-select"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="custom">Custom Schedule</option>
                  </select>
                  <span className="setting-help">How often to send reminders</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="settings-section">
        <div className="card">
          <h3 className="section-title">Data Management</h3>
          <div className="data-actions">
            <div className="action-item">
              <div className="action-info">
                <h4>Export Data</h4>
                <p>Download all your workout data and settings as a JSON file</p>
              </div>
              <button onClick={handleExportData} className="btn btn-secondary">
                📥 Export
              </button>
            </div>
            
            <div className="action-item">
              <div className="action-info">
                <h4>Clear All Data</h4>
                <p>Remove all workout history and settings (cannot be undone)</p>
              </div>
              <button onClick={handleClearData} className="btn btn-danger">
                🗑️ Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="settings-section">
        <div className="card">
          <h3 className="section-title">About</h3>
          <div className="about-content">
            <div className="app-info">
              <h4>🛡️ Armor Builder</h4>
              <p>Kettlebell Complex Tracker</p>
              <p className="version">Version 1.0.0</p>
            </div>
            <div className="app-description">
              <p>
                Track your progress through Dan John's Armor Building Complex. 
                Build strength, endurance, and mental toughness with structured kettlebell training.
              </p>
            </div>
            <div className="links">
              <a href="https://danjohnuniversity.com/" target="_blank" rel="noopener noreferrer" className="external-link">
                Learn About Dan John
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="save-section">
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="btn btn-primary btn-large save-btn"
        >
          {isSaving ? '💾 Saving...' : '💾 Save Settings'}
        </button>
      </div>

      <style jsx>{`
        .settings-page {
          max-width: 800px;
          margin: 0 auto;
          padding-bottom: 120px;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .save-message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .save-message.success {
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          color: var(--success-700);
          border: 1px solid var(--success-300);
          box-shadow: var(--shadow-lg);
        }

        .save-message.error {
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          color: var(--danger-700);
          border: 1px solid var(--danger-300);
          box-shadow: var(--shadow-lg);
        }

        .settings-section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
        }

        .account-info {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .user-avatar {
          flex-shrink: 0;
        }

        .avatar-image {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-xl);
          font-weight: 700;
          box-shadow: var(--shadow-lg);
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 4px;
          transition: color 0.3s ease;
        }

        .account-info:hover .user-name {
          color: #000000;
        }

        .user-email {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
        }

        .account-info:hover .user-email {
          color: #0f172a;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .setting-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .setting-label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          transition: color 0.3s ease;
        }

        .setting-item:hover .setting-label {
          color: #000000;
        }

        .setting-input,
        .setting-select {
          padding: var(--space-3);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          font-size: var(--font-base);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(5px);
        }

        .setting-input:focus,
        .setting-select:focus {
          outline: none;
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .setting-help {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .setting-item:hover .setting-help {
          color: #0f172a;
        }

        .toggle-container {
          display: flex;
          align-items: center;
        }

        .toggle-input {
          display: none;
        }

        .toggle-label {
          position: relative;
          width: 50px;
          height: 24px;
          background: var(--gray-300);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .toggle-input:checked + .toggle-label {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .toggle-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-input:checked + .toggle-label .toggle-slider {
          transform: translateX(26px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .data-actions {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .action-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-6);
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .action-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: rgba(255, 255, 255, 0.4);
        }

        .action-info h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          transition: color 0.3s ease;
        }

        .action-item:hover .action-info h4 {
          color: #000000;
        }

        .action-info p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
        }

        .action-item:hover .action-info p {
          color: #0f172a;
        }

        .about-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .app-info {
          text-align: center;
        }

        .app-info h4 {
          font-size: 24px;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.9);
          transition: color 0.3s ease;
        }

        .about-content:hover .app-info h4 {
          color: #000000;
        }

        .app-info p {
          margin: 4px 0;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
        }

        .about-content:hover .app-info p {
          color: #0f172a;
        }

        .version {
          font-size: 12px !important;
          color: rgba(255, 255, 255, 0.5) !important;
          transition: color 0.3s ease;
        }

        .about-content:hover .version {
          color: #666666 !important;
        }

        .app-description {
          text-align: center;
        }

        .app-description p {
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          transition: color 0.3s ease;
        }

        .about-content:hover .app-description p {
          color: #0f172a;
        }

        .links {
          text-align: center;
        }

        .external-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-content:hover .external-link {
          background: none;
          color: #007bff;
          -webkit-text-fill-color: #007bff;
        }

        .external-link:hover {
          text-decoration: underline;
        }

        .save-section {
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - var(--space-8));
          max-width: 768px;
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          padding: var(--space-4);
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-2xl);
          z-index: 50;
        }

        .save-btn {
          width: 100%;
        }

        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }

          .action-item {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .save-section {
            bottom: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;