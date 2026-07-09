import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft } from 'lucide-react';

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { Card, Button } from "../../../shared";

import { getDoctorAPI } from "../../../../api/doctor";

export const DoctorDetails = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDoctor();
  }, []);

  const loadDoctor = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctorAPI(doctorId);

      setDoctor(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          "Failed to load doctor."
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
            <p>Loading doctor...</p>
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
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-600">
              {error}
            </div>

            <div className="mt-6">
              <Button
                onClick={() => navigate("/admin/doctors")}
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
            onClick={() => navigate("/admin/doctors")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
          >
            <MoveLeft size={30} strokeWidth={1.5} /> Back to Doctors
          </button>

          <h1 className="text-3xl font-bold mt-3">
            Doctor Details
          </h1>

          <p className="text-gray-500 mt-2">
            View doctor information.
          </p>
        </div>

        {/* Account */}

        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-6">
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-medium">
                {doctor.email}
              </p>
            </div>

          </div>
        </Card>

        {/* Professional */}

        <Card>
          <h2 className="text-lg font-semibold mb-6">
            Professional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="mt-1 font-medium">
                {doctor.full_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 font-medium">
                {doctor.phone}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Specialization
              </p>

              <p className="mt-1 font-medium">
                {doctor.specialization}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                License Number
              </p>

              <p className="mt-1 font-medium">
                {doctor.license_number}
              </p>
            </div>

          </div>

          <div className="flex justify-end gap-3 border-t pt-6 mt-8">

            <Button
              type="button"
              onClick={() => navigate("/admin/doctors")}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Back
            </Button>

            <Button
              onClick={() =>
                navigate(
                  `/admin/doctors/${doctor.id}/edit`
                )
              }
            >
              Edit Doctor
            </Button>

          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
};
