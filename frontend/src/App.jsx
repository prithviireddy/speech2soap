import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Auth Context
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Loading Spinner Component (utility)
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="animate-spin rounded-full h-full w-full border-3 border-border-default border-t-brand-primary"></div>
    </div>
  );
}

// Pages
import { LoginPage } from './components/pages';
import { DashboardPage } from './components/pages';
import { ConsultationUploadPage } from './components/pages';
import { ReportDetailsPage } from './components/pages';
import { AIAssistantPage } from './components/pages';

export default function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null
  });

  const authValue = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    login: (email) => {
      setAuthState({
        isAuthenticated: true,
        user: {
          name: 'Alex Johnson',
          email: email,
          initial: email[0].toUpperCase()
        }
      });
    },
    logout: () => {
      setAuthState({
        isAuthenticated: false,
        user: null
      });
    }
  };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!authState.isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={authState.isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/upload"
            element={authState.isAuthenticated ? <ConsultationUploadPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/report"
            element={authState.isAuthenticated ? <ReportDetailsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/assistant"
            element={authState.isAuthenticated ? <AIAssistantPage /> : <Navigate to="/login" />}
          />

          {/* Default redirect */}
          <Route 
            path="/" 
            element={<Navigate to={authState.isAuthenticated ? '/dashboard' : '/login'} />} 
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
