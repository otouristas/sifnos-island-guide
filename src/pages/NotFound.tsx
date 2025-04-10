
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="font-montserrat text-6xl font-bold mb-4 text-sifnos-deep-blue">404</h1>
        <p className="text-2xl font-montserrat text-gray-700 mb-6">Page not found</p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link to="/" className="bg-sifnos-turquoise hover:bg-sifnos-deep-blue text-white px-6 py-3 rounded-lg transition-colors duration-300 font-medium">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
