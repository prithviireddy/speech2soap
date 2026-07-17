import { useState } from "react";

import { lookupPatientsAPI } from "../../../../api/patient";

export const PatientSearchDropdown = ({
  selectedPatient,
  onSelect,
}) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const data = await lookupPatientsAPI(value);

      setResults(data);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search patient..."
        value={search}
        onChange={(e) =>
          handleSearch(e.target.value)
        }
        className="w-full rounded-lg border p-3"
      />

      {loading && (
        <p className="text-sm text-gray-500">
          Searching...
        </p>
      )}

      {!selectedPatient &&
        results.length > 0 && (
          <div className="rounded-lg border divide-y">
            {results.map((patient) => (
              <button
                key={patient.id}
                type="button"
                className="w-full p-3 text-left hover:bg-gray-50"
                onClick={() => {
                  onSelect(patient);
                  setResults([]);
                  setSearch(
                    patient.full_name
                  );
                }}
              >
                <p className="font-medium">
                  {patient.full_name}
                </p>

                <p className="text-sm text-gray-500">
                  {
                    patient.patient_number
                  }
                </p>
              </button>
            ))}
          </div>
        )}

      {selectedPatient && (
        <div className="rounded-lg border bg-gray-50 p-3">
          <p className="font-medium">
            {selectedPatient.full_name}
          </p>

          <p className="text-sm text-gray-500">
            {
              selectedPatient.patient_number
            }
          </p>
        </div>
      )}
    </div>
  );
};
