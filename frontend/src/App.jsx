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
import { LoginPage } from "./components";

// Doctor Pages
import { DoctorDashboard,ConsultationUploadPage, DoctorReportReview, DoctorAIAssistant} from "./components";

// Patient Pages
import { PatientDashboard, PatientReportViewer, PatientMedications, PatientFollowups, PatientAIAssistant, PatientSettings } from "./components";

// Admin Pages
import { AdminDashboard, CreateDoctor, EditDoctor, DoctorDetails, DoctorsList, CreatePatient, PatientList, PatientDetails, EditPatient,  AppointmentDetails, AppointmentList, EditAppointment, CreateAppointment } from "./components";


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
          path = "/admin/doctors/:doctorId/edit"
          element = {
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <EditDoctor/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <PatientList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/patients/new"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
                <CreatePatient />
              </ProtectedRoute>
            }
        />

        <Route
          path="/admin/patients/:patientId"
          element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PatientDetails />
              </ProtectedRoute>
          }
        />

        <Route
          path="/admin/patients/:patientId/edit"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <EditPatient />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles = {["ADMIN"]}>
              <AppointmentList />
            </ProtectedRoute>
          }
        />

        <Route 
          path = "/admin/appointments/new"
          element={
            <ProtectedRoute allowedRoles = {["ADMIN"]}>
              <CreateAppointment />
            </ProtectedRoute>
          }
        />

        <Route 
          path = "/admin/appointments/:appointmentId"
          element={
            <ProtectedRoute allowedRoles = {["ADMIN"]}>
              <AppointmentDetails />
            </ProtectedRoute>
          }
        />

        <Route 
          path = "/admin/appointments/:appointmentId/edit"
          element={
            <ProtectedRoute allowedRoles = {["ADMIN"]}>
              <EditAppointment />
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
