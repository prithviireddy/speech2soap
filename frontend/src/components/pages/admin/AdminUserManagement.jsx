import { AdminLayout } from '../../layouts/AdminLayout';
import { Card, Badge, Button } from '../../shared';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const users = [
    { id: 1, name: 'Dr. Sarah Chen', email: 'sarah@clinic.com', role: 'doctor', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'John Smith', email: 'john@example.com', role: 'patient', status: 'active', joinDate: '2024-03-20' },
    { id: 3, name: 'Dr. James Wilson', email: 'james@clinic.com', role: 'doctor', status: 'active', joinDate: '2024-01-10' },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'patient', status: 'inactive', joinDate: '2024-02-28' },
    { id: 5, name: 'Dr. Rachel Adams', email: 'rachel@clinic.com', role: 'doctor', status: 'active', joinDate: '2024-01-20' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold">User Management</h1>
            <p className="text-text-secondary">Manage doctors and patients</p>
          </div>
          <Button variant="primary" className="gap-2">
            <Plus size={18} />
            Add User
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <p className="text-text-secondary text-sm">Total Users</p>
            <p className="text-3xl font-display font-bold mt-2">487</p>
          </Card>
          <Card>
            <p className="text-text-secondary text-sm">Active Doctors</p>
            <p className="text-3xl font-display font-bold mt-2">156</p>
          </Card>
          <Card>
            <p className="text-text-secondary text-sm">Active Patients</p>
            <p className="text-3xl font-display font-bold mt-2">331</p>
          </Card>
        </div>

        <Card>
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-danger"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-danger"
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctors</option>
              <option value="patient">Patients</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border-default">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Join Date</th>
                  <th className="text-right py-3 px-4 font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border-default hover:bg-bg-base transition-colors">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-text-secondary">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={user.role === 'doctor' ? 'info' : 'success'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{user.joinDate}</td>
                    <td className="py-3 px-4 text-right flex gap-2 justify-end">
                      <button className="p-2 hover:bg-brand-primary/10 rounded-lg transition-colors">
                        <Edit size={16} className="text-brand-primary" />
                      </button>
                      <button className="p-2 hover:bg-danger/10 rounded-lg transition-colors">
                        <Trash2 size={16} className="text-danger" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
