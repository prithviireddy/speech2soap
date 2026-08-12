import api from "./api";

export const createPatientAPI = async (payload) => {
  const response = await api.post(
    "/admin/patients",
    payload
  );

  return response.data;
};

export const getPatientsAPI = async () => {
  const response = await api.get(
    "/admin/patients"
  );

  return response.data;
};

export const lookupPatientsAPI = async (search) => {
  const response = await api.get(`/admin/patients/lookup`,{
    params: {
      search,
    },
  });
  return response.data;
}

export const getPatientAPI = async (patientId) => {
  const response = await api.get(
    `/admin/patients/${patientId}`
  );

  return response.data;
};

export const updatePatientAPI = async (patientId, payload) => {
  const response = await api.patch(
    `/admin/patients/${patientId}`,
    payload
  );

  return response.data;
};

export const getPatientProfile = async () => {
  const response = await api.get("/patient/me");
  return response.data;
};

export const updatePatientProfile = async (data) => {
  const response = await api.patch("/patient/me", data);
  return response.data;
};

export const getPatientReports = async () => {
  const response = await api.get("/patient/reports");
  return response.data;
};

export const getPatientReport = async (reportId) => {
  const response = await api.get(`/patient/reports/${reportId}`);
  return response.data;
};
