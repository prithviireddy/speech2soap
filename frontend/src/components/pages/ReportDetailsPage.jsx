import { useState } from 'react';
import { DashboardLayout } from '../layouts';
import { Card, Badge, Button, Tabs } from '../shared';

export function ReportDetailsPage() {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    {
      id: 'summary',
      label: 'Clinical Summary',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-display font-bold mb-3">Chief Complaint</h3>
            <p className="text-text-secondary">Patient reports persistent lower back pain for the past 6 weeks, aggravated by prolonged sitting.</p>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold mb-3">Diagnosis</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-brand-primary">•</span>
                <span className="text-sm">Lumbar strain (ICD: M54.5)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-primary">•</span>
                <span className="text-sm">Muscle spasm (ICD: M62.83)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold mb-3">Treatment Plan</h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li>• Rest and ice therapy for first 48 hours</li>
              <li>• Physical therapy 3 times per week</li>
              <li>• Anti-inflammatory medications as needed</li>
              <li>• Follow up in 2 weeks</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'soap',
      label: 'SOAP Note',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border-l-4 border-brand-primary bg-white">
            <h3 className="text-lg font-display font-bold mb-3">Subjective</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              Patient reports lower back pain × 6 weeks, worse with prolonged sitting, better with rest. No radiation. Denies numbness/tingling. Sleep affected 3-4 nights per week.
            </p>
          </div>

          <div className="p-6 rounded-lg border-l-4 border-medical bg-white">
            <h3 className="text-lg font-display font-bold mb-3">Objective</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              BP: 128/82, HR: 72, Temp: 98.6°F. Physical exam: Paraspinal muscle tenderness L4-L5, limited flexion (50%), negative straight leg raise bilaterally.
            </p>
          </div>

          <div className="p-6 rounded-lg border-l-4 border-warning bg-white">
            <h3 className="text-lg font-display font-bold mb-3">Assessment</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              Lumbar strain with myofascial pain. No evidence of nerve compression. Likely mechanical in nature related to posture and activity.
            </p>
          </div>

          <div className="p-6 rounded-lg border-l-4 border-success bg-white">
            <h3 className="text-lg font-display font-bold mb-3">Plan</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              Naproxen 500mg BID × 7 days, Physical therapy 3x/week, Ergonomic evaluation, Follow-up in 14 days. Consider imaging if symptoms persist.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Report */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">Consultation Report</h1>
                <div className="flex gap-4 text-sm text-text-secondary">
                  <span>📅 December 15, 2024</span>
                  <span>👨‍⚕️ Dr. Sarah Chen</span>
                  <Badge variant="success" size="sm">Reviewed</Badge>
                </div>
              </div>
              <Button variant="ghost">⬇ Download</Button>
            </div>

            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Key Findings */}
          <Card>
            <h2 className="text-lg font-display font-bold mb-4">Key Findings</h2>
            <div className="space-y-3">
              <div>
                <Badge variant="warning">Lumbar Strain</Badge>
              </div>
              <div>
                <Badge variant="danger">Myofascial Pain</Badge>
              </div>
              <div className="pt-3 border-t border-border-default">
                <p className="text-sm text-text-secondary mb-2">Allergies Mentioned</p>
                <Badge variant="danger">Penicillin</Badge>
              </div>
            </div>
          </Card>

          {/* Medications */}
          <Card>
            <h2 className="text-lg font-display font-bold mb-4">Medications</h2>
            <div className="space-y-3">
              <div className="p-3 bg-bg-base rounded-lg">
                <p className="font-medium text-sm">Naproxen</p>
                <p className="text-xs text-text-secondary">500mg • 2x daily × 7 days</p>
              </div>
              <Button variant="ghost" className="w-full text-base">+ Add to My Medications</Button>
            </div>
          </Card>

          {/* Follow-up Tasks */}
          <Card>
            <h2 className="text-lg font-display font-bold mb-4">Follow-up Tasks</h2>
            <div className="space-y-3">
              {[
                { task: 'Schedule physical therapy', date: 'ASAP' },
                { task: 'Workplace ergonomic eval', date: 'This week' },
                { task: 'Follow-up appointment', date: 'Dec 29' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 hover:bg-bg-base rounded-lg transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.task}</p>
                    <p className="text-xs text-text-secondary">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Export Options */}
          <Card className="space-y-3">
            <Button variant="secondary" className="w-full justify-center">📄 Export PDF</Button>
            <Button variant="secondary" className="w-full justify-center">📝 Export DOCX</Button>
            <Button variant="secondary" className="w-full justify-center">🔗 Share Report</Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
