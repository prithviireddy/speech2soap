import { useState } from "react";

import { lookupDoctorsAPI } from "../../../../api/doctor";

export const DoctorSearchDropdown = ({
  selectedDoctor,
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

      const data = await lookupDoctorsAPI(value);

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
        placeholder="Search doctor..."
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

      {!selectedDoctor &&
        results.length > 0 && (
          <div className="rounded-lg border divide-y">
            {results.map((doctor) => (
              <button
                key={doctor.id}
                type="button"
                className="w-full p-3 text-left hover:bg-gray-50"
                onClick={() => {
                  onSelect(doctor);
                  setResults([]);
                  setSearch(
                    doctor.full_name
                  );
                }}
              >
                <p className="font-medium">
                  {doctor.full_name}
                </p>

                <p className="text-sm text-gray-500">
                  {
                    doctor.specialization
                  }
                </p>
              </button>
            ))}
          </div>
        )}

      {selectedDoctor && (
        <div className="rounded-lg border bg-gray-50 p-3">
          <p className="font-medium">
            {selectedDoctor.full_name}
          </p>

          <p className="text-sm text-gray-500">
            {
              selectedDoctor.specialization
            }
          </p>
        </div>
      )}
    </div>
  );
};
