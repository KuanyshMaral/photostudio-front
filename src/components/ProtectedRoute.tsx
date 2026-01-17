import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
<<<<<<< HEAD
    children: React.ReactNode;
    requiredRole?: 'admin' | 'user' | 'owner'; // Add roles as needed
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { token, user } = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
=======
  children: React.ReactNode;
  requiredRole?: 'client' | 'studio_owner' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410

    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to dashboard or home if role doesn't match
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;