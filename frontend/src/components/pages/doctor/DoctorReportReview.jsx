import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Badge, Button, LoadingSpinner } from "../../shared";

import {
  getDoctorReportAPI,
  updateDoctorReportAPI,
  approveDoctorReportAPI,
} from "../../../api/doctor";


const EMPTY_REPORT = {
  soap: {
    subjective: [],
    objective: [],
    assessment: [],
    plan: [],
  },

  summary: "",

  entities: {
    duration: [],
    symptoms: [],
    diagnosis: [],
    medications: [],
  },

  clinical_report: {
    allergies: [],
    diagnosis: [],
    medications: [],
    key_findings: [],
    treatment_plan: [],
    follow_up_tasks: [],
  },
};


const createEmptyReport = () => ({
  soap: {
    subjective: [],
    objective: [],
    assessment: [],
    plan: [],
  },

  summary: "",

  entities: {
    duration: [],
    symptoms: [],
    diagnosis: [],
    medications: [],
  },

  clinical_report: {
    allergies: [],
    diagnosis: [],
    medications: [],
    key_findings: [],
    treatment_plan: [],
    follow_up_tasks: [],
  },
});


const normalizeReport = (reportJson) => {
  const report = reportJson || {};

  return {
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

    summary:
      typeof report.summary === "string"
        ? report.summary
        : "",

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


const EditableList = ({
  label,
  items,
  onChange,
  disabled,
}) => {
  const updateItem = (index, value) => {
    const updated = [...items];

    updated[index] = value;

    onChange(updated);
  };


  const addItem = () => {
    onChange([...items, ""]);
  };


  const removeItem = (index) => {
    const updated = items.filter(
      (_, itemIndex) => itemIndex !== index
    );

    onChange(updated);
  };


  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">
          {label}
        </h3>

        {!disabled && (
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-sm text-brand-primary hover:underline"
          >
            <Plus size={16} />
            Add
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-text-secondary italic">
          No information documented.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2"
            >
              <textarea
                value={item}
                onChange={(event) =>
                  updateItem(
                    index,
                    event.target.value
                  )
                }
                disabled={disabled}
                rows={2}
                className="flex-1 px-3 py-2 border border-border-default rounded-lg bg-bg-base resize-y focus:outline-none focus:border-brand-primary"
              />

              {!disabled && (
                <button
                  type="button"
                  onClick={() =>
                    removeItem(index)
                  }
                  className="p-2 text-danger hover:bg-bg-base rounded-lg"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export const DoctorReportReview = () => {
  const { reportId } = useParams();

  const [report, setReport] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState(
    createEmptyReport()
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    fetchReport();
  }, [reportId]);


  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await getDoctorReportAPI(
        reportId
      );

      setReport(data);

      setFormData(
        normalizeReport(data.report_json)
      );

      /*
       * Approved reports should always open
       * in read-only mode.
       */
      setEditMode(false);

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load report."
      );
    } finally {
      setLoading(false);
    }
  };


  const updateSoap = (field, value) => {
    setFormData((previous) => ({
      ...previous,

      soap: {
        ...previous.soap,
        [field]: value,
      },
    }));
  };


  const updateEntities = (field, value) => {
    setFormData((previous) => ({
      ...previous,

      entities: {
        ...previous.entities,
        [field]: value,
      },
    }));
  };


  const updateClinicalReport = (
    field,
    value
  ) => {
    setFormData((previous) => ({
      ...previous,

      clinical_report: {
        ...previous.clinical_report,
        [field]: value,
      },
    }));
  };


  const handleSummaryChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      summary: event.target.value,
    }));
  };


  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedReport =
        await updateDoctorReportAPI(
          reportId,
          {
            report_json: formData,
          }
        );

      setReport(updatedReport);

      setFormData(
        normalizeReport(
          updatedReport.report_json
        )
      );

      setEditMode(false);

      setSuccess(
        "Report saved successfully."
      );

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to save report."
      );
    } finally {
      setSaving(false);
    }
  };


  const handleApprove = async () => {
    try {
      setApproving(true);
      setError("");
      setSuccess("");

      /*
       * Save current edits first.
       *
       * This makes sure the version being approved
       * is exactly what the doctor currently sees.
       */
      if (editMode) {
        await updateDoctorReportAPI(
          reportId,
          {
            report_json: formData,
          }
        );
      }

      await approveDoctorReportAPI(
        reportId
      );

      /*
       * Update local state instead of making
       * another GET request.
       */
      setReport((previous) => ({
        ...previous,
        report_json: formData,
        is_approved: true,
      }));

      setEditMode(false);

      setSuccess(
        "Report approved successfully."
      );

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to approve report."
      );
    } finally {
      setApproving(false);
    }
  };


  const handleCancelEdit = () => {
    if (!report) {
      return;
    }

    setFormData(
      normalizeReport(report.report_json)
    );

    setEditMode(false);
    setError("");
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


  if (error && !report) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-danger">
            {error}
          </p>

          <Button
            variant="secondary"
            onClick={fetchReport}
            className="mt-4"
          >
            Try Again
          </Button>
        </Card>
      </DashboardLayout>
    );
  }


  if (!report) {
    return null;
  }


  const readOnly = report.is_approved || !editMode;


  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}

        <div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            <div>
              <h1 className="text-4xl font-display font-bold">
                Report Review
              </h1>

              <p className="text-text-secondary mt-2">
                Review the AI-generated clinical report
                before approval.
              </p>
            </div>

            <Badge
              variant={
                report.is_approved
                  ? "success"
                  : "warning"
              }
            >
              <span className="flex items-center gap-2">
                {report.is_approved && (
                  <CheckCircle2 size={16} />
                )}

                {report.is_approved
                  ? "APPROVED"
                  : "REVIEW PENDING"}
              </span>
            </Badge>

          </div>
        </div>


        {/* Error */}

        {error && (
          <Card>
            <p className="text-danger text-sm">
              {error}
            </p>
          </Card>
        )}


        {/* Success */}

        {success && (
          <Card>
            <p className="text-success text-sm">
              {success}
            </p>
          </Card>
        )}


        {/* Clinical Summary */}

        <Card>
          <SectionTitle>
            Clinical Summary
          </SectionTitle>

          {readOnly ? (
            formData.summary ? (
              <p className="leading-7">
                {formData.summary}
              </p>
            ) : (
              <EmptyField />
            )
          ) : (
            <textarea
              value={formData.summary}
              onChange={handleSummaryChange}
              rows={5}
              className="w-full px-4 py-3 border border-border-default rounded-lg bg-bg-base resize-y focus:outline-none focus:border-brand-primary"
              placeholder="Enter clinical summary..."
            />
          )}
        </Card>


        {/* SOAP */}

        <Card>
          <SectionTitle>
            SOAP Notes
          </SectionTitle>

          <div className="space-y-8">

            {readOnly ? (
              <>
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
              </>
            ) : (
              <>
                <EditableList
                  label="Subjective"
                  items={formData.soap.subjective}
                  onChange={(value) =>
                    updateSoap(
                      "subjective",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Objective"
                  items={formData.soap.objective}
                  onChange={(value) =>
                    updateSoap(
                      "objective",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Assessment"
                  items={formData.soap.assessment}
                  onChange={(value) =>
                    updateSoap(
                      "assessment",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Plan"
                  items={formData.soap.plan}
                  onChange={(value) =>
                    updateSoap(
                      "plan",
                      value
                    )
                  }
                  disabled={false}
                />
              </>
            )}

          </div>
        </Card>


        {/* Clinical Report */}

        <Card>
          <SectionTitle>
            Clinical Report
          </SectionTitle>

          <div className="space-y-8">

            {readOnly ? (
              <>
                <ReadOnlyField
                  label="Key Findings"
                  items={
                    formData.clinical_report
                      .key_findings
                  }
                />

                <ReadOnlyField
                  label="Diagnosis"
                  items={
                    formData.clinical_report
                      .diagnosis
                  }
                />

                <ReadOnlyField
                  label="Medications"
                  items={
                    formData.clinical_report
                      .medications
                  }
                />

                <ReadOnlyField
                  label="Allergies"
                  items={
                    formData.clinical_report
                      .allergies
                  }
                />

                <ReadOnlyField
                  label="Treatment Plan"
                  items={
                    formData.clinical_report
                      .treatment_plan
                  }
                />

                <ReadOnlyField
                  label="Follow-up Tasks"
                  items={
                    formData.clinical_report
                      .follow_up_tasks
                  }
                />
              </>
            ) : (
              <>
                <EditableList
                  label="Key Findings"
                  items={
                    formData.clinical_report
                      .key_findings
                  }
                  onChange={(value) =>
                    updateClinicalReport(
                      "key_findings",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Diagnosis"
                  items={
                    formData.clinical_report
                      .diagnosis
                  }
                  onChange={(value) =>
                    updateClinicalReport(
                      "diagnosis",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Medications"
                  items={
                    formData.clinical_report
                      .medications
                  }
                  onChange={(value) =>
                    updateClinicalReport(
                      "medications",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Allergies"
                  items={
                    formData.clinical_report
                      .allergies
                  }
                  onChange={(value) =>
                    updateClinicalReport(
                      "allergies",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Treatment Plan"
                  items={
                    formData.clinical_report
                      .treatment_plan
                  }
                  onChange={(value) =>
                    updateClinicalReport(
                      "treatment_plan",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Follow-up Tasks"
                  items={
                    formData.clinical_report
                      .follow_up_tasks
                  }
                  onChange={(value) =>
                    updateClinicalReport(
                      "follow_up_tasks",
                      value
                    )
                  }
                  disabled={false}
                />
              </>
            )}

          </div>
        </Card>


        {/* Extracted Entities */}

        <Card>
          <SectionTitle>
            Extracted Entities
          </SectionTitle>

          <div className="space-y-8">

            {readOnly ? (
              <>
                <ReadOnlyField
                  label="Symptoms"
                  items={
                    formData.entities.symptoms
                  }
                />

                <ReadOnlyField
                  label="Duration"
                  items={
                    formData.entities.duration
                  }
                />

                <ReadOnlyField
                  label="Diagnosis"
                  items={
                    formData.entities.diagnosis
                  }
                />

                <ReadOnlyField
                  label="Medications"
                  items={
                    formData.entities.medications
                  }
                />
              </>
            ) : (
              <>
                <EditableList
                  label="Symptoms"
                  items={
                    formData.entities.symptoms
                  }
                  onChange={(value) =>
                    updateEntities(
                      "symptoms",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Duration"
                  items={
                    formData.entities.duration
                  }
                  onChange={(value) =>
                    updateEntities(
                      "duration",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Diagnosis"
                  items={
                    formData.entities.diagnosis
                  }
                  onChange={(value) =>
                    updateEntities(
                      "diagnosis",
                      value
                    )
                  }
                  disabled={false}
                />

                <EditableList
                  label="Medications"
                  items={
                    formData.entities.medications
                  }
                  onChange={(value) =>
                    updateEntities(
                      "medications",
                      value
                    )
                  }
                  disabled={false}
                />
              </>
            )}

          </div>
        </Card>


        {/* Actions */}

        <Card>
          <div className="flex flex-col sm:flex-row gap-3">

            <Link
              to={`/doctor/consultations/${report.consultation_id}`}
              className="flex-1"
            >
              <Button
                variant="secondary"
                className="w-full"
              >
                Back to Consultation
              </Button>
            </Link>


            {!report.is_approved && !editMode && (
              <Button
                variant="secondary"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setEditMode(true);
                }}
                className="flex-1"
              >
                Edit Report
              </Button>
            )}


            {!report.is_approved && editMode && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={
                    saving || approving
                  }
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleSave}
                  disabled={
                    saving || approving
                  }
                  className="flex-1"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </>
            )}


            {!report.is_approved && (
              <Button
                variant="primary"
                onClick={handleApprove}
                disabled={
                  saving || approving
                }
                className="flex-1"
              >
                {approving
                  ? "Approving..."
                  : "Approve Report"}
              </Button>
            )}

          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
};
