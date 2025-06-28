
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import LoginPage from "@/components/LoginPage";
import SignUpPage from "@/components/SignUpPage";
import SuperAdminLoginPage from "@/components/SuperAdminLoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import TenantApp from "@/components/TenantApp";
import SuperAdminApp from "@/components/SuperAdminApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Tenant Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Authenticated Tenant App */}
            <Route path="/dashboard/*" element={
              <ProtectedRoute role="admin" or_role="member">
                <TenantApp />
              </ProtectedRoute>
            } />
            <Route path="/properties/*" element={
              <ProtectedRoute role="admin" or_role="member">
                <TenantApp />
              </ProtectedRoute>
            } />
            <Route path="/bookings/*" element={
              <ProtectedRoute role="admin" or_role="member">
                <TenantApp />
              </ProtectedRoute>
            } />
            <Route path="/inventory/*" element={
              <ProtectedRoute role="admin" or_role="member">
                <TenantApp />
              </ProtectedRoute>
            } />
            <Route path="/damage-reports/*" element={
              <ProtectedRoute role="admin" or_role="member">
                <TenantApp />
              </ProtectedRoute>
            } />
            <Route path="/integrations/*" element={
              <ProtectedRoute role="admin" or_role="member">
                <TenantApp />
              </ProtectedRoute>
            } />
            <Route path="/tasks/*" element={
              <ProtectedRoute role="admin" or_role="member">
                <TenantApp />
              </ProtectedRoute>
            } />
            <Route path="/team-chat/*" element={
              <ProtectedRoute role="admin" or_role="member">
                <TenantApp />
              </ProtectedRoute>
            } />
            <Route path="/settings/*" element={
              <ProtectedRoute role="admin">
                <TenantApp />
              </ProtectedRoute>
            } />

            {/* Super Admin World */}
            <Route path="/admin" element={<SuperAdminLoginPage />} />
            <Route path="/super-admin/*" element={
              <ProtectedRoute role="super_admin">
                <SuperAdminApp />
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
