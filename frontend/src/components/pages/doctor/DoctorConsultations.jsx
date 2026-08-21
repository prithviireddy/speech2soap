import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  FileText,
  User,
  AlertCircle,
  Activity,
  ArrowRight,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";
import {
  getDoctorConsultationsAPI,
  deleteDoctorConsultationAPI,
} from "../../../api/doctor";

const statusVariantMap = {
  APPROVED: "success",
  REVIEW_PENDING: "warning",
  FAILED: "danger",
  TRANSCRIBING: "info",
  PROCESSING: "info",
  UPLOADED: "secondary",
};

export const DoctorConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDoctorConsultationsAPI();
      setConsultations(data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to load consultations."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConsultation = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this consultation?")) return;
    try {
      await deleteDoctorConsultationAPI(id);
      setConsultations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to delete consultation.");
    }
  };

  const filteredConsultations = useMemo(() => {
    return consultations.filter((c) => {
      const matchesFilter =
        activeFilter === "ALL" ||
        (activeFilter === "PENDING" && c.status === "REVIEW_PENDING") ||
        (activeFilter === "ACTIVE" && ["TRANSCRIBING", "PROCESSING", "UPLOADED"].includes(c.status)) ||
        (activeFilter === "FAILED" && c.status === "FAILED") ||
        (activeFilter === "APPROVED" && c.status === "APPROVED");
      const matchesSearch =
        !searchQuery ||
        c.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.current_stage?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [consultations, activeFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      ALL: consultations.length,
      PENDING: consultations.filter((c) => c.status === "REVIEW_PENDING").length,
      ACTIVE: consultations.filter((c) => ["TRANSCRIBING", "PROCESSING", "UPLOADED"].includes(c.status)).length,
      FAILED: consultations.filter((c) => c.status === "FAILED").length,
      APPROVED: consultations.filter((c) => c.status === "APPROVED").length,
    };
  }, [consultations]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-24">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="bento-card border-danger/30 bg-danger-light/20 p-6 text-center max-w-lg mx-auto mt-12">
          <p className="text-danger text-sm font-medium">{error}</p>
          <Button variant="secondary" onClick={fetchConsultations} className="mt-4">
            Try Again
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up max-w-6xl">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">
              Clinical Consultations
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Track real-time AI audio transcription, SOAP extraction, and report sign-offs.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary-light text-brand-primary border border-brand-primary/20 text-xs font-semibold self-start md:self-auto">
            <Activity size={14} />
            <span>{consultations.length} Consultations Ingested</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search by patient name or processing stage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border-default rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all shadow-2xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "ALL", label: "All" },
              { id: "PENDING", label: "Review Pending" },
              { id: "ACTIVE", label: "Processing" },
              { id: "FAILED", label: "Failed" },
              { id: "APPROVED", label: "Approved" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-brand-primary text-white shadow-xs"
                    : "bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle border border-border-default"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-bg-surface-subtle text-text-muted"
                  }`}
                >
                  {counts[tab.id] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Consultations List */}
        {filteredConsultations.length === 0 ? (
          <Card className="bento-card text-center py-16">
            <FileText size={40} className="mx-auto text-text-muted opacity-40 mb-3" />
            <h2 className="text-base font-semibold text-text-primary">
              No Consultations Found
            </h2>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
              {searchQuery || activeFilter !== "ALL"
                ? "No consultations match your active filter."
                : "You have not recorded or uploaded any consultations yet."}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConsultations.map((consultation) => {
              const d = new Date(consultation.created_at);
              const dateStr = d.toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const isProcessing = ["TRANSCRIBING", "PROCESSING", "UPLOADED"].includes(
                consultation.status
              );

              return (
                <Card
                  key={consultation.id}
                  className="bento-card p-5 flex flex-col justify-between group hover:border-brand-primary/40"
                >
                  <div>
                    {/* Top Row: Patient Info & Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary-light text-brand-primary border border-brand-primary/20 flex items-center justify-center font-display font-bold text-sm shrink-0">
                          {consultation.patient_name
                            ? consultation.patient_name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()
                            : "PT"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate group-hover:text-brand-primary transition-colors">
                            {consultation.patient_name}
                          </p>
                          <p className="text-[11px] text-text-muted font-mono truncate">
                            {dateStr}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={statusVariantMap[consultation.status] || "secondary"}
                          size="sm"
                        >
                          {consultation.status.replace("_", " ")}
                        </Badge>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteConsultation(e, consultation.id)}
                          className="p-1 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light/40 transition-colors opacity-40 group-hover:opacity-100 cursor-pointer"
                          title="Delete consultation"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Stage & Progress Bar */}
                    <div className="bg-bg-base/70 p-3 rounded-xl border border-border-subtle mb-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text-secondary flex items-center gap-1.5">
                          {isProcessing ? (
                            <Sparkles size={13} className="text-cyan-500 animate-spin" />
                          ) : (
                            <Activity size={13} className={consultation.status === "FAILED" ? "text-danger" : "text-brand-primary"} />
                          )}
                          Stage: {consultation.current_stage || (consultation.status === "FAILED" ? "Failed" : "Intake")}
                        </span>
                        <span className="font-mono font-bold text-text-primary">
                          {consultation.progress || 0}%
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-border-default/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            consultation.status === "APPROVED"
                              ? "bg-emerald-500"
                              : consultation.status === "REVIEW_PENDING"
                              ? "bg-amber-500"
                              : consultation.status === "FAILED"
                              ? "bg-danger"
                              : "bg-brand-primary shimmer-bar"
                          }`}
                          style={{ width: `${consultation.status === "FAILED" ? 100 : consultation.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-border-subtle mt-auto">
                    <span className="text-[11px] text-text-muted">
                      {consultation.status === "APPROVED"
                        ? "Report signed off & indexed"
                        : consultation.status === "REVIEW_PENDING"
                        ? "Awaiting doctor sign-off"
                        : consultation.status === "FAILED"
                        ? "Pipeline execution failed"
                        : "Processing audio pipeline"}
                    </span>

                    <Link to={`/doctor/consultations/${consultation.id}`}>
                      <Button variant="primary" size="sm" className="h-8 px-3 text-xs gap-1.5">
                        <span>View Details</span>
                        <ArrowRight size={13} />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
