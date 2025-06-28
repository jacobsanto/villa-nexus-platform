
import { useState } from "react";
import TenantSidebar from "./TenantSidebar";
import DashboardPage from "./DashboardPage";
import PropertiesPage from "./PropertiesPage";
import TasksPage from "./TasksPage";
import SettingsPage from "./SettingsPage";

const TenantDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'properties':
        return <PropertiesPage />;
      case 'tasks':
        return <TasksPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <TenantSidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-auto">
        {renderActivePage()}
      </main>
    </div>
  );
};

export default TenantDashboard;
