import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { Card, Button } from "../../../shared";

import { AppointmentForm } from "./AppointmentForm";
import { createAppointmentAPI } from "../../../../api/appointment";

export const CreateAppointment = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateAppointment = async (payload) => {
    try {
      setLoading(true);
      setError("");

      await createAppointmentAPI(payload);

      navigate("/admin/appointments");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to create appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <Button
        className="mb-4"
        onClick={() =>
            navigate("/admin/appointments")
        }
    >
        ← Back to Appointments
    </Button>

      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Create Appointment
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Schedule a new appointment for a patient.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        <AppointmentForm
          mode="create"
          loading={loading}
          onSubmit={handleCreateAppointment}
        />
      </Card>
    </DashboardLayout>
  );
};
