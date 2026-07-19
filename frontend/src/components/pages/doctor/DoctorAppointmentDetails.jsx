import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  CalendarDays,
  Clock,
  ClipboardList,
  FileText,
  User,
} from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";

import { getDoctorAppointmentAPI } from "../../../api/doctor";

export const DoctorAppointmentDetails = () => {
  const { appointmentId } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    try {
      setLoading(true);

      const data = await getDoctorAppointmentAPI(
        appointmentId
      );

      setAppointment(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to fetch appointment details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-danger">{error}</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold">
            Appointment Details
          </h1>

          <p className="text-text-secondary mt-2">
            Review appointment information before
            starting the consultation.
          </p>
        </div>

        {/* Patient Information */}
        <Card>
          <h2 className="text-xl font-display font-bold mb-6">
            Patient Information
          </h2>

          <div className="flex items-center gap-3">
            <User size={20} />

            <div>
              <p className="text-sm text-text-secondary">
                Patient Name
              </p>

              <p className="font-semibold text-lg">
                {appointment.patient_name}
              </p>
            </div>
          </div>
        </Card>

        {/* Appointment Information */}
        <Card>
          <h2 className="text-xl font-display font-bold mb-6">
            Appointment Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <CalendarDays size={20} />

              <div>
                <p className="text-sm text-text-secondary">
                  Date & Time
                </p>

                <p className="font-medium">
                  {new Date(
                    appointment.scheduled_at
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={20} />

              <div>
                <p className="text-sm text-text-secondary">
                  Duration
                </p>

                <p className="font-medium">
                  {appointment.duration_minutes} mins
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-text-secondary mb-2">
                Status
              </p>

              <Badge variant="info">
                {appointment.status}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Clinical Information */}
        <Card>
          <h2 className="text-xl font-display font-bold mb-6">
            Clinical Information
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <ClipboardList size={20} />

              <div>
                <p className="text-sm text-text-secondary">
                  Reason
                </p>

                <p className="font-medium">
                  {appointment.reason ||
                    "No reason provided."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText size={20} />

              <div>
                <p className="text-sm text-text-secondary">
                  Notes
                </p>

                <p className="font-medium">
                  {appointment.notes ||
                    "No notes provided."}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action */}
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold">
                Start Consultation
              </h2>

              <p className="text-text-secondary text-sm mt-1">
                Begin the consultation and upload the
                appointment audio recording.
              </p>
            </div>

            <Link
              to={`/doctor/consultations/new/${appointment.id}`}
            >
              <Button variant="primary">
                Start Consultation
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
