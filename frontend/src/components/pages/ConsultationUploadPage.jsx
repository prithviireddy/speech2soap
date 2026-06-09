import { useState, useEffect } from 'react';
import { DashboardLayout } from '../layouts';
import { Card, Button,LoadingSpinner } from '../shared';
import { Mic } from 'lucide-react';
import {uploadAudio, getJobStatus} from '../../api/upload'
import { useNavigate } from "react-router-dom";
import { CheckCheck,Check  } from 'lucide-react';





export const ConsultationUploadPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('upload') // upload, details, progress
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState("");
  const [report, setReport] = useState(null)
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = (e) => {
    e.preventDefault();

    // console.log("types:", e.dataTransfer.types);
    // console.log("files:", e.dataTransfer.files);
    // console.log("items:", e.dataTransfer.items);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setStep('details');
    }
  };

  const handleUploadStart = async () => {

  if (!file) return;

  try {

    setStep('progress');

    const uploadResponse = await uploadAudio(file);

    const jobId = uploadResponse.job_id;

    const interval = setInterval(async () => {
      
      console.log(jobId);

      const status = await getJobStatus(jobId);

      setProgress(status.progress);
      setCurrentStage(status.stage);

      if (status.status === "completed") {

        clearInterval(interval);

        navigate("/report", {
          state: {
            report: status.report
          }
        });
      }

      if (status.status === "failed") {

        clearInterval(interval);

        console.error(status.error);
      }

    }, 1000);

  } catch (error) {

    console.error(error);

  }
};


  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8">Upload Consultation</h1>

        {step === 'upload' && (
          <Card
            className={`
              p-12 text-center cursor-pointer border-2 border-dashed
              transition-all duration-200
              ${
                isDragging
                  ? 'border-brand-primary bg-brand-primary/5 scale-[1.01]'
                  : 'border-border-default hover:border-brand-primary'
              }
            `}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              setIsDragging(false);
              handleFileDrop(e);
            }}
          >
            <div className="flex justify-center mb-6">
              <Mic size={60} strokeWidth={3} absoluteStrokeWidth />
            </div>

            <h2 className="text-2xl font-display font-bold mb-3">
              Drag & Drop Audio File
            </h2>

            <p className="text-text-secondary mb-2">
              Drop your consultation recording here
            </p>

            <p className="text-sm text-text-secondary mb-6">
              or click below to browse files
            </p>

            <input
              id="audio-upload"
              type="file"
              className="hidden"
              accept=".mp3,.wav,.m4a,.aac,.mpeg,.aiff,.flac,.alac,.mp4"
              onChange={(e) => {
                const selectedFile = e.target.files[0];

                if (selectedFile) {
                  setFile(selectedFile);
                  setStep('details');
                }
              }}
            />

            <label
              htmlFor="audio-upload"
              className="
                inline-flex items-center px-5 py-2.5
                bg-brand-primary text-white
                rounded-lg cursor-pointer
                hover:opacity-80 transition
              "
            >
              Browse Files
            </label>

            <p className="text-xs text-text-secondary mt-6">
              Supports MP3, WAV, M4A, AAC • Max 500 MB
            </p>

            {isDragging && (
              <p className="mt-4 text-brand-primary font-medium">
                Release to upload
              </p>
            )}
          </Card>
        )}

        {step === 'details' && (
          <Card className="space-y-6">
            <div>
              <p className="text-lg font-medium mb-2">Selected File</p>
              <div className="p-4 bg-bg-base rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{file?.name}</p>
                  <p className="text-sm text-text-secondary">{(file?.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <span className="text-2xl"><CheckCheck  /></span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Consultation Date</label>
              <input type="date" className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Doctor Name</label>
              <input type="text" placeholder="Dr. Name" className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Chief Complaint</label>
              <textarea
                placeholder="What was the main reason for the consultation?"
                className="w-full h-24 px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep('upload')} className="flex-1">
                Back
              </Button>
              <Button variant="primary" onClick={handleUploadStart} className="flex-1">
                Upload & Process
              </Button>
            </div>
          </Card>
        )}

        {step === 'progress' && (
          <Card className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <p className="font-medium">Processing your consultation...</p>
                <p className="text-brand-primary font-bold">
                  {Math.round(progress)}%
                </p>
              </div>

              <div className="w-full h-2 bg-border-default rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-medical transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm text-brand-primary mt-3 font-medium">
                {currentStage}
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  stage: "Audio Upload",
                  status:
                    progress >= 15
                      ? "complete"
                      : progress > 0
                      ? "in-progress"
                      : "pending",
                },

                {
                  stage: "Speech Transcription",
                  status:
                    progress >= 65
                      ? "complete"
                      : progress >= 15
                      ? "in-progress"
                      : "pending",
                },

                {
                  stage: "Speaker Diarization",
                  status:
                    progress >= 88
                      ? "complete"
                      : progress >= 65
                      ? "in-progress"
                      : "pending",
                },

                {
                  stage: "Transcript Processing",
                  status:
                    progress >= 95
                      ? "complete"
                      : progress >= 88
                      ? "in-progress"
                      : "pending",
                },

                {
                  stage: "Clinical Report Generation",
                  status:
                    progress >= 100
                      ? "complete"
                      : progress >= 95
                      ? "in-progress"
                      : "pending",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3">
                  {item.status === "complete" && (
                    <span className="text-2xl">
                      <Check />
                    </span>
                  )}

                  {item.status === "in-progress" && (
                    <LoadingSpinner size="sm" />
                  )}

                  {item.status === "pending" && (
                    <span className="w-6 h-6 rounded-full border-2 border-border-default" />
                  )}

                  <p
                    className={
                      item.status === "complete"
                        ? "text-text-primary font-medium text-sm"
                        : item.status === "in-progress"
                        ? "text-brand-primary font-medium text-sm"
                        : "text-text-secondary text-sm"
                    }
                  >
                    {item.stage}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

  
      </div>
    </DashboardLayout>
  );
}
