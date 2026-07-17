import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { Card,Button } from "../../../shared";

import { AppointmentForm } from "./AppointmentForm";

import {
  getAppointmentAPI,
  updateAppointmentAPI,
} from "../../../../api/appointment";

export const EditAppointment = () => {
  const navigate = useNavigate();

  const { appointmentId } = useParams();

  const [appointment, setAppointment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointment();
  }, []);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAppointmentAPI(
        appointmentId
      );

      setAppointment(data);
    } catch {
      setError(
        "Failed to load appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointment =
    async (payload) => {
      try {
        setSaving(true);
        setError("");

        await updateAppointmentAPI(
          appointmentId,
          payload
        );

        navigate(
          `/admin/appointments/${appointmentId}`
        );
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            "Failed to update appointment."
        );
      } finally {
        setSaving(false);
      }
    };

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          Loading appointment...
        </Card>
      </DashboardLayout>
    );
  }

  if (error && !appointment) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-red-600">
            {error}
          </p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

       <Button
        className="mb-4"
        onClick={() =>
            navigate(
                `/admin/appointments/${appointmentId}`
            )
        }
    >
        ← Back to Appointment Details
    </Button>

      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Edit Appointment
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update appointment details.
          </p>
        </div>

        {error && appointment && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-lg border p-4 bg-gray-50">
          <p>
            <strong>Patient:</strong>{" "}
            {appointment.patient_name}
          </p>

          <p className="mt-2">
            <strong>Doctor:</strong>{" "}
            {appointment.doctor_name}
          </p>
        </div>

        <AppointmentForm
          mode="edit"
          loading={saving}
          initialValues={appointment}
          onSubmit={
            handleUpdateAppointment
          }
          showPatientSelection={false}
          showDoctorSelection={false}
        />
      </Card>
    </DashboardLayout>
  );
};
