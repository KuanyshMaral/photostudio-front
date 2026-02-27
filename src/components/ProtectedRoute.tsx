import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'studio_owner' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { token, user } = useAuth();
  
  console.log('ProtectedRoute - token:', !!token, 'user:', user, 'requiredRole:', requiredRole);

  if (!token) {
    console.log('No token, redirecting to /');
    return <Navigate to="/" replace />;
  }

  if (requiredRole && (!user || user.role !== requiredRole)) {
    console.log('Role mismatch, redirecting to appropriate login');
    // If admin access required, redirect to admin login
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    // For other roles, redirect to regular login
    return <Navigate to="/login" replace />;
  }

  console.log('Access granted, rendering children');
  return <>{children}</>;
}