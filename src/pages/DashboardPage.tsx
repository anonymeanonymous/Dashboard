import { Plus, Download, Image, ArrowLeft, HelpCircle, Eye, BarChart3, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dataset, ChartConfig, LayoutItem } from '../types/dashboard';
import { DashboardGrid } from '../components/DashboardGrid';
import { ChartCustomizer } from '../components/ChartCustomizer';
import { AddChartPanel } from '../components/AddChartPanel';
import { DataSidebar } from '../components/DataSidebar';
import { DataExplorer } from '../components/DataExplorer';
import { exportToPDF, exportToPNG } from '../utils/exportUtils';
import { suggestCharts } from '../utils/chartSuggestions';
import { dashboardService } from '../utils/dashboardService';

interface DashboardPageProps {
  datasets: Dataset[];
  onBack: () => void;
  dashboardId?: string | null;
  dashboardData?: any;
}

export const DashboardPage = ({ datasets, onBack, dashboardId, dashboardData }: DashboardPageProps) => {
  const [selectedDataset, setSelectedDataset] = useState(datasets[0]?.id || null);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);
  const [showAddChart, setShowAddChart] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'charts' | 'data'>('charts');
  const [saving, setSaving] = useState(false);
  const [dashboardName, setDashboardName] = useState(dashboardData?.name || 'My Dashboard');

  useEffect(() => {
    if (dashboardData?.charts) {
      setCharts(dashboardData.charts);
      const newLayout: LayoutItem[] = dashboardData.charts.map((chart: any, index: number) => ({
        i: chart.id,
        x: (index % 2) * 6,
        y: Math.floor(index / 2) * 4,
        w: 6,
        h: 4,
        ...chart.position
      }));
      setLayout(newLayout);
    }
  }, [dashboardData]);

  const dataset = datasets.find(d => d.id === selectedDataset);

  const handleAddCharts = (suggestions: ChartConfig[]) => {
    setCharts(prevCharts => {
      const newCharts = [...prevCharts];
      setLayout(prevLayout => {
        const newLayout = [...prevLayout];

        suggestions.forEach((chart) => {
          const existingChart = newCharts.find(c => c.title === chart.title);
          if (!existingChart) {
            newCharts.push(chart);

            const row = Math.floor(newLayout.length / 2);
            const col = (newLayout.length % 2) * 6;

            newLayout.push({
              i: chart.id,
              x: col,
              y: row * 4,
              w: 6,
              h: 4
            });
          }
        });

        return newLayout;
      });

      return newCharts;
    });
  };

  const handleChartUpdate = (updatedChart: ChartConfig) => {
    setCharts(charts.map(c => c.id === updatedChart.id ? updatedChart : c));
  };

  const handleChartRemove = (chartId: string) => {
    setCharts(charts.filter(c => c.id !== chartId));
    setLayout(layout.filter(l => l.i !== chartId));
  };

  const handleAutoVisualize = () => {
    if (dataset) {
      const suggestions = suggestCharts(dataset);
      handleAddCharts(suggestions);
    }
  };

  const handleAddChart = async (config: ChartConfig) => {
    setCharts([...charts, config]);

    if (dashboardId) {
      try {
        await dashboardService.addChart(dashboardId, config);
      } catch (error) {
        console.error('Error saving chart:', error);
      }
    }
  };

  const saveDashboard = async () => {
    if (!dashboardId) return;

    setSaving(true);
    try {
      await dashboardService.updateDashboard(dashboardId, dashboardName);

      for (const chart of charts) {
        const layoutItem = layout.find(l => l.i === chart.id);
        const updateData = {
          ...chart,
          position: layoutItem ? { x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h } : {}
        };

        const existingChart = dashboardData?.charts?.find((c: any) => c.id === chart.id);
        if (existingChart) {
          await dashboardService.updateChart(chart.id, updateData);
        } else if (!chart.id.startsWith('chart-')) {
          await dashboardService.addChart(dashboardId, updateData);
        }
      }
    } catch (error) {
      console.error('Error saving dashboard:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-73px)] bg-gray-50">
      {sidebarOpen && <DataSidebar datasets={datasets} selectedDataset={selectedDataset} onSelect={setSelectedDataset} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {dataset?.sheetName || 'Dashboard'}
              </h2>
              <div className="text-sm text-gray-500 mt-1">
                {dataset?.rows.length} rows • {dataset?.columns.length} columns
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('charts')}
                className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
                  viewMode === 'charts'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Charts</span>
              </button>
              <button
                onClick={() => setViewMode('data')}
                className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
                  viewMode === 'data'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Data</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAutoVisualize}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              AI Visualize
            </button>

            <button
              onClick={() => setShowAddChart(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Chart
            </button>

            {dashboardId && (
              <button
                onClick={saveDashboard}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 transition-all font-medium"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            )}

            <div className="border-l border-gray-200 pl-3">
              <button
                onClick={() => exportToPDF('dashboard-content', 'dashboard.pdf')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export PDF"
              >
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={() => exportToPNG('dashboard-content', 'dashboard.png')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export PNG"
              >
                <Image className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div id="dashboard-content" className="flex-1 overflow-auto">
          {viewMode === 'charts' ? (
            <div className="p-6">
              {charts.length === 0 ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 text-lg">No charts created yet</p>
                    <p className="text-gray-500 mb-6">Let AI suggest visualizations for your data</p>
                    <button
                      onClick={handleAutoVisualize}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Generate Visualizations
                    </button>
                  </div>
                </div>
              ) : (
                dataset && (
                  <DashboardGrid
                    charts={charts}
                    datasets={[dataset]}
                    layout={layout}
                    onLayoutChange={setLayout}
                    onChartRemove={handleChartRemove}
                    onChartEdit={setEditingChart}
                  />
                )
              )}
            </div>
          ) : (
            dataset && (
              <div className="p-6">
                <DataExplorer dataset={dataset} />
              </div>
            )
          )}
        </div>
      </div>

      {editingChart && dataset && (
        <ChartCustomizer
          config={editingChart}
          dataset={dataset}
          onUpdate={handleChartUpdate}
          onClose={() => setEditingChart(null)}
        />
      )}

      {showAddChart && dataset && (
        <AddChartPanel
          dataset={dataset}
          onAddChart={async (config) => {
            handleAddCharts([config]);
            if (dashboardId) {
              await handleAddChart(config);
            }
            setShowAddChart(false);
          }}
          onClose={() => setShowAddChart(false)}
        />
      )}
    </div>
  );
};
