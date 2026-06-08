import { useState } from 'react';
import { DashboardLayout } from '../layouts';
import { Card, Badge, Button, Tabs } from '../shared';
import { Calendar, UserPlus,Share,BookText,FileText } from 'lucide-react';
import { useLocation } from "react-router-dom";
  

export function ReportDetailsPage() {
  const [activeTab, setActiveTab] = useState('summary');
  const location = useLocation();

  const report = location.state?.report;
  if (!report) {
  return <div>No report found</div>;
}
  const tabs = [
    {
      id: 'summary',
      label: 'Clinical Summary',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-display font-bold mb-3">Chief Complaint</h3>
            <p className="text-text-secondary"> {report.summary}</p>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold mb-3">
              Diagnosis
            </h3>

            {report.clinical_report?.diagnosis?.length ? (
              report.clinical_report.diagnosis.map((d, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-brand-primary">•</span>
                  <span>
                    {d.name}
                    {d.icd_code && ` (ICD: ${d.icd_code})`}
                  </span>
                </div>
              ))
            ) : (
              <p>Not mentioned</p>
            )}

          </div>

          <div>
            <h3 className="text-lg font-display font-bold mb-3">
              Treatment Plan
            </h3>

            {report.clinical_report?.treatment_plan?.length ? (
              <ul className="space-y-2">
                {report.clinical_report.treatment_plan.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            ) : (
              <p>Not mentioned</p>
            )}
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
             {report.soap.subjective.join(" ")}
            </p>
          </div>

          <div className="p-6 rounded-lg border-l-4 border-medical bg-white">
            <h3 className="text-lg font-display font-bold mb-3">Objective</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              {report.soap.objective.join(" ")}
            </p>
          </div>

          <div className="p-6 rounded-lg border-l-4 border-warning bg-white">
            <h3 className="text-lg font-display font-bold mb-3">Assessment</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              {report.soap.assessment.join(" ")}
            </p>
          </div>

          <div className="p-6 rounded-lg border-l-4 border-success bg-white">
            <h3 className="text-lg font-display font-bold mb-3">Plan</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
               {report.soap.plan.join(" ")}
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
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">Consultation Report</h1>
                <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                  <span><Calendar /> December 15, 2024</span>
                  <span><UserPlus /> Dr. Sarah Chen</span>
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
          <h2 className="text-lg font-display font-bold mb-4">
            Key Findings
          </h2>

          {report.clinical_report?.key_findings?.length ? (
            report.clinical_report.key_findings.map((finding, idx) => (
              <Badge key={idx} variant="warning">
                {finding}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-text-secondary">
              None identified
            </p>
          )}
        </Card>

          {/* Medications */}
          <Card>
            <h2 className="text-lg font-display font-bold mb-4">
              Medications
            </h2>

            {report.clinical_report?.medications?.length ? (
              report.clinical_report.medications.map((med, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-bg-base rounded-lg"
                >
                  <p className="font-medium">
                    {med.name}
                  </p>

                  <p className="text-xs text-text-secondary">
                    {[med.dosage, med.frequency, med.duration]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                </div>
              ))
            ) : (
              <p>No medications mentioned</p>
            )}
          </Card>

          {/* Follow-up Tasks */}
          <Card>
            <h2 className="text-lg font-display font-bold mb-4">
              Follow-up Tasks
            </h2>

            {report.clinical_report?.follow_up_tasks?.length ? (
              report.clinical_report.follow_up_tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3"
                >
                  <input type="checkbox" />
                  <span>{task}</span>
                </div>
              ))
            ) : (
              <p>No follow-up tasks</p>
            )}
          </Card>

          {/* Export Options */}
          <Card className="space-y-3">
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2"><FileText />  Export PDF</Button>
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2"><BookText />  Export DOCX</Button>
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2"><Share />  Share Report</Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
