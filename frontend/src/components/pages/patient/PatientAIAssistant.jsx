import { useState } from 'react';
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Button } from '../../shared';
import { SendHorizontal, HeartPulse, Sparkles, ChevronRight, User, ShieldCheck } from 'lucide-react';

export const PatientAIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: 'Hi! I\'m your personal health assistant. I can help explain your approved medical reports, answer questions about your prescribed medications, and provide general health education. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    'Explain my latest consultation summary',
    'What are common side effects of my medications?',
    'What follow-up appointments do I have?',
    'How should I prepare for my next clinic visit?'
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: 'Based on your approved medical records and consultations, here is the information you requested...'
      }]);
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl animate-fade-in-up">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="bento-card flex flex-col h-[650px] p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-primary-light text-brand-primary">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-display font-bold text-text-primary">
                    Personal Health Assistant
                  </h1>
                  <p className="text-xs text-text-muted">
                    Guidance and summaries from your approved clinic records
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary-light text-brand-primary border border-brand-primary/20 text-xs font-mono">
                <Sparkles size={12} />
                Patient Assistant
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
                      <HeartPulse size={14} />
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
                  placeholder="Ask a question about your health records or medications..."
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
                  Frequently Asked Questions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestions.map((sugg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(sugg)}
                      className="flex items-center gap-1.5 text-left p-2 rounded-xl text-xs text-text-secondary hover:text-brand-primary border border-border-default bg-bg-base hover:bg-brand-primary-light/40 hover:border-brand-primary/30 transition-colors"
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

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="bento-card p-5">
            <h2 className="text-sm font-display font-bold text-text-primary mb-3">
              Health Record Quick View
            </h2>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-bg-base rounded-xl border border-border-subtle">
                <p className="text-text-muted">Documented Conditions</p>
                <p className="font-semibold text-text-primary mt-1">Hypertension, Routine Wellness</p>
              </div>
              <div className="p-3 bg-bg-base rounded-xl border border-border-subtle">
                <p className="text-text-muted">Primary Physician</p>
                <p className="font-semibold text-text-primary mt-1">Assigned Clinic Doctor</p>
              </div>
            </div>
          </Card>

          <Card className="bento-card p-4 border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20">
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Clinical Guidance</p>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  This assistant explains approved documentation. Always consult your physician for changes to your treatment or medication regimen.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
