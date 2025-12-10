import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { dashboardService } from '../utils/dashboardService';

interface DashboardCreatePageProps {
  onBack: () => void;
  onDashboardCreated: (dashboardId: string) => void;
}

export const DashboardCreatePage = ({ onBack, onDashboardCreated }: DashboardCreatePageProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('Please enter a dashboard name');
      return;
    }

    setSaving(true);
    try {
      const dashboard = await dashboardService.createDashboard(name, description || undefined);
      onDashboardCreated(dashboard.id);
    } catch (error) {
      console.error('Error creating dashboard:', error);
      alert('Failed to create dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-2xl mx-auto px-8 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboards
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Dashboard</h1>
          <p className="text-gray-600 mb-8">Add charts and visualizations to organize your data</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sales Analysis, Q4 Metrics"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this dashboard about?"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={saving || !name.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-medium"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Creating...' : 'Create Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
