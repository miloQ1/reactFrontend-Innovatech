import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/shared/ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ClientsPage } from '../pages/ClientsPage';
import { CreateClientPage } from '../pages/CreateClientPage';
import { ClientDetailPage } from '../pages/ClientDetailPage';
import { CreateProjectPage } from '../pages/CreateProjectPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { MyProjectsPage} from  '../pages/MyProjectsPage';


export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Clients */}
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/create" element={<CreateClientPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />

          {/* Projects */}
          <Route path="/clients/:clientId/projects/create" element={<CreateProjectPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects" element={<MyProjectsPage />} />

        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}