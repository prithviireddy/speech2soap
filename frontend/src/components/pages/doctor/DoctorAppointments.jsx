import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";

import { CalendarDays, Clock, User } from "lucide-react";

import { listDoctorAppointmentsAPI } from "../../../api/doctor";

export const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const data = await listDoctorAppointmentsAPI();

      setAppointments(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
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
            Appointments
          </h1>

          <p className="text-text-secondary mt-2">
            View all appointments assigned to you.
          </p>
        </div>

        {/* Empty State */}
        {appointments.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <CalendarDays
                size={48}
                className="mx-auto text-text-secondary"
              />

              <h2 className="text-xl font-semibold mt-4">
                No Appointments Assigned
              </h2>

              <p className="text-text-secondary mt-2">
                You currently have no scheduled appointments.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User size={18} />
                      <p className="font-display text-xl font-bold">
                        {appointment.patient_name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <Clock size={16} />

                      <span>
                        {new Date(
                          appointment.scheduled_at
                        ).toLocaleString()}
                      </span>
                    </div>

                    {appointment.reason && (
                      <p className="text-sm text-text-secondary">
                        <span className="font-medium">
                          Reason:
                        </span>{" "}
                        {appointment.reason}
                      </p>
                    )}
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <Badge variant="info">
                      {appointment.status}
                    </Badge>

                    <Link
                      to={`/doctor/appointments/${appointment.id}`}
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
