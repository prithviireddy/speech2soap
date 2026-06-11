import { useState } from 'react';
import { useAuth } from '../../App.jsx';
import { AuthLayout } from '../layouts';
import { Button, Card } from '../shared';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const { loginDoctor, loginPatient } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null); // 'doctor' | 'patient'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (userType === 'doctor') {
      loginDoctor(formData.email, `Dr. ${formData.email.split('@')[0]}`);
      navigate('/dashboard');
    } else if (userType === 'patient') {
      loginPatient(formData.email, formData.email.split('@')[0]);
      navigate('/patient/dashboard');
    }
  };

  if (!userType) {
    return (
      <AuthLayout>
        <Card className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-center">I'm a...</h2>
          <div className="space-y-3">
            <button
              onClick={() => setUserType('doctor')}
              className="w-full p-4 rounded-lg border-2 border-border-default hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-left group"
            >
              <div className="text-2xl mb-2">👨‍⚕️</div>
              <h3 className="font-display font-bold group-hover:text-brand-primary">Healthcare Provider</h3>
              <p className="text-sm text-text-secondary">Doctor, clinician, or medical staff</p>
            </button>

            <button
              onClick={() => setUserType('patient')}
              className="w-full p-4 rounded-lg border-2 border-border-default hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-left group"
            >
              <div className="text-2xl mb-2">👤</div>
              <h3 className="font-display font-bold group-hover:text-brand-primary">Patient</h3>
              <p className="text-sm text-text-secondary">Access your medical records</p>
            </button>
          </div>

          <div className="text-center pt-4 border-t border-border-default">
            <p className="text-xs text-text-secondary mb-3">Admin access?</p>
            <a href="/admin-login" className="text-xs text-brand-primary hover:underline font-medium">
              Admin Portal →
            </a>
          </div>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">
            {userType === 'doctor' ? 'Doctor Login' : 'Patient Login'}
          </h2>
          <button
            onClick={() => {
              setUserType(null);
              setFormData({ email: '', password: '' });
              setError('');
            }}
            className="text-text-secondary hover:text-text-primary text-xl"
          >
            ←
          </button>
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
            {userType === 'doctor' ? 'Sign In as Doctor' : 'Sign In as Patient'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-default"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-text-secondary">
              {userType === 'doctor' ? 'New to Clinic2Report?' : "Don't have an account?"}
            </span>
          </div>
        </div>

        <Button size="lg" variant="outline">
          {userType === 'doctor' ? 'Register as Provider' : 'Create Patient Account'}
        </Button>
      </Card>
    </AuthLayout>
  );
};
