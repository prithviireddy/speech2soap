import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft } from 'lucide-react';

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { PatientForm } from "./PatientForm";
import { LoadingSpinner } from "../../../shared";

import {
  getPatientAPI,
  updatePatientAPI,
} from "../../../../api/patient";

export const EditPatient = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      setLoadingPatient(true);
      setError("");

      try {
        const data = await getPatientAPI(patientId);
        setPatient(data);
      } catch (err) {
        setError(
          err.response?.data?.detail ??
            "Failed to load patient."
        );
      } finally {
        setLoadingPatient(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  const handleUpdatePatient = async (form) => {
    setLoading(true);
    setError("");

    try {
      await updatePatientAPI(patientId, form);

      navigate("/admin/patients");
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          "Failed to update patient."
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
            onClick={() => navigate(`/admin/patients/${patientId}`)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
          >
            <MoveLeft size={30} strokeWidth={1.5} /> Back to Patients
          </button>

          <h1 className="text-3xl font-bold mt-3">
            Edit Patient
          </h1>

          <p className="text-gray-500 mt-2">
            Update the patient's information.
          </p>
        </div>

        {loadingPatient ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : error && !patient ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        ) : (
          <PatientForm
            mode="edit"
            initialValues={patient}
            onSubmit={handleUpdatePatient}
            loading={loading}
            error={error}
            submitLabel="Save Changes"
            onCancel={() =>
              navigate(`/admin/patients/${patientId}`)
            }
          />
        )}

      </div>
    </DashboardLayout>
  );
};
