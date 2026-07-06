import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button, Card } from '../shared';

export const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(
        formData.email,
        formData.password
      );

    } catch (error) {
      setError(
        error.response?.data?.detail ??
        "Login failed"
      );
    }
  };


  return (
    <AuthLayout>
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">
            Sign in
          </h2>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-border-default" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-brand-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <Button size="lg" variant="primary">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          Accounts are provisioned by your clinic administrator.
          Contact your administrator if you need access.
      </p>
      </Card>
    </AuthLayout>
  );
};
