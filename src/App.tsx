import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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
import AvailabilityCalendar from "./features/booking/AvailabilityCalendar.tsx";
import MyBookings from "./features/booking/MyBookings.tsx";
import ReviewForm from "./features/booking/ReviewForm.tsx";
import ReviewList from "./features/booking/ReviewList.tsx";

// Studio catalog components (from Amir project)
import StudioCatalog from "./features/catalog/StudioCatalog.tsx";
import { StudioDetail } from "./features/catalog/pages/StudioDetail.tsx";

// Admin components
import AdminDashboard from "./features/admin/AdminDashboard";
import UserManagement from "./features/admin/UserManagement";
import StudioManagement from "./features/admin/StudioManagement";
import Analytics from "./features/admin/Analytics";

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
          
          {/* Studio catalog (public) */}
          <Route path="/studios" element={<StudioCatalog />} />
          <Route path="/studios/:id" element={
            <ProtectedRoute>
              <StudioDetail />
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
          
          <Route path="/availability" element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8">
                  <AvailabilityCalendar roomId="demo-room" selectedDate={new Date()} />
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
          
          <Route path="/write-review" element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8">
                  <ReviewForm />
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/reviews" element={
            <ProtectedRoute>
              <Layout>
                <div className="p-8">
                  <ReviewList />
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin routes - specific routes first */}
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
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
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
