import { X, Plus } from 'lucide-react';
import { Dataset, Filter } from '../types/dashboard';
import { useState } from 'react';

interface DataFilterProps {
  dataset: Dataset;
  filters: Filter[];
  onFiltersChange: (filters: Filter[]) => void;
}

export const DataFilter = ({ dataset, filters, onFiltersChange }: DataFilterProps) => {
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<Filter>>({});

  const handleAddFilter = () => {
    if (newFilter.column && newFilter.operator && newFilter.value !== undefined) {
      onFiltersChange([...filters, newFilter as Filter]);
      setNewFilter({});
      setShowAddFilter(false);
    }
  };

  const handleRemoveFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  const handleUpdateFilter = (index: number, key: keyof Filter, value: any) => {
    const updated = [...filters];
    updated[index] = { ...updated[index], [key]: value };
    onFiltersChange(updated);
  };

  const getUniqueValues = (columnName: string) => {
    const column = dataset.columns.find(c => c.name === columnName);
    if (!column) return [];
    return Array.from(new Set(column.values)).slice(0, 50);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setShowAddFilter(!showAddFilter)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {filters.length > 0 && (
        <div className="space-y-2 mb-4">
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <select
                value={filter.column}
                onChange={(e) => handleUpdateFilter(index, 'column', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column</option>
                {dataset.columns.map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>

              <select
                value={filter.operator}
                onChange={(e) => handleUpdateFilter(index, 'operator', e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="greater">Greater</option>
                <option value="less">Less</option>
                <option value="between">Between</option>
              </select>

              {filter.operator === 'between' ? (
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="From"
                    value={filter.value?.[0] || ''}
                    onChange={(e) => handleUpdateFilter(index, 'value', [e.target.value, filter.value?.[1] || ''])}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="To"
                    value={filter.value?.[1] || ''}
                    onChange={(e) => handleUpdateFilter(index, 'value', [filter.value?.[0] || '', e.target.value])}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Value"
                  value={filter.value || ''}
                  onChange={(e) => handleUpdateFilter(index, 'value', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              <button
                onClick={() => handleRemoveFilter(index)}
                className="p-1 hover:bg-red-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddFilter && (
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <select
            value={newFilter.column || ''}
            onChange={(e) => setNewFilter({ ...newFilter, column: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select column</option>
            {dataset.columns.map(col => (
              <option key={col.name} value={col.name}>{col.name}</option>
            ))}
          </select>

          <select
            value={newFilter.operator || ''}
            onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value as any })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select operator</option>
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
            <option value="greater">Greater Than</option>
            <option value="less">Less Than</option>
            <option value="between">Between</option>
          </select>

          {newFilter.operator === 'between' ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="From"
                onChange={(e) => setNewFilter({ ...newFilter, value: [e.target.value, newFilter.value?.[1] || ''] })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="To"
                onChange={(e) => setNewFilter({ ...newFilter, value: [newFilter.value?.[0] || '', e.target.value] })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder="Enter value"
              onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAddFilter}
              className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Add Filter
            </button>
            <button
              onClick={() => setShowAddFilter(false)}
              className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {filters.length === 0 && !showAddFilter && (
        <p className="text-sm text-gray-500">No filters applied. Add one to narrow down your data.</p>
      )}
    </div>
  );
};
