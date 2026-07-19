import { useAuth } from '../../../context/AuthContext';
import { Card, Badge, Button } from '../../shared';
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Users, FileText, Clock, AlertCircle, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorDashboard = () => {
  const { user } = useAuth();

  // const stats = [
  //     {
  //         label: "Today's Appointments",
  //         value: "8",
  //         icon: <CalendarDays />,
  //     },

  //     {
  //         label: "Pending Reports",
  //         value: "3",
  //         icon: <Clock />,
  //     },

  //     {
  //         label: "Consultations Processing",
  //         value: "1",
  //         icon: <Activity />,
  //     },

  //     {
  //         label: "Approved Today",
  //         value: "5",
  //         icon: <CheckCircle />,
  //     },
  // ];

  const appointments = [
      {
          patient: "John Doe",
          time: "09:00 AM",
          status: "SCHEDULED",
      },
      {
          patient: "Jane Doe",
          time: "09:30 AM",
          status: "CHECKED_IN",
      },
      {
          patient: "Alex",
          time: "10:00 AM",
          status: "IN_PROGRESS",
      },
  ];

  const pendingReports = [
      {
          patient: "John Doe",
          status: "READY_FOR_REVIEW",
      },

      {
          patient: "Jane Doe",
          status: "READY_FOR_REVIEW",
      },
  ];

  const processing = [
      {
          patient: "Sarah Doe",
          progress: 75,
          stage: "Speaker Diarization",
      },

      {
          patient: "Michael",
          progress: 40,
          stage: "Transcribing Audio",
      },
  ];

  const approvedReports = [
      {
          patient: "John Doe",
          approvedAt: "5 mins ago",
      },

      {
          patient: "Jane Doe",
          approvedAt: "Today",
      },
  ];

  

  return (
    <DashboardLayout>
    <h1>Welcome back, Dr. {user?.name}</h1>

    <Card>
        Today's Appointments
    </Card>

    <Card>
        Pending Reports
    </Card>

    <Card>
        Consultations Processing
    </Card>

    <Card>
        Recent Approved Reports
    </Card>
</DashboardLayout>
  );
};
