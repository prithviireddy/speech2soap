import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft } from 'lucide-react';


import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { DoctorForm } from "./DoctorForm";

import { createDoctorAPI } from "../../../../api/doctor";

export const CreateDoctor = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateDoctor = async (form) => {
    setLoading(true);
    setError("");

    try {
      await createDoctorAPI(form);

      navigate(`/admin/doctors/${doctorId}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          "Failed to create doctor."
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
            onClick={() => navigate("/admin/doctors")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
          >
            <MoveLeft size={30} strokeWidth={1.5} /> Back to Doctors
          </button>

          <h1 className="text-3xl font-bold mt-3">
            Create Doctor
          </h1>

          <p className="text-gray-500 mt-2">
            Register a new doctor who can access ClinicReport.
          </p>
        </div>

        <DoctorForm
          mode="create"
          onSubmit={handleCreateDoctor}
          loading={loading}
          error={error}
          submitLabel="Create Doctor"
          onCancel={() => navigate("/admin/doctors")}
        />

      </div>
    </DashboardLayout>
  );
};
