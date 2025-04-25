import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Trademark from "./pages/Trademark";
import PrivateRoute from "./components/PrivateRoute";
import PatentWizard from "./components/wizard/patent/PatentWizard";
import DocumentsPage from "./pages/DocumentsPage";
import UploadsPage from "./pages/UploadsPage";
import CompliancePage from "./pages/CompliancePage";
import FilingPage from "./pages/FilingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trademark"
                element={
                  <PrivateRoute>
                    <Trademark />
                  </PrivateRoute>
                }
              />
              {/* Patent Filing Routes */}
              <Route
                path="/patent"
                element={
                  <PrivateRoute>
                    <Navigate to="/patent/wizard" replace />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patent/wizard"
                element={
                  <PrivateRoute>
                    <PatentWizard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patent/documents"
                element={
                  <PrivateRoute>
                    <DocumentsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patent/uploads"
                element={
                  <PrivateRoute>
                    <UploadsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patent/compliance"
                element={
                  <PrivateRoute>
                    <CompliancePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patent/filing"
                element={
                  <PrivateRoute>
                    <FilingPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
