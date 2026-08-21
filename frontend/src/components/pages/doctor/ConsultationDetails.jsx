import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  User,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Activity,
  Sparkles,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner, PipelineStageTracker } from "../../shared";

import {
  getDoctorConsultationAPI,
  getConsultationStatusAPI,
  deleteDoctorConsultationAPI,
} from "../../../api/doctor";

const statusVariantMap = {
  UPLOADED: "secondary",
  TRANSCRIBING: "info",
  PROCESSING: "info",
  REVIEW_PENDING: "warning",
  APPROVED: "success",
  FAILED: "danger",
};

export const ConsultationDetails = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchConsultation = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDoctorConsultationAPI(consultationId);
      setConsultation(data);
      setProgress(data.progress || 0);
      setCurrentStage(data.current_stage || "Intake");
      setStatus(data.status);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to fetch consultation details."
      );
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  const checkStatus = useCallback(async () => {
    try {
      const data = await getConsultationStatusAPI(consultationId);
      setProgress(data.progress || 0);
      setCurrentStage(data.current_stage || "Processing");
      setStatus(data.status);

      if (data.report_id) {
        navigate(`/doctor/reports/${data.report_id}`, { replace: true });
        return true;
      }
      if (data.status === "FAILED") {
        setError("Consultation processing failed. You can delete or retry this record.");
        return true;
      }
      return false;
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to fetch consultation status."
      );
      return true;
    }
  }, [consultationId, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this consultation? This action cannot be undone.")) return;
    try {
      setDeleting(true);
      await deleteDoctorConsultationAPI(consultationId);
      navigate("/doctor/consultations");
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to delete consultation.");
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  useEffect(() => {
    if (!consultation) return;
    if (consultation.status === "FAILED" || consultation.status === "APPROVED")
      return;

    let intervalId;
    const poll = async () => {
      const shouldStop = await checkStatus();
      if (shouldStop && intervalId) clearInterval(intervalId);
    };

    poll();
    intervalId = setInterval(poll, 2000);
    return () => clearInterval(intervalId);
  }, [consultation, checkStatus]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-24">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !consultation) {
    return (
      <DashboardLayout>
        <Card className="bento-card border-danger/30 bg-danger-light/20 p-6 text-center max-w-lg mx-auto mt-12">
          <p className="text-danger text-sm font-medium">{error}</p>
          <Button variant="secondary" onClick={fetchConsultation} className="mt-4">
            Try Again
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  if (!consultation) return null;

  const isProcessing = ["UPLOADED", "TRANSCRIBING", "PROCESSING"].includes(status);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        {/* Back Link & Header Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/doctor/consultations"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Consultations</span>
          </Link>

          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-1.5 text-xs"
          >
            <Trash2 size={13} />
            <span>{deleting ? "Deleting..." : "Delete Consultation"}</span>
          </Button>
        </div>

        {/* Top Header Card */}
        <Card className="bento-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white shadow-md shadow-brand-primary/25 flex items-center justify-center font-display font-bold text-xl shrink-0">
                {consultation.patient_name
                  ? consultation.patient_name
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
                    {consultation.patient_name}
                  </h1>
                  <Badge variant={statusVariantMap[status] || "secondary"} size="sm">
                    {status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Consultation ID: <span className="font-mono">{consultation.id.slice(0, 8)}</span>
                </p>
              </div>
            </div>

            {consultation.report_id && (
              <Link to={`/doctor/reports/${consultation.report_id}`}>
                <Button variant="primary" size="sm" className="gap-1.5 text-xs shadow-md shadow-brand-primary/20">
                  <span>View Generated Report</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Error / Failed Banner with Delete action */}
        {error && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-danger-light/60 border border-danger/30 text-danger text-xs font-medium">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs h-7 px-2.5"
            >
              Delete Record
            </Button>
          </div>
        )}

        {/* Pipeline Progress Card */}
        <Card className="bento-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-primary">
              <Activity size={18} />
              <h2 className="text-sm font-display font-bold text-text-primary">
                AI Synthesis Pipeline
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-brand-primary bg-brand-primary-light px-2.5 py-1 rounded-lg">
              {progress}% Completed
            </span>
          </div>

          <div className="w-full h-2.5 bg-border-default/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${
                status === "APPROVED"
                  ? "bg-emerald-500"
                  : status === "REVIEW_PENDING"
                  ? "bg-amber-500"
                  : status === "FAILED"
                  ? "bg-danger"
                  : "bg-brand-primary"
              }`}
              style={{ width: `${status === "FAILED" ? 100 : Math.max(progress, 4)}%` }}
            >
              {status !== "FAILED" && (
                <div className="absolute inset-0 shimmer-bar pointer-events-none" />
              )}
            </div>
          </div>

          {/* Interactive Pipeline Stage Tracker */}
          <div className="pt-2">
            <PipelineStageTracker
              progress={progress}
              currentStage={currentStage}
              status={status}
            />
          </div>
        </Card>

        {/* Clinical Summary & Audio Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bento-card p-5 space-y-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Chief Complaint
            </span>
            <p className="text-sm font-medium text-text-primary">
              {consultation.chief_complaint || "Routine Clinical Intake"}
            </p>
          </Card>

          <Card className="bento-card p-5 space-y-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Consultation Date
            </span>
            <p className="text-sm font-medium text-text-primary">
              {new Date(consultation.created_at).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
