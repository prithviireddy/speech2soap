import { DoctorLayout } from '../../layouts/DoctorLayout';
import { Card, Button, Badge } from '../../shared';
import { CheckCheck, Plus } from 'lucide-react';

export const DoctorFollowupManagement = () => {
  const followups = [
    { id: 1, patient: 'John Smith', task: 'Lab work review', dueDate: '2 days', priority: 'danger' },
    { id: 2, patient: 'Sarah Johnson', task: 'Blood pressure check', dueDate: '5 days', priority: 'warning' },
    { id: 3, patient: 'Michael Brown', task: 'Physical therapy', dueDate: '1 week', priority: 'success' },
  ];

  return (
    <DoctorLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold">Followup Management</h1>
            <p className="text-text-secondary">Track and schedule patient followups</p>
          </div>
          <Button variant="primary" className="gap-2">
            <Plus size={18} />
            Schedule Followup
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <p className="text-text-secondary text-sm">Due Soon</p>
            <p className="text-3xl font-display font-bold mt-2">12</p>
          </Card>
          <Card>
            <p className="text-text-secondary text-sm">In Progress</p>
            <p className="text-3xl font-display font-bold mt-2">5</p>
          </Card>
          <Card>
            <p className="text-text-secondary text-sm">Completed</p>
            <p className="text-3xl font-display font-bold mt-2">34</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-display font-bold mb-6">Pending Followups</h2>
          <div className="space-y-3">
            {followups.map((followup) => (
              <div key={followup.id} className="flex items-center gap-4 p-4 rounded-lg border border-border-default hover:border-brand-primary transition-all">
                <input type="checkbox" className="w-5 h-5 rounded cursor-pointer" />
                <div className="flex-1">
                  <p className="font-medium">{followup.patient}</p>
                  <p className="text-sm text-text-secondary">{followup.task}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={followup.priority} size="sm">{followup.dueDate}</Badge>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DoctorLayout>
  );
};
