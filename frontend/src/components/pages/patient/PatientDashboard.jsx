import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, CalendarDays, User } from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button } from "../../shared";

import {
  getPatientProfile,
  getPatientReports,
} from "../../../api/patient";


export const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [patientData, reportsData] = await Promise.all([
          getPatientProfile(),
          getPatientReports(),
        ]);

        setPatient(patientData);
        setReports(reportsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);


  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-text-secondary">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }


  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-danger">
            {error}
          </p>
        </div>
      </DashboardLayout>
    );
  }


  const recentReports = reports.slice(0, 5);


  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold">
            Welcome back, {patient?.full_name || "Patient"}
          </h1>

          <p className="text-text-secondary">
            Here's an overview of your medical reports.
          </p>
        </div>


        {/* Patient Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-brand-primary/10 text-brand-primary">
                <User size={24} />
              </div>

              <div>
                <p className="text-sm text-text-secondary">
                  Patient Number
                </p>

                <p className="font-bold">
                  {patient?.patient_number || "-"}
                </p>
              </div>
            </div>
          </Card>


          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-medical/10 text-medical">
                <CalendarDays size={24} />
              </div>

              <div>
                <p className="text-sm text-text-secondary">
                  Date of Birth
                </p>

                <p className="font-bold">
                  {patient?.date_of_birth || "-"}
                </p>
              </div>
            </div>
          </Card>


          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10 text-success">
                <FileText size={24} />
              </div>

              <div>
                <p className="text-sm text-text-secondary">
                  Approved Reports
                </p>

                <p className="text-2xl font-bold">
                  {reports.length}
                </p>
              </div>
            </div>
          </Card>

        </div>


        {/* Recent Reports */}
        <Card>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">
              Recent Medical Reports
            </h2>

            <Link to="/patient/reports">
              <Button variant="ghost">
                View All →
              </Button>
            </Link>
          </div>


          {recentReports.length === 0 ? (
            <div className="py-10 text-center text-text-secondary">
              No medical reports available yet.
            </div>
          ) : (
            <div className="space-y-3">

              {recentReports.map((report) => (
                <Link
                  key={report.id}
                  to={`/patient/reports/${report.id}`}
                  className="block p-4 rounded-lg border border-border-default hover:border-brand-primary hover:shadow-sm hover:bg-brand-primary/5 transition-all"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <p className="font-display font-bold text-text-primary">
                        Medical Report
                      </p>

                      <p className="text-xs text-text-secondary mt-1">
                        {new Date(
                          report.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <Badge
                      variant="success"
                      size="sm"
                    >
                      ✓ Approved
                    </Badge>

                  </div>

                </Link>
              ))}

            </div>
          )}

        </Card>

      </div>
    </DashboardLayout>
  );
};
