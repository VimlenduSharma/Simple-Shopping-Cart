import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md mx-auto px-4">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-[120px] font-bold text-gray-200 leading-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-lg text-gray-600">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Need help? Here are some popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800 hover:underline">
              Shop
            </Link>
            <Link to="/cart" className="text-blue-600 hover:text-blue-800 hover:underline">
              Cart
            </Link>
            <Link to="/profile" className="text-blue-600 hover:text-blue-800 hover:underline">
              Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
