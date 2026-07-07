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
import { CreateDoctor } from "./components/pages/admin/doctors/CreateDoctor";
import { DoctorDetails } from "./components/pages/admin/doctors/DoctorDetails";
import { DoctorsList } from "./components/pages/admin/doctors/DoctorsList";
import { CreatePatient } from "./components/pages/admin/patients/CreatePatient";

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
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/upload"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <ConsultationUploadPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/reports/:reportId"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorReportReview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorPatientManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/followups"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorFollowupManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/assistant"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorAIAssistant />
            </ProtectedRoute>
          }
        />

        {/*PATIENT ROUTES*/}

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/reports"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientReportViewer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/medications"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientMedications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/followups"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientFollowups />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/assistant"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientAIAssistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/settings"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientSettings />
            </ProtectedRoute>
          }
        />

        {/*ADMIN ROUTES*/}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DoctorsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors/new"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CreateDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors/:doctorId"
          element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <DoctorDetails />
              </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients/new"
          element={<CreatePatient />}
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
