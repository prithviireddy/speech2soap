import api from "./api";

export const uploadAudio = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        "/doctor/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getJobStatus = async (jobId) => {

    const response = await api.get(
        `/status/${jobId}`
    );

    return response.data;
};
