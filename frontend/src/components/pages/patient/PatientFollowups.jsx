import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button } from '../../shared';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export const PatientFollowups = () => {
  const followups = [
    { id: 1, task: 'Lab work review', dueDate: '2 days', doctor: 'Dr. Sarah Chen', priority: 'danger' },
    { id: 2, task: 'Blood pressure check', dueDate: '5 days', doctor: 'Dr. James Wilson', priority: 'warning' },
    { id: 3, task: 'Physical therapy', dueDate: '1 week', doctor: 'Dr. Rachel Adams', priority: 'success' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold">My Followups</h1>
          <p className="text-text-secondary">Track your scheduled followup appointments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-danger/10">
            <p className="text-text-secondary text-sm">Due Soon</p>
            <p className="text-3xl font-display font-bold mt-2">2</p>
          </Card>
          <Card className="bg-gradient-to-br from-warning/10">
            <p className="text-text-secondary text-sm">This Month</p>
            <p className="text-3xl font-display font-bold mt-2">3</p>
          </Card>
          <Card className="bg-gradient-to-br from-success/10">
            <p className="text-text-secondary text-sm">Completed</p>
            <p className="text-3xl font-display font-bold mt-2">8</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-display font-bold mb-6">Upcoming Followups</h2>
          <div className="space-y-3">
            {followups.map((followup) => (
              <div key={followup.id} className="p-4 rounded-lg border border-border-default hover:border-brand-primary transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-display font-bold">{followup.task}</h3>
                    <p className="text-sm text-text-secondary">{followup.doctor}</p>
                  </div>
                  <Badge variant={followup.priority}>{followup.dueDate}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1 gap-2">
                    <Calendar size={16} />
                    Schedule
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Clock size={16} />
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-l-4 border-info bg-medical/5">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-medical flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Important Followup Coming</p>
              <p className="text-xs text-text-secondary mt-1">
                Your lab work review is due in 2 days. Schedule an appointment with your doctor.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
