import { useState } from 'react';
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Button } from '../../shared';
import { SendHorizontal } from 'lucide-react';

export const DoctorAIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: "I'm your AI Clinical Assistant. I can help you with diagnosis suggestions, treatment recommendations, followup planning, and patient education. What can I help you with today?"
    }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    'Suggest followups for diabetes patient',
    'Generate discharge summary',
    'Review medication interactions',
    'Patient education materials'
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: 'Based on your input, here are some recommendations...'
      }]);
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-screen lg:h-auto lg:min-h-[600px] flex flex-col">
            <h1 className="text-2xl font-display font-bold mb-6">Clinical AI Assistant</h1>

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
                  placeholder="Ask me about diagnosis, treatment, followups..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary"
                />
                <Button variant="primary" onClick={handleSendMessage}><SendHorizontal /></Button>
              </div>

              <div>
                <p className="text-xs text-text-secondary mb-2">Suggested queries:</p>
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
            <h2 className="text-lg font-display font-bold mb-4">Recent Reports</h2>
            <div className="space-y-2">
              {['John Smith', 'Sarah Johnson', 'Michael Brown'].map((name, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 rounded-lg border border-border-default hover:border-brand-primary hover:bg-bg-base transition-colors"
                >
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-text-secondary">Today</p>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-display font-bold mb-4">Statistics</h2>
            <div className="space-y-3">
              <div className="p-3 bg-bg-base rounded-lg">
                <p className="text-sm text-text-secondary">Reports Today</p>
                <p className="text-2xl font-display font-bold">12</p>
              </div>
              <div className="p-3 bg-bg-base rounded-lg">
                <p className="text-sm text-text-secondary">Avg Processing</p>
                <p className="text-2xl font-display font-bold">2.5 min</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
