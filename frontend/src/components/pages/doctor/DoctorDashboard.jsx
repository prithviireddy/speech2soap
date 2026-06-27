import { useAuth } from '../../../context/AuthContext';
import { DoctorLayout } from '../../layouts/DoctorLayout';
import { Card, Badge, Button } from '../../shared';
import { Users, FileText, Clock, AlertCircle, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Patients', value: '48', icon: <Users size={24} />, color: 'blue' },
    { label: 'Total Consultations', value: '156', icon: <FileText size={24} />, color: 'green' },
    { label: 'Pending Reviews', value: '5', icon: <Clock size={24} />, color: 'orange', highlight: true },
    { label: 'This Week Insights', value: '24', icon: <TrendingUp size={24} />, color: 'purple' }
  ];

  const pendingReviews = [
    {
      id: 1,
      patientName: 'John Smith',
      date: 'Today 2:30 PM',
      complaint: 'Persistent headaches',
      duration: '15 min',
      status: 'ready'
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      date: 'Yesterday 10:15 AM',
      complaint: 'Follow-up checkup',
      duration: '12 min',
      status: 'ready'
    },
    {
      id: 3,
      patientName: 'Michael Brown',
      date: 'Dec 14, 3:00 PM',
      complaint: 'Annual physical',
      duration: '25 min',
      status: 'ready'
    },
    {
      id: 4,
      patientName: 'Emma Davis',
      date: 'Dec 14, 1:45 PM',
      complaint: 'Lab result review',
      duration: '8 min',
      status: 'ready'
    },
    {
      id: 5,
      patientName: 'Robert Wilson',
      date: 'Dec 13, 4:20 PM',
      complaint: 'Blood pressure check',
      duration: '10 min',
      status: 'ready'
    }
  ];

  const recentConsultations = [
    { date: 'Today', time: '2:30 PM', patient: 'John Smith', status: 'approved', diagnosis: 'Tension headache' },
    { date: 'Yesterday', time: '10:15 AM', patient: 'Sarah Johnson', status: 'approved', diagnosis: 'Hypertension' },
    { date: 'Dec 14', time: '3:00 PM', patient: 'Michael Brown', status: 'approved', diagnosis: 'Healthy' },
    { date: 'Dec 14', time: '1:45 PM', patient: 'Emma Davis', status: 'approved', diagnosis: 'Elevated cholesterol' },
  ];

  const colorMap = {
    blue: 'from-brand-primary to-medical',
    green: 'from-success to-success/60',
    orange: 'from-warning to-warning/60',
    purple: 'from-medical/80 to-brand-primary'
  };

  return (
    <DoctorLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold">Welcome back, {user?.name || 'Doctor'}</h1>
          <p className="text-text-secondary">Today is December 15, 2024 • 5 pending reviews waiting</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className={`relative overflow-hidden hover:shadow-md transition-all ${
                stat.highlight ? 'ring-2 ring-warning' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-10 pointer-events-none" />
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
          {/* Left Column - Pending Reviews & Recent */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Reviews */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">Pending Reviews</h2>
                <Badge variant="danger">{pendingReviews.length}</Badge>
              </div>

              <div className="space-y-3">
                {pendingReviews.map((review) => (
                  <Link
                    key={review.id}
                    to={`/doctor/reports/${review.id}`}
                    className="p-4 rounded-lg border border-border-default hover:border-brand-primary hover:shadow-sm hover:bg-brand-primary/5 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-display font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                          {review.patientName}
                        </p>
                        <p className="text-xs text-text-secondary">{review.date}</p>
                      </div>
                      <Badge variant="info" size="sm">
                        {review.duration} recording
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary">{review.complaint}</p>
                  </Link>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border-default">
                <Button variant="secondary" className="w-full justify-center">
                  View All Pending →
                </Button>
              </div>
            </Card>

            {/* Recent Consultations */}
            <Card>
              <h2 className="text-2xl font-display font-bold mb-6">Recently Approved</h2>
              <div className="space-y-3">
                {recentConsultations.map((consultation, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-border-default hover:border-brand-primary transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{consultation.patient}</p>
                        <p className="text-xs text-text-secondary">
                          {consultation.date} at {consultation.time}
                        </p>
                      </div>
                      <Badge variant="success" size="sm">
                        ✓ Approved
                      </Badge>
                    </div>
                    <p className="text-sm text-text-primary mt-2">{consultation.diagnosis}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="space-y-3">
              <h3 className="text-lg font-display font-bold">Quick Actions</h3>
              <Link to="/upload">
                <Button variant="primary" className="w-full justify-center gap-2">
                  <Plus size={18} />
                  New Consultation
                </Button>
              </Link>
              <Link to="/doctor/patients">
                <Button variant="secondary" className="w-full justify-center">
                  Manage Patients
                </Button>
              </Link>
              <Link to="/doctor/followups">
                <Button variant="secondary" className="w-full justify-center">
                  View Followups
                </Button>
              </Link>
              <Link to="/doctor/assistant">
                <Button variant="secondary" className="w-full justify-center">
                  AI Assistant
                </Button>
              </Link>
            </Card>

            {/* Patient Summary */}
            <Card>
              <h3 className="text-lg font-display font-bold mb-4">Patient Summary</h3>
              <div className="space-y-3">
                <div className="p-3 bg-bg-base rounded-lg">
                  <p className="text-xs text-text-secondary">Active Patients</p>
                  <p className="text-2xl font-display font-bold">48</p>
                </div>
                <div className="p-3 bg-bg-base rounded-lg">
                  <p className="text-xs text-text-secondary">This Month</p>
                  <p className="text-2xl font-display font-bold">32</p>
                </div>
                <div className="p-3 bg-bg-base rounded-lg">
                  <p className="text-xs text-text-secondary">Avg. Session Length</p>
                  <p className="text-2xl font-display font-bold">14 min</p>
                </div>
              </div>
            </Card>

            {/* System Status */}
            <Card className="border-l-4 border-success">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <p className="text-sm font-medium">System Status</p>
                  <p className="text-xs text-text-secondary">All systems operational</p>
                  <p className="text-xs text-text-secondary mt-1">Last backup: 2 hrs ago</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};
