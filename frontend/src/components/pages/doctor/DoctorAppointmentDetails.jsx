import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  ClipboardList,
  FileText,
  User,
  ArrowLeft,
  Mic,
  ShieldCheck,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";
import {
  getDoctorAppointmentAPI,
  deleteDoctorAppointmentAPI,
} from "../../../api/doctor";

const statusVariantMap = {
  SCHEDULED: "info",
  CHECKED_IN: "warning",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
  NO_SHOW: "danger",
};

export const DoctorAppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const data = await getDoctorAppointmentAPI(appointmentId);
      setAppointment(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to fetch appointment details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this appointment? This action cannot be undone.")) return;
    try {
      setDeleting(true);
      await deleteDoctorAppointmentAPI(appointmentId);
      navigate("/doctor/appointments");
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to delete appointment.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-24">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !appointment) {
    return (
      <DashboardLayout>
        <Card className="bento-card border-danger/30 bg-danger-light/20 p-6 text-center max-w-lg mx-auto mt-12">
          <p className="text-danger text-sm font-medium">
            {error || "Appointment not found."}
          </p>
          <Link to="/doctor/appointments" className="inline-block mt-4">
            <Button variant="secondary" size="sm">
              Back to Appointments
            </Button>
          </Link>
        </Card>
      </DashboardLayout>
    );
  }

  const d = new Date(appointment.scheduled_at);
  const dateFormatted = d.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeFormatted = d.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up max-w-4xl">
        {/* Back Link & Top Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/doctor/appointments"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to All Appointments</span>
          </Link>

          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-1.5 text-xs"
          >
            <Trash2 size={13} />
            <span>{deleting ? "Deleting..." : "Delete Appointment"}</span>
          </Button>
        </div>

        {/* Top Patient Hero Banner */}
        <Card className="bento-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white shadow-md shadow-brand-primary/25 flex items-center justify-center font-display font-bold text-xl shrink-0">
                {appointment.patient_name
                  ? appointment.patient_name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "PT"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
                    {appointment.patient_name}
                  </h1>
                  <Badge
                    variant={statusVariantMap[appointment.status] || "secondary"}
                    size="sm"
                  >
                    {appointment.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted font-mono mt-0.5">
                  Record ID: {appointment.patient_number || "PT-RECORD"}
                </p>
              </div>
            </div>

            <Link to={`/doctor/patients/${appointment.patient_id}/history`}>
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs self-start sm:self-auto">
                <User size={14} />
                <span>Patient History & AI</span>
                <ChevronRight size={13} />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Bento Grid: Schedule & Clinical Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date & Time Tile */}
          <Card className="bento-card p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-brand-primary">
              <div className="p-2 rounded-xl bg-brand-primary-light">
                <CalendarDays size={18} />
              </div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Scheduled Slot
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{dateFormatted}</p>
              <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1 font-mono">
                <Clock size={12} />
                {timeFormatted} ({appointment.duration_minutes || 30} mins)
              </p>
            </div>
          </Card>

          {/* Reason for Consultation */}
          <Card className="bento-card p-5 space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5 text-brand-primary">
              <div className="p-2 rounded-xl bg-brand-primary-light">
                <ClipboardList size={18} />
              </div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Chief Complaint / Reason
              </span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed bg-bg-base/60 p-3 rounded-xl border border-border-subtle">
              {appointment.reason || "No specific reason provided for this visit."}
            </p>
          </Card>
        </div>

        {/* Notes Tile */}
        {appointment.notes && (
          <Card className="bento-card p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-text-secondary">
              <FileText size={16} className="text-brand-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Additional Clinical Notes
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap bg-bg-base/60 p-3 rounded-xl border border-border-subtle">
              {appointment.notes}
            </p>
          </Card>
        )}

        {/* Action: Launch Consultation Card */}
        <Card className="bento-card p-6 border-brand-primary/30 bg-gradient-to-br from-bg-secondary via-brand-primary-light/15 to-bg-secondary shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-primary text-white shadow-xs">
                  <Mic size={18} />
                </div>
                <h2 className="text-lg font-display font-bold text-text-primary">
                  Start Audio Consultation
                </h2>
              </div>
              <p className="text-xs text-text-secondary max-w-md leading-relaxed">
                Begin recording or upload the doctor-patient conversation to automatically generate structured SOAP notes and update the patient record.
              </p>
            </div>

            <Link to={`/doctor/consultations/new/${appointment.id}`}>
              <Button variant="primary" className="py-2.5 px-5 font-semibold gap-2 shadow-md shadow-brand-primary/20">
                <Mic size={16} />
                <span>Start Consultation</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
