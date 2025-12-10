import { FileSpreadsheet, Download, Sparkles, Plus } from 'lucide-react';
import { Dataset, ChartConfig } from '../types/dashboard';
import { suggestCharts } from '../utils/chartSuggestions';
import { useState } from 'react';

interface SidebarProps {
  datasets: Dataset[];
  onAddChart: (suggestions: ChartConfig[]) => void;
  onOpenAddChart: () => void;
  onExportPDF: () => void;
  onExportPNG: () => void;
  selectedDataset: string | null;
  onDatasetSelect: (datasetId: string) => void;
}

export const Sidebar = ({
  datasets,
  onAddChart,
  onOpenAddChart,
  onExportPDF,
  onExportPNG,
  selectedDataset,
  onDatasetSelect
}: SidebarProps) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard Builder</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Datasets</h3>
          <div className="space-y-2">
            {datasets.map(dataset => (
              <button
                key={dataset.id}
                onClick={() => onDatasetSelect(dataset.id)}
                className={`w-full flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                  selectedDataset === dataset.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-gray-600" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">{dataset.sheetName}</div>
                  <div className="text-xs text-gray-500">
                    {dataset.rows.length} rows, {dataset.columns.length} columns
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                if (selectedDataset) {
                  const dataset = datasets.find(d => d.id === selectedDataset);
                  if (dataset) {
                    const suggestions = suggestCharts(dataset);
                    onAddChart(suggestions);
                  }
                }
              }}
              disabled={!selectedDataset}
              className="w-full flex items-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI Suggestions</span>
            </button>

            <button
              onClick={onOpenAddChart}
              disabled={!selectedDataset}
              className="w-full flex items-center gap-2 p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Custom Chart</span>
            </button>

            <button
              onClick={onExportPDF}
              className="w-full flex items-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export as PDF</span>
            </button>

            <button
              onClick={onExportPNG}
              className="w-full flex items-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export as PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
