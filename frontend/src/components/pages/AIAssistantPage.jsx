import { useState } from 'react';
import { DashboardLayout } from '../layouts';
import { Card, Button } from '../shared';

export function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: "Hi! I'm your Health Intelligence Assistant. I can help you understand your medical reports, track your medications, and answer questions about your health. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    'What did the doctor say about my back pain?',
    'Summarize my last consultation',
    'What medications am I taking?'
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: 'Thank you for your question. Based on your latest consultation with Dr. Sarah Chen on December 15, 2024, regarding your lower back pain, I can provide you with detailed information about your diagnosis and treatment plan.'
      }]);
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-screen lg:h-auto lg:min-h-96 flex flex-col">
            <h1 className="text-2xl font-display font-bold mb-6">Health Intelligence Assistant</h1>

            <div className="flex-1 overflow-y-auto mb-6 space-y-4 p-4 bg-white rounded-lg">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-sm p-4 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-brand-primary text-white rounded-br-none'
                        : 'bg-bg-base rounded-bl-none'
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
                <Button variant="primary" onClick={handleSendMessage}>📤</Button>
              </div>

              <div>
                <p className="text-xs text-text-secondary mb-2">Suggested questions:</p>
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
            <h2 className="text-lg font-display font-bold mb-4">Report Context</h2>
            <div className="space-y-2">
              {[
                { date: 'Dec 15, 2024', doctor: 'Dr. Sarah Chen' },
                { date: 'Dec 8, 2024', doctor: 'Dr. James Wilson' },
                { date: 'Nov 30, 2024', doctor: 'Dr. Rachel Adams' }
              ].map((report, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 rounded-lg border border-border-default hover:border-brand-primary hover:bg-bg-base transition-colors"
                >
                  <p className="text-sm font-medium">{report.date}</p>
                  <p className="text-xs text-text-secondary">{report.doctor}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-display font-bold mb-4">Health Metrics</h2>
            <div className="space-y-3">
              <div className="p-3 bg-bg-base rounded-lg">
                <p className="text-sm text-text-secondary">Active Medications</p>
                <p className="text-2xl font-display font-bold">5</p>
              </div>
              <div className="p-3 bg-bg-base rounded-lg">
                <p className="text-sm text-text-secondary">Follow-ups Due</p>
                <p className="text-2xl font-display font-bold">3</p>
              </div>
              <div className="p-3 bg-bg-base rounded-lg">
                <p className="text-sm text-text-secondary">Consultations</p>
                <p className="text-2xl font-display font-bold">12</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
