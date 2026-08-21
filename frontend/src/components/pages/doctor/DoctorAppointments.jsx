import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";
import {
  CalendarDays,
  Clock,
  User,
  ArrowRight,
  Filter,
  CalendarCheck,
  Search,
  Trash2,
} from "lucide-react";
import {
  listDoctorAppointmentsAPI,
  deleteDoctorAppointmentAPI,
} from "../../../api/doctor";

const statusVariantMap = {
  SCHEDULED: "info",
  CHECKED_IN: "warning",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
  NO_SHOW: "danger",
};

export const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await listDoctorAppointmentsAPI();
      setAppointments(data || []);
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await deleteDoctorAppointmentAPI(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to delete appointment.");
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesFilter =
        activeFilter === "ALL" || appt.status === activeFilter;
      const matchesSearch =
        !searchQuery ||
        appt.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.patient_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.reason?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [appointments, activeFilter, searchQuery]);

  const counts = useMemo(() => {
    const map = { ALL: appointments.length };
    for (const a of appointments) {
      map[a.status] = (map[a.status] || 0) + 1;
    }
    return map;
  }, [appointments]);

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
          <Button variant="secondary" onClick={fetchAppointments} className="mt-4">
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
              Clinical Appointments
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage scheduled patient consultations, clinical intake, and audio sessions.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary-light text-brand-primary border border-brand-primary/20 text-xs font-semibold self-start md:self-auto">
            <CalendarCheck size={14} />
            <span>{appointments.length} Total Scheduled</span>
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
              placeholder="Search by patient name, record number, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border-default rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all shadow-2xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {["ALL", "SCHEDULED", "CHECKED_IN", "COMPLETED"].map((st) => (
              <button
                key={st}
                onClick={() => setActiveFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeFilter === st
                    ? "bg-brand-primary text-white shadow-xs"
                    : "bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle border border-border-default"
                }`}
              >
                {st.replace("_", " ")}
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeFilter === st
                      ? "bg-white/20 text-white"
                      : "bg-bg-surface-subtle text-text-muted"
                  }`}
                >
                  {counts[st] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card className="bento-card text-center py-16">
            <CalendarDays size={40} className="mx-auto text-text-muted opacity-40 mb-3" />
            <h2 className="text-base font-semibold text-text-primary">
              No Appointments Found
            </h2>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
              {searchQuery || activeFilter !== "ALL"
                ? "No appointments match your active filter or search query."
                : "You currently have no scheduled appointments on record."}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map((appointment) => {
              const d = new Date(appointment.scheduled_at);
              const dateStr = d.toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const timeStr = d.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              });

              return (
                <Card
                  key={appointment.id}
                  className="bento-card p-5 flex flex-col justify-between group hover:border-brand-primary/40"
                >
                  <div>
                    {/* Top Row: Patient Info & Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary-light text-brand-primary border border-brand-primary/20 flex items-center justify-center font-display font-bold text-sm shrink-0">
                          {appointment.patient_name
                            ? appointment.patient_name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()
                            : "PT"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate group-hover:text-brand-primary transition-colors">
                            {appointment.patient_name}
                          </p>
                          <p className="text-[11px] text-text-muted font-mono truncate">
                            {appointment.patient_number || "Patient Record"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={statusVariantMap[appointment.status] || "secondary"}
                          size="sm"
                        >
                          {appointment.status.replace("_", " ")}
                        </Badge>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAppointment(e, appointment.id)}
                          className="p-1 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light/40 transition-colors opacity-40 group-hover:opacity-100 cursor-pointer"
                          title="Delete appointment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Schedule Time Pill */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-base border border-border-subtle text-xs text-text-secondary font-medium">
                        <CalendarDays size={13} className="text-brand-primary" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-base border border-border-subtle text-xs text-text-secondary font-medium">
                        <Clock size={13} className="text-text-muted" />
                        <span>{timeStr}</span>
                        <span className="text-text-muted font-mono text-[10px]">
                          ({appointment.duration_minutes || 30}m)
                        </span>
                      </div>
                    </div>

                    {/* Reason */}
                    {appointment.reason && (
                      <p className="text-xs text-text-secondary line-clamp-2 mb-4 bg-bg-base/60 p-2.5 rounded-xl border border-border-subtle">
                        <span className="font-semibold text-text-primary">Reason: </span>
                        {appointment.reason}
                      </p>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-border-subtle mt-auto">
                    <Link
                      to={`/doctor/patients/${appointment.patient_id}/history`}
                      className="text-[11px] text-text-muted hover:text-brand-primary transition-colors"
                    >
                      View Patient History →
                    </Link>

                    <Link to={`/doctor/appointments/${appointment.id}`}>
                      <Button variant="primary" size="sm" className="h-8 px-3 text-xs gap-1.5">
                        <span>Details</span>
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
