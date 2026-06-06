import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { LoginPage, DashboardPage, ConsultationUploadPage, ReportDetailsPage, AIAssistantPage } from './components/pages';

// Auth Context
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};





const App = () => {
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
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
