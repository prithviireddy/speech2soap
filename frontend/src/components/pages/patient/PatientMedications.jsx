import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button } from '../../shared';
import { Pill, Clock, AlertCircle } from 'lucide-react';

export const PatientMedications = () => {
  const medications = [
    {
      name: 'Lisinopril',
      dosage: '10 mg',
      frequency: 'Once daily',
      indication: 'Blood pressure management',
      refillsRemaining: 2,
      nextRefill: 'Jan 5, 2025'
    },
    {
      name: 'Atorvastatin',
      dosage: '20 mg',
      frequency: 'Once daily',
      indication: 'Cholesterol management',
      refillsRemaining: 1,
      nextRefill: 'Jan 10, 2025'
    },
    {
      name: 'Metformin',
      dosage: '500 mg',
      frequency: 'Twice daily',
      indication: 'Blood sugar management',
      refillsRemaining: 3,
      nextRefill: 'Jan 20, 2025'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold">My Medications</h1>
          <p className="text-text-secondary">Track your current medications and reminders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-success/10">
            <p className="text-text-secondary text-sm">Active Medications</p>
            <p className="text-3xl font-display font-bold mt-2">5</p>
          </Card>
          <Card className="bg-gradient-to-br from-warning/10">
            <p className="text-text-secondary text-sm">Total Refills</p>
            <p className="text-3xl font-display font-bold mt-2">6</p>
          </Card>
          <Card className="bg-gradient-to-br from-brand-primary/10">
            <p className="text-text-secondary text-sm">Adherence Rate</p>
            <p className="text-3xl font-display font-bold mt-2">94%</p>
          </Card>
        </div>

        <div className="space-y-4">
          {medications.map((med, idx) => (
            <Card key={idx}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-display font-bold">{med.name}</h3>
                  <p className="text-sm text-text-secondary">{med.indication}</p>
                </div>
                <Badge variant="success">{med.dosage}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-border-default">
                <div className="flex gap-2">
                  <Clock size={16} className="text-text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-secondary">Frequency</p>
                    <p className="text-sm font-medium">{med.frequency}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Refills Remaining</p>
                  <p className="text-sm font-medium">{med.refillsRemaining}</p>
                </div>
              </div>

              <div className="text-xs text-text-secondary">
                Next refill eligible: {med.nextRefill}
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  Set Reminder
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  More Info
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="border-l-4 border-warning bg-warning/5">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Medication Side Effects?</p>
              <p className="text-xs text-text-secondary mt-1">
                Report any unusual symptoms to your doctor immediately.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
