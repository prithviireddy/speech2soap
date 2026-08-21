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
} from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";
import { getDoctorPatientHistoryAPI } from "../../../api/doctor";
import { PatientRAGAssistant } from "./PatientRAGAssistant";

/* ── Helpers ─────────────────────────────────────────── */

const statusVariant = {
  UPLOADED:       "secondary",
  TRANSCRIBING:   "info",
  PROCESSING:     "info",
  REVIEW_PENDING: "warning",
  APPROVED:       "success",
  FAILED:         "danger",
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString([], {
    year: "numeric", month: "long", day: "numeric",
  });

/* ── Tab nav ─────────────────────────────────────────── */

const TABS = [
  { key: "timeline",  label: "Timeline",     icon: Clock },
  { key: "assistant", label: "AI Assistant", icon: Brain },
];

/* ── Main component ──────────────────────────────────── */

export const DoctorPatientHistory = () => {
  const { patientId } = useParams();

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("timeline");

  useEffect(() => { fetchHistory(); }, [patientId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDoctorPatientHistoryAPI(patientId);
      setHistory(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load patient history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-danger text-sm">{error}</p>
          <Button variant="secondary" onClick={fetchHistory} className="mt-4">Try Again</Button>
        </Card>
      </DashboardLayout>
    );
  }

  if (!history) return null;

  const consultations = history.consultations ?? [];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">

        {/* Back */}
        <Link
          to="/doctor/appointments"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-primary transition-colors"
        >
          <ArrowLeft size={16} /> Back to Appointments
        </Link>

        {/* Patient header */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-brand-primary-light text-brand-primary">
            <User size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold">{history.patient_name}</h1>
            <p className="text-text-muted text-sm mt-1 font-mono">{history.patient_number}</p>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4">
          <Card variant="elevated">
            <p className="text-xs text-text-muted uppercase tracking-wide">Total Consultations</p>
            <p className="text-2xl font-bold font-display mt-1">{consultations.length}</p>
          </Card>
          <Card variant="elevated">
            <p className="text-xs text-text-muted uppercase tracking-wide">Reports Approved</p>
            <p className="text-2xl font-bold font-display mt-1 text-success">
              {consultations.filter((c) => c.report_approved).length}
            </p>
          </Card>
          <Card variant="elevated">
            <p className="text-xs text-text-muted uppercase tracking-wide">Pending Review</p>
            <p className="text-2xl font-bold font-display mt-1 text-warning">
              {consultations.filter((c) => c.status === "REVIEW_PENDING").length}
            </p>
          </Card>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 p-1 bg-bg-base rounded-xl border border-border-default w-fit">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key
                  ? "bg-bg-secondary shadow-sm text-brand-primary border border-border-default"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon size={15} />
              {label}
              {key === "assistant" && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-brand-primary text-white font-mono leading-none">
                  AI
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Timeline tab ── */}
        {tab === "timeline" && (
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Clock size={18} className="text-text-secondary" />
              <h2 className="text-lg font-display font-bold">Consultation History</h2>
            </div>

            {consultations.length === 0 ? (
              <div className="py-12 text-center">
                <FileText size={40} className="mx-auto text-border-strong mb-3" />
                <p className="text-sm text-text-muted">No consultations on record for this patient.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-[9px] top-3 bottom-3 w-px bg-border-default" />

                <div className="space-y-6">
                  {consultations.map((c) => (
                    <div key={c.consultation_id} className="flex gap-5">
                      {/* Timeline dot */}
                      <div className="relative z-10 mt-1 flex-shrink-0">
                        {c.report_approved ? (
                          <CheckCircle2 size={20} className="text-success" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-brand-primary bg-bg-secondary" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <CalendarDays size={13} className="text-text-muted" />
                              <span className="text-xs text-text-muted">{fmtDate(c.consultation_date)}</span>
                            </div>
                            <p className="font-semibold text-sm">
                              {c.chief_complaint || "No chief complaint recorded"}
                            </p>
                            {c.doctor_notes && (
                              <p className="text-xs text-text-secondary mt-1 whitespace-pre-wrap">
                                {c.doctor_notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant={statusVariant[c.status] ?? "secondary"} size="sm">
                              {c.status.replace("_", " ")}
                            </Badge>
                            {c.report_id && c.report_approved && (
                              <Link to={`/doctor/reports/${c.report_id}`}>
                                <Button variant="primary" className="text-xs py-1 px-3 h-auto">
                                  View Report →
                                </Button>
                              </Link>
                            )}
                            {c.report_id && !c.report_approved && (
                              <Link to={`/doctor/reports/${c.report_id}`}>
                                <Button variant="secondary" className="text-xs py-1 px-3 h-auto">
                                  Review →
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* ── AI Assistant tab ── */}
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
