import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  User,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

import {
  Card,
  Badge,
  Button,
  LoadingSpinner,
} from "../../shared";

import { DashboardLayout } from "../../layouts/DashboardLayout";

import {
  listDoctorAppointmentsAPI,
  getDoctorConsultationsAPI,
  getDoctorReportsAPI,
} from "../../../api/doctor";

export const DoctorDashboard = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        appointmentsData,
        consultationsData,
        reportsData,
      ] = await Promise.all([
        listDoctorAppointmentsAPI(),
        getDoctorConsultationsAPI(),
        getDoctorReportsAPI(),
      ]);

      setAppointments(appointmentsData);
      setConsultations(consultationsData);
      setReports(reportsData);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Today's appointments
   *
   * We derive this from scheduled_at because the existing
   * doctor appointments endpoint returns all appointments.
   */
  const todaysAppointments = useMemo(() => {
    const today = new Date();

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(
        appointment.scheduled_at
      );

      return (
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getDate() === today.getDate()
      );
    });
  }, [appointments]);

  /*
   * Reports waiting for doctor review.
   *
   * Backend gives us is_approved, so false means
   * the report still needs review.
   */
  const pendingReports = useMemo(() => {
    return reports.filter(
      (report) => !report.is_approved
    );
  }, [reports]);

  /*
   * Consultations currently being processed.
   *
   * These are the states defined by ConsultationStatus
   * that represent processing before REVIEW_PENDING.
   */
  const processingConsultations = useMemo(() => {
    return consultations.filter((consultation) =>
      [
        "UPLOADED",
        "TRANSCRIBING",
        "PROCESSING",
      ].includes(consultation.status)
    );
  }, [consultations]);

  /*
   * Recently approved reports.
   *
   * list_reports() already returns reports ordered by
   * created_at descending, so we only filter approved
   * reports and take the first few.
   */
  const recentApprovedReports = useMemo(() => {
    return reports
      .filter((report) => report.is_approved)
      .slice(0, 5);
  }, [reports]);

  const getAppointmentStatusVariant = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "info";

      case "CHECKED_IN":
        return "warning";

      case "IN_PROGRESS":
        return "warning";

      case "COMPLETED":
        return "success";

      case "CANCELLED":
      case "NO_SHOW":
        return "danger";

      default:
        return "secondary";
    }
  };

  const getConsultationStatusVariant = (status) => {
    switch (status) {
      case "UPLOADED":
        return "secondary";

      case "TRANSCRIBING":
      case "PROCESSING":
        return "info";

      case "REVIEW_PENDING":
        return "warning";

      case "APPROVED":
        return "success";

      case "FAILED":
        return "danger";

      default:
        return "secondary";
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
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-display font-bold">
              Welcome back, Dr. {user?.name}
            </h1>
          </div>

          <Card>
            <p className="text-danger">
              {error}
            </p>

            <Button
              variant="secondary"
              onClick={fetchDashboardData}
              className="mt-4"
            >
              Try Again
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold">
            Welcome back, Dr. {user?.name}
          </h1>

          <p className="text-text-secondary mt-2">
            Here's what's happening with your consultations
            and reports.
          </p>
        </div>

        {/* Today's Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold">
                Today's Appointments
              </h2>

              <p className="text-sm text-text-secondary mt-1">
                {todaysAppointments.length} appointment
                {todaysAppointments.length !== 1 ? "s" : ""}
                {" "}today
              </p>
            </div>

            <CalendarDays size={24} />
          </div>

          {todaysAppointments.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarDays
                size={40}
                className="mx-auto text-text-secondary"
              />

              <p className="text-text-secondary mt-3">
                No appointments scheduled for today.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysAppointments.slice(0, 5).map(
                (appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-bg-base rounded-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User size={17} />

                        <p className="font-semibold">
                          {appointment.patient_name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock size={15} />

                        <span>
                          {new Date(
                            appointment.scheduled_at
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={getAppointmentStatusVariant(
                          appointment.status
                        )}
                      >
                        {appointment.status}
                      </Badge>

                      <Link
                        to={`/doctor/appointments/${appointment.id}`}
                      >
                        <Button variant="secondary">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              )}

              {todaysAppointments.length > 5 && (
                <div className="pt-2">
                  <Link to="/doctor/appointments">
                    <Button
                      variant="secondary"
                      className="w-full"
                    >
                      View All Appointments
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Pending Reports */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold">
                Pending Reports
              </h2>

              <p className="text-sm text-text-secondary mt-1">
                Reports waiting for your review
              </p>
            </div>

            <FileText size={24} />
          </div>

          {pendingReports.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2
                size={40}
                className="mx-auto text-success"
              />

              <p className="text-text-secondary mt-3">
                No reports are waiting for review.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-bg-base rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <User size={17} />

                    <p className="font-semibold">
                      {report.patient_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="warning">
                      REVIEW PENDING
                    </Badge>

                    <Link
                      to={`/doctor/reports/${report.id}`}
                    >
                      <Button variant="primary">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}

              {pendingReports.length > 5 && (
                <div className="pt-2">
                  <Link to="/doctor/reports">
                    <Button
                      variant="secondary"
                      className="w-full"
                    >
                      View All Reports
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Consultations Processing */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold">
                Consultations Processing
              </h2>

              <p className="text-sm text-text-secondary mt-1">
                Currently being processed by the AI pipeline
              </p>
            </div>

            <Clock size={24} />
          </div>

          {processingConsultations.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2
                size={40}
                className="mx-auto text-success"
              />

              <p className="text-text-secondary mt-3">
                No consultations are currently processing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {processingConsultations.slice(0, 5).map(
                (consultation) => (
                  <Link
                    key={consultation.id}
                    to={`/doctor/consultations/${consultation.id}`}
                    className="block"
                  >
                    <div className="p-4 bg-bg-base rounded-lg hover:shadow-md transition-all">

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                          <p className="font-semibold">
                            {consultation.patient_name}
                          </p>

                          <p className="text-sm text-text-secondary mt-1">
                            {consultation.current_stage}
                          </p>
                        </div>

                        <Badge
                          variant={getConsultationStatusVariant(
                            consultation.status
                          )}
                        >
                          {consultation.status}
                        </Badge>

                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>
                            Progress
                          </span>

                          <span className="font-semibold">
                            {consultation.progress}%
                          </span>
                        </div>

                        <div className="w-full h-2 bg-border-default rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-primary transition-all"
                            style={{
                              width: `${consultation.progress}%`,
                            }}
                          />
                        </div>
                      </div>

                    </div>
                  </Link>
                )
              )}

              {processingConsultations.length > 5 && (
                <Link to="/doctor/consultations">
                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                    View All Consultations
                  </Button>
                </Link>
              )}
            </div>
          )}
        </Card>

        {/* Recent Approved Reports */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold">
                Recent Approved Reports
              </h2>

              <p className="text-sm text-text-secondary mt-1">
                Recently approved clinical reports
              </p>
            </div>

            <CheckCircle2 size={24} />
          </div>

          {recentApprovedReports.length === 0 ? (
            <div className="py-8 text-center">
              <FileText
                size={40}
                className="mx-auto text-text-secondary"
              />

              <p className="text-text-secondary mt-3">
                No approved reports yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApprovedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-bg-base rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <User size={17} />

                      <p className="font-semibold">
                        {report.patient_name}
                      </p>
                    </div>

                    <p className="text-sm text-text-secondary mt-1">
                      Updated{" "}
                      {new Date(
                        report.updated_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="success">
                      APPROVED
                    </Badge>

                    <Link
                      to={`/doctor/reports/${report.id}`}
                    >
                      <Button variant="secondary">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </DashboardLayout>
  );
};
