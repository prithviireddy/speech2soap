import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, Button } from "../../../shared";
import { createPatientAPI } from "../../../../api/patient";

export const CreatePatient = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    date_of_birth: "",
    gender: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await createPatientAPI(form);

      navigate("/admin/patients");
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          "Failed to create patient."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Card className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Create Patient
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="block mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="block mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="block mb-1">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="block mb-1">
              Date of Birth
            </label>

            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="block mb-1">
              Gender
            </label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            >
              <option value="">
                Select Gender
              </option>
              <option value="Male">
                Male
              </option>
              <option value="Female">
                Female
              </option>
              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Patient"}
          </Button>
        </form>
      </Card>
    </AdminLayout>
  );
};
