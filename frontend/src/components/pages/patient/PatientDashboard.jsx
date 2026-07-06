import { useAuth } from '../../../context/AuthContext';
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button } from '../../shared';
import { FileText, Pill, CheckCheck, TrendingUp, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PatientDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Approved Reports', value: '8', icon: <FileText size={24} />, color: 'blue' },
    { label: 'Current Medications', value: '5', icon: <Pill size={24} />, color: 'green' },
    { label: 'Upcoming Followups', value: '2', icon: <CheckCheck size={24} />, color: 'orange' },
    { label: 'Health Insights', value: '12', icon: <TrendingUp size={24} />, color: 'purple' }
  ];

  const recentReports = [
    { id: 1, date: 'Dec 15, 2024', doctor: 'Dr. Sarah Chen', type: 'Annual Checkup', diagnosis: 'Healthy' },
    { id: 2, date: 'Dec 8, 2024', doctor: 'Dr. James Wilson', type: 'Follow-up', diagnosis: 'Under control' },
    { id: 3, date: 'Nov 30, 2024', doctor: 'Dr. Rachel Adams', type: 'Consultation', diagnosis: 'Stable' },
  ];

  const upcomingFollowups = [
    { id: 1, task: 'Lab work review', dueDate: '2 days', priority: 'danger' },
    { id: 2, task: 'Blood pressure check', dueDate: '5 days', priority: 'warning' },
  ];

  const colorMap = {
    blue: 'from-brand-primary to-medical',
    green: 'from-success to-success/60',
    orange: 'from-warning to-warning/60',
    purple: 'from-medical/80 to-brand-primary'
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold">Welcome back, {user?.name || 'Patient'}</h1>
          <p className="text-text-secondary">December 15, 2024 • Your health at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-all">
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">{stat.label}</p>
                  <p className="text-3xl font-display font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`text-4xl p-3 rounded-lg bg-gradient-to-br ${colorMap[stat.color]} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Reports */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <h2 className="text-2xl font-display font-bold mb-6">Recent Medical Reports</h2>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <Link
                    key={report.id}
                    to={`/patient/reports`}
                    className="p-4 rounded-lg border border-border-default hover:border-brand-primary hover:shadow-sm hover:bg-brand-primary/5 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-display font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                          {report.type}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {report.date} • {report.doctor}
                        </p>
                      </div>
                      <Badge variant="success" size="sm">
                        ✓ Approved
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">{report.diagnosis}</p>
                  </Link>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border-default">
                <Link to="/patient/reports">
                  <Button variant="ghost" className="w-full justify-center">
                    View All Reports →
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Upcoming Followups */}
            <Card>
              <h3 className="text-lg font-display font-bold mb-4">Upcoming Followups</h3>
              <div className="space-y-3">
                {upcomingFollowups.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-bg-base rounded-lg transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.task}</p>
                      <p className="text-xs text-text-secondary">{item.dueDate}</p>
                    </div>
                    <Badge variant={item.priority} size="sm"></Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border-default">
                <Link to="/patient/followups">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Current Medications */}
            <Card>
              <h3 className="text-lg font-display font-bold mb-4">Current Medications</h3>
              <div className="space-y-2 text-sm">
                <p className="text-text-secondary">You're taking <strong>5 medications</strong></p>
                <ul className="space-y-1 text-text-secondary">
                  <li>• Lisinopril 10mg (Daily)</li>
                  <li>• Atorvastatin 20mg (Daily)</li>
                  <li>• Metformin 500mg (2x daily)</li>
                </ul>
              </div>
              <div className="mt-4 pt-4 border-t border-border-default">
                <Link to="/patient/medications">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Health Tips */}
            <Card className="border-l-4 border-success bg-success/5">
              <h3 className="text-lg font-display font-bold mb-3">💡 Health Tip</h3>
              <p className="text-sm text-text-secondary">
                Take your medications at the same time each day for better adherence and results.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
