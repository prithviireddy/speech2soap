import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  FileText,
  Plus,
  Stethoscope,
  Users,
} from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, LoadingSpinner } from "../../shared";
import { getAdminStatsAPI } from "../../../api/admin";

/* ── Stat tile ─────────────────────────────────────── */

const StatTile = ({ icon: Icon, label, value, color, bg, to }) => {
  const inner = (
    <div className={`stat-card rounded-xl p-6 border border-border-default bg-bg-secondary shadow-sm flex items-center gap-5 ${to ? "cursor-pointer" : ""}`}>
      <div className={`p-3.5 rounded-xl ${bg}`}>
        <Icon size={24} className={color} />
      </div>
      <div>
        <p className="text-4xl font-bold font-display leading-none">{value ?? "–"}</p>
        <p className="text-xs text-text-muted mt-1.5 font-medium uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );

  return to ? <Link to={to}>{inner}</Link> : inner;
};

/* ── Quick-link card ───────────────────────────────── */

const QuickLink = ({ icon: Icon, title, description, to, primary = false }) => (
  <Link to={to}>
    <div className={`stat-card rounded-xl p-5 border h-full flex flex-col gap-3 ${
      primary
        ? "border-brand-primary bg-brand-primary-light"
        : "border-border-default bg-bg-secondary shadow-sm"
    }`}>
      <div className={`p-2.5 rounded-lg w-fit ${primary ? "bg-brand-primary text-white" : "bg-border-subtle text-text-secondary"}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className={`font-display font-bold text-sm ${primary ? "text-brand-primary" : "text-text-primary"}`}>{title}</p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
    </div>
  </Link>
);

/* ── Main ──────────────────────────────────────────── */

export const AdminDashboard = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminStatsAPI();
      setStats(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load stats.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in-up">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope size={20} className="text-brand-primary" />
            <p className="text-sm text-text-muted font-medium">Administration</p>
          </div>
          <h1 className="text-4xl font-display font-bold">Clinic Overview</h1>
          <p className="text-text-secondary mt-1">
            System-wide metrics and quick access to management pages.
          </p>
        </div>

        {/* KPI tiles */}
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner /></div>
        ) : error ? (
          <Card>
            <p className="text-danger text-sm">{error}</p>
            <button onClick={fetchStats} className="mt-3 text-sm text-brand-primary hover:underline">
              Retry
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatTile
              icon={Stethoscope}
              label="Doctors"
              value={stats?.total_doctors}
              color="text-brand-primary"
              bg="bg-brand-primary-light"
              to="/admin/doctors"
            />
            <StatTile
              icon={Users}
              label="Patients"
              value={stats?.total_patients}
              color="text-medical"
              bg="bg-medical-light"
              to="/admin/patients"
            />
            <StatTile
              icon={CalendarDays}
              label="Appointments"
              value={stats?.total_appointments}
              color="text-info"
              bg="bg-info-light"
              to="/admin/appointments"
            />
            <StatTile
              icon={Activity}
              label="Consultations"
              value={stats?.total_consultations}
              color="text-warning"
              bg="bg-warning-light"
            />
            <StatTile
              icon={FileText}
              label="Pending Reviews"
              value={stats?.pending_reviews}
              color="text-danger"
              bg="bg-danger-light"
            />
          </div>
        )}

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-display font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickLink
              icon={Plus}
              title="New Appointment"
              description="Schedule a patient visit"
              to="/admin/appointments/new"
              primary
            />
            <QuickLink
              icon={Users}
              title="Register Patient"
              description="Add a new patient record"
              to="/admin/patients/new"
            />
            <QuickLink
              icon={Stethoscope}
              title="Add Doctor"
              description="Onboard a new physician"
              to="/admin/doctors/new"
            />
            <QuickLink
              icon={CalendarDays}
              title="View Schedule"
              description="All upcoming appointments"
              to="/admin/appointments"
            />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
