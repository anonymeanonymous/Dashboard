import { useState } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { Dataset } from '../types/dashboard';

interface ManualDataEntryProps {
  onDataLoaded: (datasets: Dataset[]) => void;
  onCancel: () => void;
}

export const ManualDataEntry = ({ onDataLoaded, onCancel }: ManualDataEntryProps) => {
  const [columns, setColumns] = useState<string[]>(['Category', 'Value']);
  const [rows, setRows] = useState<Record<string, any>[]>([
    { Category: '', Value: 0 },
    { Category: '', Value: 0 },
  ]);
  const [newColName, setNewColName] = useState('');
  const [colType, setColType] = useState<'string' | 'number'>('string');

  const addColumn = () => {
    if (newColName.trim()) {
      setColumns([...columns, newColName]);
      setRows(rows.map(row => ({ ...row, [newColName]: colType === 'number' ? 0 : '' })));
      setNewColName('');
      setColType('string');
    }
  };

  const removeColumn = (colName: string) => {
    if (columns.length > 1) {
      setColumns(columns.filter(c => c !== colName));
      setRows(rows.map(row => {
        const newRow = { ...row };
        delete newRow[colName];
        return newRow;
      }));
    }
  };

  const addRow = () => {
    const newRow: Record<string, any> = {};
    columns.forEach(col => {
      newRow[col] = col === 'Value' ? 0 : '';
    });
    setRows([...rows, newRow]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const updateCell = (rowIndex: number, colName: string, value: any) => {
    const newRows = [...rows];
    newRows[rowIndex][colName] = value;
    setRows(newRows);
  };

  const handleConfirm = () => {
    if (rows.some(row => !Object.values(row).some(v => v !== '' && v !== 0))) {
      alert('Please fill in all data cells');
      return;
    }

    const dataset: Dataset = {
      id: `manual-${Date.now()}`,
      name: 'Manual Data',
      columns: columns.map(col => ({
        name: col,
        type: col === 'Value' ? 'number' : 'string',
        values: rows.map(r => r[col] ?? (col === 'Value' ? 0 : '')),
      })),
      rows: rows.map(row => {
        const newRow: Record<string, any> = {};
        columns.forEach(col => {
          newRow[col] = col === 'Value' ? Number(row[col]) || 0 : row[col];
        });
        return newRow;
      }),
    };

    onDataLoaded([dataset]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 text-white">
        <h3 className="text-2xl font-bold">Enter Data Manually</h3>
        <p className="text-green-100 mt-1">Create custom columns and fill in your data</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Column Management */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Manage Columns</h4>
          <div className="space-y-3 mb-4">
            <div className="flex flex-wrap gap-2">
              {columns.map(col => (
                <div
                  key={col}
                  className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                >
                  <span className="text-sm font-medium text-blue-900">{col}</span>
                  <button
                    onClick={() => removeColumn(col)}
                    disabled={columns.length === 1}
                    className="text-blue-600 hover:text-blue-800 disabled:text-gray-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              placeholder="Column name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addColumn()}
            />
            <select
              value={colType}
              onChange={(e) => setColType(e.target.value as 'string' | 'number')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="string">Text</option>
              <option value="number">Number</option>
            </select>
            <button
              onClick={addColumn}
              disabled={!newColName.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Rows</h4>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 w-12">
                    #
                  </th>
                  {columns.map(col => (
                    <th key={col} className="px-4 py-3 text-left font-semibold text-gray-900 min-w-[150px]">
                      {col}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-semibold text-gray-900 w-12">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 font-medium">{rowIdx + 1}</td>
                    {columns.map(col => (
                      <td key={`${rowIdx}-${col}`} className="px-4 py-3">
                        <input
                          type={col === 'Value' ? 'number' : 'text'}
                          value={row[col] ?? ''}
                          onChange={(e) =>
                            updateCell(
                              rowIdx,
                              col,
                              col === 'Value' ? Number(e.target.value) || 0 : e.target.value
                            )
                          }
                          placeholder={col === 'Value' ? '0' : 'Enter value'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeRow(rowIdx)}
                        disabled={rows.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addRow}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm & Import
          </button>
        </div>
      </div>
    </div>
  );
};
