import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft } from 'lucide-react';

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { PatientForm } from "./PatientForm";

import { createPatientAPI } from "../../../../api/patient";

export const CreatePatient = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreatePatient = async (form) => {
    setLoading(true);
    setError("");

    try {
      await createPatientAPI(form);

      navigate("/admin/patients");
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          "Failed to create patient."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/patients")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
          >
            <MoveLeft size={30} strokeWidth={1.5} /> Back to Patients
          </button>

          <h1 className="text-3xl font-bold mt-3">
            Register Patient
          </h1>

          <p className="text-gray-500 mt-2">
            Register a new patient in the clinic.
          </p>
        </div>

        <PatientForm
          mode="create"
          onSubmit={handleCreatePatient}
          loading={loading}
          error={error}
          submitLabel="Register Patient"
          onCancel={() => navigate("/admin/patients")}
        />

      </div>
    </DashboardLayout>
  );
};
