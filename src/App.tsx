import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth components (from Amir & Yerkanat projects)
import LoginForm from "./features/auth/LoginForm.tsx";
import RegisterForm from "./features/auth/RegisterForm.tsx";
import StudioRegistrationForm from "./features/auth/StudioRegistrationForm.tsx";
import ProfilePage from "./features/auth/ProfilePage.tsx";
import Dashboard from "./features/auth/Dashboard.tsx";
import ProfileDashboard from "./features/auth/ProfileDashboard";
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

// Studio catalog components (from Amir project)
import StudioCatalog from "./features/catalog/StudioCatalog.tsx";
import { StudioDetail } from "./features/catalog/pages/StudioDetail.tsx";

// Admin components (Updated)
import { AdminLayout } from "./features/admin/AdminLayout";
import { AdminDashboard } from "./features/admin/AdminDashboard";
import { PlatformAnalytics } from "./features/admin/PlatformAnalytics";
import { AdManager } from "./features/admin/AdManager";
import { ReviewModerator } from "./features/admin/ReviewModerator";
import { StudioVIPManager } from "./features/admin/StudioVIPManager";
// Keeping existing management components
import UserManagement from "./features/admin/UserManagement";
import StudioManagement from "./features/admin/StudioManagement";
<<<<<<< HEAD
=======
import Analytics from "./features/admin/Analytics";
import { AdminLayout } from './features/admin/AdminLayout';
import { AdminDashboard as NewAdminDashboard } from './features/admin/AdminDashboard';
import { PlatformAnalytics } from './features/admin/PlatformAnalytics';
import { AdManager } from './features/admin/AdManager';
import { ReviewModerator } from './features/admin/ReviewModerator';
import { StudioVIPManager } from './features/admin/StudioVIPManager';
>>>>>>> e5f455b231255c8509021dc9ed0381e12b32b4fb

// Owner components
import OwnerDashboard from "./features/owner/OwnerDashboard";

// Manager components
import { ManagerCalendar } from "./features/manager/ManagerCalendar";
import { ClientsPage } from "./features/manager/ClientsPage";

// Chat components
import ChatPage from "./features/chat/ChatPage";

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
          
          {/* Studio catalog (main page for authenticated users) */}
          <Route path="/studios" element={
            <ProtectedRoute>
              <Layout>
                <StudioCatalog />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Dashboard redirects */}
          <Route path="/dashboard" element={<Navigate to="/studios" replace />} />
          <Route path="/studios/:id" element={
            <ProtectedRoute>
              <Layout>
                <StudioDetail />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Protected routes */}
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <ProfileDashboard />
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
          
          {/* Admin routes (Updated Structure) */}
          <Route path="/admin" element={
<<<<<<< HEAD
=======
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<NewAdminDashboard />} />
            <Route path="analytics" element={<PlatformAnalytics />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="studios" element={<StudioManagement />} />
            <Route path="ads" element={<AdManager />} />
            <Route path="reviews" element={<ReviewModerator />} />
            <Route path="studios/vip" element={<StudioVIPManager />} />
          </Route>
          
<<<<<<< HEAD
          <Route path="/admin/users" element={
>>>>>>> e5f455b231255c8509021dc9ed0381e12b32b4fb
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
<<<<<<< HEAD
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="studios" element={<StudioManagement />} />
            <Route path="analytics" element={<PlatformAnalytics />} />
            <Route path="ads" element={<AdManager />} />
            <Route path="reviews" element={<ReviewModerator />} />
            <Route path="studios/vip" element={<StudioVIPManager />} />
            {/* Fallback for admin settings or unknown admin routes */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
=======
          } />
          
          <Route path="/admin/studios" element={
            <ProtectedRoute requiredRole="admin">
              <StudioManagement />
            </ProtectedRoute>
          } />
>>>>>>> e5f455b231255c8509021dc9ed0381e12b32b4fb
          
=======
>>>>>>> 31a33c48372292d27f8ad2d88891f98f8e610d17
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
          
          {/* Manager routes */}
          <Route path="/manager/bookings" element={
            <ProtectedRoute requiredRole={'studio_owner'}>
              <Layout>
                <ManagerCalendar />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/manager/clients" element={
            <ProtectedRoute requiredRole={'studio_owner'}>
              <Layout>
                <ClientsPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Chat routes */}
          <Route path="/messages" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          
          <Route path="/messages/:conversationId" element={
            <ProtectedRoute>
              <ChatPage />
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