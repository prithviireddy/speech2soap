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
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";
import { DashboardLayout } from "../../layouts/DashboardLayout";

import {
  listDoctorAppointmentsAPI,
  getDoctorConsultationsAPI,
  getDoctorReportsAPI,
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
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" });

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatDoctorName = (name) => {
  if (!name) return "Doctor";
  const trimmed = name.trim();
  if (/^dr\.?\s+/i.test(trimmed)) {
    return trimmed;
  }
  return `Dr. ${trimmed}`;
};

const todayLabel = () =>
  new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

/* ── Status styling maps ───────────────────────────── */

const apptBadgeVariant = (s) =>
  ({
    SCHEDULED: "info",
    CHECKED_IN: "warning",
    IN_PROGRESS: "warning",
    COMPLETED: "success",
    CANCELLED: "danger",
    NO_SHOW: "danger",
  }[s] ?? "secondary");

const consultBadgeVariant = (s) =>
  ({
    UPLOADED: "secondary",
    TRANSCRIBING: "info",
    PROCESSING: "info",
    REVIEW_PENDING: "warning",
    APPROVED: "success",
    FAILED: "danger",
  }[s] ?? "secondary");

/* ── Bento KPI Tile ────────────────────────────────── */

const StatTile = ({
  icon: Icon,
  label,
  value,
  color,
  bg,
  border,
  trend,
  trendVariant = "default",
}) => {
  const trendClasses =
    {
      warning:
        "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
      default:
        "bg-slate-100/90 text-slate-600 border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60",
    }[trendVariant] ||
    "bg-slate-100/90 text-slate-600 border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60";

  return (
    <div className="bento-card p-5 flex flex-col justify-between group hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3.5">
        <div
          className={`p-2.5 rounded-xl ${bg} ${border} border shadow-2xs group-hover:scale-105 transition-transform`}
        >
          <Icon size={20} className={color} />
        </div>
        {trend && (
          <span
            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border font-sans ${trendClasses}`}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold font-display tracking-tight text-text-primary">
          {value}
        </p>
        <p className="text-xs text-text-secondary mt-1 font-medium">{label}</p>
      </div>
    </div>
  );
};

/* ── Section Header ────────────────────────────────── */

const SectionHeader = ({ title, subtitle, icon: Icon, to, linkLabel }) => (
  <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-subtle">
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded-lg bg-brand-primary-light text-brand-primary">
        <Icon size={16} />
      </div>
      <div>
        <h2 className="text-sm font-display font-bold text-text-primary">{title}</h2>
        {subtitle && <p className="text-[11px] text-text-muted">{subtitle}</p>}
      </div>
    </div>
    {to && (
      <Link
        to={to}
        className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 transition-colors"
      >
        <span>{linkLabel ?? "View all"}</span>
        <ArrowUpRight size={13} />
      </Link>
    )}
  </div>
);

/* ── Main Doctor Dashboard ─────────────────────────── */

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
      const [appts, consults, reps] = await Promise.all([
        listDoctorAppointmentsAPI(),
        getDoctorConsultationsAPI(),
        getDoctorReportsAPI(),
      ]);
      setAppointments(appts || []);
      setConsultations(consults || []);
      setReports(reps || []);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
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
        ["UPLOADED", "TRANSCRIBING", "PROCESSING"].includes(c.status)
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
            {greeting()}, {formatDoctorName(user?.name || user?.full_name)}
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
                {greeting()}, {formatDoctorName(user?.name || user?.full_name)}
              </h1>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                You have <span className="text-white font-semibold">{todaysAppointments.length} appointments</span> scheduled for today and <span className="text-amber-300 font-semibold">{pendingReports.length} reports</span> pending clinical review.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/doctor/consultations/upload">
                <Button
                  variant="primary"
                  className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md shadow-brand-primary/30 border border-brand-primary/20"
                >
                  <UploadCloud size={16} />
                  <span>Upload Audio</span>
                </Button>
              </Link>
              <Link to="/doctor/reports">
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-[0.98] shadow-sm cursor-pointer">
                  <FileText size={16} />
                  <span>Review Reports ({pendingReports.length})</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bento KPI Tiles ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            icon={CalendarDays}
            label="Today's Appointments"
            value={todaysAppointments.length}
            color="text-blue-600 dark:text-blue-400"
            bg="bg-blue-50/90 dark:bg-blue-950/40"
            border="border-blue-200/80 dark:border-blue-800/50"
            trend="Today"
            trendVariant="default"
          />
          <StatTile
            icon={FileText}
            label="Pending Reviews"
            value={pendingReports.length}
            color="text-amber-600 dark:text-amber-400"
            bg="bg-amber-50/90 dark:bg-amber-950/40"
            border="border-amber-200/80 dark:border-amber-800/50"
            trend={pendingReports.length > 0 ? "Action needed" : "All clear"}
            trendVariant={pendingReports.length > 0 ? "warning" : "default"}
          />
          <StatTile
            icon={Activity}
            label="Active AI Pipeline"
            value={processingConsultations.length}
            color="text-sky-600 dark:text-sky-400"
            bg="bg-sky-50/90 dark:bg-sky-950/40"
            border="border-sky-200/80 dark:border-sky-800/50"
            trend="Real-time"
            trendVariant="default"
          />
          <StatTile
            icon={CheckCircle2}
            label="Approved This Week"
            value={approvedThisWeek}
            color="text-emerald-600 dark:text-emerald-400"
            bg="bg-emerald-50/90 dark:bg-emerald-950/40"
            border="border-emerald-200/80 dark:border-emerald-800/50"
            trend="Last 7 days"
            trendVariant="default"
          />
        </div>

        {/* ── Two-Column Bento Workspace ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule Card */}
          <Card className="bento-card p-6">
            <SectionHeader
              icon={CalendarDays}
              title="Today's Schedule"
              subtitle={`${todaysAppointments.length} patient${
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
                  <Link
                    key={appt.id}
                    to={`/doctor/appointments/${appt.id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border-default bg-bg-base hover:bg-white hover:border-brand-primary/30 hover:shadow-xs transition-all">
                      <div className="flex items-center gap-3 min-w-0">
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
                      </div>
                      <Badge variant={apptBadgeVariant(appt.status)} size="sm">
                        {appt.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Pending Reviews Card */}
          <Card className="bento-card p-6">
            <SectionHeader
              icon={FileText}
              title="Pending Report Approvals"
              subtitle="Draft AI clinical reports awaiting physician sign-off"
              to="/doctor/reports"
              linkLabel="View all"
            />

            {pendingReports.length === 0 ? (
              <div className="py-12 text-center text-text-muted">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500 opacity-80" />
                <p className="text-xs font-medium text-text-primary">
                  All clinical reports approved!
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Great work. No draft reports are currently pending your review.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingReports.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/25 hover:bg-amber-50/80 dark:hover:bg-amber-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                        <FileText size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">
                          {report.patient_name}
                        </p>
                        <p className="text-[10px] text-text-muted">
                          Generated {fmtDate(report.created_at || report.updated_at)}
                        </p>
                      </div>
                    </div>
                    <Link to={`/doctor/reports/${report.id}`}>
                      <Button variant="primary" size="sm" className="h-8 px-3 text-xs">
                        Review →
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ── Active AI Processing Pipeline ── */}
        {processingConsultations.length > 0 && (
          <Card className="bento-card p-6 border-cyan-200/60 bg-cyan-50/20">
            <SectionHeader
              icon={Activity}
              title="Active AI Documentation Pipeline"
              subtitle="WhisperX transcription, diarization, and LLM structuring in progress"
              to="/doctor/consultations"
              linkLabel="Pipeline monitor"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {processingConsultations.map((c) => (
                <Link
                  key={c.id}
                  to={`/doctor/consultations/${c.id}`}
                  className="block p-4 rounded-xl bg-white border border-border-default hover:border-cyan-400 hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-text-muted" />
                      <span className="font-semibold text-xs text-text-primary">
                        {c.patient_name}
                      </span>
                    </div>
                    <Badge variant={consultBadgeVariant(c.status)} size="sm" pulse>
                      {c.status}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-secondary mb-2 flex items-center gap-1.5 font-medium">
                    <Clock size={12} className="text-cyan-600" />
                    <span>{c.current_stage || "Processing audio recording..."}</span>
                  </p>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-cyan-500 rounded-full relative overflow-hidden transition-all duration-500"
                      style={{ width: `${c.progress || 25}%` }}
                    >
                      <div className="absolute inset-0 shimmer-bar" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
