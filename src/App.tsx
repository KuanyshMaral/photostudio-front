import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";
import StudioRegistrationForm from "./features/auth/StudioRegistrationForm";
import ProfilePage from "./features/auth/ProfilePage";
import Dashboard from "./features/auth/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { StudioDetail } from "./features/catalog/pages/StudioDetail";
import { AdminDashboard } from "./features/admin/AdminDashboard";
import { AuthProvider } from './context/AuthContext';
import MyStudios from './features/owner/MyStudios';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/studio-register" element={<StudioRegistrationForm />} />

            

            {/* Protected routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

<Route
  path="/owner/studios"
  element={
    <ProtectedRoute>
      <MyStudios />
    </ProtectedRoute>
  }
/>
            <Route path="/studios/:id" element={
              <ProtectedRoute>
                 <StudioDetail />
              </ProtectedRoute>
            } />
            
            {/* Admin Route */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;