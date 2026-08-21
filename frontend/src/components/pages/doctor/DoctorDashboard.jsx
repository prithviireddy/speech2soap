import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  User,
  Activity,
  Stethoscope,
  ArrowUpRight,
  UploadCloud,
  ChevronRight,
  Sparkles,
  Trash2,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";
import { DashboardLayout } from "../../layouts/DashboardLayout";

import {
  listDoctorAppointmentsAPI,
  getDoctorConsultationsAPI,
  getDoctorReportsAPI,
  deleteDoctorAppointmentAPI,
  deleteDoctorConsultationAPI,
} from "../../../api/doctor";

/* ── Helpers ───────────────────────────────────────── */

const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
};

const isThisWeek = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  return d >= weekAgo && d <= now;
};

const fmtTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

const apptBadgeVariant = (status) => {
  switch (status) {
    case "CHECKED_IN":
    case "IN_PROGRESS":
      return "warning";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
    case "NO_SHOW":
      return "danger";
    case "SCHEDULED":
    default:
      return "info";
  }
};

const consultBadgeVariant = (status) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "REVIEW_PENDING":
      return "warning";
    case "FAILED":
      return "danger";
    case "TRANSCRIBING":
    case "PROCESSING":
    case "UPLOADED":
    default:
      return "info";
  }
};

const formatDoctorName = (rawName) => {
  if (!rawName) return "Physician";
  return rawName.replace(/^dr\.?\s+/i, "");
};

/* ── Sub-components ─────────────────────────────────── */

const KPICard = ({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  sub,
  to,
}) => (
  <Card className="bento-card p-5 group flex flex-col justify-between">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
        {label}
      </span>
      <div
        className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-2xs`}
      >
        <Icon size={18} />
      </div>
    </div>
    <div>
      <div className="text-2xl sm:text-3xl font-display font-bold text-text-primary tracking-tight">
        {value}
      </div>
      {sub && (
        <p className="text-[11px] text-text-muted mt-1 font-medium">{sub}</p>
      )}
    </div>
    {to && (
      <Link
        to={to}
        className="mt-3.5 pt-2.5 border-t border-border-subtle flex items-center justify-between text-[11px] font-semibold text-brand-primary hover:text-brand-primary-hover group/link"
      >
        <span>View details</span>
        <ArrowUpRight
          size={12}
          className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
        />
      </Link>
    )}
  </Card>
);

const SectionHeader = ({ icon: Icon, title, subtitle, to, linkLabel }) => (
  <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-subtle">
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded-lg bg-brand-primary-light text-brand-primary">
        <Icon size={16} />
      </div>
      <div>
        <h2 className="text-sm font-display font-bold text-text-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-text-muted">{subtitle}</p>
        )}
      </div>
    </div>
    {to && (
      <Link
        to={to}
        className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover flex items-center gap-0.5"
      >
        <span>{linkLabel || "View all"}</span>
        <ChevronRight size={13} />
      </Link>
    )}
  </div>
);

/* ── Main Component ─────────────────────────────────── */

export const DoctorDashboard = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const todayLabel = () =>
    new Date().toLocaleDateString([], {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [apptData, consultData, reportData] = await Promise.all([
        listDoctorAppointmentsAPI().catch(() => []),
        getDoctorConsultationsAPI().catch(() => []),
        getDoctorReportsAPI().catch(() => []),
      ]);

      setAppointments(apptData || []);
      setConsultations(consultData || []);
      setReports(reportData || []);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConsultation = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this consultation record?")) return;
    try {
      await deleteDoctorConsultationAPI(id);
      setConsultations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to delete consultation.");
    }
  };

  const handleDeleteAppointment = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await deleteDoctorAppointmentAPI(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to delete appointment.");
    }
  };

  /* Derived data */
  const todaysAppointments = useMemo(
    () =>
      appointments
        .filter((a) => isToday(a.scheduled_at))
        .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)),
    [appointments]
  );

  const pendingReports = useMemo(
    () => reports.filter((r) => !r.is_approved),
    [reports]
  );

  const processingConsultations = useMemo(
    () =>
      consultations.filter((c) =>
        ["UPLOADED", "TRANSCRIBING", "PROCESSING", "FAILED"].includes(c.status)
      ),
    [consultations]
  );

  const approvedThisWeek = useMemo(
    () => reports.filter((r) => r.is_approved && isThisWeek(r.updated_at)).length,
    [reports]
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-28 gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-xs text-text-muted font-medium">
            Loading clinical dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-display font-bold">
            {greeting()}, Dr. {formatDoctorName(user?.name || user?.full_name)}
          </h1>
          <Card className="border-danger/30 bg-danger-light/30">
            <p className="text-danger text-sm font-medium">{error}</p>
            <Button variant="secondary" onClick={fetchDashboardData} className="mt-4">
              Try Again
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* ── Top Hero Greeting Card ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-zinc-950 to-slate-900 text-white p-6 sm:p-8 border border-border-default/50 shadow-2xl">
          {/* Subtle Ambient Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
                <Sparkles size={13} className="text-cyan-400" />
                <span>{todayLabel()}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
                {greeting()},{" "}
                <span className="text-white">
                  Dr. {formatDoctorName(user?.name || user?.full_name)}
                </span>
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                You have{" "}
                <strong className="text-white font-semibold">
                  {todaysAppointments.length} appointment
                  {todaysAppointments.length !== 1 ? "s" : ""}
                </strong>{" "}
                scheduled for today and{" "}
                <strong className="text-amber-400 font-semibold">
                  {pendingReports.length} report
                  {pendingReports.length !== 1 ? "s" : ""}
                </strong>{" "}
                pending clinical review.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/doctor/appointments">
                <Button variant="primary" className="py-2.5 px-4 text-xs font-semibold gap-2 shadow-md shadow-brand-primary/30">
                  <CalendarDays size={15} />
                  <span>View Schedule</span>
                </Button>
              </Link>
              <Link to="/doctor/reports">
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-[0.98] shadow-sm cursor-pointer">
                  <FileText size={15} />
                  <span>Review Reports ({pendingReports.length})</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={CalendarDays}
            iconBg="bg-blue-50 dark:bg-blue-950/40"
            iconColor="text-blue-600 dark:text-blue-400"
            label="Today's Schedule"
            value={todaysAppointments.length}
            sub={`${appointments.length} total scheduled`}
            to="/doctor/appointments"
          />

          <KPICard
            icon={FileText}
            iconBg="bg-amber-50 dark:bg-amber-950/40"
            iconColor="text-amber-600 dark:text-amber-400"
            label="Pending Review"
            value={pendingReports.length}
            sub="Requires doctor sign-off"
            to="/doctor/reports"
          />

          <KPICard
            icon={Activity}
            iconBg="bg-cyan-50 dark:bg-cyan-950/40"
            iconColor="text-cyan-600 dark:text-cyan-400"
            label="In Pipeline"
            value={processingConsultations.length}
            sub="AI processing active"
            to="/doctor/consultations"
          />

          <KPICard
            icon={CheckCircle2}
            iconBg="bg-emerald-50 dark:bg-emerald-950/40"
            iconColor="text-emerald-600 dark:text-emerald-400"
            label="Approved (Week)"
            value={approvedThisWeek}
            sub="Indexed to patient record"
            to="/doctor/reports"
          />
        </div>

        {/* ── Main Two-Column Hub ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Today's Schedule (7 cols) */}
          <Card className="bento-card p-6 lg:col-span-7 flex flex-col justify-between">
            <div>
              <SectionHeader
                icon={CalendarDays}
                title="Today's Schedule"
                subtitle={`${todaysAppointments.length} appointment${
                  todaysAppointments.length !== 1 ? "s" : ""
                } scheduled`}
                to="/doctor/appointments"
                linkLabel="View calendar"
              />

              {todaysAppointments.length === 0 ? (
                <div className="py-12 text-center text-text-muted">
                  <CalendarDays size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No appointments scheduled for today.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {todaysAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border-default bg-bg-base/70 hover:bg-bg-base hover:border-brand-primary/30 transition-all group"
                    >
                      <Link
                        to={`/doctor/appointments/${appt.id}`}
                        className="flex items-center gap-3 min-w-0 flex-1"
                      >
                        <div className="w-8 h-8 rounded-xl bg-brand-primary-light text-brand-primary flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                          {fmtTime(appt.scheduled_at)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-text-primary truncate group-hover:text-brand-primary transition-colors">
                            {appt.patient_name}
                          </p>
                          <p className="text-[10px] text-text-muted font-mono truncate">
                            {appt.patient_number || "Patient Record"}
                          </p>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={apptBadgeVariant(appt.status)} size="sm">
                          {appt.status.replace("_", " ")}
                        </Badge>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAppointment(e, appt.id)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light/40 transition-colors opacity-40 group-hover:opacity-100 cursor-pointer"
                          title="Delete appointment"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Pending Sign-Off Reports (5 cols) */}
          <Card className="bento-card p-6 lg:col-span-5 flex flex-col justify-between">
            <div>
              <SectionHeader
                icon={FileText}
                title="Pending Sign-Off"
                subtitle={`${pendingReports.length} report${
                  pendingReports.length !== 1 ? "s" : ""
                } awaiting review`}
                to="/doctor/reports"
                linkLabel="All reports"
              />

              {pendingReports.length === 0 ? (
                <div className="py-12 text-center text-text-muted">
                  <CheckCircle2 size={32} className="mx-auto mb-2 opacity-40 text-emerald-500" />
                  <p className="text-xs font-medium text-text-primary">All caught up!</p>
                  <p className="text-[11px] mt-0.5">No reports waiting for sign-off.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingReports.slice(0, 4).map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border-default bg-bg-base/70 hover:bg-bg-base transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <Clock size={13} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-text-primary truncate">
                            {report.patient_name}
                          </p>
                          <p className="text-[10px] text-text-muted font-mono truncate">
                            Generated{" "}
                            {new Date(report.created_at).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Link to={`/doctor/reports/${report.id}`}>
                        <Button variant="primary" size="sm" className="h-7 px-2.5 text-xs">
                          Review →
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── Active AI Processing Pipeline ── */}
        {processingConsultations.length > 0 && (
          <Card className="bento-card p-6">
            <SectionHeader
              icon={Activity}
              title="Active AI Documentation Pipeline"
              subtitle="WhisperX transcription, diarization, and LLM structuring in progress"
              to="/doctor/consultations"
              linkLabel="Pipeline monitor"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {processingConsultations.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-border-default bg-bg-base/70 hover:border-cyan-500/50 hover:bg-bg-base transition-all group relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      to={`/doctor/consultations/${c.id}`}
                      className="flex items-center gap-2 min-w-0 flex-1 hover:text-brand-primary"
                    >
                      <User size={14} className="text-text-muted" />
                      <span className="font-semibold text-xs text-text-primary truncate">
                        {c.patient_name}
                      </span>
                    </Link>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={consultBadgeVariant(c.status)} size="sm" pulse={c.status !== "FAILED"}>
                        {c.status}
                      </Badge>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteConsultation(e, c.id)}
                        className="p-1 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light/40 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                        title="Delete / dismiss consultation"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <Link to={`/doctor/consultations/${c.id}`} className="block">
                    <p className="text-[11px] text-text-secondary mb-2.5 flex items-center gap-1.5 font-medium">
                      <Clock size={12} className={c.status === "FAILED" ? "text-danger" : "text-cyan-500"} />
                      <span>{c.current_stage || (c.status === "FAILED" ? "Failed during audio pipeline" : "Processing audio...")}</span>
                    </p>

                    <div className="w-full h-1.5 bg-border-default/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full relative overflow-hidden transition-all duration-500 ${
                          c.status === "FAILED"
                            ? "bg-danger"
                            : "bg-gradient-to-r from-brand-primary to-cyan-500"
                        }`}
                        style={{ width: `${c.progress || (c.status === "FAILED" ? 100 : 25)}%` }}
                      >
                        {c.status !== "FAILED" && <div className="absolute inset-0 shimmer-bar" />}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
