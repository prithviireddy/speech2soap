import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./index.css";

import {
  ProtectedRoute,
  getDashboardPath,
} from "./routes/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

// Auth Pages
import { LoginPage } from "./components/pages/LoginPage";

// Doctor Pages
import { DoctorDashboard } from "./components/pages/doctor/DoctorDashboard";
import { ConsultationUploadPage } from "./components/pages/doctor/ConsultationUploadPage";
import { DoctorReportReview } from "./components/pages/doctor/DoctorReportReview";
import { DoctorPatientManagement } from "./components/pages/doctor/DoctorPatientManagement";
import { DoctorFollowupManagement } from "./components/pages/doctor/DoctorFollowupManagement";
import { DoctorAIAssistant } from "./components/pages/doctor/DoctorAIAssistant";

// Patient Pages
import { PatientDashboard } from "./components/pages/patient/PatientDashboard";
import { PatientReportViewer } from "./components/pages/patient/PatientReportViewer";
import { PatientMedications } from "./components/pages/patient/PatientMedications";
import { PatientFollowups } from "./components/pages/patient/PatientFollowups";
import { PatientAIAssistant } from "./components/pages/patient/PatientAIAssistant";
import { PatientSettings } from "./components/pages/patient/PatientSettings";

// Admin Pages
import { AdminDashboard } from "./components/pages/admin/AdminDashboard";
import { AdminUserManagement } from "./components/pages/admin/AdminUserManagement";
import { AdminSystemMonitoring } from "./components/pages/admin/AdminSystemMonitoring";

const App = () => {
  const {
    isAuthenticated,
    role,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        
        {/*PUBLIC ROUTES*/}

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate
                to={getDashboardPath(role)}
                replace
              />
            )
          }
        />

        {/*DOCTOR ROUTES*/}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <ConsultationUploadPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/reports/:reportId"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorReportReview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorPatientManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/followups"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorFollowupManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/assistant"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorAIAssistant />
            </ProtectedRoute>
          }
        />

        {/*PATIENT ROUTES*/}

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/reports"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientReportViewer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/medications"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientMedications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/followups"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientFollowups />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/assistant"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientAIAssistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/settings"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientSettings />
            </ProtectedRoute>
          }
        />

        {/*ADMIN ROUTES*/}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/monitoring"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSystemMonitoring />
            </ProtectedRoute>
          }
        />

        {/*DEFAULT ROUTING*/}

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate
                to={getDashboardPath(role)}
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/*404*/}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
