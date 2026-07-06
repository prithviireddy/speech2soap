import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Button, Badge } from '../../shared';
import { Calendar, User, Download, Share2 } from 'lucide-react';

export const PatientReportViewer = () => {
  const reports = [
    {
      id: 1,
      date: 'Dec 15, 2024',
      doctor: 'Dr. Sarah Chen',
      type: 'Annual Checkup',
      status: 'approved',
      summary: 'Overall health is good. Continue current management.'
    },
    {
      id: 2,
      date: 'Dec 8, 2024',
      doctor: 'Dr. James Wilson',
      type: 'Follow-up Consultation',
      status: 'approved',
      summary: 'Blood pressure readings under control. Medication effective.'
    },
    {
      id: 3,
      date: 'Nov 30, 2024',
      doctor: 'Dr. Rachel Adams',
      type: 'Consultation',
      status: 'approved',
      summary: 'Physical examination completed. Results normal.'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold">My Medical Reports</h1>
          <p className="text-text-secondary">View and download your approved medical reports</p>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-display font-bold">{report.type}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} /> {report.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={16} /> {report.doctor}
                    </span>
                  </div>
                  <p className="mt-3 text-text-secondary">{report.summary}</p>
                </div>
                <Badge variant="success">Approved</Badge>
              </div>

              <div className="mt-4 pt-4 border-t border-border-default flex gap-2">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Download size={16} />
                  Download PDF
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 size={16} />
                  Share
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
