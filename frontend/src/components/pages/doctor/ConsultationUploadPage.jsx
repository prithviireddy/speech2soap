import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCheck, Mic } from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Button, LoadingSpinner } from "../../shared";

import { uploadConsultationAPI } from "../../../api/doctor";

export const ConsultationUploadPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  const [step, setStep] = useState("upload");
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allowedExtensions = [
    ".mp3",
    ".wav",
    ".m4a",
    ".aac",
    ".mpeg",
    ".aiff",
    ".flac",
    ".alac",
    ".mp4",
  ];

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    const extension = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError(
        "Unsupported audio format. Please upload MP3, WAV, M4A, AAC, FLAC, ALAC, MPEG, AIFF, or MP4."
      );
      return;
    }

    setError("");
    setFile(selectedFile);
    setStep("details");
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files?.[0];

    handleFileSelect(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a consultation recording.");
      return;
    }

    if (!appointmentId) {
      setError("Appointment information is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await uploadConsultationAPI(
        appointmentId,
        file,
        chiefComplaint.trim() || null,
        doctorNotes.trim() || null
      );

      const consultationId = response.consultation_id;

      if (!consultationId) {
        throw new Error(
          "Consultation was uploaded but no consultation ID was returned."
        );
      }

      navigate(`/doctor/consultations/${consultationId}`);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to upload consultation."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setFile(null);
    setError("");
    setStep("upload");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold">
            Upload Consultation
          </h1>

          <p className="text-text-secondary mt-2">
            Upload the consultation recording and provide the clinical
            context needed to generate the report.
          </p>
        </div>

        {/* Error */}
        {error && (
          <Card>
            <p className="text-danger text-sm">{error}</p>
          </Card>
        )}

        {/* STEP 1: AUDIO UPLOAD */}
        {step === "upload" && (
          <Card
            className={`p-12 text-center cursor-pointer border-2 border-dashed transition-all duration-200 ${
              isDragging
                ? "border-brand-primary bg-brand-primary/5 scale-[1.01]"
                : "border-border-default hover:border-brand-primary"
            }`}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
          >
            <div className="flex justify-center mb-6">
              <Mic size={60} strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-display font-bold mb-3">
              Upload Consultation Recording
            </h2>

            <p className="text-text-secondary mb-2">
              Drag and drop the consultation audio here
            </p>

            <p className="text-sm text-text-secondary mb-6">
              or browse your computer
            </p>

            <input
              ref={fileInputRef}
              id="audio-upload"
              type="file"
              className="hidden"
              accept=".mp3,.wav,.m4a,.aac,.mpeg,.aiff,.flac,.alac,.mp4"
              onChange={handleFileInputChange}
            />

            <label
              htmlFor="audio-upload"
              className="inline-flex items-center px-5 py-2.5 bg-brand-primary text-white rounded-lg cursor-pointer hover:opacity-80 transition"
            >
              Browse Files
            </label>

            <p className="text-xs text-text-secondary mt-6">
              Supported formats: MP3, WAV, M4A, AAC, FLAC, ALAC, MPEG, AIFF,
              MP4
            </p>

            {isDragging && (
              <p className="mt-4 text-brand-primary font-medium">
                Release to upload
              </p>
            )}
          </Card>
        )}

        {/* STEP 2: CONSULTATION DETAILS */}
        {step === "details" && file && (
          <Card className="space-y-6">
            {/* Selected File */}
            <div>
              <p className="text-lg font-medium mb-2">
                Selected Recording
              </p>

              <div className="p-4 bg-bg-base rounded-lg flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{file.name}</p>

                  <p className="text-sm text-text-secondary mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <CheckCheck
                  size={24}
                  className="flex-shrink-0"
                />
              </div>
            </div>

            {/* Chief Complaint */}
            <div>
              <label
                htmlFor="chiefComplaint"
                className="block text-sm font-medium mb-2"
              >
                Chief Complaint
              </label>

              <textarea
                id="chiefComplaint"
                value={chiefComplaint}
                onChange={(event) =>
                  setChiefComplaint(event.target.value)
                }
                placeholder="What is the main reason for the consultation?"
                className="w-full h-28 px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary resize-none"
                disabled={loading}
              />
            </div>

            {/* Doctor Notes */}
            <div>
              <label
                htmlFor="doctorNotes"
                className="block text-sm font-medium mb-2"
              >
                Doctor Notes
              </label>

              <textarea
                id="doctorNotes"
                value={doctorNotes}
                onChange={(event) =>
                  setDoctorNotes(event.target.value)
                }
                placeholder="Add any additional clinical context or notes..."
                className="w-full h-32 px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary resize-none"
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={loading}
                className="flex-1"
              >
                Back
              </Button>

              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Uploading...
                  </span>
                ) : (
                  "Upload & Process"
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
