import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, BarChart3 } from 'lucide-react';
import { dashboardService } from '../utils/dashboardService';

interface DashboardsListPageProps {
  onSelectDashboard: (id: string) => void;
  onNewDashboard: () => void;
}

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  updated_at: string;
  charts?: unknown[];
}

export const DashboardsListPage = ({ onSelectDashboard, onNewDashboard }: DashboardsListPageProps) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboards = async () => {
      try {
        const data = await dashboardService.getDashboards();
        setDashboards(data || []);
      } catch (error) {
        console.error('Error loading dashboards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboards();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dashboard?')) return;

    try {
      await dashboardService.deleteDashboard(id);
      setDashboards(dashboards.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting dashboard:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboards</h1>
        <button
          onClick={onNewDashboard}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          New Dashboard
        </button>
      </div>

      {dashboards.length === 0 ? (
        <div className="text-center py-20">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-6">No dashboards yet</p>
          <button
            onClick={onNewDashboard}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create your first dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => (
            <div
              key={dashboard.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all p-6 cursor-pointer group"
              onClick={() => onSelectDashboard(dashboard.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDashboard(dashboard.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(dashboard.id);
                    }}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{dashboard.name}</h3>
              {dashboard.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dashboard.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{dashboard.charts?.length || 0} charts</span>
                <span>{formatDate(dashboard.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
