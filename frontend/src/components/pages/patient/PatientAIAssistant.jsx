import { useState } from 'react';
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Button } from '../../shared';
import { SendHorizontal } from 'lucide-react';

export const PatientAIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: 'Hi! I\'m your personal health assistant. I can help explain your medical reports, answer questions about your medications, and provide general health information. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    'What does my recent report say?',
    'Tell me about Lisinopril side effects',
    'What should I do if I miss a dose?',
    'When should I see my doctor?'
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: 'Based on your medical records and recent consultations, here\'s what I found...'
      }]);
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-screen lg:h-auto lg:min-h-[600px] flex flex-col">
            <h1 className="text-2xl font-display font-bold mb-6">Health Assistant</h1>

            <div className="flex-1 overflow-y-auto mb-6 space-y-4 p-4 bg-bg-base rounded-lg">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-sm p-4 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-brand-primary text-white rounded-br-none'
                        : 'bg-white border border-border-default rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ask me about your health..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary"
                />
                <Button variant="primary" onClick={handleSendMessage}><SendHorizontal /></Button>
              </div>

              <div>
                <p className="text-xs text-text-secondary mb-2">Common questions:</p>
                <div className="space-y-2">
                  {suggestions.map((sugg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(sugg)}
                      className="w-full text-left p-3 text-sm rounded-lg border border-border-default hover:border-brand-primary hover:bg-bg-base transition-colors"
                    >
                      {sugg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-display font-bold mb-4">Your Health Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-bg-base rounded-lg">
                <p className="text-text-secondary">Active Conditions</p>
                <p className="font-medium mt-1">Hypertension, High Cholesterol</p>
              </div>
              <div className="p-3 bg-bg-base rounded-lg">
                <p className="text-text-secondary">Last Checkup</p>
                <p className="font-medium mt-1">Dec 15, 2024</p>
              </div>
              <div className="p-3 bg-bg-base rounded-lg">
                <p className="text-text-secondary">Doctor</p>
                <p className="font-medium mt-1">Dr. Sarah Chen</p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-success bg-success/5">
            <p className="text-sm font-medium">📌 Pro Tip</p>
            <p className="text-xs text-text-secondary mt-2">
              Always consult your doctor before making changes to your medication routine.
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
