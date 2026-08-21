import api from "./api";

export const getAdminStatsAPI = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};
