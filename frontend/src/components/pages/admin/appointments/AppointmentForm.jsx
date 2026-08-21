import { useState } from "react";
import { Button, DateTimePicker } from "../../../shared";
import { PatientSearchDropdown } from "./PatientSearchDropdown";
import { DoctorSearchDropdown } from "./DoctorSearchDropdown";

export const AppointmentForm = ({
  mode = "create",
  initialValues = {},
  onSubmit,
  loading = false,
  showPatientSelection = true,
  showDoctorSelection = true,
}) => {
  const [patient, setPatient] = useState(
    initialValues.patient || null
  );

  const [doctor, setDoctor] = useState(
    initialValues.doctor || null
  );

  const [scheduledAt, setScheduledAt] = useState(
    initialValues.scheduled_at || ""
  );

  const [durationMinutes, setDurationMinutes] = useState(
    initialValues.duration_minutes || 30
  );

  const [reason, setReason] = useState(
    initialValues.reason || ""
  );

  const [notes, setNotes] = useState(
    initialValues.notes || ""
  );

  const [status, setStatus] = useState(
    initialValues.status || "SCHEDULED"
  );

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (showPatientSelection && !patient) {
      setError("Please select a patient.");
      return;
    }

    if (showDoctorSelection && !doctor) {
      setError("Please select a doctor.");
      return;
    }

    if (!scheduledAt) {
      setError("Please select a date and time.");
      return;
    }

    if (durationMinutes <= 0) {
      setError("Duration must be greater than zero.");
      return;
    }

    const payload = {
      scheduled_at: scheduledAt,
      duration_minutes: Number(durationMinutes),
      reason,
      notes,
    };

    if (showDoctorSelection) {
      payload.doctor_id = doctor.id;
    }

    if (showPatientSelection) {
      payload.patient_id = patient.id;
    }

    if (mode === "edit") {
      payload.status = status;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-danger-light/50 border border-danger/20 p-3.5 text-danger text-sm font-medium animate-fade-in-up">
          {error}
        </div>
      )}

      {showPatientSelection && (
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Patient *
          </label>
          <PatientSearchDropdown
            selectedPatient={patient}
            onSelect={setPatient}
          />
        </div>
      )}

      {showDoctorSelection && (
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Doctor *
          </label>
          <DoctorSearchDropdown
            selectedDoctor={doctor}
            onSelect={setDoctor}
          />
        </div>
      )}

      <div>
        <label className="block mb-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Appointment Date & Time *
        </label>
        <DateTimePicker
          value={scheduledAt}
          onChange={setScheduledAt}
          showTime={true}
          placeholder="Choose appointment date and time"
        />
      </div>

      <div>
        <label className="block mb-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Duration (minutes) *
        </label>
        <input
          type="number"
          min="1"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          className="w-full rounded-xl border border-border-default bg-bg-secondary p-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
        />
      </div>

      <div>
        <label className="block mb-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Reason for Visit
        </label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Routine hypertension checkup, follow-up"
          className="w-full rounded-xl border border-border-default bg-bg-secondary p-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
        />
      </div>

      <div>
        <label className="block mb-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Clinical / Administrative Notes
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes for the physician or front desk..."
          className="w-full rounded-xl border border-border-default bg-bg-secondary p-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
        />
      </div>

      {mode === "edit" && (
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Appointment Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-border-default bg-bg-secondary p-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all cursor-pointer"
          >
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="CHECKED_IN">CHECKED IN</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="NO_SHOW">NO SHOW</option>
          </select>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold mt-2"
      >
        {loading
          ? "Saving..."
          : mode === "create"
          ? "Create Appointment"
          : "Update Appointment"}
      </Button>
    </form>
  );
};
