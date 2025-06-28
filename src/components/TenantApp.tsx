
import { Routes, Route, Navigate } from "react-router-dom";
import { TenantProvider } from "@/contexts/TenantContext";
import TenantSidebar from "./TenantSidebar";
import DashboardPage from "./DashboardPage";
import PropertiesPage from "./PropertiesPage";
import BookingsPage from "./BookingsPage";
import InventoryPage from "./InventoryPage";
import DamageReportsPage from "./DamageReportsPage";
import IntegrationsPage from "./IntegrationsPage";
import TasksPage from "./TasksPage";
import SettingsPage from "./SettingsPage";
import LoadingScreen from "./LoadingScreen";
import { useTenant } from "@/contexts/TenantContext";

const TenantAppContent = () => {
  const { loading: tenantLoading } = useTenant();

  if (tenantLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <TenantSidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/damage-reports" element={<DamageReportsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

const TenantApp = () => {
  return (
    <TenantProvider>
      <TenantAppContent />
    </TenantProvider>
  );
};

export default TenantApp;
