import { BarChart3, Settings, Home } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'dashboard';
  onPageChange: (page: 'home' | 'dashboard') => void;
  fileName?: string;
}

export const MainLayout = ({ children, currentPage, onPageChange, fileName }: MainLayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DataViz Pro</h1>
              <p className="text-xs text-gray-500">Professional BI Dashboard Builder</p>
            </div>
          </div>

          {fileName && currentPage === 'dashboard' && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Current file:</p>
              <p className="text-sm font-semibold text-gray-900">{fileName}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => onPageChange('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'home'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Etat 0</span>
            </button>

            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
