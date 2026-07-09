import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft } from 'lucide-react';

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { Card, Button } from "../../../shared";

import { getPatientAPI } from "../../../../api/patient";

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 font-medium">{value || "-"}</p>
  </div>
);

export const PatientDetails = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPatientAPI(patientId);

      setPatient(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          "Failed to load patient."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <Card>
            <p>Loading patient...</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <Card>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
            </div>

            <div className="mt-6">
              <Button
                onClick={() =>
                  navigate("/admin/patients")
                }
              >
                Back
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <button
            onClick={() => navigate(`/admin/patients}`)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
          >
            <MoveLeft size={30} strokeWidth={1.5} /> Back to Patients
          </button>

          <h1 className="text-3xl font-bold mt-3">
            Patient Details
          </h1>

          <p className="text-gray-500 mt-2">
            View patient information.
          </p>
        </div>

        {/* Account Information */}

        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-6">
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <DetailItem
              label="Email"
              value={patient.email}
            />

            <DetailItem
              label="Patient Number"
              value={patient.patient_number}
            />

          </div>
        </Card>

        {/* Personal Information */}

        <Card>
          <h2 className="text-lg font-semibold mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <DetailItem
              label="Full Name"
              value={patient.full_name}
            />

            <DetailItem
              label="Phone"
              value={patient.phone}
            />

            <DetailItem
              label="Gender"
              value={patient.gender}
            />

            <DetailItem
              label="Date of Birth"
              value={patient.date_of_birth}
            />

          </div>

          <div className="flex justify-end gap-3 border-t pt-6 mt-8">

            <Button
              type="button"
              onClick={() =>
                navigate("/admin/patients")
              }
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Back
            </Button>

            <Button
              onClick={() =>
                navigate(
                  `/admin/patients/${patient.id}/edit`
                )
              }
            >
              Edit Patient
            </Button>

          </div>

        </Card>

      </div>
    </DashboardLayout>
  );
};
