import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Button, Badge } from '../../shared';
import { Users, Search, Plus } from 'lucide-react';
import { useState } from 'react';

export const DoctorPatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const patients = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1-555-0101', lastVisit: 'Today', consultations: 3 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1-555-0102', lastVisit: 'Yesterday', consultations: 5 },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+1-555-0103', lastVisit: '2 days ago', consultations: 2 },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', phone: '+1-555-0104', lastVisit: '1 week ago', consultations: 4 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold">Patient Management</h1>
            <p className="text-text-secondary">Manage your patient database</p>
          </div>
          <Button variant="primary" className="gap-2">
            <Plus size={18} />
            Add Patient
          </Button>
        </div>

        <Card>
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border-default">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Patient Name</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Last Visit</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Consultations</th>
                  <th className="text-right py-3 px-4 font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b border-border-default hover:bg-bg-base transition-colors">
                    <td className="py-3 px-4 font-medium">{patient.name}</td>
                    <td className="py-3 px-4 text-text-secondary">{patient.email}</td>
                    <td className="py-3 px-4 text-text-secondary">{patient.phone}</td>
                    <td className="py-3 px-4 text-text-secondary">{patient.lastVisit}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="info">{patient.consultations}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
