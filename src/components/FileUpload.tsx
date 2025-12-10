import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { Dataset } from '../types/dashboard';
import { useState } from 'react';

interface FileUploadProps {
  onDataLoaded: (datasets: Dataset[]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const datasets = await parseExcelFile(file);
      if (datasets.length === 0) {
        setError('No data found in the Excel file');
        return;
      }
      onDataLoaded(datasets);
    } catch (err) {
      setError('Error parsing Excel file. Please ensure the file is valid.');
      console.error(err);
    } finally {
      setLoading(false);
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
            <p className="text-sm text-gray-600 mt-2">Analyzing data...</p>
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
              Supports .xlsx and .xls files • Max 50 MB
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
