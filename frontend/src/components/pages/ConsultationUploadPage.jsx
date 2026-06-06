import { useState, useEffect } from 'react';
import { DashboardLayout } from '../layouts';
import { Card, Button } from '../shared';
import { LoadingSpinner } from '../../App.jsx';

export function ConsultationUploadPage() {
  const [step, setStep] = useState('upload'); // upload, details, progress, success
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setStep('details');
    }
  };

  const handleUploadStart = () => {
    setStep('progress');
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 30;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep('success'), 500);
      }
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8">Upload Consultation</h1>

        {step === 'upload' && (
          <Card
            className="p-12 text-center cursor-pointer hover:border-brand-primary transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <div className="text-6xl mb-4">🎙️</div>
            <h2 className="text-2xl font-display font-bold mb-2">Drop your audio file here</h2>
            <p className="text-text-secondary mb-6">Supports MP3, WAV, M4A, AAC (Max 500MB)</p>
            <Button variant="primary">Browse Files</Button>
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
                <span className="text-2xl">✓</span>
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
                <p className="text-brand-primary font-bold">{Math.round(progress)}%</p>
              </div>
              <div className="w-full h-2 bg-border-default rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-medical transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { stage: 'Audio Upload', status: 'complete' },
                { stage: 'Transcription', status: progress > 20 ? 'complete' : 'pending' },
                { stage: 'Speaker Diarization', status: progress > 40 ? 'complete' : 'pending' },
                { stage: 'SOAP Generation', status: progress > 60 ? 'complete' : 'pending' },
                { stage: 'Clinical Summary', status: progress > 80 ? 'in-progress' : 'pending' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3">
                  {item.status === 'complete' && <span className="text-2xl">✓</span>}
                  {item.status === 'in-progress' && <LoadingSpinner size="sm" />}
                  {item.status === 'pending' && <span className="w-6 h-6 rounded-full border-2 border-border-default"></span>}
                  <p className={item.status === 'complete' ? 'text-text-primary font-medium text-sm' : 'text-text-secondary text-sm'}>
                    {item.stage}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {step === 'success' && (
          <Card className="text-center space-y-6">
            <div className="text-6xl">✨</div>
            <div>
              <h2 className="text-2xl font-display font-bold mb-2">Consultation Uploaded!</h2>
              <p className="text-text-secondary">Your report is ready for review</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1">Upload Another</Button>
              <Button variant="primary" className="flex-1">View Report</Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
