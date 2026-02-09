import { ChartType, Dataset } from '../types/dashboard';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Table2, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeSelect: (type: ChartType) => void;
  dataset: Dataset;
}

interface ChartTypeOption {
  value: ChartType;
  label: string;
  icon: React.ReactNode;
  description: string;
  suitable: boolean;
}

export const ChartTypeSelector = ({ selectedType, onTypeSelect, dataset }: ChartTypeSelectorProps) => {
  const numericColumns = dataset.columns.filter(col => col.type === 'number');
  const stringColumns = dataset.columns.filter(col => col.type === 'string');

  const chartTypes: ChartTypeOption[] = [
    {
      value: 'bar',
      label: 'Bar Chart',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Compare values across categories',
      suitable: numericColumns.length > 0 && stringColumns.length > 0
    },
    {
      value: 'line',
      label: 'Line Chart',
      icon: <LineChartIcon className="w-6 h-6" />,
      description: 'Show trends over time or sequences',
      suitable: numericColumns.length > 0
    },
    {
      value: 'area',
      label: 'Area Chart',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Visualize cumulative values',
      suitable: numericColumns.length > 0
    },
    {
      value: 'pie',
      label: 'Pie Chart',
      icon: <PieChartIcon className="w-6 h-6" />,
      description: 'Show parts of a whole',
      suitable: numericColumns.length > 0 && stringColumns.length > 0
    },
    {
      value: 'metric',
      label: 'Metric Card',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Display single important number',
      suitable: numericColumns.length > 0
    },
    {
      value: 'table',
      label: 'Data Table',
      icon: <Table2 className="w-6 h-6" />,
      description: 'Display raw data in table format',
      suitable: true
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Chart Type</h3>
        <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
          Selected: <span className="font-bold">{chartTypes.find(c => c.value === selectedType)?.label}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {chartTypes.map(chartType => (
          <button
            key={chartType.value}
            onClick={() => onTypeSelect(chartType.value)}
            disabled={!chartType.suitable}
            className={`p-4 rounded-xl border-2 transition-all text-left group ${
              selectedType === chartType.value
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                : chartType.suitable
                ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
            }`}
            title={chartType.suitable ? '' : 'Not suitable for this dataset'}
          >
            <div className={`${selectedType === chartType.value ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-500'} mb-2 transition-colors`}>
              {chartType.icon}
            </div>
            <div className="text-sm font-semibold text-gray-900">{chartType.label}</div>
            <div className="text-xs text-gray-500 mt-1">{chartType.description}</div>
            {!chartType.suitable && (
              <div className="text-xs text-red-600 mt-2 font-medium">Not available</div>
            )}
            {selectedType === chartType.value && (
              <div className="text-xs text-blue-600 mt-2 font-semibold flex items-center gap-1">
                ✓ Selected
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
