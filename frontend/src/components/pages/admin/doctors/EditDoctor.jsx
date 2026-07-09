import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft } from 'lucide-react';

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { DoctorForm } from "./DoctorForm";
import { LoadingSpinner } from "../../../shared";

import {
  getDoctorAPI,
  updateDoctorAPI,
} from "../../../../api/doctor";

export const EditDoctor = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoadingDoctor(true);
      setError("");

      try {
        const data = await getDoctorAPI(doctorId);
        setDoctor(data);
      } catch (err) {
        setError(
          err.response?.data?.detail ??
            "Failed to load doctor."
        );
      } finally {
        setLoadingDoctor(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleUpdateDoctor = async (form) => {
    setLoading(true);
    setError("");

    try {
      await updateDoctorAPI(doctorId, form);

      navigate("/admin/doctors");
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          "Failed to update doctor."
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
            onClick={() => navigate(`/admin/doctors/${doctorId}`)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
          >
            <MoveLeft size={30} strokeWidth={1.5} /> Back to Doctors
          </button>

          <h1 className="text-3xl font-bold mt-3">
            Edit Doctor
          </h1>

          <p className="text-gray-500 mt-2">
            Update the doctor's professional information.
          </p>
        </div>

        {loadingDoctor ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : error && !doctor ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        ) : (
          <DoctorForm
            mode="edit"
            initialValues={doctor}
            onSubmit={handleUpdateDoctor}
            loading={loading}
            error={error}
            submitLabel="Save Changes"
            onCancel={() =>
              navigate(`/admin/doctors/${doctorId}`)
            }
          />
        )}

      </div>
    </DashboardLayout>
  );
};
