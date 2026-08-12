import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";

import {
  getPatientReports,
  getPatientReport,
} from "../../../api/patient";


const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="h-8 w-1 rounded-full bg-brand-primary" />

    <h2 className="text-xl font-display font-bold">
      {children}
    </h2>
  </div>
);


const EmptyField = () => (
  <p className="text-sm text-text-secondary italic">
    No information documented.
  </p>
);


const ReadOnlyList = ({ items }) => {
  if (!items || items.length === 0) {
    return <EmptyField />;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3"
        >
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-primary shrink-0" />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};


const ReadOnlyField = ({ label, items }) => (
  <div>
    <h3 className="font-semibold mb-2">
      {label}
    </h3>

    <ReadOnlyList items={items} />
  </div>
);


const normalizeReport = (reportJson) => {
  const report = reportJson || {};

  return {
    summary:
      typeof report.summary === "string"
        ? report.summary
        : "",

    soap: {
      subjective: Array.isArray(report.soap?.subjective)
        ? report.soap.subjective
        : [],

      objective: Array.isArray(report.soap?.objective)
        ? report.soap.objective
        : [],

      assessment: Array.isArray(report.soap?.assessment)
        ? report.soap.assessment
        : [],

      plan: Array.isArray(report.soap?.plan)
        ? report.soap.plan
        : [],
    },

    entities: {
      duration: Array.isArray(report.entities?.duration)
        ? report.entities.duration
        : [],

      symptoms: Array.isArray(report.entities?.symptoms)
        ? report.entities.symptoms
        : [],

      diagnosis: Array.isArray(report.entities?.diagnosis)
        ? report.entities.diagnosis
        : [],

      medications: Array.isArray(report.entities?.medications)
        ? report.entities.medications
        : [],
    },

    clinical_report: {
      allergies: Array.isArray(
        report.clinical_report?.allergies
      )
        ? report.clinical_report.allergies
        : [],

      diagnosis: Array.isArray(
        report.clinical_report?.diagnosis
      )
        ? report.clinical_report.diagnosis
        : [],

      medications: Array.isArray(
        report.clinical_report?.medications
      )
        ? report.clinical_report.medications
        : [],

      key_findings: Array.isArray(
        report.clinical_report?.key_findings
      )
        ? report.clinical_report.key_findings
        : [],

      treatment_plan: Array.isArray(
        report.clinical_report?.treatment_plan
      )
        ? report.clinical_report.treatment_plan
        : [],

      follow_up_tasks: Array.isArray(
        report.clinical_report?.follow_up_tasks
      )
        ? report.clinical_report.follow_up_tasks
        : [],
    },
  };
};


export const PatientReportViewer = () => {
  const { reportId } = useParams();

  const [reports, setReports] = useState([]);
  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchData();
  }, [reportId]);


  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      if (reportId) {
        const data = await getPatientReport(reportId);
        setReport(data);
      } else {
        const data = await getPatientReports();
        setReports(data);
      }

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load report."
      );
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }


  if (error) {
    return (
      <DashboardLayout>
        <Card>
          <div className="flex flex-col items-center py-10 text-center">

            <AlertCircle
              size={40}
              className="text-danger mb-4"
            />

            <p className="text-danger">
              {error}
            </p>

            <Button
              variant="secondary"
              onClick={fetchData}
              className="mt-4"
            >
              Try Again
            </Button>

          </div>
        </Card>
      </DashboardLayout>
    );
  }


  /*
   * REPORT LIST
   */

  if (!reportId) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-8">

          <div>
            <h1 className="text-4xl font-display font-bold">
              Medical Reports
            </h1>

            <p className="text-text-secondary mt-2">
              View your approved medical reports.
            </p>
          </div>


          {reports.length === 0 ? (
            <Card>
              <div className="py-12 text-center">

                <FileText
                  size={48}
                  className="mx-auto text-text-secondary mb-4"
                />

                <h2 className="text-xl font-display font-bold">
                  No reports available
                </h2>

                <p className="text-text-secondary mt-2">
                  Your approved reports will appear here.
                </p>

              </div>
            </Card>
          ) : (
            <div className="space-y-4">

              {reports.map((item) => (
                <Link
                  key={item.id}
                  to={`/patient/reports/${item.id}`}
                  className="block"
                >
                  <Card className="hover:border-brand-primary hover:shadow-md transition-all">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-4">

                        <div className="p-3 rounded-lg bg-brand-primary/10 text-brand-primary">
                          <FileText size={24} />
                        </div>

                        <div>
                          <h2 className="font-display font-bold text-lg">
                            Medical Report
                          </h2>

                          <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                            <CalendarDays size={14} />

                            {item.created_at
                              ? new Date(
                                  item.created_at
                                ).toLocaleDateString()
                              : "Date unavailable"}
                          </div>
                        </div>

                      </div>


                      <Badge
                        variant="success"
                        size="sm"
                      >
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={14} />
                          Approved
                        </span>
                      </Badge>

                    </div>

                  </Card>
                </Link>
              ))}

            </div>
          )}

        </div>
      </DashboardLayout>
    );
  }


  /*
   * SINGLE REPORT
   */

  if (!report) {
    return null;
  }


  const formData = normalizeReport(
    report.report_json
  );


  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}

        <div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            <div>

              <h1 className="text-4xl font-display font-bold">
                Medical Report
              </h1>

              <p className="text-text-secondary mt-2">
                Your clinical report from the consultation.
              </p>

            </div>


            <Badge variant="success">

              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                APPROVED
              </span>

            </Badge>

          </div>


          <div className="flex items-center gap-2 text-sm text-text-secondary mt-3">
            <CalendarDays size={16} />

            {report.created_at
              ? new Date(
                  report.created_at
                ).toLocaleDateString()
              : "Date unavailable"}
          </div>

        </div>


        {/* Clinical Summary */}

        <Card>

          <SectionTitle>
            Clinical Summary
          </SectionTitle>

          {formData.summary ? (
            <p className="leading-7">
              {formData.summary}
            </p>
          ) : (
            <EmptyField />
          )}

        </Card>


        {/* SOAP */}

        <Card>

          <SectionTitle>
            SOAP Notes
          </SectionTitle>

          <div className="space-y-8">

            <ReadOnlyField
              label="Subjective"
              items={formData.soap.subjective}
            />

            <ReadOnlyField
              label="Objective"
              items={formData.soap.objective}
            />

            <ReadOnlyField
              label="Assessment"
              items={formData.soap.assessment}
            />

            <ReadOnlyField
              label="Plan"
              items={formData.soap.plan}
            />

          </div>

        </Card>


        {/* Clinical Report */}

        <Card>

          <SectionTitle>
            Clinical Report
          </SectionTitle>

          <div className="space-y-8">

            <ReadOnlyField
              label="Key Findings"
              items={
                formData.clinical_report.key_findings
              }
            />

            <ReadOnlyField
              label="Diagnosis"
              items={
                formData.clinical_report.diagnosis
              }
            />

            <ReadOnlyField
              label="Medications"
              items={
                formData.clinical_report.medications
              }
            />

            <ReadOnlyField
              label="Allergies"
              items={
                formData.clinical_report.allergies
              }
            />

            <ReadOnlyField
              label="Treatment Plan"
              items={
                formData.clinical_report.treatment_plan
              }
            />

            <ReadOnlyField
              label="Follow-up Tasks"
              items={
                formData.clinical_report.follow_up_tasks
              }
            />

          </div>

        </Card>


        {/* Extracted Entities */}

        <Card>

          <SectionTitle>
            Extracted Entities
          </SectionTitle>

          <div className="space-y-8">

            <ReadOnlyField
              label="Symptoms"
              items={formData.entities.symptoms}
            />

            <ReadOnlyField
              label="Duration"
              items={formData.entities.duration}
            />

            <ReadOnlyField
              label="Diagnosis"
              items={formData.entities.diagnosis}
            />

            <ReadOnlyField
              label="Medications"
              items={formData.entities.medications}
            />

          </div>

        </Card>


        {/* Back */}

        <div>

          <Link to="/patient/reports">

            <Button
              variant="secondary"
              className="gap-2"
            >
              <ArrowLeft size={18} />
              Back to Reports
            </Button>

          </Link>

        </div>

      </div>
    </DashboardLayout>
  );
};
