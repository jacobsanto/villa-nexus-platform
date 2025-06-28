
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import LoginPage from "@/components/LoginPage";
import SignUpPage from "@/components/SignUpPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import AppLayout from "@/components/AppLayout";
import DashboardPage from "@/components/DashboardPage";
import PropertiesPage from "@/components/PropertiesPage";
import BookingsPage from "@/components/BookingsPage";
import InventoryPage from "@/components/InventoryPage";
import DamageReportsPage from "@/components/DamageReportsPage";
import IntegrationsPage from "@/components/IntegrationsPage";
import TasksPage from "@/components/TasksPage";
import SettingsPage from "@/components/SettingsPage";
import SuperAdminDashboard from "@/components/SuperAdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <TenantProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                {/* Default redirect to dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                
                {/* Tenant Routes */}
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="properties" element={<PropertiesPage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="damage-reports" element={<DamageReportsPage />} />
                <Route path="integrations" element={<IntegrationsPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* Super Admin Route */}
                <Route path="super-admin" element={
                  <SuperAdminRoute>
                    <SuperAdminDashboard />
                  </SuperAdminRoute>
                } />
              </Route>
            </Routes>
          </TenantProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
