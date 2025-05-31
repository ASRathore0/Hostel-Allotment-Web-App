import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toaster';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import ApplicationForm from './pages/student/ApplicationForm';
import RoomAvailability from './pages/student/RoomAvailability';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationsManagement from './pages/admin/ApplicationsManagement';
import RoomsManagement from './pages/admin/RoomsManagement';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<Layout />}>
              {/* Student Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/application" element={<ApplicationForm />} />
                <Route path="/student/rooms" element={<RoomAvailability />} />
              </Route>
              
              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/applications" element={<ApplicationsManagement />} />
                <Route path="/admin/rooms" element={<RoomsManagement />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;