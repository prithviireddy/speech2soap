import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  User,
  Activity,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";
import { getDoctorPatientHistoryAPI } from "../../../api/doctor";
import { PatientRAGAssistant } from "./PatientRAGAssistant";

/* ── Status badge variant helper ─────────────────────── */
const statusVariant = {
  UPLOADED: "secondary",
  TRANSCRIBING: "info",
  PROCESSING: "info",
  REVIEW_PENDING: "warning",
  APPROVED: "success",
  FAILED: "danger",
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/* ── Tab navigation items ────────────────────────────── */
const TABS = [
  { key: "timeline", label: "Consultation Timeline", icon: Clock },
  { key: "assistant", label: "Grounded AI Assistant", icon: Brain },
];

export const DoctorPatientHistory = () => {
  const { patientId } = useParams();

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("timeline");

  useEffect(() => {
    fetchHistory();
  }, [patientId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDoctorPatientHistoryAPI(patientId);
      setHistory(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to load patient history."
      );
    } finally {
      setLoading(false);
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

  if (error || !history) {
    return (
      <DashboardLayout>
        <Card className="bento-card border-danger/30 bg-danger-light/20 p-6 text-center max-w-lg mx-auto mt-12">
          <p className="text-danger text-sm font-medium">
            {error || "Patient not found."}
          </p>
          <Button variant="secondary" onClick={fetchHistory} className="mt-4">
            Try Again
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const consultations = history.consultations ?? [];
  const approvedCount = consultations.filter((c) => c.report_approved).length;
  const pendingCount = consultations.filter(
    (c) => c.status === "REVIEW_PENDING"
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up max-w-5xl">
        {/* Back Link */}
        <Link
          to="/doctor/appointments"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Appointments</span>
        </Link>

        {/* Patient Profile Header Card */}
        <Card className="bento-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white shadow-md shadow-brand-primary/25 flex items-center justify-center font-display font-bold text-xl shrink-0">
                {history.patient_name
                  ? history.patient_name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "PT"}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-display font-bold text-text-primary">
                    {history.patient_name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-bg-base border border-border-default text-xs font-mono text-text-muted">
                    {history.patient_number || "PATIENT RECORD"}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Longitudinal clinical record, consultation transcripts, and grounded AI assistant.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary Stat Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bento-card p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">
                Total Consultations
              </p>
              <p className="text-2xl font-bold font-display text-text-primary mt-0.5">
                {consultations.length}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Activity size={18} />
            </div>
          </Card>

          <Card className="bento-card p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">
                Reports Approved
              </p>
              <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-0.5">
                {approvedCount}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
          </Card>

          <Card className="bento-card p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">
                Pending Sign-Off
              </p>
              <p className="text-2xl font-bold font-display text-amber-600 dark:text-amber-400 mt-0.5">
                {pendingCount}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Clock size={18} />
            </div>
          </Card>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex gap-1.5 p-1 bg-bg-secondary rounded-2xl border border-border-default w-fit shadow-2xs">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                tab === key
                  ? "bg-brand-primary text-white shadow-xs"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle"
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
              {key === "assistant" && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    tab === key ? "bg-white/20 text-white" : "bg-brand-primary-light text-brand-primary"
                  }`}
                >
                  RAG
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Timeline Tab ── */}
        {tab === "timeline" && (
          <div className="space-y-4">
            {consultations.length === 0 ? (
              <Card className="bento-card text-center py-16">
                <FileText size={40} className="mx-auto text-text-muted opacity-40 mb-3" />
                <h2 className="text-base font-semibold text-text-primary">
                  No Consultation History
                </h2>
                <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                  No previous consultation records found for this patient.
                </p>
              </Card>
            ) : (
              <div className="relative">
                {/* Vertical Timeline Guide Line */}
                <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-500 via-brand-primary to-border-default pointer-events-none" />

                <div className="space-y-4">
                  {consultations.map((c) => (
                    <div key={c.consultation_id} className="relative flex items-start gap-3.5 sm:gap-4 group">
                      {/* Dot Anchor Centered on Line */}
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full border-2 bg-bg-secondary flex items-center justify-center shrink-0 mt-3.5 shadow-xs transition-transform group-hover:scale-110 ${
                          c.report_approved
                            ? "border-emerald-500 text-emerald-500"
                            : "border-brand-primary text-brand-primary"
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            c.report_approved ? "bg-emerald-500" : "bg-brand-primary"
                          }`}
                        />
                      </div>

                      {/* Consultation Card */}
                      <Card className="bento-card p-5 hover:border-brand-primary/40 flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-text-primary bg-bg-base px-2.5 py-1 rounded-lg border border-border-subtle">
                                <CalendarDays size={13} className="text-brand-primary" />
                                {fmtDate(c.consultation_date)}
                              </span>
                              <Badge variant={statusVariant[c.status] ?? "secondary"} size="sm">
                                {c.status.replace("_", " ")}
                              </Badge>
                            </div>

                            <p className="text-sm font-semibold text-text-primary">
                              {c.chief_complaint || "Routine Clinical Consultation"}
                            </p>

                            {c.doctor_notes && (
                              <p className="text-xs text-text-secondary leading-relaxed bg-bg-base/60 p-3 rounded-xl border border-border-subtle whitespace-pre-wrap">
                                {c.doctor_notes}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            {c.report_id && (
                              <Link to={`/doctor/reports/${c.report_id}`}>
                                <Button
                                  variant={c.report_approved ? "secondary" : "primary"}
                                  size="sm"
                                  className="h-8 px-3 text-xs gap-1"
                                >
                                  <span>{c.report_approved ? "View Notes" : "Review Draft"}</span>
                                  <ArrowRight size={13} />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Grounded AI Assistant Tab ── */}
        {tab === "assistant" && (
          <PatientRAGAssistant
            patientId={patientId}
            patientName={history.patient_name}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
