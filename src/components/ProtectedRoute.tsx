import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    // Save the location they were trying to access for redirecting after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // If a specific role is required, check if user has that role
  // This would require role information to be stored in the user object or profile
  // For now, we'll just check if the user is authenticated
  if (requiredRole) {
    // In a real implementation, you would check if the user has the required role
    // For example: if (!user.roles.includes(requiredRole))
    
    // For now, we'll just allow all authenticated users
    // In a real implementation, you would redirect unauthorized users
    // return <Navigate to="/unauthorized" replace />;
  }
  
  // If user is authenticated and has the required role, render the children
  return <>{children}</>;
}