import { useState } from 'react';
import { Settings, Save, Globe, Mail, ShieldAlert, Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState('ADYAPAN');
  const [supportEmail, setSupportEmail] = useState('support@adyapan.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System settings saved successfully');
  };

  return (
    <div className="page-wrapper space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Platform Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Configure general platform preferences and system features.</p>
      </div>

      <div className="max-w-3xl">
        <Card padding="lg">
          <form onSubmit={handleSave} className="space-y-6">
            {/* General */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <Globe className="w-4 h-4 text-purple-500" /> General Settings
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Platform Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Support Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Feature Flags / Toggles */}
            <div className="space-y-4 pt-2">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <Sparkles className="w-4 h-4 text-purple-500" /> Platform Configurations
              </h3>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">Allow Student Registrations</p>
                  <p className="text-xs text-gray-400">Toggle whether new students are allowed to sign up on the login screen.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowRegistration(!allowRegistration)}
                  className="text-purple-600 focus:outline-none"
                >
                  {allowRegistration ? (
                    <ToggleRight className="w-10 h-10" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">Maintenance Mode</p>
                  <p className="text-xs text-gray-400">Puts the student portal into read-only mode for platform updates.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className="text-purple-600 focus:outline-none"
                >
                  {maintenanceMode ? (
                    <ToggleRight className="w-10 h-10" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                Save Settings
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
