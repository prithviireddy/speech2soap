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

export const lookupDoctorsAPI = async (search) => {
  const response = await api.get(`/admin/doctors/lookup`,{
    params: {
      search,
    },
  });
  return response.data;
}


export const updateDoctorAPI = async(doctorId,payload) => {
  const response = await api.patch(
    `/admin/doctors/${doctorId}`,
    payload
  );

  return response.data;
};

//Doctor routes

export const listDoctorAppointmentsAPI = async () => {
  const response = await api.get("/doctor/appointments");
  return response.data;
};


export const getDoctorAppointmentAPI = async (appointmentId) => {
  const response = await api.get(
    `/doctor/appointments/${appointmentId}`
  );

  return response.data;
};


export const uploadConsultationAPI = async (
    appointmentId,
    file,
    chiefComplaint,
    doctorNotes,
) => {

    const formData = new FormData();

    formData.append(
        "appointment_id",
        appointmentId,
    );

    formData.append(
        "file",
        file,
    );

    if (chiefComplaint) {
        formData.append(
            "chief_complaint",
            chiefComplaint,
        );
    }

    if (doctorNotes) {
        formData.append(
            "doctor_notes",
            doctorNotes,
        );
    }

    const response = await api.post(
        "/doctor/consultations/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};


export const getDoctorConsultationsAPI = async () => {

    const response = await api.get(
        "/doctor/consultations"
    );

    return response.data;
};


export const getDoctorConsultationAPI = async (
    consultationId,
) => {

    const response = await api.get(
        `/doctor/consultations/${consultationId}`
    );

    return response.data;
};


export const getConsultationStatusAPI = async (
    consultationId,
) => {

    const response = await api.get(
        `/doctor/consultations/${consultationId}/status`
    );

    return response.data;
};


export const getDoctorReportsAPI = async () => {
    const response = await api.get(
        "/doctor/reports"
    );

    return response.data;
};


export const getDoctorReportAPI = async (
    reportId,
) => {
    const response = await api.get(
        `/doctor/reports/${reportId}`
    );

    return response.data;
};


export const updateDoctorReportAPI = async (
    reportId,
    payload,
) => {
    const response = await api.patch(
        `/doctor/reports/${reportId}`,
        payload,
    );

    return response.data;
};


export const approveDoctorReportAPI = async (
    reportId,
) => {
    const response = await api.post(
        `/doctor/reports/${reportId}/approve`
    );

    return response.data;
};
