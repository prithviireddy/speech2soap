import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Clock, AlertTriangle } from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, LoadingSpinner, PipelineStageTracker } from "../../shared";

import {
  getDoctorConsultationAPI,
  getConsultationStatusAPI,
} from "../../../api/doctor";

export const ConsultationDetails = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConsultation = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDoctorConsultationAPI(consultationId);
      setConsultation(data);
      setProgress(data.progress);
      setCurrentStage(data.current_stage);
      setStatus(data.status);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to fetch consultation details.");
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  const checkStatus = useCallback(async () => {
    try {
      const data = await getConsultationStatusAPI(consultationId);
      setProgress(data.progress);
      setCurrentStage(data.current_stage);
      setStatus(data.status);

      if (data.report_id) {
        navigate(`/doctor/reports/${data.report_id}`, { replace: true });
        return true;
      }
      if (data.status === "FAILED") {
        setError("Consultation processing failed. Please try again.");
        return true;
      }
      return false;
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to fetch consultation status.");
      return true;
    }
  }, [consultationId, navigate]);

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  useEffect(() => {
    if (!consultation) return;
    if (consultation.status === "FAILED" || consultation.status === "APPROVED") return;

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
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !consultation) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-danger">{error}</p>
        </Card>
      </DashboardLayout>
    );
  }

  if (!consultation) return null;

  const isProcessing = !["FAILED", "REVIEW_PENDING", "APPROVED"].includes(status);

  const statusVariant = {
    UPLOADED: "secondary",
    TRANSCRIBING: "info",
    PROCESSING: "info",
    REVIEW_PENDING: "warning",
    APPROVED: "success",
    FAILED: "danger",
  }[status] ?? "secondary";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold">
            Consultation Processing
          </h1>
          <p className="text-text-secondary mt-2">
            Track the AI pipeline converting this consultation into structured clinical notes.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-danger-light border border-danger/20">
            <AlertTriangle size={20} className="text-danger mt-0.5 shrink-0" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Patient + status row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card variant="elevated">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-brand-primary-light text-brand-primary">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide">Patient</p>
                <p className="font-semibold text-text-primary">{consultation.patient_name}</p>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-medical-light text-medical">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide">Status</p>
                <div className="mt-1">
                  <Badge
                    variant={statusVariant}
                    pulse={isProcessing}
                  >
                    {status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Chief complaint + notes */}
        <Card>
          <h2 className="text-lg font-display font-bold mb-4">Consultation Notes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Chief Complaint</p>
              <p className="text-sm text-text-primary font-medium">
                {consultation.chief_complaint || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Doctor Notes</p>
              <p className="text-sm text-text-primary font-medium whitespace-pre-wrap">
                {consultation.doctor_notes || "Not provided"}
              </p>
            </div>
          </div>
        </Card>

        {/* AI Pipeline Stage Tracker */}
        <Card variant={status === "FAILED" ? "default" : isProcessing ? "highlight" : "default"}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-bold">AI Processing Pipeline</h2>
              <p className="text-sm text-text-secondary mt-1">
                {isProcessing
                  ? "The clinical AI is working through the pipeline stages below."
                  : status === "FAILED"
                  ? "Processing stopped due to an error."
                  : "All stages completed — report is ready for review."}
              </p>
            </div>
            <span className="text-2xl font-bold font-mono text-brand-primary">
              {progress}%
            </span>
          </div>

          {/* Overall progress bar */}
          <div className="w-full h-2 bg-border-subtle rounded-full overflow-hidden mb-8">
            <div
              className={`h-full rounded-full transition-all duration-700 relative overflow-hidden ${
                status === "FAILED" ? "bg-danger" : "bg-brand-primary"
              }`}
              style={{ width: `${progress}%` }}
            >
              {isProcessing && (
                <div className="absolute inset-0 shimmer-bar" />
              )}
            </div>
          </div>

          <PipelineStageTracker progress={progress} status={status} />
        </Card>

        {/* Guidance */}
        {isProcessing && (
          <Card variant="ghost">
            <p className="text-sm text-text-muted text-center">
              This page polls automatically every 2 seconds. You will be redirected to the report as soon as it is ready.
            </p>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
};
