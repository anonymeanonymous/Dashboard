import { Upload, CheckCircle, AlertCircle, Loader, BarChart3, PlusCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { Dataset } from '../types/dashboard';
import { analyzeDataset } from '../utils/dataAnalyzer';
import { useState } from 'react';
import { ManualDataEntry } from './ManualDataEntry';

interface FileUploadProps {
  onDataLoaded: (datasets: Dataset[]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<Dataset | null>(null);
  const [mode, setMode] = useState<'choose' | 'upload' | 'manual'>('choose');

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const datasets = await parseExcelFile(file);
      if (datasets.length === 0) {
        setError('No data found in the Excel file');
        return;
      }

      setPreview(datasets[0]);
    } catch (err) {
      setError('Error parsing Excel file. Please ensure the file is valid.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (preview) {
      onDataLoaded([preview]);
      setPreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  if (mode === 'manual') {
    return (
      <ManualDataEntry
        onDataLoaded={(data) => {
          onDataLoaded(data);
          setMode('choose');
        }}
        onCancel={() => setMode('choose')}
      />
    );
  }

  if (mode === 'choose') {
    return (
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Choose Import Method</h3>
            <p className="text-blue-100">Select how you want to import your data</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setMode('upload')}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <Upload className="w-12 h-12 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Upload Excel File</h4>
                <p className="text-sm text-gray-600 text-center">Import data from .xlsx or .xls files</p>
              </button>

              <button
                onClick={() => setMode('manual')}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-green-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <PlusCircle className="w-12 h-12 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Enter Data Manually</h4>
                <p className="text-sm text-gray-600 text-center">Create custom columns and fill data</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (preview) {
    const analysis = analyzeDataset(preview.columns, preview.rows);
    const numericCols = analysis.filter(col => col.isNumeric);
    const categoricalCols = analysis.filter(col => col.isCategorical);
    const dateCols = analysis.filter(col => col.isDate);

    return (
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Data Analysis Preview</h3>
            </div>
            <p className="text-blue-100">Review the detected column types and suggested visualizations</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Dataset Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-600 uppercase">Total Rows</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{preview.rows.length}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-blue-600 uppercase">Columns</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{preview.columns.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-xs font-semibold text-green-600 uppercase">Numeric</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{numericCols.length}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-xs font-semibold text-purple-600 uppercase">Categorical</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{categoricalCols.length}</p>
              </div>
            </div>

            {/* Column Details */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Column Detection</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {analysis.map(col => {
                  let icon = null;
                  let bgColor = 'bg-gray-50';
                  let borderColor = 'border-gray-200';
                  let badgeColor = 'bg-gray-100 text-gray-800';

                  if (col.isNumeric) {
                    bgColor = 'bg-green-50';
                    borderColor = 'border-green-200';
                    badgeColor = 'bg-green-100 text-green-800';
                  } else if (col.isDate) {
                    bgColor = 'bg-blue-50';
                    borderColor = 'border-blue-200';
                    badgeColor = 'bg-blue-100 text-blue-800';
                  } else if (col.isCategorical) {
                    bgColor = 'bg-purple-50';
                    borderColor = 'border-purple-200';
                    badgeColor = 'bg-purple-100 text-purple-800';
                  }

                  return (
                    <div key={col.name} className={`${bgColor} border ${borderColor} rounded-lg p-3`}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-gray-900 text-sm truncate flex-1">{col.name}</h5>
                        <span className={`${badgeColor} text-xs px-2 py-1 rounded font-medium whitespace-nowrap ml-2`}>
                          {col.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {col.cardinality === 1 ? '1 unique value' : `${col.cardinality} unique values`}
                      </p>
                      {col.isNumeric && (
                        <p className="text-xs text-gray-600 mt-1">
                          Range: {col.minValue?.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} to {col.maxValue?.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                        </p>
                      )}
                      {col.nullCount + col.emptyCount > 0 && (
                        <p className="text-xs text-orange-600 mt-1">
                          {col.nullCount + col.emptyCount} missing values
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Axis Recommendations */}
            {(numericCols.length > 0 || categoricalCols.length > 0 || dateCols.length > 0) && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Chart Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {numericCols.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-green-900 mb-2">Y-Axis (Values)</p>
                      <ul className="space-y-1">
                        {numericCols.slice(0, 3).map(col => (
                          <li key={col.name} className="text-sm text-green-800">• {col.name}</li>
                        ))}
                        {numericCols.length > 3 && <li className="text-xs text-green-700 mt-1">+ {numericCols.length - 3} more</li>}
                      </ul>
                    </div>
                  )}
                  {(dateCols.length > 0 || categoricalCols.length > 0) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-2">X-Axis (Categories/Time)</p>
                      <ul className="space-y-1">
                        {dateCols.slice(0, 2).map(col => (
                          <li key={col.name} className="text-sm text-blue-800">• {col.name} (dates)</li>
                        ))}
                        {categoricalCols.slice(0, 2).map(col => (
                          <li key={col.name} className="text-sm text-blue-800">• {col.name} ({col.cardinality} categories)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setPreview(null);
                  setMode('choose');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Back
              </button>
              <button
                onClick={handleConfirmImport}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Import
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white hover:bg-gray-50'
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader className="w-12 h-12 mb-4 text-blue-500 animate-spin" />
            <p className="text-lg font-semibold text-gray-900">Processing file...</p>
            <p className="text-sm text-gray-600 mt-2">Analyzing columns and data types...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
            <p className="text-lg font-semibold text-gray-900">Upload failed</p>
            <p className="text-sm text-red-600 mt-2 text-center max-w-md">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-16 h-16 mb-4 text-blue-400" />
            <p className="mb-2 text-lg font-semibold text-gray-900">
              Drop your Excel file here
            </p>
            <p className="text-sm text-gray-600">
              or <span className="font-semibold text-blue-600">click to browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Supports .xlsx and .xls files • Detailed analysis on upload
            </p>
          </div>
        )}

        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          disabled={loading}
        />
      </label>
    </div>
  );
};
