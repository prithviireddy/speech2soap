import { useState, useEffect } from 'react';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import { Card, Button, LoadingSpinner } from '../../shared';
import { Mic, CheckCheck, Check } from 'lucide-react';
import { uploadAudio, getJobStatus } from '../../../api/upload';
import { useNavigate } from 'react-router-dom';

export const ConsultationUploadPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('upload'); // upload, details, progress, success
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [report, setReport] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    doctorName: '',
    chiefComplaint: '',
    notes: ''
  });

  const handleFileDrop = (e) => {
  e.preventDefault();

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
        const status = await getJobStatus(jobId);
        setProgress(status.progress);
        setCurrentStage(status.stage);

        if (status.status === 'completed') {
          clearInterval(interval);
          setReport(status.report);
          setStep('success');
        }

        if (status.status === 'failed') {
          clearInterval(interval);
          console.error(status.error);
          setStep('error');
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      setStep('error');
    }
  };

  const stages = [
    { stage: 'Audio Upload', threshold: 15 },
    { stage: 'Speech Transcription', threshold: 65 },
    { stage: 'Speaker Diarization', threshold: 88 },
    { stage: 'Transcript Processing', threshold: 95 },
    { stage: 'Clinical Report Generation', threshold: 100 }
  ];

  return (
    <DoctorLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-2">Upload Consultation</h1>
        <p className="text-text-secondary mb-8">Record your patient consultation and let AI generate the clinical report</p>

        {/* UPLOAD STEP */}
        {step === 'upload' && (
          <Card
            className={`p-12 text-center cursor-pointer border-2 border-dashed transition-all duration-200 ${
              isDragging
                ? 'border-brand-primary bg-brand-primary/5 scale-[1.01]'
                : 'border-border-default hover:border-brand-primary'
            }`}
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
              <Mic size={60} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3">Drag & Drop Audio Recording</h2>
            <p className="text-text-secondary mb-2">Drop your consultation recording here</p>
            <p className="text-sm text-text-secondary mb-6">or click below to browse files</p>

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
              className="inline-flex items-center px-5 py-2.5 bg-brand-primary text-white rounded-lg cursor-pointer hover:opacity-80 transition"
            >
              Browse Files
            </label>

            <p className="text-xs text-text-secondary mt-6">
              Supports MP3, WAV, M4A, AAC, FLAC • Max 500 MB
            </p>

            {isDragging && (
              <p className="mt-4 text-brand-primary font-medium">Release to upload</p>
            )}
          </Card>
        )}

        {/* DETAILS STEP */}
        {step === 'details' && (
          <Card className="space-y-6">
            <div>
              <p className="text-lg font-medium mb-2">Selected File</p>
              <div className="p-4 bg-bg-base rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{file?.name}</p>
                  <p className="text-sm text-text-secondary">{(file?.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <span className="text-2xl"><CheckCheck /></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Consultation Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Doctor Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Chief Complaint / Reason for Visit *</label>
              <textarea
                placeholder="What was the main reason for the consultation?"
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                className="w-full h-24 px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
              <textarea
                placeholder="Any additional context..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full h-20 px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep('upload')} className="flex-1">
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleUploadStart}
                disabled={!formData.chiefComplaint}
                className="flex-1"
              >
                Upload & Process
              </Button>
            </div>
          </Card>
        )}

        {/* PROGRESS STEP */}
        {step === 'progress' && (
          <Card className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <p className="font-medium">Processing your consultation...</p>
                <p className="text-brand-primary font-bold">{Math.round(progress)}%</p>
              </div>

              <div className="w-full h-2 bg-border-default rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-medical transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm text-brand-primary mt-3 font-medium">{currentStage}</p>
            </div>

            <div className="space-y-3">
              {stages.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3">
                  {progress >= item.threshold && (
                    <span className="text-2xl"><Check /></span>
                  )}
                  {progress < item.threshold && progress >= (stages[idx - 1]?.threshold || 0) && (
                    <LoadingSpinner size="sm" />
                  )}
                  {progress < (stages[idx - 1]?.threshold || 0) && (
                    <span className="w-6 h-6 rounded-full border-2 border-border-default" />
                  )}

                  <p
                    className={
                      progress >= item.threshold
                        ? 'text-text-primary font-medium text-sm'
                        : progress >= (stages[idx - 1]?.threshold || 0)
                        ? 'text-brand-primary font-medium text-sm'
                        : 'text-text-secondary text-sm'
                    }
                  >
                    {item.stage}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && (
          <Card className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full text-success text-4xl">
              ✓
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Report Generated Successfully</h2>
              <p className="text-text-secondary mt-2">Your clinical report has been created and is ready for review</p>
            </div>

            <div className="bg-bg-base rounded-lg p-4 text-left">
              <p className="text-xs text-text-secondary font-medium mb-2">REPORT DETAILS</p>
              <div className="space-y-1 text-sm">
                <p><span className="text-text-secondary">Chief Complaint:</span> {formData.chiefComplaint}</p>
                <p><span className="text-text-secondary">Date:</span> {formData.date}</p>
                <p><span className="text-text-secondary">Audio Duration:</span> {file?.name.split('.')[0]}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => {
                setStep('upload');
                setFile(null);
                setProgress(0);
              }} className="flex-1">
                Upload Another
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                View in Dashboard
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DoctorLayout>
  );
};
