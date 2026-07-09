import { useEffect, useState } from "react";

import { Card, Button } from "../../../shared";

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

const defaultValues = {
  email: "",
  password: "",
  full_name: "",
  specialization: "",
  license_number: "",
  phone: "",
};

export const DoctorForm = ({
  mode = "create",
  initialValues = defaultValues,
  onSubmit,
  loading = false,
  error = "",
  submitLabel,
  onCancel,
}) => {
  const [form, setForm] = useState(defaultValues);

  useEffect(() => {
    setForm({
      ...defaultValues,
      ...initialValues,
    });
  }, [initialValues]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "edit") {
      const payload = {
        full_name: form.full_name,
        specialization: form.specialization,
        license_number: form.license_number,
        phone: form.phone,
      };

      onSubmit(payload);
      return;
    }

    onSubmit(form);
  };

  return (
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
                readOnly={mode === "edit"}
                required
                className={`${inputClass} ${
                  mode === "edit"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>  

            {mode === "create" && (
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
            )} 

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
            onClick={onCancel}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : submitLabel}
          </Button>

        </div>

      </form>
    </Card>
  );
};
