import { useAuth } from '../../App.jsx';
import { DashboardLayout } from '../layouts';
import { Card, Badge, Button } from '../shared';
import { NotepadText,Pill,ClipboardClock ,Brain,Plus,Bot } from 'lucide-react';
export const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Consultations', value: '12', icon: <NotepadText /> },
    { label: 'Medications', value: '5', icon: <Pill /> },
    { label: 'Pending Follow-ups', value: '3', icon: <ClipboardClock /> },
    { label: 'Recent Insights', value: '8', icon:   <Brain /> }
  ];

  const consultations = [
    { date: 'Dec 15, 2024', doctor: 'Dr. Sarah Chen', complaint: 'Annual checkup', status: 'Reviewed' },
    { date: 'Dec 8, 2024', doctor: 'Dr. James Wilson', complaint: 'Persistent headaches', status: 'Reviewed' },
    { date: 'Nov 30, 2024', doctor: 'Dr. Rachel Adams', complaint: 'Back pain consultation', status: 'Pending' },
    { date: 'Nov 25, 2024', doctor: 'Dr. Michael Brown', complaint: 'Blood work review', status: 'Reviewed' },
    { date: 'Nov 18, 2024', doctor: 'Dr. Lisa Kumar', complaint: 'Allergy testing', status: 'Reviewed' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 className="pt-6 text-4xl font-display font-bold">Welcome back, {user?.name || 'Patient'}</h1>
          <p className="text-text-secondary text-lg">Last consultation: December 15, 2024 with Dr. Sarah Chen</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">{stat.label}</p>
                  <p className="text-3xl font-display font-bold mt-1">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</  div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 70% */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Consultations */}
            <Card>
              <h2 className="text-2xl font-display font-bold mb-6">Recent Consultations</h2>
              <div className="space-y-4">
                {consultations.map((consultation, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-border-default hover:border-brand-primary hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-text-primary">{consultation.date}</p>
                        <p className="text-sm text-text-secondary">{consultation.doctor}</p>
                      </div>
                      <Badge variant={consultation.status === 'Reviewed' ? 'success' : 'warning'} size="sm">
                        {consultation.status}
                      </Badge>
                    </div>
                    <p className="text-text-primary font-medium group-hover:text-brand-primary transition-colors">
                      {consultation.complaint}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border-default">
                <Button variant="ghost" className="text-base">View All History →</Button>
              </div>
            </Card>

            {/* Health Profile Quick View */}
            <Card>
              <h2 className="text-2xl font-display font-bold mb-6">Health Profile</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-text-secondary text-sm">Age</p>
                  <p className="text-xl font-medium">28 years</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Gender</p>
                  <p className="text-xl font-medium">Male</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Blood Type</p>
                  <p className="text-xl font-medium">O+</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Height/Weight</p>
                  <p className="text-xl font-medium">5'10" / 175 lbs</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <p className="text-sm text-text-secondary">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="danger">Penicillin</Badge>
                  <Badge variant="warning">Shellfish</Badge>
                </div>
              </div>
              <Button variant="secondary" className="w-full">Edit Profile</Button>
            </Card>
          </div>

          {/* Right Column - 30% */}
          <div className="space-y-8">
            {/* Upcoming Follow-ups */}
            <Card>
              <h2 className="text-lg font-display font-bold mb-4">Upcoming Follow-ups</h2>
              <div className="space-y-3">
                {[
                  { task: 'Lab work review', date: '2 days', priority: 'danger' },
                  { task: 'Blood pressure check', date: '5 days', priority: 'warning' },
                  { task: 'Physical therapy', date: '1 week', priority: 'success' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 hover:bg-bg-base rounded-lg transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.task}</p>
                      <p className="text-xs text-text-secondary">{item.date}</p>
                    </div>
                    <Badge variant={item.priority} size="sm"></Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Current Medications */}
            <Card>
              <h2 className="text-lg font-display font-bold mb-4">Current Medications</h2>
              <div className="space-y-3">
                {[
                  { name: 'Lisinopril', dose: '10 mg', freq: 'Daily' },
                  { name: 'Atorvastatin', dose: '20 mg', freq: 'Daily' },
                  { name: 'Metformin', dose: '500 mg', freq: '2x daily' }
                ].map((med, idx) => (
                  <div key={idx} className="p-3 bg-bg-base rounded-lg">
                    <p className="font-medium text-sm">{med.name}</p>
                    <p className="text-xs text-text-secondary">{med.dose} • {med.freq}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-base">Manage Medications</Button>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                <Plus />
                Upload New Consultation
              </Button>

              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Bot />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
