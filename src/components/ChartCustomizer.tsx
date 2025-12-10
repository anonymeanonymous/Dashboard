import { X } from 'lucide-react';
import { ChartConfig, Dataset, ChartType, Filter } from '../types/dashboard';
import { useState } from 'react';
import { ChartTypeSelector } from './ChartTypeSelector';
import { DataFilter } from './DataFilter';

interface ChartCustomizerProps {
  config: ChartConfig;
  dataset: Dataset;
  onUpdate: (config: ChartConfig) => void;
  onClose: () => void;
}

export const ChartCustomizer = ({ config, dataset, onUpdate, onClose }: ChartCustomizerProps) => {
  const [localConfig, setLocalConfig] = useState<ChartConfig>(config);
  const [filters, setFilters] = useState<Filter[]>(config.filters || []);

  const aggregations = ['sum', 'avg', 'count', 'min', 'max'];
  const numericColumns = dataset.columns.filter(col => col.type === 'number');
  const allColumns = dataset.columns;

  const handleUpdate = () => {
    onUpdate({ ...localConfig, filters });
    onClose();
  };

  const handleFiltersChange = (newFilters: Filter[]) => {
    setFilters(newFilters);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Customize Chart</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={localConfig.title}
              onChange={(e) => setLocalConfig({ ...localConfig, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <ChartTypeSelector
            selectedType={localConfig.type}
            onTypeSelect={(type) => setLocalConfig({ ...localConfig, type })}
            dataset={dataset}
          />

          {localConfig.type !== 'table' && localConfig.type !== 'metric' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">X-Axis</label>
                <select
                  value={localConfig.xAxis || ''}
                  onChange={(e) => setLocalConfig({ ...localConfig, xAxis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select column</option>
                  {allColumns.map(col => (
                    <option key={col.name} value={col.name}>{col.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Y-Axis</label>
                <select
                  multiple
                  value={localConfig.yAxis || []}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setLocalConfig({ ...localConfig, yAxis: selected });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                >
                  {numericColumns.map(col => (
                    <option key={col.name} value={col.name}>{col.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </>
          )}

          {localConfig.type === 'metric' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metric Column</label>
              <select
                value={localConfig.yAxis?.[0] || ''}
                onChange={(e) => setLocalConfig({ ...localConfig, yAxis: [e.target.value] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column</option>
                {numericColumns.map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aggregation</label>
            <select
              value={localConfig.aggregation || 'sum'}
              onChange={(e) => setLocalConfig({ ...localConfig, aggregation: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {aggregations.map(agg => (
                <option key={agg} value={agg}>{agg.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
            <div className="flex gap-2 flex-wrap">
              {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#6366f1'].map(color => (
                <button
                  key={color}
                  onClick={() => {
                    const colors = localConfig.colors || [];
                    if (colors.includes(color)) {
                      setLocalConfig({ ...localConfig, colors: colors.filter(c => c !== color) });
                    } else {
                      setLocalConfig({ ...localConfig, colors: [...colors, color] });
                    }
                  }}
                  className={`w-8 h-8 rounded border-2 ${
                    localConfig.colors?.includes(color) ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <DataFilter
              dataset={dataset}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
