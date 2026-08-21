import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Button, LoadingSpinner, Badge } from '../../shared';
import {
  SendHorizontal,
  Brain,
  Sparkles,
  ChevronRight,
  User,
  ExternalLink,
  Users,
  Activity,
  FileCheck2,
} from 'lucide-react';
import {
  getDoctorConsultationsAPI,
  getDoctorReportsAPI,
} from "../../../api/doctor";

export const DoctorAIAssistant = () => {
  const [consultations, setConsultations] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: "I'm your AI Clinical Assistant. I can help you with diagnosis suggestions, treatment guidelines, medication interactions, and followup planning. You can also select any of your patients below to query their specific grounded clinical records."
    }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    'Suggest followups for hypertension patient',
    'Review ACE inhibitor vs ARB side effects',
    'Generate discharge summary structure',
    'Clinical guidance for sedentary lower back pain'
  ];

  useEffect(() => {
    fetchSidebarData();
  }, []);

  const fetchSidebarData = async () => {
    try {
      setLoadingData(true);
      const [consults, reps] = await Promise.all([
        getDoctorConsultationsAPI(),
        getDoctorReportsAPI(),
      ]);
      setConsultations(consults || []);
      setReports(reps || []);
    } catch (err) {
      console.error("Failed to load doctor clinical references", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Extract unique recent patients from real consultations
  const recentPatients = useMemo(() => {
    const map = new Map();
    for (const c of consultations) {
      if (c.patient_id && !map.has(c.patient_id)) {
        map.set(c.patient_id, {
          patient_id: c.patient_id,
          patient_name: c.patient_name,
          patient_number: c.patient_number,
          status: c.status,
          updated_at: c.updated_at || c.created_at,
        });
      }
    }
    return Array.from(map.values()).slice(0, 6);
  }, [consultations]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          text: 'Based on current clinical documentation standards and guidelines, here are recommended considerations and evidence-grounded steps for your query.'
        }
      ]);
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl animate-fade-in-up">
        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="bento-card flex flex-col h-[650px] p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-primary-light text-brand-primary">
                  <Brain size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-display font-bold text-text-primary">
                    General Clinical AI Assistant
                  </h1>
                  <p className="text-xs text-text-muted">
                    Clinical decision support, diagnostic guidelines & medical knowledge
                  </p>
                </div>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-bg-base/60 rounded-2xl border border-border-subtle">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${
                    msg.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.type === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center shrink-0 mt-1">
                      <Brain size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-md p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.type === 'user'
                        ? 'bg-brand-primary text-white rounded-br-none shadow-sm'
                        : 'bg-bg-secondary text-text-primary border border-border-default rounded-tl-none shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {msg.type === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input & Suggested Queries */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about diagnosis guidelines, medication interactions, clinical recommendations..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 bg-bg-base border border-border-default rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  className="px-4 py-2.5 rounded-xl flex items-center justify-center"
                >
                  <SendHorizontal size={16} />
                </Button>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Suggested Clinical Queries:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestions.map((sugg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(sugg)}
                      className="flex items-center gap-1.5 text-left p-2 rounded-xl text-xs text-text-secondary hover:text-brand-primary border border-border-default bg-bg-base hover:bg-brand-primary-light/40 hover:border-brand-primary/30 transition-colors cursor-pointer"
                    >
                      <ChevronRight size={13} className="text-text-muted shrink-0" />
                      <span className="truncate">{sugg}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Dynamic Sidebar with Real Patient References & Stats */}
        <div className="space-y-4">
          {/* Quick Patient References (Real Patients) */}
          <Card className="bento-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-display font-bold text-text-primary flex items-center gap-2">
                <Users size={15} className="text-brand-primary" />
                Quick Patient References
              </h2>
            </div>

            {loadingData ? (
              <div className="py-8 flex justify-center text-text-muted">
                <LoadingSpinner size="sm" />
              </div>
            ) : recentPatients.length === 0 ? (
              <p className="text-xs text-text-muted py-4 text-center">
                No recent patient consultations found.
              </p>
            ) : (
              <div className="space-y-2">
                {recentPatients.map((p) => (
                  <Link
                    key={p.patient_id}
                    to={`/doctor/patients/${p.patient_id}/history`}
                    className="block group"
                  >
                    <div className="p-2.5 rounded-xl border border-border-default bg-bg-base hover:bg-brand-primary-light/40 hover:border-brand-primary/30 transition-all flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-text-primary truncate group-hover:text-brand-primary transition-colors">
                          {p.patient_name}
                        </p>
                        <p className="text-[10px] text-text-muted font-mono truncate">
                          {p.patient_number || "Patient Record"}
                        </p>
                      </div>
                      <ExternalLink
                        size={13}
                        className="text-text-muted group-hover:text-brand-primary shrink-0 ml-2 transition-colors"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Real AI & Clinical Statistics */}
          <Card className="bento-card p-5">
            <h2 className="text-sm font-display font-bold text-text-primary mb-3 flex items-center gap-2">
              <Activity size={15} className="text-brand-primary" />
              Clinical Summary
            </h2>
            <div className="space-y-2.5">
              <div className="p-3 bg-bg-base rounded-xl border border-border-subtle flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-text-muted">Total Consultations</p>
                  <p className="text-xl font-display font-bold text-text-primary mt-0.5">
                    {consultations.length}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <Brain size={16} />
                </div>
              </div>

              <div className="p-3 bg-bg-base rounded-xl border border-border-subtle flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-text-muted">Pending Approvals</p>
                  <p className="text-xl font-display font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {reports.filter((r) => !r.is_approved).length}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                  <Activity size={16} />
                </div>
              </div>

              <div className="p-3 bg-bg-base rounded-xl border border-border-subtle flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-text-muted">Approved Reports</p>
                  <p className="text-xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {reports.filter((r) => r.is_approved).length}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <FileCheck2 size={16} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
