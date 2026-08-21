import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  FileText,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Trash2,
} from "lucide-react";

import { DashboardLayout } from "../../layouts/DashboardLayout";
import {
  Card,
  Badge,
  Button,
  LoadingSpinner,
  TranscriptPanel,
} from "../../shared";

import {
  getDoctorReportAPI,
  updateDoctorReportAPI,
  approveDoctorReportAPI,
  getConsultationTranscriptAPI,
  reindexPatientRAGAPI,
} from "../../../api/doctor";


/* ── Empty report shape ─────────────────────────────── */

const createEmptyReport = () => ({
  soap: { subjective: [], objective: [], assessment: [], plan: [] },
  summary: "",
  entities: { duration: [], symptoms: [], diagnosis: [], medications: [] },
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
  const r = reportJson || {};
  const arr = (v) => (Array.isArray(v) ? v : []);
  return {
    soap: {
      subjective: arr(r.soap?.subjective),
      objective:  arr(r.soap?.objective),
      assessment: arr(r.soap?.assessment),
      plan:       arr(r.soap?.plan),
    },
    summary: typeof r.summary === "string" ? r.summary : "",
    entities: {
      duration:    arr(r.entities?.duration),
      symptoms:    arr(r.entities?.symptoms),
      diagnosis:   arr(r.entities?.diagnosis),
      medications: arr(r.entities?.medications),
    },
    clinical_report: {
      allergies:      arr(r.clinical_report?.allergies),
      diagnosis:      arr(r.clinical_report?.diagnosis),
      medications:    arr(r.clinical_report?.medications),
      key_findings:   arr(r.clinical_report?.key_findings),
      treatment_plan: arr(r.clinical_report?.treatment_plan),
      follow_up_tasks: arr(r.clinical_report?.follow_up_tasks),
    },
  };
};


/* ── Sub-components ─────────────────────────────────── */

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="h-7 w-1 rounded-full gradient-accent-line" />
    <h2 className="text-lg font-display font-bold">{children}</h2>
  </div>
);

const EmptyField = () => (
  <p className="text-sm text-text-muted italic">No information documented.</p>
);

const ReadOnlyList = ({ items }) => {
  if (!items || items.length === 0) return <EmptyField />;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-primary shrink-0" />
          <span className="text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
};

const ReadOnlyField = ({ label, items }) => (
  <div>
    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">{label}</h3>
    <ReadOnlyList items={items} />
  </div>
);

const EditableList = ({ label, items, onChange, disabled }) => {
  const update = (i, v) => { const u = [...items]; u[i] = v; onChange(u); };
  const add    = ()     => onChange([...items, ""]);
  const remove = (i)   => onChange(items.filter((_, j) => j !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">{label}</h3>
        {!disabled && (
          <button
            type="button"
            onClick={add}
            className="flex items-center gap-1 text-xs text-brand-primary hover:underline"
          >
            <Plus size={13} /> Add
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-text-muted italic">No information documented.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea
                value={item}
                onChange={(e) => update(i, e.target.value)}
                disabled={disabled}
                rows={2}
                className="flex-1 px-3 py-2 text-sm border border-border-default rounded-lg bg-bg-base resize-y focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1.5 text-danger hover:bg-danger-light rounded-lg mt-0.5"
                  title="Remove"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


/* ── Main component ─────────────────────────────────── */

export const DoctorReportReview = () => {
  const { reportId } = useParams();

  const [report,   setReport]   = useState(null);
  const [formData, setFormData] = useState(createEmptyReport());
  const [editMode, setEditMode] = useState(false);

  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [approving, setApproving] = useState(false);

  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  /* Transcript state */
  const [showTranscript,    setShowTranscript]    = useState(false);
  const [transcriptSegments, setTranscriptSegments] = useState([]);
  const [transcriptLoading,  setTranscriptLoading]  = useState(false);
  const [transcriptError,    setTranscriptError]    = useState("");
  const [transcriptFetched,  setTranscriptFetched]  = useState(false);

  useEffect(() => { fetchReport(); }, [reportId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const data = await getDoctorReportAPI(reportId);
      setReport(data);
      setFormData(normalizeReport(data.report_json));
      setEditMode(false);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  };

  /* Lazy-fetch transcript only on first toggle */
  const handleTranscriptToggle = async () => {
    const next = !showTranscript;
    setShowTranscript(next);

    if (next && !transcriptFetched && report) {
      try {
        setTranscriptLoading(true);
        setTranscriptError("");
        const data = await getConsultationTranscriptAPI(report.consultation_id);
        setTranscriptSegments(data.segments ?? []);
        setTranscriptFetched(true);
      } catch (err) {
        setTranscriptError(
          err?.response?.data?.detail || "Transcript not available for this consultation."
        );
        setTranscriptFetched(true);
      } finally {
        setTranscriptLoading(false);
      }
    }
  };

  /* Form helpers */
  const updateSoap           = (f, v) => setFormData((p) => ({ ...p, soap:           { ...p.soap,           [f]: v } }));
  const updateEntities       = (f, v) => setFormData((p) => ({ ...p, entities:       { ...p.entities,       [f]: v } }));
  const updateClinicalReport = (f, v) => setFormData((p) => ({ ...p, clinical_report: { ...p.clinical_report, [f]: v } }));
  const handleSummaryChange  = (e)    => setFormData((p) => ({ ...p, summary: e.target.value }));

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const updated = await updateDoctorReportAPI(reportId, { report_json: formData });
      setReport(updated);
      setFormData(normalizeReport(updated.report_json));
      setEditMode(false);
      setSuccess("Report saved successfully.");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to save report.");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      setError("");
      setSuccess("");
      if (editMode) {
        await updateDoctorReportAPI(reportId, { report_json: formData });
      }
      await approveDoctorReportAPI(reportId);
      setReport((p) => ({ ...p, report_json: formData, is_approved: true }));
      setEditMode(false);
      setSuccess("Report approved — now visible to the patient.");

      // Best-effort: rebuild RAG index so the new report is immediately retrievable.
      // patient_id is already in the report state from the schema — no extra fetch needed.
      if (report?.patient_id) {
        reindexPatientRAGAPI(report.patient_id).catch(() => {});
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to approve report.");
    } finally {
      setApproving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!report) return;
    setFormData(normalizeReport(report.report_json));
    setEditMode(false);
    setError("");
  };

  /* Guards */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      </DashboardLayout>
    );
  }
  if (error && !report) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-danger">{error}</p>
          <Button variant="secondary" onClick={fetchReport} className="mt-4">Try Again</Button>
        </Card>
      </DashboardLayout>
    );
  }
  if (!report) return null;

  const readOnly = report.is_approved || !editMode;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold">Report Review</h1>
            <p className="text-text-secondary mt-1">
              {report.is_approved
                ? "This report has been approved and is visible to the patient."
                : "Review the AI-generated clinical report before approving."}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Transcript toggle (only when not approved — approved reports show for history) */}
            <Button
              variant="secondary"
              onClick={handleTranscriptToggle}
              className="flex items-center gap-2 text-sm"
            >
              {showTranscript ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
              {showTranscript ? "Hide" : "Show"} Transcript
            </Button>

            <Badge variant={report.is_approved ? "success" : "warning"}>
              <span className="flex items-center gap-1.5">
                {report.is_approved && <CheckCircle2 size={14} />}
                {report.is_approved ? "APPROVED" : "REVIEW PENDING"}
              </span>
            </Badge>
          </div>
        </div>

        {/* Alerts */}
        {error   && <div className="p-4 rounded-xl bg-danger-light border border-danger/20 text-sm text-danger">{error}</div>}
        {success && <div className="p-4 rounded-xl bg-success-light border border-success/20 text-sm text-success">{success}</div>}

        {/* Split layout when transcript is open */}
        <div className={showTranscript ? "grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start" : ""}>

          {/* Transcript panel */}
          {showTranscript && (
            <div className="lg:sticky lg:top-20">
              <Card variant="elevated">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquareText size={18} className="text-brand-primary" />
                  <h2 className="font-display font-bold">Consultation Transcript</h2>
                </div>
                <p className="text-xs text-text-muted mb-4">
                  Speaker-attributed conversation that generated this report.
                </p>
                <TranscriptPanel
                  segments={transcriptSegments}
                  loading={transcriptLoading}
                  error={transcriptError}
                />
              </Card>
            </div>
          )}

          {/* Report content */}
          <div className="space-y-6">

            {/* Clinical Summary */}
            <Card>
              <SectionTitle>Clinical Summary</SectionTitle>
              {readOnly ? (
                formData.summary
                  ? <p className="leading-7 text-sm">{formData.summary}</p>
                  : <EmptyField />
              ) : (
                <textarea
                  value={formData.summary}
                  onChange={handleSummaryChange}
                  rows={5}
                  className="w-full px-4 py-3 text-sm border border-border-default rounded-lg bg-bg-base resize-y focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                  placeholder="Enter clinical summary..."
                />
              )}
            </Card>

            {/* SOAP Notes */}
            <Card>
              <SectionTitle>SOAP Notes</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {readOnly ? (
                  <>
                    <ReadOnlyField label="Subjective"  items={formData.soap.subjective} />
                    <ReadOnlyField label="Objective"   items={formData.soap.objective} />
                    <ReadOnlyField label="Assessment"  items={formData.soap.assessment} />
                    <ReadOnlyField label="Plan"        items={formData.soap.plan} />
                  </>
                ) : (
                  <>
                    <EditableList label="Subjective"  items={formData.soap.subjective}  onChange={(v) => updateSoap("subjective", v)}  disabled={false} />
                    <EditableList label="Objective"   items={formData.soap.objective}   onChange={(v) => updateSoap("objective", v)}   disabled={false} />
                    <EditableList label="Assessment"  items={formData.soap.assessment}  onChange={(v) => updateSoap("assessment", v)}  disabled={false} />
                    <EditableList label="Plan"        items={formData.soap.plan}        onChange={(v) => updateSoap("plan", v)}        disabled={false} />
                  </>
                )}
              </div>
            </Card>

            {/* Clinical Report */}
            <Card>
              <SectionTitle>Clinical Report</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {readOnly ? (
                  <>
                    <ReadOnlyField label="Key Findings"   items={formData.clinical_report.key_findings} />
                    <ReadOnlyField label="Diagnosis"      items={formData.clinical_report.diagnosis} />
                    <ReadOnlyField label="Medications"    items={formData.clinical_report.medications} />
                    <ReadOnlyField label="Allergies"      items={formData.clinical_report.allergies} />
                    <ReadOnlyField label="Treatment Plan" items={formData.clinical_report.treatment_plan} />
                    <ReadOnlyField label="Follow-up"      items={formData.clinical_report.follow_up_tasks} />
                  </>
                ) : (
                  <>
                    <EditableList label="Key Findings"   items={formData.clinical_report.key_findings}   onChange={(v) => updateClinicalReport("key_findings", v)}   disabled={false} />
                    <EditableList label="Diagnosis"      items={formData.clinical_report.diagnosis}      onChange={(v) => updateClinicalReport("diagnosis", v)}      disabled={false} />
                    <EditableList label="Medications"    items={formData.clinical_report.medications}    onChange={(v) => updateClinicalReport("medications", v)}    disabled={false} />
                    <EditableList label="Allergies"      items={formData.clinical_report.allergies}      onChange={(v) => updateClinicalReport("allergies", v)}      disabled={false} />
                    <EditableList label="Treatment Plan" items={formData.clinical_report.treatment_plan} onChange={(v) => updateClinicalReport("treatment_plan", v)} disabled={false} />
                    <EditableList label="Follow-up"      items={formData.clinical_report.follow_up_tasks} onChange={(v) => updateClinicalReport("follow_up_tasks", v)} disabled={false} />
                  </>
                )}
              </div>
            </Card>

            {/* Extracted Entities */}
            <Card>
              <SectionTitle>Extracted Entities</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {readOnly ? (
                  <>
                    <ReadOnlyField label="Symptoms"    items={formData.entities.symptoms} />
                    <ReadOnlyField label="Duration"    items={formData.entities.duration} />
                    <ReadOnlyField label="Diagnosis"   items={formData.entities.diagnosis} />
                    <ReadOnlyField label="Medications" items={formData.entities.medications} />
                  </>
                ) : (
                  <>
                    <EditableList label="Symptoms"    items={formData.entities.symptoms}    onChange={(v) => updateEntities("symptoms", v)}    disabled={false} />
                    <EditableList label="Duration"    items={formData.entities.duration}    onChange={(v) => updateEntities("duration", v)}    disabled={false} />
                    <EditableList label="Diagnosis"   items={formData.entities.diagnosis}   onChange={(v) => updateEntities("diagnosis", v)}   disabled={false} />
                    <EditableList label="Medications" items={formData.entities.medications} onChange={(v) => updateEntities("medications", v)} disabled={false} />
                  </>
                )}
              </div>
            </Card>

            {/* Actions */}
            <Card>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={`/doctor/consultations/${report.consultation_id}`} className="flex-1">
                  <Button variant="secondary" className="w-full">
                    ← Back to Consultation
                  </Button>
                </Link>

                {!report.is_approved && !editMode && (
                  <Button
                    variant="secondary"
                    onClick={() => { setError(""); setSuccess(""); setEditMode(true); }}
                    className="flex-1"
                  >
                    Edit Report
                  </Button>
                )}

                {!report.is_approved && editMode && (
                  <>
                    <Button variant="secondary" onClick={handleCancelEdit} disabled={saving || approving} className="flex-1">
                      Cancel
                    </Button>
                    <Button variant="secondary" onClick={handleSave} disabled={saving || approving} className="flex-1">
                      {saving ? "Saving…" : "Save Changes"}
                    </Button>
                  </>
                )}

                {!report.is_approved && (
                  <Button
                    variant="primary"
                    onClick={handleApprove}
                    disabled={saving || approving}
                    className="flex-1"
                  >
                    {approving ? "Approving…" : "Approve Report"}
                  </Button>
                )}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
