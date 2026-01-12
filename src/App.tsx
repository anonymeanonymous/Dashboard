import { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { DashboardsListPage } from './pages/DashboardsListPage';
import { DashboardCreatePage } from './pages/DashboardCreatePage';
import { Dataset } from './types/dashboard';
import { dashboardService } from './utils/dashboardService';

type PageType = 'home' | 'dashboard' | 'dashboards' | 'create-dashboard' | 'edit-dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<unknown>(null);

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
