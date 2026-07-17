import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { Card, Button } from "../../../shared";

import { listAppointmentsAPI } from "../../../../api/appointment";

export const AppointmentList = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await listAppointmentsAPI();
      setAppointments(data);
    } catch {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              Appointments
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage scheduled appointments.
            </p>
          </div>

          <Button
            onClick={() =>
              navigate("/admin/appointments/new")
            }
          >
            Create Appointment
          </Button>
        </div>

        {loading && (
          <p>Loading appointments...</p>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          appointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No appointments found.
              </p>

              <Button
                className="mt-4"
                onClick={() =>
                  navigate("/admin/appointments/new")
                }
              >
                Create Appointment
              </Button>
            </div>
          )}

        {!loading &&
          !error &&
          appointments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">
                      Patient
                    </th>

                    <th className="text-left py-3">
                      Doctor
                    </th>

                    <th className="text-left py-3">
                      Scheduled At
                    </th>

                    <th className="text-left py-3">
                      Duration
                    </th>

                    <th className="text-left py-3">
                      Status
                    </th>

                    <th className="text-left py-3">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map(
                    (appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b"
                      >
                        <td className="py-4">
                          {appointment.patient_name}
                        </td>

                        <td className="py-4">
                          {appointment.doctor_name}
                        </td>

                        <td className="py-4">
                          {new Date(
                            appointment.scheduled_at
                          ).toLocaleString()}
                        </td>

                        <td className="py-4">
                          {
                            appointment.duration_minutes
                          }{" "}
                          mins
                        </td>

                        <td className="py-4">
                          {appointment.status}
                        </td>

                        <td className="py-4 flex gap-2">
                          <Button
                            onClick={() =>
                              navigate(
                                `/admin/appointments/${appointment.id}`
                              )
                            }
                          >
                            View
                          </Button>

                          <Button
                            onClick={() =>
                              navigate(
                                `/admin/appointments/${appointment.id}/edit`
                              )
                            }
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
      </Card>
    </DashboardLayout>
  );
};
