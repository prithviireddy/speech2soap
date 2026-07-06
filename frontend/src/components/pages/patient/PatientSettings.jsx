import { useState } from 'react';
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, Button } from '../../shared';
import { Lock, Bell, Eye, Download, Trash2 } from 'lucide-react';

export const PatientSettings = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-4xl font-display font-bold">Settings</h1>
          <p className="text-text-secondary">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-default gap-4 mb-8">
          {[
            { id: 'account', label: 'Account', icon: '👤' },
            { id: 'notifications', label: 'Notifications', icon: '🔔' },
            { id: 'privacy', label: 'Privacy', icon: '🔒' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-display font-bold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Alex Johnson"
                    className="w-full mt-1 px-3 py-2 border border-border-default rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Email</label>
                  <input
                    type="email"
                    defaultValue="alex@example.com"
                    className="w-full mt-1 px-3 py-2 border border-border-default rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1-555-0000"
                    className="w-full mt-1 px-3 py-2 border border-border-default rounded-lg"
                  />
                </div>
                <Button variant="primary">Save Changes</Button>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <Lock size={20} /> Change Password
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Current Password</label>
                  <input type="password" className="w-full mt-1 px-3 py-2 border border-border-default rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">New Password</label>
                  <input type="password" className="w-full mt-1 px-3 py-2 border border-border-default rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Confirm Password</label>
                  <input type="password" className="w-full mt-1 px-3 py-2 border border-border-default rounded-lg" />
                </div>
                <Button variant="secondary">Update Password</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card>
            <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
              <Bell size={20} /> Notification Preferences
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Report Ready Notifications', defaultChecked: true },
                { label: 'Medication Reminders', defaultChecked: true },
                { label: 'Followup Reminders', defaultChecked: true },
                { label: 'System Updates', defaultChecked: false }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border-default">
                  <input type="checkbox" defaultChecked={item.defaultChecked} className="w-5 h-5 rounded" />
                  <label className="flex-1 text-sm font-medium cursor-pointer">{item.label}</label>
                </div>
              ))}
            </div>
            <Button variant="primary" className="mt-6">Save Preferences</Button>
          </Card>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <Eye size={20} /> Data & Privacy
              </h2>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-bg-base rounded-lg">
                  <p className="font-medium">Your medical data is encrypted</p>
                  <p className="text-text-secondary mt-1">End-to-end encryption for all communications</p>
                </div>
                <div className="p-3 bg-bg-base rounded-lg">
                  <p className="font-medium">Share with Healthcare Providers</p>
                  <p className="text-text-secondary mt-1">Grant access to specific doctors for shared records</p>
                  <Button variant="secondary" size="sm" className="mt-2">Manage Access</Button>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <Download size={20} /> Data Export
              </h2>
              <p className="text-text-secondary text-sm mb-4">
                Download a copy of all your medical records and data.
              </p>
              <Button variant="secondary" className="gap-2">
                <Download size={18} />
                Export Health Data
              </Button>
            </Card>

            <Card className="border-l-4 border-danger bg-danger/5">
              <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <Trash2 size={20} className="text-danger" /> Delete Account
              </h2>
              <p className="text-text-secondary text-sm mb-4">
                This action is permanent and cannot be undone. All your data will be deleted.
              </p>
              <Button variant="danger">Delete My Account</Button>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
