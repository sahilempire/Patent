import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800">PatentFlow</div>
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Patent Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            PatentFlow helps you manage your patent portfolio, track deadlines, and
            ensure compliance with ease. Join thousands of IP professionals who
            trust our platform.
          </p>
          {!isAuthenticated && (
            <Link to="/signup">
              <Button size="lg" className="text-lg">
                Start Free Trial
              </Button>
            </Link>
          )}
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Document Management</h3>
            <p className="text-gray-600">
              Organize and access your patent documents in one secure location.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Deadline Tracking</h3>
            <p className="text-gray-600">
              Never miss an important filing deadline with our automated reminders.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Compliance Tools</h3>
            <p className="text-gray-600">
              Stay compliant with patent office requirements and regulations.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© 2024 PatentFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 