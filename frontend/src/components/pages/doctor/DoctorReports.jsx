import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  FileText,
  User,
  ArrowRight,
  Search,
  FileCheck2,
  AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";
import { getDoctorReportsAPI } from "../../../api/doctor";

export const DoctorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDoctorReportsAPI();
      setReports(data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesFilter =
        activeFilter === "ALL" ||
        (activeFilter === "PENDING" && !r.is_approved) ||
        (activeFilter === "APPROVED" && r.is_approved);
      const matchesSearch =
        !searchQuery ||
        r.patient_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [reports, activeFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      ALL: reports.length,
      PENDING: reports.filter((r) => !r.is_approved).length,
      APPROVED: reports.filter((r) => r.is_approved).length,
    };
  }, [reports]);

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
          <Button variant="secondary" onClick={fetchReports} className="mt-4">
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
              Clinical Reports & Documentation
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Review, edit, and officially sign off AI-extracted SOAP notes and treatment plans.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary-light text-brand-primary border border-brand-primary/20 text-xs font-semibold self-start md:self-auto">
            <FileCheck2 size={14} />
            <span>{reports.length} Total Reports</span>
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
              placeholder="Search reports by patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border-default rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all shadow-2xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "ALL", label: "All Reports" },
              { id: "PENDING", label: "Pending Sign-Off" },
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

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <Card className="bento-card text-center py-16">
            <FileText size={40} className="mx-auto text-text-muted opacity-40 mb-3" />
            <h2 className="text-base font-semibold text-text-primary">
              No Clinical Reports Found
            </h2>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
              {searchQuery || activeFilter !== "ALL"
                ? "No reports match your active filter."
                : "No clinical reports have been generated yet."}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => {
              const d = new Date(report.created_at || report.updated_at);
              const dateStr = d.toLocaleDateString([], {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <Card
                  key={report.id}
                  className={`bento-card p-5 flex flex-col justify-between group hover:border-brand-primary/40 ${
                    !report.is_approved
                      ? "border-amber-200/70 dark:border-amber-900/40 bg-gradient-to-br from-bg-secondary via-amber-50/20 dark:via-amber-950/15 to-bg-secondary"
                      : ""
                  }`}
                >
                  <div>
                    {/* Top Row: Patient Info & Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 border ${
                            report.is_approved
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50"
                          }`}
                        >
                          {report.patient_name
                            ? report.patient_name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()
                            : "PT"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate group-hover:text-brand-primary transition-colors">
                            {report.patient_name}
                          </p>
                          <p className="text-[11px] text-text-muted font-mono truncate">
                            Generated {dateStr}
                          </p>
                        </div>
                      </div>

                      <Badge variant={report.is_approved ? "success" : "warning"} size="sm">
                        {report.is_approved ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Approved
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Action Needed
                          </span>
                        )}
                      </Badge>
                    </div>

                    {/* Status hint text */}
                    <p className="text-xs text-text-secondary line-clamp-2 mb-4 bg-bg-base/70 p-3 rounded-xl border border-border-subtle">
                      {report.is_approved
                        ? "Clinical notes reviewed, verified, and saved to the patient record."
                        : "Draft AI SOAP notes awaiting physician clinical review and electronic sign-off."}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-border-subtle mt-auto">
                    <span className="text-[11px] text-text-muted font-mono">
                      Report #{report.id.slice(0, 8)}
                    </span>

                    <Link to={`/doctor/reports/${report.id}`}>
                      <Button
                        variant={report.is_approved ? "secondary" : "primary"}
                        size="sm"
                        className="h-8 px-3 text-xs gap-1.5"
                      >
                        <span>{report.is_approved ? "View Notes" : "Review Draft"}</span>
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
