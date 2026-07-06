import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Button, Badge } from '../../shared';
import { useParams } from 'react-router-dom';

export const DoctorReportReview = () => {
  const { reportId } = useParams();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold">Report Review</h1>
          <p className="text-text-secondary">Review and approve generated clinical report</p>
        </div>

        <Card>
          <div className="text-center py-12">
            <p className="text-xl font-display font-bold mb-2">Patient Consultation Report</p>
            <p className="text-text-secondary">Report ID: {reportId}</p>
            <div className="mt-8 space-y-4">
              <Button variant="primary">Review Report</Button>
              <Button variant="secondary">Edit Report</Button>
              <Button variant="secondary">Approve & Share</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
