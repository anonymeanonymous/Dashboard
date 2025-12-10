import { Upload, Zap, BarChart3, Layers, Download, Sparkles } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { Dataset } from '../types/dashboard';

interface HomePageProps {
  onDataLoaded: (datasets: Dataset[]) => void;
}

export const HomePage = ({ onDataLoaded }: HomePageProps) => {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Transform Your Data into Beautiful Dashboards
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your Excel files and instantly create interactive visualizations powered by AI. No coding required.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Excel File</h3>
            <p className="text-gray-600 text-sm">Supports .xlsx and .xls formats</p>
          </div>
          <FileUpload onDataLoaded={onDataLoaded} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Instant Analysis</h3>
            </div>
            <p className="text-gray-600 text-sm">
              AI automatically analyzes your data and suggests the best visualizations
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Layers className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Full Customization</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Choose from 6+ chart types and customize every detail to match your needs
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Easy Export</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Export your dashboards as PDF or PNG for presentations and reports
            </p>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <div className="flex items-start gap-6">
            <Sparkles className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-2">AI-Powered Insights</h3>
              <p className="text-blue-100">
                Our intelligent engine analyzes your data structure and recommends optimal visualizations, including bar charts, line graphs, pie charts, and more. Perfect for data analysts and business professionals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
