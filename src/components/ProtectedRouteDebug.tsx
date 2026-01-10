import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'studio_owner' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { token, user } = useAuth();

  console.log('ProtectedRoute DEBUG:', { 
    token: !!token, 
    user, 
    requiredRole, 
    userRole: user?.role,
    localStorageUser: token ? JSON.parse(localStorage.getItem('user') || 'null') : 'no token'
  });

  if (!token) {
    console.log('No token - redirecting to /');
    return <Navigate to="/" replace />;
  }

  if (requiredRole && (!user || user.role !== requiredRole)) {
    console.log('Role check failed:', { userRole: user?.role, requiredRole });
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
