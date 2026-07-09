import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { Card, Button } from "../../../shared";

import { getPatientsAPI } from "../../../../api/patient";

export const PatientList = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPatientsAPI();
      setPatients(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          "Failed to load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase();

    return patients.filter(
      (patient) =>
        patient.full_name
          .toLowerCase()
          .includes(query) ||
        patient.phone.includes(query)
    );
  }, [patients, search]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <Card>

          {/* Header */}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                Patients
              </h1>

              <p className="text-gray-500 mt-2">
                Manage patients registered in your clinic.
              </p>
            </div>

            <Button
              onClick={() =>
                navigate("/admin/patients/new")
              }
            >
              Add Patient
            </Button>
          </div>

          {/* Search */}

          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Loading */}

          {loading && (
            <p>Loading patients...</p>
          )}

          {/* Error */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No patients found.
                </p>

                <Button
                  className="mt-4"
                  onClick={() =>
                    navigate("/admin/patients/new")
                  }
                >
                  Create Patient
                </Button>
              </div>
            )}

          {/* Table */}

          {!loading &&
            !error &&
            filteredPatients.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">
                        Name
                      </th>

                      <th className="text-left py-3">
                        Phone
                      </th>

                      <th className="text-left py-3">
                        Gender
                      </th>

                      <th className="text-left py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPatients.map(
                      (patient) => (
                        <tr
                          key={patient.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-4">
                            {patient.full_name}
                          </td>

                          <td className="py-4">
                            {patient.phone}
                          </td>

                          <td className="py-4">
                            {patient.gender}
                          </td>

                          <td className="py-4">
                            <Button
                              onClick={() =>
                                navigate(
                                  `/admin/patients/${patient.id}`
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
      </div>
    </DashboardLayout>
  );
};
