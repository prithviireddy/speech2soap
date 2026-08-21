import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button, Card, LoadingSpinner } from '../shared';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
    } catch (err) {
      setError(
        err.response?.data?.detail ?? 'Invalid credentials. Please verify and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card
        variant="elevated"
        className="glass-panel border border-slate-200/90 shadow-xl rounded-3xl p-8 animate-fade-in-up space-y-6"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-bold text-text-primary">
            Sign In
          </h2>
          <p className="text-xs text-text-muted">
            Enter your credentials to access your clinical dashboard
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-danger-light border border-danger/25 text-danger text-xs font-medium flex items-start gap-2.5 animate-fade-in-scale">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Mail size={16} />
              </div>
              <input
                type="email"
                placeholder="doctor@clinic.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 bg-bg-base border border-border-default rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Lock size={16} />
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 bg-bg-base border border-border-default rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              variant="primary"
              disabled={loading}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-md shadow-brand-primary/20"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-border-subtle text-center">
          <p className="text-xs text-text-muted leading-relaxed">
            Authorized healthcare provider and patient accounts only. Contact clinic IT administrator for account provisioning.
          </p>
        </div>
      </Card>
    </AuthLayout>
  );
};
