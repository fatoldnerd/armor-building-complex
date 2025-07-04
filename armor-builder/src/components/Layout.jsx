import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const { user, signOut, demoMode } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/session/setup', label: 'New Session', icon: '🏋️' },
    { path: '/history', label: 'History', icon: '📋' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className={styles.layout}>
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className={styles.demoBanner}>
          <div className="container">
            <div className={styles.demoContent}>
              <span className={styles.demoIcon}>🎮</span>
              <span className={styles.demoText}>Demo Mode - Data will not be saved</span>
              <Link to="/login" className={styles.demoUpgrade}>
                Sign Up to Save Data
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <Link to="/dashboard" className={styles.logo}>
              <span className={styles.logoIcon}>🛡️</span>
              <span className={styles.logoText}>Armor Builder</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.desktopNav}>
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.desktopNavItem} ${location.pathname === item.path ? styles.active : ''}`}
                >
                  <span className={styles.desktopNavIcon}>{item.icon}</span>
                  <span className={styles.desktopNavLabel}>{item.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className={styles.userMenu}>
              <span className={styles.userGreeting}>Hi, {user?.displayName?.split(' ')[0] || 'User'}</span>
              <button onClick={handleSignOut} className={styles.btnSignOut}>
                {demoMode ? 'Exit Demo' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className="container">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className={styles.bottomNav}>
        {navigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;