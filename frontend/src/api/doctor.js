import api from "./api";

export const createDoctorAPI = async (payload) => {
  const response = await api.post("/admin/doctors",payload);
  return response.data;
};

export const getDoctorsAPI = async () => {
  const response = await api.get("/admin/doctors");
  return response.data;
};

export const getDoctorAPI = async (doctorId) => {
  const response = await api.get(
    `/admin/doctors/${doctorId}`
  );

  return response.data;
};
