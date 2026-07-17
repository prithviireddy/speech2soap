import { useState } from "react";

import { Button } from "../../../shared";

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

  const [durationMinutes, setDurationMinutes] =
    useState(
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
      setError(
        "Please select a date and time."
      );
      return;
    }

    if (durationMinutes <= 0) {
      setError(
        "Duration must be greater than zero."
      );
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-red-600">
          {error}
        </div>
      )}

      {showPatientSelection && (
        <div>
          <label className="block mb-2 font-medium">
            Patient
          </label>

          <PatientSearchDropdown
            selectedPatient={patient}
            onSelect={setPatient}
          />
        </div>
      )}

      {showDoctorSelection && (
        <div>
          <label className="block mb-2 font-medium">
            Doctor
          </label>

          <DoctorSearchDropdown
            selectedDoctor={doctor}
            onSelect={setDoctor}
          />
        </div>
      )}

      <div>
        <label className="block mb-2 font-medium">
          Date & Time
        </label>

        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) =>
            setScheduledAt(e.target.value)
          }
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Duration (minutes)
        </label>

        <input
          type="number"
          min="1"
          value={durationMinutes}
          onChange={(e) =>
            setDurationMinutes(
              e.target.value
            )
          }
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Reason
        </label>

        <input
          type="text"
          value={reason}
          onChange={(e) =>
            setReason(e.target.value)
          }
          placeholder="Reason for appointment"
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Notes
        </label>

        <textarea
          rows={4}
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="Additional notes"
          className="w-full rounded-lg border p-3"
        />
      </div>

      {mode === "edit" && (
        <div>
          <label className="block mb-2 font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="SCHEDULED">
              SCHEDULED
            </option>

            <option value="CHECKED_IN">
              CHECKED_IN
            </option>

            <option value="IN_PROGRESS">
              IN_PROGRESS
            </option>

            <option value="COMPLETED">
              COMPLETED
            </option>

            <option value="CANCELLED">
              CANCELLED
            </option>

            <option value="NO_SHOW">
              NO_SHOW
            </option>
          </select>
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading
          ? "Saving..."
          : mode === "create"
          ? "Create Appointment"
          : "Update Appointment"}
      </Button>
    </form>
  );
};
