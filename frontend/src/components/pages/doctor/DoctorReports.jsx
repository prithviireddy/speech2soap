import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  FileText,
  User,
} from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";

import { getDoctorReportsAPI } from "../../../api/doctor";

export const DoctorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctorReportsAPI();

      setReports(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load reports."
      );
    } finally {
      setLoading(false);
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
          <p className="text-danger">
            {error}
          </p>

          <Button
            variant="secondary"
            onClick={fetchReports}
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
            Reports
          </h1>

          <p className="text-text-secondary mt-2">
            Review and manage generated clinical reports.
          </p>
        </div>

        {/* Empty State */}
        {reports.length === 0 ? (
          <Card>
            <div className="text-center py-12">

              <FileText
                size={48}
                className="mx-auto text-text-secondary"
              />

              <h2 className="text-xl font-semibold mt-4">
                No Reports
              </h2>

              <p className="text-text-secondary mt-2">
                No clinical reports have been generated yet.
              </p>

            </div>
          </Card>
        ) : (
          <div className="space-y-4">

            {reports.map((report) => (
              <Card
                key={report.id}
                className="hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  {/* Report Information */}
                  <div className="space-y-3">

                    <div className="flex items-center gap-2">
                      <User size={18} />

                      <p className="font-display text-xl font-bold">
                        {report.patient_name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <FileText size={16} />

                      <span>
                        Generated{" "}
                        {new Date(
                          report.created_at
                        ).toLocaleString()}
                      </span>
                    </div>

                  </div>

                  {/* Status + Action */}
                  <div className="flex flex-col items-start lg:items-end gap-4">

                    <Badge
                      variant={
                        report.is_approved
                          ? "success"
                          : "warning"
                      }
                    >
                      <span className="flex items-center gap-2">

                        {report.is_approved ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Clock size={16} />
                        )}

                        {report.is_approved
                          ? "APPROVED"
                          : "REVIEW PENDING"}

                      </span>
                    </Badge>

                    <Link
                      to={`/doctor/reports/${report.id}`}
                    >
                      <Button variant="primary">
                        {report.is_approved
                          ? "View Report"
                          : "Review Report"}
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
