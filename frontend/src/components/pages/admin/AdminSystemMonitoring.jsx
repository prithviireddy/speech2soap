import { AdminLayout } from '../../layouts/AdminLayout';
import { Card, Badge, Button } from '../../shared';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';

export const AdminSystemMonitoring = () => {
  const metrics = [
    { label: 'CPU Usage', value: '45%', status: 'normal', trend: '↑ 2%' },
    { label: 'Memory Usage', value: '62%', status: 'normal', trend: '↓ 1%' },
    { label: 'Disk Space', value: '78%', status: 'warning', trend: '↑ 5%' },
    { label: 'Network I/O', value: '256 Mbps', status: 'normal', trend: '↑ 12%' },
  ];

  const failedJobs = [
    {
      id: 542,
      timestamp: '2:15 PM',
      consultation: 'John Smith - Consultation',
      error: 'Audio transcription service timeout',
      retries: 1,
      maxRetries: 3
    },
    {
      id: 538,
      timestamp: '1:45 PM',
      consultation: 'Sarah Johnson - Followup',
      error: 'Speech diarization failed',
      retries: 2,
      maxRetries: 3
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold">System Monitoring</h1>
          <p className="text-text-secondary">Real-time system metrics and performance</p>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-secondary text-sm">{metric.label}</p>
                  <p className="text-3xl font-display font-bold mt-1">{metric.value}</p>
                  <p className="text-xs text-text-secondary mt-2">{metric.trend}</p>
                </div>
                <Badge variant={metric.status === 'normal' ? 'success' : 'warning'} size="sm">
                  {metric.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Failed Jobs */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">Failed Jobs</h2>
                <Badge variant="danger">{failedJobs.length}</Badge>
              </div>

              <div className="space-y-4">
                {failedJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-lg border-l-4 border-danger bg-danger/5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Job #{job.id}</p>
                        <p className="text-sm text-text-secondary">{job.consultation}</p>
                      </div>
                      <p className="text-xs text-text-secondary">{job.timestamp}</p>
                    </div>

                    <div className="mt-3 p-2 bg-white rounded border border-danger/30 text-xs">
                      <p className="text-danger font-medium">{job.error}</p>
                    </div>

                    <div className="mt-3 flex justify-between items-center text-xs">
                      <p className="text-text-secondary">
                        Retries: {job.retries}/{job.maxRetries}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">Retry</Button>
                        <Button variant="danger" size="sm">Discard</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Server Status */}
          <Card>
            <h2 className="text-lg font-display font-bold mb-6">Service Status</h2>
            <div className="space-y-3">
              {[
                { name: 'API Server', status: 'online', uptime: '99.8%' },
                { name: 'Database', status: 'online', uptime: '99.9%' },
                { name: 'Cache Server', status: 'online', uptime: '99.7%' },
                { name: 'Queue Service', status: 'online', uptime: '99.6%' },
                { name: 'Storage Service', status: 'online', uptime: '99.8%' },
              ].map((service, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border-default">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">{service.name}</p>
                    <Badge variant={service.status === 'online' ? 'success' : 'danger'} size="sm">
                      {service.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Uptime: {service.uptime}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance Chart Area */}
        <Card>
          <h2 className="text-2xl font-display font-bold mb-6">Performance Over Time</h2>
          <div className="h-64 bg-bg-base rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity size={32} className="text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary">Performance charts will display here</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
