import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, isLoading, getUserRole } = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  
  // Fetch user role if required
  useEffect(() => {
    const checkRole = async () => {
      if (user && requiredRole) {
        const role = await getUserRole();
        setUserRole(role);
      }
      setCheckingRole(false);
    };
    
    if (!isLoading) {
      checkRole();
    }
  }, [user, requiredRole, getUserRole, isLoading]);
  
  // Show loading state while checking authentication or role
  if (isLoading || (requiredRole && checkingRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sifnos-turquoise"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login with return URL
  if (!user) {
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/signin?redirect=${encodeURIComponent(redirectPath)}`} state={{ from: location }} replace />;
  }
  
  // If a specific role is required, check if user has that role
  if (requiredRole && userRole !== requiredRole) {
    // Check if they're an admin (admins can access everything)
    if (userRole !== 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. This area is restricted to {requiredRole}s only.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-sifnos-deep-blue text-white px-6 py-2 rounded-md hover:bg-sifnos-deep-blue/90"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }
  
  // If user is authenticated and has the required role (or role check not required), render the children
  return <>{children}</>;
}