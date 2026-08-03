import { useState } from 'react';
import { ShieldAlert, Key, Eye, EyeOff, Save, Lock, ShieldCheck } from 'lucide-react';
import Card from '../../shared/components/Card/Card';
import Button from '../../shared/components/Button/Button';
import toast from 'react-hot-toast';

export default function AdminSecurityPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    toast.success('Admin password updated successfully');
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const auditLogs = [
    { event: 'Admin login successful', ip: '192.168.1.1', time: 'Just now', status: 'success' },
    { event: 'Database backup completed', ip: 'System', time: '2 hours ago', status: 'success' },
    { event: 'Failed login attempt (user_id: 829)', ip: '103.88.22.14', time: '5 hours ago', status: 'warning' },
    { event: 'System settings modified', ip: '192.168.1.1', time: '1 day ago', status: 'success' },
  ];

  return (
    <div className="page-wrapper space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Security Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage administrative credentials and check system logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Change password form */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <Key className="w-5 h-5 text-purple-500" /> Change Admin Password
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Audit / Logs side panel */}
        <div className="space-y-6">
          <Card padding="lg">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-purple-500" /> Security Logs
            </h3>
            <div className="space-y-4">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs border-b border-gray-50 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div className="flex-1 space-y-0.5">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{log.event}</p>
                    <p className="text-gray-400 font-mono text-[10px]">{log.ip} • {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
