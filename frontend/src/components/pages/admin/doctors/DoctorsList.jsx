import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { Card, Button } from "../../../shared";

import { getDoctorsAPI } from "../../../../api/doctor";

export const DoctorsList = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctorsAPI();
      setDoctors(data);
    } catch {
      setError("Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    const query = search.toLowerCase();

    return doctors.filter(
      (doctor) =>
        doctor.full_name.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query)
    );
  }, [doctors, search]);

  return (
    <DashboardLayout>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              Doctors
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage doctors in your clinic.
            </p>
          </div>

          <Button
            onClick={() =>
              navigate("/admin/doctors/new")
            }
          >
            Add Doctor
          </Button>
        </div>

        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-lg border p-3 mb-6"
        />

        {loading && (
          <p>Loading doctors...</p>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No doctors found.
              </p>

              <Button
                className="mt-4"
                onClick={() =>
                  navigate("/admin/doctors/new")
                }
              >
                Create Doctor
              </Button>
            </div>
          )}

        {!loading &&
          !error &&
          filteredDoctors.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">
                      Name
                    </th>

                    <th className="text-left py-3">
                      Specialization
                    </th>

                    <th className="text-left py-3">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDoctors.map(
                    (doctor) => (
                      <tr
                        key={doctor.id}
                        className="border-b"
                      >
                        <td className="py-4">
                          {doctor.full_name}
                        </td>

                        <td className="py-4">
                          {
                            doctor.specialization
                          }
                        </td>

                        <td className="py-4">
                          <Button
                            onClick={() =>
                              navigate(
                                `/admin/doctors/${doctor.id}`
                              )
                            }
                          >
                            View
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
