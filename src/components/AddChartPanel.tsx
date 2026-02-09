import { Plus, X } from 'lucide-react';
import { ChartConfig, ChartType, Dataset } from '../types/dashboard';
import { useState, useMemo } from 'react';
import { ChartTypeSelector } from './ChartTypeSelector';
import { ChartRenderer } from './ChartRenderer';
import { processChartData } from '../utils/dataProcessor';

interface AddChartPanelProps {
  dataset: Dataset;
  onAddChart: (config: ChartConfig) => void;
  onClose: () => void;
}

export const AddChartPanel = ({ dataset, onAddChart, onClose }: AddChartPanelProps) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState<string[]>([]);
  const [aggregation, setAggregation] = useState<'sum' | 'avg' | 'count' | 'min' | 'max'>('sum');

  const numericColumns = dataset.columns.filter(col => col.type === 'number');
  const allColumns = dataset.columns;

  const isValid = useMemo(() => {
    if (!title) return false;
    if (type !== 'table' && type !== 'metric' && !xAxis) return false;
    if (type !== 'table' && yAxis.length === 0) return false;
    return true;
  }, [title, type, xAxis, yAxis]);

  const previewConfig: ChartConfig = useMemo(() => ({
    id: 'preview',
    type,
    title,
    datasetId: dataset.id,
    xAxis: type === 'table' || type === 'metric' ? undefined : xAxis,
    yAxis: type === 'metric' ? [yAxis[0]] : yAxis,
    aggregation,
    filters: [],
    colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
  }), [type, title, dataset.id, xAxis, yAxis, aggregation]);

  const handleAddChart = () => {
    if (!isValid) {
      return;
    }

    const config: ChartConfig = {
      id: `chart-${Date.now()}`,
      ...previewConfig
    };

    onAddChart(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Create New Chart</h2>
            {type && (
              <p className="text-sm text-gray-600 mt-1">
                Chart Type: <span className="font-semibold text-blue-600 capitalize">{type === 'line' ? 'Line Chart' : type === 'area' ? 'Area Chart' : type === 'pie' ? 'Pie Chart' : type === 'metric' ? 'Metric Card' : type === 'table' ? 'Data Table' : 'Bar Chart'}</span>
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-1/2 overflow-y-auto p-6 space-y-6 border-r border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">Active Configuration</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                {title ? <span><strong>Title:</strong> {title}</span> : <span className="text-gray-400">Enter a chart title</span>}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Type:</strong> <span className="text-blue-600 font-semibold capitalize">{type === 'line' ? 'Line Chart' : type === 'area' ? 'Area Chart' : type === 'pie' ? 'Pie Chart' : type === 'metric' ? 'Metric Card' : type === 'table' ? 'Data Table' : 'Bar Chart'}</span>
              </p>
              {type !== 'table' && type !== 'metric' && (
                <>
                  <p className="text-sm text-gray-700">
                    <strong>X-Axis:</strong> {xAxis ? <span className="text-green-600 font-medium">{xAxis}</span> : <span className="text-gray-400">Not selected</span>}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Y-Axis:</strong> {yAxis.length > 0 ? <span className="text-green-600 font-medium">{yAxis.join(', ')}</span> : <span className="text-gray-400">None selected</span>}
                  </p>
                </>
              )}
              {type === 'metric' && (
                <p className="text-sm text-gray-700">
                  <strong>Metric:</strong> {yAxis[0] ? <span className="text-green-600 font-medium">{yAxis[0]}</span> : <span className="text-gray-400">Not selected</span>}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Sales by Region"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <ChartTypeSelector
            selectedType={type}
            onTypeSelect={setType}
            dataset={dataset}
          />

          {type !== 'table' && type !== 'metric' && (
            <>
              <div className="border-t pt-4">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">X</span>
                    X-Axis (Categories/Labels)
                  </label>
                  <select
                    value={xAxis}
                    onChange={(e) => setXAxis(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      xAxis ? 'border-green-300 bg-green-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a column</option>
                    {allColumns.map(col => (
                      <option key={col.name} value={col.name}>{col.name}</option>
                    ))}
                  </select>
                  {xAxis && <p className="text-xs text-green-600 mt-2 font-medium">✓ Selected: {xAxis}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="inline-block w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">Y</span>
                  Y-Axis (Numeric Values)
                </label>
                <div className="border-2 border-gray-300 rounded-lg p-4 space-y-3 max-h-56 overflow-y-auto bg-white">
                  {numericColumns.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">No numeric columns available</p>
                  ) : (
                    numericColumns.map(col => (
                      <label key={col.name} className="flex items-center p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={yAxis.includes(col.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setYAxis([...yAxis, col.name]);
                            } else {
                              setYAxis(yAxis.filter(y => y !== col.name));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">{col.name}</span>
                        {yAxis.includes(col.name) && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-semibold">Selected</span>
                        )}
                      </label>
                    ))
                  )}
                </div>
                {yAxis.length > 0 && (
                  <p className="text-xs text-green-600 mt-3 font-medium">✓ {yAxis.length} column{yAxis.length !== 1 ? 's' : ''} selected</p>
                )}
              </div>
            </>
          )}

          {type === 'metric' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metric Column</label>
              <select
                value={yAxis[0] || ''}
                onChange={(e) => setYAxis([e.target.value])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a column</option>
                {numericColumns.map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>
          )}

          {type !== 'table' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aggregation</label>
              <select
                value={aggregation}
                onChange={(e) => setAggregation(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sum">Sum</option>
                <option value="avg">Average</option>
                <option value="count">Count</option>
                <option value="min">Minimum</option>
                <option value="max">Maximum</option>
              </select>
            </div>
          )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> You can further customize colors, filters, and other settings after creating the chart.
              </p>
            </div>
          </div>

          <div className="w-1/2 overflow-y-auto p-6 bg-gray-50 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            {isValid ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 p-4">
                <div className="w-full h-80 flex items-center justify-center">
                  <ChartRenderer config={previewConfig} dataset={dataset} />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Chart preview is ready</p>
                  <p className="text-xs text-gray-500 mt-1">Click "Add Chart" to save</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-gray-500 font-medium">Configure the chart to see preview</p>
                  <p className="text-xs text-gray-400 mt-2">Select chart type, title, and axes</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAddChart}
            disabled={!isValid}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed rounded-lg transition-all flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Chart to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
