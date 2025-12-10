import { FileSpreadsheet, ChevronRight } from 'lucide-react';
import { Dataset } from '../types/dashboard';

interface DataSidebarProps {
  datasets: Dataset[];
  selectedDataset: string | null;
  onSelect: (datasetId: string) => void;
}

export const DataSidebar = ({ datasets, selectedDataset, onSelect }: DataSidebarProps) => {
  return (
    <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Data Sources</h3>
        <p className="text-xs text-gray-500 mt-1">{datasets.length} dataset(s) loaded</p>
      </div>

      <div className="space-y-2 p-4">
        {datasets.map(dataset => (
          <button
            key={dataset.id}
            onClick={() => onSelect(dataset.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedDataset === dataset.id
                ? 'bg-blue-50 border-blue-300 shadow-sm'
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                selectedDataset === dataset.id ? 'bg-blue-100' : 'bg-gray-200'
              }`}>
                <FileSpreadsheet className={`w-5 h-5 ${
                  selectedDataset === dataset.id ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{dataset.sheetName}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {dataset.rows.length} rows, {dataset.columns.length} cols
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {dataset.columns.slice(0, 2).map(col => (
                    <span
                      key={col.name}
                      className={`text-xs px-2 py-1 rounded ${
                        col.type === 'number'
                          ? 'bg-blue-100 text-blue-700'
                          : col.type === 'date'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {col.name.substring(0, 10)}
                    </span>
                  ))}
                  {dataset.columns.length > 2 && (
                    <span className="text-xs px-2 py-1 text-gray-500">
                      +{dataset.columns.length - 2}
                    </span>
                  )}
                </div>
              </div>
              {selectedDataset === dataset.id && (
                <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
