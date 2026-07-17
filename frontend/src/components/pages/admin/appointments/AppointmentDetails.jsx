import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { Card, Button } from "../../../shared";

import { getAppointmentAPI } from "../../../../api/appointment";

export const AppointmentDetails = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const [appointment, setAppointment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointment();
  }, []);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAppointmentAPI(appointmentId);

      setAppointment(data);
    } catch {
      setError("Failed to load appointment details.");
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              Appointment Details
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View appointment information.
            </p>
          </div>

          {!loading && !error && appointment && (
            <Button
              onClick={() =>
                navigate(
                  `/admin/appointments/${appointment.id}/edit`
                )
              }
            >
              Edit Appointment
            </Button>
          )}
        </div>

        {loading && (
          <p>Loading appointment details...</p>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && appointment && (
          <div className="space-y-6">

            <div>
              <h2 className="font-medium text-gray-600">
                Patient
              </h2>

              <p className="mt-1">
                {appointment.patient_name}
              </p>
            </div>

            <div>
              <h2 className="font-medium text-gray-600">
                Doctor
              </h2>

              <p className="mt-1">
                {appointment.doctor_name}
              </p>
            </div>

            <div>
              <h2 className="font-medium text-gray-600">
                Scheduled At
              </h2>

              <p className="mt-1">
                {new Date(
                  appointment.scheduled_at
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <h2 className="font-medium text-gray-600">
                Duration
              </h2>

              <p className="mt-1">
                {appointment.duration_minutes} mins
              </p>
            </div>

            <div>
              <h2 className="font-medium text-gray-600">
                Status
              </h2>

              <p className="mt-1">
                {appointment.status}
              </p>
            </div>

            <div>
              <h2 className="font-medium text-gray-600">
                Reason
              </h2>

              <p className="mt-1">
                {appointment.reason}
              </p>
            </div>

            <div>
              <h2 className="font-medium text-gray-600">
                Notes
              </h2>

              <p className="mt-1">
                {appointment.notes || "No notes provided."}
              </p>
            </div>

            <div>
              <h2 className="font-medium text-gray-600">
                Created At
              </h2>

              <p className="mt-1">
                {new Date(
                  appointment.created_at
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <h2 className="font-medium text-gray-600">
                Last Updated
              </h2>

              <p className="mt-1">
                {new Date(
                  appointment.updated_at
                ).toLocaleString()}
              </p>
            </div>

          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};
