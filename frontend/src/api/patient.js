import api from "./api";

export const createPatientAPI = async (payload) => {
  const response = await api.post(
    "/admin/patients",
    payload
  );

  return response.data;
};
