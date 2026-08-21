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
  ArrowLeft,
  Pill,
  CalendarCheck,
  AlertTriangle,
  Sparkles,
  Save,
  Check,
  ShieldCheck,
  User,
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

const formatMedication = (m) => {
  if (!m) return "";
  if (typeof m === "string") return m;
  const parts = [
    m.name || m.medication,
    m.dosage,
    m.frequency,
    m.duration ? `for ${m.duration}` : null,
  ].filter(Boolean);
  return parts.join(" - ") || JSON.stringify(m);
};

const formatDiagnosis = (d) => {
  if (!d) return "";
  if (typeof d === "string") return d;
  if (d.name) {
    return d.icd_code ? `${d.name} (${d.icd_code})` : d.name;
  }
  return typeof d === "object" ? JSON.stringify(d) : String(d);
};

const formatItem = (item) => {
  if (item == null) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") {
    if (item.dosage || item.frequency) return formatMedication(item);
    if (item.name || item.icd_code) return formatDiagnosis(item);
    return Object.values(item).filter(Boolean).join(" - ") || JSON.stringify(item);
  }
  return String(item);
};

const normalizeReport = (reportJson) => {
  const r = reportJson || {};
  const arr = (v) => (Array.isArray(v) ? v : []);
  const strArr = (v) =>
    arr(v)
      .map((x) => formatItem(x))
      .filter(Boolean);

  return {
    soap: {
      subjective: strArr(r.soap?.subjective),
      objective: strArr(r.soap?.objective),
      assessment: strArr(r.soap?.assessment),
      plan: strArr(r.soap?.plan),
    },
    summary: typeof r.summary === "string" ? r.summary : "",
    entities: {
      duration: strArr(r.entities?.duration),
      symptoms: strArr(r.entities?.symptoms),
      diagnosis: strArr(r.entities?.diagnosis),
      medications: strArr(r.entities?.medications),
    },
    clinical_report: {
      allergies: strArr(r.clinical_report?.allergies),
      diagnosis: strArr(r.clinical_report?.diagnosis),
      medications: strArr(r.clinical_report?.medications),
      key_findings: strArr(r.clinical_report?.key_findings),
      treatment_plan: strArr(r.clinical_report?.treatment_plan),
      follow_up_tasks: strArr(r.clinical_report?.follow_up_tasks),
    },
  };
};

/* ── Sub-components ─────────────────────────────────── */
const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-border-subtle">
    {Icon && (
      <div className="p-1.5 rounded-lg bg-brand-primary-light text-brand-primary">
        <Icon size={16} />
      </div>
    )}
    <h2 className="text-sm font-display font-bold text-text-primary tracking-tight">
      {children}
    </h2>
  </div>
);

const EmptyField = () => (
  <p className="text-xs text-text-muted italic py-1">No information documented.</p>
);

const ReadOnlyList = ({ items }) => {
  if (!items || items.length === 0) return <EmptyField />;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-primary shrink-0" />
          <span>{formatItem(item)}</span>
        </li>
      ))}
    </ul>
  );
};

const EditableList = ({ items, onChange, placeholder = "Add entry..." }) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    onChange([...(items || []), trimmed]);
    setNewItem("");
  };

  const handleRemove = (index) => {
    onChange((items || []).filter((_, i) => i !== index));
  };

  const handleEdit = (index, val) => {
    const updated = [...(items || [])];
    updated[index] = val;
    onChange(updated);
  };

  return (
    <div className="space-y-2.5">
      {(items || []).map((item, index) => (
        <div
          key={index}
          className="relative flex items-start gap-2.5 p-3 rounded-xl border border-border-default bg-bg-base/70 focus-within:border-brand-primary focus-within:bg-bg-base hover:border-brand-primary/40 transition-all group"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 mt-2" />
          <textarea
            rows={Math.min(Math.max(Math.ceil((item?.length || 0) / 40), 1), 6)}
            value={item}
            onChange={(e) => handleEdit(index, e.target.value)}
            className="flex-1 bg-transparent text-xs text-text-primary leading-relaxed resize-none focus:outline-none placeholder:text-text-muted"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-1 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light/40 transition-colors opacity-40 group-hover:opacity-100 cursor-pointer shrink-0 mt-0.5"
            title="Delete entry"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      <div className="flex items-start gap-2 pt-1">
        <textarea
          rows={2}
          value={newItem}
          placeholder={placeholder}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
          className="flex-1 px-3.5 py-2 bg-bg-base border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all resize-none leading-relaxed"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAdd}
          className="h-9 px-3 text-xs gap-1 shrink-0 mt-0.5"
        >
          <Plus size={13} />
          <span>Add</span>
        </Button>
      </div>
    </div>
  );
};

export const DoctorReportReview = () => {
  const { reportId } = useParams();

  const [report, setReport] = useState(null);
  const [patient, setPatient] = useState(null);
  const [consultationId, setConsultationId] = useState(null);
  const [transcript, setTranscript] = useState(null);

  const [isApproved, setIsApproved] = useState(false);
  const [formData, setFormData] = useState(createEmptyReport());

  const [loading, setLoading] = useState(true);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showTranscript, setShowTranscript] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDoctorReportAPI(reportId);

      setReport(data);
      setPatient({
        id: data.patient_id,
        name: data.patient_name,
        patient_number: data.patient_number,
      });
      setConsultationId(data.consultation_id);
      setIsApproved(Boolean(data.is_approved));

      const normalized = normalizeReport(data.report_json);
      setFormData(normalized);

      if (data.consultation_id) {
        fetchTranscript(data.consultation_id);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load clinical report.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTranscript = async (cid) => {
    try {
      setLoadingTranscript(true);
      const tData = await getConsultationTranscriptAPI(cid);
      setTranscript(tData);
    } catch (err) {
      console.error("Transcript fetch error:", err);
    } finally {
      setLoadingTranscript(false);
    }
  };

  const handleSoapChange = (section, newItems) => {
    setFormData((prev) => ({
      ...prev,
      soap: { ...prev.soap, [section]: newItems },
    }));
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMsg("");
      await updateDoctorReportAPI(reportId, { report_json: formData });
      setSuccessMsg("Draft notes saved successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
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
      setSuccessMsg("");
      await updateDoctorReportAPI(reportId, { report_json: formData });
      await approveDoctorReportAPI(reportId);
      setIsApproved(true);
      setSuccessMsg("Clinical report approved and signed off successfully!");
      if (patient?.id) {
        reindexPatientRAGAPI(patient.id).catch((e) =>
          console.warn("RAG index sync warning:", e)
        );
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to approve report.");
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-24">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !report) {
    return (
      <DashboardLayout>
        <Card className="bento-card border-danger/30 bg-danger-light/20 p-6 text-center max-w-lg mx-auto mt-12">
          <p className="text-danger text-sm font-medium">{error}</p>
          <Button variant="secondary" onClick={fetchReport} className="mt-4">
            Try Again
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in-up pb-24">
        {/* Top Breadcrumb & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/doctor/reports"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to All Reports</span>
          </Link>

          <button
            onClick={() => setShowTranscript((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border-default bg-bg-secondary hover:bg-bg-surface-subtle text-xs text-text-secondary font-medium transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            {showTranscript ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            <span>{showTranscript ? "Hide Transcript" : "Show Transcript"}</span>
          </button>
        </div>

        {/* Patient Profile Header Card */}
        <Card className="bento-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white shadow-md shadow-brand-primary/25 flex items-center justify-center font-display font-bold text-xl shrink-0">
                {patient?.name
                  ? patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "PT"}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
                    {patient?.name || report?.patient_name}
                  </h1>
                  <Badge variant={isApproved ? "success" : "warning"} size="sm">
                    {isApproved ? "Approved & Signed" : "Draft Sign-Off Pending"}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted font-mono mt-0.5">
                  Record ID: {patient?.patient_number || "PATIENT RECORD"}
                </p>
              </div>
            </div>

            {patient?.id && (
              <Link to={`/doctor/patients/${patient.id}/history`}>
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs self-start sm:self-auto">
                  <User size={14} />
                  <span>Patient History & RAG</span>
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-4 rounded-xl bg-danger-light/60 border border-danger/30 text-danger text-xs font-medium flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Content Layout: SOAP Notes vs Transcript Drawer */}
        <div
          className={`grid gap-6 transition-all duration-300 ${
            showTranscript ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"
          }`}
        >
          {/* Transcript Panel (Left Drawer if active) */}
          {showTranscript && (
            <div className="lg:col-span-4 space-y-4">
              <TranscriptPanel
                transcript={transcript}
                segments={transcript?.segments}
                loading={loadingTranscript}
              />
            </div>
          )}

          {/* Clinical SOAP Report (Main / Right) */}
          <div className={`space-y-6 ${showTranscript ? "lg:col-span-8" : "w-full"}`}>
            {/* Executive Clinical Summary */}
            <Card className="bento-card p-6 space-y-3">
              <SectionTitle icon={FileText}>Executive Clinical Summary</SectionTitle>
              {isApproved ? (
                <p className="text-xs text-text-secondary leading-relaxed bg-bg-base/60 p-3.5 rounded-xl border border-border-subtle">
                  {formData.summary || <EmptyField />}
                </p>
              ) : (
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  placeholder="Enter high-level clinical summary..."
                  className="w-full px-3.5 py-2.5 bg-bg-base border border-border-default rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all"
                />
              )}
            </Card>

            {/* Structured SOAP Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subjective */}
              <Card className="bento-card p-5 space-y-3">
                <SectionTitle>Subjective (S)</SectionTitle>
                {isApproved ? (
                  <ReadOnlyList items={formData.soap.subjective} />
                ) : (
                  <EditableList
                    items={formData.soap.subjective}
                    onChange={(items) => handleSoapChange("subjective", items)}
                    placeholder="Add patient symptom/history..."
                  />
                )}
              </Card>

              {/* Objective */}
              <Card className="bento-card p-5 space-y-3">
                <SectionTitle>Objective (O)</SectionTitle>
                {isApproved ? (
                  <ReadOnlyList items={formData.soap.objective} />
                ) : (
                  <EditableList
                    items={formData.soap.objective}
                    onChange={(items) => handleSoapChange("objective", items)}
                    placeholder="Add vitals / exam finding..."
                  />
                )}
              </Card>

              {/* Assessment */}
              <Card className="bento-card p-5 space-y-3">
                <SectionTitle>Assessment (A)</SectionTitle>
                {isApproved ? (
                  <ReadOnlyList items={formData.soap.assessment} />
                ) : (
                  <EditableList
                    items={formData.soap.assessment}
                    onChange={(items) => handleSoapChange("assessment", items)}
                    placeholder="Add clinical diagnosis / reasoning..."
                  />
                )}
              </Card>

              {/* Plan */}
              <Card className="bento-card p-5 space-y-3">
                <SectionTitle>Plan (P)</SectionTitle>
                {isApproved ? (
                  <ReadOnlyList items={formData.soap.plan} />
                ) : (
                  <EditableList
                    items={formData.soap.plan}
                    onChange={(items) => handleSoapChange("plan", items)}
                    placeholder="Add treatment / medication / follow-up..."
                  />
                )}
              </Card>
            </div>

            {/* Prescriptions & Follow-ups */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bento-card p-5 space-y-3">
                <SectionTitle icon={Pill}>Prescribed Medications</SectionTitle>
                {isApproved ? (
                  <ReadOnlyList items={formData.clinical_report.medications} />
                ) : (
                  <EditableList
                    items={formData.clinical_report.medications}
                    onChange={(items) =>
                      setFormData((prev) => ({
                        ...prev,
                        clinical_report: {
                          ...prev.clinical_report,
                          medications: items,
                        },
                      }))
                    }
                    placeholder="e.g. Lisinopril 10mg PO daily"
                  />
                )}
              </Card>

              <Card className="bento-card p-5 space-y-3">
                <SectionTitle icon={CalendarCheck}>Follow-Up & Next Steps</SectionTitle>
                {isApproved ? (
                  <ReadOnlyList items={formData.clinical_report.follow_up_tasks} />
                ) : (
                  <EditableList
                    items={formData.clinical_report.follow_up_tasks}
                    onChange={(items) =>
                      setFormData((prev) => ({
                        ...prev,
                        clinical_report: {
                          ...prev.clinical_report,
                          follow_up_tasks: items,
                        },
                      }))
                    }
                    placeholder="e.g. Return for BP check in 2 weeks"
                  />
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Floating Bottom Action Bar for Review & Sign-Off */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary/90 backdrop-blur-xl border-t border-border-default py-3.5 px-6 shadow-xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-brand-primary shrink-0" />
              <span className="text-xs text-text-secondary hidden sm:inline font-medium">
                {isApproved
                  ? "Report verified & signed into official medical record"
                  : "Review notes before final physician sign-off"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {!isApproved && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={saving || approving}
                  className="gap-1.5 text-xs"
                >
                  <Save size={14} />
                  <span>{saving ? "Saving..." : "Save Draft"}</span>
                </Button>
              )}

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleApprove}
                disabled={isApproved || approving || saving}
                className={`gap-1.5 text-xs px-4 ${
                  isApproved
                    ? "bg-emerald-600 hover:bg-emerald-600 text-white cursor-default"
                    : "shadow-md shadow-brand-primary/25"
                }`}
              >
                <Check size={14} />
                <span>
                  {approving
                    ? "Signing off..."
                    : isApproved
                    ? "Approved & Verified"
                    : "Approve & Sign-Off"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
