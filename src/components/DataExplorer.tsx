import { Dataset } from '../types/dashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useState } from 'react';

interface DataExplorerProps {
  dataset: Dataset;
}

export const DataExplorer = ({ dataset }: DataExplorerProps) => {
  const [viewType, setViewType] = useState<'stats' | 'table'>('stats');

  const numericColumns = dataset.columns.filter(col => col.type === 'number');
  const stringColumns = dataset.columns.filter(col => col.type === 'string');

  const calculateStats = (column: any) => {
    const values = column.values.filter((v: any) => v !== null && v !== undefined && !isNaN(Number(v)));
    if (values.length === 0) return null;

    const sorted = values.sort((a: any, b: any) => a - b);
    const sum = values.reduce((a: any, b: any) => a + Number(b), 0);
    const avg = sum / values.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    return { sum, avg, min, max, median, count: values.length };
  };

  const getPreviewData = () => {
    const groupedData: any = {};
    if (stringColumns.length > 0 && numericColumns.length > 0) {
      const categoryCol = stringColumns[0];
      const valueCol = numericColumns[0];

      dataset.rows.forEach(row => {
        const key = row[categoryCol.name];
        const value = Number(row[valueCol.name]) || 0;
        if (!groupedData[key]) groupedData[key] = 0;
        groupedData[key] += value;
      });

      return Object.entries(groupedData).map(([key, value]) => ({
        name: String(key),
        value: Number(value)
      }));
    }
    return [];
  };

  const previewData = getPreviewData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {numericColumns.map(col => {
          const stats = calculateStats(col);
          if (!stats) return null;

          return (
            <div key={col.name} className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">{col.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Sum</span>
                  <span className="text-sm font-bold text-blue-600">
                    {stats.sum.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Average</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats.avg.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Min</span>
                  <span className="text-sm text-gray-700">
                    {stats.min.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Max</span>
                  <span className="text-sm text-gray-700">
                    {stats.max.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-xs text-gray-500">Count</span>
                  <span className="text-sm font-semibold">{stats.count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {previewData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Data Preview</h3>
          <p className="text-sm text-gray-500 mt-1">{dataset.rows.length} total rows</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {dataset.columns.map(col => (
                  <th
                    key={col.name}
                    className="px-6 py-3 text-left font-semibold text-gray-900"
                  >
                    <div className="flex items-center gap-2">
                      {col.name}
                      <span className={`text-xs px-2 py-1 rounded ${
                        col.type === 'number'
                          ? 'bg-blue-100 text-blue-700'
                          : col.type === 'date'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {col.type}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataset.rows.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  {dataset.columns.map(col => (
                    <td key={col.name} className="px-6 py-4 text-gray-700">
                      {String(row[col.name] || '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
