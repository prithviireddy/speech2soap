import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// ==================== PAGES ====================
// Auth Pages
import { LoginPage } from './components/pages/LoginPage';
import { AdminLoginPage } from './components/pages/AdminLoginPage';

// Doctor Pages
import { DoctorDashboard } from './components/pages/doctor/DoctorDashboard';
import { ConsultationUploadPage } from './components/pages/doctor/ConsultationUploadPage';
import { DoctorReportReview } from './components/pages/doctor/DoctorReportReview';
import { DoctorPatientManagement } from './components/pages/doctor/DoctorPatientManagement';
import { DoctorFollowupManagement } from './components/pages/doctor/DoctorFollowupManagement';
import { DoctorAIAssistant } from './components/pages/doctor/DoctorAIAssistant';

// Patient Pages
import { PatientDashboard } from './components/pages/patient/PatientDashboard';
import { PatientReportViewer } from './components/pages/patient/PatientReportViewer';
import { PatientMedications } from './components/pages/patient/PatientMedications';
import { PatientFollowups } from './components/pages/patient/PatientFollowups';
import { PatientAIAssistant } from './components/pages/patient/PatientAIAssistant';
import { PatientSettings } from './components/pages/patient/PatientSettings';

// Admin Pages
import { AdminDashboard } from './components/pages/admin/AdminDashboard';
import { AdminUserManagement } from './components/pages/admin/AdminUserManagement';
import { AdminSystemMonitoring } from './components/pages/admin/AdminSystemMonitoring';

// Auth Context
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Audit logging utility
const logAudit = (action, details) => {
  const timestamp = new Date().toISOString();
  console.log(`[AUDIT ${timestamp}] ${action}:`, details);
  // In production, send to audit logging service
};

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    role: null // 'doctor' | 'patient' | 'admin'
  });

  // Check for persisted auth on mount
  useEffect(() => {
    const stored = localStorage.getItem('authState');
    if (stored) {
      try {
        setAuthState(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('authState');
      }
    }
  }, []);

  const authValue = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    role: authState.role,

    // Doctor login
    loginDoctor: (email, name) => {
      const newState = {
        isAuthenticated: true,
        user: {
          name: name || 'Dr. ' + email.split('@')[0],
          email: email,
          initial: (name || email)[0].toUpperCase(),
          id: 'doc_' + Math.random().toString(36).substr(2, 9)
        },
        role: 'doctor'
      };
      setAuthState(newState);
      localStorage.setItem('authState', JSON.stringify(newState));
      logAudit('LOGIN', { role: 'doctor', email });
    },

    // Patient login
    loginPatient: (email, name) => {
      const newState = {
        isAuthenticated: true,
        user: {
          name: name || email.split('@')[0],
          email: email,
          initial: (name || email)[0].toUpperCase(),
          id: 'pat_' + Math.random().toString(36).substr(2, 9)
        },
        role: 'patient'
      };
      setAuthState(newState);
      localStorage.setItem('authState', JSON.stringify(newState));
      logAudit('LOGIN', { role: 'patient', email });
    },

    // Admin login
    loginAdmin: (email, password) => {
      // Simple admin validation (in production, verify against backend)
      if (password === 'admin123') {
        const newState = {
          isAuthenticated: true,
          user: {
            name: 'Admin',
            email: email,
            initial: 'A',
            id: 'admin_001'
          },
          role: 'admin'
        };
        setAuthState(newState);
        localStorage.setItem('authState', JSON.stringify(newState));
        logAudit('LOGIN', { role: 'admin', email });
        return true;
      }
      return false;
    },

    logout: () => {
      logAudit('LOGOUT', { role: authState.role, email: authState.user?.email });
      setAuthState({
        isAuthenticated: false,
        user: null,
        role: null
      });
      localStorage.removeItem('authState');
    }
  };

  return (
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <Routes>
          {/* ============ PUBLIC ROUTES ============ */}
          <Route
            path="/login"
            element={!authState.isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/admin-login"
            element={!authState.isAuthenticated ? <AdminLoginPage /> : <Navigate to="/admin/dashboard" />}
          />

          {/* ============ DOCTOR ROUTES ============ */}
          <Route
            path="/dashboard"
            element={authState.role === 'doctor' ? <DoctorDashboard /> : authState.isAuthenticated ? <Navigate to="/patient/dashboard" /> : <Navigate to="/login" />}
          />
          <Route
            path="/upload"
            element={authState.role === 'doctor' ? <ConsultationUploadPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/doctor/reports/:reportId"
            element={authState.role === 'doctor' ? <DoctorReportReview /> : <Navigate to="/login" />}
          />
          <Route
            path="/doctor/patients"
            element={authState.role === 'doctor' ? <DoctorPatientManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/doctor/followups"
            element={authState.role === 'doctor' ? <DoctorFollowupManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/doctor/assistant"
            element={authState.role === 'doctor' ? <DoctorAIAssistant /> : <Navigate to="/login" />}
          />

          {/* ============ PATIENT ROUTES ============ */}
          <Route
            path="/patient/dashboard"
            element={authState.role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/patient/reports"
            element={authState.role === 'patient' ? <PatientReportViewer /> : <Navigate to="/login" />}
          />
          <Route
            path="/patient/medications"
            element={authState.role === 'patient' ? <PatientMedications /> : <Navigate to="/login" />}
          />
          <Route
            path="/patient/followups"
            element={authState.role === 'patient' ? <PatientFollowups /> : <Navigate to="/login" />}
          />
          <Route
            path="/patient/assistant"
            element={authState.role === 'patient' ? <PatientAIAssistant /> : <Navigate to="/login" />}
          />
          <Route
            path="/patient/settings"
            element={authState.role === 'patient' ? <PatientSettings /> : <Navigate to="/login" />}
          />

          {/* ============ ADMIN ROUTES ============ */}
          <Route
            path="/admin/dashboard"
            element={authState.role === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />}
          />
          <Route
            path="/admin/users"
            element={authState.role === 'admin' ? <AdminUserManagement /> : <Navigate to="/admin-login" />}
          />
          <Route
            path="/admin/monitoring"
            element={authState.role === 'admin' ? <AdminSystemMonitoring /> : <Navigate to="/admin-login" />}
          />

          {/* ============ DEFAULT ROUTING ============ */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  authState.isAuthenticated
                    ? authState.role === 'doctor'
                      ? '/dashboard'
                      : authState.role === 'patient'
                      ? '/patient/dashboard'
                      : '/admin/dashboard'
                    : '/login'
                }
              />
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
