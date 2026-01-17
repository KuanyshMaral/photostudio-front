import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
<<<<<<< HEAD
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
=======

// Auth components (from Amir & Yerkanat projects)
import LoginForm from "./features/auth/LoginForm.tsx";
import RegisterForm from "./features/auth/RegisterForm.tsx";
import StudioRegistrationForm from "./features/auth/StudioRegistrationForm.tsx";
import ProfilePage from "./features/auth/ProfilePage.tsx";
import Dashboard from "./features/auth/Dashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthLanding } from "./features/auth/pages/AuthLanding.tsx";
import Layout from "./components/Layout.tsx";

// Booking components (from Kiryu project)
import BookingForm from "./features/booking/BookingForm.tsx";
import AvailabilityCalendarPage from "./features/booking/AvailabilityCalendarPage.tsx";
import MyBookings from "./features/booking/MyBookings.tsx";

// Reviews components
import MyReviewsPage from "./features/reviews/MyReviewsPage.tsx";
import WriteReviewPage from "./features/reviews/WriteReviewPage.tsx";

// Studio catalog components
import StudioCatalog from "./features/catalog/StudioCatalogClean.tsx";
import StudioDetail from "./features/catalog/StudioDetailClean.tsx";

// Admin components
import AdminDashboard from "./features/admin/AdminDashboard";
import UserManagement from "./features/admin/UserManagement";
import StudioManagement from "./features/admin/StudioManagement";
import Analytics from "./features/admin/Analytics";

// Owner components
import OwnerDashboard from "./features/owner/OwnerDashboard";

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        className: '',
        style: {
          background: '#363636',
          color: '#fff',
        },
      }} />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AuthLanding />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/studio-register" element={<StudioRegistrationForm />} />
          
          {/* Studio catalog (protected with layout) */}
          <Route path="/studios" element={
            <ProtectedRoute>
              <Layout>
                <StudioCatalog />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/studios/:id" element={
            <ProtectedRoute>
              <Layout>
                <StudioDetail />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8">
                  <ProfilePage />
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Booking system (protected) */}
          <Route path="/booking" element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8">
                  <BookingForm />
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/availability/:roomId" element={
            <ProtectedRoute>
              <Layout>
                <AvailabilityCalendarPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/availability" element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Доступность студии</h2>
                  <p className="text-gray-600">Выберите студию для просмотра доступности</p>
                  <div className="mt-8">
                    <Link to="/studios" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                      Перейти к списку студий
                    </Link>
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8">
                  <MyBookings />
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/reviews" element={
            <ProtectedRoute>
              <Layout>
                <MyReviewsPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/write-review" element={
            <ProtectedRoute>
              <Layout>
                <WriteReviewPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole={'admin'}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole={'admin'}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/studios" element={
            <ProtectedRoute requiredRole="admin">
              <StudioManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="admin">
              <Analytics />
            </ProtectedRoute>
          } />
          
          {/* Owner routes */}
          <Route path="/owner" element={
            <ProtectedRoute requiredRole={'studio_owner'}>
              <Layout>
                <OwnerDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/studio-management" element={
            <ProtectedRoute requiredRole={'studio_owner'}>
              <Layout>
                <OwnerDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/studio-bookings" element={
            <ProtectedRoute requiredRole={'studio_owner'}>
              <Layout>
                <OwnerDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* 404 fallback */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <Link 
                  to="/studios" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Go to Studios
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
