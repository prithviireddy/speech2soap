import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  FileText,
  User,
  AlertCircle,
} from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";

import { getDoctorConsultationsAPI } from "../../../api/doctor";

export const DoctorConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctorConsultationsAPI();

      setConsultations(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load consultations."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";

      case "REVIEW_PENDING":
        return "warning";

      case "FAILED":
        return "danger";

      case "TRANSCRIBING":
      case "PROCESSING":
        return "info";

      case "UPLOADED":
        return "secondary";

      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 size={18} />;

      case "FAILED":
        return <AlertCircle size={18} />;

      case "REVIEW_PENDING":
        return <FileText size={18} />;

      default:
        return <Clock size={18} />;
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
        <Card>
          <p className="text-danger">{error}</p>

          <Button
            variant="secondary"
            onClick={fetchConsultations}
            className="mt-4"
          >
            Try Again
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold">
            Consultations
          </h1>

          <p className="text-text-secondary mt-2">
            View and monitor your consultation history.
          </p>
        </div>

        {/* Empty State */}
        {consultations.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FileText
                size={48}
                className="mx-auto text-text-secondary"
              />

              <h2 className="text-xl font-semibold mt-4">
                No Consultations
              </h2>

              <p className="text-text-secondary mt-2">
                You have not created any consultations yet.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card
                key={consultation.id}
                className="hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  {/* Consultation Information */}
                  <div className="space-y-4">

                    <div className="flex items-center gap-2">
                      <User size={18} />

                      <p className="font-display text-xl font-bold">
                        {consultation.patient_name}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">

                      <span>
                        {new Date(
                          consultation.created_at
                        ).toLocaleString()}
                      </span>

                      <span>
                        {consultation.current_stage}
                      </span>

                    </div>

                    {/* Progress */}
                    <div className="w-full lg:w-96">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Progress
                        </span>

                        <span className="text-sm font-semibold">
                          {consultation.progress}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-border-default rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-primary transition-all duration-300"
                          style={{
                            width: `${consultation.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Status + Action */}
                  <div className="flex flex-col items-start lg:items-end gap-4">

                    <Badge
                      variant={getStatusVariant(
                        consultation.status
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {getStatusIcon(
                          consultation.status
                        )}

                        {consultation.status}
                      </span>
                    </Badge>

                    <Link
                      to={`/doctor/consultations/${consultation.id}`}
                    >
                      <Button variant="primary">
                        View Details
                      </Button>
                    </Link>

                  </div>

                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
