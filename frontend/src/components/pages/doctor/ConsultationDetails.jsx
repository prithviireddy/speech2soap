import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, FileText, User } from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, LoadingSpinner } from "../../shared";

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

      const data = await getDoctorConsultationAPI(
        consultationId
      );

      setConsultation(data);
      setProgress(data.progress);
      setCurrentStage(data.current_stage);
      setStatus(data.status);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to fetch consultation details."
      );
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  const checkStatus = useCallback(async () => {
    try {
      const data = await getConsultationStatusAPI(
        consultationId
      );

      setProgress(data.progress);
      setCurrentStage(data.current_stage);
      setStatus(data.status);

      if (data.report_id) {
        navigate(
          `/doctor/reports/${data.report_id}`,
          { replace: true }
        );

        return true;
      }

      if (data.status === "FAILED") {
        setError(
          "Consultation processing failed."
        );

        return true;
      }

      return false;
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to fetch consultation status."
      );

      return true;
    }
  }, [consultationId, navigate]);

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  useEffect(() => {
    if (!consultation) {
      return;
    }

    if (
      consultation.status === "FAILED" ||
      consultation.status === "APPROVED"
    ) {
      return;
    }

    let intervalId;

    const poll = async () => {
      const shouldStop = await checkStatus();

      if (shouldStop && intervalId) {
        clearInterval(intervalId);
      }
    };

    poll();

    intervalId = setInterval(poll, 1000);

    return () => {
      clearInterval(intervalId);
    };
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
          <p className="text-danger">
            {error}
          </p>
        </Card>
      </DashboardLayout>
    );
  }

  if (!consultation) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold">
            Consultation Details
          </h1>

          <p className="text-text-secondary mt-2">
            Monitor the AI processing of this consultation.
          </p>
        </div>

        {/* Error */}
        {error && (
          <Card>
            <p className="text-danger text-sm">
              {error}
            </p>
          </Card>
        )}

        {/* Patient */}
        <Card>
          <div className="flex items-center gap-3">
            <User size={22} />

            <div>
              <p className="text-sm text-text-secondary">
                Patient
              </p>

              <p className="text-xl font-semibold">
                {consultation.patient_name}
              </p>
            </div>
          </div>
        </Card>

        {/* Consultation Information */}
        <Card>
          <h2 className="text-xl font-display font-bold mb-6">
            Consultation Information
          </h2>

          <div className="space-y-6">

            {/* Chief Complaint */}
            <div>
              <p className="text-sm text-text-secondary mb-1">
                Chief Complaint
              </p>

              <p className="font-medium">
                {consultation.chief_complaint ||
                  "No chief complaint provided."}
              </p>
            </div>

            {/* Doctor Notes */}
            <div>
              <p className="text-sm text-text-secondary mb-1">
                Doctor Notes
              </p>

              <p className="font-medium whitespace-pre-wrap">
                {consultation.doctor_notes ||
                  "No doctor notes provided."}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-text-secondary mb-2">
                Status
              </p>

              <Badge variant="info">
                {status}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Processing */}
        <Card>
          <h2 className="text-xl font-display font-bold mb-6">
            Processing
          </h2>

          <div className="space-y-6">

            {/* Progress Header */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">
                  Processing Progress
                </p>

                <p className="font-bold text-brand-primary">
                  {progress}%
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-border-default rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {/* Current Stage */}
            <div className="flex items-center gap-3">
              {status === "FAILED" ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="text-danger font-bold">
                    !
                  </span>
                </div>
              ) : progress === 100 ? (
                <CheckCircle2
                  size={28}
                  className="text-success"
                />
              ) : (
                <LoadingSpinner size="sm" />
              )}

              <div>
                <p className="text-sm text-text-secondary">
                  Current Stage
                </p>

                <p className="font-semibold">
                  {currentStage || "Waiting..."}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Processing Information */}
        {status !== "FAILED" && progress < 100 && (
          <Card>
            <div className="flex items-start gap-3">
              <FileText
                size={22}
                className="mt-1"
              />

              <div>
                <h2 className="font-semibold">
                  Report is being generated
                </h2>

                <p className="text-sm text-text-secondary mt-1">
                  This page will automatically open the
                  generated report when processing is complete.
                </p>
              </div>
            </div>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
};
