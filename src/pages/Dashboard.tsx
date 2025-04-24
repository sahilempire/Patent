import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">IntelliFile</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "calendar" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("calendar")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>

          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === "overview" && (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to IntelliFile
              </h1>
              <p className="text-xl text-gray-600">
                Your AI-powered assistant for intellectual property filings
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Patent Filing Section */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Patent Filing
                </h2>
                <p className="text-gray-600 mb-6">
                  Protect your inventions, processes, or unique technological solutions
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2">•</span> Utility Patents
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2">•</span> Design Patents
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2">•</span> Provisional Applications
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2">•</span> International PCT Filings
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/patent")}
                >
                  Start Patent Process
                </Button>
              </div>

              {/* Trademark Filing Section */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Trademark Filing
                </h2>
                <p className="text-gray-600 mb-6">
                  Protect your brand names, logos, slogans, and other business identifiers
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2">•</span> Word Marks
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2">•</span> Logo Marks
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2">•</span> Service Marks
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="mr-2">•</span> International Madrid Protocol
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/trademark")}
                >
                  Start Trademark Process
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calendar</h2>
            <p className="text-gray-600">Your patent-related deadlines and events will be displayed here.</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
            <p className="text-gray-600">Account and application settings will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 