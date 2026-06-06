import { useState } from 'react';
import { useAuth } from '../../App.jsx';
import { AuthLayout } from '../layouts';
import { Button, Card } from '../shared';

export const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData.email);
  };

  return (
    <AuthLayout>
      <Card className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
              required
            />
          </div>
          <Button size="lg" variant="primary">Sign In</Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-default"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-text-secondary">New to Clinic2Report?</span>
          </div>
        </div>

        <Button size="lg" variant="outline">Create Account</Button>
      </Card>
    </AuthLayout>
  )
}
