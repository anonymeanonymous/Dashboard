import { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { DashboardsListPage } from './pages/DashboardsListPage';
import { DashboardCreatePage } from './pages/DashboardCreatePage';
import { Auth } from './components/Auth';
import { Dataset } from './types/dashboard';
import { supabase } from './utils/supabase';
import { dashboardService } from './utils/dashboardService';

type PageType = 'home' | 'dashboard' | 'dashboards' | 'create-dashboard' | 'edit-dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<unknown>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleDataLoaded = (newDatasets: Dataset[]) => {
    setDatasets(newDatasets);
    setFileName(newDatasets[0]?.sheetName || 'Data');
    setCurrentPage('dashboard');
  };

  const handleBackHome = () => {
    setCurrentPage('home');
    setDatasets([]);
    setFileName('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    handleBackHome();
  };

  const handleSelectDashboard = async (dashboardId: string) => {
    try {
      const dashboard = await dashboardService.getDashboard(dashboardId);
      setDashboardData(dashboard);
      setSelectedDashboardId(dashboardId);
      setCurrentPage('edit-dashboard');
    } catch (error) {
      console.error('Error loading dashboard:', error);
      alert('Failed to load dashboard');
    }
  };

  const handleDashboardCreated = async (dashboardId: string) => {
    const dashboard = await dashboardService.getDashboard(dashboardId);
    setDashboardData(dashboard);
    setSelectedDashboardId(dashboardId);
    setCurrentPage('edit-dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <MainLayout
      currentPage={currentPage === 'home' ? 'home' : 'dashboard'}
      onPageChange={(page) => {
        if (page === 'home') {
          handleBackHome();
        } else {
          setCurrentPage('dashboards');
        }
      }}
      fileName={fileName}
      onLogout={handleLogout}
    >
      {currentPage === 'home' && (
        <HomePage onDataLoaded={handleDataLoaded} />
      )}
      {currentPage === 'dashboard' && (
        <DashboardPage datasets={datasets} onBack={handleBackHome} />
      )}
      {currentPage === 'dashboards' && (
        <DashboardsListPage
          onSelectDashboard={handleSelectDashboard}
          onNewDashboard={() => setCurrentPage('create-dashboard')}
        />
      )}
      {currentPage === 'create-dashboard' && (
        <DashboardCreatePage
          onBack={() => setCurrentPage('dashboards')}
          onDashboardCreated={handleDashboardCreated}
        />
      )}
      {currentPage === 'edit-dashboard' && dashboardData && (
        <DashboardPage
          datasets={datasets}
          onBack={() => setCurrentPage('dashboards')}
          dashboardId={selectedDashboardId}
          dashboardData={dashboardData as any}
        />
      )}
    </MainLayout>
  );
}

export default App;
