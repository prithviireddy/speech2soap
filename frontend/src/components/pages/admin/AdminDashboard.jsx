import { AdminLayout } from '../../layouts/AdminLayout';
import { Card, Badge, Button } from '../../shared';
import { Users, FileText, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

export const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '487', change: '+12%', icon: <Users size={24} />, color: 'blue' },
    { label: 'Active Doctors', value: '156', change: '+3', icon: <FileText size={24} />, color: 'green' },
    { label: 'Consultations (Today)', value: '342', change: '+28%', icon: <Activity size={24} />, color: 'orange' },
    { label: 'System Health', value: '99.8%', change: 'Excellent', icon: <TrendingUp size={24} />, color: 'success' }
  ];

  const recentActivity = [
    { timestamp: '2:30 PM', action: 'User john.smith registered', type: 'user' },
    { timestamp: '2:15 PM', action: 'Report generation failed (Job ID: 542)', type: 'error' },
    { timestamp: '2:00 PM', action: 'Dr. Sarah Chen approved 5 reports', type: 'success' },
    { timestamp: '1:45 PM', action: 'System backup completed successfully', type: 'success' },
    { timestamp: '1:30 PM', action: 'Patient emma.davis requested data export', type: 'user' },
  ];

  const colorMap = {
    blue: 'from-brand-primary to-medical',
    green: 'from-success to-success/60',
    orange: 'from-warning to-warning/60',
    success: 'from-success to-success/60'
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-text-secondary">System overview and monitoring</p>
        </div>

        {/* Alert */}
        <Card className="border-l-4 border-warning bg-warning/5">
          <div className="flex gap-3">
            <AlertTriangle size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">1 Failed Job Detected</p>
              <p className="text-xs text-text-secondary mt-1">
                Report generation failed for job #542. Requires manual review.
              </p>
              <Button variant="danger" size="sm" className="mt-2">Review Now</Button>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-all">
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">{stat.label}</p>
                  <p className="text-3xl font-display font-bold mt-1">{stat.value}</p>
                  <p className={`text-xs mt-2 ${
                    stat.change.includes('+') || stat.change === 'Excellent' ? 'text-success' : 'text-warning'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`text-4xl p-3 rounded-lg bg-gradient-to-br ${colorMap[stat.color]} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-display font-bold mb-6">Recent Activity</h2>
              <div className="space-y-2">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border-default hover:border-danger transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-text-secondary mt-1">{activity.timestamp}</p>
                      </div>
                      <Badge
                        variant={
                          activity.type === 'error' ? 'danger' : activity.type === 'success' ? 'success' : 'info'
                        }
                        size="sm"
                      >
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-display font-bold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2">
                  <p className="text-sm">API Server</p>
                  <Badge variant="success">🟢 Online</Badge>
                </div>
                <div className="flex justify-between items-center p-2">
                  <p className="text-sm">Database</p>
                  <Badge variant="success">🟢 Online</Badge>
                </div>
                <div className="flex justify-between items-center p-2">
                  <p className="text-sm">Queue Service</p>
                  <Badge variant="success">🟢 Online</Badge>
                </div>
                <div className="flex justify-between items-center p-2">
                  <p className="text-sm">Storage</p>
                  <Badge variant="success">🟢 Online</Badge>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-display font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-center text-sm">
                  View Audit Logs
                </Button>
                <Button variant="secondary" className="w-full justify-center text-sm">
                  Manage Users
                </Button>
                <Button variant="secondary" className="w-full justify-center text-sm">
                  System Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
