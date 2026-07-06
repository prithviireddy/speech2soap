import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { Card, Button } from "../../../shared";
import { createDoctorAPI } from "../../../../api/doctor";

export const CreateDoctor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    specialization: "",
    license_number: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await createDoctorAPI(form);
      navigate("/admin/doctors");
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          "Failed to create doctor."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/doctors")}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            ← Back to Doctors
          </button>

          <h1 className="text-3xl font-bold mt-3">
            Create Doctor
          </h1>

          <p className="text-gray-500 mt-2">
            Register a new doctor who can access ClinicReport.
          </p>
        </div>

        <Card>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-10"
          >

            {/* Account Information */}
            <section>
              <h2 className="text-lg font-semibold mb-6">
                Account Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className={inputClass}
                  />
                </div>

              </div>
            </section>

            {/* Professional Information */}
            <section>
              <h2 className="text-lg font-semibold mb-6">
                Professional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Specialization
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    License Number
                  </label>

                  <input
                    type="text"
                    name="license_number"
                    value={form.license_number}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

              </div>
            </section>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t pt-6">

              <Button
                type="button"
                onClick={() => navigate("/admin/doctors")}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Doctor"}
              </Button>

            </div>

          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};
