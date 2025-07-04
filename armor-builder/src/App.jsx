import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import SessionSetup from './pages/SessionSetup';
import WorkoutLogging from './pages/WorkoutLogging';
import SessionSummary from './pages/SessionSummary';
import Dashboard from './pages/Dashboard';
import SessionHistory from './pages/SessionHistory';
import Settings from './pages/Settings';
import Login from './pages/Login';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/session/setup" element={
          <ProtectedRoute>
            <Layout>
              <SessionSetup />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/session/workout" element={
          <ProtectedRoute>
            <Layout>
              <WorkoutLogging />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/session/summary" element={
          <ProtectedRoute>
            <Layout>
              <SessionSummary />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <Layout>
              <SessionHistory />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
