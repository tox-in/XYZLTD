import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import Profile from './pages/profile/Profile';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AttendantDashboard from './pages/dashboard/AttendantDashboard';
import ParkingManagement from './pages/parking/ParkingManagement';
import CarEntryManagement from './pages/car-entries/CarEntryManagement';
import Reports from './pages/reports/Reports';

// Protected Components
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/404" element={<NotFound />} />

            {/* Protected Routes */}
            <Route element={<DashboardLayout />}>
              {/* Common Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'ATTENDANT']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/parkings"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ParkingManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/car-entries"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CarEntryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              {/* Attendant Routes */}
              <Route
                path="/attendant/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ATTENDANT']}>
                    <AttendantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendant/car-entries"
                element={
                  <ProtectedRoute allowedRoles={['ATTENDANT']}>
                    <CarEntryManagement />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 