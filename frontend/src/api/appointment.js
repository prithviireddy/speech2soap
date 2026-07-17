import api from "./api"

export const createAppointmentAPI = async (payload) => {
    const response = await api.post(
        `/admin/appointments`,
        payload
    );

    return response.data;
};

export const listAppointmentsAPI = async () => {
    const response = await api.get(
        `/admin/appointments`,
    );

    return response.data;
};

export const getAppointmentAPI = async (appointmentId) => {
    const response = await api.get(
        `/admin/appointments/${appointmentId}`
    );

    return response.data;
};

export const updateAppointmentAPI = async(appointmentId, payload) => {
    const response = await api.patch(`/admin/appointments/${appointmentId}`,payload);
    return response.data;
};

