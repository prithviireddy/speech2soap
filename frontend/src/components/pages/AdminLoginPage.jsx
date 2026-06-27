import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../layouts';
import { Button, Card } from '../shared';
import { useNavigate } from 'react-router-dom';

export const AdminLoginPage = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showAdminUI, setShowAdminUI] = useState(false);

  // Listen for Ctrl+Shift+A to reveal admin login from regular login page
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault();
        setShowAdminUI(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const success = loginAdmin(formData.email, formData.password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <AuthLayout>
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold">System Administration</h2>
            <p className="text-xs text-text-secondary mt-1">ClinicReport Admin Portal</p>
          </div>
          <div className="text-3xl">⚙️</div>
        </div>

        <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <p className="text-xs text-warning font-medium">
            ⚠️ Authorized administrators only. All access is logged and monitored.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Admin Email</label>
            <input
              type="email"
              placeholder="admin@clinic2report.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Admin Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
              required
            />
            <p className="text-xs text-text-secondary mt-2">
              <strong>Demo:</strong> admin@clinic2report.com / admin123
            </p>
          </div>

          <Button size="lg" variant="primary">
            Sign In to Admin Portal
          </Button>
        </form>

        <div className="text-center">
          <a href="/login" className="text-sm text-brand-primary hover:underline">
            ← Back to regular login
          </a>
        </div>

        <div className="p-4 bg-bg-base rounded-lg text-xs text-text-secondary space-y-2">
          <p>
            <strong>Admin Capabilities:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>User management (doctors & patients)</li>
            <li>System monitoring & analytics</li>
            <li>Audit logging review</li>
            <li>Failed job tracking</li>
          </ul>
        </div>
      </Card>
    </AuthLayout>
  );
};
