
export async function uploadAudio(audioFile) {
  const formData = new FormData();

  formData.append("file", audioFile);

  const response = await fetch(
    "http://localhost:8000/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
}
